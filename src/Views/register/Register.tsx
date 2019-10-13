import React from "react";
import Button from "@material-ui/core/Button";
import { Container, makeStyles } from "@material-ui/core";
import useInput from "../../hooks/useInput";
import Field from "../../Components/field/Field";
import useBackend, { RequestMethod, EndPoint } from "../../hooks/useBackend";
import RadioButtonField from "../../Components/radioButtonField/RadioButtonField";

const useStyles = makeStyles(theme => ({
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		flexGrow: 1
	}
}));

export default function RegisterView() {
	const classes = useStyles();
	const radioButtonOptions = [
		{ value: "MENTOR", label: "Mentor" },
		{ value: "MENTEE", label: "Mentee" }
	];

	const input = {
		email: useInput(),
		password: useInput(),
		role: useInput(radioButtonOptions[0].value)
	};

	const [requestFn, { data, error, loading }] = useBackend(
		RequestMethod.POST,
		EndPoint.REGISTER,
		{
			email: input.email.value,
			password: input.password.value,
			role: input.role.value
		}
	);

	if (loading) {
		return <div>Loading...</div>;
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
				<div>
					<RadioButtonField
						{...input.role}
						formLabel="Roll"
						options={radioButtonOptions}
					/>
				</div>
				<Button type="submit" variant="contained" color="primary">
					REGISTER
				</Button>
			</form>
		</Container>
	);
}