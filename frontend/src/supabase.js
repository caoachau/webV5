import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example function to fetch data from a Supabase table
export async function fetchData(tableName) {
    try {
        const { data, error } = await supabase.from(tableName).select("*");
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error fetching data:", error.message);
        throw error;
    }
}

// Example function to insert data into a Supabase table
export async function insertData(tableName, payload) {
    try {
        const { data, error } = await supabase.from(tableName).insert(payload);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error inserting data:", error.message);
        throw error;
    }
}
