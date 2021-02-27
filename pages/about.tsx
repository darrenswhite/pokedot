import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

export default class About extends React.Component {
  render(): React.ReactNode {
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            About
          </Typography>

          <Link href="/" passHref>
            <Button variant="contained" color="primary">
              Go to the main page
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }
}
