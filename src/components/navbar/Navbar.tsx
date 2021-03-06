import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import { UserRole, HasUserProps } from '../../types';
import { Link } from 'react-router-dom';
import { Toolbar, AppBar, Avatar, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { UserContextUser } from '../../contexts/UserContext';
import { BASE_URL } from '../../services/variables';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';

const useStyles = makeStyles((theme) => ({
	list: {
		width: 250,
		height: '100%',
		background: theme.palette.secondary.main,
		color: '#ffffff',
	},
	nav: {
		background: theme.palette.secondary.main,
	},
	button: {
		color: '#ffffff',
		'&:hover': {
			backgroundColor: 'transparent',
		},
	},
	profileButton: {
		position: 'absolute',
		right: 0,
	},
	name: {
		marginLeft: 'auto',
		marginRight: '40px',
	},
	profileIcon: {
		color: '#ffffff',
	},
	listElementContainer: {
		textAlign: 'center',
		paddingTop: '12px',
		paddingBottom: '12px',
		borderBottom: '1px solid #9F81F7',
	},
	listTitle: {
		margin: 0,
	},
	avatar: {
		margin: 10,
	},
	logo: {
		width: '40px',
		height: '40px',
	},
	logoContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
	listText: {
		color: '#fff',
		textDecoration: 'none',
	},
	role: {
		color: '#BACDF8',
		display: 'inline',
	},
	largeFont: {
		fontSize: '1.5rem',
	},
	logoText: {
		marginLeft: '2px',
		marginTop: '-4px',
	},
	mitsLink: {
		color: 'inherit',
		textDecoration: 'none',
	},
}));

type NavItem = {
	label: string;
	url: string;
};

export default function Navbar({ user }: HasUserProps) {
	const classes = useStyles();
	const t = useTranslator();
	const routes = getPossibleRoutes(user);
	const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

	const showDrawer = (open) => (e) => {
		setIsDrawerOpen(open);
	};
	return (
		<AppBar color="secondary" position="fixed">
			<Toolbar variant="dense">
				<Button onClick={showDrawer(true)} className={classes.button}>
					<MenuIcon />
				</Button>
				<Typography className={classes.name}>
					{user.name ? user.name : ''}
					<span className={classes.role}>
						{user.role === UserRole.MENTEE && ' (Mentee)'}
						{user.role === UserRole.MENTOR && ' (Mentor)'}
						{user.role === UserRole.ADMIN && ' (Admin)'}
					</span>
				</Typography>
				<div className={classes.profileButton}>
					<Link to="/member/profile">
						<Avatar
							src={user.imageUrl ? `${BASE_URL}${user.imageUrl}` : '/images/avatar_placeholder.webp'}
							className={classes.avatar}
						></Avatar>
					</Link>
				</div>
				<SwipeableDrawer open={isDrawerOpen} onClose={showDrawer(false)} onOpen={showDrawer(true)}>
					<div className={classes.list} onClick={showDrawer(false)}>
						<List>
							<ListItem component="label" className={classNames(classes.listElementContainer)}>
								<ListItemText primary={<h3 className={classes.listTitle}>MentorApp</h3>} />
							</ListItem>
							{routes.map((route, index) => (
								<Link to={route.url} key={index} className={classes.listText}>
									<ListItem button component="label" className={classes.listElementContainer}>
										<ListItemText primary={route.label} />
									</ListItem>
								</Link>
							))}
							<a href="https://mits.ee" className={classes.mitsLink}>
								<ListItem
									button
									className={classNames(classes.listElementContainer, classes.logoContainer, classes.largeFont)}
								>
									<img className={classes.logo} src="/images/logo_valge.webp" alt="MITS LOGO"></img>
									<label className={classes.logoText}>MITS</label>
								</ListItem>
							</a>
						</List>
					</div>
				</SwipeableDrawer>
			</Toolbar>
		</AppBar>
	);
	function getPossibleRoutes(user: UserContextUser): NavItem[] {
		switch (user.role) {
			case UserRole.MENTEE:
				return user.groupId
					? [
							{ label: t(Translation.MY_MENTORGROUP), url: `/member/my-mentor-group/` },
							{ label: t(Translation.ALL_GROUPS), url: '/member/mentor-group-list' },
							{ label: t(Translation.ACTIVITIES), url: '/member/activities' },
							{ label: t(Translation.LOGOUT), url: '/logout' },
					  ]
					: [
							{ label: t(Translation.ALL_GROUPS), url: '/member/mentor-group-list' },
							{ label: t(Translation.LOGOUT), url: '/logout' },
					  ];

			case UserRole.MENTOR:
				return user.groupId
					? [
							{ label: t(Translation.MY_MENTORGROUP), url: `/member/my-mentor-group/` },
							{ label: t(Translation.ALL_GROUPS), url: '/member/mentor-group-list' },
							{ label: t(Translation.ACTIVITIES), url: '/member/activities' },
							{ label: t(Translation.LOGOUT), url: '/logout' },
					  ]
					: [
							{ label: t(Translation.ALL_GROUPS), url: '/member/mentor-group-list' },
							{ label: t(Translation.FIND_MENTOR), url: '/member/find-co-mentor' },
							{ label: t(Translation.LOGOUT), url: '/logout' },
					  ];

			case UserRole.ADMIN:
				return [
					{ label: t(Translation.ADMIN_OVERVIEW), url: '/admin/main' },
					{ label: t(Translation.GROUPS), url: '/member/mentor-group-list' },
					{ label: t(Translation.ACTIVITIES), url: '/member/activities' },
					{ label: t(Translation.LOGOUT), url: '/logout' },
				];

			default:
				return [];
		}
	}
}
