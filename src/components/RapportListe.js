import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../decoration/Style'

import List, {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Fuse from 'fuse.js';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {FormGroup, FormControl, FormHelperText} from 'material-ui/Form';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import CloseIcon from 'material-ui-icons/Close';
import AppBar from 'material-ui/AppBar/AppBar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Typography from 'material-ui/Typography/Typography';
import Grid from 'material-ui/Grid';

import DeleteDialog from '../reuseables/DeleteDialog'

import {Redirect} from "react-router-dom";

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    return <Slide direction="left" {...props}/>;
}

class Rapport extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    _annuler = () => {
        this
            .props
            .onClose()
    };

    render() {
        const {rapport, classes, user} = this.props
        return (

            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this._annuler}
                    fullScreen={true}
                    transition={Transition}>
                    <AppBar>
                        <Toolbar>
                            <IconButton onClick={this._annuler} aria-label="Close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                {`${rapport.eleve} ${rapport.date}`}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.appbarh}/>
                    <DialogContent className={classes.dialogcontentpadding}>
                        <FormHelperText error></FormHelperText>
                        <DialogContentText>
                            {`${rapport.texte}`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._annuler}>Fermer</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

class RapportItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rapportopen: false,
            deleteopen: false
        }
    }

    _rapportOpen = () => { //utilise pou affiche la fiche élève
        this.setState({rapportopen: true});
    };

    _rapportClose = () => {
        this.setState({rapportopen: false});
    };

    /** DELETE handlers */
    _deleteOpen = () => {
        this.setState({deleteopen: true});
    };

    _deleteClose = () => {
        this.setState({deleteopen: false});
    }

    _deleteAction = () => {
        this.props.deleteAction(this.props.rapport)
        this._deleteClose()
    };

    render() {
        const {rapport, user} = this.props
        return (
            <div>
                <ListItem button onClick={this._rapportOpen}>
                    <ListItemText primary={`${rapport.eleve} ${rapport.date}`}/> {!!user && (user.statut === "admin") && <ListItemSecondaryAction>
                        <IconButton size="small" onClick={this._deleteOpen}>
                            <DeleteIcon/>
                        </IconButton>
                        {this.state.deleteopen && <DeleteDialog
                            open={this.state.deleteopen}
                            onClose={this._deleteClose}
                            deleteAction={this._deleteAction}
                            prompt="Supprimer ce rapport?"
                            title="Delete Rapport"/>}
                    </ListItemSecondaryAction>}
                </ListItem>
                {!!user && ((user.statut === "admin") || (user.statut === "prof")) && this.state.rapportopen && <Rapport
                    open={this.state.rapportopen}
                    rapport={rapport}
                    user={user}
                    onClose={this._rapportClose}
                    {...this.props}/>}
            </div>
        )
    }
}

class RapportListe extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rapports: []
        }
    }

    _filtreProf = e => {}

    _filtreEleve = e => {}

    _deleterapport = r => {
        const {firebase, user} = this.props

        //retirer r de firestore
        firebase
            .firestore()
            .collection('rapports')
            .doc(user.uid)
            .collection("messages")
            .doc(r.id)
            .delete()
            .then(() => {
                //retirer r de state
                let lol = this.state.rapports
                let index = lol.indexOf(r);
                lol.splice(index, 1);/** delete de la liste locale */
                this.setState({rapports: lol});
            })

    }

    componentDidMount() {
        //recup la liste de rapports sur firebase
        const {firebase, user} = this.props
        var rapports = []
        firebase
            .firestore()
            .collection('rapports')
            .doc(user.uid)
            .collection("messages")
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    let d = doc.data();
                    let r = {
                        id: doc.id,
                        date: d.date,
                        eleve: d.eleve,
                        texte: d.texte
                    }
                    rapports.push(r);
                });
            })
            .catch((err) => {
                console.log('Error getting rapports', err);
            })
            .then(() => {
                this.setState({rapports: rapports});
            })
    }

    render() {
        const {user, firebase, classes} = this.props
        const {rapports} = this.state
        return (
            <div>
                <Grid container direction="column" alignItems="stretch">
                    {!user && <Redirect to="/"/>}
                    <DialogTitle>Rapports</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                            <TextField
                                id="recherche"
                                type="search"
                                placeholder="Filtre prof..."
                                onChange={this._filtreProf}/>
                            <TextField
                                id="recherche"
                                type="search"
                                placeholder="Filtre eleve..."
                                onChange={this._filtreEleve}/>
                            <List>
                                {rapports.map((rap) => <div key={"rapportdiv-" + rap.id}>
                                    <RapportItem
                                        rapport={rap}
                                        user={user}
                                        deleteAction={this._deleterapport}
                                        classes={classes}/>
                                </div>)}
                            </List>
                        </FormGroup>
                    </DialogContent>
                </Grid>
            </div>
        )
    }
}

export default withStyles(Style)(RapportListe)