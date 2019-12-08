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
import Loader from '../../components/loader/Loader';

enum TranslateOption {
	MENTEES_CAN_REGISTER = 'MENTEE',
	MENTORS_CAN_REGISTER = 'MENTOR',
}
interface Option {
	value: string;
	label: string;
}

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
	const [radioButtonOptions, setRadioButtonOptions] = React.useState<Option[]>([] as Option[]);

	// translator
	const t = useTranslator();

	const [
		queryDeadlineData,
		{ data: registerDeadlinesData, loading: registerDeadlinesLoading, called: registerDeadlinesCalled },
	] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.SETTINGS,
	});

	React.useEffect(() => {
		if (registerDeadlinesCalled) {
			return;
		}
		queryDeadlineData();
	}, [registerDeadlinesCalled, queryDeadlineData]);

	React.useEffect(() => {
		if (!registerDeadlinesData || !registerDeadlinesCalled) {
			return;
		}
		setRadioButtonOptions(formatOptions(registerDeadlinesData));
	}, [registerDeadlinesData, setRadioButtonOptions]);

	// inputs
	const input: { [s: string]: UseInput } = {
		email: useInput({ validators: [isSet, isEmail] }),
		password: useInput({ validators: [isSet] }),
		role: useInput({ initialValue: radioButtonOptions && radioButtonOptions[0] && radioButtonOptions[0].value }),
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

	if (registerDeadlinesLoading || !registerDeadlinesData) {
		return <Loader />;
	}

	const isRegisterEnabled = radioButtonOptions && radioButtonOptions.length > 0;

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && <Notice variant="error" title={t(Translation.REGISTRATION_ERROR)} message={error} />}
			<Card className={classes.card}>
				<CardContent>
					<form
						data-testid="register-form"
						onSubmit={(e) => {
							e.preventDefault();
							if (validateInputs({ ...input, repeatPassword })) {
								requestFn();
							}
						}}
						className={classes.form}
					>
						<h2>{t(Translation.REGISTRATION)}</h2>
						{renderOptions()}
						<div>
							<Field {...input.email} label="E-mail" type="text" disabled={!isRegisterEnabled} data-testid="email" />
						</div>
						<div>
							<Field
								{...input.password}
								label={t(Translation.PASSWORD)}
								type="password"
								disabled={!isRegisterEnabled}
								data-testid="password"
							/>
						</div>
						<div>
							<Field
								{...repeatPassword}
								label={t(Translation.REPEAT_PASSWORD)}
								type="password"
								disabled={!isRegisterEnabled}
								data-testid="confirmation password"
							/>
						</div>
						<Typography gutterBottom variant="subtitle2" align="center">
							{t(Translation.YES_ACCOUNT)}{' '}
							<Link href="/login" color="primary">
								{t(Translation.LOGIN)}
							</Link>
						</Typography>
						<div className={classes.button}>
							<Button type="submit" variant="contained" color="primary" disabled={!isRegisterEnabled}>
								{t(Translation.REGISTER)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</Container>
	);

	function formatOptions(data: { MENTEES_CAN_REGISTER: boolean; MENTORS_CAN_REGISTER: boolean }): Option[] {
		function capitalize(string: string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		}

		return Object.entries(data)
			.filter(([_, value]) => value)
			.map(([key, _]) => {
				return { value: TranslateOption[key], label: capitalize(TranslateOption[key]) };
			});
	}

	function renderOptions() {
		if (radioButtonOptions.length === 0) {
			return <div>{t(Translation.REGISTER_IS_DISABLED)}</div>;
		}

		if (radioButtonOptions.length === 1) {
			return (
				<div>
					{radioButtonOptions[0].value === 'MENTEE'
						? t(Translation.REGISTER_MENTEES_ONLY)
						: t(Translation.REGISTER_MENTORS_ONLY)}
				</div>
			);
		}

		if (radioButtonOptions.length >= 2) {
			return (
				<div>
					{radioButtonOptions.length > 0 && (
						<RadioButtonField {...input.role} options={radioButtonOptions} isColumn={false} />
					)}
				</div>
			);
		}

		return null;
	}
}
