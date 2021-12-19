const fs = require('fs');
const path = require('path');
const {nanoid} = require('nanoid');
const {getElement, getIndexOfElement} = require('../helpers/repositoryhelpers');
const fastcsv = require('fast-csv');

class CsvDataRepository {
    constructor(basePath) {
        this.basePath = basePath;
    }

    create (data, name, content) {
        const filePath = this.getFilePath(data, name);

        return new Promise((resolve, reject) => {
            this.createFileIfNotExistsSync(filePath);
            
            this.readAllData(filePath).then(allData => {
                content.id = nanoid();
                allData.push(content);
                this.writeData(data, name, allData).then(() => resolve(content.id)).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }

    getAll(data, name) {
        const filePath = this.getFilePath(data, name);

        return this.readAllData(filePath);
    }

    getById(data, name, id) {
        const filePath = this.getFilePath(data, name);

        return new Promise((resolve, reject) => {
            this.readAllData(filePath).then(data => {
                const item = getElement(data, id);
                resolve(item);
            }).catch(e => {
                reject(e);
            });
        });
    }

    updateFull(data, name, id, content) {
        const filePath = this.getFilePath(data, name);

        return new Promise((resolve, reject) => {
            this.readAllData(filePath).then(allData => {
                let indexOfElement = getIndexOfElement(allData, id);

                if (!content.id) {
                    content.id = id;
                }

                allData[indexOfElement] = content;
                this.writeData(data, name, allData).then(() => resolve()).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }

    updatePartial(data, name, id, content) {
        const filePath = this.getFilePath(data, name);

        return new Promise((resolve, reject) => {
            this.readAllData(filePath).then(allData => {
                let indexOfElement = getIndexOfElement(allData, id);

                allData[indexOfElement] = {...allData[indexOfElement], ...content};
                this.writeData(data, name, allData).then(() => resolve()).catch(e => reject(e));
            }).catch(e => reject(e));
        })
    }

    delete(data, name, id) {
        const filePath = this.getFilePath(data, name);

        return new Promise((resolve, reject) => {
            this.readAllData(filePath).then(allData => {
                let indexOfElement = getIndexOfElement(allData, id);

                âllData.splice(indexOfElement, 1);
                this.writeData(data, name, allData).then(() => resolve()).catch(e => reject(e));
            }).catch(e => reject(e));
        });
    }

    getCsvContent(data, name) {
        const filePath = this.getFilePath(data, name);

        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({fileName: path.parse(filePath).base, content: data});
            })
        });
    }

    readAllData(filePath) {
        return new Promise((resolve, reject) => {
            let content = [];

            fs.createReadStream(filePath)
                .pipe(fastcsv.parse({headers: true}))
                .on('error', err => reject(err))
                .on('data', row => content.push(row))
                .on('end', () => resolve(content))
        });
    }

    writeData(data, name, content) {
        const filePath = this.getFilePath(data, name);
        
        return new Promise((resolve, reject) => {

            const writeStream = fs.createWriteStream(filePath);
            const csvStream = fastcsv.format({ headers: true });
            csvStream.pipe(writeStream).on('end', () => writeStream.close());

            for (let item of content) {
                csvStream.write(item);
            }

            resolve();
        });
    }

    getFilePath(data, name) {
        const fileName = `${data}-${name}.csv`;
        return path.join(this.basePath, fileName);
    }

    createFileIfNotExistsSync(filePath) {
        if (fs.existsSync(filePath)) {
            return;
        }

        fs.writeFileSync(filePath, '');
    }

    getElement(data, id) {
        const index = this.getIndexOfElement(data, id);
        return jsonData[index];
    }
}

module.exports = CsvDataRepository;