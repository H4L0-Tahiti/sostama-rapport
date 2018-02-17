import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import AppBar from 'material-ui/AppBar/AppBar';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import Typography from 'material-ui/Typography/Typography';


//marche !
export default class EleveRapport extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eleve: props.eleve
        }
    }

    handleClose = () => {
        this
            .props //callbaaaack pour ramener le state au parent
            .onClose()
    };

    handleMail = () => {
        console.log("yeee ça mail");
        this
            .props
            .onClose()
    };

    render() {
        var e = this.state.eleve;
        return (
            <div>
                <Dialog open={this.props.open} onClose={this.handleClose} fullScreen={true}>
                    <AppBar>
                        <Toolbar>
                            <IconButton onClick={this.handleClose} aria-label="Close">
                                <CloseIcon/>
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                {e.nom + " " + e.prenom + " " + e.ddn}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <DialogTitle id="alert-dialog-title">{"."}</DialogTitle>
                    <DialogContent>
                        <TextField
                            multiline
                            fullWidth
                            label="Rédiger votre rapport"
                            rows="10"
                            helperText="Une fois votre rapport rédigé, appuyez sur le boutton Mail"/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='raised' onClick={this.handleMail} color="primary">
                            Mail to boss
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
