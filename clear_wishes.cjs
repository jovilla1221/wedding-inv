require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('wishes').delete().neq('id', 0)
  .then(res => console.log('Deleted:', res))
  .catch(err => console.error('Error:', err));
