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
	}, [data, setUser, token]);

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
				const redirectInfo = redirectToSteps(routeProps, user, t);
				if (redirectInfo) {
					return <Redirect to={{ pathname: redirectInfo.pathname, state: redirectInfo.state }} />;
				}

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
	const unfinishedProfileAllowedRoutes = ['/logout', '/member/profile', '/member/redirect-info-view'];
	const noGroupMenteeAllowedRoutes = ['/member/mentor-group-list', '/member/mentor-group/:id', '/member/user/:id'];
	const noGroupMentorAllowedRoutes = [
		'/member/find-co-mentor',
		'/member/mentor-group-list',
		'/member/mentor-group/:id',
		'/member/user/:id',
	];
	switch (user.role) {
		/* MENTEE */
		case UserRole.MENTEE:
			// if unfinished profile
			if (
				(!user.name || !user.imageUrl) &&
				routeProps.match &&
				!unfinishedProfileAllowedRoutes.includes(routeProps.match.path)
			) {
				return {
					pathname: '/member/redirect-info-view',
					state: {
						title: t(Translation.REDIRECT_ALMOST_DONE),
						description: t(Translation.REDIRECT_PROFILE_FILL),
						urlToRedirect: '/member/profile',
					},
				};
			}
			// if is not verified
			// TODO

			// if not mentorgroup found
			if (
				!user.groupId &&
				routeProps.match &&
				![...unfinishedProfileAllowedRoutes, ...noGroupMenteeAllowedRoutes].includes(routeProps.match.path)
			) {
				console.log(routeProps);

				return {
					pathname: '/member/redirect-info-view',
					state: {
						title: t(Translation.REDIRECT_FIND_GROUP),
						description: t(Translation.REDIRECT_FIND_GROUP_INFO_MENTEE),
						urlToRedirect: '/member/mentor-group-list',
					},
				};
			}

		/* MENTOR */
		case UserRole.MENTOR:
			// if unfinished profile
			if (
				(!user.name || !user.imageUrl) &&
				routeProps.match &&
				!unfinishedProfileAllowedRoutes.includes(routeProps.match.path)
			) {
				return {
					pathname: '/member/redirect-info-view',
					state: {
						title: t(Translation.REDIRECT_ALMOST_DONE),
						description: t(Translation.REDIRECT_PROFILE_FILL),
						urlToRedirect: '/member/profile',
					},
				};
			}

			// if is not verified
			// TODO

			// if no mentorgroup is found
			if (
				!user.groupId &&
				routeProps.match &&
				![...unfinishedProfileAllowedRoutes, ...noGroupMentorAllowedRoutes].includes(routeProps.match.path)
			) {
				return {
					pathname: '/member/redirect-info-view',
					state: {
						title: t(Translation.REDIRECT_MAKE_GROUP),
						description: t(Translation.REDIRECT_MAKE_GROUP_INFO_MENTOR),
						urlToRedirect: '/member/find-co-mentor',
					},
				};
			}
			break;

		/* ADMIN */
		case UserRole.ADMIN:
			break;
		default:
			assertNever(user.role);
			break;
	}
}

// https://github.com/ReactTraining/react-router/issues/4105
export function renderMergedProps(component, ...rest) {
	const finalProps = Object.assign({}, ...rest);
	return React.createElement(component, finalProps);
}
