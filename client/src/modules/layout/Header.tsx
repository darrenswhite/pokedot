import {Menu} from '@mui/icons-material';
import {
  AppBar,
  Box,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {flow, map, values} from 'lodash/fp';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React, {ReactElement, useState} from 'react';

import {Route, Routes, getCurrentRoute} from '../../router/Routes';

import {DrawerProps} from './Drawer';

const Drawer = dynamic<DrawerProps>(() =>
  import('./Drawer').then(m => m.Drawer)
);

export const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const router = useRouter();
  const currentRoute = getCurrentRoute(router);
  const currentTab = currentRoute?.path ?? false;
  const theme = useTheme();

  const handleTabChange = (_: React.ChangeEvent<unknown>, value: string) => {
    router.push(value).catch(e => {
      console.error('Failed to change tab.', e);
    });
  };

  const renderRouteLabel = (route: Route): ReactElement => {
    return (
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        {<route.icon style={{marginRight: 2}} />}
        {route.displayName}
      </Box>
    );
  };

  return (
    <>
      <AppBar color="inherit" sx={{zIndex: theme.zIndex.drawer + 1}}>
        <Toolbar variant="dense">
          <IconButton
            aria-label="Open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{marginRight: 2}}
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
            map((route: Route) => (
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
