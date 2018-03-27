import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Style from "../decoration/Style";

import TextField from "material-ui/TextField";
import { FormGroup, FormControl, FormHelperText } from "material-ui/Form";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import AppBar from "material-ui/AppBar/AppBar";
import Toolbar from "material-ui/Toolbar/Toolbar";
import Typography from "material-ui/Typography/Typography";
import Save from "material-ui-icons/Save";
import Grid from "material-ui/Grid";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import MenuItem from "material-ui/Menu/MenuItem";

import Alert from "../reuseables/Alert";

import { Redirect } from "react-router-dom";

import Slide from "material-ui/transitions/Slide";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const statuts = ["prof", "admin"];

class ProfAdd extends Component {
  //ajout eleve dasn le fichie

  constructor(props) {
    super(props);

    this.state = {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      statut: "prof",
      require: false,
      alert: false
    };
  }

  //MARK:add
  _ajoutClose = e => {
    const { admin } = this.props;
    const { nom, prenom, email, password, statut } = this.state;

    /**
     * note: statut est la plupart du temps prof
     */

    if (nom === "" || prenom === "" || email === "" || password === "") {
      this.setState({ require: "Veuillez remplir les champs requis." });
    } else {
      // ajout du prof dans firebase ajout des credentials dans auth via firebase
      // admin
      var p = { id: "", nom: nom, prenom: prenom, email: email };
      admin
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userRecord => {
          // on a userRecord.uid, il faut maintenant ajouter les champs dans firestore
          // ajout dans users l'ajout dans la collection rapports est inutile: ça se fera
          // tout seul avec le 1er rapport envoyé

          //mise à jour display name dans admin auth
          userRecord.updateProfile({
            displayName: `${p.nom} ${p.prenom}`
          });

          //envoie de l'email de vérification histoire de
          userRecord.sendEmailVerification();

          p.id = userRecord.uid;
          admin
            .firestore()
            .collection("users")
            .doc(userRecord.uid)
            .set({ nom: nom, prenom: prenom, email: email, statut: statut })
            .then(() => {
              //tout est codé,signout car createuser singin automatiquement et alert
              this.props.addprof(p);
              this.setState({ alert: true });
              admin.auth().signOut();
            })
            .catch(function(error) {
              console.log("Error creating new user in firestore:", error);
            });
        })
        .catch(function(error) {
          //erreur creation auth
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
  };

  handleNom = e => {
    this.setState({ nom: e.target.value });
  };

  handlePrenom = e => {
    this.setState({ prenom: e.target.value });
  };

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  handlePassword = e => {
    this.setState({ password: e.target.value });
  };
  handleStatut = e => {
    this.setState({ statut: e.target.value });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  _reset = () => {
    this.setState({
      nom: "",
      prenom: "",
      email: "",
      password: "",
      require: false,
      alert: false
    });
  };

  _closeAlert = () => {
    this.setState({ alert: false });
    //this._reset()
  };

  render() {
    const { user, classes } = this.props;
    return (
      <div>
        {!user && <Redirect to="/" />}
        <Grid container direction="column" alignItems="stretch">
          <DialogTitle>Ajouter un professeur</DialogTitle>
          <DialogContent>
            <FormGroup>
              {this.state.require && (
                <FormHelperText error>{this.state.require}</FormHelperText>
              )}
              <TextField
                required
                id="ajoutnom"
                label="Nom"
                placeholder="Nom"
                margin="normal"
                value={this.state.nom}
                onChange={this.handleNom}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                required
                id="ajoutprenom"
                label="Prénom"
                placeholder="Prénom"
                margin="normal"
                value={this.state.prenom}
                onChange={this.handlePrenom}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                required
                id="ajoutemail"
                label="email"
                placeholder="email@sostama.com"
                margin="normal"
                value={this.state.email}
                onChange={this.handleEmail}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                required
                id="ajoutpassword"
                label="Mot de passe"
                placeholder="Mot de passe"
                margin="normal"
                value={this.state.password}
                onChange={this.handlePassword}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {user.statut === "jedi" && (
                <TextField
                  required
                  id="select-statut"
                  select
                  label="Statut"
                  value={this.state.statut}
                  onChange={this.handleChange("statut")}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                >
                  <MenuItem value="prof">prof</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                </TextField>
              )}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={this._reset}>Reset</Button>
            <Button variant="raised" onClick={this._ajoutClose} color="primary">
              <Save />
              Ajouter
            </Button>
          </DialogActions>
          {this.state.alert && (
            <Alert
              open={this.state.alert}
              onClose={this._closeAlert}
              text={`L'utilisateur ${this.state.nom} ${
                this.state.prenom
              } a été ajouté en tant que "${this.state.statut}"`}
            />
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(Style)(ProfAdd);
