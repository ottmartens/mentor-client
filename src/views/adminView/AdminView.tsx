import React from 'react';
import { Container, List, ListItem, Divider, Link, Card, ListItemText, CardContent, FormControl, FormGroup} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
//import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
//import Loader from '../../components/loader/Loader';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { UserContext } from '../../contexts/UserContext';
import Person from '../../components/person/Person';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import useInput, { UseInput } from '../../hooks/useInput';
import CheckboxField from '../../components/checkboxField/CheckboxField';


const useStyles = makeStyles((theme) => ({
	container: {
		flexGrow: 1,
		textAlign: 'center',
        marginBottom: '16px',
    },
    listitem: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
		textDecoration: 'none',
		color: 'initial',
    },
    link: {
		textDecoration: 'none',
        color: 'inherit',
    },
    title: {
        color: '#2c4d7f'
    },
    menteeCard: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
    },
    personName: {
        fontSize: '20px',
    },
    listImage: {
		borderRadius: '50%',
    },
    listitem2: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
		textDecoration: 'none',
		color: 'initial',
    },
    acceptButton: {
		margin: '4px',
		backgroundColor: '#26c72b',
		color: '#fff',
	},
	declineButton: {
		margin: '4px',
		backgroundColor: '#B40404',
		color: '#fff',
    },
    cardTitle: {
    },
    suuredArvud: {
		color: 'purple',
		fontSize: '20px',
		marginRight: '15px',
    },
    card: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	buttons: {
		margin: '2em 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
}));

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
	setValue: (newValue: string) => void;
}

export default function AdminView({ user }: HasUserProps) {

    const classes = useStyles();
    //const userContext = React.useContext(UserContext);
    //const [added, isAdded] = React.useState(false);
    const t = useTranslator();
     //const [hasChanged, setHasChanged] = React.useState(false);

     const [state, setState] = React.useState({
		mentor: false,
		mentee: false,
      });
    
    const [queryDeadlineData, { data:currentDeadlineData , /*loading:currentDeadlineLoading,*/ called:currentDeadlineCalled }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.DEADLINE,
		authToken: user.token,
    });

    const input: { [s: string]: UseInput } = {
		mentor: useInput({ initialValue: (currentDeadlineData && currentDeadlineData.mentor) || '' }),
		mentee: useInput({ initialValue: (currentDeadlineData && currentDeadlineData.mentee) || '' }),
    };
    /*const [queryUnverifiedActivities, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.UNVERIFIED_ACTIVITIES,
		authToken: user.token,
    });

    const [queryAllUsers, { data:usersData, loading:usersLoading, called:usersCalled }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.ALL_USERS,
		authToken: user.token,
    });
    
	const [changeDeadlinesFn, { error }] = useBackend({
		requestMethod: RequestMethod.POST,
        endPoint: EndPoint.CHANGE_DEADLINES_REQUEST,
        variables: {
			mentor: input.mentor.value,
			mentee: input.mentee.value
		},
		authToken: user.token,
	});
		   
    React.useEffect(() => {
		if (called) {
			return;
		}
		queryUnverifiedActivities();
    }, [called, queryUnverifiedActivities]);

    React.useEffect(() => {
		if (usersCalled) {
			return;
		}
		queryAllUsers();
    }, [usersCalled, queryAllUsers]);
    */

   React.useEffect(() => {
    if (currentDeadlineCalled) {
        return;
    }
    queryDeadlineData();
    }, [currentDeadlineCalled, queryDeadlineData]);
    
    /*
    if (loading || !usersData || usersLoading || currentDeadlineLoading|| !data || !currentDeadlineData) {
		return <Loader />;
    }
    */

    const dummydata = [
        {
            name: "Tegevus 1",
            group: "Grupp2",
            id: "1"
        },
        {
            name: "Tegevus 2",
            group: "Grupp 9",
            id: "2"
        },
        {
            name: "Rebaste ristimine",
            group: "Parim grupp",
            id: "89"
        },
        {
            name: "Bowling",
            group: "Kaaa",
            id: "78"
        }
    ]
    const dummydata2 = [
        {
            name: "Poiss ree",
            imageurl: "https://www.petmd.com/sites/default/files/what-does-it-mean-when-cat-wags-tail.jpg",
            tagline: "Hea kasutaja",
            userId: "79",
        },
        {
            name: "Master Yoda",
            imageurl: "https://www.petmd.com/sites/default/files/what-does-it-mean-when-cat-wags-tail.jpg",
            tagline: "Hea kasutaja",
            userId: "76",
        },
        {
            name: "Tere hommikust",
            imageurl: "https://www.petmd.com/sites/default/files/what-does-it-mean-when-cat-wags-tail.jpg",
            tagline: "Hea kasutaja",
            userId: "73",
        },
        {
            name: "Tere õhtust",
            imageurl: "https://www.petmd.com/sites/default/files/what-does-it-mean-when-cat-wags-tail.jpg",
            tagline: "Hea kasutaja",
            userId: "72",
        }
    ];
    const activitytotal = dummydata.length;
    const usertotal = dummydata2.length;
	    
    return (
        <Container className={classes.container} maxWidth="sm">
             {/*{error && <Notice variant="error" title="Tähtaegade muutmine ebaõnnestus" message={error} />}
			{hasChanged && <Notice variant="success" title="Tähtajad muudetud" message=''/>}*/}
            <h1 className={classes.title}>{t(Translation.ADMIN_OVERVIEW)}</h1>
            <Card className={classes.menteeCard}>
                <h2 className={classes.cardTitle}>{t(Translation.GRADE_ACTIVITIES)}</h2>
                <h3>
                    {t(Translation.ADMIN_UNVERIFIED_ACTIVITIES)}: <span className={classes.suuredArvud}>{activitytotal}</span>
                </h3>
            <List>
                {dummydata.map(({name, group, id}) => {
                    return <div>
                        <ListItem className={classes.listitem}>
                            <div>
                                <Link
                                href={id ? `/activities/activity/${id}` : '#'}
                                className={classes.link}
                                >
                                    <ListItemText className={classes.personName} primary={name} secondary={group}/>
                                </Link>
                            </div>
                        </ListItem>
                        <Divider variant="middle"/>
                    </div>
                })}
            </List>
            </Card>
            <div>
            <Card className={classes.menteeCard}>
                <h2 className={classes.cardTitle}>{t(Translation.VERIFY_USERS)}</h2>
                <h3>
                    {t(Translation.ADMIN_UNVERIFIED_USERS)}: <span className={classes.suuredArvud}>{usertotal}</span>
                </h3>
                <List>
                {dummydata2.map(({name, tagline, userId, imageurl}) => {
                    return <div>
                        <Person name={name} tagline={tagline} imageUrl={imageurl} userId={userId}></Person>
                    </div>
                })}
                </List>
            </Card>
            </div>
			<div className={classes.container}>
                <Card className={classes.card}>
                    <CardContent>
						<FormControl component="fieldset">
							<h1>{t(Translation.DEADLINES)}</h1>
							<FormGroup>
								<CheckboxField label='Registreerimine avatud mentoritele' {...input.mentor} value={true}></CheckboxField>
									{/*value={data.mentor}>*/}
								<CheckboxField label='Registreerimine avatud menteedele' {...input.mentor} value={false}></CheckboxField>
									{/*value={data.mentee}>*/}
							</FormGroup>
						</FormControl>
                    </CardContent>
                </Card>
            </div>
        </Container>
	);
}