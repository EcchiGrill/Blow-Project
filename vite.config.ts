import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

type processEnvType = { [key: string]: string };

const cherryPickedKeys = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "CAPTCHA_KEY",
  "CLOUDINARY_KEY",
];

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const processEnv: processEnvType = {};
  cherryPickedKeys.forEach((key: string) => (processEnv[key] = env[key]));

  return defineConfig({
    plugins: [react()],
    define: {
      "process.env": processEnv,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};
