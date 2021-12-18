# generic-rest-api
Erstelle einen HTTP-Server mit NodeJS für eine CRUD-APi (RESTful).

Die Umsetzung sollte möglichst flexibel und für unterschiedliche Daten-Endpoints nutzbar sein.

Beispiel: Geburtstage
http://localhost:20001/crudapi/DATA/NAME/(ID)
DATA = birthday
NAME = anna

CRUD-Funktionen (Restful):

- [x] Create: POST-Request mit Daten, ID im Response
- [x] Read: GET-Request liefert alle Datensätze oder nur einen (ID)
- [x] Update: PUT-Request mit ID führt Update mit allen Daten aus, 
- [x] PATCH-Request mit ID macht Update nur auf gesendeten Daten
- [x] Delete: DELETE-Request mit ID entfernt Datensatz

- [x] Daten werden am Server in JSON-Dateien gespeichert.
Beispiel: birthday-anna.json

- [x] Der Response hat unterschiedliche HTTP-Status-Codes
- [x] 200 OK (bei GET Requests)
- [x] 201 Created (neuer Datensatz wurde erzeugt, Antwort enthält zusätzlich ID des Datensatzes)
- [ ] 202 Accepted (Datensatz wurde geändert, Antwort enthält zusätzlich ID des Datensatzes)
- [x] 204 No Content (Datensatz wurde erfolgreich gelöscht)
- [x] 404 Not found (wenn ein Datensatz mit bestimmter ID nicht gefunden wurde, oder PUT/DELETE ohne id aufgerufen wurde)
- [x] 405 Method Not Allowed (falsche Methode)



Zusatzaufgabe:
- Daten sollen am Server in CSV statt in JSON Dateien gespeichert werden, so kann der Kunde sie leichter bearbeiten
- es soll eine Möglichkeit zum Download der CSV-Datei geben
- geänderte CSV Daten können wieder upgeloadet werden
