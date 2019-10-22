import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import {
	Container,
	Card,
	makeStyles,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Button,
} from '@material-ui/core';
import { HasUserProps, UserRole } from '../../types';

const useStyles = makeStyles((theme) => ({
	mentorCard: {
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
	requestImage: {
		borderRadius: '0',
	},
	requestButton: {
		margin: '4px',
	},
}));

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
}

export default function MentorPairingView({ match, user }: Props) {
	const classes = useStyles();
    const { params } = match;
    
    //get requests sent to you
	const [queryReceivedRequestsData, { data:sentRequestsData, loading:sentRequestsLoading, called:sentRequestsCalled }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GET_REQUESTS_SENT_TO_YOU,
		endPointUrlParam: params.id,
    });
    
    //get free mentors
    const [queryFreeMentorsData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GET_FREE_MENTORS,
		endPointUrlParam: params.id,
    });

    //request to pair up w free mentor
    const [requestPairUpFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.PAIR_UP,
		variables: { userId: user.ID },
	});

    //accept or reject sent requests
	const [replyToRequestsFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.REPLY_TO_REQUESTS,
		variables: { },
	});

	React.useEffect(() => {
		if (sentRequestsCalled) {
			return;
		}
		queryReceivedRequestsData();
	}, [sentRequestsCalled, queryReceivedRequestsData]);

    React.useEffect(() => {
		if (called) {
			return;
		}
		queryFreeMentorsData();
	}, [called, queryFreeMentorsData]);

    /*if (loading || !data || sentRequestsLoading || !sentRequestsData) {
		return <div>Loading...</div>;
	}*/

    const mockData = [{FirstName:"silver", LastName:"laius", ImageUrl:"https://image.shutterstock.com/image-photo/pug-dog-sad-puppiessleep-rest-260nw-343344158.jpg", UserId:"1"}, {FirstName:"Lizard", LastName:"Guy", ImageUrl:"https://image.shutterstock.com/image-photo/pug-dog-sad-puppiessleep-rest-260nw-343344158.jpg", UserId:"2"},{FirstName:"Ei", LastName:"Jaksa", ImageUrl:"https://image.shutterstock.com/image-photo/pug-dog-sad-puppiessleep-rest-260nw-343344158.jpg", UserId:"3"},{FirstName:"Tahaks", LastName:"Koju", ImageUrl:"https://image.shutterstock.com/image-photo/pug-dog-sad-puppiessleep-rest-260nw-343344158.jpg", UserId:"4"}]
    return (
		<Container maxWidth="sm">
			<List>
            <h2 className={classes.title}>Requests sent to you</h2>
            {mockData.map(({ ImageUrl, FirstName, LastName, UserId }, idx) => {
                        return (
                            <div key={idx}>
                                {idx === 0 && <Divider variant="inset" component="li" />}
                                <ListItem key={idx}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.requestImage} src={ImageUrl} />
                                    </ListItemAvatar>
                                    <ListItemText primary={`${FirstName} ${LastName}`} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.requestButton}
                                        onClick={() => {
                                            replyToRequestsFn({
                                                overrideVariables: {
                                                    userId: UserId,
                                                    accept: true,
                                                },
                                            });
                                        }}
                                    >
                                        ACCEPT
                                    </Button>{' '}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.requestButton}
                                        onClick={() => {
                                            replyToRequestsFn({
                                                overrideVariables: {
                                                    userId: UserId,
                                                    accept: false,
                                                },
                                            });
                                        }}
                                    >
                                        DECLINE
                                    </Button>
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </div>
                        );
                    })}
                    <h2 className={classes.title}>Free mentors</h2>
                    {mockData.map(({ ImageUrl, FirstName, LastName, UserId }, idx) => {
                        return (
                            <div key={idx}>
                                {idx === 0 && <Divider variant="inset" component="li" />}
                                <ListItem key={idx}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.requestImage} src={ImageUrl} />
                                    </ListItemAvatar>
                                    <ListItemText primary={`${FirstName} ${LastName}`} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.requestButton}
                                        onClick={() => {
                                            requestPairUpFn({
                                                overrideVariables: {
                                                    userId: UserId,
                                                },
                                            });
                                        }}
                                    >
                                        REQUEST
                                    </Button>
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </div>
                        );
                    })}
            </List>
		</Container>
	);
}
