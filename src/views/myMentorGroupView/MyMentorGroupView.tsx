import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps, UserRole } from '../../types';
import useInput from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { isSet, validateInputs } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';
import {
	Button,
	CardMedia,
	Typography,
	Card,
	List,
	Divider,
} from '@material-ui/core';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../services/variables';
import Person from '../../components/person/Person';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		textAlign: 'center',
	},
	button: {
		margin: '4px',
	},
	largeWidth: {
		width: '224px',
	},
	mentors: {
		display: 'flex',
		justifyContent: 'space-around',
		marginBottom: '8px',
	},
	image: { width: '100%', height: '150px' },
	buttonContainer: {
		textAlign: 'right',
		marginTop: '8px',
	},
	listImage: {
		borderRadius: '50%',
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
	title: {
		marginLeft: '16px',
		marginTop: '0',
	},
	listLink: {
		display: 'flex',
		flexGrow: 1,
		textDecoration: 'none',
		color: 'initial',
	},
	menteeCard: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
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

	if (!data || loading) {
		return <Loader />;
	}

	return (
		<div className={classes.wrapper}>
			<h2>{t(Translation.MY_MENTORGROUP)}</h2>
			<div className={classes.mentors}>
				{data &&
					data.mentors.map(({ imageUrl }, idx) => {
						return (
							<CardMedia
								key={idx}
								className={classes.image}
								image={imageUrl ? `${BASE_URL}${imageUrl}` : '/images/avatar_placeholder.webp'}
							/>
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
							className={classes.button}
							onClick={() => {
								setIsEditable(!isEditable);
							}}
						>
							{isEditable ?  t(Translation.CANCEL) : t(Translation.SAVE_CHANGES)}
						</Button>
					)}
					{isEditable && (
						<Button variant="contained" color="primary" type="submit" className={classes.button}>
							{t(Translation.EDIT_GROUP)}
						</Button>
					)}
				</div>
			</form>

			{/* Accepted mentees */}
			{data.mentees && data.mentees.length !== 0 && (
				<Card className={classes.menteeCard}>
					<h2 className={classes.title}>{t(Translation.APPROVED_MENTEES)}</h2>
					<List>
						{data.mentees.map(({ imageUrl, firstName, lastName, userId, tagline }, idx) => {
							return (
								<div key={idx}>
									{idx === 0 && <Divider variant="inset" component="li" />}
									<Person firstName={firstName} lastName={lastName} tagline={tagline} imageUrl={imageUrl} userId={userId} key={idx}/>
									<Divider variant="inset" component="li" />
								</div>
							);
						})}
					</List>
				</Card>
			)}

			{/* Join requests */}
			{user.role === UserRole.MENTOR && data.requests && data.requests.length !== 0 && (
				<div>
					<Card className={classes.menteeCard}>
						<h2 className={classes.title}>{t(Translation.APPLIED_MENTEES)}</h2>
						<List>
							{data.requests.map(({ imageUrl, firstName, lastName, userId, tagline }, idx) => {
								return (
									<div key={idx}>
										{idx === 0 && <Divider variant="inset" component="li" />}
										<Person firstName={firstName} lastName={lastName} tagline={tagline} imageUrl={imageUrl} userId={userId} key={idx}>
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
				</div>
			)}
		</div>
	);
}
