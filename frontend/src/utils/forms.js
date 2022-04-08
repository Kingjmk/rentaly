import React, {Text} from 'react';
import Alert from '@mui/material/Alert';

export const hasError = (value) => value !== undefined;


export const getErrorMessage = (value) => {
  if (!hasError(value)) return null;

  if (Array.isArray(value)) {
    return value.reduce((a, b) => `${a}, ${b}`);
  }

  return value;
};

export const ErrorAlert = ({error, label}) => {
  if (!hasError(error)) return null;

  let errors = [];

  if (typeof error === 'string') {
    errors.push(error);
  } else {
    errors = error;
  }

  return (
    <Alert severity='error'>
      {errors.map((message, index) => (<div key={index}>{message}</div>))}
    </Alert>
  );
}

export const SuccessAlert = ({isSuccessful, message = 'Success'}) => {
  if (!isSuccessful) return null;

  return (
    <Alert severity='success'>
      <div>{message}</div>
    </Alert>
  );
}
