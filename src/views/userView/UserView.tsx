import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import {
	Container,
	Card,
	makeStyles,
    Typography,
} from '@material-ui/core';
import { HasUserProps, UserRole } from '../../types';

const useStyles = makeStyles((theme) => ({
	title: {
		marginTop: '1em',
	},
	container: {
        textAlign: 'center',
        padding: '2em',
        marginTop: '2em',
    },
    image:{
        width: '100%',
        marginBottom: '1em',
    },
    bio:{
        marginTop: '1em',
    },
    email:{
        marginTop: '1em',
    },
}));

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
}

export default function UserView({ match, user }: Props) {
	const classes = useStyles();
	const { params } = match;

	const [queryUserData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.USER,
		endPointUrlParam: params.id,
		authToken: user.token,
    });
    
	React.useEffect(() => {
		if (called) {
			return;
		}
		queryUserData();
	}, [called, queryUserData]);

/*	if (loading || !data) {
		return <div>Loading...</div>;
    }*/
    
	return (
		<Container maxWidth="sm">
			<div className={classes.container}>
                    <img src="https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg" className={classes.image}></img>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.title}>Firstname Lastname</Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className={classes.bio}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas elementum lorem nec eros posuere, ut fermentum est lobortis. Vivamus lobortis mollis augue aliquam tincidunt.</Typography>
                    <Typography variant="subtitle2" className={classes.email}>mentee@heamentee.ee</Typography>                
            </div>
		</Container>
	);
}
