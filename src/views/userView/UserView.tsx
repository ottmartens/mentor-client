import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Container, Card, makeStyles, Typography } from '@material-ui/core';
import { HasUserProps, UserRole } from '../../types';
import Loader from '../../components/loader/Loader';

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
		endPoint: EndPoint.OTHER_USER,
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
		return <Loader />;
	}
	return (
		<Container maxWidth="sm">
			<div className={classes.container}>
				<Card>
					<img src="https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg"></img>
					<Typography gutterBottom variant="h5" component="h2" className={classes.title}>
						{data.firstName}' '{data.lastName}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{data.bio}
					</Typography>
					<Typography variant="h5" component="h2">
						{data.email}
					</Typography>
				</Card>
			</div>
		</Container>
	);
}
