import React from 'react'
import {TextField, Card, CardContent, Container} from '@mui/material';
import {DefaultLayout} from 'components/layouts';

const FilterForm = () => (
  <Card variant="outlined">
    <CardContent sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

      <TextField
        margin="normal"
        required
        fullWidth
        label="Size"
        onChange={() => {
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Price per month"
        onChange={() => {
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Number of rooms"
        onChange={() => {
        }}
      />
    </CardContent>
  </Card>
);

export default class MapPage extends React.Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search);

    this.state = {
      address: urlParams.get('address'),
    }
  }

  render() {
    return (
      <DefaultLayout hasFooter={false}>
        <Container component="main" maxWidth="xl">
          {this.state.address}
        </Container>
      </DefaultLayout>
    );
  }
}
