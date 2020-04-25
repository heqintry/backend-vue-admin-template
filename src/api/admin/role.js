import request from '@/utils/request'

export default {
  index(data) {
    return request({
      url: '/admin/role/index',
      method: 'post',
      data
    })
  },
  view(id) {
    return request({
      url: '/admin/role/view',
      method: 'get',
      params: {
        id
      }
    })
  },
  create(data) {
    return request({
      url: '/admin/role/create',
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: '/admin/role/update',
      method: 'post',
      params: {
        id
      },
      data
    })
  },
  delete(id) {
    return request({
      url: '/admin/role/delete',
      method: 'post',
      params: {
        id
      },
    })
  },
  assign(id, data) {
    return request({
      url: '/admin/role/assign',
      method: 'post',
      params: {
        id
      },
      data
    })
  },
  remove(id, data) {
    return request({
      url: '/admin/role/remove',
      method: 'post',
      params: {
        id
      },
      data
    })
  }
}
