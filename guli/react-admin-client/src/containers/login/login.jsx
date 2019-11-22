import React from 'react'
import { Form, Icon, Input, Button, message } from 'antd';

import './login.less'
import logo from './images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storeUtils from '../../utils/storeUtils'
function Login (props) {
  const user = memoryUtils
  if (user && user._id)
    props.history.replace('/')

  //登陆提交
  function handleSubmit (event) {
    event.preventDefault()
    //统一验证
    props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = await reqLogin(values)
        if (result.status) {
          message.error(result.msg)
        }
        else {
          message.success('登陆成功')
          const user = result.data
          memoryUtils.user = user
          storeUtils.saveUser(user)
          props.history.replace('/')
        }
      }
    });
  }
  //自定义密码验证
  function validatePwd (rule, value, callback) {
    if (!value)
      callback('密码不能为空')
    else if (value.length < 4)
      callback('密码不能小于4位')
    else if (value.length > 12)
      callback('密码不能大于12位')
    else if (!/^[a-zA-Z0-9_]+$/)
      callback('密码必须为数字、英文或下划线组成')
    else
      callback()
  }
  const { getFieldDecorator } = props.form;
  return <>
    <div className='login'>
      <header className='login-header'>
        <img src={logo} alt='logo' />
        <h1>后台管理系统</h1>
      </header>
      <section className='login-content'>
        <h2>用户登陆</h2>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                { required: true, message: '请输入用户名' },
                { min: 4, message: '用户名不能小于4位' },
                { max: 12, message: '用户名不能大于12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须为数字、英文或下划线组成' }
              ],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ validator: validatePwd }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
          </Button>

          </Form.Item>
        </Form>
      </section>
    </div>
  </>
}
export default Form.create()(Login);