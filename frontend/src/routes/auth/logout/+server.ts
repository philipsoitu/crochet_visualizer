import { redirect } from '@sveltejs/kit';
import { auth0 } from '$lib/env';

export function GET({ cookies }) {
  cookies.delete('access_token', { path: '/' });
  cookies.delete('id_token', { path: '/' });

  const url = new URL(`https://${auth0.domain}/v2/logout`);
  url.searchParams.set('client_id', auth0.clientId);
  url.searchParams.set('returnTo', auth0.logoutUrl);

  throw redirect(302, url.toString());
}
