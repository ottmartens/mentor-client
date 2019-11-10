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
	},
	profileButton: {
		position: 'absolute',
		right: 0,
	},
	name: {
		position: 'absolute',
		right: 70,
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
		display: 'block',
		width: '40px',
		height: '40px',
		margin: 'auto',
	},
	logoContainer: {
		display: 'flex',
		width: '50px',
		height: '50px',
		background: theme.palette.secondary.main,
		margin: 'auto',
		borderRadius: '50%',
		boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
	},
	listText: {
		color: '#fff',
		textDecoration: 'none',
	},
}));

type NavItem = {
	label: string;
	url: string;
};

export default function Navbar({ user }: HasUserProps) {
	const classes = useStyles();
	const routes = getPossibleRoutes(user);
	const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

	const showDrawer = (open) => (e) => {
		setIsDrawerOpen(open);
	};
	return (
		<AppBar color="secondary" position="relative">
			<Toolbar variant="dense">
				<Button onClick={showDrawer(true)} className={classes.button}>
					<MenuIcon />
				</Button>
				<Typography className={classes.name}>Good Boye</Typography>
				<Button className={classes.profileButton}>
					<Link to="/member/profile">
						<Avatar
							src="https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg"
							className={classes.avatar}
						>
							GB
						</Avatar>
					</Link>
				</Button>
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
							<ListItem button className={classes.listElementContainer}>
								<a href="https://mits.ee">
									<img className={classes.logo} src="images/logo_valge.webp" alt="MITS LOGO"></img>
								</a>
							</ListItem>
						</List>
					</div>
				</SwipeableDrawer>
			</Toolbar>
		</AppBar>
	);
}

function getPossibleRoutes(user: UserContextUser): NavItem[] {
	switch (user.role) {
		case UserRole.MENTEE:
			return [
				{ label: 'My group', url: `/member/mentor-group/my-group` },
				{ label: 'All groups', url: '/member/mentor-group-list' },
				{ label: 'Activities', url: '/member/acitivities' },
				{ label: 'Logout', url: '/logout' },
			];

		case UserRole.MENTOR:
			return [
				{ label: 'My group', url: `/member/mentor-group/my-group` },
				{ label: 'All groups', url: '/member/mentor-group-list' },
				{ label: 'Activities', url: '/member/acitivities' },
				{ label: 'Find co-mentor', url: '/member/find-co-mentor' },
				{ label: 'Logout', url: '/logout' },
			];

		case UserRole.ADMIN:
			return [
				{ label: 'Groups', url: '/admin/mentor-groups' },
				{ label: 'Grade activities', url: '/admin/grade-activities' },
				{ label: 'Activities', url: '/admin/acitivities' },
				{ label: 'Deadlines', url: '/admin/deadlines' },
				{ label: 'Vefify Users', url: '/admin/verify-users' },
				{ label: 'Logout', url: '/admin/logout' },
			];
		default:
			return [];
	}
}
