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
	HEALTH = "/api/health"
}

type UseBackendReturnValue = [
	() => void,
	{ data: any; loading: boolean; error: any }
];

export default function useBackend(
	requestMethod: RequestMethod,
	endPoint: EndPoint,
	variables?: any
): UseBackendReturnValue {
	const [data, setData] = React.useState(undefined);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(undefined);

	function onSubmit() {
		setLoading(true);
		axios({
			method: requestMethod,
			url: `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}${endPoint}`,
			data: variables
		})
			.then(res => setData(res.data))
			.catch(err => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return [onSubmit, { data, loading, error }];
}
