import fs from 'fs';

fs.watch('./src', { recursive: true }, (event, filename) => {
    console.log('Changed:', filename);
});

console.log('Watching...');