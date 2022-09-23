import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';

import "./ReservationForm.css"

const ReservationForm = ({ onSubmit, initialFormState, edit }) => {
    const history = useHistory();
    const [formData, setFormData] = useState({ ...initialFormState });
    const [error, setError] = useState(null);

    const handleChange = ({ target }) => {
    setFormData({
        ...formData,
        [target.name]:
        target.name === 'people' ? Number(target.value) : target.value,
    });
};

const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    onSubmit(formData, abortController.signal)
        .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
        .catch(setError);
};

    const cancelHandler = () => history.goBack();

return (
        <main>
        <div className="d-flex flex-column mb-3">
        <h1 className="display-3"><center>{edit ? 'Edit Reservation' : 'New Reservation'}</center></h1>
        <ErrorAlert error={error} />
            <form
                onSubmit={handleSubmit}
                className="align-self-center col-10 col-xl-5"
            >
            <fieldset className="d-flex flex-column ">

            <div className="form-group">
                <label name="first_name">First Name</label>
                <input
                    className="form-control"
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    onChange={handleChange}
                    required="required"
                    value={formData.first_name}
                />
            </div>
            <div className="form-group">
                <label name="last_name">Last Name</label>
                <input
                    className="form-control"
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    onChange={handleChange}
                    required="required"
                    value={formData.last_name}
                />
            </div>
            <div className="form-group">
                <label name="mobile_number">Mobile Phone Number</label>
                <input
                    className="form-control"
                    type="text"
                    name="mobile_number"
                    id="mobile_number"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    required="required"
                    value={formData.mobile_number}
                />
            </div>
            <div className="form-group">
                <label name="reservation_date">Reservation Date</label>
                <input
                    className="form-control"
                    type="date"
                    name="reservation_date"
                    id="reservation_date"
                    onChange={handleChange}
                    required="required"
                    value={formData.reservation_date}
                />
            </div>
            <div className="form-group">
            <label name="reservation_time">Reservation Time</label>
                <input
                    className="form-control"
                    type="time"
                    name="reservation_time"
                    id="reservation_time"
                    onChange={handleChange}
                    required="required"
                    value={formData.reservation_time}
                />
            </div>
            <div className="form-group">
                <label name="people">Number of People in Party</label>
                <input
                    className="form-control"
                    type="number"
                    name="people"
                    id="people"
                    placeholder="2"
                    onChange={handleChange}
                    required="required"
                    value={formData.people}
                />
            </div>
            </fieldset>
            <div className = "button-group">
            <button className="btn btn-dark" type="submit">Submit</button>
            <button className="btn btn-dark mx-3" type="button" onClick={cancelHandler} >Cancel</button>        
        </div>
        </form>
        </div>
    </main>
    )
    }  
    //format : make buttons side by side
    //try and center the new reservation title
    

export default ReservationForm;