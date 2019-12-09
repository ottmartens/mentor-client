import React, { useState /*, { useEffect }*/ } from 'react';
import {
	Container,
	List,
	ListItem,
	Divider,
	Card,
	ListItemText,
	CardContent,
	Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
//import { UserContext } from '../../contexts/UserContext';
import Person from '../../components/person/Person';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Link } from 'react-router-dom';
import Notice from '../../components/notice/Notice';
import CheckboxField from '../../components/checkboxField/CheckboxField';
import useInput from '../../hooks/useInput';

const useStyles = makeStyles((theme) => ({
	container: {
		flexGrow: 1,
		textAlign: 'center',
		marginBottom: '16px',
	},
	listitem: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'row',
		textDecoration: 'none',
		color: 'initial',
	},
	link: {
		textDecoration: 'none',
		color: 'inherit',
	},
	title: {
		color: '#2c4d7f',
	},
	menteeCard: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	personName: {
		fontSize: '20px',
	},
	listImage: {
		borderRadius: '50%',
	},
	listitem2: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'row',
		textDecoration: 'none',
		color: 'initial',
	},
	acceptButton: {
		margin: '4px',
		backgroundColor: '#26c72b',
		color: '#fff',
	},
	declineButton: {
		margin: '4px',
		backgroundColor: '#B40404',
		color: '#fff',
	},
	cardTitle: {},
	suuredArvud: {
		color: 'purple',
		fontSize: '20px',
		marginRight: '15px',
	},
	card: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	buttons: {
		margin: '2em 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	addButton: {
		margin: '1em auto',
	},
}));

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
	setValue: (newValue: string) => void;
}

export default function AdminView({ user }: HasUserProps) {
	// css
	const classes = useStyles();

	// translator
	const t = useTranslator();

	// state
	const [hasChanged, setHasChanged] = React.useState(false);
	const [unVerifiedUsers, setUnverifiedUsers] = React.useState([]);

	// requests
	const [
		queryDeadlineData,
		{
			data: currentDeadlineData,
			loading: currentDeadlineLoading,
			called: currentDeadlineCalled,
		},
	] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.SETTINGS,
		authToken: user.token,
	});

	//input
	const input = {
		MENTEES_CAN_REGISTER: useInput({
			initialValue:
				currentDeadlineData && currentDeadlineData.MENTEES_CAN_REGISTER
					? true
					: false,
		}),
		MENTORS_CAN_REGISTER: useInput({
			initialValue:
				currentDeadlineData && currentDeadlineData.MENTORS_CAN_REGISTER
					? true
					: false,
		}),
	};

	const [
		queryUnverifiedActivities,
		{ data: activityData, loading: activityLoading, called: activityCalled },
	] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.UNVERIFIED_ACTIVITIES,
		authToken: user.token,
	});

	const [
		queryAllUsers,
		{ data: usersData, loading: usersLoading, called: usersCalled },
	] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.ALL_USERS,
		authToken: user.token,
	});

	const [changeDeadlinesFn, { error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.SET_SETTINGS,
		variables: {
			MENTORS_CAN_REGISTER: input.MENTORS_CAN_REGISTER.value,
			MENTEES_CAN_REGISTER: input.MENTEES_CAN_REGISTER.value,
		},
		authToken: user.token,
	});

	React.useEffect(() => {
		if (activityCalled) {
			return;
		}
		queryUnverifiedActivities();
	}, [activityCalled, queryUnverifiedActivities]);

	React.useEffect(() => {
		if (usersCalled) {
			return;
		}
		queryAllUsers();
	}, [usersCalled, queryAllUsers]);

	React.useEffect(() => {
		if (usersData) {
			console.log('asd')
			setUnverifiedUsers(usersData.filter((user) => !user.isVerified));
		}
	}, [usersData]);

	React.useEffect(() => {
		if (currentDeadlineCalled) {
			return;
		}
		queryDeadlineData();
	}, [currentDeadlineCalled, queryDeadlineData]);

	if (
		activityLoading ||
		!usersData ||
		usersLoading ||
		currentDeadlineLoading ||
		!activityData ||
		!currentDeadlineData
	) {
		return <Loader />;
	}

	const activitytotal = activityData && activityData.length;
	const usertotal = unVerifiedUsers.length;

	return (
		<Container className={classes.container} maxWidth="sm">
			{error && (
				<Notice
					variant="error"
					title="Tähtaegade muutmine ebaõnnestus"
					message={error}
				/>
			)}
			{hasChanged && (
				<Notice variant="success" title="Tähtajad muudetud" message="" />
			)}
			<h1 className={classes.title}>{t(Translation.ADMIN_OVERVIEW)}</h1>
			<Card className={classes.menteeCard}>
				<h2 className={classes.cardTitle}>{t(Translation.GRADE_ACTIVITIES)}</h2>
				<h3>
					{t(Translation.ADMIN_UNVERIFIED_ACTIVITIES)}:{' '}
					<span className={classes.suuredArvud}>{activitytotal}</span>
				</h3>

				{/* Unverified activities */}
				<List>
					{activityData &&
						activityData.map(({ name, groupName, ID }) => {
							return (
								<div key={ID}>
									<ListItem className={classes.listitem}>
										<div>
											<Link
												to={ID ? `/member/completed-activity/${ID}` : '#'}
												className={classes.link}
											>
												<ListItemText
													className={classes.personName}
													primary={name}
													secondary={groupName || t(Translation.NAMELESS_GROUP)}
												/>
											</Link>
										</div>
									</ListItem>
									<Divider variant="middle" />
								</div>
							);
						})}
				</List>
			</Card>

			{/* Unverified users */}
			<div>
				<Card className={classes.menteeCard}>
					<h2 className={classes.cardTitle}>{t(Translation.VERIFY_USERS)}</h2>
					<h3>
						{t(Translation.ADMIN_UNVERIFIED_USERS)}:{' '}
						<span className={classes.suuredArvud}>{usertotal}</span>
					</h3>
					<List>
						{usersData &&
							usersData
								.filter((userData) => !userData.isVerified)
								.map(({ ID, name, tagline, imageurl }) => {
									return (
										<div key={ID}>
											<Person
												name={name}
												tagline={tagline}
												imageUrl={imageurl}
												userId={ID}
											></Person>
										</div>
									);
								})}
					</List>
				</Card>
			</div>

			{/* Deadlines */}
			<div className={classes.container}>
				<Card className={classes.card}>
					<CardContent>
						<form
							onSubmit={async (e) => {
								e.preventDefault();
								await changeDeadlinesFn();
								await queryDeadlineData();
								!error && setHasChanged(true);
							}}
						>
							<h1>{t(Translation.DEADLINES)}</h1>
							<div className={classes.buttons}>
								<CheckboxField
									label={t(Translation.ADMIN_MENTEES_CAN_REGISTER)}
									{...input.MENTEES_CAN_REGISTER}
								/>
								<CheckboxField
									label={t(Translation.ADMIN_MENTORS_CAN_REGISTER)}
									{...input.MENTORS_CAN_REGISTER}
								/>
							</div>
							<Button type="submit" variant="contained" color="primary">
								{t(Translation.CHANGE)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}
