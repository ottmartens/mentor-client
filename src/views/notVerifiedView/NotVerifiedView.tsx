import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import { makeStyles } from '@material-ui/styles';

interface Verification {
	isVerified: boolean;
	rejectReason?: string;
}

const useStyles = makeStyles((theme) => ({
	title: {},
}));

export default function NotVerifiedView({ user }: HasUserProps) {
	const [verification, setVerification] = React.useState<
		Verification | undefined
	>(undefined);
	const [getUserInfo, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.USER,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		getUserInfo();
	}, [called, getUserInfo]);

	React.useEffect(() => {
		if (!data || loading) {
			return;
		}
		setVerification({
			isVerified: data.isVerified,
			rejectReason: data.rejectReason,
		});
	});

	if (!data || !verification) {
		return <Loader />;
	}
	return (
		<div>
			<h1>
				{verification.isVerified === null
					? 'Your account is still being verified'
					: verification.isVerified === false
					? 'Your account has been rejected'
					: 'Your account is verified'}
			</h1>
			<p>{verification.isVerified === false && verification.rejectReason}</p>
		</div>
	);
}
