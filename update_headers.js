const fs = require('fs');
const path = require('path');

const dir = '/Users/haldwani/Documents/Working/FaceHealthAI/FaceHealAI/src/screens';
const files = fs.readdirSync(dir).filter(f => f.endsWith('InputScreen.tsx'));

const componentImport = `import { OnboardingHeader } from '@/components/OnboardingHeader';\n`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes("styles.headerRow")) {
    
    // Add import if not present
    if (!content.includes("OnboardingHeader")) {
      const lastImportIndex = content.lastIndexOf("import ");
      const nextLineIndex = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, nextLineIndex + 1) + componentImport + content.slice(nextLineIndex + 1);
    }

    // Use regex to replace the header block
    const headerRegex = /\{\/\*\s*Header with Back Button and Progress\s*\*\/\}\s*<View style=\{styles\.headerRow\}>[\s\S]*?<\/View>\s*<\/View>/;
    
    content = content.replace(headerRegex, `<OnboardingHeader progressStyle={progressStyle} />`);
    
    // Some don't have the comment exactly, or it might be different. Let's do a more robust replacement.
    const altHeaderRegex = /<View style=\{styles\.headerRow\}>[\s\S]*?<\/View>\s*<\/View>/; // wait, the outer view closes <View style={styles.headerRow}> 
    
    // Let's manually replace it by finding start and end of <View style={styles.headerRow}>
    let startIndex = content.indexOf("<View style={styles.headerRow}>");
    if (startIndex !== -1) {
      // also remove the comment before it if it exists
      const commentIndex = content.lastIndexOf("{/* Header with Back Button and Progress */}", startIndex);
      if (commentIndex !== -1 && commentIndex > startIndex - 100) {
        startIndex = commentIndex;
      }
      
      // find the closing </View> for headerRow.
      // We know it contains two inner views/touchableopacities.
      // So let's find the second </View> after headerRow.
      let rest = content.slice(startIndex);
      // find the closing tag of headerRow.
      // An easy way is just to regex match it because it's predictable.
      const match = rest.match(/(?:\{\/\*[\s\S]*?\*\/\}\s*)?<View style=\{styles\.headerRow\}>[\s\S]*?<\/View>\s*<\/View>/);
      
      if (match) {
        content = content.replace(match[0], `<OnboardingHeader progressStyle={progressStyle} />`);
      } else {
         // fallback regex
         const fallbackMatch = rest.match(/<View style=\{styles\.headerRow\}>[\s\S]*?<ArrowLeft[\s\S]*?<\/TouchableOpacity>[\s\S]*?<\/View>\s*<\/View>/);
         if (fallbackMatch) {
            content = content.replace(fallbackMatch[0], `<OnboardingHeader progressStyle={progressStyle} />`);
         }
      }
    }
    
    // Remove unused headerRow styles if we want, but let's just leave them to be safe.
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
