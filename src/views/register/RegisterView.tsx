import React from 'react';
import Button from '@material-ui/core/Button';
import { Container, makeStyles, Card, CardContent, Typography, Link } from '@material-ui/core';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import RadioButtonField from '../../components/radioButtonField/RadioButtonField';
import Notice from '../../components/notice/Notice';
import { validateInputs, isSet, isEmail, isPasswordEqual } from '../../services/validators';
import { setUserToken } from '../../services/auth';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { returnRedirectPath } from '../login/LoginView';
import { Redirect } from 'react-router';

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

export default function RegisterView() {
	// css classes
	const classes = useStyles();

	// state
	const [willRedirect, setWillRedirect] = React.useState();
	const [userRole, setUserRole] = React.useState();

	// translator
	const t = useTranslator();

	// input options
	const radioButtonOptions = [
		{ value: 'MENTOR', label: 'Mentor' },
		{ value: 'MENTEE', label: 'Mentee' },
	];

	// inputs
	const input: { [s: string]: UseInput } = {
		email: useInput({ validators: [isSet, isEmail] }),
		password: useInput({ validators: [isSet] }),
		role: useInput({ initialValue: radioButtonOptions[0].value }),
	};
	const repeatPassword = useInput({ validators: [isSet, isPasswordEqual(input.password.value)] });

	//register request
	const [requestFn, { data, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.REGISTER,
		variables: {
			email: input.email.value,
			password: input.password.value,
			role: input.role.value,
		},
	});

	// set user to context after successful request
	React.useEffect(() => {
		if (!data) {
			return;
		}
		setUserToken(data.token);
		setUserRole(data.role);
		setWillRedirect(true);
	}, [data, setWillRedirect]);

	if (willRedirect && userRole) {
		return <Redirect to={returnRedirectPath(userRole)} />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && <Notice variant="error" title={t(Translation.REGISTRATION_ERROR)} message={error} />}
			<Card className={classes.card}>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (validateInputs({ ...input, repeatPassword })) {
								requestFn();
							}
						}}
						className={classes.form}
					>
						<h2>{t(Translation.REGISTRATION)}</h2>
						<div>
							<RadioButtonField {...input.role} options={radioButtonOptions} isColumn={false} />
						</div>
						<div>
							<Field {...input.email} label="E-mail" type="text" />
						</div>
						<div>
							<Field {...input.password} label={t(Translation.PASSWORD)} type="password" />
						</div>
						<div>
							<Field {...repeatPassword} label={t(Translation.REPEAT_PASSWORD)} type="password" />
						</div>
						<Typography gutterBottom variant="subtitle2" align="center">
							{t(Translation.YES_ACCOUNT)}{' '}
							<Link href="/login" color="primary">
								{t(Translation.LOGIN)}
							</Link>
						</Typography>
						<div className={classes.button}>
							<Button type="submit" variant="contained" color="primary">
								{t(Translation.REGISTER)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</Container>
	);
}
