import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import WithNavigation from '../withNavigation/WithNavigation';
import { UserContext, UserContextUser } from '../../contexts/UserContext';
import { getUserToken } from '../../services/auth';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import Loader from '../loader/Loader';
import { UserRole } from '../../types';

export function ProtectedRoute({ component, ...rest }: RouteProps) {
	const userContext = React.useContext(UserContext);
	const user = userContext && userContext.user;
	const setUser = userContext && userContext.setUser;
	const token = getUserToken();

	const [getUserInfo, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.USER,
		authToken: token,
		skip: !!user || !token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		getUserInfo();
	}, [called, getUserInfo]);

	// set user
	React.useEffect(() => {
		if (!data || !setUser || !token) {
			return;
		}
		setUser({ ...data, token: token });
	}, [data, setUser]);

	return (
		<Route
			{...rest}
			render={(routeProps) => {
				// if not logged in, redirect to login
				if (!user && !token) {
					return <Redirect to="/login" />;
				}
				if (token && !user && (loading || !data)) {
					return <Loader />;
				}

				if (!user) {
					return null;
				}

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

function redirectToSteps(routeProps: RouteProps, user: UserContextUser) {
	switch (user.role) {
		case UserRole.MENTEE:
			break;
		case UserRole.MENTOR:
			break;
		case UserRole.ADMIN:
			break;
	}
}
