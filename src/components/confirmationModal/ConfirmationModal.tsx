import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ConfirmationModal({ title, description, isOpen, onSubmit, onClose }) {
	return (
		<Dialog open={isOpen}>
			<DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">{description}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Tühista
				</Button>
				<Button onClick={onSubmit} variant="contained" color="secondary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
}