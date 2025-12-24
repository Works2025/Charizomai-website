
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("Fetching one row from 'causes'...");
  const { data, error } = await supabase
    .from('causes')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("Row keys:", Object.keys(data[0]));
    console.log("Sample Data:", data[0]);
  } else {
    console.log("Table 'causes' is empty or inaccessible.");
  }
}

checkSchema();
