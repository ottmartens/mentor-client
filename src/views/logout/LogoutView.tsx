import React from 'react';
import { removeUserToken } from '../../services/auth';
import { Redirect } from 'react-router';

export default function LogoutView() {
	if (removeUserToken()) {
		return <Redirect to="/" />;
	}

	return null;
}
