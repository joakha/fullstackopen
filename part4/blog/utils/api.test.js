const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const listHelper = require('./list_helper')
const supertest = require('supertest')
const Blog = require('../models/blog')
const mongoose = require('mongoose')

const api = supertest(app)

describe('api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(listHelper.blogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct blog amount is returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, listHelper.blogs.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
