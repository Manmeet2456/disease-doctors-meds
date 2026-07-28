import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://bnpupkspjryagzucoftn.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucHVwa3NwanJ5YWd6dWNvZnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTU1MjcsImV4cCI6MjA2MDQ5MTUyN30.aCR-RtQnUGcyYqa3duNAMGwZ3Qizai1nZln6k7pKM-8'),
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify('bnpupkspjryagzucoftn'),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
