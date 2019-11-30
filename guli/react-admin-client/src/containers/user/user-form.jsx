import React from 'react'
import { Input, Form, Select } from 'antd'
import PropTypes from 'prop-types'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}
const Option = Select.Option
UserForm.prototype = {
  setForm: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
  user: PropTypes.object
}
function UserForm (props) {
  const { getFieldDecorator } = props.form
  props.setForm(props.form)
  const { user } = props
  return <>
    <Form {...formItemLayout}>
      <Form.Item label='用户名'>
        {getFieldDecorator('username', {
          initialValue: user.username,
          rules: [{ required: true, message: '必须输入用户名' }]
        })(
          <Input />
        )}
      </Form.Item>
      {
        user._id ? null : (<Form.Item label='密码'>
          {getFieldDecorator('password', {
            initialValue: user.password,
            rules: [{ required: true, message: '必须输入密码' }]
          })(
            <Input type='password' />
          )}
        </Form.Item>)
      }

      <Form.Item label='手机号'>
        {getFieldDecorator('phone', {
          initialValue: user.phone,
          rules: [{ required: true, message: '必须输入手机号' }]
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label='邮箱'>
        {getFieldDecorator('email', {
          initialValue: user.email,
          rules: [{ required: true, message: '必须输入邮箱' }]
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label='角色'>
        {getFieldDecorator('role_id', {
          initialValue: user.role_id,
          rules: [{ required: true, message: '必须选择角色' }]
        })(
          <Select>
            {props.roles.map(role => (
              <Option key={role._id} value={role._id} >{role.name}</Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Form>
  </>
}
export default Form.create()(UserForm)