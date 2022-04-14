import React from 'react';
import {Container, Card, CardContent, CardMedia, Box, Typography, Divider, Grid, Tab} from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {Breadcrumbs, DefaultLayout} from 'components/layouts';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import LoadingPage from 'pages/LoadingPage';
import apartmentService from 'services/apartments';
import {routes} from 'routes';
import constants from 'utils/constants';
import Carousel from 'react-multi-carousel';
import {ApartmentStates, ApartmentStatesLabels} from 'utils/common';

const ApartmentStatesColor = {
  [ApartmentStates.AVAILABLE]: 'green',
  [ApartmentStates.RENTED]: 'orange',
}

const PageTabs = {
  gallery: 'Gallery',
  map: 'Map',
}

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
      {images.map(image => (
        <CardMedia
          key={image.id}
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

const GeneralSection = ({sx, object: {price_per_month, area_size, floor, number_of_rooms}}) => (
  <Box sx={sx}>
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
  </Box>
);


const DescriptionSection = ({description, sx = {pt: 2}}) => {
  const descriptionArray = description.split(/\r?\n/);

  return (
    <Box sx={sx}>
      {descriptionArray.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </Box>
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
      tab: null,
    }
  }

  async componentDidMount() {
    try {
      const res = await apartmentService.detail(this.apartmentId);
      const data = res.data;

      this.setState(state => {
        state.object = data;
        state.loading = false;
        state.tab = data.images.length === 0 ? PageTabs.map : PageTabs.gallery;
        return state;
      });
    } catch (e) {
      this.props.navigate('/404');
    }
  }

  render() {
    const {loading, object, tab} = this.state;
    if (loading) return (<LoadingPage/>);

    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Breadcrumbs items={[routes.dashboard, routes.map]} lastLabel={`Apartment - ${object.name}`}/>
          <Card>
            <CardContent sx={{pt: 0}}>
              <TabContext value={tab}>
                <Box sx={{borderBottom: 0, borderColor: 'divider', mb: 0.1}}>
                  <TabList onChange={(event, newValue) => this.setState(state => ({...state, tab: newValue}))} aria-label="page tabs">
                    {object.images.length !== 0 &&
                    <Tab label={PageTabs.gallery} value={PageTabs.gallery}/>
                    }
                    <Tab label={PageTabs.map} value={PageTabs.map}/>
                  </TabList>
                </Box>
                {object.images.length !== 0 &&
                <TabPanel value={PageTabs.gallery} sx={{p: 0}}>
                  <ImageGallery images={object.images}/>
                </TabPanel>
                }
                <TabPanel value={PageTabs.map} sx={{p: 0}}>
                  <MapSection object={object}/>
                </TabPanel>
              </TabContext>
              <GeneralSection object={object} sx={{pt: 2}}/>
              <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between', pt: 2}}>
                <Typography variant="h6">{object.name}</Typography>
                <Typography variant="h6" color={ApartmentStatesColor[object.state]}>{ApartmentStatesLabels[object.state]}</Typography>
              </Box>
              <DescriptionSection description={object.description}/>
            </CardContent>
          </Card>
        </Container>
      </DefaultLayout>
    )
  }
}
