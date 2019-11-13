import React from 'react';
import { makeStyles, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../services/variables';

interface Props {
	firstName: string;
	lastName: string;
    tagline: string;
    imageUrl: string;
    userId: string;
    key?: string;
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
}));

export default function Person({userId, imageUrl, firstName, lastName, tagline, key}: Props) {
	const classes = useStyles();

	return (
        <ListItem key={key}>
            <Link to={`/member/user/${userId}`} className={classes.listLink}>
                <ListItemAvatar>
                    <Avatar
                        className={classes.listImage}
                        src={imageUrl ? `${BASE_URL}${imageUrl}` : '/images/avatar_placeholder.webp'}
                    />
                </ListItemAvatar>
                <ListItemText primary={`${firstName} ${lastName}`}
                secondary={`${tagline? tagline:''}`}
                />
            </Link>
        </ListItem>
    );
}
