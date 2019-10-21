import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { User, UserRole } from '../../types';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    list: {
      width: 250,
      height: '100%',
      background: '#3185FC',
      color: '#ffffff'
    },
    nav: {
      background: '#3185FC',
    },
    button: {
        color: '#ffffff',
    },
    profileButton: {
        position: 'absolute',
        right: 0
    },
    profileIcon: {
        color: '#ffffff'
    }
  });

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  function getPossibleRoutes(user: User | undefined) {
    if (!user) {
      return {'Login':'/login', 'Register':'/register'}
    }
  
    switch (user.role) {
      case UserRole.MENTEE:
        return {'My group':'/member/mentor-group/:id','Activities':'/member/activities', 'Log out':'/'}
      
      case UserRole.MENTOR:
        return {'My group':'/member/mentor-group/:id','Activities':'/member/activities', 'Log out':'/'}

      case UserRole.ADMIN:
        return {'Groups':'/member/mentor-group-list','Activities':'/member/activities', 'Grade activities':'/member/grade-activities','Deadlines':'/member/deadlines','Verify users':'/member/verify', 'Log out':'/'}
    }
  }
  
  const user: User = {
    CreatedAt: new Date('2019-10-13T19:11:37.259176Z'),
    DeletedAt: null,
    ID: 38,
    UpdatedAt: new Date('2019-10-13T19:11:37.259176Z'),
    email: 'chuck@stagnationlab.com',
    firstName: '',
    groupId: 0,
    imageUrl: '',
    lastName: '',
    password: '',
    role: UserRole.MENTEE,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjM4fQ.mhjTiAz078ITBcoQXPpmp9GXBfxRHKIezbB4gPAFZs8',
  };
  
  const routes = getPossibleRoutes(user)

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

   const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        {Object.entries(routes).map(([label, url]) => (
          <ListItemLink href={url}>
            <ListItemText primary={label} />
          </ListItemLink>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.nav}>
      <Button onClick={toggleDrawer('left', true)} className={classes.button}> 
        <MenuIcon/>
      </Button>
      <Button className={classes.profileButton}>
        <Link to='/member/profile'>
           <AccountCircleIcon className={classes.profileIcon}/>
        </Link>
      </Button>
      <SwipeableDrawer
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {sideList('left')}
      </SwipeableDrawer>
    </div>
  );
}