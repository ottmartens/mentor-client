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
		variables: { userId: user.ID, groupId: Number(params.id) },
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
		return <div>Loading...</div>;
	}
	return (
		<Container maxWidth="sm">
			<div className={classes.container}>
				<h1>{data.title}</h1>
				<div className={classes.mentorGroupContainer}>
					{data.mentors && <MentorGroupPreview mentors={data.mentors} groupName={data.title} bio={data.description} />}
				</div>

				{/* Mentors */}
				{user.role === UserRole.MENTEE && (
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
				)}

				{/* Mentees */}
				{data.mentees && data.mentees.length !== 0 && (
					<Card className={classes.menteeCard}>
						<h2 className={classes.title}>Approved mentees</h2>
						<List>
							{data.mentees.map(({ ImageUrl, FirstName, LastName }, idx) => {
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
				)}

				{/* Requests */}
				{data.requests && data.requests.length !== 0 && (
					<div>
						<List>
							{data.requests.map(({ ImageUrl, FirstName, LastName, UserId }, idx) => {
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
				)}
			</div>
		</Container>
	);
}
