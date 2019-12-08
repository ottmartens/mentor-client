import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { makeStyles, Divider, List, Button, Card } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import Person from '../../components/person/Person';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import Notice from '../../components/notice/Notice';
import { UserContext } from '../../contexts/UserContext';

type Mentor = {
	userId: string;
	name: string;
	hasRequestedYou: boolean;
	youHaveRequested: boolean;
	imageUrl: string;
	tagline: string;
};

const useStyles = makeStyles(() => ({
	card: {
		textAlign: 'center',
	},
	title: {
		color: '#2c4d7f',
		textAlign: 'center',
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
	const t = useTranslator();
	const h = useHistory();
	const [hasRequested, setHasRequested] = React.useState(false);
	const [hasAccepted, setHasAccepted] = React.useState<undefined | boolean>(undefined);

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
	const [replyToRequestsFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.ACCEPT_GROUP_CREATE_REQUEST,
		authToken: user.token,
	});

	const { updateUserInfo } = useUpdateUserInfo();

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFreeMentorsData();
	}, [called, queryFreeMentorsData]);

	if (loading || !data) {
		return <Loader />;
	}

	//const sortedData: Mentor[] = data.sort((_, b) => (b.hasRequestedYou ? 1 : b.youHaveRequested ? 1 : -1));

	return (
		<>
			<h1 className={classes.title}>{t(Translation.FIND_MENTOR)}</h1>
			<Card className={classes.card}>
				{hasRequested && <Notice variant="success" title="Avaldus saadetud" message="" />}
				{hasAccepted !== undefined && (
					<Notice
						variant="success"
						title="Avaldusele vastatud"
						message={hasAccepted ? 'Avaldus vastu võetud' : 'Avaldus tagasi lükatud'}
					/>
				)}

				<List>
					{data.map(({ userId, name, hasRequestedYou, youHaveRequested, imageUrl, tagline }: Mentor, idx) => {
						return (
							<div key={idx}>
								{idx === 0 && <Divider variant="inset" component="li" />}
								<Person name={name} tagline={tagline} imageUrl={imageUrl} userId={userId} key={idx}>
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
													await updateUserInfo();
													setHasAccepted(true);
												}}
											>
												{t(Translation.ACCEPT)}
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
													setHasAccepted(false);
												}}
											>
												{t(Translation.DECLINE)}
											</Button>
										</div>
									) : youHaveRequested ? (
										<div>{t(Translation.WAITING_RESPONSE)}</div>
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
													setHasRequested(true);
												}}
											>
												{t(Translation.REQUEST)}
											</Button>
										</div>
									)}
								</Person>
								<Divider variant="inset" component="li" />
							</div>
						);
					})}
				</List>
			</Card>
		</>
	);

	function useUpdateUserInfo() {
		const ctx = React.useContext(UserContext);
		const ctxSetUser = ctx && ctx.setUser;
		const [getUserInfo, { data: userData, loading }] = useBackend({
			requestMethod: RequestMethod.GET,
			endPoint: EndPoint.USER,
			authToken: user.token,
		});

		const t = useTranslator();

		React.useEffect(() => {
			if (!userData || loading || !ctxSetUser) {
				return;
			}
			ctxSetUser(userData);
		}, [userData, loading, ctxSetUser]);

		return { updateUserInfo: getUserInfo };
	}
}
