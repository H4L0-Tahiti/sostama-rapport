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

//MARK:prof
class Prof extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  _annuler = () => {
    this.props.onClose();
  };

  render() {
    const { item, classes, user } = this.props;
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
                {`${item.nom} ${item.prenom}`}
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.appbarh} />
          <DialogContent className={classes.dialogcontentpadding}>
            <FormHelperText error />
            <DialogContentText className={classes.textformat}>
              {`${item.nom} ${item.prenom}
              ${item.email}
              `}
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

//MARK: profitem
class ProfItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemopen: false,
      deleteopen: false
    };
  }

  _itemOpen = () => {
    //utilise pou affiche la fiche élève
    this.setState({ itemopen: true });
  };

  _itemClose = () => {
    this.setState({ itemopen: false });
  };

  /** DELETE handlers */
  _deleteOpen = () => {
    this.setState({ deleteopen: true });
  };

  _deleteClose = () => {
    this.setState({ deleteopen: false });
  };

  _deleteAction = () => {
    this.props.delete(this.props.item);
    this._deleteClose();
  };

  render() {
    const { item, user } = this.props;
    return (
      <div>
        <ListItem button onClick={this._itemOpen}>
          <ListItemText primary={`${item.nom} ${item.prenom}`} />
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
                    prompt="Supprimer ce Professeur?"
                  />
                )}
              </ListItemSecondaryAction>
            )}
        </ListItem>
        {!!user &&
          ["admin", "jedi"].includes(user.statut) &&
          this.state.itemopen && (
            <Prof
              open={this.state.itemopen}
              item={item}
              user={user}
              onClose={this._itemClose}
              {...this.props}
            />
          )}
      </div>
    );
  }
}

//MARK: profliste
class ProfListe extends Component {
  //fuse
  fuseoptions = {
    keys: ["nom", "prenom"],
    shouldSort: true
  };

  constructor(props) {
    super(props);
    this.state = {
      visibles: props.list,
      filtre: "",
      fuse: new Fuse(props.list, this.fuseoptions)
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

  _delete = i => {
    this.props.delete(i);
  };

  render() {
    const { list, user, firebase, classes } = this.props;
    const { visibles } = this.state;
    return (
      <div>
        <Grid container direction="column" alignItems="stretch">
          {!user && <Redirect to="/" />}
          <DialogTitle>Professeurs</DialogTitle>
          <DialogContent>
            <FormGroup>
              <TextField
                id="filtre"
                type="search"
                placeholder="Recherche..."
                onChange={this._filtre}
              />
              <List>
                {list.map(v => (
                  <div key={"rapportdiv-" + v.id}>
                    {visibles.includes(v) && (
                      <ProfItem
                        item={v}
                        user={user}
                        delete={this._delete}
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

export default withStyles(Style)(ProfListe);
