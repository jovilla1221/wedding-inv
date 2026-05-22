import { createClient } from "@supabase/supabase-js";

// Menggunakan URL project yang Anda berikan
const supabaseUrl = "https://rjqcbptashsatomrstfh.supabase.co";

// Penting: Kunci yang Anda berikan (sb_secret_...) adalah Secret Key (Service Role),
// yang sangat berbahaya jika dipasang di sisi klien (frontend). 
// Untuk frontend, kita wajib menggunakan "anon" / "public" key.
// Anda bisa menemukannya di dashboard Supabase: Project Settings -> API -> Project API keys -> anon public.
// Pastikan Anda menaruh key tersebut di file .env dengan nama VITE_SUPABASE_ANON_KEY
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "TARUH_ANON_KEY_ANDA_DISINI";

export const supabase = createClient(supabaseUrl, supabaseKey);
