import React from 'react';
import ErrorAlert from '../layout/ErrorAlert';
import './Tables.css';

const Tables = ({ tables = [], finished, tablesError }) => {
    const finishBtn = ({ target }) => {
        const tableId = target.dataset.tableIdFinish;
        const confirmFinish = window.confirm('Is this table ready to seat new guests? \n\nThis cannot be undone.');
    if (confirmFinish) {
        finished(tableId);
    }
};

return (
    <div className='tables'>
        <ErrorAlert error={tablesError} />
            <h4 className='mt-4 mb-2'>Tables</h4>

        <div className='tablesSection'>
            {tables.map((table) => (
                <div key={table.table_id} className='tableCard'>
            <p className='tableHeader'>{table.table_name}</p>
                {table.reservation_id ? (
            <p style={{ color: 'red' }} data-table-id-status={table.table_id}>
                occupied
            </p>
            ) : (
            <p
                style={{ color: 'green' }}
                data-table-id-status={table.table_id}
            >
                free {table.table_id}
            </p>
            )}
            {table.reservation_id && (
            <button
                className='btn btn-danger mb-3 mt-1'
                data-table-id-finish={table.table_id}
                onClick={finishBtn}
                type='button'
            >
                Finish
            </button>
        )}
            </div>
        ))}
    </div>
    </div>
);
};

export default Tables;