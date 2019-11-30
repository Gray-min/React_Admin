import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'

import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqRoleList, reqAddRole, reqUpdateRole } from '../../api'
import AddRole from './add-role'
import AuthRole from './auth-role'
export default function Role (props) {
  const columns = useRef([])
  const addForm = useRef()
  const [roleList, setRoleList] = useState()
  const [role, setRole] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  //初始化表格标题
  function initColumns () {
    console.log('initColumns')
    columns.current = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }

  //获取表格数据
  const getRoleList = useCallback(async () => {
    console.log('获取角色列表信息')
    const result = await reqRoleList()
    if (!result.status) {
      setRoleList(result.data)
    } else
      message.error('获取角色列表信息失败')
  }, [])


  useEffect(() => {
    getRoleList()
    initColumns()
  }, [getRoleList])

  //添加确认
  function handleAdd () {
    addForm.current.validateFields(async (err, values) => {
      if (!err) {
        console.log(values)
        const result = await reqAddRole(values)
        if (!result.status) {
          setRoleList([...roleList, result.data])
          setShowAdd(false)
        }
        else
          message.error('添加角色失败')
      }
    })
  }
  //取消添加
  function handleCancel () {
    setShowAdd(false)
    addForm.current.resetFields()
  }
  //角色授权
  async function handleAuth () {
    console.log('menus', AuthRole.prototype.getCheckedNode())
    const { _id } = role
    const menus = AuthRole.prototype.getCheckedNode()
    const auth_name = memoryUtils.user.username
    const auth_time = Date.now()
    console.log({ _id, menus, auth_name, auth_time })
    setShowAuth(false)
    const result = await reqUpdateRole({ _id, menus, auth_name, auth_time })
    if (!result.status) {
      if (memoryUtils.user.role_id === _id) {
        message.success('你的权限发生变动请重新登陆')
        props.history.replace('/login')
      }
      else {
        message.success('授权成功')
        getRoleList()
      }
    } else {
      message.error('授权失败')
    }
  }
  const title = (<span><Button type='primary' onClick={() => setShowAdd(true)}>创建角色
  </Button>&nbsp;&nbsp;<Button type='primary' disabled={!role._id} onClick={() => setShowAuth(true)}>设置角色权限</Button></span>)
  return <>
    <Card title={title}>
      <Table
        bordered
        rowKey='_id'
        columns={columns.current}
        dataSource={roleList}
        rowSelection={{
          type: 'radio',
          onSelect: (record) => { setRole(record) },
          selectedRowKeys: role._id
        }}
        onRow={record => {
          return {
            onClick: event => { setRole(record) }, // 点击行
          };
        }}
        pagination={{
          defaultPageSize: 1,
          onChange: () => { setRole({}) }
        }}
      >
      </Table>
    </Card>

    <Modal
      title="添加角色"
      visible={showAdd}
      onOk={handleAdd}
      onCancel={handleCancel}
    >
      <AddRole setForm={(form) => addForm.current = form} />
    </Modal>

    <Modal
      title="角色授权"
      visible={showAuth}
      onOk={handleAuth}
      onCancel={() => setShowAuth(false)}
    >
      <AuthRole role={role} />
    </Modal>


  </>
}