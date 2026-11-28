import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://nzwxnzspqzligkvxktfi.supabase.co';
const SUPABASE_KEY = 'sb_publishable__wdgrFZsqts8-dZGvgCyvw_1_eIP1hA';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);