import React from 'react';
import Navbar from '../navbar/Navbar';
import { Container, makeStyles } from '@material-ui/core';
import { HasUserProps } from '../../types';

interface Props extends HasUserProps {
	children?: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
	container: {
		padding: '8px',
		height: 'calc(100% - 48px)',
	},
	wrap: {
		height: '100%',
	},
}));

export default function WithNavigation({ children, user }: Props) {
	const classes = useStyles();
	return (
		<div className={classes.wrap}>
			<Navbar user={user} />
			<Container className={classes.container} maxWidth="sm">
				{children}
			</Container>
		</div>
	);
}
