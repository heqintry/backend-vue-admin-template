import request from '@/utils/request'

export default {
  index(data) {
    return request({
      url: '/admin/rule/index',
      method: 'get',
      data
    })
  },
  view(id) {
    return request({
      url: '/admin/rule/view',
      method: 'get',
      params: {
        id
      }
    })
  },
  create(data) {
    return request({
      url: '/admin/rule/create',
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: '/admin/rule/update',
      method: 'post',
      params: {
        id
      },
      data
    })
  },
  delete(id) {
    return request({
      url: '/admin/rule/delete',
      method: 'post',
      params: {
        id
      },
    })
  }
}
