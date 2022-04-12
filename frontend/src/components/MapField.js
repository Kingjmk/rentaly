import React, {useState} from 'react'
import {Box} from '@mui/material';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import constants from 'utils/constants';
import {FmdGoodOutlined as PinIcon, PushPinOutlined as PushPinIcon} from '@mui/icons-material';
import geocodeService from 'services/geocode';


const DraggableMarker = React.forwardRef(({initialPosition, onChange}, ref) => {
  const [position, setPosition] = useState(initialPosition)
  const eventHandlers = React.useMemo(() => ({
    dragend() {
      const marker = ref.current;
      if (marker != null) {
        setPosition(marker.getLatLng())
        onChange(marker.getLatLng());
      }
    },
  }), []);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={ref}>
      <Popup minWidth={90}>
        {'Move marker to the apartment location'}
      </Popup>
    </Marker>
  )
});

const TopRightControl = ({onSetMarker, onFlyTo, onSearch}) => (
  <div className="leaflet-top leaflet-right">
    <div className="leaflet-control leaflet-bar">
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        <input
          style={{backgroundColor: 'white', height: '30px',fontSize: '120%', border: 0, width: '300px', borderRight: '2px solid rgba(0,0,0,0.2)'}}
          placeholder="Search City, Neighbourhood or Address"
          size="small"
          onKeyPress={event => {
            if (event.key === 'Enter') onSearch(event.target.value);
          }}
        />
        <a onClick={onSetMarker} className="" href="#" title="Set Pin to center" role="button" aria-label="Set Pin to center" style={{paddingTop: '4px', borderRight: '2px solid rgba(0,0,0,0.2)', borderBottom: 'none'}}>
          <PushPinIcon fontSize="small"/>
        </a>
        <a onClick={onFlyTo} className="" href="#" title="Go to Pin" role="button" aria-label="Go to Pin" style={{paddingTop: '4px'}}>
          <PinIcon fontSize="small"/>
        </a>
      </Box>
    </div>
  </div>
);

export default class MapField extends React.Component {
  constructor(props) {
    super(props);

    const center = props.center || constants.DEFAULT_COORDINATES;
    this.state = {
      pinPosition: center,
      center: center,
      zoom: props.zoom || 14,
    }

    this.mapRef = React.createRef();
    this.markerRef = React.createRef();

    this.handleControlFlyTo = this.handleControlFlyTo.bind(this);
    this.handleControlSetMarker = this.handleControlSetMarker.bind(this);
    this.handleControlSearch = this.handleControlSearch.bind(this);
    this.handlePinPositionChange = this.handlePinPositionChange.bind(this);
  }

  handleControlFlyTo() {
    this.mapRef.current._map.setView(this.state.pinPosition, 14);
  }

  handleControlSetMarker() {
    const position = this.mapRef.current._map.getCenter();
    this.markerRef.current.setLatLng(position);
    this.handlePinPositionChange(position);
  }

  async handleControlSearch(query) {
    const newPosition = await geocodeService.locate(query);
    this.mapRef.current._map.setView(newPosition, 14);
  }

  handlePinPositionChange(position) {
    this.setState(state => {
      state.pinPosition = position;
      return state;
    });
    this.props.onChange(position);
  }

  render() {
    return (
      <Box sx={this.props.sx}>
        <MapContainer center={this.state.center} zoom={this.state.zoom} style={{height: '50vh', width: '100%'}}>
          <TileLayer
            attribution={`&copy; ${constants.WEBSITE_NAME}`}
            url={constants.TILE_LAYER_URL}
            ref={this.mapRef}
            on
          />
          <TopRightControl onSetMarker={this.handleControlSetMarker} onFlyTo={this.handleControlFlyTo} onSearch={this.handleControlSearch}/>
          <DraggableMarker
            initialPosition={this.state.center} onChange={this.handlePinPositionChange} ref={this.markerRef}
          />
        </MapContainer>
      </Box>
    );
  }
}
