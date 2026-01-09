import { useState } from "react"

const Blog = ({ blog, updateBlogLikes }) => {

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
        <p>{blog.user.name}</p>
      </div>
    </div>
  )
}

export default Blog