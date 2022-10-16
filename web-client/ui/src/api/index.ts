import request from './request'
import { IExpressData } from './type'

export const getList = () =>
  request<IExpressData>('get', '/query', {
    type: 'asai',
    postid: 'wwwasaicc'
  })
