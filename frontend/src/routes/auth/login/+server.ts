import { redirect } from '@sveltejs/kit';
import { auth0 } from '$lib/env';

export async function GET() {
  const url = new URL(`https://${auth0.domain}/authorize`);

  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', auth0.clientId);
  url.searchParams.set('redirect_uri', auth0.callbackUrl);
  url.searchParams.set('scope', 'openid profile email');

  throw redirect(302, url.toString());
}
