require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Testing connection to:', supabaseUrl);
// console.log('Using key:', supabaseKey); // Don't log full key

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // Try to select from a table we know exists (or should exist)
        // using 'count' to be lightweight. 
        // If table doesn't exist, it will throw error, which confirms connection at least hit the server.
        const { data, error } = await supabase
            .from('programs') // Table I created in SQL schema
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Connection Error:', error.message);
            console.error('Full Error:', error);
        } else {
            console.log('✅ Connection Successful!');
            console.log('Accessed "programs" table.');
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

testConnection();
