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
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { UserRole } from '../../types';
import assertNever from '../../services/assertNever';

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 0,
	},
	form: {
		textAlign: 'center',
	},
	button: {
		marginTop: '12px',
		marginBottom: '20px',
	},
	card: {
		paddingTop: '40px',
		paddingBottom: '40px',
		margin: '12px',
	},
}));

export default function LoginView() {
	const [willRedirect, setRedirect] = React.useState(false);
	// translations
	const t = useTranslator();

	// css classes
	const classes = useStyles();

	// context
	const userContext = React.useContext(UserContext);
	const setUser = userContext && userContext.setUser;
	const user = userContext && userContext.user;

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

	// set user to context and redirect if request is successful
	React.useEffect(() => {
		if (!data || !setUser) {
			return;
		}
		setUserToken(data.token);
		setUser(data);
		setRedirect(true);
	}, [data, setUser]);

	if (willRedirect && user) {
		return <Redirect to={returnRedirectPath(user.role)} />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && <Notice variant="error" title="Login failed" message={error} />}
			<Card className={classes.card}>
				<CardContent>
					<form
						data-testid="login-form"
						onSubmit={(e) => {
							e.preventDefault();
							if (validateInputs(input)) {
								requestFn();
							}
						}}
						className={classes.form}
					>
						<h2>{t(Translation.LOGIN)}</h2>
						<div>
							<Field {...input.email} label="E-mail" type="text" name="email" data-testid="email" />
						</div>
						<div>
							<Field
								{...input.password}
								label={t(Translation.PASSWORD)}
								type="password"
								name="password"
								data-testid="password"
							/>
						</div>
						<Typography gutterBottom variant="subtitle2" align="center">
							{t(Translation.NO_ACCOUNT)}{' '}
							<Link href="/register" color="primary">
								{t(Translation.REGISTER)}
							</Link>
						</Typography>
						<div className={classes.button}>
							<Button type="submit" variant="contained" color="primary">
								{t(Translation.LOGIN)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</Container>
	);
}

function returnRedirectPath(userRole: UserRole): string {
	switch (userRole) {
		case UserRole.ADMIN:
			return '/admin/main';
		case UserRole.MENTEE:
		case UserRole.MENTOR:
			return '/member/my-mentor-group';
		default:
			return assertNever(userRole);
	}
}
