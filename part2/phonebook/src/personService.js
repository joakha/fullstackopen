import axios from "axios"

const baseURL = "http://localhost:3001/persons"

const getAll = async () => {
    const response = await axios.get(baseURL);
    return response.data;
}

const postPerson = async (person) => {
    const response = await axios.post(baseURL, person);
    return response.data;
}

const deletePerson = async (personId) => {
    const response = await axios.delete(`${baseURL}/${personId}`)
    return response.data;
}

const updateNumber = async (personId, newData) => {
    const response = await axios.patch(`${baseURL}/${personId}`, newData)
    return response.data;
}

export default {
    getAll,
    postPerson,
    deletePerson,
    updateNumber
}