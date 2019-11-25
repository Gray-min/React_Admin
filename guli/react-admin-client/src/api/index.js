import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

//登陆
export const reqLogin = ({ username, password }) => ajax('/login', { username, password }, 'POST')

//新增分类信息
export const reqAddCategory = ({ parentId, categoryName }) => ajax('/manage/category/add', { parentId, categoryName }, 'POST')

//获取一级或某个二级分类列表
export const reqCategoryLists = (parentId) => ajax('/manage/category/list', { parentId })

//更新品类名称
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax('/manage/category/update', { categoryId, categoryName }, 'POST')

//获取天气信息
export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (error, data) => {
      if (!error && data.status === 'success') {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      }
      else
        message.error('获取天气出错')
    })
  })
}