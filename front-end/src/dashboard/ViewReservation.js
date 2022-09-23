import React from 'react';
import { Link } from 'react-router-dom';
import { updateStatus } from '../utils/api';
import './ViewReservation.css';

const ViewReservation = ({
    reservations,
    loadDashboard,
    setReservationsError,
}) => {
    const cancelRes = () => {
        const abortController = new AbortController();
        const cancelConfirm = window.confirm('Do you want to cancel this reservation?\n\nThis cannot be undone.');
    if (cancelConfirm) {
        updateStatus(
            reservations.reservation_id,
            { status: 'cancelled' },
            abortController.signal
        )
            .then(loadDashboard)
            .catch(setReservationsError);
        }
};

return (
    <div className='reservation'>
        <div className='reservation__container'>
            <div className='reservation__info'>
            <p className='reservation__name'>
                Name: {reservations.first_name} {reservations.last_name}
            </p>
            <p className='reservation__number'>
                Mobile Number: {reservations.mobile_number}
            </p>
            <p className='reservation__time'>
                Time: {reservations.reservation_time}
            </p>
            <p className='reservation__size'>Size: {reservations.people}</p>
            <p
                className='reservation__status'
                data-reservation-id-status={reservations.reservation_id}
            >
                Status: {reservations.status}
            </p>
            </div>
        <div className='reservation__btnGroup'>
            {reservations.status === 'booked' && (
            <Link to={`/reservations/${reservations.reservation_id}/seat`}>
                <button className='btn btn-primary custom1'>Seat</button>
            </Link>
        )}
            <Link to={`/reservations/${reservations.reservation_id}/edit`}>
            <button className='btn btn-warning custom1'>Edit</button>
            </Link>
        <button
            data-reservation-id-cancel={reservations.reservation_id}
            className='btn btn-danger custom1'
            onClick={cancelRes}
        >
            Cancel
        </button>
        </div>
    </div>
</div>
);
};

export default ViewReservation;