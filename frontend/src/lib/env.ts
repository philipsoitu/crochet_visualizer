import { env } from '$env/dynamic/private';

export const auth0 = {
  domain: env.AUTH0_DOMAIN,
  clientId: env.AUTH0_CLIENT_ID,
  clientSecret: env.AUTH0_CLIENT_SECRET,
  callbackUrl: env.AUTH0_CALLBACK_URL,
  logoutUrl: env.AUTH0_LOGOUT_URL
};
