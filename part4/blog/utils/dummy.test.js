const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('./list_helper')

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

describe("most liked blog", () => {
  test('found correctly', () => {
    const result = listHelper.favoriteBlog(listHelper.blogs)
    assert.deepStrictEqual(result, listHelper.blogs[2])
  })
})
