import type { JSX } from "@solidjs/web";
import { Meta, Title } from "@solidjs/meta";

export default function Document(props: { children?: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link
          rel="icon"
          type="image/png"
          href={`${import.meta.env.BASE_URL}favicon.png`}
        />
        <Title>bitmagnet</Title>
        <Meta name="theme-color" content="#4355b9" />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
