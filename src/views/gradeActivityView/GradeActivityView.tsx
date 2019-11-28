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
	const [graded, isGrading] = React.useState(false);


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

	React.useEffect(() => {
		if (!gradeActivityFn || !gradeActivityCalled) {
			return;
		}
		gradeActivityFn();
		isGrading(true);
	}, [gradeActivityCalled, gradeActivityFn]);

	/*if (loading || !data) {
		return <Loader />;
	}*/
	return (
		<>
			{error && <Notice variant="error" title="Grading the activity failed" message={error} />}
			{graded && <Notice variant="success" title="Activity graded successfully" message=''/>}
			<div className={classes.container}>
                {/* the real thing
                <Card>
					{data.name && data.group && data.date && (
						<div>
                            <Typography variant="body2">
						        {data.name}
                            </Typography>
                            <Typography variant="body2">
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
                            );
                    }

                    )}
                    </List>
                )}
                </Card>*/}

                <Card className={classes.menteeCard}>
                    <Typography variant="h3">
                        Mitsi pidu
                    </Typography>
                    <Typography variant="h6">
                        Grupp 4
                    </Typography>
                    <Typography variant="body2">
                        31/10/2019
                    </Typography>
                    <h2 className={classes.title}>{t(Translation.PARTICIPANTS)}</h2>
                    <List>
                        <div key={0}>
							<Divider variant="inset" component="li" />
							<Person name='Mentee Heamentee' tagline='kiiremini kõrgemale kaugemale' imageUrl='https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg' userId='3' key='1' />								
                            <Divider variant="inset" component="li" />
                        </div>
                        <div key={1}>
							<Person name='Veel Üks' tagline='hipp hipp hurraa' imageUrl='https://www.petmd.com/sites/default/files/petmd-puppy-weight.jpg' userId='2' key='2' />
							<Divider variant="inset" component="li" />
                        </div>
					</List>
                    <List className={classes.imageList}>
                        <img className={classes.image} src='https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/f_auto,q_auto,w_1100/v1555279313/shape/mentalfloss/istock-598825938.png' alt="Activity image"></img>
                        <img className={classes.image} src='https://img.buzzfeed.com/buzzfeed-static/static/2018-11/20/13/asset/buzzfeed-prod-web-03/sub-buzz-5195-1542739740-5.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto&output-quality=auto&output-format=auto&downsize=360:*' alt="Activity image"></img>
                        <img className={classes.image} src='https://www.telegraph.co.uk/content/dam/news/2016/05/06/rexfeatures_4950182a_trans_NvBQzQNjv4Bqeo_i_u9APj8RuoebjoAHt0k9u7HhRJvuo-ZLenGRumA.jpg?imwidth=450' alt="Activity image"></img>
                    </List>
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
                        }}
                    >
                        {t(Translation.DECLINE_ACTIVITY)}
                    </Button>
                </Card>
            </div>
		</>
	);
}
