import React from 'react';
import { HasUserProps } from '../../types';
import Navbar from '../navbar/Navbar';
import { Container } from '@material-ui/core';

interface Props extends HasUserProps {
	children?: React.ReactNode;
}

export default function WithNavigation({ user, children }: Props) {
	return (
		<div>
			<Navbar user={user} />
			<Container maxWidth="sm">{children}</Container>
		</div>
	);
}
