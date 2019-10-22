import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import {
	Container,
	makeStyles,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Button,
} from '@material-ui/core';
import { HasUserProps } from '../../types';
import { overwriteUserInfo } from '../../services/auth';

type Mentor = {
	userId: number;
	firstName: string;
	lastName: string;
	hasRequestedYou: boolean;
	youHaveRequested: boolean;
	imageUrl: string;
};

const useStyles = makeStyles(() => ({
	mentorCard: {
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
	requestImage: {
		borderRadius: '0',
	},
	requestButton: {
		margin: '4px',
	},
}));

export default function MentorPairingView({ user }: HasUserProps) {
	const classes = useStyles();

	//get data
	const [queryFreeMentorsData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GET_AVAILABLE_MENTORS,
		authToken: user.token,
	});

	//request to pair up w free mentor
	const [requestPairUpFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.MAKE_GROUP_CREATE_REQUEST,
		authToken: user.token,
	});

	//accept or reject sent requests
	const [replyToRequestsFn, { data: acceptRequestResponse }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.ACCEPT_GROUP_CREATE_REQUEST,
		authToken: user.token,
	});

	if (acceptRequestResponse) {
		console.log(acceptRequestResponse);
		overwriteUserInfo(acceptRequestResponse);
	}

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFreeMentorsData();
	}, [called, queryFreeMentorsData]);

	if (loading || !data) {
		return <div>Loading...</div>;
	}

	const sortedData: Mentor[] = data.sort((_, b) => (b.hasRequestedYou ? 1 : b.youHaveRequested ? 1 : -1));

	return (
		<Container maxWidth="sm">
			<List>
				{sortedData.map(({ userId, firstName, lastName, hasRequestedYou, youHaveRequested, imageUrl }, idx) => {
					return (
						<div key={idx}>
							{idx === 0 && <Divider variant="inset" component="li" />}
							<ListItem key={idx}>
								<ListItemAvatar>
									<Avatar className={classes.requestImage} src={imageUrl} />
								</ListItemAvatar>
								<ListItemText primary={`${firstName} ${lastName}`} />
								{hasRequestedYou ? (
									<div>
										<Button
											variant="contained"
											color="primary"
											className={classes.requestButton}
											onClick={() => {
												replyToRequestsFn({
													overrideVariables: {
														userId,
														accept: true,
													},
												});
											}}
										>
											ACCEPT
										</Button>
										{'  '}
										<Button
											variant="contained"
											color="primary"
											className={classes.requestButton}
											onClick={() => {
												replyToRequestsFn({
													overrideVariables: {
														userId,
														accept: false,
													},
												});
											}}
										>
											DECLINE
										</Button>
									</div>
								) : youHaveRequested ? (
									<div>Request pending</div>
								) : (
									<div>
										<Button
											variant="contained"
											color="primary"
											className={classes.requestButton}
											onClick={() => {
												requestPairUpFn({
													overrideVariables: {
														userId,
													},
												});
											}}
										>
											REQUEST
										</Button>
									</div>
								)}
							</ListItem>
							<Divider variant="inset" component="li" />
						</div>
					);
				})}
			</List>
		</Container>
	);
}
