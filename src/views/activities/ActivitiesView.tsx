import React from 'react';
import { HasUserProps } from '../../types';
import { Divider, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: 'none',
		color: 'inherit',
		textAlign: 'center',
	},
	title: {
		margin: '0',
	},

	description: {
		color: '#7b7b7b',
	},
	listElement: {
		margin: '12px 0 12px 0',
	},
	alignCenter: {
		textAlign: 'center',
	},
}));

export default function ActivitiesView({ user }: HasUserProps) {
	const classes = useStyles();
	// get activities from database
	const mockActivities = [
		{ id: 1, name: 'First meeting', points: 10, minMembers: 5 },
		{ id: 2, name: 'Beer night', points: 10, minMembers: 3 },
		{ id: 3, name: 'Pet cats', points: 20, minMembers: 2 },
		{ id: 4, name: 'Charity work', points: 15, minMembers: 3 },
	];

	return (
		<Card>
			<h1 className={classes.alignCenter}>Activities</h1>
			{mockActivities.map((activity, idx) => (
				<div key={idx}>
					<Divider />
					<Link to={`/member/activities/${activity.id}`} className={classes.link}>
						<div className={classes.listElement}>
							<h2 className={classes.title}>{activity.name}</h2>
							<span
								className={classes.description}
							>{`${activity.points} points | ${activity.minMembers}+ members`}</span>
						</div>
					</Link>
				</div>
			))}
		</Card>
	);
}
