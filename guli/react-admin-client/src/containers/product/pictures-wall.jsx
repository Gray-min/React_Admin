import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';

import { reqImgDelete } from '../../api'
import { BASEIMGURL } from '../../utils/constant'
import PropTypes from 'prop-types'

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor(props) {
    super(props)
    const { imgs } = this.props
    let fileList = []
    if (imgs && imgs.length !== 0) {
      fileList = imgs.map((img, index) => (
        {
          uid: -index,
          name: img,
          status: 'done',
          url: BASEIMGURL + img
        }
      ))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: fileList
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    console.log(file)
    if (file.status === 'done') {
      if (!file.response.status) {
        const { name, url } = file.response.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      }
    }
    if (file.status === 'removed') {
      const result = await reqImgDelete(file.name)
      if (!result.status)
        message.success('删除成功')
      else
        message.error('删除失败')
    }

    this.setState({ fileList });
  }

  getImgs = () => this.state.fileList.map((file) => file.name)

  render () {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          accept='image/*'
          name='image'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
