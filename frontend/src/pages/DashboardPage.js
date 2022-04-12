import React from 'react';
import {Container, Box, TextField, Typography} from '@mui/material';
import {DefaultLayout} from 'components/layouts';
import constants from 'utils/constants';

export default class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null,
    };
  }

  handleSubmit() {
    // redirect to map page
    this.props.navigate({
      pathname: '/map',
      search: `?address=${this.state.address || ''}`,
    });
  }

  render() {
    return (
      <DefaultLayout hasFooter={false}>
        <Container component="main" maxWidth="md" sx={{height: '60vh', display: 'flex', alignItems: 'center', textAlign: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Typography component="h1" variant="h3">
              {constants.WEBSITE_NAME}
            </Typography>
            <p>{constants.WEBSITE_DESCRIPTION}</p>
            <TextField
              fullWidth
              style={{backgroundColor: '#fff'}}
              id="address"
              placeholder="Search City, Neighbourhood or Address"
              variant="outlined"
              onChange={(event) => this.setState({address: event.target.value})}
              onKeyPress={event => {
                if (event.key === 'Enter') this.handleSubmit();
              }}
            />
          </Box>
        </Container>
      </DefaultLayout>
    );
  }
}
