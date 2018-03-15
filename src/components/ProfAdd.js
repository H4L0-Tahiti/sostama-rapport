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

import {Redirect} from "react-router-dom";

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    return <Slide direction="down" {...props}/>;
}

class ProfAdd extends Component { //ajout eleve dasn le fichie

    constructor(props) {
        super(props);

        this.state = {
            nom: "",
            prenom: "",
            ddn: "",
            require: false,
            alert: false
        }

    }

    _ajoutClose = e => {
        //ajout json eleve dans le fichier
        if ((this.state.nom === "") || (this.state.prenom === "") || (this.state.ddn === "")) {
            this.setState({require: "Veuillez remplir les champs requis."});
        } else {
            let eleve = {
                /** id sera rempli par firebase */
                "nom": this.state.nom,
                "prenom": this.state.prenom,
                "ddn": this.state.ddn
            };

            this
                .props/** retour vers EleveApp */
                .ajout(eleve);
            this.setState({alert: true});
        }
    };

    handleNom = e => {
        this.setState({nom: e.target.value})
    }

    handlePrenom = e => {
        this.setState({prenom: e.target.value})
    }

    handleDDN = e => {
        this.setState({ddn: e.target.value})
    }

    _reset = () => {
        this.setState({nom: "", prenom: "", ddn: "", require: false, alert: false})
    }

    _closeAlert = () => {
        this.setState({alert: false})
        this._reset()
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
                                id="ajoutddn"
                                label="Date de naissance"
                                type="date"
                                margin="normal"
                                value={this.state.ddn}
                                onChange={this.handleDDN}
                                InputLabelProps={{
                                shrink: true
                            }}/>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._reset}>Reset</Button>
                        <Button variant="raised" onClick={this._ajoutClose} color="primary">
                            <Save/>
                            Ajouter
                        </Button>
                    </DialogActions>
                    {this.state.alert && <Dialog
                        id="alert-add"
                        open={this.state.alert}
                        transition={Transition}
                        onClose={this._closeAlert}>
                        <DialogContent>
                            <DialogContentText>
                                {"L'élève " + this.state.nom + " " + this.state.prenom + " a été ajouté"}
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>}
                </Grid>
            </div>
        )
    }
}

export default withStyles(Style)(ProfAdd);