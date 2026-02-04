import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, 'routes');

// Get all route files
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

console.log(`Found ${files.length} route files to fix...\n`);

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Skip if already using QueryHelper exclusively (no getDatabase imports)
  if (!content.includes('getDatabase')) {
    console.log(`✅ ${file} - Already clean`);
    return;
  }

  console.log(`🔧 Fixing ${file}...`);

  // Remove getDatabase import if QueryHelper is already imported
  if (content.includes('QueryHelper')) {
    content = content.replace(/import \{ getDatabase[^}]*\} from ['"]\.\.\/database\.js['"]\n?/g, '');
    modified = true;
  }

  // Replace const db = getDatabase() or const db = await getDatabase()
  content = content.replace(/const db = (?:await )?getDatabase\(\)[\s;]*/g, '');
  
  // Replace await db.all( with await QueryHelper.all(
  content = content.replace(/await db\.all\(/g, 'await QueryHelper.all(');
  
  // Replace await db.get( with await QueryHelper.get(
  content = content.replace(/await db\.get\(/g, 'await QueryHelper.get(');
  
  // Replace await db.run( with await QueryHelper.run(
  content = content.replace(/await db\.run\(/g, 'await QueryHelper.run(');

  // Write back
  fs.writeFileSync(filePath, content);
  console.log(`   ✅ Fixed ${file}`);
});

console.log('\n✅ All routes fixed!');
