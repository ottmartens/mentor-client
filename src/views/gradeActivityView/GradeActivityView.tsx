import React, { useState } from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Card, makeStyles, Divider, List, Button, Typography, Dialog, DialogTitle, DialogContent, Input, DialogActions } from '@material-ui/core';
import Person from '../../components/person/Person';
import { HasUserProps, UserRole } from '../../types';
//import Loader from '../../components/loader/Loader';
//import { Link } from 'react-router-dom';
//import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
//import { error } from 'console';
import Notice from '../../components/notice/Notice';
import useInput from '../../hooks/useInput';
import { isSet } from '../../services/validators';
import { id } from 'date-fns/esm/locale';
import Loader from '../../components/loader/Loader';

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

export default function GradeActivityView({ match, user }: Props) {
	const classes = useStyles();
	const { params } = match;
	const t = useTranslator();

	const [isVerified, setIsVerified] = React.useState(false);

	const [rejectModalOpen, setRejectModalOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState('');

	const [queryActivityData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.ACTIVITIES,
		endPointUrlParam: params.id,
		authToken: user.token,
	});

	const input = {
		points: useInput({ validators: [isSet], initialValue: 0}),
	};
	
	//accept or reject activity
	const [verifyActivity, { data: acceptRequestResponse, called: gradeActivityCalled, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.VERIFY_ACTIVITY,
		variables:{
			//rejectionReason: rejectionReason.value,
			//points: input.points.value,
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
			{error && <Notice variant="error" title="Tegevuse hindamine ebaõnnestus" message={error} />}
			{isVerified && <Notice variant="success" title="Tegevus hinnatud" message=''/>}
			<div className={classes.container}>
                <Card>
					{data && data.name && data.time && (
						<div>
                            <Typography variant="h3" className={classes.title}>
						        {data.name}
                            </Typography>
                            <Typography variant="h6">
                                {data.time}
                            </Typography>
                        </div>
                    )}
                    
				{data && data.participants && data.participants.length !== 0 && (
					<div>
                        <h2 className={classes.title}>{t(Translation.PARTICIPANTS)}</h2>
			    		<List>
							{data.participants.map(({ imageUrl, name, Id, tagline }, idx) => {
								return (
									<div key={idx}>
										{idx === 0 && <Divider variant="inset" component="li" />}
										<Person name={name} tagline={tagline} imageUrl={imageUrl} userId={Id} key={idx} />
										<Divider variant="inset" component="li" />
									</div>
								);
							})}
                		</List>
						</div>)}
                        
                {data && data.images && data.images.length !== 0 && (
                    <List>
                        {data.images.map(({imageUrl}) => {
                            return (
                                <img className={classes.image} src={imageUrl} alt="Activity image"></img>
                            );}
                        )}
                    </List>
							)}
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.requestButton}
                        onClick={async () => {
                            await verifyActivity({
                                overrideVariables: {
                                    accept: true,
                                },
                            });
							await queryActivityData();
							{ !error &&
								setIsVerified(true);
							}
                        }}
                    >
                        {t(Translation.APPROVE_ACTIVITY)}
                    </Button>
                    {'  '}
					{data && data.isVerified === false ? (
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
										await verifyActivity({
											overrideVariables: {
												accept: false,
												rejectionReason,
											},
										});
										setRejectModalOpen(false);
										await queryActivityData();
										{ !error &&
											setIsVerified(true);
										}
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
		</>
	);
}
