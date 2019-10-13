import React from "react";
import styles from "./mentorGroupList.module.scss";

import { MentorGroupPreview } from "../../Components";
import useBackend, { RequestMethod, EndPoint } from "../../hooks/useBackend";
import { Container } from "@material-ui/core";

export default function MentorGroupListView() {
	const [queryFn, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GROUPS
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFn();
	}, [called]);

	if (loading || !data) {
		return <div>Loading...</div>;
	}
	console.log(data.data);
	return (
		<Container maxWidth="sm">
			<div className={styles.mentorGroupListView}>
				{data.data.map(({ mentors, title, tagline, id }, idx) => {
					return (
						<MentorGroupPreview
							id={id}
							key={idx}
							mentors={mentors}
							groupName={title}
							bio={tagline}
						/>
					);
				})}
			</div>
		</Container>
	);
}
