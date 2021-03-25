import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import {
  AppBar,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {getCurrentRoute, Routes} from '../../router/Routes';
import {DrawerProps} from './Drawer';

const Drawer = dynamic<DrawerProps>(() =>
  import('./Drawer').then(module => module.Drawer)
);

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
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

  return (
    <React.Fragment>
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
          aria-label="scrollable auto tabs example"
        >
          {Object.values(Routes).map(route => (
            <Tab
              key={route.path}
              label={route.displayName}
              value={route.path}
            />
          ))}
        </Tabs>
      </AppBar>

      <Drawer open={drawerOpen} onClose={toggleDrawer} onOpen={toggleDrawer} />
    </React.Fragment>
  );
};
