import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Style from "../decoration/Style";

import TextField from "material-ui/TextField";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import { FormGroup, FormControl, FormHelperText } from "material-ui/Form";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import AppBar from "material-ui/AppBar/AppBar";
import Toolbar from "material-ui/Toolbar/Toolbar";
import Typography from "material-ui/Typography/Typography";

import Alert from "../reuseables/Alert";

import Slide from "material-ui/transitions/Slide";

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

class EleveRapport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rapport: "",
      require: "",
      alert: false
    };
  }
  _closeAlert = () => {
    this.setState({ alert: false });
  };

  _annuler = () => {
    this.props //callbaaaack pour ramener le state au parent
      .onClose();
  };

  _reset = () => {
    this.setState({ rapport: "", require: "" });
  };

  _mail = () => {
    //envoyerle rapport dans firebase
    const { rapport } = this.state;
    const { firebase, user, eleve } = this.props;

    if (rapport === "") {
      this.setState({ require: "Veuillez remplir les champs requis." });
    } else {
      //construction du json
      let r = {
        texte: rapport,
        date: new Date().toString(),
        eleve: `${eleve.nom} ${eleve.prenom}`
      };

      this.props.ajoutrapport(r);

      this.setState({ alert: true });
      this._reset();
    }
  };

  handleRapport = e => {
    this.setState({ rapport: e.target.value });
  };
  render() {
    const { eleve, classes, user } = this.props;
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
                {eleve.nom + " " + eleve.prenom + " " + eleve.ddn}
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.appbarh} />
          <DialogContent className={classes.dialogcontentpadding}>
            {this.state.require && (
              <FormHelperText error>{this.state.require}</FormHelperText>
            )}
            <FormGroup>
              <TextField
                multiline
                fullWidth
                label="Rédiger votre rapport"
                rows="10"
                helperText="Une fois votre rapport rédigé, appuyez sur le boutton Mail"
                value={this.state.rapport}
                onChange={this.handleRapport}
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={this._annuler}>Annuler</Button>
            <Button variant="raised" onClick={this._mail} color="primary">
              Envoyer !
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.alert && (
          <Alert
            open={this.state.alert}
            onClose={this._closeAlert}
            text={`Votre rapport a été envoyé !`}
          />
        )}
      </div>
    );
  }
}

export default withStyles(Style)(EleveRapport);
