import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../decoration/Style'

import TextField from 'material-ui/TextField';
import {FormGroup, FormControl, FormHelperText} from 'material-ui/Form';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import AppBar from 'material-ui/AppBar/AppBar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Typography from 'material-ui/Typography/Typography';
import Save from 'material-ui-icons/Save';
import Grid from 'material-ui/Grid';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import MenuItem from 'material-ui/Menu/MenuItem';

import Alert from '../reuseables/Alert'

import {Redirect} from "react-router-dom";

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    return <Slide direction="down" {...props}/>;
}

const statuts = ["prof", "admin"]
class ProfAdd extends Component { //ajout eleve dasn le fichie

    constructor(props) {
        super(props);

        this.state = {
            nom: "",
            prenom: "",
            email: "",
            password: "",
            statut:"prof",
            require: false,
            alert: false
        }

    }

    _ajoutClose = e => {
        const {admin} = this.props
        const {nom, prenom, email, password} = this.state

        if ((nom === "") || (prenom === "") || (email === "") || (password === "")) {
            this.setState({require: "Veuillez remplir les champs requis."});
        } else {
            // ajout du prof dans firebase ajout des credentials dans auth via firebase
            // admin
            admin
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(function (userRecord) {
                    // on a userRecord.uid, il faut maintenant ajouter les champs dans firestore
                    // ajout dans users l'ajout dans la collection rapports est inutile: ça se fera
                    // tout seul avec le 1er rapport envoyé
                    admin
                        .firestore()
                        .collection("users")
                        .doc(userRecord.uid)
                        .set({nom: nom, prenom: prenom, statut: "prof"})
                        .then(() => {
                            //tout est codé,signout car createuser singin automatiquement et alert
                            admin
                                .auth()
                                .signOut();
                            this.setState({alert: true})
                        })
                        .catch(function (error) {
                            console.log("Error creating new user in firestore:", error);
                        })
                })
                .catch(function (error) {
                    console.log("Error creating new user:", error);
                    alert(error.message);
                });
        }
    };

    handleNom = e => {
        this.setState({nom: e.target.value})
    }

    handlePrenom = e => {
        this.setState({prenom: e.target.value})
    }

    handleEmail = e => {
        this.setState({email: e.target.value})
    }

    handlePassword = e => {
        this.setState({password: e.target.value})
    }
    handleStatut = e=>{
        this.setState({statut:e.target.value})
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    _reset = () => {
        this.setState({
            nom: "",
            prenom: "",
            email: "",
            password: "",
            require: false,
            alert: false
        })
    }

    _closeAlert = () => {
        this.setState({alert: false})
        //this._reset()
    }

    render() {
        const {auth, classes} = this.props
        return (
            <div>
                {!auth && <Redirect to="/"/>}
                <Grid container direction="column" alignItems="stretch">
                    <DialogTitle>Ajouter un professeur</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                            {this.state.require && <FormHelperText error>{this.state.require}</FormHelperText>}
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
                            }}/>
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
                            }}/>
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
                            }}/>
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
                            }}/>
                            <TextField
                                require
                                id="select-statut"
                                select
                                label="Statut"
                                value={this.state.statut}
                                onChange={this.handleChange('statut')}
                                margin="normal"
                                InputLabelProps={{
                                shrink: true
                            }}>
                                {statuts.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._reset}>Reset</Button>
                        <Button variant="raised" onClick={this._ajoutClose} color="primary">
                            <Save/>
                            Ajouter
                        </Button>
                    </DialogActions>
                    {this.state.alert && <Alert
                        open={this.state.alert}
                        onClose={this._closeAlert}
                        text={`L'utilisateur ${this.state.nom} ${this.state.prenom} a été ajouté en tant que "${this.state.statut}"`}/>}
                </Grid>
            </div>
        )
    }
}

export default withStyles(Style)(ProfAdd)