import { Platform } from 'react-native';

const defaultBaseUrl = Platform.OS === 'android'
  ? 'http://10.0.2.2:8088'
  : 'http://localhost:8088';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || defaultBaseUrl
).replace(/\/$/, '');

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot connect to the payment service at ${API_BASE_URL}. Check that Docker is running and the API URL is reachable from this device.`
    );
  }

  const responseText = await response.text();
  let body: T | ApiErrorResponse | undefined;

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      throw new Error('The payment service returned an invalid response.');
    }
  }

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse | undefined;
    throw new Error(
      errorBody?.error || errorBody?.message || `Request failed (${response.status})`
    );
  }

  return body as T;
}
