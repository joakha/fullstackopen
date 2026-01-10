import axios from 'axios'

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(`${baseUrl}/api/blogs`)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.post(`${baseUrl}/api/blogs`, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.delete(`${baseUrl}/api/blogs/${blogId}`, config)
  return response.data;
}

const updateLikes = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/api/blogs/${id}`, newObject)
  return response.data
}

export default { getAll, create, updateLikes, setToken, update, deleteBlog }