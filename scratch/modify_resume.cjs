const fs = require("fs");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

async function modifyResume(filePath) {
  console.log(`Modifying PDF: ${filePath}`);
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Font sizes: Original was 12pt with 0.75 scale = 9pt.
  const fontSize = 9;

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Coordinates based on our previous calculation:
  // Baseline is at Y = 138.46
  // Text starts around X = 72.00
  // Cover the old text with a white rectangle.
  // We use y = 133.00, height = 12.00 to cover the line height safely.
  firstPage.drawRectangle({
    x: 70.0,
    y: 132.5,
    width: 480.0,
    height: 12.5,
    color: rgb(1, 1, 1), // White mask
  });

  // Text components:
  // 1. "Both Horizon editions collectively " (Regular)
  // 2. "delivered 40-45% pipeline (4.6M$) influence across regions." (Bold)
  const text1 = "Both Horizon editions collectively ";
  const text2 = "delivered 40-45% pipeline (4.6M$) influence across regions.";

  // Draw the regular text
  firstPage.drawText(text1, {
    x: 72.0,
    y: 135.0, // slight baseline adjustment for Helvetica
    size: fontSize,
    font: helveticaFont,
    color: rgb(0.2, 0.2, 0.2), // Dark charcoal gray color matching other text on the page
  });

  // Calculate width of text1 to know where to start text2
  const text1Width = helveticaFont.widthOfTextAtSize(text1, fontSize);

  // Draw the bold text
  firstPage.drawText(text2, {
    x: 72.0 + text1Width,
    y: 135.0,
    size: fontSize,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, modifiedPdfBytes);
  console.log(`Successfully modified PDF: ${filePath}`);
}

async function run() {
  const paths = [
    "public/Ayushi_Mishra_Resume_2026.pdf",
    "Ayushi_Mishra_Resume_2026.pdf",
    "dist/client/Ayushi_Mishra_Resume_2026.pdf",
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        await modifyResume(p);
      } catch (err) {
        console.error(`Error modifying ${p}:`, err);
      }
    } else {
      console.log(`Path does not exist: ${p}`);
    }
  }
}

run();
