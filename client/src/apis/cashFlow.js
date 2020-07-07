import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3333/api/v1'
});

export const getHeaders = (authToken) => {
  return {
    'Authorization': `Bearer ${ authToken }`,
    'Content-Type': 'application/json'
  };
};