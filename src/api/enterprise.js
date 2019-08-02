import request from '@/utils/request'


export function getEnterpriseList(query) {
    return request({
        url: '/webapi/datacenter/core/enterprise/list',
        method: 'get',
        params: query
    })
}
export function getPrefixList(query) {
    return request({
      url: '/webapi/datacenter/core/enterprise/prefix/list',
      method: 'get',
      params: query
    })
  }

  export function getCustomerlist(enterpriseId) {
    return request({
      url: '/webapi/datacenter/core/enterprise/customer/list',
      method: 'get',
      params: {enterpriseId: enterpriseId}
    })
  }

  export function getCustomerPrefixList(enterpriseCustomerId) {
    return request({
      url: '/webapi/datacenter/core/enterprise/customer/prefix/list',
      method: 'get',
      params: {enterpriseCustomerId: enterpriseCustomerId}
    })
  }
