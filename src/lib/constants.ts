export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_TOKEN = process.env.SUPABASE_ANON_KEY;

export const CAPTCHA_TOKEN = process.env.CAPTCHA_KEY;

export const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;

export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

//5 minutes
export const IDLE_TIME = 300e3;

//1 year
export const AVATAR_EXPIRE = 31536000;

export const AVATAR_PLACEHOLDER =
  "https://ruldexrclzmlftgqotax.supabase.co/storage/v1/object/sign/profile_pics/private/placeholder.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9maWxlX3BpY3MvcHJpdmF0ZS9wbGFjZWhvbGRlci5qcGciLCJpYXQiOjE3MzIwMjk5NzQsImV4cCI6MjA0NzM4OTk3NH0.0DJTlthvmO-1s7WwQY-fR9C7O06laeGrRyoUEXyjfeI&t=2024-11-19T15%3A26%3A14.189Z";

export const PROFILE_POSTS_COUNT = 3;
