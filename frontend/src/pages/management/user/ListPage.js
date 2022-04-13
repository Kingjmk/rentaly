import React from 'react';
import {GridActionsCellItem} from '@mui/x-data-grid';
import {Container, Box, Typography, Button} from '@mui/material';
import {ModeEditOutlineOutlined as EditIcon} from '@mui/icons-material';
import {Breadcrumbs, DefaultLayout} from 'components/layouts';
import DataList from 'components/DataList';
import {Link as RouterLink} from 'react-router-dom';
import {routes} from 'routes';
import userService from 'services/users';
import {UserRolesLabels} from 'utils/common';

const columns = [
  {field: 'id', headerName: 'ID', flex: 1},
  {field: 'first_name', headerName: 'First name', flex: 1},
  {field: 'last_name', headerName: 'Last name', flex: 1},
  {
    field: 'fullName',
    headerName: 'Full name',
    flex: 1,
    valueGetter: ({row: {first_name, last_name}}) => `${first_name|| ''} ${last_name || ''}`,
  },
  {field: 'email', headerName: 'Email', flex: 1},
  {field: 'role', headerName: 'Role', flex: 1, valueGetter: ({value}) => UserRolesLabels[value] || ''},
  {field: 'date_joined', headerName: 'Date Joined', type: 'date', flex: 1, valueGetter: ({value}) => value && new Date(value)},
  {
    field: 'actions',
    type: 'actions',
    getActions: ({id}) => [
      <GridActionsCellItem icon={<EditIcon />} component={RouterLink} to={`/users/${id}/edit`} label="Edit" />,
    ],
  },
];

export default class UserListPage extends React.Component {
  async getData(data) {
    return await userService.list(data);
  }

  render() {
    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Breadcrumbs items={[routes.dashboard]} lastLabel={'Users'} />
          <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <>
              <Typography component="h1" variant="h5">
                Users
              </Typography>
            </>
            <>
              <Button color="success" variant="contained" size="small" onClick={() => {this.props.navigate(routes.user_add.path)}}>new</Button>
            </>
          </Box>
          <DataList columns={columns} getData={this.getData} />
        </Container>
      </DefaultLayout>
    )
  }
}
