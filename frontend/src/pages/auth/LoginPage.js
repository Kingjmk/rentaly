import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar, Button, TextField, Link, Grid, Box, Typography, Container,
} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {IndexRedirect} from 'routes';
import {PlainLayout} from 'components/layouts';
import {getErrorMessage, hasError, ErrorAlert, SuccessAlert} from 'utils/forms';
import {login} from 'store/auth/authenticationSlice';

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      success: false,
      errors: [],
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      this.setState({
        loading: true,
        success: false,
        errors: [],
      });

      await this.props.dispatch(login({
        email: data.get('email'),
        password: data.get('password'),
      })).unwrap();

      this.setState({
        loading: false,
        success: true,
        errors: [],
      });
    } catch (e) {
      if (e.apiErrors) {
        this.setState({
          loading: false,
          success: false,
          errors: e.apiErrors,
        });
      } else {
        this.setState({
          loading: false,
          success: false,
          errors: {non_field_errors: ['Unknown error']},
        });
      }
    }
  };

  render() {
    return (
      <PlainLayout hasFooter={true}>
        {this.state.success && <IndexRedirect />}
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{mt: 1}}>
              <ErrorAlert error={this.state.errors?.non_field_errors}/>
              <SuccessAlert isSuccessful={this.state.success} message={'Login Successful, Redirecting...'}/>
              <TextField
                error={hasError(this.state.errors?.email)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                helperText={getErrorMessage(this.state.errors?.email)}
              />
              <TextField
                error={hasError(this.state.errors?.password)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={getErrorMessage(this.state.errors?.password)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                disabled={this.state.loading || this.state.success}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link component={RouterLink} to={'/register'} variant="body2">
                    {'Don\'t have an account? Sign Up'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </PlainLayout>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default connect(mapStateToProps)(Page);
