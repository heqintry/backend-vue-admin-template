import request from '@/utils/request'

export default {
  index(data) {
    return request({
      url: '/article/index',
      method: 'get',
      data
    })
  },
  update(id, data) {
    return request({
      url: '/article/update',
      method: 'post',
      params: {
        id
      },
      data
    })
  },
  delete(id) {
    return request({
      url: '/article/delete',
      method: 'post',
      params: {
        id
      }
    })
  },
  publish(id) {
    return request({
      url: '/article/publish',
      method: 'post',
      params: {
        id
      }
    })
  },
  draft(id) {
    return request({
      url: '/article/draft',
      method: 'post',
      params: {
        id
      }
    })
  },
}
