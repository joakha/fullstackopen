const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

//jwt token for test cases
let token;

beforeEach(async () => {
  //reset blogs in database for each test
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.blogs)

  //reset user for each test case
  await User.deleteMany({ username: "testguy" })

  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({ _id: "64f1c2a9b8e7d45f9a12c3e4", username: 'testguy', passwordHash })

  await user.save()

  //login and get token for each test case
  const userInfo = {
    username: 'testguy',
    password: 'password123',
  }

  const credentials = await api
    .post('/api/login')
    .send(userInfo)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  token = credentials.body.token;
})

after(async () => {
  await mongoose.connection.close()
})

//GET
describe('get operations', () => {
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

  test('identifier field is id and not _id', async () => {
    const response = await api.get('/api/blogs')

    let isId = true;

    for (const blog of response.body) {
      if (blog.hasOwnProperty("_id")) {
        isId = false;
      }
      else if (blog.hasOwnProperty("id")) {
        isId = true;
      } else {
        isId = false;
      }
    }

    assert.strictEqual(isId, true)
  })
})

//POST
describe("post operations", () => {
  test('blog can be added', async () => {
    const toBeAddedBlog = {
      _id: '6b913bb82c67b987345e28a9',
      title: 'A Mathematical Theory of Communication',
      author: 'Claude E. Shannon',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 8,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(toBeAddedBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, listHelper.blogs.length + 1);
  })

  test('posted blog must have url field', async () => {
    const toBeAddedBlog = {
      _id: '6b913bb82a67b987345e28a9',
      title: 'A Mathematical Theory of Communication',
      author: 'Claude E. Shannon',
      likes: 8,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(toBeAddedBlog)
      .expect(400)
  })

  test('posted blog must have title field', async () => {
    const toBeAddedBlog = {
      _id: '6b913bb82b67b987345e28a9',
      author: 'Claude E. Shannon',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 8,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(toBeAddedBlog)
      .expect(400)
  })

  test('blog can be added only with token', async () => {
    const toBeAddedBlog = {
      _id: '6b913bb82c67b987345e28a9',
      title: 'A Mathematical Theory of Communication',
      author: 'Claude E. Shannon',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 8,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(toBeAddedBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ error: "token missing or invalid" });
  })
})

//DELETE
describe("delete operations", () => {
  test('can delete blog', async () => {
    const blogId = "5a422b3a1b546676234d17f9";

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('attempting to delete nonexisting blog returns 404', async () => {
    const blogId = '6b913bb82c67b987345e28a9';

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})

//PUT
describe("put operations", () => {
  test('can update blog', async () => {
    const blogId = "5a422b3a1b546676234d17f9"

    const blogUpdate = {
      title: "high liked blog",
      author: "johnny johnson",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 14,
    }

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send(blogUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 14);
  })

  test('nonexistent blog not found when trying to update', async () => {
    const blogId = "5a422b3b1b546676234d17f9"

    const blogUpdate = {
      title: "high liked blog",
      author: "johnny johnson",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 14,
    }

    await api
      .put(`/api/blogs/${blogId}`)
      .send(blogUpdate)
      .expect(404)
  })
})
