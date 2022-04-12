import React from 'react';
import {
  TextField, Container, Card, CardContent, Box, Typography, Grid, InputAdornment, FormHelperText,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {DefaultLayout} from 'components/layouts';
import ReactiveForm from 'components/ReactiveForm';
import {getErrorMessage, hasError, SuccessAlert} from 'utils/forms';
import MapField from 'components/MapField';
import constants from 'utils/constants';
import apartmentService from 'services/apartments';
import {parseErrors} from 'services/api';
import {routes} from 'routes';


export default class ApartmentAddPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      location: constants.DEFAULT_COORDINATES,
    }

    this.renderForm = this.renderForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSuccess = async () => {
    this.setState(state => {
      state.success = true;
      return state;
    });

    this.props.navigate(routes.apartments.path);
  }

  handleSubmit = async (event, data) => {
    try {
      await apartmentService.create({
        location: {
          latitude: this.state.location.lat,
          longitude: this.state.location.lng,
        },
        ...data,
      });
    } catch (e) {
      throw parseErrors(e);
    }
  };

  renderForm({loading, errors}, handleSubmit) {
    return (
      <React.Fragment>
        <SuccessAlert fullWidth isSuccessful={this.state.success} message={'Apartment added!'}/>
        <Grid container columnSpacing={2}>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.name)}
              margin="normal"
              size="small"
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
              helperText={getErrorMessage(errors?.name)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.floor)}
              margin="normal"
              size="small"
              fullWidth
              id="floor"
              label="Floor"
              name="floor"
              type="number"
              inputProps={{min: 0}}
              helperText={getErrorMessage(errors?.floor)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.area_size)}
              margin="normal"
              size="small"
              fullWidth
              id="area_size"
              label="Size"
              name="area_size"
              type="number"
              inputProps={{min: 0}}
              helperText={getErrorMessage(errors?.area_size)}
              InputProps={{
                startAdornment: <InputAdornment position="start">m²</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.price_per_month)}
              margin="normal"
              size="small"
              fullWidth
              id="price_per_month"
              label="Price per month"
              name="price_per_month"
              type="number"
              inputProps={{min: 0}}
              helperText={getErrorMessage(errors?.price_per_month)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.number_of_rooms)}
              margin="normal"
              size="small"
              fullWidth
              id="number_of_rooms"
              label="Number of rooms"
              name="number_of_rooms"
              type="number"
              inputProps={{min: 0}}
              helperText={getErrorMessage(errors?.number_of_rooms)}
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
        <TextField
          error={hasError(errors?.description)}
          margin="normal"
          size="small"
          fullWidth
          id="description"
          label="Description"
          placeholder="Description and details about this apartment, this will appear under the detail page."
          name="description"
          multiline
          rows={4}
          helperText={getErrorMessage(errors?.description)}
        />
        <Box>
          <MapField geocodeSearchBox={true} center={this.state.location} onChange={(location) => {
            this.setState(state => ({...state, location}))
          }}/>
          <FormHelperText error={true}>{getErrorMessage(errors?.location)}</FormHelperText>
        </Box>
        <LoadingButton
          loading={loading || this.state.success}
          type="button"
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{mt: 2, mb: 2}}
        >
          Add
        </LoadingButton>
      </React.Fragment>
    );
  }

  render() {
    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between'}}>
            <>
              <Typography component="h1" variant="h5">
                Add Apartment
              </Typography>
            </>
            <>
            </>
          </Box>
          <Card variant="outlined">
            <CardContent sx={{py: 0}}>
              <ReactiveForm enableEnterSubmit={false} onSubmit={this.handleSubmit} onSuccess={this.handleSuccess} render={this.renderForm}/>
            </CardContent>
          </Card>
        </Container>
      </DefaultLayout>
    )
  }
}
