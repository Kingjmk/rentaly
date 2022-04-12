import React from 'react';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import {Paper, Container, Box, Typography, Button} from '@mui/material';
import {DefaultLayout} from 'components/layouts';
import apartmentService from 'services/apartments';
import {Link as RouterLink} from 'react-router-dom';
import {routes} from 'routes';
import {ModeEditOutlineOutlined as EditIcon} from '@mui/icons-material';


const columns = [
  {field: 'id', headerName: 'ID', flex: 1},
  {field: 'name', headerName: 'Name', flex: 1},
  {field: 'floor', headerName: 'Floor', flex: 1},
  {field: 'area_size', headerName: 'Area Size', flex: 1},
  {field: 'price_per_month', headerName: 'Price per month', type: 'number', flex: 1},
  {field: 'number_of_rooms', headerName: 'Number of rooms', type: 'number', flex: 1},
  {
    field: 'actions',
    type: 'actions',
    getActions: (params) => [
      <GridActionsCellItem icon={<EditIcon />} component={RouterLink} to={`/apartments/${params.id}/edit`} label="Edit" />,
    ],
  },
];

export default class ApartmentListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageSize: 15,
      rowCount: 0,
      rows: [],
      loading: true,
    }

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  async handlePageChange(page) {
    await this.loadRows(page);
  }

  async loadRows(page) {
    this.setState(state => {
      state.loading = true;
      state.page = page;
      return state;
    });

    const res = await apartmentService.list({
      page: page + 1,
      page_limit: this.state.pageSize,
    });

    this.setState(state => {
      state.rows = res.data.results;
      state.rowCount = res.data.count;
      state.loading = false;
      return state;
    });
  }

  async componentDidMount() {
    await this.loadRows(this.state.page);
  }

  render() {
    return (
      <DefaultLayout>
        <Container component="main" maxWidth="lg" sx={{mt: 2}}>
          <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between'}}>
            <>
              <Typography component="h1" variant="h5">
                Apartments
              </Typography>
            </>
            <>
              <Button color="success" variant="contained" size="small" onClick={() => {this.props.navigate(routes.apartment_add.path)}}>new</Button>
            </>
          </Box>
          <Paper style={{width: '100%', maxHeight: '100%'}}>
            <DataGrid
              columns={columns}
              rows={this.state.rows}
              rowCount={this.state.rowCount}
              rowsPerPageOptions={[this.state.pageSize]}
              page={this.state.page}
              pageSize={this.state.pageSize}
              paginationMode="server"
              pagination
              autoHeight
              onPageChange={page => this.handlePageChange(page)}
              loading={this.state.loading}
            />
          </Paper>
        </Container>
      </DefaultLayout>
    )
  }
}
