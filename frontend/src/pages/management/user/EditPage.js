import React from 'react';
import {
  Box, TextField, Grid, Typography, Container, FormControl, ToggleButton, ToggleButtonGroup, Card, CardContent,
  FormHelperText,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Breadcrumbs, DefaultLayout} from 'components/layouts';
import ReactiveForm from 'components/ReactiveForm';
import {getErrorMessage, hasError} from 'utils/forms';
import LoadingPage from 'pages/LoadingPage';
import userService from 'services/users';
import {parseErrors} from 'services/api';
import {routes} from 'routes';
import {UserRoles, UserRolesLabels} from 'utils/common';

export default class UserEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.userId = props.params.id;

    this.state = {
      loading: true,
      originalObject: null,
      roleValue: null,
    }

    this.renderForm = this.renderForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSuccess = async () => {
    this.props.snackbar.enqueueSnackbar('User added', {variant: 'success'});
  }

  handleSubmit = async (event, data) => {
    try {
      await userService.update(this.userId, {
        role: this.state.roleValue,
        ...data,
      });
    } catch (e) {
      throw parseErrors(e);
    }
  };

  async componentDidMount() {
    try {
      const res = await userService.detail(this.userId);
      const data =  res.data;
      this.setState(state => {
        state.originalObject = data
        state.roleValue = data.role;
        return state;
      });
      this.setState(state => {
        state.loading = false;
        return state;
      });
    } catch (e) {
      this.props.navigate('/404');
    }
  }

  renderForm({loading, errors}, handleSubmit) {
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              error={hasError(errors?.first_name)}
              defaultValue={this.state.originalObject.first_name}
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
              defaultValue={this.state.originalObject.last_name}
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
          defaultValue={this.state.originalObject.email}
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
          loading={loading}
          type="button"
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          sx={{mt: 2, mb: 2}}
        >
          Save
        </LoadingButton>
      </React.Fragment>
    );
  }

  render() {
    if (this.state.loading) {
      return (<LoadingPage />);
    }

    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Breadcrumbs items={[routes.dashboard, routes.users]} lastLabel={'Edit'} />
          <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between'}}>
            <>
              <Typography component="h1" variant="h5">
                Edit User
              </Typography>
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
