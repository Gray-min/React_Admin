import React, { useRef, useState, useEffect } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'

import menuConfig from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}

export default function AuthRole (props) {
  AuthRole.prototype = {
    role: PropTypes.object.isRequired
  }

  const treeNode = useRef()
  const [checkedKeys, setCheckedKeys] = useState()
  //初始化树
  const initTree = (menuList) => {
    console.log('initTree', menuList)
    return menuList.map(item =>
      <TreeNode title={item.title} key={item.key}>
        {
          item.children ? initTree(item.children) : null
        }
      </TreeNode >
    )
  }
  // const initTree = useCallback(() => {
  //   console.log('initTree', menuConfig)
  //   return menuConfig.map(item =>
  //     <TreeNode title={item.title} key={item.key}>
  //       {
  //         item.children ? item.children.map(item => <TreeNode title={item.title} key={item.key}></TreeNode>) : null
  //       }
  //     </TreeNode >
  //   )
  // }, [])
  function handleCheck (TreecheckedKeys) {
    setCheckedKeys(TreecheckedKeys)
  }

  //初始化树节点
  treeNode.current = initTree(menuConfig)

  useEffect(() => {
    // treeNode.current = initTree(menuConfig)
    setCheckedKeys(props.role.menus)
  }, [props.role.menus])


  //获取已选择节点数据
  AuthRole.prototype.getCheckedNode = () => {
    return checkedKeys
  }
  const { name } = props.role
  return <>
    <Item label='角色名称' {...formItemLayout}>
      <Input disabled value={name} />
    </Item>
    <Tree
      checkable
      defaultExpandAll={true}
      defaultExpandParent={true}
      checkedKeys={checkedKeys}
      onCheck={handleCheck}
    >
      <TreeNode title='平台权限' key='all'>
        {treeNode.current}
      </TreeNode>
    </Tree>
  </>
}