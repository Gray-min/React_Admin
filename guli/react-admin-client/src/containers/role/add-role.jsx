import React from 'react'
import { Input, Form } from 'antd'
import PropTypes from 'prop-types'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}
function AddRole (props) {
  AddRole.prototype = {
    setForm: PropTypes.func.isRequired
  }

  const { getFieldDecorator } = props.form
  props.setForm(props.form)
  return <>
    <Form {...formItemLayout}>
      <Form.Item label='角色名称'>
        {getFieldDecorator('roleName', {
          initialValue: '',
          rules: [{ required: true, message: '必须输入角色名称' }]
        })(
          <Input />
        )}
      </Form.Item>
    </Form>
  </>
}
export default Form.create()(AddRole)