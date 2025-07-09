import axios from "axios"

const baseURL = import.meta.env.VITE_BACKEND_URL || "";

const getAll = async () => {
    const response = await axios.get(`${baseURL}/api/persons`);
    return response.data;
}

const postPerson = async (person) => {
    const response = await axios.post(`${baseURL}/api/persons`, person);
    return response.data;
}

const deletePerson = async (personId) => {
    const response = await axios.delete(`${baseURL}/api/persons/${personId}`)
    return response.data;
}

const updateNumber = async (personId, newData) => {
    const response = await axios.patch(`${baseURL}/api/persons/${personId}`, newData)
    return response.data;
}

export default {
    getAll,
    postPerson,
    deletePerson,
    updateNumber
}