import React from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

AddForm.prototype = {
  setForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  parentId: PropTypes.string.isRequired,
  categorys: PropTypes.array.isRequired
}
function AddForm (props) {
  const { getFieldDecorator } = props.form
  const { categorys, parentId } = props
  props.setForm(props.form)
  return <>
    <Form>
      <Form.Item>
        {getFieldDecorator('parentId', {
          initialValue: parentId
        })(
          <Select>
            <Select.Option value={0}>一级分类</Select.Option>
            {categorys.map((item) => <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>)}
          </Select>
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('categoryName', {
          rules: [{ required: true, message: '请输入分类名称' }],
          initialValue: ''
        })(
          <Input placeholder='请输入分类名称'></Input>
        )}
      </Form.Item>
    </Form>
  </>
}
export default Form.create()(AddForm)