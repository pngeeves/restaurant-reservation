import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  return (
    error && (
      <div className='alert alert-danger m-2'>
        Error:{' '}
        <ul>
          {error.message.split(',').map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
    )
  );
}

export default ErrorAlert;
