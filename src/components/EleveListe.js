import React, {Component} from 'react';
import PropTypes from 'prop-types';

import List, {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import {FormControl, FormGroup} from 'material-ui/Form';
import Fuse from 'fuse.js';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';

import EleveRapport from './EleveRapport'
import Grid from 'material-ui/Grid';

export class EleveItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            eleve: props.eleve,
            rapportopen: false,
            deleteopen: false
        }

    };

    /**RAPPORT handlers */
    handleRapportOpen = () => { //utilise pou affiche la fiche élève
        this.setState({rapportopen: true});
    };

    handleRapportClose = () => {
        this.setState({rapportopen: false});
    };

    /** DELETE handlers */
    handleDeleteOpen = () => {
        this.setState({deleteopen: true});

    };
    handleDeleteClose = () => {
        this.setState({deleteopen: false});
    }

    handleDeleteEleve = e => {
        this.setState({deleteopen: false});
        this
            .props
            .deleteeleve(this.state.eleve)/** > EleveList */
    };
    /**RENDER */
    render() {

        return (
            <div>
                <ListItem
                    button
                    onClick={this.handleRapportOpen}
                    disabled={this.state.rapportopen}>
                    <ListItemText primary={this.state.eleve.nom + " " + this.state.eleve.prenom}/>
                    <ListItemSecondaryAction>
                        <IconButton size="small" onClick={this.handleDeleteOpen}>
                            <DeleteIcon/>
                        </IconButton>
                        {this.state.deleteopen && <Dialog
                            id={"dialog-delete-" + this.state.eleve.id}
                            open={this.state.deleteopen}
                            onClose={this.handleDeleteClose}>
                            <DialogTitle id="alert-dialog-title">{"Supprimer " + this.state.eleve.nom + " " + this.state.eleve.prenom + "?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Etes vous sûr de vouloir supprimer cette élève de la base de données ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleDeleteClose} color="primary" autoFocus>
                                    Annuler
                                </Button>
                                <Button onClick={this.handleDeleteEleve} color="primary">
                                    Supprimer
                                </Button>
                            </DialogActions>
                        </Dialog>}
                    </ListItemSecondaryAction>
                </ListItem>
                {this.state.rapportopen && <EleveRapport
                    eleve={this.state.eleve}
                    open={this.state.rapportopen}
                    onClose={this.handleRapportClose/*callbaaaaaack*/}/>}
            </div>
        )
    }

}

export default class EleveList extends Component {

    //fuse
    fuseoptions = {
        keys: [
            'nom', 'prenom'
        ],
        id: 'id',
        shouldSort: true
    };

    constructor(props) {
        super(props);
        var tempset = new Set();
        props
            .liste
            .map((eleve) => {
                tempset.add(eleve.id + "")
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
        this
            .state
            .fuse
            .search(event.target.value)
            .map((id) => (tempset.add(id)));

        if (tempset.size === 0) {
            /** la recherche a ramene null, on affiche tout */
            this.setState({visibleids: this.state.allids});
        } else {
            this.setState({visibleids: tempset});
        }
    };

    handleDeleteEleve = e => {
        this
            .props
            .deleteeleve(e);/** > EleveApp */
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.allids.size !== nextProps.liste.length) {
            /** la liste a changé ! */
            var temp = new Set();
            nextProps
                .liste
                .map((eleve) => {
                    temp.add(eleve.id + "")
                });
            var f = new Fuse(nextProps.liste, this.fuseoptions);
            this.setState({allids: temp, visibleids: temp, fuse: f});
        }
    }

    //RENDER
    render() {
        return (
            <div>
                <Grid container direction="column" alignItems="stretch">
                    <DialogTitle>Liste des élèves</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                            <TextField
                                id="recherche"
                                type="search"
                                placeholder="Recherche..."
                                onChange={this.handleChange}/>
                            <List>
                                {this
                                    .props
                                    .liste
                                    .map((eleve) => <div key={"elevedv-" + eleve.id}>{this
                                            .state
                                            .visibleids
                                            .has(eleve.id + "") && (<EleveItem key={eleve.id} eleve={eleve} deleteeleve={this.handleDeleteEleve}/>)}
                                    </div>)}
                            </List>
                        </FormGroup>
                    </DialogContent>
                </Grid>
            </div>
        );
    }
}