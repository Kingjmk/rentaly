import React from 'react'
import {
  TextField, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions, Button, IconButton, InputAdornment,
  Dialog, DialogContent, DialogTitle, Divider,
} from '@mui/material';
import {LoadingButton, Masonry} from '@mui/lab';
import {MapContainer, TileLayer, useMapEvents, Marker} from 'react-leaflet';
import {PlainLayout, DefaultAppBar} from 'components/layouts';
import {
  SearchOutlined as SearchOutlinedIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  FmdGoodOutlined as PinIcon,
} from '@mui/icons-material';
import SearchableAddressField from 'components/SearchableAddressField';
import * as MapMarkerIcons from 'components/MapMarkerIcons';
import constants from 'utils/constants';
import {ApartmentStates} from 'utils/common';
import apartmentService from 'services/apartments';
import ApartmentPlaceholderImg from 'assets/apartment_placeholder.png';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';

const apartmentIconByState = {
  [ApartmentStates.AVAILABLE]: MapMarkerIcons.successIcon,
  [ApartmentStates.RENTED]: MapMarkerIcons.warningIcon,
}

const validateNumber = (value) => {
  value = Number.parseFloat(value);
  return !Number.isNaN(value) ? value : null;
}

const validateInteger = (value) => {
  value = Number.parseInt(value);
  return !Number.isNaN(value) ? value : null;
}

const validateSearchParams = (url) => {
  const searchParams = new URLSearchParams(url)

  const lng = validateNumber(searchParams.get('lng'));
  const lat = validateNumber(searchParams.get('lat'));

  return {
    area_size: validateInteger(searchParams.get('area_size')),
    price_per_month: validateInteger(searchParams.get('price_per_month')),
    number_of_rooms: validateInteger(searchParams.get('number_of_rooms')),
    address: searchParams.get('address'),
    lng: lng ? lng : constants.DEFAULT_COORDINATES.lng,
    lat: lat ? lat : constants.DEFAULT_COORDINATES.lat,
  }
}

const ImageComponent = ({sx, image_url: image}) => (
  <CardMedia
    component="img"
    alt="apartment image"
    sx={sx}
    image={image || ApartmentPlaceholderImg}
  />
);


const ItemsComponent = ({itemList, onHighlightItem}) => {
  if (itemList.length === 0) {
    return (
      <Grid
        sx={{height: '100%', p: 5}}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <SentimentDissatisfiedIcon fontSize="large"/>
        <Typography component="h1" variant="h6">No apartments found in the area, try to move the map or </Typography>
      </Grid>
    );
  }

  return (
    <Masonry columns={1} spacing={2} sx={{m: 0}}>
      {itemList.map(item => (
        <Card key={item.id} sx={{display: 'flex'}}>
          <ImageComponent sx={{height: 'auto', width: '40%'}} image_url={item.image_url}/>
          <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <CardContent sx={{flex: '1 0 auto'}}>
              <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <Typography component="div" variant="h6">
                  {item.name}
                </Typography>
                <IconButton onClick={(event) => onHighlightItem(event, item)} aria-label="see on map">
                  <PinIcon />
                </IconButton>
              </Box>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                ${item.price_per_month}
              </Typography>
            </CardContent>
            <CardActions>
              <Button fullWidth component={RouterLink} to={`/apartments/${item.id}/view`} variant="contained">Learn More</Button>
            </CardActions>
          </Box>
        </Card>
      ))}
    </Masonry>
  );
}

const ItemDialog = ({onClose, item}) => (
  <Dialog
    open={item !== null}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    maxWidth="md"
    fullWidth
  >
    <DialogTitle id="alert-dialog-title">Apartment {item?.name}</DialogTitle>
    <DialogContent  id="alert-dialog-description">
      <ImageComponent sx={{height: 'auto', width: '100%', maxHeight: '500px', pb: 2}} image_url={item?.image_url}/>
      {item &&
        <Box>
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
                {~~item.price_per_month}$
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem/>
            <Grid item xs>
              <Typography variant="h6" color="text.secondary">
                Square Meter
              </Typography>
              <Typography variant="h6">
                {item.area_size} m²
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{pt: 2, display: 'flex', justifyContent: 'end'}}>
            <Button onClick={onClose}>Close</Button>
            <Button component={RouterLink} to={`/apartments/${item.id}/view`} variant="contained">Learn More</Button>
          </Box>
        </Box>
      }
    </DialogContent>
  </Dialog>
);

const FormComponent = ({initialPlace, loading, filters, setFilterValue, onLocationSelect, onSearch}) => (
  <Grid container spacing={2}>
    <Grid item xs={8} md={4}>
      <SearchableAddressField
        defaultValue={initialPlace}
        onLocationSelect={onLocationSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            size='small'
            style={{backgroundColor: 'white'}}
            label='Address'
            placeholder="Search City, Neighbourhood or Address"
            variant="outlined"
          />
        )}
      />
    </Grid>
    <Grid item xs={4} md={2}>
      <TextField
        fullWidth
        defaultValue={filters.area_size}
        label="Size"
        size="small"
        onChange={(event) => setFilterValue('area_size', event.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">m²</InputAdornment>,
        }}
      />
    </Grid>
    <Grid item xs={4} md={2}>
      <TextField
        fullWidth
        defaultValue={filters.price_per_month}
        label="Price per month"
        size="small"
        sx={{mr: 2}}
        onChange={(event) => setFilterValue('price_per_month', event.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
    </Grid>
    <Grid item xs={4} md={2}>
      <TextField
        fullWidth
        defaultValue={filters.number_of_rooms}
        label="Number of rooms"
        size="small"
        sx={{mr: 2}}
        onChange={(event) => setFilterValue('number_of_rooms', event.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">#</InputAdornment>,
        }}
      />
    </Grid>
    <Grid item xs={4} md={2} sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
      <LoadingButton loading={loading} color="primary" variant='contained' onClick={onSearch}>
        <SearchOutlinedIcon/> Search
      </LoadingButton>
    </Grid>
  </Grid>
);

const MapEventInjectorComponent = ({onMoveEnd}) => {
  const map = useMapEvents({
    moveend: () => onMoveEnd(map),
  });
  return null;
}

class MapComponent extends React.Component {
  static propTypes = {
    defaultPosition: PropTypes.object.isRequired,
    itemList: PropTypes.array,
    onChange: PropTypes.func,
    onMarkerClick: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      map: null,
      center: this.props.defaultPosition,
      zoom: 14,
    }
  }

  handleMoveEnd(map) {
    this.props.onChange(map.getCenter(), map.getBounds());
  }

  handleReady(event) {
    const map = event.target;
    this.setState(state => ({...state, map: map}));
    this.props.onChange(map.getCenter(), map.getBounds());
  }

  getMap() {
    return this.state.map;
  }

  render() {
    return (
      <MapContainer
        whenReady={this.handleReady.bind(this)}
        center={this.state.center}
        zoom={this.state.zoom}
        minZoom={10}
        style={{height: '100%', width: '100%'}}
      >
        <TileLayer
          attribution={constants.TILE_ATTRIBUTION}
          url={constants.TILE_LAYER_URL}
        />
        <MapEventInjectorComponent onMoveEnd={this.handleMoveEnd.bind(this)}/>
        {this.props.itemList.map(item => (
          <Marker
            key={item.id}
            position={item.location}
            eventHandlers={{ click: (event) => this.props.onMarkerClick(event, item)}}
            icon={apartmentIconByState[item.state]}
          />
        ))}
      </MapContainer>
    );
  }
}

export default class MapPage extends React.Component {
  constructor(props) {
    super(props);
    const urlParams = validateSearchParams(this.props.location.search);

    const location = {
      lat: urlParams.lat,
      lng: urlParams.lng,
    }

    this.initialPlace = !(location && urlParams.address) ? null : {
      display_name: urlParams.address,
      ...location,
    }

    this.initialPosition = this.initialPlace ? location : constants.DEFAULT_COORDINATES;

    this.state = {
      filters: {
        area_size: urlParams.area_size,
        price_per_month: urlParams.price_per_month,
        number_of_rooms: urlParams.number_of_rooms,
        min_lat: null,
        max_lat: null,
        min_lng: null,
        max_lng: null,
      },
      lng: location?.lat,
      lat: location?.lat,
      address: urlParams.address,
      loading: true,
      itemList: [],
      dialogItem: null,
    }
    this.mapComponentRef = React.createRef();
    this.updateSearchParams = this.updateSearchParams.bind(this);
  }

  updateSearchParams() {
    const params = {
      area_size: this.state.filters.area_size || '',
      price_per_month: this.state.filters.price_per_month  || '',
      number_of_rooms: this.state.filters.number_of_rooms  || '',
      address: this.state.address  || '',
      lat: this.state.lat || '',
      lng: this.state.lng || '',
    }

    const url = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(params)) {
      url.set(key, value);
    }

    this.props.navigate({
      pathname: this.props.location.pathname,
      search: url.toString(),
      replace: true,
    })
  }

  async setFilterValue(field, value) {
    await this.setState(state => {
      state.filters[field] = value;
      return state;
    });
    this.updateSearchParams();
  }

  getMap() {
    return this.mapComponentRef.current.getMap();
  }

  handleLocationSelect(event, newValue) {
    if (!newValue) return;
    const position = {lat: newValue.lat, lng: newValue.lng};
    this.getMap().setView(position, 14);
    this.setState(state => ({
      ...state,
      address: newValue.display_name,
    }));
    this.handleMapChange(this.getMap().getCenter(), this.getMap().getBounds());
  }

  handleHighlightItem(event, apartment) {
    this.getMap().setView(apartment.location, 16);
    this.handleMapChange(this.getMap().getCenter(), this.getMap().getBounds());
  }

  handleMarkerClick(event, apartment) {
    this.setState(state => ({...state, dialogItem: apartment}))
  }

  async handleMapChange(newCenter, newBounds) {
    this.setFilterValue('max_lat', newBounds._northEast.lat);
    this.setFilterValue('max_lng', newBounds._northEast.lng);
    this.setFilterValue('min_lat', newBounds._southWest.lat);
    this.setFilterValue('min_lng', newBounds._southWest.lng);

    await this.setState(state => ({
      ...state,
      lat: newCenter.lat,
      lng: newCenter.lng,
    }));
    this.updateSearchParams();
    await this.loadItems();
  }

  async loadItems() {
    await this.setState(state => ({...state, loading: true}));

    const res = await apartmentService.search({
      query: {...this.state.filters},
    });

    const items = res.data.results.map(item => ({
      ...item,
      location: {
        lat: item.latitude,
        lng: item.longitude,
      },
    }));

    await this.setState(state => ({
      ...state,
      loading: false,
      itemList: items,
    }));
  }

  render() {
    return (
      <PlainLayout>
        <DefaultAppBar maxWidth={'none'}/>
        <Box backgroundColor={'white'} sx={{p: 1}}>
          <Typography variant='h6' color='inherit' noWrap sx={{mb: 2}}>Search for Apartments</Typography>
          <FormComponent
            onLocationSelect={this.handleLocationSelect.bind(this)}
            onSearch={async () => await this.loadItems()}
            setFilterValue={this.setFilterValue.bind(this)}
            filters={this.state.filters}
            initialPlace={this.initialPlace}
            loading={this.state.loading}
          />
        </Box>
        <Box sx={{display: 'flex', flexGrow: 1, maxHeight: 'calc(100vh - 169px)'}}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6} md={6} lg={8} xl={9} sx={{maxHeight: '100%'}}>
              <MapComponent
                ref={this.mapComponentRef}
                defaultPosition={this.initialPosition}
                itemList={this.state.itemList}
                onChange={this.handleMapChange.bind(this)}
                onMarkerClick={this.handleMarkerClick.bind(this)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} sx={{maxHeight: '100%', overflowY: 'auto', display: { xs: 'none', sm: 'flex' }}}>
              <ItemsComponent itemList={this.state.itemList} onHighlightItem={this.handleHighlightItem.bind(this)}/>
            </Grid>
          </Grid>
        </Box>
        <ItemDialog item={this.state.dialogItem} onClose={() => this.setState(state => ({...state, dialogItem: null}))} />
      </PlainLayout>
    );
  }
}
