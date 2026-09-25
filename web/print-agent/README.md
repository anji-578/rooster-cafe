# Rooster Print Agent

LAN bridge so **laptop + tablet** POS can print thermal bills.

## Mock (no printer yet)

```bash
cd web
npm run print-agent
```

Receipts land in `print-agent/out/`.

## Live ESC/POS network printer

```bash
PRINTER_HOST=192.168.1.50 PRINTER_PORT=9100 HOST=0.0.0.0 npm run print-agent
```

USB printers: either install a virtual network port, or run a USB→raw bridge on this same PC and set `PRINTER_HOST=127.0.0.1`.

## Admin

Set Print agent URL to `http://THIS_PC_LAN_IP:9101` so tablets on cafe Wi‑Fi can reach it.
