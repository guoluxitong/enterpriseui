import request from '@/utils/request'
import qs from 'qs'
export function getDeviceList(query) {
  return request({
    url: '/webapi/datacenter/core/device/list',
    method: 'get',
    params: query
  })
}

export function getDeviceListByEnterpriseId(enterpriseId) {
  return request({
    url: '/webapi/datacenter/core/device/list/enterprise',
    method: 'get',
    params: {enterpriseId:enterpriseId }
  })
}
export function getDeviceListBySuffix(query) {
  return request({
    url: '/webapi/datacenter/core/device/fix/suffix',
    method: 'get',
    params:{suffix:query}
  })
}
export function getDeviceListBycustom(query) {
  return request({
    url: '/webapi/datacenter/core/device/list/suffix5',
    method: 'get',
    params:{suffix5:query}
  })
}

