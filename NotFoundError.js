class NotFoundError extends Error {
    constructor(id) {
      super(`Could not find item with id ${id}`);
    }
  }
  
  module.exports = NotFoundError;