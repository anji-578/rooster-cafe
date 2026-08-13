/**
 * Generate catering review QR codes.
 * Usage: npm run qr
 */
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    const value = trimmed.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const target = new URL("/review", siteUrl);
  target.searchParams.set("src", "catering");
  const url = target.toString();

  const outDir = path.join(root, "public", "qr");
  fs.mkdirSync(outDir, { recursive: true });

  const pngPath = path.join(outDir, "catering-review.png");
  const svgPath = path.join(outDir, "catering-review.svg");

  await QRCode.toFile(pngPath, url, {
    type: "png",
    width: 1024,
    margin: 2,
    color: { dark: "#123A6D", light: "#FFFFFF" },
    errorCorrectionLevel: "H",
  });

  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: { dark: "#123A6D", light: "#FFFFFF" },
    errorCorrectionLevel: "H",
  });
  fs.writeFileSync(svgPath, svg);

  console.log("QR generated for:", url);
  console.log(" →", pngPath);
  console.log(" →", svgPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
