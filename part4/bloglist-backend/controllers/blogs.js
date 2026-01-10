const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body.hasOwnProperty("url") || !request.body.hasOwnProperty("title")) {
    return response.status(400).end()
  }

  const user = request.user;

  request.body.user = user;

  const blog = new Blog(request.body)

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user;

  const toBeDeletedBlog = await Blog.findById(request.params.id);

  if (!toBeDeletedBlog) {
    return response.status(404).end();
  }

  if (user._id.toString() !== toBeDeletedBlog.user.toString()) {
    return response.status(400).json({ error: 'userId not valid' })
  }

  const deletedBlog = await Blog.findByIdAndDelete({ _id: request.params.id });

  user.blogs = user.blogs.filter(
    blogId => blogId.toString() !== request.params.id
  );

  await user.save();

  response.status(200).json(deletedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const savedBlog = await blog.save()
  response.status(200).json(savedBlog)
})

module.exports = blogsRouter