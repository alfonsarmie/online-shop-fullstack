import api from './api';

export interface PasswordResetResponse {
  message: string;
}

/**
 * Request a password reset link for the provided email address.
 */
export async function requestPasswordReset(email: string): Promise<PasswordResetResponse> {
  const response = await api.post<PasswordResetResponse>('/users/reset-password', { email });
  return response.data;
}

/**
 * Update the forgotten password using the reset token from the email.
 */
export async function submitNewPassword(token: string, newPassword: string): Promise<PasswordResetResponse> {
  const response = await api.put<PasswordResetResponse>(`/users/reset/${token}`, { newPassword });
  return response.data;
}

