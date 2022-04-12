import React from 'react';
import {
  TextField, Link, Grid, Typography, Container, Card, CardContent,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Link as RouterLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {PlainLayout} from 'components/layouts';
import ReactiveForm from 'components/ReactiveForm';
import {getErrorMessage, hasError} from 'utils/forms';
import {login} from 'store/auth/authenticationSlice';


class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
    }

    this.renderForm = this.renderForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSuccess = async () => {
    this.setState(state => state.success = true);
    this.props.snackbar.enqueueSnackbar('Login Successful, Redirecting...', {variant: 'success'});

    setTimeout(() => {
      // wait before redirecting to login to leave time for the user to read the message
      this.props.navigate('/dashboard');
    }, 1000);
  }

  handleSubmit = async (event, data) => {
    // Submit form
    const submitData = {
      ...data,
    }

    return await this.props.dispatch(login(submitData)).unwrap();
  };

  renderForm({loading, errors}, handleSubmit) {
    return (
      <React.Fragment>
        <TextField
          error={hasError(errors?.email)}
          margin="normal"
          size="small"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          helperText={getErrorMessage(errors?.email)}
        />
        <TextField
          error={hasError(errors?.password)}
          margin="normal"
          size="small"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          helperText={getErrorMessage(errors?.password)}
        />
        <LoadingButton
          loading={loading || this.state.success}
          type="button"
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{mt: 2, mb: 2}}
        >
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link component={RouterLink} to={'/register'} variant="body2">
              {'Don\'t have an account? Sign Up'}
            </Link>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  render() {
    return (
      <PlainLayout hasFooter={true}>
        <Container component="main" maxWidth="xs" sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Card variant="outlined">
            <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <ReactiveForm onSubmit={this.handleSubmit} onSuccess={this.handleSuccess} render={this.renderForm}/>
            </CardContent>
          </Card>
        </Container>
      </PlainLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default connect(mapStateToProps)(Page);
