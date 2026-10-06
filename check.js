const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://roztuxxxfmvdfvqjdopo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvenR1eHh4Zm12ZGZ2cWpkb3BvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTAzNTQ2NCwiZXhwIjoyMTA2NjExNDY0fQ.6CAo9i2GUJp0Eb1XWKd7398aAYbMrLUw-7U6vnO_TYk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('*').eq('id', 'love-attraction');
  console.log(data);
}

run();
