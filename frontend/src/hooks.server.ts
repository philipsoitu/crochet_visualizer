import type { Handle } from '@sveltejs/kit';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { auth0 } from '$lib/env';

const JWKS = createRemoteJWKSet(
  new URL(`https://${auth0.domain}/.well-known/jwks.json`)
);

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('id_token');

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWKS, {
        audience: auth0.clientId,
        issuer: `https://${auth0.domain}/`
      });

      event.locals.user = payload;
    } catch (err) {
      console.error('JWT verification failed:', err);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
