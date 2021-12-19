const express = require('express');
const fs = require('fs');
const path = require('path');
const JsonDataRepository = require('./repositories/jsondatarepository');
const CsvDataRepository = require('./repositories/csvdatarepository');
const {returnNotFoundResponse, returnServerErrorResponse, returnErrorResponse, endResponse, returnNotAllowedResponse} = require('./helpers/responsehelper');
const req = require('express/lib/request');

const port = process.env.PORT || 9001;
const app = express();
app.use(express.static('static'));
app.use(express.json());

const jsonDataRepository = new JsonDataRepository(path.join('storage', 'json'));
const csvDataRepository = new CsvDataRepository(path.join('storage', 'csv'));

app.listen(port, () => console.log(`Server started on port ${port}`));

app.route('/api/:type/:data/:name')
    .get((request, response) => {
        console.log('GET ' + request.originalUrl);

        const repository = getRepository(request.params.type);
        if (repository == null) {
            returnNotAllowedResponse(response);
            return;
        }

        repository.getAll(request.params.data, request.params.name)
            .then(data => {
                response.send(data);
            }).catch(e => {
                returnErrorResponse(e, response);
            });
}).post((request, response) => {
    console.log('POST ' + request.originalUrl);

    const repository = getRepository(request.params.type);
    if (repository == null) {
        returnNotAllowedResponse(response);
        return;
    }

    repository.create(request.params.data, request.params.name, request.body)
        .then(id => {
            endResponse(201, id, response);
        }).catch(e => {
            returnErrorResponse(e, response);
        });
}).put((request, response) => {
    returnNotFoundResponse(response);
})
.patch((request, response) => {
    returnNotFoundResponse(response);
}).all((request, response) => {
    returnNotAllowedResponse(response);
});

app.route('/api/:type/:data/:name/:id')
    .get((request, response) => {
        console.log('GET ' + request.originalUrl);

        const repository = getRepository(request.params.type);
        if (repository == null) {
            returnNotAllowedResponse(response);
            return;
        }

        repository.getById(request.params.data, request.params.name, request.params.id)
            .then(data => {
                response.send(JSON.stringify(data));
            }).catch(e => {
                returnErrorResponse(e, response);
            });
}).put((request, response) => {
    console.log('PUT ' + request.originalUrl);

    const repository = getRepository(request.params.type);
    if (repository == null) {
        returnNotAllowedResponse(response);
        return;
    }

    repository.updateFull(request.params.data, request.params.name, request.params.id, request.body)
        .then(() => endResponse(202, request.params.id, response))
        .catch(e => returnErrorResponse(e, response));
}).patch((request, response) => {
    console.log('PATCH ' + request.originalUrl);

    const repository = getRepository(request.params.type);
    if (repository == null) {
        returnNotAllowedResponse(response);
        return;
    }

    repository.updatePartial(request.params.data, request.params.name, request.params.id, request.body)
        .then(() => endResponse(202, request.params.id, response))
        .catch(e => returnErrorResponse(e, response));

}).delete((request, response) => {
    console.log('DELETE ' + request.originalUrl);

    const repository = getRepository(request.params.type);
    if (repository == null) {
        returnNotAllowedResponse(response);
        return;
    }
    
    repository.delete(request.params.data, request.params.name, request.params.id)
        .then(() => endResponse(204, 'DELETED', response))
        .catch(e => returnErrorResponse(e, response));

}).all((request, response) => {
    returnNotAllowedResponse(response);
});

app.route('/backend/download/csv/:filename')
    .get((request, response) => {
        const filePath = path.join(__dirname, 'storage', 'csv', request.params.filename);
        response.sendFile(filePath);
    }).all((request, response) => {
        returnNotAllowedResponse(response);
    });

app.route('/backend/csv/file-list')
    .get((request, response) => {
        fs.readdir(path.join('storage', 'csv'), (err, files) => {
            if (err) {
                returnErrorResponse(err, response);
                return;
            }

            response.send(files);
        })
    });


const getRepository = (type) => {
    switch (type) {
        case 'json':
            return jsonDataRepository;
        case 'csv':
            return csvDataRepository;
        default:
            return null;
    }
}