const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('./list_helper')
const Blog = require('../models/blog')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of empty list is 0', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listHelper.blogs)
    assert.strictEqual(result, 48)
  })
})

test('most liked blog found correctly', () => {
  const result = listHelper.favoriteBlog(listHelper.blogs)
  assert.deepStrictEqual(result, listHelper.blogs[2])
})

test('default value for likes is 0', () => {
  const newBlog = new Blog({
    _id: '6b913bb82c67b987345e28a9',
    title: 'A Mathematical Theory of Communication',
    author: 'Claude E. Shannon',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    __v: 0
  })

  assert.strictEqual(newBlog.likes, 0);
})