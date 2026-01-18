import { redirect } from '@sveltejs/kit';
import { auth0 } from '$lib/env';

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');

  const tokenRes = await fetch(`https://${auth0.domain}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: auth0.clientId,
      client_secret: auth0.clientSecret,
      code,
      redirect_uri: auth0.callbackUrl
    })
  });

  const tokens = await tokenRes.json();

  cookies.set('access_token', tokens.access_token, {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });

  cookies.set('id_token', tokens.id_token, {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });

  throw redirect(302, '/');
}
