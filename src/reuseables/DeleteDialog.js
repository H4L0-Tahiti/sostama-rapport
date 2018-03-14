import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

export default class DeleteDialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {open, onClose, deleteAction, prompt, title}=this.props;
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{`${title}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`${prompt}`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary" autoFocus>
                        Annuler
                    </Button>
                    <Button onClick={deleteAction} color="primary">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}