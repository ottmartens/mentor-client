import React from 'react';
import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	loader: {
		margin: 'auto',
	},
}));

export default function Loader() {
	const classes = useStyles();
	return <CircularProgress className={classes.loader} />;
}
