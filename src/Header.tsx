import React, {FC} from 'react';
import clsx from 'clsx';
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Routes} from './Routes';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
    },
  },
  drawerList: {
    marginTop: theme.spacing(6),
  },
}));

export const Header: FC = () => {
  const [open, setOpen] = React.useState(true);
  const toggle = () => setOpen(!open);
  const classes = useStyles();
  const router = useRouter();

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={toggle}
          >
            <Menu />
          </IconButton>

          <Typography variant="h6">Pokédot</Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <List className={classes.drawerList}>
          {Object.values(Routes).map(route => (
            <Link href={route.path} passHref key={route.displayName}>
              <ListItem
                button
                component="a"
                dense
                selected={router.pathname === route.path}
              >
                <ListItemIcon>{<route.icon />}</ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="caption">
                      {route.displayName}
                    </Typography>
                  }
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </React.Fragment>
  );
};
