export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_TOKEN = process.env.SUPABASE_ANON_KEY;

export const CAPTCHA_TOKEN = process.env.CAPTCHA_KEY;

export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
