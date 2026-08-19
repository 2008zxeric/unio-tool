import fs from 'fs';
import path from 'path';

const part1 = fs.readFileSync(path.join(process.cwd(), 'data', 'tsv_part1.txt'), 'utf8').trim();
const part2 = fs.readFileSync(path.join(process.cwd(), 'data', 'tsv_part2.txt'), 'utf8').trim();
const part3 = fs.readFileSync(path.join(process.cwd(), 'data', 'tsv_part3.txt'), 'utf8').trim();
const part4 = fs.readFileSync(path.join(process.cwd(), 'data', 'tsv_part4.txt'), 'utf8').trim();

const fullTsv = [part1, part2, part3, part4].join('\n');
fs.writeFileSync(path.join(process.cwd(), 'data', 'unio_catalog_382.tsv'), fullTsv, 'utf8');

const lines = fullTsv.split('\n');
const items = [];

for (const line of lines) {
  if (!line.trim()) continue;
  const parts = line.split('\t');
  if (parts.length < 12) continue;
  
  items.push({
    oil_id: parts[0].trim(),
    name_zh: parts[1].trim(),
    name_en: parts[2].trim(),
    botanical_name: parts[3].trim(),
    family: parts[4].trim(),
    aroma_family: parts[5].trim(),
    plant_part: parts[6].trim(),
    extraction: parts[7].trim(),
    tags: parts[8].trim(),
    blend_focus: parts[9].trim(),
    safety_flags: parts[10].trim(),
    notes: parts[11].trim(),
  });
}

console.log(`Successfully parsed ${items.length} catalog items.`);

fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'unioCatalogItems.json'), JSON.stringify(items, null, 2), 'utf8');
console.log('Saved to src/data/unioCatalogItems.json');
