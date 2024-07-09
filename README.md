# Example NextJS CSP Setup

A simple example showing how to get the default Next.js template working with a secure Content Security Policy (CSP).

The project was created using: `$ npx create-next-app@latest`

## 1. Add a nonce-based CSP using middleware

in /middleware.js

```javascript
import { NextResponse } from 'next/server'
 
export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
  default-src 'self';
  script-src 'self'  'nonce-${nonce}'  ${
    process.env.NODE_ENV === "production" ? `` : `'unsafe-eval'`
  };
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  connect-src 'self'; 
`;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()
 
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
 
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
 
  return response
}
```

## 2. Force dynamic rendering

in /app/layout.js

```javascript
export const dynamic = "force-dynamic";
```

## 3. Remove next/image inline styles

Override the default Next/Image component and remove the  inline style `(style="color:transparent" )` 

in /app/\_components/image.js


```javascript
import { getImageProps } from "next/image"

export default function Image(props) {
  const { props: nextProps } = getImageProps({
    ...props
  })

  const { style: _omit, ...delegated } = nextProps

  return <img {...delegated} />
}
```


Finally, update the imports in /app/page.js

```javascript
// import Image from "next/image";
import Image from "./_components/image";
```

The CSP should now work in development and production modes without error.
`$ npm run dev`
`$ npm run build && npm run start`

# References

[Middleware Setup](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy#adding-a-nonce-with-middleware)

[Remove Next/image inline style](https://github.com/vercel/next.js/issues/45184#issuecomment-1988319088)

Issues relating to next/image, inline syles and CSP - [#61388](https://github.com/vercel/next.js/issues/61388), [#45184](https://github.com/vercel/next.js/issues/45184).








