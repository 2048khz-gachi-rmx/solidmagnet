# solidmagnet

A performant web interface for [bitmagnet](https://github.com/bitmagnet-io/bitmagnet). Created out of spite because the stock one fucking SUCKS.

<image src=".github/screenshot.png" />

## Requirements

The UI is a static frontend. It does **not** need Node, Bun, or any other server
runtime once built, but it does need a running bitmagnet instance with its
GraphQL API available.

## Use a prebuilt release

Download `solidmagnet-webui.zip` from the latest GitHub release and serve its
contents at `/webui/` on the same origin as bitmagnet's GraphQL API. In this
layout the UI uses `/graphql` automatically, so no rebuild is needed.

Open `https://your-host/webui/`.

If the site is not served by bitmagnet itself, point `/graphql` at the API and
serve the static files at `/webui/`. Unknown paths must fall back to
`/webui/index.html` for client-side routes.

### Caddy

Place the extracted files in `/var/www/webui`, then:

```caddyfile
bitmagnet.example.com {
	@root path /
	redir @root /webui/ 302

	handle /graphql* {
		reverse_proxy 127.0.0.1:3333
	}

	handle /webui/* {
		root * /var/www
		try_files {path} /webui/index.html
		file_server
	}
}
```

### nginx

Place the extracted files in `/var/www/webui`, then:

```nginx
server {
    listen 443 ssl;
    server_name bitmagnet.example.com;

    location = / {
        return 302 /webui/;
    }

    location /webui/ {
        root /var/www;
        try_files $uri $uri/ /webui/index.html;
    }

    location /graphql {
        proxy_pass http://127.0.0.1:3333;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Build your own

Building is only needed if you want a different base path or a GraphQL endpoint
on another origin.

`BASE_PATH` controls the URL prefix (default `/webui/`). By default the UI
requests `/graphql` from the same origin; set `VITE_GRAPHQL_ENDPOINT` when the
API lives elsewhere:

```sh
BASE_PATH=/ \
VITE_GRAPHQL_ENDPOINT=https://bitmagnet.example.com/graphql \
  bun run build
```

The output is written to `dist/client/`. Serve it from any static host, keeping
the same base path in the URL and falling back unknown paths to `index.html`.

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
