import fs from 'fs';
import path from 'path';

// Let's create the TSV parser
const tsvPath = path.join(process.cwd(), 'data', 'raw_catalog_382.tsv');

// If TSV doesn't exist, we will create it
console.log('Parser script ready');
