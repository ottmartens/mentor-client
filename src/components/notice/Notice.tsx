import React from 'react';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

const useStyles = makeStyles((theme) => ({
	success: {
		backgroundColor: green[600],
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	info: {
		backgroundColor: theme.palette.primary.main,
	},
	warning: {
		backgroundColor: amber[700],
	},
	icon: {
		fontSize: 20,
	},
	iconVariant: {
		opacity: 0.9,
		marginRight: theme.spacing(1),
	},
	title: {
		margin: '0',
		display: 'flex',
		alignItems: 'center',
	},
}));

function NoticeWrapper(props) {
	const classes = useStyles();
	const { className, message, onClose, variant, title, ...other } = props;
	const Icon = variantIcon[variant];

	return (
		<SnackbarContent
			className={clsx(classes[variant], className)}
			aria-describedby="client-snackbar"
			message={
				<>
					<h2 className={classes.title}>
						<Icon className={clsx(classes.icon, classes.iconVariant)} />
						{title}
					</h2>
					<span id="client-snackbar">{message}</span>
				</>
			}
			action={[
				<IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
					<CloseIcon className={classes.icon} />
				</IconButton>,
			]}
			{...other}
		/>
	);
}

interface NoticeProps {
	title?: string;
	message?: string;
	variant?: 'error' | 'info' | 'success' | 'warning';
	verticalPlacement?: 'bottom' | 'top';
	horizontalPlacement?: 'left' | 'right' | 'center';
}

export default function Notice(
	{ message, variant, verticalPlacement, horizontalPlacement, title }: NoticeProps = { message: '' },
) {
	const [open, setOpen] = React.useState(true);

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Snackbar
			anchorOrigin={{
				vertical: verticalPlacement ? verticalPlacement : 'top',
				horizontal: horizontalPlacement ? horizontalPlacement : 'center',
			}}
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
		>
			<NoticeWrapper variant={variant ? variant : 'info'} message={message} onClose={handleClose} title={title} />
		</Snackbar>
	);
}
