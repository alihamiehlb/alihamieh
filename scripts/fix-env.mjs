/**
 * Fix .env file formatting issues
 * Run: node scripts/fix-env.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');

function fixEnvFile() {
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found');
    return;
  }

  let content = fs.readFileSync(envPath, 'utf8');
  let fixed = false;

  // Fix NEXT_PUBLIC_SITE_URL - add https:// if missing
  content = content.replace(
    /^NEXT_PUBLIC_SITE_URL=alihamieh\.com$/m,
    'NEXT_PUBLIC_SITE_URL=https://printslb.com'
  );
  if (content !== fs.readFileSync(envPath, 'utf8')) {
    fixed = true;
    console.log('✓ Fixed NEXT_PUBLIC_SITE_URL');
  }

  // Fix mongodb variable name and format
  content = content.replace(
    /^mongodb\s*=\s*(.+)$/m,
    'MONGODB_URI=$1'
  );
  if (content !== fs.readFileSync(envPath, 'utf8')) {
    fixed = true;
    console.log('✓ Fixed MONGODB_URI variable name');
  }

  // Fix any other alihamieh.com URLs without https
  content = content.replace(
    /NEXT_PUBLIC_SITE_URL=alihamieh\.com/g,
    'NEXT_PUBLIC_SITE_URL=https://printslb.com'
  );

  if (fixed) {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✓ .env file fixed successfully');
    console.log('\nPlease review the changes and run: npm run build');
  } else {
    console.log('No issues found in .env file');
  }
}

fixEnvFile();
