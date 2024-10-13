import { setCookie, Cookie } from 'jsr:@std/http';

Deno.serve({ port: 8080, hostname: '0.0.0.0' }, async (req) => {
  const headers = new Headers();
  const cookie: Cookie = {
    name: 'hungry',
    value: 'monster',
  };
  setCookie(headers, cookie);

  const url = new URL(req.url);

  if (req.body) {
    const body = await req.text();
    console.log('Body:', body);
  }

  return new Response(
    `${req.method} ${url.pathname} \n with headers:\n ${JSON.stringify(
      Object.fromEntries([...headers])
    )} \n \t url.searchParams \n${JSON.stringify(
      Object.fromEntries([...url.searchParams])
    )} \n\n\nset response headers \n${JSON.stringify(
      Object.fromEntries([...headers])
    )}`,
    {
      headers,
    }
  );
  // return new Response('Hello World');
});
