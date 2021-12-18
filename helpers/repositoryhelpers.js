const NotFoundError = require('../repositories/NotFoundError');

const getElement = (data, id) => {
    const index = getIndexOfElement(data, id);
    return data[index];
}

const getIndexOfElement = (data, id) => {
    let indexOfElement = -1;
    for (let i in data) {
        if (data[i].id == id) {
            indexOfElement = i;
            break;
        }
    }

    if (indexOfElement == -1) {
        throw new NotFoundError(id);
    }

    return indexOfElement;
}

module.exports = {
    getElement, getIndexOfElement
}