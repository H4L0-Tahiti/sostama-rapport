import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Dialog, {DialogContent, DialogContentText} from 'material-ui/Dialog';

import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
    return <Slide direction="down" {...props}/>;
}

export default class Alert extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {open, onClose, text}=this.props;
        return (
            <Dialog
                open={open}
                transition={Transition}
                onClose={onClose}>
                <DialogContent>
                    <DialogContentText>
                        {`${text}`}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        )
    }
}