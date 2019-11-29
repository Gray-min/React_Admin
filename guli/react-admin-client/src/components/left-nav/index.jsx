import React, { useRef } from 'react'
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom'

import './index.less'
import logo from '../../assets/images/logo.png'
import menuConfig from '../../config/menuConfig'
const { SubMenu } = Menu;
function LeftNav (props) {
  //const [openKey, setOpenKey] = useState()
  const openkey = useRef()
  function handleClick ({ item, key, keyPath, domEvent }) {
    props.history.push(key)
  }
  //map+递归
  // function getMenuNodes_map (menuList) {
  //   console.log(menuList)
  //   return menuList.map((item) => {
  //     if (!item.children) {
  //       return (<Menu.Item key={item.key}>
  //         <Icon type={item.icon} />
  //         <span>{item.title}</span>
  //       </Menu.Item>)
  //     }
  //     else
  //       return (
  //         <SubMenu key={item.key}
  //           title={
  //             <span>
  //               <Icon type={item.icon} />
  //               <span>{item.title}</span>
  //             </span>
  //           }
  //         >
  //           {
  //             getMenuNodes_map(item.children)
  //           }
  //         </SubMenu>
  //       )
  //   })
  // }
  //reduce+递归
  function getMenuNodes (menuList) {
    console.log('getnode()')
    const path = props.location.pathname
    console.log(path)
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push(<Menu.Item key={item.key}>
          <Icon type={item.icon} />
          <span>{item.title}</span>
        </Menu.Item>)
      }
      else {
        // debugger
        const citem = item.children.find(item => path.indexOf(item.key) === 0)
        if (citem)
          //setOpenKey(item.key)
          openkey.current = item.key
        pre.push(
          <SubMenu key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {
              getMenuNodes(item.children)
            }
          </SubMenu>
        )

      }
      return pre
    }, [])
  }
  const menu = getMenuNodes(menuConfig)
  let path = props.location.pathname
  if (path.indexOf('/product') === 0)
    path = '/product'
  return <>
    <div className='left-nav'>
      <Link to='/home' className='left-nav-header'>
        <img src={logo} alt='logo'></img>
        <h1>硅谷后台</h1>
      </Link>
      <Menu
        mode="inline"
        selectedKeys={[path]}
        defaultOpenKeys={[openkey.current]}
        onClick={handleClick}
        theme='dark'
      >
        {menu}
      </Menu>
    </div>
  </>
}
export default withRouter(LeftNav)