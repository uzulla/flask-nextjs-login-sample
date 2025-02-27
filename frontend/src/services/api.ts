// API base URL
const API_URL = "http://localhost:5001/api";

// Interface for user data
export interface User {
  id: number;
  username: string;
}

// Interface for login response
export interface LoginResponse {
  msg: string;
  user: User;
}

// Interface for login/register credentials
export interface Credentials {
  username: string;
  password: string;
}

// Helper function for API requests
const apiRequest = async <T, D = Record<string, unknown>>(
  endpoint: string,
  method: string = "GET",
  data?: D
): Promise<T> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Important: This tells fetch to include cookies
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.msg || "Something went wrong");
  }

  return response.json();
};

// Authentication API calls
export const authAPI = {
  login: (credentials: Credentials): Promise<LoginResponse> =>
    apiRequest<LoginResponse, Credentials>("/login", "POST", credentials),

  logout: (): Promise<{ msg: string }> =>
    apiRequest<{ msg: string }>("/logout", "POST"),

  register: (credentials: Credentials): Promise<{ msg: string }> =>
    apiRequest<{ msg: string }, Credentials>("/register", "POST", credentials),

  getCurrentUser: (): Promise<User> => apiRequest<User>("/user"),
};

// Protected API calls
export const protectedAPI = {
  getProtectedData: (): Promise<{ msg: string; user_id: number }> =>
    apiRequest<{ msg: string; user_id: number }>("/protected"),
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await authAPI.getCurrentUser();
    return true;
  } catch {
    return false;
  }
};
