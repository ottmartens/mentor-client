import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Card, makeStyles, Divider, List, Button } from '@material-ui/core';
import MentorGroupPreview from '../../components/mentorGroupPreview/MentorGroupPreview';
import Person from '../../components/person/Person';
import { HasUserProps, UserRole } from '../../types';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { error } from 'console';
import Notice from '../../components/notice/Notice';
import ActivityFeed from '../../components/activityFeed/ActivityFeed';

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
		marginTop: '1em',
		marginBottom: '1em',
		textAlign: 'center',
	},
	mentorGroupContainer: {
		marginTop: '12px',
	},
	container: {
		textAlign: 'center',
	},
	listLink: {
		display: 'flex',
		flexGrow: 1,
		textDecoration: 'none',
		color: 'initial',
	},
	button: { marginBottom: '8px' },
	largeWidth: {
		width: '224px',
	},
	listImage: {
		borderRadius: '50%',
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
	const t = useTranslator();
	const [hasApplied, setHasApplied] = React.useState(false);
	const [alreadyRequested, setAlreadyRequested] = React.useState(false);

	const [queryMentorGroupData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GROUPS,
		endPointUrlParam: params.id,
		authToken: user.token,
	});

	const [requestGroupJoinFn, { error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.JOIN_GROUP,
		variables: { groupId: Number(params.id) },
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryMentorGroupData();
	}, [called, queryMentorGroupData]);

	React.useEffect(() => {
		if(!data) {
			return
		}
			setAlreadyRequested(data.requests.some((request) => request.userId === user.id)) ;
		
	}, [queryMentorGroupData]);

	if (loading || !data) {
		return <Loader />;
	}

	const pointSum =
		data &&
		data.activities.reduce((total, current) => {
			return total + current.points;
		}, 0);

	const activityTotal = data && data.activities.length;

	const alreadyMember = !!user.groupId;

	return (
		<>
			{error && <Notice variant="error" title="Avalduse saatmine ebaõnnestus" message={error} />}
			{hasApplied && <Notice variant="success" title="Avaldus saadetud" message="" />}
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
							linkMentors={true}
						/>
					)}
				</div>

				{user.role === UserRole.MENTEE && !alreadyMember && (
					<div className={classes.buttonContainer}>
						<Button
							disabled={alreadyRequested}
							variant="contained"
							color="primary"
							onClick={async () => {
								await requestGroupJoinFn();
								await queryMentorGroupData();
								{
									!error && setHasApplied(true);
								}
							}}
						>
							{alreadyRequested ? t(Translation.WAITING_RESPONSE) : t(Translation.JOIN_GROUP)}
						</Button>
					</div>
				)}

				{/* Accepted mentees */}
				{data.mentees && data.mentees.length !== 0 && (
					<Card className={classes.menteeCard}>
						<h2 className={classes.title}>{t(Translation.APPROVED_MENTEES)}</h2>
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
				{/* Activity feed */}
				{activityTotal > 0 && (
					<ActivityFeed
						activities={data.activities}
						showOnlyVerifiedActivities={true}
						pointsum={pointSum}
						acttotal={activityTotal}
					/>
				)}
			</div>
		</>
	);
}
