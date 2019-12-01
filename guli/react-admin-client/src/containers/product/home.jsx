import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Table, Card, Select, Input, Button, message, Form } from 'antd'
import PropTypes from 'prop-types'

import { reqProductList, reqSearchProducts, reqUpdateStatus } from '../../api'
import LinkButton from '../../components/link-button'

ProductHome.prototype = {
  form: PropTypes.object.isRequired
}

function ProductHome (props) {
  const [pageNum, setPageNum] = useState(1)
  const [pageSize] = useState(1)
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState()
  const [searchType, setSearchType] = useState('productName')
  const [searchName, setSearchName] = useState('')
  const columns = useRef()

  //获取产品
  const getProducts = useCallback(async (pageNum) => {
    setPageNum(pageNum)
    let result
    if (!searchName)
      result = await reqProductList({ pageNum, pageSize })
    else
      result = await reqSearchProducts({ pageNum, pageSize, searchType, searchName })
    if (!result.status) {
      console.log(result.data)
      setProducts(result.data.list)
      setTotal(result.data.total)
    }
    else
      message.error('获取产品失败')
  }, [pageSize, searchName, searchType])

  //更新产品
  const updateStatus = useCallback(async (productId, status) => {
    console.log(productId, status)
    const m = status === 2 ? '商品下架成功' : '商品上架成功'
    const result = await reqUpdateStatus({ productId, status })
    if (!result.status) {
      message.success(m)
      getProducts(pageNum)
    }
    else
      message.error('更新商品信息失败')
  }, [getProducts, pageNum])
  useEffect(() => {
    getProducts(1)
  }, [getProducts])
  //初始化表格项
  const initColumns = useCallback(() => {
    columns.current = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },

      {
        title: '商品描述',
        width: 700,
        dataIndex: 'desc'
      },
      {
        title: '价格',
        width: 110,
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        title: '状态',
        width: 100,
        render: (product) => (
          <span>
            <Button type='primary' onClick={() => updateStatus(product._id, product.status === 1 ? 2 : 1)}>
              {product.status === 1 ? '下架' : '上架'}
            </Button>
            {product.status === 1 ? '在售' : '已下架'}
          </span>)
      },
      {
        title: '操作',
        width: 100,
        render: (product) => (
          <span>
            <LinkButton
              onClick={() => props.history.push('/product/detail', product)}
            >详情
          </LinkButton>
            <LinkButton
              onClick={() => props.history.push('/product/addupdate', product)}
            >修改
          </LinkButton>
          </span>)
      }
    ]
  }, [props.history, updateStatus])
  useEffect(() => {
    initColumns()
  }, [initColumns])

  function handleSearch () {
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { sType, sName } = values
        setSearchName(sName)
        setSearchType(sType)
      }
    })
    getProducts(1)
  }


  const { getFieldDecorator } = props.form;
  //标题
  const title = (<span>
    {getFieldDecorator('sType', {
      initialValue: searchType
    })(
      <Select style={{ width: 150 }}>
        <Select.Option value='productDesc'>根据描述查询</Select.Option>
        <Select.Option value='productName'>根据名称查询</Select.Option>
      </Select>
    )}
    {getFieldDecorator('sName', {
      initialValue: searchName,
      rules: [{ required: true, message: '请输入查询关键字' }],
    })(
      <Input placeholder='请输入查询关键字' style={{ width: 150, margin: '0 15px' }} />
    )}

    <Button type='primary' onClick={handleSearch}>查询</Button>
  </span>)

  return <>
    <Card title={title} extra={<Button icon='plus' type='primary' onClick={() => props.history.push('/product/addupdate')}>添加</Button>}>
      <Table
        rowKey='_id'
        bordered
        dataSource={products}
        columns={columns.current}
        pagination={{
          current: pageNum,
          defaultPageSize: pageSize,
          showQuickJumper: true,
          total: total,
          onChange: getProducts
        }}
      >
      </Table>

    </Card>
  </>
}
export default Form.create()(ProductHome)