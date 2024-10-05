import { supabaseKey, supabaseUrl } from "@/constants";
import { Database } from "./db.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);

export default supabase;
