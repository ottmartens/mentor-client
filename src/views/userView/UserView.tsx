import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Container, Card, makeStyles, Typography, CardMedia } from '@material-ui/core';
import { HasUserProps, UserRole } from '../../types';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';

const useStyles = makeStyles((theme) => ({
	container: {
		textAlign: 'center',
		padding: '2em',
		marginTop: '2em',
	},
	image: {
		width: '50%',
		height: '15em',
		margin: '2em auto',
	},
	card: {
		minHeight: '15em',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},
	bio: {
		marginBottom: '2em',
	},
	desc: {
		color: '#979797',
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
	const t = useTranslator();

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
				<Card className={classes.card}>
					<CardMedia
						image={user.imageUrl ? `${BASE_URL}${user.imageUrl}` : '/images/avatar_placeholder.webp'}
						className={classes.image}
					/>
					<Typography gutterBottom variant="h5" component="h2" >
						{data.name}
					</Typography>
					<Typography variant="body2">
						<span className={classes.desc}>Eriala:    </span>
						{data.degree}
					</Typography>
					<Typography variant="body2">
						<span className={classes.desc}>Kursuse aasta:    </span>
						{data.year}
					</Typography>
					<Typography variant="body2" className={classes.bio}>
						<span className={classes.desc}>Mõni sõna minust:    </span>
						{data.bio}
					</Typography>
				</Card>
			</div>
		</Container>
	);
}
