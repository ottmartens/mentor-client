import React from "react";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export enum RequestMethod {
	POST = "post",
	GET = "get"
}

export enum EndPoint {
	REGISTER = "/api/user/new",
	LOGIN = "/api/user/login",
	HEALTH = "/api/health",
	GROUPS = "/api/groups"
}

interface Props {
	requestMethod: RequestMethod;
	endPoint: EndPoint;
	endPointUrlParam?: string;
	variables?: any;
}

type UseBackendReturnValue = [
	() => void,
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

	function onSubmit() {
		setCalled(true);
		setLoading(true);
		axios({
			method: requestMethod,
			url: `${process.env.REACT_APP_BACKEND_URL}:${
				process.env.REACT_APP_BACKEND_PORT
			}${endPoint}${endPointUrlParam ? `/${endPointUrlParam}` : ""}`,
			data: variables ? variables : undefined
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
