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
}));

export default function MentorGroupView({ match }) {
	const classes = useStyles();
	const { params } = match;

	const userString = localStorage.getItem('mentorAppUser');

	const user = userString ? JSON.parse(userString) : undefined;

	const [requestGroupJoinFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.JOIN_GROUP,
		variables: { userId: user.ID, groupId: Number(params.id) },
	});

	const [queryMentorGroupData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GROUPS,
		endPointUrlParam: params.id,
	});

	const [determineGroupJoinFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.ACCEPT_OR_REJECT_GROUP_JOIN_REQUEST,
		variables: { groupId: Number(params.id) },
	});

	const groupInfo = data && data.data;

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryMentorGroupData();
	});

	if (loading || !data) {
		return <div>Loading...</div>;
	}

	console.log(groupInfo);

	return (
		<Container>
			<div>
				<div className={classes.mentorGroupContainer}>
					<MentorGroupPreview mentors={groupInfo.mentors} groupName={groupInfo.title} bio={groupInfo.description} />
				</div>
				<div className={classes.buttonContainer}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							requestGroupJoinFn();
						}}
					>
						APPLY
					</Button>
				</div>

				<Card className={classes.menteeCard}>
					<h2 className={classes.title}>Approved mentees</h2>
					<List>
						{groupInfo.mentees.map(({ ImageUrl, FirstName, LastName }, idx) => {
							return (
								<div key={idx}>
									{idx === 0 && <Divider variant="inset" component="li" />}
									<ListItem key={idx}>
										<ListItemAvatar>
											<Avatar src={ImageUrl} />
										</ListItemAvatar>
										<ListItemText primary={`${FirstName} ${LastName}`} />
									</ListItem>
									<Divider variant="inset" component="li" />
								</div>
							);
						})}
					</List>
				</Card>
				<div>
					<List>
						{groupInfo.requests &&
							groupInfo.requests.map(({ ImageUrl, FirstName, LastName, UserId }, idx) => {
								return (
									<div key={idx}>
										{idx === 0 && <Divider variant="inset" component="li" />}
										<ListItem key={idx}>
											<ListItemAvatar>
												<Avatar className={classes.requestImage} src={ImageUrl} />
											</ListItemAvatar>
											<ListItemText primary={`${FirstName} ${LastName}`} />
											<Button
												variant="contained"
												color="primary"
												className={classes.requestButton}
												onClick={() => {
													determineGroupJoinFn({
														overrideVariables: {
															userId: UserId,
															accept: true,
														},
													});
												}}
											>
												APPROVE
											</Button>{' '}
											<Button
												variant="contained"
												color="primary"
												className={classes.requestButton}
												onClick={() => {
													determineGroupJoinFn({
														overrideVariables: {
															userId: UserId,
															accept: false,
														},
													});
												}}
											>
												DECLINE
											</Button>
										</ListItem>

										<Divider variant="inset" component="li" />
									</div>
								);
							})}
					</List>
				</div>
			</div>
		</Container>
	);
}
