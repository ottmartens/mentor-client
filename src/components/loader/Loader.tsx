import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
	loader: {
		margin: 'auto',
	},
}));

interface Props {
	className?: string;
	size?: string;
}

export default function Loader({ className, size }: Props) {
	const classes = useStyles();
	return <CircularProgress size={size} className={classNames(classes.loader, className)} />;
}
