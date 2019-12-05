import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography } from '@material-ui/core';
import { RouteProps } from 'react-router';
import { Link } from 'react-router-dom';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';

interface PropsState {
	title: string;
	description: string;
	urlToRedirect: string;
}

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		textAlign: 'center',
		height: '100%',
	},
	textArea: {
		marginBottom: '20px',
	},
	linkButton: {
		display: 'block',
		color: '#fff',
		fontSize: '1.075rem',
		textDecoration: 'none',
		borderRadius: '28px',
		backgroundColor: '#00ac9c',
		padding: '12px',
		margin: '20px',
		boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
	},
	image: {
		width: '100%',
	},
	title: {
		marginTop: '0',
	},
}));

export default function RedirectInfoView({ location }: RouteProps) {
	const { title, description, urlToRedirect }: PropsState = location && location.state;

	const classes = useStyles();
	const t = useTranslator();

	return (
		<Card className={classes.container}>
			<img className={classes.image} src="/images/checkmark.svg" />
			<div className={classes.textArea}>
				<h1 className={classes.title}>{title}</h1>
				<Typography variant="body2" color="textSecondary" component="p">
					{description}
				</Typography>
			</div>
			<Link className={classes.linkButton} to={urlToRedirect}>
				{t(Translation.GOT_IT)}
			</Link>
		</Card>
	);
}
