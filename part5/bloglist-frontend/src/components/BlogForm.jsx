import blogService from '../services/blogs'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: ""
  })

  const addBlog = (e) => {
    e.preventDefault()
    createBlog(newBlog)
    setNewBlog({
      title: "",
      author: "",
      url: ""
    })
  }

  const handleChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title: <input name='title' onChange={handleChange} value={newBlog.title} />
      </div>

      <div>
        author: <input name='author' onChange={handleChange} value={newBlog.author} />
      </div>

      <div>
        url: <input name='url' onChange={handleChange} value={newBlog.url} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default BlogForm