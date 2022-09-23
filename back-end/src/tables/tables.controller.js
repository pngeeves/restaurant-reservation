const service = require('./tables.service');
const reservationsService = require('../reservations/reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const { table } = require('../db/connection');

const tableExistsToDelete = async (req, res, next) => {
  const { tableId } = req.params;
  const foundTable = await service.read(tableId);

  if (foundTable && !foundTable.reservation_id) {
    return next({
      status: 400,
      message: `table_id, ${tableId}, is not occupied`,
    });
  }

  if (foundTable) {
    res.locals.table = foundTable;
    return next();
  }

  next({
    status: 404,
    message: `Table with ID ${tableId} not foundTable.`,
  });
};

const validBodyProperties = (req, res, next) => {
  const { data } = req.body;

  if (!data) {
    return next({
      status: 400,
      message: 'Data is missing',
    });
  }

  const { table_name, capacity } = data;
  const errors = [];

  if (!table_name || table_name.trim() === '' || table_name.length === 1) {
    errors.push(
      'table_name is missing or is empty or is not more than 1 character'
    );
  }

  if (!capacity || capacity < 1 || typeof 1 !== typeof capacity) {
    errors.push(
      'capacity must be greater than or equal to 1 and must be a number'
    );
  }

  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(', '),
    });
  }

  next();
};

const validUpdateBody = async (req, res, next) => {
  if (!req.body.data) {
    return next({
      status: 400,
      message: 'Data is missing',
    });
  }

  const { reservation_id } = req.body.data;
  const { tableId } = req.params;

  if (!reservation_id || !tableId) {
    return next({
      status: 400,
      message: 'reservation_id and/or table_id are missing',
    });
  }

  const foundReservation = await reservationsService.read(reservation_id);
  const foundTable = await service.read(tableId);
  const errors = [];

  if (foundTable.reservation_id) {
    return next({
      status: 400,
      message: `Table with ID ${tableId} is occupied`,
    });
  }

  if (foundReservation && foundTable) {
    if (foundReservation.people > foundTable.capacity) {
      errors.push(
        'Table capacity is less than the number of people in the reservation'
      );
    } else {
      res.locals.reservation = foundReservation;
      res.locals.table = foundTable;
    }
  } else {
    return next({
      status: 404,
      message: `table_id, ${tableId}, or reservation_id, ${reservation_id}, not found`,
    });
  }

  if (foundReservation.status === 'seated') {
    errors.push('Reservation is already seated');
  }

  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(', '),
    });
  }

  next();
};

const create = async (req, res) => {
  const newTable = {
    ...req.body.data,
  };
  const data = await service.create(newTable);
  res.status(201).json({ data });
};

const list = async (req, res) => {
  const data = await service.list();
  res.json({ data });
};

const update = async (req, res) => {
  const table = res.locals.table;
  const reservation = res.locals.reservation;

  const data = await service.update(table.table_id, reservation.reservation_id);
  res.json({ data });
};

const destroy = async (req, res) => {
  const data = await service.destroy(
    res.locals.table.table_id,
    res.locals.table.reservation_id
  );
  res.json({ data });
};

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validBodyProperties, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(validUpdateBody), asyncErrorBoundary(update)],
  destroy: [
    asyncErrorBoundary(tableExistsToDelete),
    asyncErrorBoundary(destroy),
  ],
};