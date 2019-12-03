import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Card, makeStyles, Divider, List, Button, Typography } from '@material-ui/core';
import Person from '../../components/person/Person';
import { HasUserProps, UserRole } from '../../types';
//import Loader from '../../components/loader/Loader';
//import { Link } from 'react-router-dom';
//import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
//import { error } from 'console';
import Notice from '../../components/notice/Notice';

const useStyles = makeStyles((theme) => ({
	menteeCard: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	title: {
        display: 'flex',
        alignSelf: 'left',
        marginLeft: '1em',
        marginTop: '2em',
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
	const [isGraded, setIsGraded] = React.useState(false);


	const [queryActivityData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.ACTIVITY,
		endPointUrlParam: params.id,
		authToken: user.token,
	});

	//accept or reject activity
	const [gradeActivityFn, { data: acceptRequestResponse, called: gradeActivityCalled, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.ACCEPT_ACTIVITY_REQUEST,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryActivityData();
	}, [called, queryActivityData]);

	/*if (loading || !data) {
		return <Loader />;
	}*/
	return (
		<>
			{error && <Notice variant="error" title="Tegevuse hindamine ebaõnnestus" message={error} />}
			{isGraded && <Notice variant="success" title="Tegevus hinnatud" message=''/>}
			<div className={classes.container}>
                <Card>
					{data.name && data.group && data.date && (
						<div>
                            <Typography variant="h3">
						        {data.name}
                            </Typography>
                            <Typography variant="h6">
                                {data.group}
                            </Typography>
                            <Typography variant="body2">
                                {data.date}
                            </Typography>
                        </div>
                    )}
                    
				{data.mentees && data.mentees.length !== 0 && (
					<div>
                        <h2 className={classes.title}>{t(Translation.APPROVED_MENTEES)}</h2>
			    		<List>
							{data.mentees.map(({ imageUrl, name, userId, tagline }, idx) => {
								return (
									<div key={idx}>
										{idx === 0 && <Divider variant="inset" component="li" />}
										<Person name={name} tagline={tagline} imageUrl={imageUrl} userId={userId} key={idx} />
										<Divider variant="inset" component="li" />
									</div>
								);
							})}
                		</List>
                    </div>)}
                        
                {data.images && data.images.length !== 0 && (
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
                            await gradeActivityFn({
                                overrideVariables: {
                                    //activityId,
                                    accept: true,
                                },
                            });
							await queryActivityData();
							{ !error &&
								setIsGraded(true);
							}
                        }}
                    >
                        {t(Translation.APPROVE_ACTIVITY)}
                    </Button>
                    {'  '}
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.requestButton}
                        onClick={async () => {
                            await gradeActivityFn({
                                overrideVariables: {
                                    //activityId,
                                    accept: false,
                                },
                            });
							await queryActivityData();
							{ !error &&
								setIsGraded(true);
							}
                        }}
                    >
                        {t(Translation.DECLINE_ACTIVITY)}
                    </Button>
                </Card>    
            </div>
		</>
	);
}
