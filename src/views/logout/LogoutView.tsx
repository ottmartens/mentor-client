import React from 'react';
import { Redirect } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { removeUserToken } from '../../services/auth';

export default function LogoutView() {
	// context
	const userContext = React.useContext(UserContext);
	const setUser = userContext && userContext.setUser;

	// set user to context if request is successful
	React.useEffect(() => {
		if (!setUser) {
			return;
		}
		removeUserToken();
		setUser(null);
	}, [setUser]);

	return null;
}
