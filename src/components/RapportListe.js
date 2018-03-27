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
import Fuse from "fuse.js";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import { FormGroup, FormControl, FormHelperText } from "material-ui/Form";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";
import CloseIcon from "material-ui-icons/Close";
import AppBar from "material-ui/AppBar/AppBar";
import Toolbar from "material-ui/Toolbar/Toolbar";
import Typography from "material-ui/Typography/Typography";
import Grid from "material-ui/Grid";

import DeleteDialog from "../reuseables/DeleteDialog";
import Alert from "../reuseables/Alert";

import { Redirect } from "react-router-dom";

import Slide from "material-ui/transitions/Slide";

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

const locale = "fr-FR";
const dateoptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};

//MARK:rapport
class Rapport extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _annuler = () => {
    this.props.onClose();
  };

  render() {
    const { rapport, classes, user } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this._annuler}
          fullScreen={true}
          transition={Transition}
        >
          <AppBar>
            <Toolbar>
              <IconButton onClick={this._annuler} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                {`${rapport.eleve}`}
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.appbarh} />
          <DialogContent className={classes.dialogcontentpadding}>
            <Typography variant="subheading" color="inherit">
              {`par ${rapport.user.nom} ${rapport.user.prenom} le ${new Date(
                rapport.date
              ).toLocaleDateString(locale, dateoptions)} à ${new Date(
                rapport.date
              ).toLocaleTimeString(locale)}`}
            </Typography>
            <FormHelperText error />
            <DialogContentText className={classes.textformat}>
              {`${rapport.texte}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this._annuler}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

//MARK: rapportitem
class RapportItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rapportopen: false,
      deleteopen: false
    };
  }

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

  _deleteAction = () => {
    this.props.deleteAction(this.props.rapport);
    this._deleteClose();
  };

  render() {
    const { rapport, user } = this.props;
    return (
      <div>
        <ListItem button onClick={this._rapportOpen}>
          <ListItemText
            primary={`${rapport.eleve} par ${rapport.user.nom} le ${new Date(
              rapport.date
            ).toLocaleDateString(locale)}`}
          />
          {!!user &&
            ["admin", "jedi"].includes(user.statut) && (
              <ListItemSecondaryAction>
                <IconButton size="small" onClick={this._deleteOpen}>
                  <DeleteIcon />
                </IconButton>
                {this.state.deleteopen && (
                  <DeleteDialog
                    open={this.state.deleteopen}
                    onClose={this._deleteClose}
                    deleteAction={this._deleteAction}
                    prompt="Supprimer ce rapport?"
                    title="Delete Rapport"
                  />
                )}
              </ListItemSecondaryAction>
            )}
        </ListItem>
        {!!user &&
          (["admin", "jedi"].includes(user.statut) || user.statut === "prof") &&
          this.state.rapportopen && (
            <Rapport
              open={this.state.rapportopen}
              rapport={rapport}
              user={user}
              onClose={this._rapportClose}
              {...this.props}
            />
          )}
      </div>
    );
  }
}

//MARK: rapportliste
class RapportListe extends Component {
  //fuse
  fuseoptions = {
    keys: ["eleve", "date", "user.nom", "user.prenom"],
    shouldSort: true
  };

  constructor(props) {
    super(props);

    this.state = {
      visibles: props.rapports,
      filtre: "",
      fuse: new Fuse(props.rapports, this.fuseoptions)
    };
  }

  _filtre = e => {
    const { fuse } = this.state;

    let result = fuse.search(`${e.target.value} `);
    /** l'espace à la fin est important pour éviter
     * que la recherche soit vide et donc aucune liste affiché
     * si on efface le filtre
     */

    this.setState({ visibles: result });
  };

  _deleterapport = r => {
    this.props.deleterapport(r);
  };

  render() {
    const { rapports, user, firebase, classes } = this.props;
    const { visibles } = this.state;
    return (
      <div>
        <Grid container direction="column" alignItems="stretch">
          {!user && <Redirect to="/" />}
          <DialogTitle>Rapports</DialogTitle>
          <DialogContent>
            <FormGroup>
              <TextField
                id="rechercheeleve"
                type="search"
                placeholder="Recherche..."
                onChange={this._filtre}
              />
              <List>
                {rapports.map(rap => (
                  <div key={"rapportdiv-" + rap.id}>
                    {visibles.includes(rap) && (
                      <RapportItem
                        rapport={rap}
                        user={user}
                        deleteAction={this._deleterapport}
                        classes={classes}
                      />
                    )}
                  </div>
                ))}
                {visibles.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Aucun résultat" />
                  </ListItem>
                )}
              </List>
            </FormGroup>
          </DialogContent>
        </Grid>
      </div>
    );
  }
}

export default withStyles(Style)(RapportListe);
