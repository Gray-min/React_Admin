import React from 'react'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import './admin.less'
const { Footer, Sider, Content } = Layout
export default function Admin (props) {
  const { user } = memoryUtils
  if (!user || !user._id)
    props.history.replace('/login')
  return <>
    <Layout style={{ height: '100%' }} >
      <Sider><LeftNav></LeftNav></Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer className='foot'>推荐使用谷歌浏览器，效果更佳</Footer>
      </Layout>
    </Layout>
  </>
}