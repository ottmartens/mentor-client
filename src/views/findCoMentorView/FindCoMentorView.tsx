import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import {
	Container,
	makeStyles,
	Divider,
	List,
	Button,
} from '@material-ui/core';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import Person from '../../components/person/Person';

type Mentor = {
	userId: number;
	firstName: string;
	lastName: string;
	hasRequestedYou: boolean;
	youHaveRequested: boolean;
	imageUrl: string;
	tagline: string;
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
		borderRadius: '50%',
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

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFreeMentorsData();
	}, [called, queryFreeMentorsData]);

	if (loading || !data) {
		return <Loader />;
	}

	const sortedData: Mentor[] = data.sort((_, b) => (b.hasRequestedYou ? 1 : b.youHaveRequested ? 1 : -1));

	return (
		<Container maxWidth="sm">
			<List>
				{sortedData.map(({ userId, firstName, lastName, hasRequestedYou, youHaveRequested, imageUrl, tagline }, idx) => {
					return (
						<div key={idx}>
							{idx === 0 && <Divider variant="inset" component="li" />}
							<Person firstName={firstName} lastName={lastName} tagline={tagline} imageUrl={imageUrl} userId={userId} key={idx}>
								{hasRequestedYou ? (
									<div>
										<Button
											variant="contained"
											color="primary"
											className={classes.requestButton}
											onClick={async () => {
												await replyToRequestsFn({
													overrideVariables: {
														userId,
														accept: true,
													},
												});
												await queryFreeMentorsData();
											}}
										>
											ACCEPT
										</Button>
										{'  '}
										<Button
											variant="contained"
											color="primary"
											className={classes.requestButton}
											onClick={async () => {
												await replyToRequestsFn({
													overrideVariables: {
														userId,
														accept: false,
													},
												});
												await queryFreeMentorsData();
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
											onClick={async () => {
												await requestPairUpFn({
													overrideVariables: {
														userId,
													},
												});
												await queryFreeMentorsData();
											}}
										>
											REQUEST
										</Button>
									</div>
								)}
							</Person>
							<Divider variant="inset" component="li" />
						</div>
					);
				})}
			</List>
		</Container>
	);
}
