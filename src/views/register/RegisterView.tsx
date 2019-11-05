import React from 'react';
import Button from '@material-ui/core/Button';
import { Container, makeStyles, Card, CardContent, Typography, Link } from '@material-ui/core';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import RadioButtonField from '../../components/radioButtonField/RadioButtonField';
import { Redirect } from 'react-router';
import Notice from '../../components/notice/Notice';
import { validateInputs, isSet, isEmail } from '../../services/validators';
import { login } from '../../services/auth';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexGrow: 1,
		padding: '30px',
	},
	form: {
		textAlign: 'center',
	},
	button: {
		marginTop: '20px',
		marginBottom: '20px',
	},
	card: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		flexGrow: 1,
	},
}));

export default function RegisterView() {
	const classes = useStyles();
	const radioButtonOptions = [{ value: 'MENTOR', label: 'Mentor' }, { value: 'MENTEE', label: 'Mentee' }];

	const input: { [s: string]: UseInput } = {
		email: useInput({ validators: [isSet, isEmail] }),
		password: useInput({ validators: [isSet] }),
		role: useInput({ initialValue: radioButtonOptions[0].value }),
	};

	const [requestFn, { data, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.REGISTER,
		variables: {
			email: input.email.value,
			password: input.password.value,
			role: input.role.value,
		},
	});

	if (data && login(data)) {
		return <Redirect to="/member/mentor-group-list" />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && <Notice variant="error" title="Registration failed" message={error} />}
			<Card className={classes.card}>
				<form
				onSubmit={(e) => {
					e.preventDefault();
					if (validateInputs(input)) {
						requestFn();
					}
				}}
				className={classes.form}
			>
				<h2>Registration</h2>
				<div>
					<Field {...input.email} label="E-mail" type="text" />
				</div>
				<div>
					<Field {...input.password} label="Password" type="password" />
				</div>
				<div>
					<RadioButtonField {...input.role} options={radioButtonOptions} />
				</div>
				<div className={classes.button}>
					<Button type="submit" variant="contained" color="primary">
						REGISTER
					</Button>
				</div>
			</form>
			<CardContent>
				<Typography gutterBottom variant="subtitle1" align="center">
					Already have an account? <Link href="/login" color="primary">Login</Link>
				</Typography>
			</CardContent>
			</Card>
		</Container>
	);
}
