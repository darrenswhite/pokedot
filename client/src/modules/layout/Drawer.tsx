import {Email, GitHub, MonetizationOn} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';
import React from 'react';

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
  return (
    <SwipeableDrawer
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      sx={{width: drawerWidth, flexShrink: 0}}
      classes={
        {
          //paper: classes.drawerPaper,
        }
      }
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
