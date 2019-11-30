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

//获取商品分页列表
export const reqProductList = ({ pageNum, pageSize }) => ajax('/manage/product/list', { pageNum, pageSize })

//根据ID/Name搜索产品分页列表
export const reqSearchProducts = ({ pageNum, pageSize, searchType, searchName }) => ajax('/manage/product/search', { pageNum, pageSize, [searchType]: searchName })

//根据分类ID获取分类
export const reqCategoryInfo = (categoryId) => ajax('/manage/category/info', { categoryId })

//对商品进行上架/下架处理
export const reqUpdateStatus = ({ productId, status }) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')

//删除图片
export const reqImgDelete = (name) => ajax('/manage/img/delete', { name }, 'POST')

//添加或删除商品
export const reqAddOrUpdate = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//获取角色列表
export const reqRoleList = () => ajax('/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', roleName, 'POST')

//更新角色(给角色设置权限)
export const reqUpdateRole = ({ _id, menus, auth_time, auth_name }) => ajax('/manage/role/update', { _id, menus, auth_time, auth_name }, 'POST')

//获取用户列表
export const reqUserList = () => ajax('/manage/user/list')

//添加或更新用户
export const reqAddOrUpdateUser = (user) => ajax(`/manage/user/${user._id ? 'update' : 'add'}`, user, 'POST')

//删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST')

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