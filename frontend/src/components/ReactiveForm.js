import React from 'react';
import {Box} from '@mui/material';
import {ErrorAlert} from 'utils/forms';
import PropTypes from 'prop-types'

/**
 * Standard React Form with support for api action validation/errors
 */
export default class ReactiveForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func,
    render: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onSubmit: async () => {},
    onSuccess: async () => {},
    onFailure: async () => {},
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.props.onSubmit;
    this.onSuccess = this.props.onSuccess;
    this.onFailure = this.props.onFailure;

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      loading: false,
      errors: [],
    }
  }

  getFormData(event) {
    return Array.prototype.slice.call(event.target)
      .filter(el => el.name)
      .reduce((form, el) => ({
        ...form,
        [el.name]: el.value,
      }), {});
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      this.setState({
        loading: true,
        errors: [],
      });

      let result = await this.onSubmit(event, this.getFormData(event));

      this.setState({
        loading: false,
        errors: [],
      });

      return await this.onSuccess(result);
    } catch (e) {
      if (e.apiErrors) {
        this.setState({
          loading: false,
          errors: e.apiErrors,
        });
      } else {
        this.setState({
          loading: false,
          errors: {non_field_errors: ['Unknown error']},
        });
      }
      return await this.onFailure(e);
    }
  }

  render() {
    return (
      <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{mt: 1}}>
        <ErrorAlert error={this.state.errors?.non_field_errors}/>
        {this.props.render(this.state)}
      </Box>
    )
  }
}
