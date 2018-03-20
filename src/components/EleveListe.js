import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Style from "../decoration/Style";

import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List";
import TextField from "material-ui/TextField";
import { FormControl, FormGroup } from "material-ui/Form";
import Fuse from "fuse.js";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";
import Grid from "material-ui/Grid";

import { Redirect } from "react-router-dom";
import RapportAdd from "./RapportAdd";

class DeleteDialog extends Component {
  render() {
    return (
      <Dialog
        id={"dialog-delete-" + this.props.eleve.id}
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle>
          {"Supprimer " +
            this.props.eleve.nom +
            " " +
            this.props.eleve.prenom +
            "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Etes vous sûr de vouloir supprimer cette élève de la base de données
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary" autoFocus>
            Annuler
          </Button>
          <Button onClick={this.props.deleteEleve} color="primary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export class EleveItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rapportopen: false,
      deleteopen: false
    };
  }

  /**RAPPORT handlers */
  _rapportOpen = () => {
    //utilise pou affiche la fiche élève
    this.setState({ rapportopen: true });
  };

  _rapportClose = () => {
    this.setState({ rapportopen: false });
  };

  /** DELETE handlers */
  _deleteOpen = () => {
    this.setState({ deleteopen: true });
  };
  _deleteClose = () => {
    this.setState({ deleteopen: false });
  };

  _deleteEleve = e => {
    this.setState({ deleteopen: false });
    this.props.deleteeleve(this.props.eleve); /** > EleveList */
  };
  /**RENDER */
  render() {
    const { eleve, user, firebase } = this.props;
    return (
      <div>
        <ListItem button onClick={this._rapportOpen}>
          <ListItemText primary={eleve.nom + " " + eleve.prenom} />{" "}
          {!!user &&
            user.statut === "admin" && (
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={this._deleteOpen}>
                  <DeleteIcon />
                </IconButton>
                {this.state.deleteopen && (
                  <DeleteDialog
                    open={this.state.deleteopen}
                    eleve={eleve}
                    onClose={this._deleteClose}
                    deleteEleve={this._deleteEleve}
                  />
                )}
              </ListItemSecondaryAction>
            )}
        </ListItem>
        {!!user &&
          (user.statut === "admin" || user.statut === "prof") &&
          this.state.rapportopen && (
            <RapportAdd
              open={this.state.rapportopen}
              firebase={firebase}
              eleve={eleve}
              user={user}
              ajoutrapport={this.props.ajoutrapport}
              onClose={this._rapportClose}
            />
          )}
      </div>
    );
  }
}

class EleveListe extends Component {
  //fuse
  fuseoptions = {
    keys: ["nom", "prenom"],
    id: "id",
    shouldSort: true
  };

  constructor(props) {
    super(props);
    var tempset = new Set();
    props.liste.map(eleve => {
      tempset.add(eleve.id + "");
    });

    this.state = {
      /* moteur de recherche*/
      fuse: new Fuse(this.props.liste, this.fuseoptions),
      /*les ids visibles? dans le constructeur cela correspond à toutes les ids */
      visibleids: tempset,
      /** toutes les ids */
      allids: tempset
    };
  }

  //HANDLERS
  handleChange = event => {
    //utilisé dans la recherche

    var tempset = new Set();
    this.state.fuse.search(event.target.value).map(id => tempset.add(id));

    if (tempset.size === 0) {
      /** la recherche a ramene null, on affiche tout */
      this.setState({ visibleids: this.state.allids });
    } else {
      this.setState({ visibleids: tempset });
    }
  };

  handleDeleteEleve = e => {
    this.props.deleteeleve(e); /** > EleveApp */
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.allids.size !== nextProps.liste.length) {
      /** la liste a changé ! */
      var temp = new Set();
      nextProps.liste.map(eleve => {
        temp.add(eleve.id + "");
      });
      var f = new Fuse(nextProps.liste, this.fuseoptions);
      this.setState({ allids: temp, visibleids: temp, fuse: f });
    }
  }

  //RENDER
  render() {
    const { user, firebase } = this.props;
    return (
      <div>
        <Grid container direction="column" alignItems="stretch">
          {!user && <Redirect to="/login" />}
          <DialogTitle>Liste des élèves</DialogTitle>
          <DialogContent>
            <FormGroup>
              <TextField
                id="recherche"
                type="search"
                placeholder="Recherche..."
                onChange={this.handleChange}
              />
              <List>
                {this.props.liste.map(eleve => (
                  <div key={"elevediv-" + eleve.id}>
                    {this.state.visibleids.has(eleve.id + "") && (
                      <EleveItem
                        key={"eleve-" + eleve.id}
                        firebase={firebase}
                        eleve={eleve}
                        deleteeleve={this.handleDeleteEleve}
                        ajoutrapport={this.props.ajoutrapport}
                        user={user}
                      />
                    )}
                  </div>
                ))}
              </List>
            </FormGroup>
          </DialogContent>
        </Grid>
      </div>
    );
  }
}

export default withStyles(Style)(EleveListe);
