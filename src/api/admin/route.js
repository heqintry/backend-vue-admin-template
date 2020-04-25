import request from '@/utils/request'

export default {
  index(data) {
    return request({
      url: '/admin/route/index',
      method: 'post',
      data
    })
  },
  create(data) {
    return request({
      url: '/admin/route/create',
      method: 'post',
      data
    })
  },
  assign(data) {
    return request({
      url: '/admin/route/assign',
      method: 'post',
      data
    })
  },
  remove(data) {
    return request({
      url: '/admin/route/remove',
      method: 'post',
      data
    })
  }
}
