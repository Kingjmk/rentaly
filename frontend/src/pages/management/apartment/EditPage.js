import React from 'react';
import {
  TextField, Container, Card, CardContent, Box, Typography, Grid, InputAdornment, FormHelperText, MenuItem, Button,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Breadcrumbs, DefaultLayout} from 'components/layouts';
import {VisibilityOutlined as EyeIcon} from '@mui/icons-material';
import ReactiveForm from 'components/ReactiveForm';
import {getErrorMessage, hasError} from 'utils/forms';
import MapField from 'components/MapField';
import ImagesUploader from 'components/ImagesUploader';
import constants from 'utils/constants';
import LoadingPage from 'pages/LoadingPage';
import apartmentService from 'services/apartments';
import {parseErrors} from 'services/api';
import {routes} from 'routes';
import {ApartmentStates, ApartmentStatesLabels} from 'utils/common';

export default class ApartmentEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.apartmentId = props.params.id;

    this.state = {
      loading: true,
      originalObject: null,
      location: constants.DEFAULT_COORDINATES,
    }

    this.renderForm = this.renderForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSuccess = async () => {
    this.props.snackbar.enqueueSnackbar('Apartment added', {variant: 'success'});
  }

  handleSubmit = async (event, data) => {
    try {
      await apartmentService.update(this.apartmentId, {
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

  async componentDidMount() {
    try {
      const res = await apartmentService.detail(this.apartmentId);
      const data =  res.data;
      this.setState(state => {
        state.originalObject = data
        if (data.longitude && data.latitude) {
          state.location = {
            lat: data.latitude,
            lng: data.longitude,
          };
        }
        return state;
      });
      this.setState(state => {
        state.loading = false;
        return state;
      });
    } catch (e) {
      this.props.navigate('/404');
    }
  }

  renderForm({loading, errors}, handleSubmit) {
    return (
      <React.Fragment>
        <Grid container columnSpacing={2}>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.name)}
              defaultValue={this.state.originalObject.name}
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
              defaultValue={this.state.originalObject.floor}
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
              defaultValue={this.state.originalObject.area_size}
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
              defaultValue={this.state.originalObject.price_per_month}
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
              defaultValue={this.state.originalObject.number_of_rooms}
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
          <Grid item xs={6}>
            <TextField
              select
              error={hasError(errors?.state)}
              defaultValue={this.state.originalObject.state}
              margin="normal"
              size="small"
              fullWidth
              id="state"
              label="Apartment State"
              name="state"
              helperText={getErrorMessage(errors?.state)}
            >
              <MenuItem value={ApartmentStates.AVAILABLE}>{ApartmentStatesLabels[ApartmentStates.AVAILABLE]}</MenuItem>
              <MenuItem value={ApartmentStates.RENTED}>{ApartmentStatesLabels[ApartmentStates.RENTED]}</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <TextField
          error={hasError(errors?.description)}
          defaultValue={this.state.originalObject.description}
          margin="normal"
          size="small"
          fullWidth
          id="description"
          label="Description"
          placeholder="Description and details about this apartment, this will appear under the detail page."
          name="description"
          multiline
          rows={8}
          helperText={getErrorMessage(errors?.description)}
        />
        <Box>
          <MapField geocodeSearchBox={true} center={this.state.location} onChange={(location) => {
            this.setState(state => ({...state, location}));

          }}/>
          <FormHelperText error={true}>{getErrorMessage(errors?.location)}</FormHelperText>
        </Box>
        <LoadingButton
          loading={loading}
          type="button"
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{mt: 2, mb: 2}}
        >
          Save
        </LoadingButton>
      </React.Fragment>
    );
  }

  render() {
    const {loading, originalObject: object} = this.state;
    if (loading) return (<LoadingPage />);

    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Breadcrumbs items={[routes.dashboard, routes.apartments]} lastLabel={'Edit'} />
          <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between'}}>
            <>
              <Typography component="h1" variant="h5">
                Edit Apartment
              </Typography>
            </>
            <>
              <Button color="success" variant="contained" size="small" onClick={() => {this.props.navigate(`/apartments/${object.id}/view`)}}>
                <EyeIcon />See on website
              </Button>
            </>
          </Box>
          <Card variant="outlined">
            <CardContent sx={{py: 0}}>
              <ReactiveForm enableEnterSubmit={false} onSubmit={this.handleSubmit} onSuccess={this.handleSuccess} render={this.renderForm}/>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{mt: 5}}>
            <CardContent sx={{py: 0}}>
              <ImagesUploader apartmentId={object.id} items={object.images} snackbar={this.props.snackbar} confirm={this.props.confirm}/>
            </CardContent>
          </Card>
        </Container>
      </DefaultLayout>
    )
  }
}
