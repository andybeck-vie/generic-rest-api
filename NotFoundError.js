class NotFoundError extends Error {
    constructor(data, name, id) {
      super(`Could not find item with id ${id} (data ${data}, name ${name})`);
    }
  }
  
  module.exports = NotFoundError;