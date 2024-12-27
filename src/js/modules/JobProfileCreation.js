const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get('/JobProfileCreation', async (req, res) => {
    console.log("Received request for /JobProfileCreation");
    try {
        console.log("Beginne mit dem Lesen der Dateien...");

        const baseDir = path.join(__dirname, '../../../src/Background Knowledge');
        const departmentPath = path.join(baseDir, 'department.html');
        const jobProfilePath = path.join(baseDir, 'jobprofile.html');
        const seniorityLevelPath = path.join(baseDir, 'senioritylevel.html');

        const department = fs.readFileSync(departmentPath, 'utf-8').trim();
        const jobProfile = fs.readFileSync(jobProfilePath, 'utf-8').trim();
        const seniorityLevel = fs.readFileSync(seniorityLevelPath, 'utf-8').trim();

        console.log("Abteilung erfolgreich geladen:", department.substring(0, 100));
        console.log("Jobprofil erfolgreich geladen:", jobProfile.substring(0, 100));
        console.log("Erfahrungsstufe erfolgreich geladen:", seniorityLevel.substring(0, 100));

        console.log("Sende Anfrage an die OpenAI-API...");

        const messages = [
            {
                role: "system",
                content: "You are a professional assistant. Always respond in English, regardless of the input language."
            },
            {
                role: "user",
                content: `
                    Please generate a job advertisement in HTML format based on the following input data:

                    Department: ${department}
                    Job Profile: ${jobProfile}
                    Seniority Level: ${seniorityLevel}

                    Important: Provide the job advertisement strictly in HTML format and include the following sections:
                    - Job Title
                    - Job Overview
                    - Key Responsibilities
                    - Required Skills and Qualifications
                    - Preferred Qualifications
                    - Work Environment
                    Ensure that each section is detailed and complete.
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

        const jobAdvertisement = response.data.choices[0].message.content.trim();

        console.log("Generierte Jobanzeige:", jobAdvertisement);

        res.send(jobAdvertisement);
    } catch (error) {
        console.error("Fehler:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).send(`Ein Fehler ist aufgetreten: ${error.message}`);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
