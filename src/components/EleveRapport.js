import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Style from '../decoration/Style'

import TextField from 'material-ui/TextField';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import {FormGroup, FormControl, FormHelperText} from 'material-ui/Form';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import AppBar from 'material-ui/AppBar/AppBar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Typography from 'material-ui/Typography/Typography';

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    return <Slide direction="left" {...props}/>;
}


class EleveRapport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eleve: props.eleve
        }
    }

    _annuler = () => {
        this
            .props //callbaaaack pour ramener le state au parent
            .onClose()
    };

    _mail = () => {
        console.log("yeee ça mail");
        this
            .props
            .onClose()
    };

    render() {
        const {classes} = this.props
        var e = this.state.eleve;
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.handleClose} fullScreen={true} transition={Transition}>
                    <AppBar>
                        <Toolbar>
                            <IconButton onClick={this._annuler} aria-label="Close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                {e.nom + " " + e.prenom + " " + e.ddn}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.appbarh}/>
                    <DialogContent>
                        <FormGroup>
                            <TextField
                                multiline
                                fullWidth
                                label="Rédiger votre rapport"
                                rows="10"
                                helperText="Une fois votre rapport rédigé, appuyez sur le boutton Mail"/>
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this._annuler}>Annuler</Button>
                        <Button variant='raised' onClick={this._mail} color="primary">
                            Mail to boss
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(Style)(EleveRapport)
