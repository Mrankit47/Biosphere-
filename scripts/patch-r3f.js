const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'node_modules', '@react-three', 'fiber', 'dist');

if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  let patchedCount = 0;
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(distDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('connect: target => {') && !content.includes('if (!target) return;')) {
        content = content.replace(
          'connect: target => {',
          'connect: target => {\n      if (!target) return;'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully patched R3F events in: ${file}`);
        patchedCount++;
      }
    }
  });
  console.log(`React Three Fiber patching completed. Patched ${patchedCount} file(s).`);
} else {
  console.warn(`R3F dist directory not found at: ${distDir}`);
}
