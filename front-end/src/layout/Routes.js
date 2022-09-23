import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NotFound from './NotFound';
import { today } from '../utils/date-time';

import NewReservations from './reservation/NewReservation';
import useQuery from '../utils/useQuery';
import NewTable from './tables/NewTable';
import SeatReservation from './reservation/SeatReservation';
import Search from './search/Search';
import EditReservation from './reservation/EditReservation';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get('date');

  return (
    <Switch>

      <Route exact path='/search'>
        <Search />
      </Route>

      <Route exact path='/tables/new'>
        <NewTable />
      </Route>

      <Route exact path='/reservations/:reservation_id/seat'>
        <SeatReservation />
      </Route>

      <Route exact path='/reservations/:reservation_id/edit'>
        <EditReservation />
      </Route>

      <Route exact path='/reservations/new'>
        <NewReservations />
      </Route>

      <Route exact={true} path='/'>
        <Redirect to={'/dashboard'} />
      </Route>

      <Route exact={true} path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>

      <Route path='/dashboard'>
        <Dashboard date={date || today()} />
      </Route>

      <Route>
        <NotFound />
      </Route>

    </Switch>
  );
}

export default Routes;
