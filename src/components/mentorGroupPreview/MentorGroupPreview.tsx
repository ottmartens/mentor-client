import React from 'react';
import { makeStyles, Card, CardContent, Typography } from '@material-ui/core';
import { BASE_URL } from '../../services/variables';
import Image from '../image/Image';
import classNames from 'classnames'
import { useHistory } from 'react-router';

export interface Mentor {
	imageUrl: string;
	name: string;
	userId: number;
}

interface Props {
	mentors: Mentor[];
	groupName: string;
	bio: string;
	groupId?: string;
	showNames?: boolean;
	showGroupName?: boolean;
	showLongBio?: boolean;
	linkMentors?: boolean;
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
	showPointer: {
		cursor:"pointer"
	}
}));

export default function MentorGroupPreview({
	mentors,
	groupName,
	bio,
	groupId,
	showGroupName,
	showNames,
	showLongBio,
	linkMentors,
}: Props) {
	const classes = useStyles();
	const h = useHistory()
	return (
		<Card className={classes.container}>
			<div>
				{mentors.map(({ imageUrl, name, userId }, idx) => {
					return (
						<div key={idx} className={classes.mentor}>
								<div onClick={linkMentors?() => {
									h.push(`/member/user/${userId}`)
								} : undefined} className={classNames({[classes.showPointer]:linkMentors})}>
									<Image
									className={classes.image}
									src={imageUrl ? `${BASE_URL}${imageUrl}` : '/images/avatar_placeholder.webp'}
								/>
									<Typography key={idx} gutterBottom variant="body2" component="h6">
										{name}
									</Typography>
								</div>
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
		</Card>
	);
}
