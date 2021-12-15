const fs = require('fs');
const path = require('path');
const {nanoid} = require('nanoid');

class JsonDataRepository {
    constructor(basePath) {
        this.basePath = basePath;
    }

    create (data, name, content, doneCallback) {
        const filePath = this.getFilePath(data, name);

        const newEntry = {
            id: nanoid(),
            content: content
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
                    console.log('Could not save data');
                    console.log(e);
                    doneCallback(null);
                    return;
                }

                doneCallback(newEntry.id);
            })
        });
    }

    getAll(data, name, doneCallback) {
        const filePath = this.getFilePath(data, name);
        fs.readFile(filePath, (err, data) => {
            if (err || !data) {
                doneCallback(null);
                return;
            }

            doneCallback(JSON.parse(data));

        });
    }

    getById(data, name, id, doneCallback) {
        this.getAll(data, name, (data) => {
            for (let item of data) {
                if (item.id == id) {
                    doneCallback(item);
                    return;
                }
            }

            doneCallback(null);
        });
    }

    getFilePath(data, name) {
        const fileName = `${data}-${name}.json`;
        return path.join(this.basePath, fileName);
    }

    getFileContentAsJ 
}

module.exports = JsonDataRepository;