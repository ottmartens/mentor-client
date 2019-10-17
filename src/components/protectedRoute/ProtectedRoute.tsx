import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { parseUser } from '../../services/auth';
import { User } from '../../types';

export function ProtectedRoute({ component, ...rest }: RouteProps) {
	return (
		<Route
			{...rest}
			render={(routeProps) => {
				const user: User | undefined = parseUser();

				// if not logged in, redirect to login
				if (!user) {
					return <Redirect to="/login" />;
				}

				// if profile info missing, redirect to profile
				/* if (
					(!user.firstName || !user.lastName || !user.imageUrl) &&
					routeProps.location.pathname !== '/member/profile'
				) {
					return <Redirect to="/member/profile" />;
				} */

				return renderMergedProps(component, routeProps, { user });
			}}
		/>
	);
}

// https://github.com/ReactTraining/react-router/issues/4105
function renderMergedProps(component, ...rest) {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
}
