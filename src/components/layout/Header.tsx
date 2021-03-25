import React, {useState} from 'react';
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  SwipeableDrawer,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {Email, GitHub, Menu, MonetizationOn} from '@material-ui/icons';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {getCurrentRoute, Routes} from '../../router/Routes';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const GITHUB_URL = 'https://github.com/darrenswhite/pokedot';
const PAYPAL_URL =
  'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZJZ94RDWF6GU4&item_name=Pokédot&currency_code=GBP&source=url';
const EMAIL_URL = 'mailto:pokedot@darrenswhite.com';

const items = [
  {title: 'GitHub', icon: GitHub, link: GITHUB_URL},
  {title: 'Donate', icon: MonetizationOn, link: PAYPAL_URL},
  {title: 'Email', icon: Email, link: EMAIL_URL},
];

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

      <SwipeableDrawer
        open={drawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="temporary"
      >
        <List dense>
          {items.map(item => (
            <Link href={item.link} passHref key={item.title}>
              <ListItem
                button
                component="a"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemIcon>{<item.icon />}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </Link>
          ))}
        </List>
      </SwipeableDrawer>
    </React.Fragment>
  );
};
