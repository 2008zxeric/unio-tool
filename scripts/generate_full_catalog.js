import fs from 'fs';
import path from 'path';

// Let's create the generator script that outputs all 382 + 18 UNIO items to JSON
// We can write the raw TSV data in segments and parse it cleanly.
console.log("Ready to generate catalog");
