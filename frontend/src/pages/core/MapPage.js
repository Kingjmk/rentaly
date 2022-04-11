import React from 'react'
import {TextField, Typography, Box, Grid, Card, CardMedia, CardContent, CardActions, Button} from '@mui/material';
import {LoadingButton, Masonry} from '@mui/lab';
import {DefaultLayout} from 'components/layouts';
import constants from 'utils/constants';
import {GoogleMap, LoadScript} from '@react-google-maps/api';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';


const ItemsComponent = ({itemList}) => {
  if (itemList.length === 0) {
    return (
      <Grid
        sx={{height: '100%'}}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <SentimentDissatisfiedIcon fontSize="large" />
        <Typography component="h1" variant="h6">No results found</Typography>
      </Grid>
    );
  }

  return (
    <Masonry columns={2} spacing={2} defaultHeight={450} sx={{m: 0}}>
      {itemList.map((item) => (
        <Card>
          <CardMedia
            component="img"
            alt="apartment house"
            height="140"
            image={`${item.img}?w=248&fit=crop&auto=format`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.author}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
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
      // Important! Always set the container height explicitly
      <Box sx={this.props.sx}>
        <LoadScript
          id="script-loader"
        >
          <GoogleMap
            mapContainerStyle={{width: '100%', height: '100%'}}
            center={this.state.center}
            zoom={this.state.zoom}
          >
          </GoogleMap>
        </LoadScript>
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
      itemList: [],
    }

    this.renderFilterForm = this.renderFilterForm.bind(this);
  }

  setFilterValue(field, value) {
    this.setState(state => {
      state.filters[field] = value
    });
  }

  loadItems() {}

  renderFilterForm() {
    return (
      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)'}}>
        <TextField
          defaultValue={this.state.filters.address}
          label="Address"
          size="small"
          sx={{mr: 2}}
          onChange={(event, newValue) => this.setFilterValue('address', newValue)}
        />
        <TextField
          defaultValue={this.state.filters.area_size}
          label="Size"
          size="small"
          sx={{mr: 2}}
          onChange={(event, newValue) => this.setFilterValue('area_size', newValue)}
        />
        <TextField
          defaultValue={this.state.filters.price_per_month}
          label="Price per month"
          size="small"
          sx={{mr: 2}}
          onChange={(event, newValue) => this.setFilterValue('price_per_month', newValue)}
        />
        <TextField
          defaultValue={this.state.filters.number_of_rooms}
          label="Number of rooms"
          size="small"
          sx={{mr: 2}}
          onChange={(event, newValue) => this.setFilterValue('number_of_rooms', newValue)}
        />
        <Box sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
          <LoadingButton color="primary" variant='contained'>
            <SearchOutlinedIcon/> Search
          </LoadingButton>
        </Box>
      </Box>
    );
  }

  render() {
    return (
      <DefaultLayout hasFooter={false}>
        <Box backgroundColor={'white'} sx={{p: 1}}>
          <Typography variant='h6' color='inherit' noWrap style={{my: 3}}>
            Apartments in the area
          </Typography>
          <this.renderFilterForm/>
        </Box>
        <Box sx={{display: 'flex', flexGrow: 1, maxHeight: 'calc(100vh - 153px)'}}>
          <MapComponent sx={{flexGrow: 1, width: '100%'}}/>
          <Box sx={{width: '50%', maxHeight: '100%', overflowY: 'auto'}}>
            <ItemsComponent itemList={this.state.itemList}/>
          </Box>
        </Box>
      </DefaultLayout>
    );
  }
}
