Introduction to Reactive Programming
------------------------------------

Based on the [tutorial](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) by [André Staltz](https://twitter.com/andrestaltz).


Instructions
------------

Create a GitHub personal access token at https://github.com/settings/tokens.

Edit `secret.js` and add your token.

To avoid having git warning about changes to `secret.js`, run:

```
git update-index --assume-unchanged secret.js
```

Run it in a web server, e.g.:

```
docker run --name "introrx" -v $(pwd):/usr/share/nginx/html:ro -P -d nginx
```

Find the port assigned to the web server:

```
docker port introrx | grep 80
```

E.g. if the response is:

```
80/tcp -> 0.0.0.0:32771
```

then browse to http://localhost:32771
