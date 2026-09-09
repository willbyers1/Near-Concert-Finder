var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef";
function encryptKey(text) {
  try {
    const iv = import_crypto.default.randomBytes(16);
    const cipher = import_crypto.default.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_SECRET.padEnd(32).slice(0, 32)), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("Encryption error:", err);
    throw new Error("Failed to encrypt API key");
  }
}
function decryptKey(encryptedText) {
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 2) return "";
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const decipher = import_crypto.default.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_SECRET.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
}
function maskKey(key) {
  if (!key || key.length <= 4) return "\u2022\u2022\u2022\u2022";
  const last4 = key.slice(-4);
  return "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" + last4;
}
function getActiveApiKey(req) {
  const byokToken = req.headers["x-byok-token"];
  if (byokToken) {
    const decrypted = decryptKey(byokToken);
    if (decrypted) return decrypted;
  }
  return process.env.TICKETMASTER_API_KEY || "";
}
function normalizeTMEvent(ev) {
  const venues = ev._embedded?.venues?.map((v) => ({
    id: v.id || "v-unknown",
    name: v.name || "Venue TBA",
    city: v.city?.name || "",
    state: v.state?.stateCode || v.state?.name || "",
    address: v.address?.line1 || "",
    postalCode: v.postalCode || "",
    country: v.country?.name || v.country?.countryCode || "",
    location: v.location ? { latitude: parseFloat(v.location.latitude), longitude: parseFloat(v.location.longitude) } : void 0
  })) || [];
  const attractions = ev._embedded?.attractions?.map((a) => ({
    id: a.id || "att-unknown",
    name: a.name || "Artist",
    genre: a.classifications?.[0]?.genre?.name || a.classifications?.[0]?.segment?.name || "",
    subGenre: a.classifications?.[0]?.subGenre?.name || "",
    image: a.images?.[0]?.url || "",
    url: a.url || "",
    upcomingEventsCount: a.upcomingEvents?._total || 0,
    externalLinks: a.externalLinks ? {
      spotify: a.externalLinks.spotify?.[0]?.url,
      youtube: a.externalLinks.youtube?.[0]?.url,
      instagram: a.externalLinks.instagram?.[0]?.url,
      twitter: a.externalLinks.twitter?.[0]?.url,
      homepage: a.externalLinks.homepage?.[0]?.url
    } : void 0
  })) || [];
  const images = (ev.images || []).map((img) => ({
    url: img.url,
    ratio: img.ratio,
    width: img.width,
    height: img.height,
    fallback: img.fallback
  }));
  const segment = ev.classifications?.[0]?.segment?.name || "";
  const genre = ev.classifications?.[0]?.genre?.name || "";
  const subGenre = ev.classifications?.[0]?.subGenre?.name || "";
  const isFestival = genre.toLowerCase().includes("festival") || ev.name.toLowerCase().includes("festival") || subGenre.toLowerCase().includes("festival");
  let formattedDate = "Date TBA";
  const startDate = ev.dates?.start?.localDate || "";
  const startTime = ev.dates?.start?.localTime || "";
  if (startDate) {
    try {
      const [year, month, day] = startDate.split("-");
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      formattedDate = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      formattedDate = startDate;
    }
  }
  return {
    id: ev.id,
    name: ev.name,
    type: ev.type || "event",
    url: ev.url || "https://www.ticketmaster.com",
    isFestival,
    images: images.length > 0 ? images : [{ url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80" }],
    dates: {
      startDate,
      startTime,
      startDateTime: ev.dates?.start?.dateTime || `${startDate}T${startTime || "00:00:00"}Z`,
      formattedDate,
      status: ev.dates?.status?.code || "onsale",
      timeZone: ev.dates?.timezone || ""
    },
    classifications: {
      segment,
      genre,
      subGenre,
      type: ev.classifications?.[0]?.type?.name || ""
    },
    priceRanges: ev.priceRanges?.map((p) => ({
      min: p.min,
      max: p.max,
      currency: p.currency || "USD"
    })),
    venues,
    attractions,
    info: ev.info || ev.description || "",
    pleaseNote: ev.pleaseNote || "",
    seatmapUrl: ev.seatmap?.staticUrl || "",
    promoter: ev.promoter?.name || ""
  };
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/byok/encrypt", (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
    return res.status(400).json({ error: "Valid Ticketmaster API Key is required" });
  }
  const cleanKey = apiKey.trim();
  const encryptedToken = encryptKey(cleanKey);
  const maskedKey = maskKey(cleanKey);
  res.json({
    maskedKey,
    encryptedToken,
    message: "API Key securely encrypted"
  });
});
app.post("/api/byok/validate", async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== "string") {
    return res.status(400).json({ valid: false, message: "Please enter a valid API key string" });
  }
  const cleanKey = apiKey.trim();
  try {
    const testUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${encodeURIComponent(cleanKey)}&size=1`;
    const response = await fetch(testUrl);
    if (response.ok) {
      const encryptedToken = encryptKey(cleanKey);
      const maskedKey = maskKey(cleanKey);
      return res.json({
        valid: true,
        message: "Ticketmaster API Key successfully verified!",
        maskedKey,
        encryptedToken
      });
    } else {
      const errorText = await response.text();
      return res.status(401).json({
        valid: false,
        message: `Ticketmaster API rejected key (HTTP ${response.status}). Please verify your key on developer.ticketmaster.com`
      });
    }
  } catch (err) {
    return res.status(500).json({
      valid: false,
      message: `Failed to connect to Ticketmaster servers: ${err.message || "Network error"}`
    });
  }
});
app.get("/api/ticketmaster/events", async (req, res) => {
  const apiKey = getActiveApiKey(req);
  const {
    keyword,
    city,
    stateCode,
    latlong,
    radius,
    classificationName,
    genreId,
    sort,
    startDateTime,
    endDateTime,
    page = "0",
    size = "20"
  } = req.query;
  if (!apiKey) {
    return res.json({
      data: [],
      isDemoMode: true,
      message: "No Ticketmaster API key configured. You can add your own key in Settings (BYOK) or use demo events.",
      page: { size: 20, totalElements: 0, totalPages: 0, number: 0 }
    });
  }
  try {
    const params = new URLSearchParams();
    params.append("apikey", apiKey);
    params.append("size", String(size));
    params.append("page", String(page));
    if (classificationName) {
      params.append("classificationName", String(classificationName));
    } else {
      params.append("segmentName", "Music");
    }
    if (keyword) params.append("keyword", String(keyword));
    if (city) params.append("city", String(city));
    if (stateCode) params.append("stateCode", String(stateCode));
    if (latlong) params.append("latlong", String(latlong));
    if (radius) {
      params.append("radius", String(radius));
      params.append("unit", "miles");
    }
    if (genreId) params.append("genreId", String(genreId));
    if (sort) params.append("sort", String(sort));
    if (startDateTime) params.append("startDateTime", String(startDateTime));
    if (endDateTime) params.append("endDateTime", String(endDateTime));
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
    const tmRes = await fetch(apiUrl);
    if (!tmRes.ok) {
      if (tmRes.status === 401 || tmRes.status === 403) {
        return res.json({
          data: [],
          isDemoMode: true,
          error: "Invalid or expired Ticketmaster API key. Please check your BYOK settings.",
          page: { size: 20, totalElements: 0, totalPages: 0, number: 0 }
        });
      }
      if (tmRes.status === 429) {
        return res.json({
          data: [],
          isDemoMode: true,
          error: "Ticketmaster API rate limit reached. Please wait a moment or use BYOK.",
          page: { size: 20, totalElements: 0, totalPages: 0, number: 0 }
        });
      }
      return res.json({
        data: [],
        isDemoMode: true,
        error: `Ticketmaster API error (HTTP ${tmRes.status})`
      });
    }
    const data = await tmRes.json();
    const rawEvents = data._embedded?.events || [];
    const normalizedEvents = rawEvents.map(normalizeTMEvent);
    res.json({
      data: normalizedEvents,
      isDemoMode: false,
      page: {
        size: data.page?.size || 20,
        totalElements: data.page?.totalElements || normalizedEvents.length,
        totalPages: data.page?.totalPages || 1,
        number: data.page?.number || 0
      }
    });
  } catch (err) {
    console.error("Error fetching Ticketmaster events:", err);
    res.json({
      data: [],
      isDemoMode: true,
      error: "Network connection issue while contacting Ticketmaster."
    });
  }
});
app.get("/api/ticketmaster/events/:id", async (req, res) => {
  const apiKey = getActiveApiKey(req);
  const { id } = req.params;
  if (!apiKey) {
    return res.status(400).json({ error: "No Ticketmaster API key configured" });
  }
  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(id)}.json?apikey=${encodeURIComponent(apiKey)}`;
    const tmRes = await fetch(url);
    if (!tmRes.ok) {
      return res.status(tmRes.status).json({ error: `Event not found (HTTP ${tmRes.status})` });
    }
    const rawEvent = await tmRes.json();
    res.json({ data: normalizeTMEvent(rawEvent) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event details" });
  }
});
app.get("/api/ticketmaster/attractions", async (req, res) => {
  const apiKey = getActiveApiKey(req);
  const { keyword, page = "0", size = "20" } = req.query;
  if (!apiKey) {
    return res.json({ data: [], isDemoMode: true });
  }
  try {
    const params = new URLSearchParams();
    params.append("apikey", apiKey);
    params.append("size", String(size));
    params.append("page", String(page));
    if (keyword) params.append("keyword", String(keyword));
    const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?${params.toString()}`;
    const tmRes = await fetch(url);
    if (!tmRes.ok) {
      return res.json({ data: [], isDemoMode: true });
    }
    const data = await tmRes.json();
    const rawAttractions = data._embedded?.attractions || [];
    const attractions = rawAttractions.map((a) => ({
      id: a.id,
      name: a.name,
      url: a.url || "",
      image: a.images?.[0]?.url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      genre: a.classifications?.[0]?.genre?.name || a.classifications?.[0]?.segment?.name || "Music",
      subGenre: a.classifications?.[0]?.subGenre?.name || "",
      upcomingEventsCount: a.upcomingEvents?._total || 0,
      externalLinks: a.externalLinks ? {
        spotify: a.externalLinks.spotify?.[0]?.url,
        youtube: a.externalLinks.youtube?.[0]?.url,
        instagram: a.externalLinks.instagram?.[0]?.url,
        twitter: a.externalLinks.twitter?.[0]?.url,
        homepage: a.externalLinks.homepage?.[0]?.url
      } : void 0
    }));
    res.json({
      data: attractions,
      isDemoMode: false,
      page: {
        size: data.page?.size || 20,
        totalElements: data.page?.totalElements || attractions.length,
        totalPages: data.page?.totalPages || 1,
        number: data.page?.number || 0
      }
    });
  } catch (err) {
    res.json({ data: [], isDemoMode: true, error: err.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Concert & Festival Finder server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
