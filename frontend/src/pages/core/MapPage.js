import React from 'react'
import {
  TextField, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions, Button, CircularProgress, InputAdornment,
} from '@mui/material';
import {LoadingButton, Masonry} from '@mui/lab';
import {PlainLayout, DefaultAppBar} from 'components/layouts';
import constants from 'utils/constants';
import {MapContainer, TileLayer} from 'react-leaflet';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import apartmentService from 'services/apartments';
import ApartmentPlaceholderImg from 'assets/apartment_placeholder.png';
import {Link as RouterLink} from 'react-router-dom';


const ImageComponent = ({image_url: image}) => (
  <CardMedia
    component="img"
    alt="apartment image"
    height="200"
    image={image || ApartmentPlaceholderImg}
  />
);


const ItemsComponent = ({loading, itemList}) => {
  if (loading) {
    return (
      <Grid
        sx={{height: '100%'}}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress fontSize="large"/>
        <Typography component="h1" variant="h6">Loading...</Typography>
      </Grid>
    );
  }

  if (itemList.length === 0) {
    return (
      <Grid
        sx={{height: '100%'}}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <SentimentDissatisfiedIcon fontSize="large"/>
        <Typography component="h1" variant="h6">No results found</Typography>
      </Grid>
    );
  }

  return (
    <Masonry columns={{md: 1, lg: 2}} spacing={2} defaultHeight={450} sx={{m: 0}}>
      {itemList.map((item, index) => (
        <Card key={index}>
          <ImageComponent image_url={item.image_url}/>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${item.price_per_month}
            </Typography>
          </CardContent>
          <CardActions>
            <Button component={RouterLink} to={`/apartments/${item.id}/view`} label="See on website" size="small">Learn More</Button>
          </CardActions>
        </Card>
      ))}
    </Masonry>
  );
}

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRef: null,
      center: constants.DEFAULT_COORDINATES,
      zoom: 14,
    }
  }

  render() {
    return (
      <Box sx={this.props.sx}>
        <MapContainer center={this.state.center} zoom={this.state.zoom} style={{height: '100%', width: '100%'}}>
          <TileLayer
            attribution={constants.TILE_ATTRIBUTION}
            url={constants.TILE_LAYER_URL}
          />
        </MapContainer>
      </Box>
    );
  }
}


export default class MapPage extends React.Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search);

    this.state = {
      filters: {
        address: urlParams.get('address'),
        area_size: urlParams.get('area_size'),
        price_per_month: urlParams.get('price_per_month'),
        number_of_rooms: urlParams.get('number_of_rooms'),
      },
      loading: false,
      itemList: [],
    }

    this.renderFilterForm = this.renderFilterForm.bind(this);
  }

  setFilterValue(field, value) {
    this.setState(state => {
      state.filters[field] = value
      return state;
    });
  }

  async loadItems() {
    this.setState(state => {
      state.loading = true;
      return state;
    });

    const res = await apartmentService.search({
      query: {
        area_size: this.state.filters.area_size,
        price_per_month: this.state.filters.price_per_month,
        number_of_rooms: this.state.filters.number_of_rooms,
      },
    });

    this.setState(state => {
      state.loading = false;
      state.itemList = res.data.results;
      return state;
    });
  }

  renderFilterForm() {
    return (
      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)'}}>
        <TextField
          defaultValue={this.state.filters.address}
          label="Address"
          size="small"
          sx={{mr: 2}}
          onChange={(event) => this.setFilterValue('address', event.target.value)}
        />
        <TextField
          defaultValue={this.state.filters.area_size}
          label="Size"
          size="small"
          sx={{mr: 2}}
          onChange={(event) => this.setFilterValue('area_size', event.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">m²</InputAdornment>,
          }}
        />
        <TextField
          defaultValue={this.state.filters.price_per_month}
          label="Price per month"
          size="small"
          sx={{mr: 2}}
          onChange={(event) => this.setFilterValue('price_per_month', event.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <TextField
          defaultValue={this.state.filters.number_of_rooms}
          label="Number of rooms"
          size="small"
          sx={{mr: 2}}
          onChange={(event) => this.setFilterValue('number_of_rooms', event.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
          }}
        />
        <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
          <LoadingButton loading={this.state.loading} color="primary" variant='contained' onClick={() => this.loadItems()}>
            <SearchOutlinedIcon/> Search
          </LoadingButton>
        </Box>
      </Box>
    );
  }

  render() {
    return (
      <PlainLayout>
        <DefaultAppBar maxWidth={'none'}/>
        <Box backgroundColor={'white'} sx={{p: 1}}>
          <Typography variant='h6' color='inherit' noWrap sx={{mb: 2}}>
            Apartments in the area
          </Typography>
          <this.renderFilterForm/>
        </Box>
        <Box sx={{display: 'flex', flexGrow: 1, maxHeight: 'calc(100vh - 169px)'}}>
          <MapComponent sx={{flexGrow: 1, width: '100%'}}/>
          <Box sx={{width: '50%', maxHeight: '100%', overflowY: 'auto'}}>
            <ItemsComponent loading={this.state.loading} itemList={this.state.itemList}/>
          </Box>
        </Box>
      </PlainLayout>
    );
  }
}
