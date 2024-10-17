import { SUPABASE_TOKEN, SUPABASE_URL } from "@/lib/constants";
import { Database } from "./db.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(SUPABASE_URL!, SUPABASE_TOKEN!);

export default supabase;
