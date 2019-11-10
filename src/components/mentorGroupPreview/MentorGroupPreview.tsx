import React from 'react';
import { makeStyles, Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export interface Mentor {
	imageUrl: string;
}

interface Props {
	mentors: Mentor[];
	groupName: string;
	bio: string;
	id?: string;
	showNames?: boolean;
	showGroupName?: boolean;
}

const useStyles = makeStyles((theme) => ({
	container: {
		marginBottom: '12px',
	},
	mentors: {
		display: 'flex',
		justifyContent: 'space-around',
	},

	image: { width: '100%', height: '150px' },
	link: {
		textDecoration: 'none',
		color: 'inherit',
	},
}));

export default function MentorGroupPreview({ mentors, groupName, bio, id, showGroupName }: Props) {
	const classes = useStyles();

	return (
		<Card className={classes.container}>
			<Link to={id ? `/member/mentor-group/${id}` : '#'} className={classes.link}>
				<div className={classes.mentors}>
					{mentors.map(({ imageUrl }, idx) => {
						return (
							<CardMedia
								key={idx}
								className={classes.image}
								image={imageUrl ? imageUrl : '/images/avatar_placeholder.webp'}
							/>
						);
					})}
				</div>

				<CardContent>
					{showGroupName && (
						<Typography gutterBottom variant="h5" component="h2">
							{groupName}
						</Typography>
					)}
					<Typography variant="body2" color="textSecondary" component="p">
						{bio}
					</Typography>
				</CardContent>
			</Link>
		</Card>
	);
}
