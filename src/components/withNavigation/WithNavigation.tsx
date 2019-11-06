import React from 'react';
import Navbar from '../navbar/Navbar';
import { Container } from '@material-ui/core';
import { HasUserProps } from '../../types';

interface Props extends HasUserProps {
	children?: React.ReactNode;
}

export default function WithNavigation({ children, user }: Props) {
	return (
		<div>
			<Navbar user={user} />
			<Container maxWidth="sm">{children}</Container>
		</div>
	);
}
