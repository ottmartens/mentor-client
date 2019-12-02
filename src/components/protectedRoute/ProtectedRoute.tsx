import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import WithNavigation from '../withNavigation/WithNavigation';
import { UserContext, UserContextUser } from '../../contexts/UserContext';
import { getUserToken } from '../../services/auth';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import Loader from '../loader/Loader';
import { UserRole } from '../../types';
import { StaticContext, RouteComponentProps } from 'react-router';
import assertNever from '../../services/assertNever';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';

export function ProtectedRoute({ component, ...rest }: RouteProps) {
	const userContext = React.useContext(UserContext);
	const user = userContext && userContext.user;
	const setUser = userContext && userContext.setUser;
	const token = getUserToken();

	const t = useTranslator();

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
		setUser({ ...data, token: token, id: data.ID });
	}, [data, setUser]);

	return (
		<Route
			{...rest}
			render={(routeProps) => {
				// if not logged in, redirect to login
				if (!user && !token) {
					return <Redirect to="/" />;
				}
				if (token && !user && (loading || !data)) {
					return <Loader />;
				}

				if (!user) {
					return null;
				}

				// redirect if something is missing
				redirectToSteps(routeProps, user, t);

				return <WithNavigation user={user}>{renderMergedProps(component, routeProps, { user })}</WithNavigation>;
			}}
		/>
	);
}

function redirectToSteps(
	routeProps: RouteComponentProps<any, StaticContext, any>,
	user: UserContextUser,
	t: (t: Translation) => string,
) {
	switch (user.role) {
		case UserRole.MENTEE:
			if (
				(!user.name || !user.imageUrl) &&
				routeProps.location &&
				routeProps.location.pathname !== '/member/profile' &&
				routeProps.location.pathname !== '/member/redirect-info-view'
			) {
				routeProps.history.push({
					pathname: '/member/redirect-info-view',
					state: {
						title: t(Translation.REDIRECT_ALMOST_DONE),
						description:
							'There are a few things we need to do to get you up and running. Please fill out your profile info first.',
						urlToRedirect: '/member/profile',
					},
				});
			}
			break;
		case UserRole.MENTOR:
			if (
				(!user.name || !user.imageUrl) &&
				routeProps.location &&
				routeProps.location.pathname !== '/member/profile' &&
				routeProps.location.pathname !== '/member/redirect-info-view'
			) {
				routeProps.history.push({
					pathname: '/member/redirect-info-view',
					state: {
						title: t(Translation.REDIRECT_ALMOST_DONE),
						description:
							'There are a few things we need to do to get you up and running. Please fill out your profile info first.',
						urlToRedirect: '/member/profile',
					},
				});
			}

			break;
		case UserRole.ADMIN:
			break;
		default:
			assertNever(user.role);
	}
}

// https://github.com/ReactTraining/react-router/issues/4105
export function renderMergedProps(component, ...rest) {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
}
