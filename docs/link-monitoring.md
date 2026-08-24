# Portfolio link monitoring

The `Check portfolio links` workflow runs every day at 06:00 UTC and can also be started manually from the GitHub Actions tab.

The checker validates the live portfolio homepage, `robots.txt`, `sitemap.xml`, every non-empty project demo URL, and GitHub source URLs for projects marked `source: public`. Private repositories are intentionally not probed because their links are not expected to be publicly accessible; the portfolio displays `Private Source` for those projects instead.

A URL passes when it returns an HTTP 2xx or 3xx response. If a monitored URL fails, the workflow fails and identifies the URL and status code in its log. The project owner should then repair the deployment, update the URL in `data/projects.json`, or intentionally remove the broken demo link.
