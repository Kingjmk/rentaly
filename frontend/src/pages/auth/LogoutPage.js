import React from 'react';
import {connect} from 'react-redux';
import {PlainLayout} from 'components/layouts';
import {logout} from 'store/auth/authenticationSlice';
import {IndexRedirect} from 'routes';

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loading: false};
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});

      await this.props.dispatch(logout({})).unwrap();

      this.setState({
        loading: false,
      });
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    return (
      <PlainLayout>
        {!this.state.loading && <IndexRedirect />}
      </PlainLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default connect(mapStateToProps)(Page);
