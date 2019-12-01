import React, { useRef, useCallback, useState, useEffect } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'

import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { reqUserList, reqAddOrUpdateUser, reqDeleteUser } from '../../api'
import UserForm from './user-form'
export default function User () {
  const [users, setUsers] = useState()
  const [roles, setRoles] = useState()
  const [isShow, setIsShow] = useState(false)
  const Form = useRef()
  const columns = useRef()
  const roleNames = useRef({})
  const user = useRef({})

  //删除用户var
  const deleteUser = useCallback((user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功!')
          getUserList()
        }
      }
    })
  }, [getUserList])

  //初始化表格项
  const initColumns = useCallback(() => {
    console.log('initColumns')
    columns.current = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => roleNames.current[role_id]
      },
      {
        title: '操作',
        render: (douser) => (<span>
          <LinkButton
            onClick={() => {
              setIsShow(true)
              user.current = douser
            }}
          >修改</LinkButton>
          <LinkButton onClick={() => deleteUser(douser)}>删除</LinkButton></span>)
      }
    ]
  }, [deleteUser]
  )

  const doRoles = useCallback((roles) => {
    const initRoles = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    roleNames.current = { ...initRoles }
  }, [])

  //获取用户列表
  var getUserList = useCallback(async () => {
    console.log('getusers')
    const result = await reqUserList()
    if (!result.status) {
      const { users, roles } = result.data
      doRoles(roles)
      setUsers(users)
      setRoles(roles)
    }
  }, [doRoles])
  //初始化添加modal
  function showAdd () {
    user.current = {}
    setIsShow(true)
  }

  function addOrUpdateUser () {
    Form.current.validateFields(async (err, values) => {
      if (!err) {
        if (user.current._id) {
          values._id = user.current._id
        }
        const result = await reqAddOrUpdateUser(values)
        Form.current.resetFields()
        if (!result.status) {
          message.success(`${user.current._id ? '更新' : '创建'}用户成功`)
          getUserList()
          setIsShow(false)
        } else
          message.success(`${user.current._id ? '更新' : '创建'}用户失败`)
      }
    })
  }

  useEffect(() => {
    initColumns()
    getUserList()
  }, [getUserList, initColumns])

  return <>
    {
      console.log('render')
    }
    <Card title={<Button type='primary' onClick={showAdd}>创建用户</Button>}>
      <Table
        rowKey='_id'
        columns={columns.current}
        dataSource={users}
      >
      </Table>
    </Card>
    <Modal
      visible={isShow}
      onCancel={() => {
        setIsShow(false)
        Form.current.resetFields()
      }}
      onOk={addOrUpdateUser}
    >
      <UserForm setForm={(form) => Form.current = form} roles={roles} user={user.current}></UserForm>
    </Modal>
  </>
}