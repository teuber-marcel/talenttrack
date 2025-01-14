const path = require('path');
const envPath = path.resolve(__dirname, './.env'); // Corrected path to .env file
console.log("Loading .env from:", envPath); // Debug-Ausgabe
const dotenv = require('dotenv');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("Error loading .env file:", result.error);
} else {
    console.log("Loaded .env file:", result.parsed);
    console.log("Environment Variables:", process.env); // Debug-Ausgabe
}

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not defined. Please check your .env file.");
    process.exit(1);
}
console.log("Loaded OPENAI_API_KEY:", OPENAI_API_KEY); // Debug-Ausgabe

async function calculateSuitabilityScore(cv, motivationalLetter, position) {
    console.log("Sende Anfrage an die OpenAI-API...");

    const messages = [
        {
            role: "system",
            content: "You are a professional assistant. Always respond in English, regardless of the input language."
        },
        {
            role: "user",
            content: `
                Based on the following data, provide a suitability score as a single numeric value between 0 and 100, 
                where 0 indicates no suitability and 100 indicates perfect suitability:

                CV: ${cv}
                Motivational Letter: ${motivationalLetter}
                Target Position: ${position}

                Respond with only the numeric score, no explanations or additional text.
            `
        }
    ];

    console.log("Anfrage-Nachricht an die API:", JSON.stringify(messages, null, 2));

    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 50,
            temperature: 0.0
        },
        {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    console.log("Vollständige Antwort der OpenAI-API:", JSON.stringify(response.data, null, 2));

    const score = response.data.choices[0].message.content.trim();

    console.log("Generierter Score:", score);

    return score;
}

app.get('/generate-suitability-score', async (req, res) => {
    try {
        console.log("Beginne mit dem Lesen der Dateien...");

        const baseDir = path.join(__dirname, '../Background Knowledge');
        const cvPath = path.join(baseDir, 'CV.html');
        const motivationalLetterPath = path.join(baseDir, 'MV.html');
        const positionPath = path.join(baseDir, 'Position.html');

        if (!fs.existsSync(cvPath) || !fs.existsSync(motivationalLetterPath) || !fs.existsSync(positionPath)) {
            throw new Error("Eine oder mehrere Dateien fehlen.");
        }

        const cv = fs.readFileSync(cvPath, 'utf-8').trim();
        const motivationalLetter = fs.readFileSync(motivationalLetterPath, 'utf-8').trim();
        const position = fs.readFileSync(positionPath, 'utf-8').trim();

        console.log("CV erfolgreich geladen:", cv.substring(0, 100));
        console.log("Motivationsschreiben erfolgreich geladen:", motivationalLetter.substring(0, 100));
        console.log("Positionsbeschreibung erfolgreich geladen:", position.substring(0, 100));

        const score = await calculateSuitabilityScore(cv, motivationalLetter, position);

        res.send(score); // Nur die Zahl wird zurückgegeben
    } catch (error) {
        console.error("Fehler:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).send("Ein Fehler ist aufgetreten.");
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
