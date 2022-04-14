import React from 'react';
import {Container, Box, Typography, Link} from '@mui/material';
import {DefaultLayout} from 'components/layouts';
import SearchableAddressField from 'components/SearchableAddressField';
import constants from 'utils/constants';
import {routes} from 'routes';


export default class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {disabled: false}
  }

  navigateToMap(place = {}) {
    this.setState({disabled: true});
    const urlParamString = new URLSearchParams({
      address: place?.display_name || '',
      lat: place?.lat || '',
      lng: place?.lng || '',
    }).toString();

    this.props.navigate({
      pathname: routes.map.path,
      search: urlParamString,
    });
  }

  handleLocationSelect(event, newValue) {
    this.navigateToMap(newValue);
  }

  renderNoOptionsText = () => (
    <div>
      <span>No places found? you can open </span>
      <Link onClick={() => this.navigateToMap()} variant="body">the map instead</Link>
    </div>
  )

  render() {
    return (
      <DefaultLayout hasFooter={false}>
        <Container component="main" maxWidth="md" sx={{height: '60vh', display: 'flex', alignItems: 'center', textAlign: 'center'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Typography component="h1" variant="h3">
              {constants.WEBSITE_NAME}
            </Typography>
            <p>{constants.WEBSITE_DESCRIPTION}</p>
            <SearchableAddressField
              onLocationSelect={this.handleLocationSelect.bind(this)}
              renderNoOptionsText={this.renderNoOptionsText.bind(this)}
              disabled={this.state.disabled}
            />
          </Box>
        </Container>
      </DefaultLayout>
    );
  }
}
