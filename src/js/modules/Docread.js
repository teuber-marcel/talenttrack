const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const tesseract = require('tesseract.js');
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const upload = multer({ dest: 'uploads/' });

app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.file.path;
        console.log("Datei erfolgreich hochgeladen:", imagePath);

        // Überprüfen, ob die hochgeladene Datei ein PDF ist
        if (req.file.mimetype === 'application/pdf') {
            const jpgPath = imagePath.replace(/\.pdf$/, '.jpg');
            await new Promise((resolve, reject) => {
                exec(`convert -density 300 ${imagePath} -quality 90 ${jpgPath}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Fehler bei der PDF-Konvertierung: ${stderr}`);
                    } else {
                        console.log("PDF erfolgreich in JPG konvertiert:", jpgPath);
                        imagePath = jpgPath;
                        resolve();
                    }
                });
            });
        }

        // Bild mit Tesseract in Text umwandeln
        const { data: { text } } = await tesseract.recognize(imagePath, 'eng');
        console.log("Erkannter Text:", text);

        // Anfrage an die OpenAI-API senden
        const messages = [
            {
                role: "system",
                content: "You are a professional assistant. Always respond in English."
            },
            {
                role: "user",
                content: `
                    Please convert the following text in nice html format and fill missing parts which are missed because of the image to text tool:

                    ${text}
                `
            }
        ];

        console.log("Anfrage-Nachricht an die API:", JSON.stringify(messages, null, 2));

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Vollständige Antwort der OpenAI-API:", JSON.stringify(response.data, null, 2));

        const htmlOutput = response.data.choices[0].message.content.trim();

        console.log("Generierte HTML-Ausgabe:", htmlOutput);

        res.send(htmlOutput);

        // Hochgeladene Datei löschen
        fs.unlinkSync(imagePath);
        if (req.file.mimetype === 'application/pdf') {
            fs.unlinkSync(req.file.path); // Lösche auch die ursprüngliche PDF-Datei
        }
    } catch (error) {
        console.error("Fehler:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).send("Ein Fehler ist aufgetreten.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
