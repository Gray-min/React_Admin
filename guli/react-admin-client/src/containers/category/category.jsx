import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Card, Button, Table, Modal, message, Icon } from 'antd';

import LinkButton from '../../components/link-button'
import AddForm from './add-form'
import UpdateForm from './update-fom'
import { reqAddCategory, reqCategoryLists, reqUpdateCategory } from '../../api'
import './index.less'

export default function Category () {
  const [showModal, setShowModal] = useState(0)
  const [parentId, setParentId] = useState(0)
  const [parentName, setParentName] = useState('')
  const [categorys, setCategorys] = useState([])
  const [subCategorys, setSubCategorys] = useState([])
  const [loading, setLoading] = useState(false)
  const Form = useRef()
  const columns = useRef()
  // const Form = useRef()
  const needUdateCategory = useRef({})
  //关闭对话框
  function handleCancel () {
    Form.current.resetFields()
    setShowModal(0)
  }

  //处理table显示
  const getCategory = useCallback(async () => {
    console.log('getCategory', parentId)
    setLoading(true)
    const result = await reqCategoryLists(parentId)
    setLoading(false)
    if (result.status === 0) {
      if (parentId === 0) {
        setCategorys(result.data)
      }
      else
        setSubCategorys(result.data)
    }
    else
      message.error('获取分类信息失败')
  }, [parentId])

  //处理添加请求
  function handleAdd () {
    console.log(Form.current)
    console.log('handleAdd')
    Form.current.validateFields(async (err, values) => {
      if (!err) {
        setShowModal(0)
        console.log('Received values of form: ', values);
        const result = await reqAddCategory(values)
        Form.current.resetFields()
        if (result.status === 0) {
          message.success('添加分类成功')
          if (values.parentId === parentId)
            getCategory()
        }
        else
          message.error('添加分类失败')
      }
    });

  }

  //处理更新
  function handleUpdate () {
    Form.current.validateFields(async (err, values) => {
      if (!err) {
        setShowModal(0)
        console.log('Received values of form: ', values);
        const categoryId = needUdateCategory.current._id
        const result = await reqUpdateCategory({ categoryId, ...values })
        Form.current.resetFields()
        if (result.status === 0) {
          message.success('更新品类成功')
          getCategory()
        }
        else
          message.error('更新品类失败')
      }
    });
  }

  //显示二级分类
  const showSubCategorys = useCallback((category) => {
    if (category) {
      setParentId(category._id)
      setParentName(category.name)
    }
    getCategory()
    console.log(parentId)
  }, [getCategory, parentId])

  useEffect(() => {
    showSubCategorys()
  }, [showSubCategorys])

  //显示一级分类
  function showCategorys () {
    setParentId(0)
    setParentName('')
    setSubCategorys([])
  }
  //更新modal显示
  function showUpdate (category) {
    needUdateCategory.current = category
    setShowModal(2)
  }
  //初始化表格
  const initColumns = useCallback(() => {
    columns.current = [
      {
        title: '分类的名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) =>
          (
            <span><LinkButton onClick={() => showUpdate(category)}>修改分类</LinkButton>
              {
                parentId === 0 ? <LinkButton onClick={() => showSubCategorys(category)}>查看子分类</LinkButton> : null
              }
            </span>
          )
      },
    ]
  }, [parentId, showSubCategorys])


  useEffect(() => {
    getCategory()
    initColumns()
  }, [getCategory, initColumns])

  //标题
  const title = parentId === 0 ? '一级分类列表' : <span><LinkButton onClick={showCategorys}>一级分类列表</LinkButton><Icon type='arrow-right'></Icon>{parentName}</span>
  return <>
    <Card title={title} extra={<Button icon="plus" type='primary' onClick={() => setShowModal(1)}>添加</Button>} className='category-card'>
      <Table
        bordered
        rowKey='_id'
        loading={loading}
        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        dataSource={parentId === 0 ? categorys : subCategorys}
        columns={columns.current} />
    </Card>
    <Modal
      title="添加分类"
      visible={showModal === 1}
      onOk={handleAdd}
      onCancel={handleCancel}
    >
      <AddForm parentId={parentId} categorys={categorys} setForm={(form) => Form.current = form}></AddForm>
    </Modal>
    <Modal
      title="修改分类"
      visible={showModal === 2}
      onOk={handleUpdate}
      onCancel={handleCancel}
    >
      <UpdateForm categoryName={needUdateCategory.current.name} setForm={(form) => Form.current = form}></UpdateForm>
    </Modal>
  </>
}