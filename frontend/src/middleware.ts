// Note: We're not using middleware for authentication since we're using cookie-based sessions
// Instead, we're handling authentication in the client components using the AuthContext

export const config = {
  matcher: [], // Empty matcher since we're not using middleware for auth
};
