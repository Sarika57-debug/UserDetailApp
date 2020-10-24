const axios = require('axios');

//method used for api call
export async function apiCall(url, method) {

  return axios
    .request({
      url: url,
      method,
    })
    .then((response) => {
      return response.data;
    })
}