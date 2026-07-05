const fs = require("fs");
const path = require("path");

const HDR_DIR = path.join(__dirname, "..", "public", "hdr");

if (!fs.existsSync(HDR_DIR)) {
  fs.mkdirSync(HDR_DIR, { recursive: true });
}

const HDR_FILES = {
  "forest_slope_1k.hdr": "https://raw.githubusercontent.com/pmndrs/drei-assets/master/hdri/forest_slope_1k.hdr",
  "venice_sunset_1k.hdr": "https://raw.githubusercontent.com/pmndrs/drei-assets/master/hdri/venice_sunset_1k.hdr",
  "potsdamer_platz_1k.hdr": "https://raw.githubusercontent.com/pmndrs/drei-assets/master/hdri/potsdamer_platz_1k.hdr",
  "dikhololo_night_1k.hdr": "https://raw.githubusercontent.com/pmndrs/drei-assets/master/hdri/dikhololo_night_1k.hdr"
};

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
};

async function downloadHdr(name, url) {
  const destPath = path.join(HDR_DIR, name);
  if (fs.existsSync(destPath)) {
    console.log(`File already exists: ${name}, skipping.`);
    return true;
  }
  console.log(`Downloading ${name} from ${url}...`);
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    console.log(`✓ Successfully downloaded ${name}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to download ${name}:`, error.message);
    return false;
  }
}

async function main() {
  for (const [name, url] of Object.entries(HDR_FILES)) {
    await downloadHdr(name, url);
  }
  console.log("Done downloading HDR presets.");
}

main();
