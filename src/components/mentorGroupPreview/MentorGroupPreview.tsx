import React from 'react';
import { makeStyles, Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { BASE_URL } from '../../services/variables';
import Image from '../image/Image';

export interface Mentor {
	imageUrl: string;
	name: string;
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
		marginBottom: '8px',
	},
	link: {
		textDecoration: 'none',
		color: 'inherit',
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
	noPointer: {
		cursor: 'default',
	},
	image: {
		display: 'inline-block',
		width: '100%',
		marginBottom: 'auto',
	},
	mentor: {
		display: 'inline-flex',
		flexDirection: 'column',
		width: '50%',
	},
}));

export default function MentorGroupPreview({
	mentors,
	groupName,
	bio,
	id,
	showGroupName,
	showNames,
	showLongBio,
}: Props) {
	const classes = useStyles();

	return (
		<Card className={classes.container}>
			<Link
				to={id ? `/member/mentor-group/${id}` : '#'}
				className={classNames(classes.link, { [classes.noPointer]: !id })}
			>
				<div>
					{mentors.map(({ imageUrl, name }, idx) => {
						return (
							<div key={idx} className={classes.mentor}>
								<Image
									className={classes.image}
									src={imageUrl ? `${BASE_URL}${imageUrl}` : '/images/avatar_placeholder.webp'}
								/>
								{showNames && (
									<Typography key={idx} gutterBottom variant="body2" component="h6">
										{name}
									</Typography>
								)}
							</div>
						);
					})}
				</div>

				<CardContent>
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
			</Link>
		</Card>
	);
}
