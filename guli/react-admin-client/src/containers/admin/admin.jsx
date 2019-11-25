import React from 'react'
import { Layout } from 'antd';
import { Switch, Route, Redirect } from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

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
        <Content style={{ backgroundColor: '#fff', margin: '20px' }}>
          <Switch>
            <Route path='/home' component={Home} ></Route>
            <Route path='/category' component={Category} ></Route>
            <Route path='/product' component={Product} ></Route>
            <Route path='/role' component={Role} ></Route>
            <Route path='/user' component={User} ></Route>
            <Route path='/charts/bar' component={Bar} ></Route>
            <Route path='/charts/line' component={Line} ></Route>
            <Route path='/charts/pie' component={Pie} ></Route>
            <Redirect to='/home'></Redirect>
          </Switch>
        </Content>
        <Footer className='foot'>推荐使用谷歌浏览器，效果更佳</Footer>
      </Layout>
    </Layout>
  </>
}