import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../decoration/Style'

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar/AppBar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Typography from 'material-ui/Typography/Typography';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu from 'material-ui/Menu/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';
import Divider from 'material-ui/Divider';

import Paper from 'material-ui/Paper';

import ProfAdd from './ProfAdd'
import EleveAdd from './EleveAdd'
import EleveListe from "./EleveListe"
import Login from "./Login"
import About from './About'
import Profile from './Profile'

import Grid from 'material-ui/Grid';
import Reboot from 'material-ui/Reboot';
import List, {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List';

import {Route, Switch, Link, HashRouter as Router} from "react-router-dom";

const usefire = true;

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
    }, {
        id: "r7ve9rvr44d9r84e",
        nom: "hulk",
        prenom: "smash",
        ddn: "31-04-1810"
    }, {
        id: "jy9trt9hth4f5d4",
        nom: "thor",
        prenom: "sonofodin",
        ddn: "04-12-1456"
    }, {
        id: "vd6d5g1j4f5ddg",
        nom: "iron",
        prenom: "man",
        ddn: "07-05-1955"
    }
]

const GRID_DRAWER_WIDTH = 2;
const GRID_APP_WIDTH = 12 - GRID_DRAWER_WIDTH;

class EleveApp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            /** la liste des eleves */
            liste: [],

            anchormenuappbar: null,

            /** authentificaction gérer dans didmount*/
            //auth:auth user:user
        }

    };

    componentWillMount() {
        const {firebase}=this.props
        if (usefire) {
            var listedb = this.state.liste;

            //recuperation de la reference de la liste d'eleves dans firebase
            firebase
                .firestore()
                .collection('eleves')
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
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                })
                .then(() => {
                    this.setState({liste: listedb});
                })
        }
    }

    componentDidMount() {
        const {firebase} = this.props
        //check si on est signined ou non pour référence : auth = !!user,
        firebase
            .auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in. on va chercher le statut du user
                    firebase
                        .firestore()
                        .collection('users')
                        .doc(user.uid)
                        .get()
                        .then((doc) => {
                            if (!doc.exists) {
                                console.log('No such document!');
                            } else {
                                // user signined + entré users dans firestore, on update user avec le statut
                                let d = doc.data();
                                user.statut = d.statut;
                                user.nom = d.nom;
                                user.prenom=d.prenom
                            }
                        })
                        .catch(err => {
                            console.log('Error getting document', err);
                        })
                        .then(() => this.setState({auth: true, user: user}))

                } else {
                    // No user is signed in.
                    this.setState({auth: false, user: null})
                }
            });
    }

    _ajoutEleve = e => {
        const {firebase}=this.props
        if (e !== null) { //check si on a un eleve à ajouter

            var lol = this.state.liste
            if (usefire) {
                /**update sur firebase + recupération de l'id*/
                firebase
                    .firestore()
                    .collection('eleves')
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
        const {firebase}=this.props
        /**on retire eleve-id de firebaseref et de la liste */
        if (e !== null) {
            var lol = this.state.liste
            if (usefire) {
                firebase
                    .firestore()
                    .collection('eleves')
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

    _switchAuth = () => {
        if (this.state.auth) {
            this.setState({auth: false})
        } else {
            this.setState({auth: true})
        }
    }

    

    _logout = () => {
        const {firebase}=this.props
        if (usefire) {
            /** ici on devrait une authntification avec firebase */
            firebase
                .fireauth()
                .signOut()
                .catch(function (error) {
                    // Handle Errors here.
                    console.log(`erreur login firebase`)
                    // ...
                });
        }
    }

    _openmenuappbar = e => {
        this.setState({anchormenuappbar: e.currentTarget});
    }

    _closemenuappbar = () => {
        this.setState({anchormenuappbar: null});
    };

    render() {
        const {classes,firebase} = this.props;
        const {auth, user, anchormenuappbar} = this.state;
        const openmenuappbar = Boolean(anchormenuappbar);

        return (
            <div>
                <Router>
                    <div>
                        <Grid container spacing={0}>
                            <Grid item xs={GRID_DRAWER_WIDTH}>
                                <Paper>
                                    <List>
                                        <div className={classes.appbarh}>
                                            {auth && <Typography
                                                variant="subheading"
                                                color="inherit"
                                                className={classes.textcenter}>
                                                {`${user.statut}`}
                                            </Typography>}
                                        </div><Divider/>
                                        <Link to="/" className={classes.noUnderline}>
                                            <ListItem button>
                                                <ListItemText primary="Liste"/>
                                            </ListItem>
                                        </Link>
                                        {auth && (user.statut == "admin" || user.statut == "prof") && <Link to="/rapports" className={classes.noUnderline}>
                                            <ListItem button>
                                                <ListItemText primary="Rapports"/>
                                            </ListItem>
                                        </Link>}
                                        <Divider/> {auth && (user.statut == "admin" || user.statut == "prof") && <Link to="/addeleve" className={classes.noUnderline}>
                                            <ListItem button>
                                                <ListItemText primary="Ajouter Elève"/>
                                            </ListItem>
                                        </Link>}
                                        {auth && user.statut == "admin" && <Link to="/addprof" className={classes.noUnderline}>
                                            <ListItem button>
                                                <ListItemText primary="Ajouter Professeur"/>
                                            </ListItem>
                                        </Link>}
                                        <Divider/>
                                        <Link to="/about" className={classes.noUnderline}>
                                            <ListItem button>
                                                <ListItemText primary="A Propos"/>
                                            </ListItem>
                                        </Link>
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs={GRID_APP_WIDTH}>
                                <AppBar position="static" color="primary">
                                    <Toolbar>
                                        <Grid container direction="row" justify="center" alignItems="center">

                                            <Grid item xs={11}>
                                                <Typography variant="title" color="inherit" className={classes.textcenter}>
                                                    SOSTAMA
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={1}>
                                                {auth
                                                    ? <div>
                                                            <IconButton
                                                                aria-owns={openmenuappbar
                                                                ? 'menu-appbar'
                                                                : null}
                                                                aria-haspopup="true"
                                                                onClick={this._openmenuappbar}
                                                                color="inherit">
                                                                <AccountCircle/>
                                                            </IconButton>
                                                            <Menu
                                                                id="menu-appbar"
                                                                anchorEl={anchormenuappbar}
                                                                anchorOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'right'
                                                            }}
                                                                transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'right'
                                                            }}
                                                                open={openmenuappbar}
                                                                onClose={this._closemenuappbar}
                                                                onClick={this._closemenuappbar}>
                                                                <Link to="/profile" className={classes.noUnderline}>
                                                                    <MenuItem>Profile</MenuItem>
                                                                </Link>
                                                                <Link to="/" className={classes.noUnderline}>
                                                                    <MenuItem onClick={this._logout}>Logout</MenuItem>
                                                                </Link>

                                                            </Menu>
                                                        </div>
                                                    : <Link to="/login" className={classes.noUnderline}>
                                                        <Button variant="raised" color="inherit">Login</Button>
                                                    </Link>}
                                            </Grid>
                                        </Grid>
                                    </Toolbar>
                                </AppBar>
                                <div className={classes.space}>
                                    <Switch id="routes">
                                        <Route
                                            path="/"
                                            exact={true}
                                            render={(props) => (<EleveListe
                                                firebase={this.props.firebase}
                                            liste={this.state.liste}
                                            deleteeleve={this._deleteEleve}
                                            user={user}/>)}/>
                                        <Route
                                            path="/addeleve"
                                            render={() => (<EleveAdd ajout={this._ajoutEleve} auth={auth}/>)}/>
                                        <Route
                                            path="/addprof"
                                            render={() => (<ProfAdd ajout={this._ajoutProf} auth={auth}/>)}/>
                                        <Route
                                            path="/login"
                                            render={() => (<Login firebase={firebase} auth={auth}/>)}/>
                                        <Route path="/profile" render={() => (<Profile user={user}/>)}/>
                                        <Route path="/about" component={About}/>
                                    </Switch>
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