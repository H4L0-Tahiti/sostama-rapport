import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Style from "../decoration/Style";
import { withGridCol } from "../decoration/withGridCol";

import TextField from "material-ui/TextField";
import { FormGroup, FormControl, FormHelperText } from "material-ui/Form";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography/Typography";
import Grid from "material-ui/Grid";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";

import Alert from "../reuseables/Alert";

import { Redirect } from "react-router-dom";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      require: false,
      alert: false
    };
  }

  handleEmail = e => {
    this.setState({ email: e.target.value });
  };

  _reinitialize = () => {
    //ajout json eleve dans le fichier
    const { admin } = this.props;
    const { email } = this.state;
    if (email === "") {
      this.setState({ require: "Veuillez remplir les champs requis." });
    } else {
      /** via admin, on envoit un email de reinitialisaton de mdp */
      admin
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          // Email sent.
          this.setState({ alert: true });
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
  };

  _closeAlert = () => {
    this.setState({ alert: false, require: false });
    //this._reset()
  };

  render() {
    const { classes, user, admin } = this.props;
    return (
      <div>
        {user && <Redirect to="/" />}
        <Grid container direction="column" alignItems="stretch">
          <DialogTitle>{`Réinitialisation de mot de passe`}</DialogTitle>
          <DialogContent>
            <DialogContentText className={classes.textformat}>
              {`Veuillez renseigner l'adresse email qui a servi à votre inscription sur l'application.
              Un email de réinitialisation de mot de passe vous y sera envoyé.
              `}
            </DialogContentText>
            <FormGroup>
              {this.state.require && (
                <FormHelperText error>{this.state.require}</FormHelperText>
              )}
              <TextField
                required
                id="email"
                label="Email"
                autoComplete="email"
                margin="normal"
                value={this.state.email}
                onChange={this.handleEmail}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </FormGroup>
            <DialogActions>
              <Button
                variant="raised"
                type="submit"
                color="primary"
                onClick={this._reinitialize}
                autoFocus
              >
                Réinitialiser
              </Button>
            </DialogActions>
          </DialogContent>
          {this.state.alert && (
            <Alert
              open={this.state.alert}
              onClose={this._closeAlert}
              text={`Un email a été envoyé, veuillez vérifier votre boite email et retourner sur Login`}
            />
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(Style)(ResetPassword);
