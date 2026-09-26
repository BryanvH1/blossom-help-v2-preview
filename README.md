# Blossom V2 Help Centre — preview

A published copy of the V2 grower help centre, for review on a tablet or phone
before it ships inside the app.

**This is a preview, not the live help centre.** The real one will live at
`app2.blossom.ag/help/` once the mount point is decided. Source lives in
`elmlakelabs/blossom-help` under `docs-v2/`; this repo only holds the built
output.

Every page carries `noindex, nofollow` and the site has a blanket `robots.txt`,
so search engines will not list it — but anyone with the link can read it.

Rebuild and republish from the source repo with:

```
mkdocs build -f mkdocs-v2.yml -d <dir>
```
