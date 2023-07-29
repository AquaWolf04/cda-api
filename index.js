const express = require("express");
const { CdaVideoApi } = require("cda-api");

const app = express();
const port = 3000; // Választhatod más portot is, ha a 3000 foglalt

// Az "/:id" útvonalparaméter lekérdezése
app.get("/api/:id", async (req, res) => {
  try {
    const videoApi = await CdaVideoApi.fromID(req.params.id); // A kért videó API-jának lekérdezése az ID alapján

    const qualities = videoApi.getQualities();
    const videoURLs = [];

    for (const quality of qualities.values()) {
      const url = await videoApi.getDirectVideoLink(quality);
      const size = mapQualityToSize(quality);
      videoURLs.push({ src: url, quality: size });
    }

    // JSON válasz küldése az elérhető minőségekkel és direkt URL-ekkel
    res.json(videoURLs);
  } catch (error) {
    // Hibakezelés, ha az API vagy a videó nem található
    res.status(404).json({ error: "Video not found" });
  }
});

// Segédfüggvény a minőség nevének felbontásra leképezéséhez
function mapQualityToSize(quality) {
  switch (quality) {
    case "vl":
      return 360;
    case "lq":
      return 480;
    case "sd":
      return 720;
    case "hd":
      return 1080;
    default:
      return null;
  }
}

// Szerver indítása
app.listen(port, () => {
  console.log(`A szerver fut a http://localhost:${port} címen.`);
});
