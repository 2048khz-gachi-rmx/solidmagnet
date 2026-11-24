# solidmagnet

A web interface for [bitmagnet](https://github.com/bitmagnet-io/bitmagnet).

It covers torrent search and filtering, torrent details and file lists, tags and
bulk actions, the torrent metrics dashboard, and the queue visualizer, jobs, and
admin pages. The interface is translated into all 14 languages supported by
bitmagnet and includes its four themes.

## Requirements

The UI is a static frontend. It does **not** need Node, Bun, or any other server
runtime once built, but it does need a running bitmagnet instance with its
GraphQL API available.

## Hosting

The build is a normal static SPA. Serve the files from any static host and make
sure unknown paths fall back to `index.html`; without that, direct links such as
`/torrents/...` return a 404.

By default the UI requests `/graphql` from the same origin. If the frontend is
hosted separately from bitmagnet, point it at the API when building:

```sh
VITE_GRAPHQL_ENDPOINT=https://bitmagnet.example.com/graphql bun run build
```

`BASE_PATH` controls the URL prefix (default `/webui/`, matching the path used by
bitmagnet's embedded UI). Use `BASE_PATH=/` when serving from a domain root:

```sh
BASE_PATH=/ VITE_GRAPHQL_ENDPOINT=https://bitmagnet.example.com/graphql bun run build
```

The output is written to `dist/client/`.

### Prebuilt release

Tagged releases include `solidmagnet-webui.zip`. Extract its contents into the
directory served at `/webui/` on the same origin as bitmagnet's GraphQL API.
That is the default configuration (`/webui/` base path and `/graphql` endpoint),
so no build is needed.

If your UI or API uses different URLs, clone the repository and build with the
matching values:

```sh
BASE_PATH=/your/path/ \
VITE_GRAPHQL_ENDPOINT=https://bitmagnet.example.com/graphql \
  bun run build
```

## Local development

```sh
bun install
bun run dev
```

Open `http://localhost:4200/webui/`. The dev server proxies `/graphql` to
`http://localhost:3333`; set `VITE_GRAPHQL_ENDPOINT` if your API is elsewhere.

## License

The UI design, translations, and GraphQL operations come from the bitmagnet
project (MIT licensed, © bitmagnet contributors). This port is distributed under
the same MIT terms.
