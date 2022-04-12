import React from 'react';
import {
  TextField, Link, Grid, Typography, Container, FormControl, ToggleButton, ToggleButtonGroup, Card, CardContent,
  FormHelperText,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';
import {PlainLayout} from 'components/layouts';
import ReactiveForm from 'components/ReactiveForm';
import {getErrorMessage, hasError} from 'utils/forms';
import {register} from 'store/auth/authenticationSlice';
import {UserRoles} from 'utils/common';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleValue: UserRoles.CLIENT,
    }

    this.renderForm = this.renderForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSuccess = async () => {
    this.setState(state => state.success = true);
    this.props.snackbar.enqueueSnackbar('Registration successful, redirecting to login now...', {variant: 'success'});
    setTimeout(() => {
      // wait before redirecting to login to leave time for the user to read the message
      this.props.navigate('/login');
    }, 1000);
  }

  handleSubmit = async (event, data) => {
    // Submit form
    const submitData = {
      role: this.state.roleValue,
      ...data,
    }

    return await this.props.dispatch(register(submitData)).unwrap();
  };

  renderForm({loading, errors}, handleSubmit) {
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.first_name)}
              margin="normal"
              size="small"
              autoComplete="given-name"
              name="first_name"
              required
              fullWidth
              id="first_name"
              label="First Name"
              autoFocus
              helperText={getErrorMessage(errors?.first_name)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.last_name)}
              margin="normal"
              size="small"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              autoComplete="family-name"
              helperText={getErrorMessage(errors?.last_name)}
            />
          </Grid>
        </Grid>
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
          helperText={getErrorMessage(errors?.email)}
        />

        <TextField
          error={hasError(errors?.new_password)}
          margin="normal"
          size="small"
          required
          fullWidth
          name="new_password"
          label="New Password"
          type="password"
          id="new_password"
          autoComplete="new-password"
          helperText={getErrorMessage(errors?.new_password)}
        />

        <TextField
          error={hasError(errors?.new_password_confirm)}
          margin="normal"
          size="small"
          required
          fullWidth
          name="new_password_confirm"
          label="New Password Confirm"
          type="password"
          id="new_password_confirm"
          autoComplete="new-password"
          helperText={getErrorMessage(errors?.new_password_confirm)}
        />
        <FormControl fullWidth sx={{mt: 2}} state={'error'}>
          <ToggleButtonGroup
            color={hasError(errors?.role) ? 'error' : 'primary'}
            value={this.state.roleValue}
            exclusive
            fullWidth
            onChange={(event, newValue) => this.setState(state => state.roleValue = newValue)}
          >
            <ToggleButton size="small" value={UserRoles.CLIENT}>Client</ToggleButton>
            <ToggleButton size="small" value={UserRoles.REALTOR}>Realtor</ToggleButton>
          </ToggleButtonGroup>
          <FormHelperText error={true}>{getErrorMessage(errors?.role)}</FormHelperText>
        </FormControl>
        <LoadingButton
          loading={loading || this.state.success}
          type="button"
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{mt: 2, mb: 2}}
        >
          Sign up
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link component={RouterLink} to={'/login'} variant="body2">
              {'Already have an account? Sign in'}
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
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Card variant="outlined">
            <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Typography component="h1" variant="h5">
                Sign up
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
