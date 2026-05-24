import { createClient } from "@supabase/supabase-js";
import ws from "ws";

// Menggunakan URL project yang Anda berikan
const supabaseUrl = "https://rjqcbptashsatomrstfh.supabase.co";

// Anon key aman digunakan di client maupun server (public, dilindungi RLS).
// Pada SSR (TanStack Start), import.meta.env.VITE_* hanya tersedia di client.
// Oleh karena itu, kita hardcode anon key sebagai fallback agar SSR juga bisa akses Supabase.
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqcWNicHRhc2hzYXRvbXJzdGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTY0NTUsImV4cCI6MjA5NTAzMjQ1NX0.z1A1_Nmgkd35Q6YCh6jsR4Qa5vVpcUJemZsCgh9PT0M";

const supabaseKey =
  (typeof import.meta.env !== "undefined" && import.meta.env.VITE_SUPABASE_ANON_KEY) || ANON_KEY;

const isServer = typeof window === "undefined";
const options = isServer
  ? {
      auth: { persistSession: false },
      realtime: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transport: ws as any,
      },
    }
  : {};

export const supabase = createClient(supabaseUrl, supabaseKey, options);
