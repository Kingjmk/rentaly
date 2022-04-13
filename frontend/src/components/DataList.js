import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Paper} from '@mui/material';
import PropTypes from 'prop-types'


export default class DataList extends React.Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    getData: PropTypes.func.isRequired,
  }

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

    const res = await this.props.getData({
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
      <Paper style={{width: '100%', maxHeight: '100%'}}>
        <DataGrid
          columns={this.props.columns}
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
    )
  }
}
