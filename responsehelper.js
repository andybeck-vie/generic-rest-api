const { response } = require('express');
const NotFoundError = require('./NotFoundError');

const returnNotFoundResponse = (response) => {
    endResponse(404, 'NOT_FOUND', response);
}

const returnServerErrorResponse = (response) => {
    endResponse(500, 'ERROR', response);
}

const returnNotAllowedResponse = (response) => {
    endResponse(405, 'NOT_ALLOWED', response);
}

const returnErrorResponse = (error, response) => {
    console.log(error);
    if (error instanceof NotFoundError) {
        returnNotFoundResponse(response);
        return;    
    }
    
    returnServerErrorResponse(response);
};

const endResponse = (status, message, response) => {
    response.status(status);
    response.send(message);
}

module.exports = {
    returnNotFoundResponse, returnErrorResponse, returnServerErrorResponse, endResponse, returnNotAllowedResponse
};