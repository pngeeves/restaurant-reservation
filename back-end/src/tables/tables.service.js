const knex = require('../db/connection');
const reservationsService = require('../reservations/reservations.service');

const create = (newTable) => {
  return knex('tables')
    .insert(newTable, '*')
    .then((rows) => rows[0]);
};

const list = () => {
  return knex('tables').orderBy('table_name');
};

const read = (table_id) => {
  return knex('tables').where({ table_id }).first();
};

const update = (table_id, reservation_id) => {
  return knex('tables')
    .where({ table_id })
    .update({ reservation_id }, '*')
    .then((rows) => rows[0])
    .then(() => reservationsService.updateStatus(reservation_id, 'seated'));
};

const destroy = (table_id, reservation_id) => {
  return knex('tables')
    .where({ table_id })
    .update('reservation_id', null)
    .then(() => reservationsService.updateStatus(reservation_id, 'finished'));
};

module.exports = {
  list,
  create,
  read,
  update,
  destroy,
};