const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Product');

const create = require('./create');
const update = require('./update');
const remove = require('./remove');
const paginatedList = require('./paginatedList');
const read = require('./read');
const summary = require('./summary');

methods.create = create;
methods.update = update;
methods.delete = remove;
methods.list = paginatedList;
methods.read = read;
methods.summary = summary;

module.exports = methods; 