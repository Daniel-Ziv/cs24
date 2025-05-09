import { supabase } from './supabase';

export const fetchAvatar = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  // This is where the avatar is stored
  return user?.user_metadata?.avatar_url || null;
}; 