import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../Style'

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

class EleveAdd extends Component { //ajout eleve dasn le fichie

    constructor(props) {
        super(props);

        this.state = {
            nom: "",
            prenom: "",
            ddn: "",
            require: false
        }

    }

    _annuler = () => {
        this
            .props
            .ajout(null)
    };

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
                .ajout(eleve)
            alert("L'élève " + this.state.nom + " " + this.state.prenom + " a été ajouté")
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

    render() {
        const {classes} = this.props
        return (
            <div>
            <Grid container direction="column" alignItems="stretch">
                <Typography variant="title" className={classes.textcenter} >Ajouter un élève</Typography>
                <FormControl>
                    <FormGroup>
                        {this.state.require && <FormHelperText error>{this.state.require}</FormHelperText>}
                        <TextField
                            required
                            id="ajoutnom"
                            label="Nom"
                            placeholder="Nom"
                            margin="normal"
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
                            onChange={this.handlePrenom}
                            InputLabelProps={{
                            shrink: true
                        }}/>
                        <TextField
                            required
                            id="ajoutddn"
                            label="Date de naissance"
                            type="date"
                            defaultValue="2000-01-01"
                            margin="normal"
                            onChange={this.handleDDN}
                            InputLabelProps={{
                            shrink: true
                        }}/></FormGroup>
                    <FormGroup>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justify="flex-end">
                            <Grid item xs={2}>
                                <Button variant="flat" onClick={this._annuler}>Annuler</Button>
                            </Grid>
                            <Grid item  xs={2}>
                                <Button variant="raised" onClick={this._ajoutClose} color="primary">
                                    <Save/>
                                    Ajouter
                                </Button>
                            </Grid>
                        </Grid>
                    </FormGroup>
                </FormControl>
                </Grid>
            </div>
        )
    }
}


export default withStyles(Style)(EleveAdd);