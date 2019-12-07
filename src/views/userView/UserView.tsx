import React, { useState } from 'react';
import { Card, makeStyles, Button, Input } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps, UserRole } from '../../types';
import Loader from '../../components/loader/Loader';
import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import Image from '../../components/image/Image';
import { height } from '@material-ui/system';

const useStyles = makeStyles((theme) => ({
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
	desc: {
		color: '#979797',
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
		fontSize: '14px',
		textAlign: 'left',
		marginRight: '16px',
	},
	image: {
		margin: '8px',
	},
	requestButton: {
		margin: '1em',
	},
	verifyCard: {
		marginTop: '16px',
	},
	modalContent: {
		width: '300px',
		height: '100px',
	}
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

	const [rejectModalOpen, setRejectModalOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState('');

	const [queryUserData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.OTHER_USER,
		endPointUrlParam: params.id,
		authToken: user.token,
	});
	const [verifyUser, { data: acceptRequestResponse, called: gradeActivityCalled, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.VERIFY_USER,
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
					<Image
						className={classes.image}
						src={data.imageUrl ? `${BASE_URL}${data.imageUrl}` : '/images/avatar_placeholder.webp'}
					/>
				</div>
				<h2>{data.name}</h2>
				<table className={classes.table}>
					<tbody>
						<tr>
							<td className={classes.infoLabel}>{t(Translation.DEGREE)}:</td>
							<td className={classes.info}>{data.degree}</td>
						</tr>
						<tr>
							<td className={classes.infoLabel}>{t(Translation.YEAR)}:</td>
							<td className={classes.info}>{data.year}</td>
						</tr>
						<tr>
							<td className={classes.infoLabel}>{t(Translation.TAGLINE)}:</td>
							<td className={classes.info}>{data.tagline}</td>
						</tr>
						<tr>
							<td className={classes.infoLabel}>{t(Translation.USER_DESCRIPTION)}:</td>
							<td className={classes.info}>{data.bio}</td>
						</tr>
					</tbody>
				</table>
			</Card>
			{user.role === UserRole.ADMIN && !data.isVerified && (
				<div className={classes.verifyCard}>
					<Card>
						<div>
							<h3>{t(Translation.VERIFY_USER)}</h3>
							<div>
								<Button
									variant="contained"
									color="primary"
									className={classes.requestButton}
									onClick={async () => {
										await verifyUser({
											overrideVariables: {
												userId: data.userId,
												accept: true,
											},
										});
										await queryUserData();
									}}
								>
									{t(Translation.APPROVE_ACTIVITY)}
								</Button>
								{data.isVerified === false ? (
									<span>{t(Translation.USER_IS_REJECTED)}</span>
								) : (
									<Button
										variant="contained"
										color="primary"
										className={classes.requestButton}
										onClick={() => {
											setRejectModalOpen(true);
										}}
									>
										{t(Translation.DECLINE_ACTIVITY)}
									</Button>
								)}
							</div>
						</div>
					</Card>
					{rejectModalOpen && (
						<Dialog open>
							<DialogTitle id="alert-dialog-slide-title">{t(Translation.REJECT_USER_REASON)}:</DialogTitle>
							<DialogContent className={classes.modalContent}>
								<Input autoFocus multiline fullWidth placeholder={t(Translation.REJECTION_MODAL_MESSAGE)} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}></Input>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setRejectModalOpen(false)} color="primary">
									{t(Translation.CANCEL)}
								</Button>
								<Button
									onClick={async () => {
										await verifyUser({
											overrideVariables: {
												userId: data.userId,
												accept: false,
												rejectionReason,
											},
										});
										setRejectModalOpen(false);
										await queryUserData();
									}}
									variant="contained"
									color="secondary"
								>
									{t(Translation.REJECT_USER)}
								</Button>
							</DialogActions>
						</Dialog>
					)}
				</div>
			)}
		</div>
	);
}
