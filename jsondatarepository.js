const fs = require('fs');
const path = require('path');
const {nanoid} = require('nanoid');

class JsonDataRepository {
    constructor(basePath) {
        this.basePath = basePath;
    }

    create (data, name, content, doneCallback) {

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

                resolve(null);
            }).catch(e => {
                reject(e);
            });
        });
    }
    
    getFilePath(data, name) {
        const fileName = `${data}-${name}.json`;
        return path.join(this.basePath, fileName);
    }

    getFileContentAsJ 
}

module.exports = JsonDataRepository;