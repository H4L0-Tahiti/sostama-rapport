import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Style from "../decoration/Style";

import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import AppBar from "material-ui/AppBar/AppBar";
import Toolbar from "material-ui/Toolbar/Toolbar";
import Typography from "material-ui/Typography/Typography";
import MenuIcon from "material-ui-icons/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";
import Menu from "material-ui/Menu/Menu";
import MenuItem from "material-ui/Menu/MenuItem";
import Divider from "material-ui/Divider";

import Paper from "material-ui/Paper";

import Page404 from "./Page404";
import Blog from "./Blog";
import ProfAdd from "./ProfAdd";
import EleveAdd from "./EleveAdd";
import EleveListe from "./EleveListe";
import Login from "./Login";
import About from "./About";
import Profile from "./Profile";
import RapportListe from "./RapportListe";
import ProfListe from "./ProfListe";

import Grid from "material-ui/Grid";
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "material-ui/List";

import {
  Route,
  Switch,
  Link,
  NavLink,
  HashRouter as Router
} from "react-router-dom";

const usefire = true;

const fakelist = [
  {
    id: "azdazdàakz$da484864",
    nom: "ORTAS",
    prenom: "lol",
    ddn: "ilestpasné"
  },
  {
    id: "5zda54z5da4",
    nom: "gruk",
    prenom: "alan",
    ddn: "25-65-1965"
  },
  {
    id: "r7ve9rvr44d9r84e",
    nom: "hulk",
    prenom: "smash",
    ddn: "31-04-1810"
  },
  {
    id: "jy9trt9hth4f5d4",
    nom: "thor",
    prenom: "sonofodin",
    ddn: "04-12-1456"
  },
  {
    id: "vd6d5g1j4f5ddg",
    nom: "iron",
    prenom: "man",
    ddn: "07-05-1955"
  }
];

const GRID_DRAWER_WIDTH = 2;
const GRID_APP_WIDTH = 12 - GRID_DRAWER_WIDTH;

//MARK: eleveapp
class EleveApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /** la liste des eleves */
      eleves: [],
      rapports: [],
      profs: [],

      anchormenuappbar: null

      /** authentificaction gérer dans didmount*/
      //auth:auth user:user
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    //check si on est signined ou non pour référence : auth = !!user,
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in. on va chercher le statut du user dans firestore (et pas
        // auth)
        /* un user sur firebase, on a accès à
                     * nom,prenom,statut via firestore (users)
                     * id,email via auth
                     */
        let firestore = firebase.firestore();

        //recuperation de la liste d'eleves dans firebase
        var eleves = [];

        firestore
          .collection("eleves")
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let d = doc.data();
              let e = {
                id: doc.id,
                nom: d.nom,
                prenom: d.prenom,
                ddn: d.ddn
              };
              eleves.push(e);
            });
          })
          .catch(err => {
            console.log("Error getting documents", err);
          });

        //recupperation des profs dans firebase
        var profs = [];

        firestore
          .collection("users")
          .where("statut", "==", "prof")
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let d = doc.data();
              let p = {
                id: doc.id,
                nom: d.nom,
                prenom: d.prenom
              };
              profs.push(p);
            });
            console.log(profs);
          })
          .catch(err => {
            console.log("Error getting documents", err);
          });

        //recup la liste de rapports sur firebase
        var rapports = [];
        var users = [];
        var usertemp = {
          nom: null,
          prenom: null,
          statut: null
        };

        firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then(doc => {
            if (!doc.exists) {
              console.log("No such document!");
            } else {
              // user signined + entré users dans firestore, on update user avec le statut
              let d = doc.data();
              user.statut = d.statut;
              user.nom = d.nom;
              user.prenom = d.prenom;
            }
          })
          .catch(err => {
            console.log("Error getting document here", err);
          })
          .then(() => {
            /** user admin voit les rapports de tout les users, user pas admin voit uniquement ses propres rapports */
            if (user.statut === "admin") {
              //user est admin recup d'une liste de tous les users
              firestore
                .collection("users")
                .get()
                .then(snapusers => {
                  snapusers.forEach(doc => {
                    let data = doc.data();
                    let u = {
                      uid: doc.id,
                      nom: data.nom,
                      prenom: data.prenom
                    };
                    users.push(u);
                  });
                })
                .catch(err => {
                  console.log("Error getting document here", err);
                })
                .then(() => {
                  users.map(u => {
                    firestore
                      .collection("rapports")
                      .doc(u.uid)
                      .collection("messages")
                      .orderBy("date")
                      .get()
                      .then(snapshot => {
                        snapshot.forEach(doc => {
                          let d = doc.data();
                          let r = {
                            id: doc.id,
                            date: d.date,
                            eleve: d.eleve,
                            user: {
                              nom: u.nom,
                              prenom: u.prenom
                            },
                            texte: d.texte
                          };
                          rapports.push(r);
                        });
                      })
                      .catch(err => {
                        console.log("Error getting rapports", err);
                      });
                  });
                });
            } else {
              //user n'est pas admin, il voit que lui même
              firestore
                .collection("rapports")
                .doc(user.uid)
                .collection("messages")
                .orderBy("date")
                .get()
                .then(snapshot => {
                  snapshot.forEach(doc => {
                    let d = doc.data();
                    let r = {
                      id: doc.id,
                      date: d.date,
                      eleve: d.eleve,
                      user: {
                        nom: user.nom,
                        prenom: user.prenom
                      },
                      texte: d.texte
                    };
                    rapports.push(r);
                  });
                })
                .catch(err => {
                  console.log("Error getting rapports", err);
                });
            }
          })
          .then(() => {
            this.setState({
              user: user,
              eleves: eleves,
              profs: profs,
              rapports: rapports
            });
          });
      } else {
        // No user is signed in.
        this.setState({ user: null, eleves: [], profs: [], rapports: [] });
      }
    });
  }

  _ajoutEleve = e => {
    const { firebase } = this.props;

    var lol = this.state.eleves;
    /**update sur firebase + recupération de l'id*/
    firebase
      .firestore()
      .collection("eleves")
      .add(e)
      .then(doc => {
        e.id = doc.id;
        /** push sur liste local plutot que refaire get */
        lol.push(e);
        this.setState({ eleves: lol });
      });
  };

  _deleteEleve = e => {
    const { firebase } = this.props;
    const { user } = this.state;
    /**on retire eleve-id de firebaseref et de la liste */
    if (e !== null) {
      firebase
        .firestore()
        .collection("eleves")
        .doc(e.id)
        .delete() /** delete de eleve de firestore */
        .then(() => {
          let lol = this.state.eleves;
          let index = lol.indexOf(e);
          lol.splice(index, 1); /** delete de la liste locale */
          this.setState({ eleves: lol });
        });
    }
  };

  _addProf = p => {
    let lol = this.state.profs;
    lol.push(p);
    this.setState({ profs: lol });
  };

  _deleteProf = p => {
    const { firebase } = this.props;

    //delete dans auth
    /** ça devient compliqué xD */

    //delete dans firestore
    /** plutot que de delete le user on va changé son statut pour rendre inutilisable l'app */
    firebase
      .firestore()
      .collection("users")
      .doc(p.id)
      .update({
        statut: null
      })
      .then(() => {
        console.log("Document successfully written!");
        //delete dans liste local
        let lol = this.state.profs;
        let index = lol.indexOf(p);
        lol.splice(index, 1);
        this.setState({ profs: lol });
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  };

  _ajoutRapport = r => {
    const { firebase } = this.props;
    const { user } = this.state;

    var lol = this.state.rapports;
    firebase
      .firestore()
      .collection("rapports")
      .doc(user.uid)
      .collection("messages")
      .add(r)
      .then(doc => {
        r.id = doc.id;
        r.user = {
          nom: user.nom,
          prenom: user.prenom
        };
        lol.push(r);
        this.setState({ rapports: lol });
      });
  };

  _deleteRapport = r => {
    const { firebase } = this.props;
    const { user } = this.state;
    //retirer r de firestore
    firebase
      .firestore()
      .collection("rapports")
      .doc(user.uid)
      .collection("messages")
      .doc(r.id)
      .delete()
      .then(() => {
        //retirer r de state
        let lol = this.state.rapports;
        let index = lol.indexOf(r);
        lol.splice(index, 1); /** delete de la liste locale */
        this.setState({ rapports: lol });
      });
  };

  _logout = () => {
    const { firebase } = this.props;
    if (usefire) {
      /** ici on devrait une authntification avec firebase */
      firebase
        .auth()
        .signOut()
        .catch(function(error) {
          // Handle Errors here.
          console.log(`erreur login firebase`);
          // ...
        });
    }
  };

  _openmenuappbar = e => {
    this.setState({ anchormenuappbar: e.currentTarget });
  };

  _closemenuappbar = () => {
    this.setState({ anchormenuappbar: null });
  };

  // MARK: render eleveapp
  render() {
    const { classes, firebase, admin } = this.props;
    const { user, anchormenuappbar, eleves, rapports, profs } = this.state;
    const openmenuappbar = Boolean(anchormenuappbar);

    return (
      <div>
        <Router>
          <div>
            <Grid container spacing={0}>
              <Grid item xs={GRID_DRAWER_WIDTH}>
                <Paper>
                  <List>
                    <Paper className={classes.appbarh}>
                      {user && (
                        <Typography
                          variant="subheading"
                          color="inherit"
                          className={classes.textcenter}
                        >
                          {`${user.nom} ${user.prenom} ${
                            user.statut ? `\n ${user.statut}` : ""
                          }`}
                        </Typography>
                      )}
                    </Paper>
                    <Link to="/" className={classes.noUnderline}>
                      <ListItem button>
                        <ListItemText primary="Blog" />
                      </ListItem>
                    </Link>
                    {user && (
                      <div>
                        {["prof", "admin", "jedi"].includes(user.statut) && (
                          <div>
                            <NavLink
                              to="/eleves"
                              className={classes.link}
                              activeClassName={classes.activelink}
                            >
                              <ListItem button>
                                <ListItemText primary="Elèves" />
                              </ListItem>
                            </NavLink>
                            <Link
                              to="/rapports"
                              className={classes.noUnderline}
                            >
                              <ListItem button>
                                <ListItemText primary="Rapports" />
                              </ListItem>
                            </Link>
                            <Link
                              to="/addeleve"
                              className={classes.noUnderline}
                            >
                              <ListItem button>
                                <ListItemText primary="Ajouter Elève" />
                              </ListItem>
                            </Link>
                          </div>
                        )}
                        {["admin", "jedi"].includes(user.statut) && (
                          <div>
                            <Paper className={classes.adminpaper}>
                              <Typography
                                variant="subheading"
                                color="inherit"
                                className={classes.textcenter}
                              >
                                {`ADMIN`}
                              </Typography>
                            </Paper>
                            <Link to="/profs" className={classes.noUnderline}>
                              <ListItem button>
                                <ListItemText primary="Professeurs" />
                              </ListItem>
                            </Link>
                            <Link to="/addprof" className={classes.noUnderline}>
                              <ListItem button>
                                <ListItemText primary="Ajouter Professeur" />
                              </ListItem>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                    <Divider />
                    <Link to="/about" className={classes.noUnderline}>
                      <ListItem button>
                        <ListItemText primary="A Propos" />
                      </ListItem>
                    </Link>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={GRID_APP_WIDTH}>
                <AppBar position="static">
                  <Toolbar>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item xs={11}>
                        <Typography
                          variant="title"
                          color="inherit"
                          className={classes.textcenter}
                        >
                          SOSTAMA
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        {user ? (
                          <div>
                            <IconButton
                              aria-owns={openmenuappbar ? "menu-appbar" : null}
                              aria-haspopup="true"
                              onClick={this._openmenuappbar}
                              color="inherit"
                            >
                              <AccountCircle />
                            </IconButton>
                            <Menu
                              id="menu-appbar"
                              anchorEl={anchormenuappbar}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "right"
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right"
                              }}
                              open={openmenuappbar}
                              onClose={this._closemenuappbar}
                              onClick={this._closemenuappbar}
                            >
                              <Link
                                to="/profile"
                                className={classes.noUnderline}
                              >
                                <MenuItem>Profile</MenuItem>
                              </Link>
                              <Link to="/" className={classes.noUnderline}>
                                <MenuItem onClick={this._logout}>
                                  Logout
                                </MenuItem>
                              </Link>
                            </Menu>
                          </div>
                        ) : (
                          <Link to="/login" className={classes.noUnderline}>
                            <Button variant="raised" color="inherit">
                              Login
                            </Button>
                          </Link>
                        )}
                      </Grid>
                    </Grid>
                  </Toolbar>
                </AppBar>
                <div className={classes.space}>
                  {!user && (
                    <Switch id="routes_signout">
                      <Route
                        path="/login"
                        render={() => <Login firebase={firebase} user={user} />}
                      />
                      <Route path="/" exact={true} render={() => <Blog />} />
                      <Route path="/about" component={About} />
                    </Switch>
                  )}
                  {user && (
                    <Switch id="routes-signin">
                      <Route
                        path="/login"
                        exact
                        render={() => <Login firebase={firebase} user={user} />}
                      />
                      <Route path="/" exact render={() => <Blog />} />
                      <Route path="/about" exact component={About} />
                      <Route
                        path="/profile"
                        exact
                        render={() => <Profile user={user} />}
                      />
                      {["prof", "admin", "jedi"].includes(user.statut) && [
                        <Route
                          key="r-eleves"
                          path="/eleves"
                          exact={true}
                          render={props => (
                            <EleveListe
                              firebase={firebase}
                              liste={eleves}
                              deleteeleve={this._deleteEleve}
                              ajoutrapport={this._ajoutRapport}
                              user={user}
                            />
                          )}
                        />,
                        <Route
                          key="r-rapports"
                          path="/rapports"
                          render={() => (
                            <RapportListe
                              rapports={rapports.reverse()}
                              deleterapport={this._deleteRapport}
                              firebase={firebase}
                              user={user}
                            />
                          )}
                        />,
                        <Route
                          key="r-adddeleve"
                          path="/addeleve"
                          render={() => (
                            <EleveAdd
                              ajouteleve={this._ajoutEleve}
                              user={user}
                            />
                          )}
                        />
                      ]}
                      {["admin", "jedi"].includes(user.statut) && [
                        <Route
                          key="r-profs"
                          path="/profs"
                          render={() => (
                            <ProfListe
                              list={profs}
                              delete={this._deleteProf}
                              firebase={firebase}
                              user={user}
                            />
                          )}
                        />,
                        <Route
                          key="r-addprof"
                          path="/addprof"
                          render={() => (
                            <ProfAdd
                              addprof={this._addProf}
                              user={user}
                              admin={admin}
                              firebase={firebase}
                            />
                          )}
                        />
                      ]}
                      {user.statut === "jedi" && <div id="routes-jedi" />}
                      <Route component={Page404} />
                    </Switch>
                  )}
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
