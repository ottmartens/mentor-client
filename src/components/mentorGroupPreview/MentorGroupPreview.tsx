import React from 'react';
import { makeStyles, Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Paper } from '@material-ui/core';

export interface Mentor {
	imageUrl: string;
	firstName: string;
	lastName: string;
}

interface Props {
	mentors: Mentor[];
	groupName: string;
	bio: string;
	id?: string;
	showNames?: boolean;
	showGroupName?: boolean;
	showLongBio?: boolean;
}

const useStyles = makeStyles((theme) => ({
	container: {
		marginBottom: '12px',
	},
	mentors: {
		display: 'flex',
		justifyContent: 'space-around',
	},

	image: {
		width: '100%',
		height: '150px',
	},

	bio: {
		lineHeight: '1.3em',
		maxHeight: '2.6em',
		whitespace: 'nowrap',
		overflow: 'hidden',
		textoverflow: 'ellipsis',
	},
	longBio: {
		lineHeight: '1.3em',
		maxHeight: 'none',
	},
	names: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	name: {
		display: 'inline-block',
	},
}));

export default function MentorGroupPreview({
	mentors,
	groupName,
	bio,
	id,
	showNames,
	showGroupName,
	showLongBio,
}: Props) {
	const classes = useStyles();

	return (
		<Card className={classes.container}>
			<CardActionArea href={id ? `/member/mentor-group/${id}` : '#'}>
				<div className={classes.mentors}>
					{mentors.map(({ imageUrl }, idx) => {
						return <CardMedia key={idx} className={classes.image} image={imageUrl}></CardMedia>;
					})}
				</div>

				<CardContent>
					{showNames && (
						<div className={classes.names}>
							{mentors.map(({ firstName, lastName }, idx) => {
								return (
									<Typography key={idx} gutterBottom variant="h5" component="h2" className={classes.name}>
										{firstName} {lastName}
									</Typography>
								);
							})}
						</div>
					)}
					{showGroupName && (
						<Typography gutterBottom variant="h5" component="h2">
							{groupName}
						</Typography>
					)}
					{showLongBio && (
						<div className={classes.longBio}>
							<Typography variant="body2" color="textSecondary" component="p">
								{bio}
							</Typography>
						</div>
					)}
					{!showLongBio && (
						<div className={classes.bio}>
							<Typography variant="body2" color="textSecondary" component="p">
								{bio}
							</Typography>
						</div>
					)}
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
