import React from 'react';
import styles from './image.module.scss';
import classNames from 'classnames';

interface Props {
	src: string;
	className?: string;
}

export default function Image({ src, className }: Props) {
	return (
		<div className={classNames(styles.wrap, className)}>
			<div style={{ backgroundImage: `url(${src})` }} />
			<div style={{ backgroundImage: `url(${src})` }} />
		</div>
	);
}
