import request from '@/utils/request.js'
export function apiComment ({ articleID, commentID }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'get',
    params: {
      type: 'a',
      source: articleID,
      offset: commentID,
      limit: 10
    }
  })
}
