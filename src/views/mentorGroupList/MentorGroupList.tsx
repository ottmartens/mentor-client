import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Container } from '@material-ui/core';
import MentorGroupPreview from '../../components/mentorGroupPreview/MentorGroupPreview';

export default function MentorGroupListView() {
	const [queryFn, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GROUPS,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFn();
	}, [called, queryFn]);

	if (loading || !data) {
		return <div>Loading...</div>;
	}
	return (
		<Container maxWidth="sm">
			<div>
				{data.map(({ mentors, title, tagline, id }, idx) => {
					return <MentorGroupPreview id={id} key={idx} mentors={mentors} groupName={title} bio={tagline} />;
				})}
			</div>
		</Container>
	);
}
