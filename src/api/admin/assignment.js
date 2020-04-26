import request from '@/utils/request'

export default {
  index(data) {
    return request({
      url: '/admin/assignment/index',
      method: 'get',
      data
    })
  },
  view(id) {
    return request({
      url: '/admin/assignment/view',
      method: 'post',
      params: {
        id
      }
    })
  },
  assign(id, data) {
    return request({
      url: '/admin/assignment/assign',
      method: 'post',
      params: {
        id
      },
      data
    })
  },
  revoke(id, data) {
    return request({
      url: '/admin/assignment/revoke',
      method: 'post',
      params: {
        id
      },
      data
    })
  }
}
