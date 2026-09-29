
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgPath = 'C:/Users/DELL/.gemini/antigravity/brain/b9882924-db6a-4e0f-b74c-dacb7c01b67c/.user_uploaded/media_1790709887545.jpg';
const outDir = 'C:/Users/DELL/Downloads/riya tarot crystals website/public/images/products';

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const names = [
    'dhan-yog.jpg', 'love-peace-metal.jpg', 'love-money-metal.jpg',
    'citrine.jpg', 'raw-pyrite.jpg', 'tiger-eye-flat.jpg',
    'love-attraction.jpg', 'money-maker.jpg', 'amethyst.jpg',
    'metal-raw-pyrite.jpg', 'turquoise.jpg', 'wealth-om.jpg',
    'rudraksha.jpg', 'tiger-eye-celeb.jpg', 'black-obsidian.jpg'
];

async function slice() {
    const metadata = await sharp(imgPath).metadata();
    const cellWidth = Math.floor(metadata.width / 3);
    const cellHeight = Math.floor(metadata.height / 5);

    let idx = 0;
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
            const left = col * cellWidth;
            const top = row * cellHeight;
            
            await sharp(imgPath)
                .extract({ left, top, width: cellWidth, height: cellHeight })
                .toFile(path.join(outDir, names[idx]));
            idx++;
        }
    }
    console.log('Done slicing!');
}

slice().catch(console.error);

