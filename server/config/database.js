const path = require('path');
const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: path.resolve(__dirname, '../modules/.env') });

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/**
 * Stellt die Verbindung zur MongoDB her und gibt die Datenbank zurück.
 */
async function connectToDatabase() {
  try {
    console.log("Verbindungsaufbau zur MongoDB...");
    if (!client.isConnected) {
      await client.connect();
      console.log("Erfolgreich mit MongoDB verbunden!");
    }
    return client.db("html_database"); // Name der Datenbank
  } catch (error) {
    console.error("Fehler bei der Verbindung mit MongoDB:", error);
    throw error;
  }
}

/**
 * Testet die Verbindung zur MongoDB (Ping-Befehl).
 */
async function testDatabaseConnection() {
  try {
    console.log("Teste die Verbindung zur Datenbank...");
    const db = await connectToDatabase();
    await db.command({ ping: 1 });
    console.log("Datenbank erfolgreich gepingt!");
  } catch (error) {
    console.error("Fehler beim Pingen der Datenbank:", error);
    throw error;
  }
}

/**
 * Lädt eine HTML-Datei in die MongoDB hoch.
 * @param {string} filePath - Der Pfad zur HTML-Datei.
 */
async function uploadHtmlFile(filePath) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("html_files");

    if (!fs.existsSync(filePath)) {
      console.error(`Datei nicht gefunden: ${filePath}`);
      return;
    }

    const htmlContent = fs.readFileSync(filePath, "utf-8");
    const fileName = filePath.split("/").pop();

    const result = await collection.insertOne({
      fileName: fileName,
      content: htmlContent,
      createdAt: new Date(),
    });

    console.log(`HTML-Datei erfolgreich hochgeladen: ${fileName}, ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Fehler beim Hochladen der HTML-Datei:", error);
  }
}

/**
 * Ruft eine HTML-Datei aus der MongoDB ab und speichert sie lokal.
 * @param {string} fileName - Der Name der HTML-Datei.
 */
async function fetchHtmlFile(fileName) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("html_files");

    const file = await collection.findOne({ fileName: fileName });

    if (!file) {
      console.error(`Keine Datei mit dem Namen "${fileName}" gefunden.`);
      return;
    }

    const outputPath = `./downloads/${fileName}`;
    fs.writeFileSync(outputPath, file.content, "utf-8");
    console.log(`HTML-Datei erfolgreich abgerufen und gespeichert: ${outputPath}`);
  } catch (error) {
    console.error("Fehler beim Abrufen der HTML-Datei:", error);
  }
}

/**
 * Lädt eine JSON-Datei in die MongoDB hoch.
 * @param {string} filePath - Der Pfad zur JSON-Datei.
 */
async function uploadJsonFile(filePath) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("json_files");

    if (!fs.existsSync(filePath)) {
      console.error(`Datei nicht gefunden: ${filePath}`);
      return;
    }

    const jsonContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(jsonContent); // JSON in ein Objekt umwandeln

    const result = await collection.insertOne({
      fileName: filePath.split("/").pop(),
      data: jsonData, // JSON-Daten speichern
      createdAt: new Date(),
    });

    console.log(`JSON-Datei erfolgreich hochgeladen: ${filePath}, ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Fehler beim Hochladen der JSON-Datei:", error);
  }
}

/**
 * Ruft eine JSON-Datei aus der MongoDB ab und speichert sie lokal.
 * @param {string} fileName - Der Name der JSON-Datei.
 */
async function fetchJsonFile(fileName) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("json_files");

    const file = await collection.findOne({ fileName: fileName });

    if (!file) {
      console.error(`Keine Datei mit dem Namen "${fileName}" gefunden.`);
      return;
    }

    const outputPath = `./downloads/${fileName}`;
    fs.writeFileSync(outputPath, JSON.stringify(file.data, null, 2), "utf-8");
    console.log(`JSON-Datei erfolgreich abgerufen und gespeichert: ${outputPath}`);
  } catch (error) {
    console.error("Fehler beim Abrufen der JSON-Datei:", error);
  }
}

// Globale Fehlerbehandlung
process.on("uncaughtException", (err) => {
  console.error("Unbehandelter Fehler:", err);
  client.close();
  process.exit(1);
});

module.exports = {
  testDatabaseConnection,
  uploadHtmlFile,
  fetchHtmlFile,
  uploadJsonFile,
  fetchJsonFile,
};
