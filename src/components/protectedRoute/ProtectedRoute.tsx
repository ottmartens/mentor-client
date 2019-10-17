import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { parseUser } from '../../services/auth';

export function ProtectedRoute({ component, ...rest }: RouteProps) {
	return (
		<Route
			{...rest}
			render={(routeProps) => {
				const user = parseUser();

				if (!user) {
					return <Redirect to="/login" />;
				}
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
