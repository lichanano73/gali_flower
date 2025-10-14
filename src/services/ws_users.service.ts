import axios, { AxiosError } from 'axios';
import config from '../config/config';

function createHeader() {
  return {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  };
}

interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    first_name: string;
    [k: string]: unknown;
  };
}

export const userLoginService = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const url = `${config.url_ws_users}/auth`;
    
    const { data } = await axios.post<LoginResponse>(
      url, { email, password },{ headers: createHeader() }
    );

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;
    // Propaga un error más informativo
    const status = error.response?.status;
    const payload = error.response?.data;
    console.error('Login service failed', { status, payload, message: error.message });
    throw new Error(payload?.error ?? `Login service failed${status ? ` (HTTP ${status})` : ''}`);
  }
};