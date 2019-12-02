import React from 'react';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
	title: {
		textAlign: 'center',
		color: '#2c4d7f',
	},
}));

export default function CompleteActivityView() {
	const classes = useStyles();
	return (
		<>
			<h1 className={classes.title}>Complete activity</h1>
			<Card>
				<input type="file" accept="image/*;capture=camera" />
			</Card>
		</>
	);
}
