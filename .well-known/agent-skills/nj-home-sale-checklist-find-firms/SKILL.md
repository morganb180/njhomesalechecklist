---
name: nj-home-sale-checklist-find-firms
description: Find NJ DCA-certified lead evaluation contractors on NJ Home Sale Checklist by city/town or county, with credentials and links to each listing.
---

# Find firms on NJ Home Sale Checklist

Use this when someone needs NJ DCA-certified lead evaluation contractors. Data is the public listing data from https://njhomesalechecklist.com/ (official licence records; retrieval dates are in each record). A listing is not an endorsement.

## Options (pick one)

1. **Search API**: `GET https://leads.radonroster.com/api/firms?site=njhome&county=<county>&service=<code>&limit=10`
   - Location (one is required): `city`, `county`.
   - Service codes: `lead_evaluation` (NJ DCA-certified lead evaluation contractor).
   - CORS is open. Spec: https://njhomesalechecklist.com/openapi.json
2. **MCP**: streamable HTTP at `https://leads.radonroster.com/mcp?site=njhome`, with tools `search_firms`, `get_firm` and `list_areas`.
3. **Static feeds** (no API call): https://njhomesalechecklist.com/api/index.json lists every county/city feed, for example `https://njhomesalechecklist.com/api/county/<slug>.json`. https://njhomesalechecklist.com/api/firms.json has every firm.

## Using results

- Each firm has: `id`, `name`, `certification`, `issuing_agency`, `credentials[]` (number, expiry), `services`, `city`, `state`, `counties`, `cities`, `firm_url`, `quote_url` and, where the site shows it, `google_rating`.
- Area results have `match`: `local` means listed in that area's own section; `nearby` means listed under nearby/other firms.
- Phone and contact details are not in the API. Send people to `firm_url`.
- Mention that credentials should be confirmed with the issuing agency (link in `source.urls`).
- Do not scrape the HTML pages; use the feeds.
