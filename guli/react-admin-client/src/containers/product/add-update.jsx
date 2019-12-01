import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Card, Form, Icon, Input, Cascader, Button, message } from 'antd'

import { reqCategoryLists, reqAddOrUpdate } from '../../api'
import PicturesWall from './pictures-wall'
import EditorImage from './editor-image'
const { Item } = Form
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 }
}
const { TextArea } = Input;
function AddUpdateProduct (props) {
  const [options, setOptions] = useState([])
  const isUpdate = useRef()
  const pro = useRef({})
  const imgages = useRef()
  // const editor = useRef()

  //提交添加表单
  const handleSubmit = () => {
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log('getimgs', imgages.current.getImgs())
        console.log('getdetail', EditorImage.prototype.getDetail())
        console.log('isupdate', isUpdate.current)
        const { name, desc, price, categorys } = values
        let pCategoryId, categoryId
        if (categorys.length === 1) {
          pCategoryId = 0
          categoryId = categorys[0]
        } else {
          pCategoryId = categorys[0]
          categoryId = categorys[1]
        }
        const imgs = imgages.current.getImgs()
        const detail = EditorImage.prototype.getDetail()

        const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
        if (isUpdate.current) {
          product._id = pro.current._id
        }
        console.log(product)
        const result = await reqAddOrUpdate(product)
        if (!result.status) {
          message.success(isUpdate.current ? '更新成功' : '添加成功')
          props.history.goBack()
        }
        else
          message.success(isUpdate.current ? '更新失败' : '添加失败')
      }
    });
  }

  const getCategorys = useCallback(async (parentId) => {
    const result = await reqCategoryLists(parentId)
    if (!result.status) {
      if (parentId === 0)
        initOptions(result.data)
      else
        return result
    }
  }, [initOptions])

  //初始化
  var initOptions = useCallback(async (categorys) => {
    const options = categorys.reduce((pre, category) => {
      pre.push({
        value: category._id,
        label: category.name,
        isLeaf: false,
      })
      return pre
    }, [])
    const { pCategoryId } = pro.current
    if (isUpdate.current && pCategoryId * 1 !== 0) {
      const result = await getCategorys(pCategoryId)
      const childoptions = result.data.map((category) => (
        {
          value: category._id,
          label: category.name
        }
      ))
      const targetOption = options.find((category) => category.value === pCategoryId)
      targetOption.children = childoptions
    }
    setOptions(options)
  }, [getCategorys])

  //加载二级分类
  const loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const result = await reqCategoryLists(targetOption.value)
    targetOption.loading = false
    if (!result.status) {
      if (result.data && result.data.length > 0) {
        const options = result.data.map((category) => ({ value: category._id, label: category.name }))
        targetOption.children = options
      } else {
        targetOption.isLeaf = true
      }

    }
    setOptions([...options])
  }

  useEffect(() => {
    getCategorys(0)
  }, [getCategorys])

  // useEffect(() => {
  //   const receiveProduct = props.location.state
  //   pro.current = receiveProduct || {}
  //   console.log(pro.current)
  //   isUpdate.current = !!receiveProduct
  // })
  const receiveProduct = props.location.state
  pro.current = receiveProduct || {}
  isUpdate.current = !!receiveProduct

  const title = (<span>
    <Icon
      type='arrow-left'
      style={{ fontSize: 20, color: 'green', margin: '0 10px' }}
      onClick={() => props.history.goBack()}
    ></Icon>
    {isUpdate.current ? '修改商品' : '添加商品'}
  </span>)
  const { getFieldDecorator } = props.form


  return <>
    <Card title={title}>
      <Form {...formItemLayout}>
        <Item label='商品名称'>
          {getFieldDecorator('name', {
            initialValue: pro.current.name,
            rules: [{ required: true, message: '必须输入商品名称' }]
          })(
            <Input placeholder='请输入商品名称' />
          )}
        </Item>
        <Item label='商品描述'>
          {getFieldDecorator('desc', {
            initialValue: pro.current.desc,
            rules: [{ required: true, message: '必须输入商品描述' }]
          })(
            <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }}></TextArea>
          )}
        </Item>
        <Item label='商品价格'>
          {getFieldDecorator('price', {
            initialValue: pro.current.price,
            rules: [{ required: true, message: '必须输入商品价格' }]
          })(
            <Input type='number' addonAfter='元' />
          )}
        </Item>
        <Item label='商品分类'>
          {getFieldDecorator('categorys', {
            initialValue: [pro.current.pCategoryId, pro.current.categoryId],
            rules: [{ required: true, message: '必须选择商品分类' }]
          })(
            <Cascader
              options={options}
              loadData={loadData}
            >
            </Cascader>
          )}

        </Item>
        <Item label='商品图片'>
          <PicturesWall ref={imgages} imgs={pro.current.imgs} />
        </Item>
        <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <EditorImage detail={pro.current.detail} />
        </Item>
        <Button type='primary' onClick={handleSubmit} >提交</Button>
      </Form>
    </Card>
  </>
}
export default Form.create()(AddUpdateProduct)