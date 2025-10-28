import api from './api';

export interface PasswordResetResponse {
  message: string;
}


export async function requestPasswordReset(email: string): Promise<PasswordResetResponse> {
  const response = await api.post<PasswordResetResponse>('/users/reset-password', { email });
  return response.data;
}


export async function submitNewPassword(token: string, newPassword: string): Promise<PasswordResetResponse> {
  const response = await api.put<PasswordResetResponse>(`/users/reset/${token}`, { newPassword });
  return response.data;
}

