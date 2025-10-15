import axios, { AxiosError } from 'axios';
import config from '../config/config';
import { HttpError, QueryParams} from '../types';
import { LoginResponse } from '../types';

function createHeader(token?: string ) {
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`,
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  };
}

export const getUsersService = async ( token: string, query: QueryParams): Promise<[]> => {
  try {
    const url = `${config.url_ws_users}/users`;

    // Solo incluye params definidos
    const params: Record<string, string | number> = {
      page:   query.page,
      limit:  query.limit,
      ...(query.email ? { email: query.email } : {}),
    };

    const { data } = await axios.get<[]>(url, {
      headers: createHeader(token),
      params,
    });

    return data;
  } catch (err) {
    const error = err as AxiosError<any>;

    const status  = error.response?.status ?? 500;
    const payload = error.response?.data;
    
    throw new HttpError(payload.error.message, status, payload.error);
  }
};



export const userLoginService = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const url = `${config.url_ws_users}/auth`;
    
    const { data } = await axios.post<LoginResponse>(
      url, { email, password },{ headers: createHeader() }
    );

    return data;
  } catch (err) {

    const error = err as AxiosError<any>;

    const status  = error.response?.status ?? 500;
    const payload = error.response?.data;
    
    throw new HttpError(payload.error.message, status, payload.error);
  }
};



export const verifyTokenService = async (token: string): Promise<{ id: string; email: string }> => {
  try {
    const url = `${config.url_ws_users}/auth/ws_verifytoken`;

    const { data } = await axios.get<{ id: string; email: string }>(url, {
      headers: createHeader(token),
    });
    
    return data;
  } catch (err) {

    const error = err as AxiosError<any>; 
    const status  = error.response?.status ?? 500;
    const payload = error.response?.data;

    throw new HttpError(payload.error.message, status, payload.error);
  }
}