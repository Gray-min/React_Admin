import React, { useEffect, useState, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { reqWeather } from '../../api/index'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuConfig from '../../config/menuConfig'
import storeUtils from '../../utils/storeUtils'
import LinkButton from '../link-button'
import { Modal } from 'antd';
function Header (props) {
  const [currentTime, setCurrentTime] = useState(formateDate(Date.now()))
  const [dayPictureUrl, setDayPictureUrl] = useState()
  const [weather, setWeather] = useState()
  const [title, setTitle] = useState()
  async function getWeather () {
    const result = await reqWeather('杭州')
    const { dayPictureUrl, weather } = result
    setDayPictureUrl(dayPictureUrl)
    setWeather(weather)
  }
  const getTitleCallback = useCallback(
    () => {
      const pathname = props.location.pathname
      let title
      menuConfig.forEach((item) => {
        if (item.key === pathname)
          title = item.title
        else if (item.children) {
          const citem = item.children.find(citem => citem.key === pathname)
          if (citem)
            title = citem.title
        }
      })
      setTitle(title)
    },
    [props.location.pathname],
  );
  function confirm () {
    Modal.confirm({
      content: '确定退出吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: logout
    });
  }
  function logout () {
    memoryUtils.user = {}
    storeUtils.removeUser()
    props.history.replace('/')
  }
  //获取标题
  useEffect(() => {
    getTitleCallback()
  }, [getTitleCallback])

  //获取天气和时间
  useEffect(() => {
    getWeather()
    const id = setInterval(() => setCurrentTime(formateDate(Date.now())), 1000)
    return () => {
      clearInterval(id)
    }
  }, [])
  return <>
    <div className='header'>
      <div className='header-top'>
        <span>欢迎，{memoryUtils.user.username}</span>
        <LinkButton onClick={confirm}>退出</LinkButton>
      </div>
      <div className='header-bottom'>
        <div className='header-bottom-left'>{title}</div>
        <div className='header-bottom-right'>
          <span>{currentTime}</span>
          <img src={dayPictureUrl} alt='天气图片'></img>
          <span>{weather}</span>
        </div>
      </div>
    </div>
  </>
}
export default withRouter(Header)