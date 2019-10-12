import React from "react";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export enum RequestMethod {
	POST = "post",
	GET = "get"
}

export enum EndPoints {
	REGISTER = "/api/user/new",
	LOGIN = "/api/user/login",
	HEALTH = "/api/health"
}

export default function useBackend(
	requestMethod: RequestMethod,
	endPoint: EndPoints
) {
	const [data, setData] = React.useState();
	const [loading, setLoading] = React.useState<boolean>();
	const [error, setError] = React.useState();
	React.useEffect(() => {
		setLoading(true);
		axios({
			method: requestMethod,
			url: `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}${endPoint}`
		})
			.then(res => setData(res.data))
			.catch(err => {
				setError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [requestMethod, endPoint]);

	return { data, loading, error };
}
