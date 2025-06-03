import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bkryvamhxqanjmmnojfk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcnl2YW1oeHFhbmptbW5vamZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI4NzA1OSwiZXhwIjoyMDYyODYzMDU5fQ.-4z9FRb-WZAG9VIX0Yz0-lIjzT_ROb-g-bCxT8A8JMU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);