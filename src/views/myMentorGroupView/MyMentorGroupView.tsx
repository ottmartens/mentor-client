import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps, UserRole } from '../../types';
import useInput from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { isSet, validateInputs } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';
import { Button, Typography, Card, List, Divider, ListItem, ListItemText} from '@material-ui/core';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../services/variables';
import Person from '../../components/person/Person';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import classNames from 'classnames';
import Image from '../../components/image/Image';
import { Link } from 'react-router-dom';
import { CheckCircleOutline, ErrorOutline, HelpOutline} from '@material-ui/icons';



const useStyles = makeStyles((theme) => ({
	smallMargin: {
		margin: '4px',
	},
	largeWidth: {
		width: '224px',
	},
	title: {
		textAlign: 'center',
		color: '#2c4d7f',
	},
	mentors: {
		display: 'flex',
		justifyContent: 'space-around',
		marginBottom: '8px',
	},
	mentor: {
		width: '50%',
	},
	image: { width: '100%', height: '150px' },
	buttonContainer: {
		textAlign: 'center',
		marginTop: '8px',
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
	listLink: {
		display: 'flex',
		flexGrow: 1,
		textDecoration: 'none',
		color: 'initial',
	},
	card: {
		padding: '20px',
		marginBottom: '12px',
	},
	alignCenter: {
		textAlign: 'center',
	},
	suuredArvud: {
		color: 'purple',
		fontSize: '20px',
		marginRight: '15px',
	},
	punktid: {
		textAlign: 'right',
	},
	questionmark: {
		marginRight: '20px',
		fontSize: '32px',
		color: '#f0c605'
	},
	exclamationmark: {
		color: 'red',
		marginRight: '20px',
		fontSize: '32px'
	},
	checkmark: {
		color: 'green',
		marginRight: '20px',
		fontSize: '32px'
	}
}));

export default function MyMentorGroupView({ user }: HasUserProps) {
	const classes = useStyles();
	const [isEditable, setIsEditable] = React.useState(false);
	const [getGroupInfo, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.MY_GROUP,
		authToken: user.token,
	});
	const t = useTranslator();

	React.useEffect(() => {
		if (called) {
			return;
		}
		getGroupInfo();
	}, [called, getGroupInfo]);
	const input = {
		title: useInput({ validators: [isSet], initialValue: (data && data.title) || '' }),
		description: useInput({ validators: [isSet], initialValue: (data && data.description) || '' }),
	};

	const [updateInfo] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.GROUP_EDIT,
		variables: {
			title: input.title.value,
			description: input.description.value,
		},
		authToken: user.token,
	});

	const [determineGroupJoinFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.HANDLE_GROUP_JOIN_REQUEST,
		authToken: user.token,
	});

	const pointSum = data && data.activities.reduce((total, current) => {
		return total + current.points
	}, 0)

	const activityTotal = data && data.activities.length

	if (!data || loading) {
		return <Loader />;
	};

	return (
		<>
			<h1 className={classes.title}>{t(Translation.MY_MENTORGROUP)}</h1>
			{/* Mentorgroup info */}
			<Card className={classNames(classes.card, classes.alignCenter)}>
				<div className={classes.mentors}>
					{data &&
						data.mentors.map(({ imageUrl, name }, idx) => {
							return (
								<div className={classes.mentor} key={idx}>
									<Image src={imageUrl ? `${BASE_URL}${imageUrl}` : '/images/avatar_placeholder.webp'} />
									<Typography gutterBottom variant="h6" component="h2">
										{name}
									</Typography>
								</div>
							);
						})}
				</div>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						if (validateInputs(input)) {
							await updateInfo();
							await getGroupInfo();
							setIsEditable(false);
						}
					}}
				>
					{isEditable ? (
						<Field {...input.title} label={t(Translation.GROUP_NAME)} disabled={!isEditable} />
					) : (
						<Typography gutterBottom variant="h5" component="h2">
							{(data && data.title) || ''}
						</Typography>
					)}
					{isEditable ? (
						<Field
							{...input.description}
							label={t(Translation.GROUP_DESCRIPTION)}
							disabled={!isEditable}
							multiline
							className={classes.largeWidth}
						/>
					) : (
						<Typography variant="body2" color="textSecondary" component="p">
							{(data && data.description) || ''}
						</Typography>
					)}
					<div className={classes.buttonContainer}>
						{user.role === UserRole.MENTOR && (
							<Button
								variant="contained"
								color="secondary"
								className={classes.smallMargin}
								onClick={() => {
									setIsEditable(!isEditable);
								}}
							>
								{isEditable ? t(Translation.CANCEL) : t(Translation.SAVE)}
							</Button>
						)}
						{isEditable && (
							<Button variant="contained" color="primary" type="submit" className={classes.smallMargin}>
								{t(Translation.EDIT_GROUP)}
							</Button>
						)}
					</div>
				</form>
			</Card>

			{/* Accepted mentees */}
			{data.mentees && data.mentees.length !== 0 && (
				<Card className={classNames(classes.card, classes.alignCenter)}>
					<h2>{t(Translation.APPROVED_MENTEES)}</h2>
					<List>
						{data.mentees.map(({ imageUrl, name, userId, tagline }, idx) => {
							return (
								<div key={idx}>
									{idx === 0 && <Divider variant="inset" component="li" />}
									<Person name={name} tagline={tagline} imageUrl={imageUrl} userId={userId} key={idx} />
									<Divider variant="inset" component="li" />
								</div>
							);
						})}
					</List>
				</Card>
			)}

			{/* Join requests */}
			{user.role === UserRole.MENTOR && data.requests && data.requests.length !== 0 && (
				<Card className={classNames(classes.card, classes.alignCenter)}>
					<h2 className={classes.title}>{t(Translation.APPLIED_MENTEES)}</h2>
					<List>
						{data.requests.map(({ imageUrl, name, userId, tagline }, idx) => {
							return (
								<div key={idx}>
									{idx === 0 && <Divider variant="inset" component="li" />}
									<Person name={name} tagline={tagline} imageUrl={imageUrl} userId={userId} key={idx}>
										<Button
											variant="contained"
											className={classes.acceptButton}
											onClick={async (e) => {
												e.stopPropagation();
												await determineGroupJoinFn({
													overrideVariables: {
														userId,
														accept: true,
													},
												});
												await getGroupInfo();
											}}
										>
											{t(Translation.APPROVE)}
										</Button>{' '}
										<Button
											variant="contained"
											className={classes.declineButton}
											onClick={async (e) => {
												e.stopPropagation();
												await determineGroupJoinFn({
													overrideVariables: {
														userId,
														accept: false,
													},
												});
												await getGroupInfo();
											}}
										>
											{t(Translation.DECLINE)}
										</Button>
									</Person>
									<Divider variant="inset" component="li" />
								</div>
							);
						})}
					</List>
				</Card>
			)}
			<Card className={classNames(classes.card, classes.alignCenter)}>
				<h4>
					Grupi tegevusi kokku: <span className={classes.suuredArvud}>{activityTotal} </span> Grupi teenitud punktid: <span className={classes.suuredArvud}>{pointSum}</span>
				</h4>
				<Divider />
				<List>
					{data.activities.map(({ID, name, points, isVerified, time}) => {
						return (
						<div key={ID}>
							<ListItem>
								{isVerified === null && (
									<HelpOutline className={classes.questionmark}>
									</HelpOutline>
								)}
								{isVerified === true && (
									<CheckCircleOutline className={classes.checkmark}>
									</CheckCircleOutline>
								)}
								{isVerified === false && (
									<ErrorOutline className={classes.exclamationmark}>
									</ErrorOutline>
								)}
								<Link to={`/member/activity/${ID}`} className={classes.listLink}>
									<ListItemText primary={name} secondary={time} />
									<p className={classes.punktid}>
										<span className={classes.suuredArvud}>{points} p</span>
									</p>
								</Link>
							</ListItem>
						</div>
					)})}
				</List>
			</Card>
		</>
	);
}