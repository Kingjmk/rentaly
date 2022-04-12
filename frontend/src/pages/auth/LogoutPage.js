import React from 'react';
import {connect} from 'react-redux';
import {logout} from 'store/auth/authenticationSlice';
import LoadingPage from 'pages/LoadingPage';


class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: false};
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});

      await this.props.dispatch(logout({})).unwrap();
      this.props.navigate('/dashboard');
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
      <LoadingPage/>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default connect(mapStateToProps)(Page);
