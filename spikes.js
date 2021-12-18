const CsvDataRepository = require('./csvdatarepository');

const csvRepository = new CsvDataRepository('storage');

// csvRepository.readAllData('foo', 'bar').then(data => console.log(JSON.stringify(data))).catch(e => console.log(e));

// csvRepository.writeData('foo', 'bar', [{name: "Foo"}, {name: "bar"}]).then(() => console.log("DONE")).catch(e => console.log(e));

csvRepository.create('foo', 'bar', {name: "foo", value: "bar"}).then((id) => console.log(id)).catch(e => console.log(e));

csvRepository.getAll('foo', 'bar').then(data => console.log(JSON.stringify(data))).catch(e => console.log(e));