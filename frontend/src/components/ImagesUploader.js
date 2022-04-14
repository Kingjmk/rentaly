import React from 'react';
import PropTypes from 'prop-types';
import {Box, ImageList, ImageListItem, ImageListItemBar, IconButton} from '@mui/material';
import Dropzone from 'react-dropzone-uploader';
import apartmentService, {createImageDropzoneParams} from 'services/apartments';
import {DeleteOutlineOutlined as DeleteIcon} from '@mui/icons-material';

const InputComponent = ({className, labelClassName, style, labelStyle, getFilesFromEvent, accept, multiple, disabled, content, onFiles}) => (
  <label className={labelClassName} style={labelStyle}>
    {content}
    <input
      className={className}
      style={style}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      onChange={async e => {
        const target = e.target
        const chosenFiles = await getFilesFromEvent(e)
        onFiles(chosenFiles)
        //@ts-ignore
        target.value = null
      }}
    />
  </label>
);

  

export default class ImagesUploader extends React.Component {
  static propTypes = {
    apartmentId: PropTypes.number.isRequired,
    items: PropTypes.array,
    snackbar: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.apartmentId = this.props.apartmentId;
    this.initialItems = this.props.items || [];

    this.state = {
      items: this.initialItems,
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.RenderImages = this.RenderImages.bind(this);
  }

  getUploadParams(props) {
    return createImageDropzoneParams({apartmentId: this.apartmentId}, props);
  }

  handleAdd(data) {
    // just add to state
    this.setState(state => {
      state.items = [...state.items, data];
      return state;
    });
    this.props.snackbar.enqueueSnackbar('Image Added', {variant: 'success'});
  }

  async handleRemove({id}) {
    await this.props.confirm({description: 'Deleting an image is permanent and cannot be reversed, continue?'});

    // also remove from api
    await apartmentService.deleteImage(id);
    this.setState(state => {
      const index = state.items.findIndex(item => item.id === id);
      state.items.splice(index, 1);
      return state;
    });
    this.props.snackbar.enqueueSnackbar('Image Deleted', {variant: 'warning'});
  }

  async handleChangeStatus(meta, status) {
    if (status === 'done') {
      const data = JSON.parse(meta.xhr.responseText);
      this.handleAdd(data);
    } else if (status === 'removed') {
      const data = JSON.parse(meta.xhr.responseText);
      await this.handleRemove(data);
    }
  }

  RenderImages() {
    const {items} = this.state;
    if (items.length === 0) return (<></>);

    return (
      <Box sx={{mb: 3}}>
        <ImageList cols={4} gap={10} sx={{width: '100%', maxHeight: 700}}>
          {items.map(item => (
            <ImageListItem key={item.id} cols={1}>
              <img
                src={item.url}
                alt={item.name}
              />
              <ImageListItemBar
                sx={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'}}
                title={item.name}
                position="top"
                actionIcon={
                  <IconButton
                    sx={{color: 'white'}}
                    aria-label={`remove ${item.name}`}
                    onClick={() => this.handleRemove(item)}
                    label="Remove Image"
                  >
                    <DeleteIcon/>
                  </IconButton>
                }
                actionPosition="left"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    );
  }

  render() {
    return (
      <Box sx={{pt: 3}}>
        <this.RenderImages />
        <Box>
          <Dropzone
            InputComponent={InputComponent}
            PreviewComponent={null}
            accept="image/*"
            getUploadParams={this.getUploadParams.bind(this)}
            onChangeStatus={this.handleChangeStatus.bind(this)}
            inputContent={(files, extra) => (extra.reject ? 'Image files only' : 'Drag Images to upload here')}
            styles={{
              dropzoneReject: {borderColor: 'red', backgroundColor: '#DAA'},
              inputLabel: (files, extra) => (extra.reject ? {color: 'red'} : {}),
            }}
          />
        </Box>
      </Box>
    );
  }
}
