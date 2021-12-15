const express = require('express');
const req = require('express/lib/request');
const app = express();

app.use(express.json());

const path = require('path');

const JsonDataRepository = require('./jsondatarepository');
const jsonDataRepository = new JsonDataRepository(path.join('storage', 'json'));

const port = process.env.PORT || 9001;

app.listen(port, () => console.log(`Server started on port ${port}`));

app.get('/json/:data/:name', (request, response) => {
    console.log('GET ' + request.originalUrl);

    jsonDataRepository.getAll(request.params.data, request.params.name, (jsonData) => {
        if (jsonData == null) {
            response.status(404);
            response.send('NOT_FOUND');
            return;
        }

        response.send(jsonData);
    });
});

app.get('/json/:data/:name/:id', (request, response) => {
    console.log('GET ' + request.originalUrl);

    jsonDataRepository.getById(request.params.data, request.params.name, request.params.id, (data) => {
        if (data == null) {
            response.status(404);
            response.send('NOT_FOUND');
            return;
        }

        response.send(JSON.stringify(data));
    });
});

app.post('/json/:data/:name', (request, response) => {
    console.log('POST ' + request.originalUrl);

    jsonDataRepository.create(request.params.data, request.params.name, request.body, (id) => {
        if (id == null) {
            response.status(500);
            response.send('Error');
            return;
        }

        response.status(201);
        response.send(id);
    });
});