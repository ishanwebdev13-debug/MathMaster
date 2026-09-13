export const SUPABASE_URL = "https://dbhbdijmdimzromvmpju.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiaGJkaWptZGltenJvbXZtcGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MTM2NjksImV4cCI6MjEwNDM4OTY2OX0.wgRxBi7xFDfpPWUdZGTAkpWcARALxZuysSxoml4OPRc";

export const EDGE_FUNCTION_URL = (name: string) =>
  `${SUPABASE_URL}/functions/v1/${name}`;