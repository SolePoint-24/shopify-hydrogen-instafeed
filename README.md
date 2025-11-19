# shopify-hydrogen-instafeed

A lightweight, performance-optimized React component to embed Instagram feeds into your **Shopify Hydrogen** storefronts.

This package handles the complex logic of lazy-loading external scripts, managing Shopify's `customerPrivacy` API, and ensuring Content Security Policy (CSP) compliance so you can focus on designing a beautiful storefront.

## ✨ Features

- **🛍️ Hydrogen & Remix Ready:** Built specifically for Shopify Hydrogen storefronts.
- **⚡ Performance Optimized:** Uses lazy loading to fetch scripts only when Shopify is initialized, preventing main-thread blocking.
- **🔒 CSP Compliant:** Built-in support for `nonce` to work seamlessly with Shopify Oxygen's strict security policies.
- **🎨 Flexible Styling:** Accepts custom classes and inline styles to match your brand.
- **💻 Developer Friendly:** Fully typed with TypeScript.



## 📦 Installation

1. Install the package via npm or yarn:

```bash
npm install shopify-hydrogen-instafeed
# or
yarn add shopify-hydrogen-instafeed
```

2. Configure content security policies. In file entry.server.tsx add following CSP. These needs to be added as shopify-forms is dependent on these external libraries

```
{
  defaultSrc: [
    'self',
    'https://js.hcaptcha.com',
    'https://fonts.shopifycdn.com',
    'https://newassets.hcaptcha.com'
  ],
  connectSrc: [
    'self',
    'https://instafeed.nfcube.com/feed/v6?limit=12&account=emerald-art-studio.myshopify.com&fu=0&fid=0&hash=d2a14583a519115cb6dbbf20de180105&locale=en&handle=',
    'https://scontent.cdninstagram.com',
    'https://video.cdninstagram.com',
  ],
  imgSrc: [
    self,
    'https://instafeed.nfcube.com/',
    'https://scontent.cdninstagram.com',
  ],
  mediaSrc: [
    "'self'",
    'data:',
    'https://cdn.shopify.com',
    'https://cdn.nfcube.com',
    'https://instafeed.nfcube.com',
    'https://scontent.cdninstagram.com',
    'https://video.cdninstagram.com',
    ],
}
```

3. Usage

To use the feed, import the Instafeed component. You must provide the script source (from your Instagram Feed app settings) and a nonce (for security).

```tsx
import { Instafeed } from 'shopify-hydrogen-instafeed';
import { useNonce } from '@shopify/hydrogen';

export default function InstagramSection() {
  const nonce = useNonce();

  //This is just for example

  const INSTAFEED_SCRIPT_URL = "https://cdn.nfcube.com/instafeed-[example.js]?shop=[example-shop.myshopify.com]";

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-4">Follow us on Instagram</h2>
      <Instafeed 
        scriptSrc={INSTAFEED_SCRIPT_URL} 
        nonce={nonce} 
        className="my-custom-instafeed-wrapper"
      />
    </section>
  );
}
```
## 📝 Notes

-  You must pass Shopify’s nonce, otherwise Oxygen will block the script via CSP.

-  The scriptSrc must come directly from the Instagram Feed app you use (e.g., Nfcube, Instafeed Pro, etc.).

-  This works with both Hydrogen 2024+ and Remix-powered Hydrogen.

## ❤️ Contributing

-  Feel free to open issues or PRs to improve the package.