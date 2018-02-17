import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography/Typography';
import Grid from 'material-ui/Grid';

export default class About extends Component {

    render() {
        return (
            <div>
            <Grid container direction="column" alignItems="stretch">
                    <Typography>A PROPOS</Typography>
                </Grid>
            </div>
        )
    }
}