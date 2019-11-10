import React from 'react';
import { Container, makeStyles, Button, Card, CardContent, Typography, Link } from '@material-ui/core';
import useInput, { UseInput } from '../../hooks/useInput';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Redirect } from 'react-router';
import Field from '../../components/field/Field';
import { isSet, isEmail, validateInputs } from '../../services/validators';
import Notice from '../../components/notice/Notice';
import { UserContext } from '../../contexts/UserContext';
import { setUserToken } from '../../services/auth';

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

export default function LoginView() {
	// css classes
	const classes = useStyles();

	// state
	const [redirect, willRedirect] = React.useState<boolean>(false);

	// context
	const userContext = React.useContext(UserContext);
	const setUser = userContext && userContext.setUser;

	// inputs
	const input: { [s: string]: UseInput } = {
		email: useInput({ validators: [isSet, isEmail] }),
		password: useInput({ validators: [isSet] }),
	};

	// login request
	const [requestFn, { data, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.LOGIN,
		variables: {
			email: input.email.value,
			password: input.password.value,
		},
	});

	// set user to context if request is successful
	React.useEffect(() => {
		if (!data || !setUser) {
			return;
		}
		setUserToken(data.token);
		setUser(data);
		willRedirect(true);
	}, [data, setUser]);

	// redirect after successful request
	if (redirect) {
		return <Redirect to="/member/mentor-group-list" />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && <Notice variant="error" title="Login failed" message={error} />}
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
			<CardContent>
				<Typography gutterBottom variant="subtitle1" align="center">
					Don't have an account? <Link href="/register" color="primary">Register</Link>
				</Typography>
			</CardContent>
			</Card>
		</Container>
	);
}
