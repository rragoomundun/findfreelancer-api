import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON synchronously
const countries = JSON.parse(readFileSync(join(__dirname, '../assets/countries.json'), 'utf-8'));

export default countries;
