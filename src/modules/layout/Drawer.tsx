import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  SwipeableDrawer,
} from '@material-ui/core';
import {Email, GitHub, MonetizationOn} from '@material-ui/icons';

const GITHUB_URL = 'https://github.com/darrenswhite/pokedot';
const PAYPAL_URL =
  'https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZJZ94RDWF6GU4&item_name=Pokédot&currency_code=GBP&source=url';
const EMAIL_URL = 'mailto:pokedot@darrenswhite.com';

const items = [
  {title: 'GitHub', icon: GitHub, link: GITHUB_URL},
  {title: 'Donate', icon: MonetizationOn, link: PAYPAL_URL},
  {title: 'Email', icon: Email, link: EMAIL_URL},
];

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

export interface DrawerProps {
  open: boolean;
  onClose: React.ReactEventHandler<unknown>;
  onOpen: React.ReactEventHandler<unknown>;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  onOpen,
}: DrawerProps) => {
  const classes = useStyles();

  return (
    <SwipeableDrawer
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant="temporary"
    >
      <List dense>
        {items.map(item => (
          <ListItem
            key={item.title}
            button
            component="a"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemIcon>{<item.icon />}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
};
