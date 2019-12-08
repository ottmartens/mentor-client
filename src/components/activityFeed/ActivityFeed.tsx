import React from 'react';
import { makeStyles, ListItem, ListItemText, Card, Divider, List } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CheckCircleOutline, ErrorOutline, HelpOutline } from '@material-ui/icons';
import classNames from 'classnames';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';

export interface Activity {
	ID: number;
	name: string;
	points: number;
	isVerified?: boolean;
	time: string;
}

interface Props {
	activities: Activity[];
	showOnlyVerifiedActivities?: boolean;
	pointsum: number;
	acttotal: number;
}

const useStyles = makeStyles((theme) => ({
	container: {
		marginBottom: '12px',
	},
	listLink: {
		display: 'flex',
		flexGrow: 1,
		textDecoration: 'none',
		color: 'initial',
	},
	listImage: {
		borderRadius: '50%',
	},
	bigNumbers: {
		color: 'purple',
		fontSize: '20px',
		marginRight: '15px',
	},
	points: {
		textAlign: 'right',
	},
	questionmark: {
		marginRight: '20px',
		fontSize: '32px',
		color: '#f0c605',
	},
	exclamationmark: {
		color: 'red',
		marginRight: '20px',
		fontSize: '32px',
	},
	checkmark: {
		color: 'green',
		marginRight: '20px',
		fontSize: '32px',
	},
	card: {
		padding: '20px',
		marginBottom: '12px',
	},
	alignCenter: {
		textAlign: 'center',
	},
	pendingOrRejected: {
		textAlign: 'right',
		fontSize: '12px',
		color: '#707070',
	},
}));

export default function ActivityFeed({ activities, showOnlyVerifiedActivities, pointsum, acttotal }: Props) {
	const classes = useStyles();
	const t = useTranslator();

	return (
		<Card className={classNames(classes.card, classes.alignCenter)}>
			<h4>
				{t(Translation.ACTIVITY_ACTIVITIES)}: <span className={classes.bigNumbers}>{acttotal} </span>{' '}
				{t(Translation.ACTIVITY_POINTS)}: <span className={classes.bigNumbers}>{pointsum}</span>
			</h4>
			<Divider />
			<List>
				{activities.map(({ ID, name, points, isVerified, time }) => {
					return (
						<div key={ID}>
							{(!showOnlyVerifiedActivities || (showOnlyVerifiedActivities && isVerified)) && (
								<ListItem>
									{isVerified === null && <HelpOutline className={classes.questionmark}></HelpOutline>}
									{isVerified === true && <CheckCircleOutline className={classes.checkmark}></CheckCircleOutline>}
									{isVerified === false && <ErrorOutline className={classes.exclamationmark}></ErrorOutline>}
									<Link to={`/member/completed-activity/${ID}`} className={classes.listLink}>
										<ListItemText primary={name} secondary={time} />
										{isVerified === true && (
											<p className={classes.points}>
												<span className={classes.bigNumbers}>{points} p</span>
											</p>
										)}
										{isVerified === false && (
											<p className={classes.pendingOrRejected}>{t(Translation.ACTIVITY_REJECTED)}</p>
										)}
										{isVerified === null && (
											<p className={classes.pendingOrRejected}>{t(Translation.ACTIVITY_PENDING)}</p>
										)}
									</Link>
								</ListItem>
							)}
						</div>
					);
				})}
			</List>
		</Card>
	);
}
