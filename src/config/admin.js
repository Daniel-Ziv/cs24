// Admin configuration
// In production, these should ideally come from environment variables
export const ADMIN_EMAILS = [
  process.env.REACT_APP_ADMIN_EMAIL_1 

].filter(Boolean); // Filter out undefined values

export const isAdmin = (userEmail) => {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail);
}; 