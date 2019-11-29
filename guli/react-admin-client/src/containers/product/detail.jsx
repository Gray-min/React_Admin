import React, { useCallback, useState, useEffect } from 'react'
import { List, Icon, Card } from 'antd'

import { reqCategoryInfo } from '../../api'
import { BASEIMGURL } from '../../utils/constant'

export default function ProductDetail (props) {
  const [cName1, setCName1] = useState()
  const [cName2, setCName2] = useState()
  const title = (<span>
    <Icon type='arrow-left'
      style={{ margin: '0 10px', color: 'green', fontSize: 20 }}
      onClick={() => props.history.goBack()}
    ></Icon>商品详情</span>)
  const { name, desc, price, detail, imgs } = props.location.state

  const getCategoryInfo = useCallback(async () => {
    const { pCategoryId, categoryId } = props.location.state
    if (pCategoryId * 1 === 0) {
      const result = await reqCategoryInfo(categoryId)
      if (!result.stauts)
        setCName1(result.data.name)
    }
    else {
      const results = await Promise.all([reqCategoryInfo(pCategoryId), reqCategoryInfo(categoryId)])
      const [cn1, cn2] = results
      setCName1(cn1.data.name)
      setCName2(cn2.data.name)
      // console.log(cn1, cn2)
    }
  }, [props.location.state])

  useEffect(() => {
    getCategoryInfo()
  }, [getCategoryInfo])
  return <>
    <Card title={title} className='product-detail'>
      <List>
        <List.Item>
          <span className='left'>商品名称：</span>
          <span>{name}</span>
        </List.Item>
        <List.Item>
          <span className='left'>商品描述：</span>
          <span>{desc}</span>
        </List.Item>
        <List.Item>
          <span className='left'>商品价格：</span>
          <span>{'￥' + price}</span>
        </List.Item>
        <List.Item>
          <span className='left'>所属分类：</span>
          <span>{cName2 ? cName1 + '-- >' + cName2 : cName2}</span>
        </List.Item>
        <List.Item>
          <span className='left'>商品图片：</span>
          <span>
            {imgs.map((img) => <img key={img} className="product-img" src={BASEIMGURL + img} alt={img} />)}
          </span>
        </List.Item>
        <List.Item>
          <span className='left'>商品详情：</span>
          <span dangerouslySetInnerHTML={{ __html: detail }}></span>
        </List.Item>
      </List>
    </Card>
  </>
}