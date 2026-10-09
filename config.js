// Paste the two values from Supabase -> Project Settings -> API.
// These are safe to be public: the database rules (RLS) protect your data.
window.APP_CONFIG = {
  SUPABASE_URL: '',       // e.g. https://abcdxyz.supabase.co
  SUPABASE_ANON_KEY: ''   // the "anon" / "publishable" key (NOT service_role)
};
