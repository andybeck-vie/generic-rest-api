const express = require('express');
const app = express();
const {returnNotFoundResponse, returnServerErrorResponse, returnErrorResponse, endResponse, returnNotAllowedResponse} = require('./responsehelper');

app.use(express.json());

const path = require('path');

const JsonDataRepository = require('./jsondatarepository');
const jsonDataRepository = new JsonDataRepository(path.join('storage', 'json'));

const port = process.env.PORT || 9001;

app.listen(port, () => console.log(`Server started on port ${port}`));

app.route('/json/:data/:name')
    .get((request, response) => {
        console.log('GET ' + request.originalUrl);

        jsonDataRepository.getAll(request.params.data, request.params.name)
            .then(data => {
                response.send(data);
            }).catch(e => {
                returnErrorResponse(e, response);
            });
}).post((request, response) => {
    console.log('POST ' + request.originalUrl);

    jsonDataRepository.create(request.params.data, request.params.name, request.body)
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


app.route('/json/:data/:name/:id')
    .get((request, response) => {
        console.log('GET ' + request.originalUrl);

        jsonDataRepository.getById(request.params.data, request.params.name, request.params.id)
            .then(data => {
                response.send(JSON.stringify(data.originalContent));
            }).catch(e => {
                returnErrorResponse(e, response);
            });
}).put((request, response) => {

}).patch((request, response) => {

}).delete((request, response) => {
    console.log('DELETE ' + request.originalUrl);

    jsonDataRepository.delete(request.params.data, request.params.name, request.params.id)
        .then(() => endResponse(204, 'DELETED', response))
        .catch(e => returnErrorResponse(e, response));

}).all((request, response) => {
    returnNotAllowedResponse(response);
});
