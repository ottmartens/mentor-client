import React from 'react';
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { queryPrefix, BASE_URL } from '../services/variables';
dotenv.config();

export enum RequestMethod {
	POST = 'post',
	GET = 'get',
	DELETE = 'delete',
}

export enum EndPoint {
	REGISTER = '/user/new',
	LOGIN = '/user/login',
	UPDATE_PROFILE = '/user/edit',
	USER = '/user/self',
	OTHER_USER = '/user/',
	HEALTH = '/health',
	GROUPS = '/groups',
	JOIN_GROUP = '/groups/join',
	HANDLE_GROUP_JOIN_REQUEST = '/groups/accept-joining',
	GROUP_EDIT = '/groups/edit-group',
	GET_AVAILABLE_MENTORS = '/available-mentors',
	MAKE_GROUP_CREATE_REQUEST = '/groups/request-creation',
	ACCEPT_GROUP_CREATE_REQUEST = '/groups/accept-creation',
	MY_GROUP = '/groups/my-group',
	UPDATE_ACTIVITIES = '/template-activities',
	UNVERIFIED_ACTIVITIES = '/unverified-activities',
	VERIFY_ACTIVITY = '/activity/verify',
	SETTINGS = '/global-settings',
	SET_SETTINGS = '/set-global-settings',
	ALL_USERS = '/all-users',
	GET_ACTIVITIES = '/template-activities',
	SELF_DELETE = '/user',
	ACTIVITIES = '/activity',
	VERIFY_USER = '/user/verify',
}

interface Props {
	requestMethod: RequestMethod;
	endPoint: EndPoint;
	endPointUrlParam?: string | number;
	variables?: any;
	authToken?: string;
	skip?: boolean;
}

interface SubmitProps {
	overrideVariables?: any;
}

interface BackendResponse {
	message: string;
	success: boolean;
	data?: any;
}

type UseBackendReturnValue = [
	(props?: SubmitProps) => Promise<void> | void,
	{ data: any; loading: boolean; error: any; called: boolean },
];

export default function useBackend({
	requestMethod,
	endPoint,
	endPointUrlParam,
	variables,
	authToken,
	skip,
}: Props): UseBackendReturnValue {
	const [data, setData] = React.useState<any>(undefined);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | undefined>(undefined);
	const [called, setCalled] = React.useState(false);
	const queryVariables = variables ? variables : {};

	// does pre query actions like validation(?) and parameter overriding
	function onSubmit({ overrideVariables }: SubmitProps = {}): Promise<void> | void {
		const queryOverrideVariables = overrideVariables ? overrideVariables : {};
		const sendData = { ...queryVariables, ...queryOverrideVariables };

		// reset error
		if (error) {
			setError(undefined);
		}

		if (skip) {
			return;
		}
		return makeRequest(sendData);
	}

	//builds up request url
	function buildUrl() {
		return `${BASE_URL}${queryPrefix}${endPoint}${endPointUrlParam ? `/${endPointUrlParam}` : ''}`;
	}

	// makes request to the backend and sets data, error and loading
	function makeRequest(queryVariables): Promise<void> {
		setCalled(true);
		setLoading(true);
		return axios({
			headers: authToken ? { Authorization: authToken } : undefined,
			method: requestMethod,
			url: buildUrl(),
			data: queryVariables,
		})
			.then((res: AxiosResponse<BackendResponse>) => {
				res.data.success ? setData(res.data.data) : setError(res.data.message);
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return [onSubmit, { data, loading, error, called }];
}
