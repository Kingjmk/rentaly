import React from 'react';
import {Container, Card, CardContent, CardMedia, Box, Typography, Divider, Grid} from '@mui/material';
import {Breadcrumbs, DefaultLayout} from 'components/layouts';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import LoadingPage from 'pages/LoadingPage';
import apartmentService from 'services/apartments';
import {routes} from 'routes';
import constants from 'utils/constants';
import Carousel from 'react-multi-carousel';

const ImageGallery = ({images}) => {
  const responsive = {
    desktop: {
      breakpoint: {max: 3000, min: 1024},
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: {max: 1024, min: 464},
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: {max: 464, min: 0},
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <Carousel
      itemClass="gallery-image-item"
      responsive={responsive}
    >
      {images.map((image, i) => (
        <CardMedia
          key={i}
          component="img"
          alt="apartment image"
          width="100%"
          height="100%"
          image={image.url}
        />
      ))}
    </Carousel>
  );
}
const GeneralSection = ({object: {description, price_per_month, area_size, floor, number_of_rooms}}) => {
  const descriptionArray = description.split(/\r?\n/);

  return (
    <React.Fragment>
      <Grid container sx={{
        width: '100%',
        textAlign: 'center',
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        padding: '24px',
      }}>
        <Grid item xs>
          <Typography variant="h6" color="text.secondary">
            Monthly rent (USD)
          </Typography>
          <Typography variant="h6">
            {~~price_per_month}$
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem/>
        <Grid item xs>
          <Typography variant="h6" color="text.secondary">
            Square Meter
          </Typography>
          <Typography variant="h6">
            {area_size} m²
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem/>
        <Grid item xs>
          <Typography variant="h6" color="text.secondary">
            Floor
          </Typography>
          <Typography variant="h6">
            #{floor}
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem/>
        <Grid item xs>
          <Typography variant="h6" color="text.secondary">
            Rooms
          </Typography>
          <Typography variant="h6">
            {number_of_rooms}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{pt: 2}}>
        <Typography variant="h6">Description</Typography>
        {descriptionArray.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </Box>
    </React.Fragment>
  )
}

const MapSection = ({object}) => {
  const location = {
    lat: object?.latitude || constants.DEFAULT_COORDINATES.lat,
    lng: object?.longitude || constants.DEFAULT_COORDINATES.lng,
  }

  return (
    <MapContainer center={location} zoom={14} style={{height: '50vh', width: '100%'}}>
      <TileLayer
        attribution={constants.TILE_ATTRIBUTION}
        url={constants.TILE_LAYER_URL}
        on
      />
      <Marker position={location}>
        <Popup minWidth={90}>{'Apartment Location'}</Popup>
      </Marker>
    </MapContainer>
  );
}
export default class ApartmentDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.apartmentId = props.params.id;

    this.state = {
      loading: true,
      object: null,
    }
  }

  async componentDidMount() {
    try {
      const res = await apartmentService.detail(this.apartmentId);
      const data = res.data;

      this.setState(state => {
        state.object = data;
        state.loading = false;
        return state;
      });
    } catch (e) {
      this.props.navigate('/404');
    }
  }

  render() {
    const {loading, object} = this.state;
    if (loading) return (<LoadingPage/>);

    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Breadcrumbs items={[routes.dashboard, routes.map]} lastLabel={`Apartment - ${object.name}`}/>
          <Card>
            <CardContent>
              {object.images.length !== 0 &&
              <Box sx={{width: '100%', pb: 2}}>
                <ImageGallery images={object.images} />
              </Box>
              }
              <GeneralSection object={object}/>
              <Box sx={{width: '100%', mt: 2}}>
                <MapSection object={object}/>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </DefaultLayout>
    )
  }
}
