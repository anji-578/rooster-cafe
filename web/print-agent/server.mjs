#!/usr/bin/env node
/**
 * Rooster Cafe — LAN Print Agent
 *
 * Runs on the cafe network PC (USB printer) OR any always-on machine that can
 * reach a network thermal printer (IP:9100). Laptop + tablet POS both POST here.
 *
 * Usage:
 *   node print-agent/server.mjs
 *   PRINTER_HOST=192.168.1.50 PRINTER_PORT=9100 HOST=0.0.0.0 PORT=9101 node print-agent/server.mjs
 *
 * Without a printer: MOCK=1 writes receipts to print-agent/out/
 */

import http from "http";
import net from "net";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 9101);
const HOST = process.env.HOST || "0.0.0.0";
const PRINTER_HOST = process.env.PRINTER_HOST || "";
const PRINTER_PORT = Number(process.env.PRINTER_PORT || 9100);
const MOCK = process.env.MOCK === "1" || !PRINTER_HOST;
const OUT_DIR = path.join(__dirname, "out");

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function send(res, code, data) {
  cors(res);
  const body = typeof data === "string" ? data : JSON.stringify(data);
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(body);
}

function sendRaw(host, port, buffer) {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host, port }, () => {
      socket.write(buffer);
      socket.end();
    });
    socket.setTimeout(8000);
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("Printer timeout"));
    });
    socket.on("error", reject);
    socket.on("close", () => resolve());
  });
}

async function printJob(payload) {
  const text = String(payload.text || "");
  let bytes;
  if (payload.escposBase64) {
    bytes = Buffer.from(String(payload.escposBase64), "base64");
  } else {
    bytes = Buffer.from(text.replaceAll("₹", "Rs") + "\n\n\n", "utf8");
  }

  if (MOCK) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const id = payload.billId || Date.now();
    const file = path.join(OUT_DIR, `receipt-${id}.txt`);
    fs.writeFileSync(file, text || bytes.toString("utf8"), "utf8");
    fs.writeFileSync(file.replace(/\.txt$/, ".bin"), bytes);
    return { mode: "mock", file };
  }

  await sendRaw(PRINTER_HOST, PRINTER_PORT, bytes);
  return { mode: "network", host: PRINTER_HOST, port: PRINTER_PORT };
}

const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
    send(res, 200, {
      ok: true,
      service: "rooster-print-agent",
      mock: MOCK,
      printer: MOCK ? null : `${PRINTER_HOST}:${PRINTER_PORT}`,
      listen: `${HOST}:${PORT}`,
    });
    return;
  }

  if (req.method === "POST" && req.url === "/print") {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 1_000_000) req.destroy();
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(raw || "{}");
        const result = await printJob(payload);
        send(res, 200, { ok: true, ...result });
      } catch (e) {
        send(res, 500, {
          ok: false,
          error: e instanceof Error ? e.message : "Print failed",
        });
      }
    });
    return;
  }

  send(res, 404, { error: "Not found" });
});

server.listen(PORT, HOST, () => {
  console.log(`Rooster print agent on http://${HOST}:${PORT}`);
  if (MOCK) {
    console.log(`MOCK mode — receipts → ${OUT_DIR}`);
    console.log(`Set PRINTER_HOST=<thermal-ip> for live ESC/POS (port 9100).`);
  } else {
    console.log(`Printing to ${PRINTER_HOST}:${PRINTER_PORT}`);
  }
  console.log(`From Admin POS set Print agent URL to this machine's LAN IP.`);
});
