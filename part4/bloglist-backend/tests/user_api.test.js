const { test, describe, after, beforeEach } = require('node:test')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')

beforeEach(async () => {
  await User.deleteMany({ username: "root" });

  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

after(async () => {
  await mongoose.connection.close()
})

describe("when creating a new user", () => {
  test("creation fails with missing password or username", async () => {
    const userMissingUsername = {
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(userMissingUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: "username or password missing from request" });

    const userMissingPassword = {
      username: "testuser",
    }

    await api
      .post('/api/users')
      .send(userMissingPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: "username or password missing from request" });
  })

  test("creation fails with username or password that have less than 3 characters"), async () => {
    const shortPasswordUser = {
      username: "testuser",
      password: 'sa',
    }

    await api
      .post('/api/users')
      .send(shortPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: "username and password must be at least 3 characters long" });

    const shortUsernameUser = {
      username: "te",
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(shortUsernameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: "username and password must be at least 3 characters long" });
  }

  test("username must be unique", async () => {
    const replicatedUser = {
      username: "root",
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(replicatedUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: "expected `username` to be unique" });
  })
})
