import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
UpdateForm.prototype = {
  setForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  categoryName: PropTypes.string.isRequired
}
function UpdateForm (props) {
  const { getFieldDecorator } = props.form
  props.setForm(props.form)
  console.log(props.categoryName)
  return <>
    <Form>
      <Form.Item>
        {getFieldDecorator('categoryName', {
          rules: [{ required: true, message: '请输入分类名称' }],
          initialValue: props.categoryName
        })(
          <Input placeholder='请输入分类名称'></Input>
        )}
      </Form.Item>
    </Form>
  </>
}
export default Form.create()(UpdateForm)