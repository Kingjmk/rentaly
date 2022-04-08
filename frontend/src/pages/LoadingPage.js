import React from 'react';
import {Grid, CircularProgress} from '@mui/material';
import {PlainLayout} from 'components/layouts';

const LoadingPage = () => (
  <PlainLayout>
    <Grid
      sx={{height: '100%'}}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress/>
    </Grid>
  </PlainLayout>
);

export default LoadingPage;
