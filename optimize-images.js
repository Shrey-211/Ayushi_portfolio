const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const htmlPath = path.join(__dirname, "src/portfolio.html");
let htmlContent = fs.readFileSync(htmlPath, "utf8");

// List of images to optimize
// format: [original_name, target_width, new_name]
const imagesToOptimize = [
  ["extracted-image-1.png", 1200, "extracted-image-1.jpg"],
  ["extracted-image-2.png", 1200, "extracted-image-2.jpg"],
  ["extracted-image-3.jpg", 1200, "extracted-image-3.jpg"],
  ["extracted-image-4.png", 800, "extracted-image-4.jpg"],
  ["extracted-image-5.png", 800, "extracted-image-5.jpg"],
];

const imagesDir = path.join(__dirname, "public/images");

imagesToOptimize.forEach(([origName, width, newName]) => {
  const origPath = path.join(imagesDir, origName);
  const newPath = path.join(imagesDir, newName);

  if (fs.existsSync(origPath)) {
    console.log(`Optimizing ${origName} -> ${newName} (width: ${width})`);

    // Resize image
    try {
      execSync(`sips --resampleWidth ${width} "${origPath}"`);
    } catch (e) {
      console.error(`Failed to resize ${origName}:`, e.message);
    }

    // Convert format to JPEG with quality 75
    try {
      execSync(`sips -s format jpeg -s formatOptions 75 "${origPath}" --out "${newPath}"`);
      console.log(`Created optimized: ${newName}`);

      // Delete old file if names are different
      if (origName !== newName) {
        fs.unlinkSync(origPath);
        console.log(`Deleted original: ${origName}`);
      }
    } catch (e) {
      console.error(`Failed to convert ${origName}:`, e.message);
    }
  } else {
    console.warn(`File not found: ${origPath}`);
  }
});

// Clean up any remaining extracted-image-3.png (if any exists)
const img3Png = path.join(imagesDir, "extracted-image-3.png");
if (fs.existsSync(img3Png)) {
  fs.unlinkSync(img3Png);
}

// Update HTML to point to the new JPG extensions
console.log("Updating HTML image references...");
let updatedHtml = htmlContent;

// Replace references
updatedHtml = updatedHtml.replace(
  /\/images\/extracted-image-1\.png/g,
  "/images/extracted-image-1.jpg",
);
updatedHtml = updatedHtml.replace(
  /\/images\/extracted-image-2\.png/g,
  "/images/extracted-image-2.jpg",
);
updatedHtml = updatedHtml.replace(
  /\/images\/extracted-image-3\.png/g,
  "/images/extracted-image-3.jpg",
);
updatedHtml = updatedHtml.replace(
  /\/images\/extracted-image-4\.png/g,
  "/images/extracted-image-4.jpg",
);
updatedHtml = updatedHtml.replace(
  /\/images\/extracted-image-5\.png/g,
  "/images/extracted-image-5.jpg",
);

// Also update the hero-portal.png reference in the CSS to point to the optimized jpeg
updatedHtml = updatedHtml.replace(/\/hero-portal\.png/g, "/hero-portal.jpg");

fs.writeFileSync(htmlPath, updatedHtml, "utf8");
console.log("HTML references updated successfully.");
