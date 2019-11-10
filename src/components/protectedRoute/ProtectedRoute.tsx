import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import WithNavigation from '../withNavigation/WithNavigation';
import { UserContextUser, UserContext } from '../../contexts/UserContext';

export function ProtectedRoute({ component, ...rest }: RouteProps) {
	const userContext = React.useContext(UserContext);
	return (
		<Route
			{...rest}
			render={(routeProps) => {
				const user: UserContextUser | null = userContext && userContext.user;

				// if not logged in, redirect to login
				if (!user) {
					return <Redirect to="/login" />;
				}

				// if profile info missing, redirect to profile
				/* if ((!user.firstName || !user.lastName) && routeProps.location.pathname !== '/member/profile') {
					return <Redirect to="/member/profile" />;
				} */

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
