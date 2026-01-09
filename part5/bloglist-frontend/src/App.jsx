import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password })
      setNotification({ message: "login successful", type: "success" })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch {
      setNotification({ message: "wrong credentials", type: "failure" })
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('loggedBlogAppUser')
    setNotification({ message: "logged out", type: "success" })
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const postedBlog = await blogService.create(newBlog);
      const newBlogs = blogs.concat(postedBlog);
      setBlogs(newBlogs);
      setNotification({ message: `Added ${postedBlog.title}`, type: "success" });
    } catch (err) {
      console.log(err);
      setNotification({ message: err.response.data.message, type: "failure" });
    }
  }

  const updateBlogLikes = async (id, blogData) => {
    try {
      const updatedBlog = await blogService.updateLikes(id, blogData);
      const newBlogs = blogs.map((blog) => {
        return blog.id === updatedBlog.id ? updatedBlog : blog;
      })
      setBlogs(newBlogs);
      setNotification({ message: `Updated likes for ${updatedBlog.title}`, type: "success" });
    } catch (err) {
      console.log(err);
      setNotification({ message: err.response.data.message, type: "failure" });
    }
  }

  return (
    <>
      <div>
        <h1>{user ? "blogs" : "login to app"}</h1>
        {notification &&
          <Notification
            notification={notification}
            setNotification={setNotification}
          />
        }

        {user &&
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2>{user.name} logged in</h2>
            <button onClick={handleLogout}>logout</button>
          </div>}

        {!user &&
          <Togglable buttonLabel="login">
            <LoginForm
              handleLogin={handleLogin}
            />
          </Togglable>}

        {user &&
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>}
      </div>

      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlogLikes={updateBlogLikes}
          />
        )}
      </div>
    </>
  )
}

export default App