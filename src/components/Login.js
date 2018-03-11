import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../decoration/Style'
import {withGridCol} from '../decoration/withGridCol'

import TextField from 'material-ui/TextField';
import {FormGroup, FormControl, FormHelperText} from 'material-ui/Form';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography/Typography';
import Grid from 'material-ui/Grid';
import {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

import {Route, Switch, Link, Redirect, HashRouter as Router} from "react-router-dom";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const useUI = false;

class Login extends Component {

    constructor(props) {
        super(props);

        // Firebase signin config.
        const {firebase} = props;
        const uiConfig = {
            // Popup signin flow rather than redirect flow.
            signInFlow: 'popup',

            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                // firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
            callbacks: {
                // Avoid redirects after sign-in.
                signInSuccess: () => false
            }
        };

        this.state = {
            uiConfig: uiConfig,
            email: "",
            password: "",
            require: false
        }

    }

    handleEmail = e => {
        this.setState({email: e.target.value})
    }

    handlePassword = e => {
        this.setState({password: e.target.value})
    }

    _login = () => {
        //ajout json eleve dans le fichier
        const {firebase} = this.props
        const {email, password} = this.state;
        if ((email === "") || (password === "")) {
            this.setState({require: "Veuillez remplir les champs requis."});
        } else {
            /** ici on devrait une authntification avec firebase */
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);
                });

        }
    };
    render() {
        const {classes, auth, firebase} = this.props;
        return (
            <div>
                {auth && <Redirect to="/"/>}
                <Grid container direction="column" alignItems="stretch">
                    <DialogContent>
                        {!auth && <div>
                            <DialogTitle>Veuillez vous authentifier</DialogTitle>
                            {useUI && <StyledFirebaseAuth
                                uiConfig={this.state.uiConfig}
                                firebaseAuth={firebase.auth()}/>}
                            <FormGroup>
                                {this.state.require && <FormHelperText error>{this.state.require}</FormHelperText>}
                                <TextField
                                    required
                                    id="email"
                                    label="Email"
                                    autoComplete="email"
                                    margin="normal"
                                    value={this.state.email}
                                    onChange={this.handleEmail}
                                    InputLabelProps={{
                                    shrink: true
                                }}/>
                                <TextField
                                    required
                                    id="password"
                                    label="Mot de Passe"
                                    type="password"
                                    autoComplete="current-password"
                                    margin="normal"
                                    value={this.state.password}
                                    onChange={this.handlePassword}
                                    InputLabelProps={{
                                    shrink: true
                                }}/>
                            </FormGroup>
                            <Router>
                                <DialogActions>
                                    <Button variant="raised" color="primary" onClick={this._login}>Login !</Button>
                                </DialogActions>
                            </Router>
                        </div>}
                    </DialogContent>
                </Grid>
            </div>
        )
    }
}

export default withStyles(Style)(Login);