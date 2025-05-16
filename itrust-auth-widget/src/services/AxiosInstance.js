/*
 Copyright 2024 CVS Health and/or one of its affiliates

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import axios from 'axios';
import { API_GATEWAY } from '../constants';

const axiosInstance = axios.create({
  baseURL: API_GATEWAY,
});

// Request interceptor to add the auth token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.url !== '/das/api/v1/anon/token') {
      const token = await getAnonymousToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);




let cachedToken = null;
let tokenExpiry = null; // in milliseconds since epoch
const TOKEN_TTL_BUFFER = 60 * 1000; // 1-minute safety buffer

// Decode JWT and extract the expiry
function getExpiryFromJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    const { exp } = JSON.parse(jsonPayload);
    return exp * 1000; // Convert to ms
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

export const getAnonymousToken = async () => {
  const now = Date.now();

  if (
    cachedToken &&
    tokenExpiry &&
    now < tokenExpiry - TOKEN_TTL_BUFFER
  ) {
    // console.log('[Auth] Using cached anonymous token');
    return cachedToken;
  }

  try {
    // console.log('[Auth] Fetching new anonymous token');
    const response = await axios.get(`${API_GATEWAY}/das/api/v1/anon/token`);

    if (response.status !== 200 || !response.data?.data) {
      throw new Error('Failed to fetch anonymous token');
    }

    const token = response.data?.data;
    const expiry = getExpiryFromJWT(token);

    if (!expiry) {
      throw new Error('Token expiry not found in JWT');
    }

    cachedToken = token;
    tokenExpiry = expiry;

    return cachedToken;
  } catch (error) {
    console.error('[Auth] Error fetching anonymous token:', error);
    throw error;
  }
};


export default axiosInstance;
