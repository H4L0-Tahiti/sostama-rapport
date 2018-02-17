import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../Style'

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar/AppBar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Typography from 'material-ui/Typography/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import Menu from 'material-ui/Menu/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';
import Divider from 'material-ui/Divider';

import EleveAdd from './EleveAdd'
import EleveList from "./EleveListe"
import About from './About'

import Grid from 'material-ui/Grid';
import Reboot from 'material-ui/Reboot';
import Drawer from 'material-ui/Drawer';
import List, {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List';

import {Route, Switch, Link, HashRouter as Router} from "react-router-dom";

const firedev = false;

const fakelist = [
    {
        id: "azdazdàakz$da484864",
        nom: "ORTAS",
        prenom: "lol",
        ddn: "ilestpasné"
    }, {
        id: "5zda54z5da4",
        nom: "gruk",
        prenom: "alan",
        ddn: "25-65-1965"
    }
]

class EleveApp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            /** la liste des eleves */
            liste: fakelist,
            /* firebase */
            elevesref: null
        }

    };

    componentWillMount() {
        if (firedev) {
            var listedb = this.state.liste;

            var elevesref = this
                .props
                .db
                .collection('eleves');

            elevesref
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        let d = doc.data();
                        let e = {
                            id: doc.id,
                            nom: d.nom,
                            prenom: d.prenom,
                            ddn: d.ddn
                        }
                        listedb.push(e);
                    });
                    this.setState({liste: listedb, elevesref: elevesref});
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                })
        }
    }

    _menuOpen = e => {
        //au lieu de gérer true ou false, on gère object ou null via Boolean
        this.setState({anchormenu: e.currentTarget, menuopen: true});
        console.log(e.currentTarget)

    }

    _menuClose = () => {
        /** anchormenu null => Boolean(anchormenu) false */
        this.setState({anchormenu: null})
    }

    _ajoutOpen = () => {
        /*bug: setstate sur anchormenu : null fait perdre le focus de EleveAdd
        cheat dans _ajoutEleve car EleveAdd est fullscreen, on verra pas la diff xD */
        this.setState({ajoutopen: true});
        console.log(this.state.ajoutopen)
    }

    _ajoutEleve = e => {
        this.setState({ajoutopen: false});
        if (e !== null) { //check si on a un eleve à ajouter

            var lol = this.state.liste
            if (firedev) {
                /**update sur firebase + recupération de l'id*/
                this
                    .state
                    .elevesref
                    .add(e)
                    .then((doc) => {
                        e.id = doc.id;
                        /** push sur liste local plutot que refaire get */
                        lol.push(e);
                        this.setState({liste: lol});
                    });
            } else {
                e.id = 'id-' + e.nom
                /** push sur liste local plutot que refaire get */
                lol.push(e);
                this.setState({liste: lol});
            }

        }
    };

    _deleteEleve = e => {
        /**on retire eleve-id de firebaseref et de la liste */
        if (e !== null) {
            var lol = this.state.liste
            if (firedev) {
                this
                    .state
                    .elevesref
                    .doc(e.id)
                    .delete()/** delete de eleve de firestore */
                    .then(() => {
                        let index = lol.indexOf(e);
                        lol.splice(index, 1);/** delete de la liste locale */
                        this.setState({liste: lol});
                    });
            } else {

                let index = lol.indexOf(e);
                lol.splice(index, 1);/** delete de la liste locale */
                this.setState({liste: lol});
            }

        };

    }
    render() {
        const {classes} = this.props;
        return (
            <div>
                <Router>
                    <div>
                        <Grid container>
                            <Grid item xs={2}>
                                <List>
                                    <div className={classes.appbarh}/><Divider/>
                                    <Link
                                        to="/"
                                        style={{
                                        textDecoration: 'none'
                                    }}>
                                        <ListItem button><ListItemText primary="Liste"/>
                                        </ListItem>
                                    </Link>
                                    <Link
                                        to="/add"
                                        style={{
                                        textDecoration: 'none'
                                    }}>
                                        <ListItem button onClick={this._ajoutOpen}>

                                            <ListItemText primary="Ajouter Elève"/>

                                        </ListItem>
                                    </Link><Divider/>
                                    <Link
                                        to="/about"
                                        style={{
                                        textDecoration: 'none'
                                    }}>
                                        <ListItem button>
                                            <ListItemText primary="A Propos"/>
                                        </ListItem>
                                    </Link>
                                </List>
                            </Grid>
                            <Grid item xs={10}>
                                <AppBar position="static" color="primary">
                                    <Toolbar>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="center">
                                            <Grid item xs={11}>
                                                <Typography variant="title" color="inherit" className={classes.textcenter}>
                                                    SOSTAMA
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <Button color="inherit">Login</Button>
                                            </Grid>

                                        </Grid>
                                    </Toolbar>
                                </AppBar>
                                <div
                                    style={{
                                    marginTop: 20
                                }}>

                                    <Grid container>
                                        <Grid item xs/>
                                        <Grid item xs={8}>
                                            <Switch id="routes">
                                                <Route
                                                    path="/"
                                                    exact={true}
                                                    render={(props) => (<EleveList liste={this.state.liste} deleteeleve={this._deleteEleve} {...props}/>)}/>
                                                <Route path="/add" render={() => (<EleveAdd ajout={this._ajoutEleve}/>)}/>
                                                <Route path="/about" component={About}/>
                                            </Switch>
                                        </Grid>
                                        <Grid item xs/>
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Router>
            </div>
        );
    }

}

export default withStyles(Style)(EleveApp);