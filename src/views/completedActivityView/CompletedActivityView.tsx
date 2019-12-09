import React, { useState } from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import {
	Card,
	makeStyles,
	Divider,
	List,
	Button,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@material-ui/core';
import Person from '../../components/person/Person';
import { HasUserProps, UserRole } from '../../types';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import Notice from '../../components/notice/Notice';
import useInput from '../../hooks/useInput';
import { isSet } from '../../services/validators';
import Loader from '../../components/loader/Loader';
import Field from '../../components/field/Field';
import { BASE_URL } from '../../services/variables';

const useStyles = makeStyles((theme) => ({
	menteeCard: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	title: {
		marginTop: '1em',
	},
	buttonContainer: {
		textAlign: 'center',
	},
	container: {
		marginTop: '1em',
		textAlign: 'center',
	},
	button: { marginBottom: '8px' },
	largeWidth: {
		width: '224px',
	},
	image: {
		borderRadius: '2%',
		maxWidth: '90%',
		marginTop: '1em',
	},
	imageList: {
		justifyContent: 'center',
		marginTop: '1em',
		marginBottom: '2em',
	},
	requestButton: {
		margin: '1em',
	},
	modalContent: {
		width: '300px',
		height: '100px',
	},
}));

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
}

export default function CompletedActivityView({ match, user }: Props) {
	const classes = useStyles();
	const { params } = match;
	const t = useTranslator();

	const [isVerified, setIsVerified] = React.useState(false);
	const [rejectModalOpen, setRejectModalOpen] = useState(false);
	const [gradeModalOpen, setGradeModalOpen] = useState(false);

	const [queryActivityData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.ACTIVITIES,
		endPointUrlParam: params.id,
		authToken: user.token,
	});

	const input = {
		rejectionReason: useInput({ initialValue: '' }),
		points: useInput({ validators: [isSet], initialValue: 0 }),
	};

	//accept or reject activity
	const [verifyActivity, { error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.VERIFY_ACTIVITY,
		variables: {
			rejectionReason: input.rejectionReason.value,
			points: Number(input.points.value),
			id: Number(params.id),
		},
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryActivityData();
	}, [called, queryActivityData]);

	if (loading || !data) {
		return <Loader />;
	}

	return (
		<>
			{error && (
				<Notice
					variant="error"
					title="Tegevuse hindamine ebaõnnestus"
					message={error}
				/>
			)}
			{isVerified && (
				<Notice variant="success" title="Tegevus hinnatud" message="" />
			)}
			<div className={classes.container}>
				<Card>
					{data && data.activity.name && data.groupName && data.activity.time && (
						<div>
							<Typography variant="h3" className={classes.title}>
								{data.activity.name}
							</Typography>
							<Typography variant="h5">{data.groupName}</Typography>
							<Typography variant="h6">{data.activity.time}</Typography>
						</div>
					)}

					{data && data.participants && data.participants.length !== 0 && (
						<div>
							<h2 className={classes.title}>{t(Translation.PARTICIPANTS)}</h2>
							<List>
								{data.participants.map(
									({ imageUrl, name, userId, tagline }, idx) => {
										return (
											<div key={`${userId}${idx}`}>
												{idx === 0 && (
													<Divider variant="inset" component="li" />
												)}
												<Person
													name={name}
													tagline={tagline}
													imageUrl={imageUrl}
													userId={userId}
												/>
												<Divider variant="inset" component="li" />
											</div>
										);
									},
								)}
							</List>
						</div>
					)}

					{data && data.activity.images && data.activity.images.length !== 0 && (
						<List>
							{data.activity.images.map((imageUrl, idx) => {
								return (
									<img
										key={`${imageUrl}${idx}`}
										className={classes.image}
										src={`${BASE_URL}${imageUrl}`}
										alt="Activity"
									></img>
								);
							})}
						</List>
					)}

					{data && !data.activity.isVerified && user.role === UserRole.ADMIN && (
						<div>
							<Button
								variant="contained"
								color="primary"
								className={classes.requestButton}
								onClick={
									data.activity.templateId
										? async () => {
												await verifyActivity({
													overrideVariables: {
														accept: true,
													},
												});

												if (!error) {
													setIsVerified(true);
												}

												await queryActivityData();
										  }
										: () => {
												setGradeModalOpen(true);
										  }
								}
							>
								{t(Translation.APPROVE_ACTIVITY)}
							</Button>
							{data && data.activity.isVerified === false ? (
								<span>{t(Translation.ACTIVITY_IS_REJECTED)}</span>
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
					)}
				</Card>
				{rejectModalOpen && (
					<Dialog open>
						<DialogTitle>{t(Translation.REJECT_USER_REASON)}:</DialogTitle>
						<DialogContent className={classes.modalContent}>
							<Field
								label={t(Translation.REJECTION_MODAL_MESSAGE)}
								{...input.rejectionReason}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setRejectModalOpen(false)} color="primary">
								{t(Translation.CANCEL)}
							</Button>
							<Button
								onClick={async () => {
									await verifyActivity({
										overrideVariables: {
											accept: false,
										},
									});

									if (!error) {
										setIsVerified(true);
									}

									setRejectModalOpen(false);
									await queryActivityData();
								}}
								variant="contained"
								color="secondary"
							>
								{t(Translation.DECLINE_ACTIVITY)}
							</Button>
						</DialogActions>
					</Dialog>
				)}
				{gradeModalOpen && (
					<Dialog open>
						<DialogTitle id="alert-dialog-slide-title">
							{t(Translation.INSERT_POINTS)}:
						</DialogTitle>
						<DialogContent className={classes.modalContent}>
							<Field
								label={t(Translation.POINTS)}
								{...input.points}
								type="number"
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setGradeModalOpen(false)} color="primary">
								{t(Translation.CANCEL)}
							</Button>
							<Button
								onClick={async () => {
									await verifyActivity({
										overrideVariables: {
											accept: true,
										},
									});
									setGradeModalOpen(false);
									await queryActivityData();

									if (!error) {
										setIsVerified(true);
									}
								}}
								variant="contained"
								color="secondary"
							>
								{t(Translation.APPROVE_USER)}
							</Button>
						</DialogActions>
					</Dialog>
				)}
			</div>
		</>
	);
}
