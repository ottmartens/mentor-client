import React from 'react';
import Navbar from '../navbar/Navbar';
import { Container, makeStyles } from '@material-ui/core';
import { HasUserProps } from '../../types';

interface Props extends HasUserProps {
	children?: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
	container: {
		background: '#FFFFFFE6',
		borderRadius: 10,
		paddingTop: '10px',
		paddingBottom: '10px',
		marginTop: '10px',
		marginBottom: '10px',
	},
}));

export default function WithNavigation({ children, user }: Props) {
	const classes = useStyles();
	return (
		<div>
			<Navbar user={user} />
			<Container className={classes.container} maxWidth="sm">
				{children}
			</Container>
		</div>
	);
}
