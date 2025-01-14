Folgende Funktionen wurden in database.js vordefiniert:

Verbindung testen:
testDatabaseConnection().catch(console.error);

HTML-Datei hochladen:
uploadHtmlFile('./path/to/your/file.html').catch(console.error);

HTML-Datei abrufen:
fetchHtmlFile('example.html').catch(console.error);

JSON-Datei hochladen:
uploadJsonFile('./path/to/your/file.json').catch(console.error);

JSON-Datei abrufen:
fetchJsonFile('example.json').catch(console.error);