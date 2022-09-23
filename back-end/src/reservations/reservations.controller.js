const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
/**
 * List handler for reservation resources
 */

function validProperties(req, res, next) {
  const { data } = req.body;
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  const timeFormat = /\d\d:\d\d/;

  const errors = [];

  if (!data) {
    return next({
      status: 400,
      message: 'Data is missing',
    });
  }

  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = data;

  const inputTime =
    new Date(`${reservation_date} ${reservation_time}`).getHours() * 60 +
    new Date(`${reservation_date} ${reservation_time}`).getMinutes();
  const openTime = 9 * 60 + 30;
  const closeTime = 20 * 60 + 30;

  if (inputTime < openTime + 60)
    errors.push(
      'The reservation time is before 10:30 AM but the restaurant is closed before 10:30 AM.'
    );
  if (inputTime > closeTime + 60)
    errors.push(
      'The reservation time is after 9:30 PM but the restaurant closes at 10:30 PM.'
    );

  if (!first_name || first_name.trim() === '') {
    errors.push('first_name is missing or is empty');
  }

  if (!last_name || last_name.trim() === '') {
    errors.push('last_name is missing or is empty');
  }
  if (!mobile_number || mobile_number.trim() === '') {
    errors.push('mobile_number is missing or is empty');
  }

  if (
    !reservation_date ||
    reservation_date === '' ||
    !dateFormat.test(reservation_date)
  ) {
    errors.push('reservation_date is missing or is empty or is not a date');
  }

  if (new Date(reservation_date).getDay() == 1) {
    errors.push(
      'The reservation date is a Tuesday and the restaurant is closed on Tuesdays.'
    );
  }

  if (
    !reservation_time ||
    reservation_time === '' ||
    !timeFormat.test(reservation_time)
  ) {
    errors.push('reservation_time is missing or is empty or is not a time');
  }

  if (
    new Date(`${reservation_date} ${reservation_time}`).getTime() <
    new Date().getTime()
  ) {
    errors.push(
      'The reservation date/time is in the past. Only future reservations are allowed.'
    );
  }

  if (!people || typeof 1 !== typeof people || people < 1) {
    errors.push('people is missing or is zero or is not a number');
  }

  if (status === 'seated' || status === 'finished') {
    errors.push('The reservation status is "seated" or "finished"');
  }

  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(', '),
    });
  }

  next();
}

const reservationExists = async (req, res, next) => {
  const { reservationId } = req.params;
  const foundReservation = await service.read(reservationId);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation with ID ${reservationId} not found`,
  });
};

const updateStatusValidation = (req, res, next) => {
  const { status } = req.body.data;
  const validStatus = ['seated', 'booked', 'finished', 'cancelled'];
  const errors = [];
  if (!validStatus.includes(status)) {
    errors.push('unknown status received.');
  }

  if (res.locals.reservation.status === 'finished') {
    errors.push('A finished reservation cannot be updated');
  }

  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(', '),
    });
  }

  next();
};

const searchReservationExists = async (req, res, next) => {
  const { mobile_number } = req.query;
  const { date } = req.query;

  if (!mobile_number && date) {
    res.locals.reservations = await service.list(date);
    return next();
  }

  if (mobile_number && !date) {
    const foundReservations = await service.searchNum(mobile_number);
    if (foundReservations) {
      res.locals.reservations = foundReservations;
      return next();
    } else {
      res.locals.reservations = [];
      return next();
    }
  }
};

const validUpdateRes = (req, res, next) => {
  const { data } = req.body;
  if (data.status !== 'booked') {
    next({
      status: 400,
      message: 'This reservation cannot be edited.',
    });
  }
  next();
};

async function list(req, res) {
  res.json({ data: res.locals.reservations });
}

async function create(req, res) {
  const newReservation = req.body.data;
  const data = await service.create(newReservation);
  res.status(201).json({ data });
}

const read = (req, res) => {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
};

const updateStatus = async (req, res) => {
  const { status } = req.body.data;
  const { reservationId } = req.params;
  const data = await service.updateStatus(reservationId, status);
  res.json({ data });
};

const update = async (req, res) => {
  const updatedRes = req.body.data;
  const { reservationId } = req.params;
  const data = await service.update(reservationId, updatedRes);
  res.json({ data });
};

module.exports = {
  list: [asyncErrorBoundary(searchReservationExists), asyncErrorBoundary(list)],
  create: [validProperties, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    updateStatusValidation,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    validProperties,
    validUpdateRes,
    asyncErrorBoundary(update),
  ],
};