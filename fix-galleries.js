const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixGalleries() {
  const updates = [
    {
      id: 'citrine',
      gallery: [
        '/images/products/citrine-main.jpg',
        '/images/products/citrine-1.jpg',
        '/images/products/citrine-2.jpg',
        '/images/products/citrine-v2.jpg'
      ]
    },
    {
      id: 'tiger-eye-celeb',
      gallery: [
        '/images/products/tiger-eye-main.jpg',
        '/images/products/tiger-eye-1.jpg',
        '/images/products/tiger-eye-2.jpg',
        '/images/products/tiger-eye-celeb-v2.jpg'
      ]
    },
    {
      id: 'love-attraction',
      gallery: [
        '/images/products/love-attraction-main.jpg',
        '/images/products/love-attraction-1.jpg',
        '/images/products/love-attraction-2.jpg',
        '/images/products/love-attraction-v2.jpg'
      ]
    },
    {
      id: 'red-carnelian',
      gallery: [
        '/images/products/red-carnelian-main.jpg',
        '/images/products/red-carnelian-1.jpg',
        '/images/products/red-carnelian-2.jpg',
        '/images/products/red-carnelian-v2.jpg'
      ]
    },
    {
      id: 'turquoise',
      gallery: [
        '/images/products/turquoise-main.jpg',
        '/images/products/turquoise-1.jpg',
        '/images/products/turquoise-2.jpg',
        '/images/products/turquoise-v2.jpg'
      ]
    },
    {
      id: 'dhan-yog',
      gallery: [
        '/images/products/dhan-yog-main.jpg',
        '/images/products/dhan-yog-1.jpg',
        '/images/products/dhan-yog-2.jpg',
        '/images/products/dhan-yog-v2.jpg'
      ]
    }
  ];

  for (const p of updates) {
    const { error } = await supabase
      .from('products')
      .update({ gallery: p.gallery })
      .eq('id', p.id);
    
    if (error) console.error(`Error updating ${p.id}:`, error);
    else console.log(`Updated ${p.id}`);
  }
}

fixGalleries();
