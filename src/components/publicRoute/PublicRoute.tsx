import React from 'react';
import { RouteProps, Redirect, Route } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { getUserToken } from '../../services/auth';
import useTranslator from '../../hooks/useTranslator';
import Loader from '../loader/Loader';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { renderMergedProps } from '../protectedRoute/ProtectedRoute';

export function PublicRoute({ component, ...rest }: RouteProps) {
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
		if (called || !!user || !token) {
			return;
		}
		getUserInfo();
	}, [called, getUserInfo]);

	// set user
	React.useEffect(() => {
		if (!data || !setUser || !token) {
			return;
		}
		setUser({ ...data, token: token, id: data.ID });
	}, [data, setUser]);

	return (
		<Route
			{...rest}
			render={(routeProps) => {
				// if not logged in, redirect to login
				if (user) {
					return <Redirect to="/member/mentor-group-list" />;
				}
				if (token && !user && (loading || !data)) {
					return <Loader />;
				}

				return renderMergedProps(component, routeProps);
			}}
		/>
	);
}
