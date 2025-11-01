//  production-safe-server.ts
import express from "express";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

// Only import non-PDF scrapers for production
import { scrapeHNB } from "./scrapers/hnb";
import { scrapeSeylan } from "./scrapers/seylan";
import { scrapeCombank } from "./scrapers/combank";
import { scrapeNDB } from "./scrapers/ndb";
import { scrapeUnionBank } from "./scrapers/unionb";
import { scrapePeoples } from "./scrapers/peoples";
import { scrapeNSB } from "./scrapers/nsb";
import { scrapeBOC } from "./scrapers/boc";
import { scrapeCBSL } from "./scrapers/cbsl";
import { scrapeHnbTariff } from "./scrapers/hnb-tariff";
import { scrapeSeylanTariff } from "./scrapers/seylan-tariff";
import { scrapeCombankTariff } from "./scrapers/combank_tariff";
import { scrapeUnionbTariff } from "./scrapers/unionb-tariff";
import { scrapeNSBTariff } from "./scrapers/nsb-tariff";
import { scrapeBocTariff } from "./scrapers/boc-tariff";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://ub-analyst.netlify.app",
    // Allow all Netlify domains
    /^https:\/\/.*\.netlify\.app$/,
    /^https:\/\/.*\.netlify\.com$/
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const ensureOutputDir = async () => {
  const outDir = path.join(process.cwd(), "output");
  await fs.mkdir(outDir, { recursive: true });
  return outDir;
};

const maybeSave = async (bank: string, data: any, save: boolean) => {
  if (save) {
    const outDir = await ensureOutputDir();
    const filename = `${bank.toLowerCase().replace(/\s+/g, "")}.json`;
    await fs.writeFile(path.join(outDir, filename), JSON.stringify(data, null, 2));
    console.log(`Saved ${bank} data to output/${filename}`);
  }
};

// PDF scraper unavailable response
const pdfUnavailableResponse = (res: any, scraperName: string) => {
  res.status(503).json({ 
    error: `${scraperName} scraping unavailable in production environment`,
    message: "This endpoint requires PDF processing capabilities that are not available in the production environment"
  });
};

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Root route with available endpoints
app.get("/", (req, res) => {
  const examples = [
    `Available in production:`,
    `HNB             : http://localhost:${PORT}/scrape/hnb?show=true&slow=200`,
    `Seylan          : http://localhost:${PORT}/scrape/seylan?show=true&slow=200`,
    `ComBank         : http://localhost:${PORT}/scrape/combank?show=true&slow=200`,
    `NDB             : http://localhost:${PORT}/scrape/ndb?show=true&slow=200`,
    `Union Bank      : http://localhost:${PORT}/scrape/unionb?show=true&slow=200`,
    `People's Bank   : http://localhost:${PORT}/scrape/peoples?show=true&slow=200`,
    `NSB             : http://localhost:${PORT}/scrape/nsb?show=true&slow=200`,
    `BOC             : http://localhost:${PORT}/scrape/boc?show=true&slow=200`,
    `CBSL AWPR       : http://localhost:${PORT}/scrape/cbsl?show=true&slow=200`,
    ``,
    `Tariff endpoints:`,
    `HNB Tariff      : http://localhost:${PORT}/scrape/hnb-tariff?show=true&slow=200`,
    `Seylan Tariff   : http://localhost:${PORT}/scrape/seylan-tariff?show=true&slow=200`,
    `ComBank Tariff  : http://localhost:${PORT}/scrape/combank_tariff`,
    `Union Bank Tariff: http://localhost:${PORT}/scrape/unionb-tariff`,
    `NSB Tariff      : http://localhost:${PORT}/scrape/nsb-tariff`,
    `BOC Tariff      : http://localhost:${PORT}/scrape/boc-tariff?show=true&slow=200`,
    ``,
    `Unavailable in production (require PDF processing):`,
    `- /scrape/sampath (PDF parsing)`,
    `- /scrape/dfcc (PDF parsing)`,
    `- /scrape/cargills (PDF parsing)`,
    `- /scrape/ntb (PDF parsing)`,
    `- /scrape/amana (PDF parsing)`,
    `- All PDF-dependent tariff endpoints`,
  ];
  res.send(`<pre>${examples.join("\n")}</pre>`);
});

// Working scrapers
app.get("/scrape/hnb", async (req, res) => {
  try {
    const data = await scrapeHNB({ show: req.query.show === "true", slow: Number(req.query.slow || 0) });
    await maybeSave("HNB", data, req.query.save === "true");
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: String(e?.message || e) }); }
});

app.get("/scrape/seylan", async (req, res) => {
  try {
    const data = await scrapeSeylan({ show: req.query.show === "true", slow: Number(req.query.slow || 0) });
    await maybeSave("Seylan", data, req.query.save === "true");
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: String(e?.message || e) }); }
});

app.get("/scrape/combank", async (req, res) => {
  try {
    const data = await scrapeCombank({ show: req.query.show === "true", slow: Number(req.query.slow || 0) });
    await maybeSave("ComBank", data, req.query.save === "true");
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: String(e?.message || e) }); }
});

app.get("/scrape/ndb", async (req, res) => {
  try {
    const data = await scrapeNDB({ show: req.query.show === "true", slow: Number(req.query.slow || 0) });
    await maybeSave("NDB", data, req.query.save === "true");
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: String(e?.message || e) }); }
});

app.get("/scrape/unionb", async (req, res) => {
  try {
    const data = await scrapeUnionBank({ show: req.query.show === "true", slow: Number(req.query.slow || 0) });
    await maybeSave("UnionBank", data, req.query.save === "true");
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: String(e?.message || e) }); }
});

app.get("/scrape/peoples", async (req, res) => {
  try {
    const data = await scrapePeoples("show" in req.query, req.query.slow ? Number(req.query.slow) : 0);
    res.json(data);
  } catch (err: any) {
    console.error("Error scraping People's Bank:", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

app.get("/scrape/nsb", async (req, res) => {
  try {
    const data = await scrapeNSB({ show: req.query.show === "true", slow: Number(req.query.slow || 0) });
    await maybeSave("NSB", data, req.query.save === "true");
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: String(e?.message || e) }); }
});

app.get("/scrape/boc", async (req, res) => {
  try {
    const data = await scrapeBOC(req.query as any);
    await maybeSave("BOC", data, req.query.save === "true");
    res.json(data);
  } catch (err: any) { res.status(500).json({ error: String(err?.message || err) }); }
});

app.get("/scrape/cbsl", async (req, res) => {
  try {
    const rows = await scrapeCBSL({
      show: String(req.query.show),
      slow: String(req.query.slow),
      save: String(req.query.save),
    });
    res.json(rows);
  } catch (err: any) {
    console.error("CBSL scrape failed", err);
    res.status(500).json({ error: String(err?.message || err) });
  }
});

// Tariff endpoints
app.get("/scrape/hnb-tariff", async (req, res) => {
  try {
    const data = await scrapeHnbTariff({ show: req.query.show === "true", slow: Number(req.query.slow || 0) });
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: String(e?.message || e) }); }
});

app.get("/scrape/seylan-tariff", async (req, res) => {
  try {
    const data = await scrapeSeylanTariff({
      show: req.query.show === "true",
      slow: Number(req.query.slow || 0)
    });
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.get("/scrape/combank_tariff", async (req, res) => {
  try {
    const data = await scrapeCombankTariff();
    res.json(data);
  } catch (e) {
    console.error("Combank Tariff Scraper Error:", e);
    res.status(500).json({ error: "Failed to scrape Combank tariffs" });
  }
});

app.get("/scrape/unionb-tariff", async (_req, res) => {
  try {
    const data = await scrapeUnionbTariff();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to scrape Union Bank tariff", detail: err.message || String(err) });
  }
});

app.get("/scrape/nsb-tariff", async (req, res) => {
  try {
    const result = await scrapeNSBTariff();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e + "" });
  }
});

app.get("/scrape/boc-tariff", async (req, res) => {
  try {
    const data = await scrapeBocTariff({
      show: String(req.query.show || ""),
      slow: String(req.query.slow || ""),
      save: String(req.query.save || "true"),
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

// PDF-dependent endpoints that return unavailable message
const pdfEndpoints = [
  "sampath", "dfcc", "cargills", "ntb", "amana",
  "sampath-tariff", "dfcc-tariff", "ndb-tariff", 
  "cargills-tariff", "ntb-tariff", "amana-tariff", "peoples-tariff"
];

pdfEndpoints.forEach(endpoint => {
  app.get(`/scrape/${endpoint}`, (req, res) => {
    pdfUnavailableResponse(res, endpoint);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Production-safe server running on port ${PORT}`);
  console.log(`📊 PDF-dependent scrapers disabled for production stability`);
});