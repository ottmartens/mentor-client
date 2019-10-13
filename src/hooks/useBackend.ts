import React from "react";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export enum RequestMethod {
	POST = "post",
	GET = "get"
}

export enum EndPoint {
	REGISTER = "/user/new",
	LOGIN = "/user/login",
	HEALTH = "/health",
	GROUPS = "/groups",
	JOIN_GROUP = "/groups/join",
	ACCEPT_OR_REJECT_GROUP_JOIN_REQUEST = "/groups/accept-joining"
}

interface Props {
	requestMethod: RequestMethod;
	endPoint: EndPoint;
	endPointUrlParam?: string;
	variables?: any;
}

interface SubmitProps {
	overrideVariables?: any;
}

type UseBackendReturnValue = [
	(props?: SubmitProps) => void,
	{ data: any; loading: boolean; error: any; called: boolean }
];

export default function useBackend({
	requestMethod,
	endPoint,
	endPointUrlParam,
	variables
}: Props): UseBackendReturnValue {
	const [data, setData] = React.useState(undefined);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(undefined);
	const [called, setCalled] = React.useState(false);

	function onSubmit(props?: SubmitProps): void {
		const overrideVariables =
			(props && props.overrideVariables) || undefined;
		const queryVariables =
			variables && overrideVariables
				? { ...variables, ...overrideVariables }
				: variables
				? variables
				: overrideVariables
				? overrideVariables
				: undefined;
		setCalled(true);
		setLoading(true);
		axios({
			method: requestMethod,
			url: `${process.env.REACT_APP_BACKEND_URL}:${
				process.env.REACT_APP_BACKEND_PORT
			}/api${endPoint}${endPointUrlParam ? `/${endPointUrlParam}` : ""}`,
			data: queryVariables
		})
			.then(res => setData(res.data))
			.catch(err => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return [onSubmit, { data, loading, error, called }];
}
