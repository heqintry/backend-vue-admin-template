import request from '@/utils/request'

export default {
  index(data) {
    return request({
      url: '/admin/assignment/index',
      method: 'post',
      data
    })
  },
  view(id) {
    return request({
      url: '/admin/assignment/view',
      method: 'get',
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
