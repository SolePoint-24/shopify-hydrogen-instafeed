# shopify-hydrogen-form-embed

Embed Shopify Forms easily into your Hydrogen storefront using this lightweight React component. This package handles the loading of the Shopify Forms script and applies styling automatically—so you can focus on building great experiences.

## ✨ Features

- 📦 Lightweight & React-based
- 🛍️ Works seamlessly with Shopify Hydrogen (Remix)
- 🎨 Customizable with form styles and props
- ⚙️ Automatically loads required Shopify scripts
- ⚡ Quick integration with minimal config

---

## 📦 Installation

1. Install the package via npm or yarn:

```bash
npm install shopify-hydrogen-form-embed
# or
yarn add shopify-hydrogen-form-embed
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
    'https://forms.shopifyapps.com',
    'https://otlp-http-production.shopifysvc.com',
    'https://notify.bugsnag.com'
  ]
}
```

## 🚀 Usage

#### 🧁 Basic Example

```tsx
import { ShopifyForm } from 'shopify-hydrogen-form-embed';

export default function ContactPage() {
  return (
    <section>
      <h2>Stay Updated</h2>
      <ShopifyForm formId="abc123" shopUrl="xyz.myshopify.com" />
    </section>
  );
}
```

#### 🎨 With Custom Props and Style

```tsx
<ShopifyForm
  formId="xyz789"
  shopUrl="xyz.myshopify.com"
  formStyle={`
    a {
      background-color: red;
    }
  `}
  formProps={{
    'data-forms-padding-top': '30',
    'data-forms-padding-bottom': '20',
    'data-forms-text-color': '#333333',
    'data-forms-button-background-color': '#000000',
    'data-forms-button-label-color': '#ffffff',
  }}
/>
```

> 📝 Replace "abc123" or "xyz789" with the actual Form ID you generate from your Shopify admin.
> Replace "xyz.myshopify.com" with the actual store url
