export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_TOKEN = process.env.SUPABASE_ANON_KEY;

export const CAPTCHA_TOKEN = process.env.CAPTCHA_KEY;

export const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

//5 minutes
export const IDLE_TIME = 300e3;

//1 year
export const AVATAR_EXPIRE = 31536000;

export const POST_AVATAR_PLACEHOLDER =
  "https://i.pinimg.com/564x/5a/54/9c/5a549ce90f0224fbc18d623126b7831b.jpg";
