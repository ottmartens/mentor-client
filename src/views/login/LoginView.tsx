import React from 'react';
import { Container, makeStyles, Button } from '@material-ui/core';
import useInput, { UseInput } from '../../hooks/useInput';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Redirect } from 'react-router';
import Field from '../../components/field/Field';
import { isSet, isEmail, validateInputs } from '../../services/validators';
import Notice from '../../components/notice/Notice';
import { setUserToken } from '../../services/auth';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexGrow: 1,
		padding: '30px',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		flexGrow: 1,
		textAlign: 'center',
	},
	button: {
		marginTop: '20px',
	},
}));

export default function LoginView() {
	const classes = useStyles();
	const input: { [s: string]: UseInput } = {
		email: useInput({ validators: [isSet, isEmail] }),
		password: useInput({ validators: [isSet] }),
	};

	const [requestFn, { data, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.LOGIN,
		variables: {
			email: input.email.value,
			password: input.password.value,
		},
	});

	if (data && setUserToken(data.token)) {
		return <Redirect to="/member/mentor-group-list" />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && <Notice variant="error" title="Login failed" message={error} />}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (validateInputs(input)) {
						requestFn();
					}
				}}
				className={classes.form}
			>
				<h2>Login</h2>
				<div>
					<Field {...input.email} label="E-mail" type="text" />
				</div>
				<div>
					<Field {...input.password} label="Password" type="password" />
				</div>
				<div className={classes.button}>
					<Button type="submit" variant="contained" color="primary">
						LOG IN
					</Button>
				</div>
			</form>
		</Container>
	);
}
