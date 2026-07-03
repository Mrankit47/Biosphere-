const fs = require("fs");
const path = require("path");

const SPECIES_FILE = path.join(__dirname, "..", "src", "app", "rare-species", "_data", "species.ts");
const IMAGES_DIR = path.join(__dirname, "..", "public", "species-images");

// Create public/species-images directory if it doesn't exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// 17 hand-crafted species that already have high-quality transparent PNGs. Do NOT overwrite.
const PRESERVED_SPECIES = new Set([
  "vaquita", "amur-leopard", "sumatran-rhino", "pangolin", "saola",
  "javan-rhino", "snow-leopard", "red-panda", "okapi", "saiga-antelope",
  "axolotl", "narwhal", "black-footed-ferret", "iberian-lynx",
  "pygmy-sloth", "ethiopian-wolf", "northern-hairy-nosed-wombat"
]);

const HEADERS = {
  "User-Agent": "BiosphereConservationProject/1.0 (contact: admin@biosphereproject.org; build: dynamic-downloader) Node/18+"
};

async function fetchWikiImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=512&redirects=1&origin=*`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      console.error(`  API error: HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    const pages = json.query?.pages;
    if (!pages) return null;
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;
    return pages[pageId]?.thumbnail?.source || null;
  } catch (error) {
    console.error(`Error fetching Wikipedia image for title "${title}":`, error.message);
    return null;
  }
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error.message);
    return false;
  }
}

async function main() {
  console.log("Reading species data...");
  const content = fs.readFileSync(SPECIES_FILE, "utf-8");

  // Regex to extract species blocks
  // Matches { id: "...", name: "...", scientificName: "..." } blocks
  const speciesRegex = /id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?scientificName:\s*"([^"]+)"/g;
  let match;
  const speciesList = [];

  while ((match = speciesRegex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    const scientificName = match[3];
    speciesList.push({ id, name, scientificName });
  }

  console.log(`Found ${speciesList.length} species in database.`);

  const toDownload = speciesList.filter(s => !PRESERVED_SPECIES.has(s.id));
  console.log(`Need to fetch images for ${toDownload.length} species...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toDownload.length; i++) {
    const { id, name, scientificName } = toDownload[i];
    const destPath = path.join(IMAGES_DIR, `${id}.png`);

    // Double check if file already exists (e.g. from previous runs)
    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${toDownload.length}] File already exists for ${name} (${id}), skipping.`);
      successCount++;
      continue;
    }

    console.log(`\n[${i + 1}/${toDownload.length}] Processing ${name} (${scientificName})...`);

    // Try scientific name first
    let imgUrl = await fetchWikiImage(scientificName);

    // If not found, try common name
    if (!imgUrl) {
      console.log(`  Scientific name search failed. Trying common name: "${name}"...`);
      imgUrl = await fetchWikiImage(name);
    }

    if (imgUrl) {
      console.log(`  Found image URL: ${imgUrl}`);
      console.log(`  Downloading to ${destPath}...`);
      const success = await downloadImage(imgUrl, destPath);
      if (success) {
        console.log(`  ✓ Successfully downloaded ${name}`);
        successCount++;
      } else {
        console.log(`  ✗ Failed to download image for ${name}`);
        failCount++;
      }
    } else {
      console.log(`  ✗ No image found on Wikipedia for "${name}" or "${scientificName}"`);
      failCount++;
    }

    // Gentle delay to avoid hammering Wikipedia API
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\nDone! Success: ${successCount}, Fail: ${failCount}, Total: ${toDownload.length}`);
}

main();
