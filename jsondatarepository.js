const fs = require('fs');
const path = require('path');
const {nanoid} = require('nanoid');
const NotFoundError = require('./NotFoundError');

class JsonDataRepository {
    constructor(basePath) {
        this.basePath = basePath;
    }

    create (data, name, content) {
        return new Promise((resolve, reject) => {
            const filePath = this.getFilePath(data, name);

            const newEntry = {
                id: nanoid(),
                originalContent: content
            };

            fs.readFile(filePath, (err, data) => {
                let existingContent;

                if (err) {
                    existingContent = [];
                } else {
                    existingContent = JSON.parse(data);
                }

                existingContent.push(newEntry);

                fs.writeFile(filePath, JSON.stringify(existingContent, null, 2), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(newEntry.id);
                })
            });
        });

        
    }

    getAll(data, name) {
        return new Promise((resolve, reject) => {
            const filePath = this.getFilePath(data, name);

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    getById(data, name, id) {
        return new Promise((resolve, reject) => {
            this.getAll(data, name).then(data => {
                for (let item of data) {
                    if (item.id == id) {
                        resolve(item);
                        return;
                    }
                }

                reject(new NotFoundError(data, name, id));
            }).catch(e => {
                reject(e);
            });
        });
    }

    update(data, name, id, content) {

    }

    delete(data, name, id) {
        return new Promise((resolve, reject) => {
            this.getJsonFileContent(data, name).then(jsonData => {
                let indexOfElement = -1;
                for (let i in jsonData) {
                    if (jsonData[i].id == id) {
                        indexOfElement = i;
                        break;
                    }
                }

                if (indexOfElement == -1) {
                    reject(new NotFoundError(data, name, id));
                    return;
                }

                jsonData.splice(indexOfElement, 1);
                this.saveJsonData(data, name, jsonData).then(() => resolve()).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }
    
    getFilePath(data, name) {
        const fileName = `${data}-${name}.json`;
        return path.join(this.basePath, fileName);
    }

    getJsonFileContent(data, name) {
        return new Promise((resolve, reject) => {
            const filePath = this.getFilePath(data, name);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                }

                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    saveJsonData(data, name, jsonData) {
        return new Promise((resolve, reject) => {
            const filePath = this.getFilePath(data, name);
            fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            })
        });
    }
}

module.exports = JsonDataRepository;