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
	imageContainer: {
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
		maxHeight: '336px',
		maxWidth: '336px',
	},
	email: {
		marginTop: '1em',
	},
	table: {
		width: '336px',
		marginRight: 'auto',
		marginLeft: 'auto',
		marginBottom: '20px',
		marginTop: '12px',
		lineHeight: 1.43,
		letterSpacing: '0.01071em',
	},
	info: {
		fontWeight: 400,
		textAlign: 'left',
		marginLeft: '8px',
		color: '#616060',
		fontSize: '0.975rem',
	},
	infoLabel: {
		fontWeight: 700,
		fontSize: '1.175rem',
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
				<div className={classes.imageContainer}>
					<Image src={user.imageUrl ? `${BASE_URL}${user.imageUrl}` : '/images/avatar_placeholder.webp'} />
				</div>
				<table className={classes.table}>
					<tbody>
						<tr>
							<td className={classes.infoLabel}>name:</td>
							<td className={classes.info}>{data.name}</td>
						</tr>
						<tr>
							<td className={classes.infoLabel}>degree:</td>
							<td className={classes.info}>{data.degree}</td>
						</tr>
						<tr>
							<td className={classes.infoLabel}>year:</td>
							<td className={classes.info}>{data.year}</td>
						</tr>
						<tr>
							<td className={classes.infoLabel}>tagline:</td>
							<td className={classes.info}>{data.tagline}</td>
						</tr>
						<tr>
							<td className={classes.infoLabel}>bio:</td>
							<td className={classes.info}>{data.bio}</td>
						</tr>
					</tbody>
				</table>
			</Card>
		</div>
	);
}
