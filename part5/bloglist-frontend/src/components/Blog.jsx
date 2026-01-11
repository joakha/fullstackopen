import { useState } from "react"

const Blog = ({ blog, updateBlogLikes, user, deleteBlog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false);

  const likeBlog = () => {
    const updatedBlogData = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }

    updateBlogLikes(blog.id, updatedBlogData);
  }

  const removeBlog = () => {
    deleteBlog(blog);
  }

  return (
    <div style={blogStyle}>
      <span>{blog.title} by {blog.author}</span>
      <span>
        <button onClick={() => setVisible(!visible)}>{visible ? "hide" : "view"}</button>
      </span>
      <div style={{ display: visible ? '' : 'none' }}>
        <p>{blog.url}</p>
        <p>
          <span>
            likes: {blog.likes}
          </span>
          <span>
            <button onClick={likeBlog}>like</button>
          </span>
        </p>
        <p>{blog.user && blog.user.name}</p>
        {user && blog.user && blog.user.name === user.name &&
          <button onClick={removeBlog}>remove</button>}
      </div>
    </div>
  )
}

export default Blog