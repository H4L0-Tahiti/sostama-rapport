import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../decoration/Style'
import {withGridCol} from '../decoration/withGridCol'

import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography/Typography';
import Grid from 'material-ui/Grid';
import {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

import {Redirect} from "react-router-dom";

class Profile extends Component {

    render() {
        const {user,classes} = this.props;
        return (
            <div>
            {!user && <Redirect to="/"/>}
                <Grid container direction="column" alignItems="stretch">
                    <DialogTitle>Profil Utilisateur</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.textformat}>{`Profil de l'utilisateur actuel : ${user.email}`}</DialogContentText>                        
                    </DialogContent>
                </Grid>
            </div>
        )
    }
}

export default withStyles(Style)(Profile);