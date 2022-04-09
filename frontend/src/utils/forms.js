import React from 'react';
import {Alert} from '@mui/material';

export const hasError = (value) => value !== undefined;


const TextArrayLineBreak = ({array}) => (
  <>
    {array.reduce((m1, m2) => (
      <>
        {m1} <br/>
        {m2}
      </>
    ))}
  </>
);

export const getErrorMessage = (value) => {
  if (!hasError(value)) return null;

  if (Array.isArray(value)) {
    return (<TextArrayLineBreak array={value}/>);
  }

  return ({value});
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
      <TextArrayLineBreak array={errors}/>
    </Alert>
  );
}

export const SuccessAlert = ({isSuccessful, message = 'Success'}) => {
  if (!isSuccessful) return null;

  return (
    <Alert severity='success'>
      <span>{message}</span>
    </Alert>
  );
}
