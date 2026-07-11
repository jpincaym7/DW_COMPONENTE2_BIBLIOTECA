import { isProduction } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'token';

const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/'
};

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, { ...baseCookieOptions, maxAge: AUTH_COOKIE_MAX_AGE });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, baseCookieOptions);
};
