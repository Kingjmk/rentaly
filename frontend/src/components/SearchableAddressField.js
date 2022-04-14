import React from 'react';
import {TextField, Autocomplete} from '@mui/material';
import geocodeService from 'services/geocode';
import PropTypes from 'prop-types';
import _ from 'lodash';


export default class SearchableAddressField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    onLocationSelect: PropTypes.func.isRequired,
    renderInput: PropTypes.func.isRequired,
    renderNoOptionsText: PropTypes.func,
  }

  static defaultProps = {
    id: 'address-search',
    disabled: false,
    renderInput: (params) => (
      <TextField
        {...params}
        fullWidth
        style={{backgroundColor: 'white'}}
        placeholder="Search City, Neighbourhood or Address"
        variant="outlined"
      />
    ),
    renderNoOptionsText: () => (<>No Places found</>),
  }

  constructor(props) {
    super(props);
    const defaultOptions = [];
    if (props.defaultValue) defaultOptions.push(props.defaultValue);

    this.state = {
      place: this.props.defaultValue || null,
      address: null,
      options: defaultOptions,
      loading: false,
    };
    this.loadOptions = _.throttle(this.loadOptions.bind(this), 1000, {leading: false});
  }

  loadOptions = async (address) => {
    this.setState(state => ({...state, loading: true}));
    const places = await geocodeService.search(address);
    this.setState(state => ({...state, loading: false, options: places}));
  }

  onLocationSelect(event, newValue) {
    this.setState(state => ({...state, place: newValue}));
    this.props.onLocationSelect(event, newValue);
  }

  inputOnChange(event, newValue) {
    this.setState(state => ({...state, address: newValue}));
    if (newValue.length > 3) {
      this.loadOptions(newValue);
    }
  }

  renderNoOptions = () => (<this.props.renderNoOptionsText />);

  render() {
    const {place, options, loading} = this.state;

    return (
      <Autocomplete
        id={this.props.id}
        defaultValue={place}
        disabled={this.props.disabled}
        renderInput={this.props.renderInput}
        fullWidth
        disablePortal
        autoComplete
        includeInputInList
        filterSelectedOptions
        options={options}
        value={place}
        loading={loading}
        filterOptions={(x) => x}
        onChange={this.onLocationSelect.bind(this)}
        noOptionsText={(<this.renderNoOptions />)}
        onInputChange={this.inputOnChange.bind(this)}
        getOptionLabel={(option) => option.display_name}
        isOptionEqualToValue={(option, value) => option.display_name === value.display_name}
      />
    )
  }
}
