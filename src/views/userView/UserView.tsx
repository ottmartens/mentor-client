import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Container, Card, makeStyles, Typography, CardMedia } from '@material-ui/core';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import Image from '../../components/image/Image';

const useStyles = makeStyles((theme) => ({
	title: {
		marginTop: '1em',
	},
	container: {
		textAlign: 'center',
	},
	image: {
		width: '80%',
		paddingBottom: '80%',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	email: {
		marginTop: '1em',
	},
	table: {
		width: '100%',
		fontSize: '1.275rem',
		fontWeight: 400,
		lineHeight: 1.43,
		letterSpacing: '0.01071em',
	},
	info: {
		textAlign: 'left',
		marginLeft: '8px',
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
		<div className={classes.container}>
			<Card>
				<Image src={user.imageUrl ? `${BASE_URL}${user.imageUrl}` : '/images/avatar_placeholder.webp'} />
				<table className={classes.table}>
					<tbody>
						<tr>
							<td>name:</td>
							<td className={classes.info}>{data.name}</td>
						</tr>
						<tr>
							<td>degree:</td>
							<td className={classes.info}>{data.degree}</td>
						</tr>
						<tr>
							<td>year:</td>
							<td className={classes.info}>{data.year}</td>
						</tr>
						<tr>
							<td>tagline:</td>
							<td className={classes.info}>{data.tagline}</td>
						</tr>
						<tr>
							<td>bio:</td>
							<td className={classes.info}>{data.bio}</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</div>
	);
}
