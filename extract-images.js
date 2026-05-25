const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "src/portfolio.html");
const publicImagesDir = path.join(__dirname, "public/images");

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

let htmlContent = fs.readFileSync(htmlPath, "utf8");
console.log("Original HTML size:", (htmlContent.length / 1024 / 1024).toFixed(2), "MB");

// Regex to find data URIs
// Matches: data:image/png;base64,xxxx or data:image/jpeg;base64,xxxx
const regex = /data:image\/([a-zA-Z0-9+.-]+);base64,([a-zA-Z0-9+/=\s\n]+)/g;

let match;
let count = 0;
const replacements = [];

while ((match = regex.exec(htmlContent)) !== null) {
  const fullMatch = match[0];
  const type = match[1]; // e.g. png, jpeg
  const base64Data = match[2].replace(/\s/g, ""); // strip any whitespace/newlines

  const ext = type === "jpeg" ? "jpg" : type;
  const fileName = `extracted-image-${count + 1}.${ext}`;
  const filePath = path.join(publicImagesDir, fileName);

  try {
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);
    console.log(`Extracted: ${fileName} (${(buffer.length / 1024).toFixed(2)} KB)`);

    replacements.push({
      target: fullMatch,
      replacement: `/images/${fileName}`,
    });
    count++;
  } catch (err) {
    console.error(`Error extracting image ${count + 1}:`, err.message);
  }
}

// Perform replacements
let updatedHtml = htmlContent;
for (const rep of replacements) {
  updatedHtml = updatedHtml.split(rep.target).join(rep.replacement);
}

fs.writeFileSync(htmlPath, updatedHtml, "utf8");
console.log("Updated HTML size:", (updatedHtml.length / 1024).toFixed(2), "KB");
console.log(`Successfully extracted ${count} images.`);
