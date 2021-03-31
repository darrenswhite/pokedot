import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {flow, map, values} from 'lodash/fp';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React, {ReactElement, useState} from 'react';

import {Route, Routes, getCurrentRoute} from '../../router/Routes';

import {DrawerProps} from './Drawer';

const Drawer = dynamic<DrawerProps>(() =>
  import('./Drawer').then(m => m.Drawer)
);

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: theme.spacing(2),
  },
}));

export const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const classes = useStyles();
  const router = useRouter();
  const currentRoute = getCurrentRoute(router);
  const currentTab = currentRoute?.path ?? false;

  const handleTabChange = (_: React.ChangeEvent<unknown>, value: string) =>
    router.push(value);

  const renderRouteLabel = (route: Route): ReactElement => {
    return (
      <div className={classes.tabContainer}>
        {<route.icon className={classes.tabIcon} />}
        {route.displayName}
      </div>
    );
  };

  return (
    <>
      <AppBar color="inherit" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            aria-label="Open drawer"
            edge="start"
            onClick={toggleDrawer}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>

          <Typography variant="h6" noWrap>
            Pokédot
          </Typography>
        </Toolbar>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Navigation tabs"
        >
          {flow(
            values,
            map(route => (
              <Tab
                key={route.path}
                label={renderRouteLabel(route)}
                value={route.path}
              />
            ))
          )(Routes)}
        </Tabs>
      </AppBar>

      <Drawer open={drawerOpen} onClose={toggleDrawer} onOpen={toggleDrawer} />
    </>
  );
};
