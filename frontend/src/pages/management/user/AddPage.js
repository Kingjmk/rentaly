import React from 'react';
import {
  Box, TextField, Grid, Typography, Container, FormControl, ToggleButton, ToggleButtonGroup, Card, CardContent, FormHelperText,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Breadcrumbs, DefaultLayout} from 'components/layouts';
import ReactiveForm from 'components/ReactiveForm';
import {UserRoles, UserRolesLabels} from 'utils/common';
import userService from 'services/users';
import {parseErrors} from 'services/api';
import {routes} from 'routes';
import {getErrorMessage, hasError} from 'utils/forms';


export default class UserAddPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      roleValue: UserRoles.CLIENT,
    }

    this.handleSuccess = this.handleSuccess.bind(this)
    this.renderForm = this.renderForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSuccess = async (data) => {
    this.setState(state => {
      state.success = true;
      return state;
    });
    this.props.snackbar.enqueueSnackbar('User added', {variant: 'success'});
    this.props.navigate(`/users/${data.id}/edit`);
  }

  handleSubmit = async (event, data) => {
    try {
      const res = await userService.create({
        role: this.state.roleValue,
        ...data,
      });

      return res.data;
    } catch (e) {
      throw parseErrors(e);
    }
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
            <ToggleButton size="small" value={UserRoles.CLIENT}>{UserRolesLabels.CLIENT}</ToggleButton>
            <ToggleButton size="small" value={UserRoles.REALTOR}>{UserRolesLabels.REALTOR}</ToggleButton>
            <ToggleButton size="small" value={UserRoles.ADMIN}>{UserRolesLabels.ADMIN}</ToggleButton>
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
          Add
        </LoadingButton>
      </React.Fragment>
    );
  }

  render() {
    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Breadcrumbs items={[routes.dashboard, routes.users]} lastLabel={'Add'} />
          <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between'}}>
            <>
              <Typography component="h1" variant="h5">
                Add User
              </Typography>
            </>
            <>
            </>
          </Box>
          <Card variant="outlined">
            <CardContent sx={{py: 0}}>
              <ReactiveForm enableEnterSubmit={false} onSubmit={this.handleSubmit} onSuccess={this.handleSuccess} render={this.renderForm}/>
            </CardContent>
          </Card>
        </Container>
      </DefaultLayout>
    )
  }
}
