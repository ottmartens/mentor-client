import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Card, makeStyles, Divider, List, Button, Typography } from '@material-ui/core';
import MentorGroupPreview from '../../components/mentorGroupPreview/MentorGroupPreview';
import Person from '../../components/person/Person';
import { HasUserProps, UserRole } from '../../types';
import Loader from '../../components/loader/Loader';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { error } from 'console';
import Notice from '../../components/notice/Notice';

const useStyles = makeStyles((theme) => ({
	menteeCard: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	title: {
		marginLeft: '16px',
		marginTop: '0',
	},
	buttonContainer: {
		textAlign: 'center',
	},
	mentorGroupContainer: {
		marginTop: '12px',
	},
	container: {
		textAlign: 'center',
	},
	button: { marginBottom: '8px' },
	largeWidth: {
		width: '224px',
	},
	image: {
        borderRadius: '5%',
        maxWidth: '100%',
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
			{graded && <Notice variant="success" title="Activity graded successfully" message={error} />}
			<div className={classes.container}>
				<div className={classes.mentorGroupContainer}>
					{/*{data.name && data.group && data.date && (
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
                    )}*/}
                    </div>
                    <div className={classes.mentorGroupContainer}>
                    <Typography variant="h3">
                        Mitsi pidu
                    </Typography>
                    <Typography variant="h6">
                        Grupp 4
                    </Typography>
                    <Typography variant="body2">
                        31/10/2019
                    </Typography>
				</div>

				{/* Participants */}
				{/*{data.mentees && data.mentees.length !== 0 && (
					<Card className={classes.menteeCard}>
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
					</Card>
                        )}*/}
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
                {/*{data.images && data.images.length !== 0 && (
                    <List>
                        {data.images.map(({imageUrl}) => {
                        return (
                            <img className={classes.image} src={imageUrl} alt="Activity image"></img>
                            );
                    }

                    )}
                    </List>
                )}*/}
                    <List className={classes.image}>
                        <img className={classes.image} src='https://i.ytimg.com/vi/8sUOvDzmrks/hqdefault.jpg' alt="Activity image"></img>
                        <img className={classes.image} src='https://media2.s-nbcnews.com/j/newscms/2018_20/1339477/puppy-cute-today-180515-main_a936531048fdb698635dd1b418abdee9.fit-760w.jpg' alt="Activity image"></img>
                        <img className={classes.image} src='https://www.telegraph.co.uk/content/dam/news/2016/05/06/rexfeatures_4950182a_trans_NvBQzQNjv4Bqeo_i_u9APj8RuoebjoAHt0k9u7HhRJvuo-ZLenGRumA.jpg?imwidth=450' alt="Activity image"></img>
                    </List>
                <div>
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
                </div>
			</div>
		</>
	);
}
