export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const captchaToken = process.env.CAPTCHA_KEY;

export const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;

export const passwordRegEx =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
