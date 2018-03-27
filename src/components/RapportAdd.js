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
import MenuItem from "material-ui/Menu/MenuItem";

import Alert from "../reuseables/Alert";

import Slide from "material-ui/transitions/Slide";

function Transition(props) {
  return <Slide direction="left" {...props} />;
}

const matieres = ["Maths", "Français", "Anglais"];

class RapportAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rapport: "",
      matiere: "",
      date: "",
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
    this.setState({ rapport: "", require: "", matiere: "", date: "" });
  };

  _mail = () => {
    //envoyerle rapport dans firebase
    const { rapport, matiere, date } = this.state;
    const { firebase, user, eleve } = this.props;

    if (rapport === "" || !matieres.includes(matiere) || date === "") {
      this.setState({ require: "Veuillez remplir les champs requis." });
    } else {
      //construction du json
      let r = {
        texte: rapport,
        matiere: matiere,
        date: new Date(date).toString(),
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

  handleDate = e => {
    this.setState({ date: new Date(e.target.value) });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
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
                {eleve.nom + " " + eleve.prenom + " "}
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
                select
                required
                label="Matière"
                margin="normal"
                value={this.state.matiere}
                onChange={this.handleChange("matiere")}
                className={classes.textfieldshort}
                InputLabelProps={{
                  shrink: true
                }}
              >
                {matieres.map(mat => (
                  <MenuItem key={`key-${mat}`} value={mat}>
                    {mat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="datetime-local"
                required
                label="Date du cours"
                margin="normal"
                value={this.state.date}
                onChange={this.handleChange("date")}
                className={classes.textfieldshort}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                multiline
                fullWidth
                margin="normal"
                label="Rédiger votre rapport"
                rows="10"
                value={this.state.rapport}
                onChange={this.handleChange("rapport")}
                InputLabelProps={{
                  shrink: true
                }}
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

export default withStyles(Style)(RapportAdd);
