import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from 'next/link';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';

export default class Index extends React.Component {
  render(): React.ReactNode {
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Index
          </Typography>

          <Link href="/about" passHref>
            <ListItem button component="a">
              <ListItemText>Go to the about page</ListItemText>
            </ListItem>
          </Link>
        </Box>
      </Container>
    );
  }
}
