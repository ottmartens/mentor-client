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
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../services/variables';

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
		<>
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
							{data.mentees.map(({ imageUrl, firstName, lastName, userId }, idx) => {
								return (
									<div key={idx}>
										{idx === 0 && <Divider variant="inset" component="li" />}
										<ListItem key={idx}>
											<Link to={`/member/user/${userId}`} className={classes.listLink}>
												<ListItemAvatar>
													<Avatar
														className={classes.listImage}
														src={imageUrl ? `${BASE_URL}${imageUrl}` : '/images/avatar_placeholder.webp'}
													/>
												</ListItemAvatar>
												<ListItemText primary={`${firstName} ${lastName}`} />
											</Link>
										</ListItem>
										<Divider variant="inset" component="li" />
									</div>
								);
							})}
						</List>
					</Card>
				)}
			</div>
		</>
	);
}
