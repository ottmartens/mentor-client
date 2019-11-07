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
		marginLeft: '16px',
		marginTop: '0',
	},
	container: {
		textAlign: 'center',
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

	if (loading || !data) {
		return <div>Loading...</div>;
	}
	return (
		<Container maxWidth="sm">
			<div className={classes.container}>
                <Card>
                    <img src="https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg"></img>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.title}>{data.firstName}' '{data.lastName}</Typography>
                    <Typography variant="body2" color="textSecondary" component="p">{data.bio}</Typography>
                    <Typography variant="h5" component="h2">{data.email}</Typography>                
                </Card>
            </div>
		</Container>
	);
}
