import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import {
	Container,
	Card,
	makeStyles,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Button,
} from '@material-ui/core';
import MentorGroupPreview from '../../components/mentorGroupPreview/MentorGroupPreview';
import { HasUserProps, UserRole } from '../../types';
import Loader from '../../components/loader/Loader';

const useStyles = makeStyles((theme) => ({
	menteeCard: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	title: {
		marginLeft: '16px',
		marginTop: '0',
	},
	buttonContainer: {
		textAlign: 'center',
	},
	mentorGroupContainer: {
		marginTop: '12px',
	},
	requestImage: {
		borderRadius: '0',
	},
	requestButton: {
		margin: '4px',
	},
	declineButton: {
		margin: '4px',
		backgroundColor: '#B40404',
		color: '#fff',
	},
	container: {
		textAlign: 'center',
	},
}));

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
}

function ListItemLink(props) {
	return <ListItem button component="a" {...props} />;
}

export default function MentorGroupView({ match, user }: Props) {
	const classes = useStyles();
	const { params } = match;

	const [queryMentorGroupData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GROUPS,
		endPointUrlParam: params.id,
		authToken: user.token,
	});

	const [requestGroupJoinFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.JOIN_GROUP,
		variables: { groupId: Number(params.id) },
		authToken: user.token,
	});

	const [determineGroupJoinFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.HANDLE_GROUP_JOIN_REQUEST,
		variables: { groupId: Number(params.id) },
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryMentorGroupData();
	}, [called, queryMentorGroupData]);

	if (loading || !data) {
		return <Loader />;
	}
	return (
		<Container maxWidth="sm">
			<div className={classes.container}>
				<h1>{data.title}</h1>
				<div className={classes.mentorGroupContainer}>
					{data.mentors && (
						<MentorGroupPreview
							mentors={data.mentors}
							groupName={data.title}
							bio={data.description}
							showNames={true}
							showGroupName={false}
							showLongBio={true}
						/>
					)}
				</div>

				{/* Mentors */}
				{user.role === UserRole.MENTEE && (
					<div className={classes.buttonContainer}>
						<Button
							variant="contained"
							color="primary"
							onClick={async () => {
								await requestGroupJoinFn();
								await queryMentorGroupData();
							}}
						>
							APPLY
						</Button>
					</div>
				)}

				{/* Accepted mentees */}
				{data.mentees && data.mentees.length !== 0 && (
					<Card className={classes.menteeCard}>
						<h2 className={classes.title}>Approved mentees</h2>
						<List>
							{data.mentees.map(({ imageUrl, firstName, lastName }, idx) => {
								return (
									<div key={idx}>
										{idx === 0 && <Divider variant="inset" component="li" />}
										<ListItem key={idx}>
											<ListItemAvatar>
												<Avatar src={imageUrl} />
											</ListItemAvatar>
											<ListItemText primary={`${firstName} ${lastName}`} />
										</ListItem>
										<Divider variant="inset" component="li" />
									</div>
								);
							})}
						</List>
					</Card>
				)}

				{/* Join requests */}
				{data.requests && data.requests.length !== 0 && (
					<div>
						<Card className={classes.menteeCard}>
							<h2 className={classes.title}>Applied mentees</h2>
							<List>
								{data.requests.map(({ imageUrl, firstName, lastName, UserId }, idx) => {
									return (
										<div key={idx}>
											{idx === 0 && <Divider variant="inset" component="li" />}
											<ListItemLink href={UserId ? `/member/user/${UserId}` : `/member/user/1`}>
												<ListItem key={idx} button>
													<ListItemAvatar>
														<Avatar className={classes.requestImage} src={imageUrl}></Avatar>
													</ListItemAvatar>
													<ListItemText primary={`${firstName} ${lastName}`} />
													<Button
														variant="contained"
														color="primary"
														className={classes.requestButton}
														onClick={async () => {
															await determineGroupJoinFn({
																overrideVariables: {
																	userId: UserId,
																	accept: true,
																},
															});
															await queryMentorGroupData();
														}}
													>
														APPROVE
													</Button>{' '}
													<Button
														variant="contained"
														className={classes.declineButton}
														onClick={async () => {
															await determineGroupJoinFn({
																overrideVariables: {
																	userId: UserId,
																	accept: false,
																},
															});
															await queryMentorGroupData();
														}}
													>
														DECLINE
													</Button>
												</ListItem>
											</ListItemLink>

											<Divider variant="inset" component="li" />
										</div>
									);
								})}
							</List>
						</Card>
					</div>
				)}
			</div>
		</Container>
	);
}
