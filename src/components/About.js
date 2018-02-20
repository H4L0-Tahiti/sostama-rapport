import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../decoration/Style'
import {withGridCol} from '../decoration/withGridCol'

import Typography from 'material-ui/Typography/Typography';
import Grid from 'material-ui/Grid';
import {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';

const ABOUT_TEXT = "ceci est un text Ceic est un paragraphe \n Test est ce que Ca marche.Ptet "

class About extends Component {

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container direction="column" alignItems="stretch">
                    <DialogTitle>A PROPOS</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.textformat}>{ABOUT_TEXT}</DialogContentText>
                    </DialogContent>
                </Grid>
            </div>
        )
    }
}

export default withStyles(Style)(About);