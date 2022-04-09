import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar, Button, TextField, Link, Grid, Box, Typography, Container, FormControl, ToggleButton, ToggleButtonGroup,
  FormHelperText,
} from '@mui/material';
import {connect} from 'react-redux';
import {Link as RouterLink, Navigate} from 'react-router-dom';
import {PlainLayout} from 'components/layouts';
import {getErrorMessage, hasError, ErrorAlert, SuccessAlert} from 'utils/forms';
import {register} from 'store/auth/authenticationSlice';
import {UserRoles} from 'utils/common';

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roleValue: UserRoles.CLIENT,
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

      await this.props.dispatch(register({
        email: data.get('email'),
        first_name: data.get('first_name'),
        last_name: data.get('last_name'),
        new_password: data.get('new_password'),
        new_password_confirm: data.get('new_password_confirm'),
        role: this.state.roleValue,
      })).unwrap();
      setTimeout(() => {
        this.setState({
          loading: false,
          success: true,
          errors: [],
        });
      }, 1000);
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
        {this.state.success && <Navigate to={'/login'}/>}
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
              Sign up
            </Typography>
            <Box component="form" onSubmit={this.handleSubmit} noValidate sx={{mt: 1}}>
              <ErrorAlert error={this.state.errors?.non_field_errors}/>
              <SuccessAlert isSuccessful={this.state.success} message={'Registration Successful, Please login now...'}/>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    error={hasError(this.state.errors?.first_name)}
                    margin="normal"
                    autoComplete="given-name"
                    name="first_name"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    autoFocus
                    helperText={getErrorMessage(this.state.errors?.first_name)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    error={hasError(this.state.errors?.last_name)}
                    margin="normal"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                    helperText={getErrorMessage(this.state.errors?.last_name)}
                  />
                </Grid>
              </Grid>
              <TextField
                error={hasError(this.state.errors?.email)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                helperText={getErrorMessage(this.state.errors?.email)}
              />

              <TextField
                error={hasError(this.state.errors?.new_password)}
                margin="normal"
                required
                fullWidth
                name="new_password"
                label="New Password"
                type="password"
                id="new_password"
                autoComplete="new-password"
                helperText={getErrorMessage(this.state.errors?.new_password)}
              />

              <TextField
                error={hasError(this.state.errors?.new_password_confirm)}
                margin="normal"
                required
                fullWidth
                name="new_password_confirm"
                label="New Password Confirm"
                type="password"
                id="new_password_confirm"
                autoComplete="new-password"
                helperText={getErrorMessage(this.state.errors?.new_password_confirm)}
              />
              <FormControl fullWidth sx={{mt: 2}} state={'error'}>
                <ToggleButtonGroup
                  color={hasError(this.state.errors?.role) ? 'error' : 'primary'}
                  value={this.state.roleValue}
                  exclusive
                  fullWidth
                  onChange={(event, newValue) => this.setState(state => state.roleValue = newValue)}
                >
                  <ToggleButton value={UserRoles.CLIENT}>Client</ToggleButton>
                  <ToggleButton value={UserRoles.REALTOR}>Realtor</ToggleButton>
                </ToggleButtonGroup>
                <FormHelperText error={true}>{getErrorMessage(this.state.errors?.role)}</FormHelperText>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}
                disabled={this.state.loading || this.state.success}
              >
                Sign up
              </Button>
              <Grid container>
                <Grid item>
                  <Link component={RouterLink} to={'/login'} variant="body2">
                    {'Already have an account? Sign in'}
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
