import request from '@/utils/request'

export default {
  index(data) {
    return request({
      url: '/admin/permission/index',
      method: 'get',
      data
    })
  },
  view(id) {
    return request({
      url: '/admin/permission/view',
      method: 'get',
      params: {
        id
      }
    })
  },
  create(data) {
    return request({
      url: '/admin/permission/create',
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: '/admin/permission/update',
      method: 'post',
      params: {
        id
      },
      data
    })
  },
  delete(id) {
    return request({
      url: '/admin/permission/delete',
      method: 'post',
      params: {
        id
      },
    })
  },
  assign(id, data) {
    return request({
      url: '/admin/permission/assign',
      method: 'post',
      params: {
        id
      },
      data
    })
  },
  remove(id, data) {
    return request({
      url: '/admin/permission/remove',
      method: 'post',
      params: {
        id
      },
      data
    })
  }
}
