import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readReservation, updateReservation } from '../../utils/api';
import ErrorAlert from '../ErrorAlert';
import ReservationForm from './ReservationForm';

const EditReservation = () => {
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 1,
    });

    const [error, setError] = useState(null);
    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setError);
    return () => abortController.abort();
}

    const form = reservation.reservation_id ? (
        <ReservationForm
            onSubmit={updateReservation}
            initialFormState={reservation}
            edit
        />
    ) : (
    <p>Loading...</p>
);

return (
    <>
        <ErrorAlert error={error} />
        {form}
    </>
    );
};

export default EditReservation;