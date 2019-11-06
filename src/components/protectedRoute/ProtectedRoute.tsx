import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import WithNavigation from '../withNavigation/WithNavigation';
import { getUserToken } from '../../services/auth';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';

export function ProtectedRoute({ component, ...rest }: RouteProps) {
	const [user, setUser] = React.useState();
	const token: string | null = getUserToken();

	const [getUser, { data: userData, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.USER,
		skip: !token,
	});

	React.useEffect(() => {
		if (called || !token) {
			return;
		}
		getUser();
	}, [called, token, getUser]);

	React.useEffect(() => {
		if (!userData) {
			return;
		}
		setUser(userData);
	}, [userData, user]);
	return (
		<Route
			{...rest}
			render={(routeProps) => {
				// if not logged in, redirect to login
				if (!token || (called && !loading && !userData)) {
					return <Redirect to="/login" />;
				}

				if (loading || !user) {
					return <div>Loading...</div>;
				}
				// handle redirects

				return <WithNavigation user={user}>{renderMergedProps(component, routeProps, { user })}</WithNavigation>;
			}}
		/>
	);
}

// https://github.com/ReactTraining/react-router/issues/4105
function renderMergedProps(component, ...rest) {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
}
