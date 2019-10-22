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

export default function MentorPairingView({ user }: HasUserProps) {
	const classes = useStyles();
    
    //get data
    const [queryFreeMentorsData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GET_DATA,
        authToken: user.token,
    });

    //request to pair up w free mentor
    const [requestPairUpFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.REQUEST_CREATION,
        variables: { userId: user.ID },
        authToken: user.token,
	});

    //accept or reject sent requests
	const [replyToRequestsFn] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.ACCEPT_CREATION,
        variables: {  },
        authToken: user.token,
	});

    React.useEffect(() => {
		if (called) {
			return;
		}
		queryFreeMentorsData();
	}, [called, queryFreeMentorsData]);

    /*if (loading || !data || sentRequestsLoading || !sentRequestsData) {
		return <div>Loading...</div>;
	}*/


  // const sortedData = data.sort((a, b) => (a.hasRequestedYou > b.hasRequestedYou) ? 1 : ((a.youHaveRequested > b.youHaveRequested) ? 1 : -1))
    
    return (
		<Container maxWidth="sm">
			<List>

            {data.map(({ ID, firstName, lastName, hasRequestedYou, youHaveRequested, imageUrl }, idx) => {
                        return (
                            <div key={idx}>
                                {idx === 0 && <Divider variant="inset" component="li" />}
                                <ListItem key={idx}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.requestImage} src={imageUrl} />
                                    </ListItemAvatar>
                                    <ListItemText primary={`${firstName} ${lastName}`} />
                                    {hasRequestedYou && (
                                        <div>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.requestButton}
                                                onClick={() => {
                                                    replyToRequestsFn({
                                                        overrideVariables: {
                                                            userId: ID,
                                                            accept: true,
                                                        },
                                                    });
                                                }}
                                            >
                                                ACCEPT
                                            </Button>{'  '}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.requestButton}
                                                onClick={() => {
                                                    replyToRequestsFn({
                                                        overrideVariables: {
                                                            userId: ID,
                                                            accept: false,
                                                        },
                                                    });
                                                }}
                                            >
                                                DECLINE
                                            </Button>
                                        </div>)}
                                    {!hasRequestedYou && (
                                        <div>
                                            <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.requestButton}
                                            onClick={() => {
                                                requestPairUpFn({
                                                    overrideVariables: {
                                                        userId: ID,
                                                    },
                                                });
                                            }}
                                        >
                                            REQUEST
                                        </Button>
                                    </div>
                                    )}
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </div>
                        );
                    })}
            </List>
		</Container>
	);
}
