import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { searchReservations } from '../../utils/api';
import ErrorAlert from '../ErrorAlert';
import SearchResults from './SearchResults';

import "./Search.css"

const Search = () => {
    
const history = useHistory();

const [mobileNumber, setMobileNumber] = useState('');
const [phone, setPhone] = useState('');
const [refresh, setRefresh] = useState(false);
const [error, setError] = useState(null);
const [results, setResults] = useState([]);
const [display, setDisplay] = useState(false);

const changeHandler = ({ target }) => {
    setMobileNumber(target.value);
};

const handleSubmit = (e) => {
    e.preventDefault();
    setRefresh(true);
    setPhone(mobileNumber);
    search();
};

const search = () => {
    const abortController = new AbortController();
    if (phone) {
        searchReservations(phone, abortController.signal)
            .then(setResults)
            .then(() => setRefresh(false))
            .then(() => setDisplay(true))
            .catch(setError);
        }
};

useEffect(search, [refresh, phone]);

const cancelHandler = () => history.goBack();

const searchResults = results?.length ? (
    <div className='search__results'>
        {results.map((reservation) => (
        <SearchResults
            key={reservation.reservation_id}
            reservation={reservation}
            setError={setError}
            setRefresh={setRefresh}
        />
    ))}
    </div>
    ) : (
    <p className='search_resultsNotFound'>{`No reservations found for mobile number ${mobileNumber}`}</p>
);

return (
    <div className='search'>
        <div className='search__container'>
            <h1 class="display-3">Search for Reservation</h1>
                <ErrorAlert error={error} />
                    <form className='search__form' onSubmit={handleSubmit}>
                        <div className='search__formGroup'>
                            <label htmlFor='mobile_number'>Mobile Number</label>
                                <input
                                    type='text'
                                    name='mobile_number'
                                    placeholder="Enter a customer's phone number"
                                    value={mobileNumber}
                                    onChange={changeHandler}
                                />
                            </div>
                        <div className='search__formBtns'>
                        <button className='btn btn-dark custom' onClick={cancelHandler} type='button'>Cancel</button>
                        <button className='btn btn-dark mx-3 custom' type='submit'>Find</button>
                    </div>
                </form>
            {display && searchResults}
        </div>
    </div>
);
};

export default Search;