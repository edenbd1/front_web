import config from '../config.js';

const API_BASE_URL = config.apiBaseURL;

/**
 * @param {string} url
 * @param {any} data
 * @param {string | null} [token]
 * @returns {Promise<any>}
 */
export async function postJSON(url, data, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || `HTTP error! Status: ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData;
}

/**
 * @param {string} url
 * @param {string | null} [token]
 * @returns {Promise<any>}
 */
export async function getJSON(url, token = null) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'GET',
    headers,
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || `HTTP error! Status: ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData;
}

/**
 * @param {string} url
 * @param {any} data
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function putJSON(url, data, token) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || `HTTP error! Status: ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData;
}

/**
 * @param {string} url
 * @param {string} token
 * @returns {Promise<any>}
 */
export async function deleteJSON(url, token) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error = new Error(responseData.message || `HTTP error! Status: ${response.status}`);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData;
}