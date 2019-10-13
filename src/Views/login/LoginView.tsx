import React from "react";
import { Container, makeStyles, Button } from "@material-ui/core";
import useInput from "../../hooks/useInput";
import useBackend, { RequestMethod, EndPoint } from "../../hooks/useBackend";
import { Redirect } from "react-router";
import Field from "../../components/field/Field";

const useStyles = makeStyles(theme => ({
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		flexGrow: 1
	}
}));

export default function LoginView() {
	const classes = useStyles();
	const input = {
		email: useInput(),
		password: useInput()
	};

	const [requestFn, { data, loading }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.LOGIN,
		variables: {
			email: input.email.value,
			password: input.password.value
		}
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	if (data && data.success) {
		localStorage.setItem("mentorAppUser", JSON.stringify(data.account));
		return <Redirect to="/mentor-group-list" />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			<form
				onSubmit={e => {
					e.preventDefault();
					requestFn();
				}}
			>
				<div>
					<Field {...input.email} label="E-mail" type="text" />
				</div>
				<div>
					<Field
						{...input.password}
						label="Password"
						type="password"
					/>
				</div>
				<Button type="submit" variant="contained" color="primary">
					LOG IN
				</Button>
			</form>
		</Container>
	);
}
