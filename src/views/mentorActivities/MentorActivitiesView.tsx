import React from 'react';
import { HasUserProps, UserRole } from '../../types';
import { Button, Divider, Card, Container} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import Loader from '../../components/loader/Loader';
import { validateInputs, isSet } from '../../services/validators';
import Field from '../../components/field/Field';
import useInput, { UseInput } from '../../hooks/useInput';

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: 'none',
		color: 'inherit',
		textAlign: 'center',
	},
	title: {
		margin: '0',
	},

	description: {
		color: '#7b7b7b',
	},
	listElement: {
		margin: '12px 0 12px 0',
	},
	alignCenter: {
		textAlign: 'center',
	},
	container: {
		flexGrow: 1,
		textAlign: 'center',
		marginBottom: '16px',
	},
	title2: {
		color: '#2c4d7f',
	},
	makeButton: {
		marginBottom: '20px',
		marginLeft: '10px',
		backgroundColor: '#26c72b',
		color: '#fff',
	},
	instr: {
		display: 'inline-block',
	},
	button: { margin: '1em 0' },
	largeWidth: {
		width: '224px',
	},
	card: {
		margin: ' 1em 0',
	},
	numericInput: {
		width: '224px',
		WebkitAppearance: 'none',
		MozAppearance: 'textfield',
	},
}));

export default function MentorActivitiesView({ user }: HasUserProps) {
	const classes = useStyles();
	const t = useTranslator();

	// get activities from database
	const [getActivities, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GET_ACTIVITIES,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		getActivities();
	}, [called, getActivities]);

	const input: { [s: string]: UseInput } = {
		name: useInput({ validators: [isSet] }),
		points: useInput({ validators: [isSet] }),
		minMembers: useInput({ validators: [isSet] }),
	};

	const [updateActivities] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.UPDATE_ACTIVITIES,
		variables: {
			name: input.name.value,
			points: input.points.value,
			minMembers: input.minMembers.value,
		},
		authToken: user.token,
	});

	if (loading || !data) {
		return <Loader />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			{/*{error && <Notice variant="error" title="Tegevuse lisamine ebaõnnestus" message={error} />}
			{isAdded && <Notice variant="success" title="Tegevus lisatud" message='' />}*/}
			<h1 className={classes.title2}>{t(Translation.ACTIVITIES)}</h1>
			{user.role === UserRole.ADMIN && (
				<div>
					<Card className={classes.card}>
						<h2>{t(Translation.ADD_ACTIVITY)}</h2>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								if (validateInputs(input)) {
									await updateActivities();
								}
							}}
						>
							<div>
								<Field className={classes.largeWidth} {...input.name} label={t(Translation.NAME)} />
							</div>
							<div>
								<Field className={classes.numericInput} type="number" {...input.points} label={t(Translation.POINTS)} />
							</div>
							<div>
								<Field
									className={classes.numericInput}
									type="number"
									{...input.minMembers}
									label={t(Translation.MIN_MEMBERS)}
								/>
							</div>
							<Button variant="contained" color="primary" type="submit" className={classes.button}>
								{t(Translation.ADD)}
							</Button>
						</form>
					</Card>
				</div>
			)}
			<Card>
				{user.role === UserRole.MENTOR && (
					<div>
						<h3 className={classes.instr}>{t(Translation.ACTIVITIES_INSTRUCTION)}</h3>
						<Link to="/member/complete-activity/new" className={classes.link}>
							<Button variant="contained" className={classes.makeButton}>
								{t(Translation.MAKE_NEW_ONE)}
							</Button>
						</Link>
					</div>
				)}
				{data.map(({ name, points, requiredParticipants, ID }) => (
					<div key={ID}>
						<Divider />
						{user.role === UserRole.MENTOR && (
							<Link to={`/member/complete-activity/${ID}`} className={classes.link}>
								<div className={classes.listElement}>
									<h2 className={classes.title}>{name}</h2>
									<span className={classes.description}>{`${points} points | ${requiredParticipants}+ members`}</span>
								</div>
							</Link>
						)}
						{(user.role === UserRole.ADMIN || user.role === UserRole.MENTEE) && (
							<div className={classes.listElement}>
								<h2 className={classes.title}>{name}</h2>
								<span className={classes.description}>{`${points} points | ${requiredParticipants}+ members`}</span>
							</div>
						)}
					</div>
				))}
			</Card>
		</Container>
	);
}
