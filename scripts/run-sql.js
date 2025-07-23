import fetch from "node-fetch";
import fs from "fs";

const sql = fs.readFileSync("supabase/sql/populate_user_vectors.sql", "utf8");

const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: "POST",
  headers: {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

console.log("SQL executed successfully");
