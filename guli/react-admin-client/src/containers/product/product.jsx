import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './home'
import AddUpdateProduct from './add-update'
import ProductDetail from './detail'

import './product.less'
export default function Product () {
  return <>
    <Switch>
      <Route path='/product' component={ProductHome} exact></Route>
      <Route path='/product/addupdate' component={AddUpdateProduct}></Route>
      <Route path='/product/detail' component={ProductDetail}></Route>
      <Redirect to='/product' />
    </Switch>
  </>
}