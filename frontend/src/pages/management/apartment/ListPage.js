import React from 'react';
import {GridActionsCellItem} from '@mui/x-data-grid';
import {Container, Box, Typography, Button} from '@mui/material';
import {Breadcrumbs, DefaultLayout} from 'components/layouts';
import apartmentService from 'services/apartments';
import {Link as RouterLink} from 'react-router-dom';
import {routes} from 'routes';
import {ModeEditOutlineOutlined as EditIcon, VisibilityOutlined as EyeIcon} from '@mui/icons-material';
import DataList from 'components/DataList';
import {ApartmentStatesLabels} from 'utils/common';


const columns = [
  {field: 'id', headerName: 'ID', flex: 1},
  {field: 'name', headerName: 'Name', flex: 1},
  {field: 'floor', headerName: 'Floor', flex: 1},
  {field: 'area_size', headerName: 'Area Size', flex: 1},
  {field: 'price_per_month', headerName: 'Price per month', type: 'number', flex: 1},
  {field: 'number_of_rooms', headerName: 'Number of rooms', type: 'number', flex: 1},
  {field: 'state', headerName: 'State', flex: 1, valueGetter: ({value}) => ApartmentStatesLabels[value] || ''},
  {field: 'created_on', headerName: 'Added on', type: 'date', flex: 1, valueGetter: ({value}) => value && new Date(value)},
  {
    field: 'actions',
    type: 'actions',
    getActions: ({id}) => [
      <GridActionsCellItem icon={<EditIcon />} component={RouterLink} to={`/apartments/${id}/edit`} label="Edit" />,
      <GridActionsCellItem icon={<EyeIcon />} component={RouterLink} to={`/apartments/${id}/view`} label="See on website" />,
    ],
  },
];

export default class ApartmentListPage extends React.Component {
  async getData(data) {
    return await apartmentService.list(data);
  }

  render() {
    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Breadcrumbs items={[routes.dashboard]} lastLabel={'Apartments'} />
          <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <>
              <Typography component="h1" variant="h5">
                Apartments
              </Typography>
            </>
            <>
              <Button color="success" variant="contained" size="small" onClick={() => {this.props.navigate(routes.apartment_add.path)}}>new</Button>
            </>
          </Box>
          <DataList columns={columns} getData={this.getData} />
        </Container>
      </DefaultLayout>
    )
  }
}
