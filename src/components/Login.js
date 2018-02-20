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

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            login: "",
            password: "",
            require: false
        }

    }

    handleLogin = e => {
        this.setState({login: e.target.value})
    }

    handlePassword = e => {
        this.setState({password: e.target.value})
    }

    _login = e => {
        //ajout json eleve dans le fichier
        if ((this.state.login === "") || (this.state.password === "")) {
            this.setState({require: "Veuillez remplir les champs requis."});
        } else {
            this
                .props/** retour vers EleveApp */
                .login();
        }
    };
    render() {
        const {classes, auth} = this.props;
        return (
            <div>
                {auth && <Redirect to="/"/>}
                <Grid container direction="column" alignItems="stretch">
                    <DialogTitle>Veuillez vous authentifier</DialogTitle>
                    <DialogContent>
                        <FormGroup>
                            {this.state.require && <FormHelperText error>{this.state.require}</FormHelperText>}
                            <TextField
                                required
                                id="login"
                                label="Login"
                                autoComplete="username"
                                margin="normal"
                                value={this.state.login}
                                onChange={this.handleLogin}
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
                    </DialogContent>
                </Grid>
            </div>
        )
    }
}

export default withStyles(Style)(Login);