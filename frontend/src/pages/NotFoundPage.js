import React from 'react';
import {Grid, Container, Typography, Stack, Button} from '@mui/material';
import {PlainLayout} from 'components/layouts';
import {Link as RouterLink} from 'react-router-dom';
import {ArrowBack as ArrowBackIcon} from '@mui/icons-material';

const NotFoundPage = () => (
  <PlainLayout>
    <Grid
      sx={{height: '100%'}}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.dark"
          gutterBottom
        >
          404
        </Typography>
        <Typography variant="h5" align="center" color="text.primary" paragraph>
          Page not found
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          The page you're looking for is not here :(
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <Button component={RouterLink} to={'/dashboard'} variant="contained">
            <ArrowBackIcon /> Go to dashboard
          </Button>
        </Stack>
      </Container>
    </Grid>
  </PlainLayout>
);

export default NotFoundPage;
