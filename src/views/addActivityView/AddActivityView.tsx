import React from 'react';
import { Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { isSet, validateInputs } from '../../services/validators';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { UserContext } from '../../contexts/UserContext';
import Notice from '../../components/notice/Notice';

const useStyles = makeStyles((theme) => ({
	container: {
		flexGrow: 1,
		textAlign: 'center',
		marginBottom: '16px',
	},
	button: { margin: '1em 0' },
	largeWidth: {
		width: '224px',
	},
}));

export default function AddActivityView({ user }: HasUserProps) {
	const classes = useStyles();
	const userContext = React.useContext(UserContext);
	const [added, isAdded] = React.useState(false);
	const t = useTranslator();

    const input: { [s: string]: UseInput } = {
		name: useInput({ validators: [isSet]}),
		points: useInput({ validators: [isSet]}),
		minMembers: useInput({ validators: [isSet]}),
	};

	const [updateActivities, { data: updateActivitiesData, called: updateCalled, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.UPDATE_ACTIVITIES,
		variables: {
			name: input.name.value,
			points: input.points.value,
			minMembers: input.minMembers.value,
		},
		authToken: user.token,
	});

	React.useEffect(() => {
		if (!updateCalled) {
			return;
		}
		isAdded(true);
	}, [updateActivitiesData]);

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && <Notice variant="error" title="Adding activity failed" message={error} />}
			{added && <Notice variant="success" title="Activity added successfully" message={error} />}
			<h2>{t(Translation.ADD_ACTIVITY)}</h2>
			<div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (validateInputs(input)) {
							updateActivities();
						}
					}}
				>
					<Field className={classes.largeWidth} {...input.name} label={t(Translation.NAME)} />
					<Field className={classes.largeWidth} {...input.points} label={t(Translation.POINTS)} />
					<Field className={classes.largeWidth} {...input.minMembers} label={t(Translation.MIN_MEMBERS)} />
					<Button variant="contained" color="primary" type="submit" className={classes.button}>
						{t(Translation.ADD)}
					</Button>
				</form>
			</div>
		</Container>
	);
}