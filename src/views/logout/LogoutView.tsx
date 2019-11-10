import React from 'react';
import { removeUserToken } from '../../services/auth';
import { Redirect } from 'react-router';
import { UserContext } from '../../contexts/UserContext';

export default function LogoutView() {
	// state
	const [redirect, willRedirect] = React.useState<boolean>(false);

	// context
	const userContext = React.useContext(UserContext);
	const setUser = userContext && userContext.setUser;

	// set user to context if request is successful
	React.useEffect(() => {
		if (!setUser) {
			return;
		}
		setUser(null);
		willRedirect(true);
	}, [setUser]);

	// redirect after successful request
	if (redirect) {
		return <Redirect to="/" />;
	}
}
