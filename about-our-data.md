---
title: "About Our Data | NJ Home Sale Checklist"
description: "Where the listings come from, the source terms, and how the data was cleaned."
canonical: https://njhomesalechecklist.com/about-our-data/
---

# About our data

* **Lead evaluation contractors:** NJ DCA [List of Certified Lead Evaluation Contractors](https://www.nj.gov/dca/codes/publications/pdf_lead/ld_eval_contrs.pdf), revised 8/11/2026, retrieved 2026-10-12. Terms: published by the State of NJ, with no license stated on the PDF and nj.gov's general legal statement applying. Cleanup: 185 parsed, 4 expired dropped, phones normalized, names title-cased, abbreviations kept as printed. County comes from ZIP via GeoNames postal data (CC BY 4.0, geonames.org). Log: data/cleanup-log.csv.
* **Town smoke/CO pages:** official municipal pages found 2026-10-12. Towns without an official page on file show general statewide guidance and are marked ⚠ (confirm with town).
* **Not listed:** NJDEP-certified drinking-water/PWTA labs, radon businesses and UST closure firms are published through NJDEP's interactive lookup tools, so we link to those instead of copying them. Individual NJDOH-licensed lead inspectors/risk assessors aren't listed.
