import { useEffect, useState } from 'react';

const readToken = (token) =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

export const useTokenValues = (tokens) => {
  const [values, setValues] = useState({});

  const keys = tokens.join(',');

  useEffect(() => {
    const resolved = keys.split(',').reduce((accumulator, token) => {
      accumulator[token] = readToken(token);
      return accumulator;
    }, {});

    setValues(resolved);
  }, [keys]);

  return values;
};
