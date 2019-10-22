import React from 'react';
import { logout } from '../../services/auth';
import { Redirect } from 'react-router';

export default function LogoutView() {
	if (logout()) {
		return <Redirect to="/" />;
	}

	return null;
}
