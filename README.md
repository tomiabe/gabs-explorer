# Gaborone Explorer

A product direction for a more useful Gaborone city guide.

The prototype is a static vanilla HTML, CSS, and JavaScript site. It turns editorial discovery into a clear product journey:

1. Browse by mood, area, or kind of place.
2. Open a place profile with context and practical guidance.
3. Save the place, get directions, or continue through related stops.

## Pages

- `index.html` is the landing page and editorial entry point.
- `explore.html` is the discovery workspace.
- `place.html?place=two-six-seven` is a place profile. Every place card uses the same profile template.

## Run locally

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Content note

This is a concept prototype. Venue hours, pricing, availability, access, and event details should be checked with each place before publication.

## Stack

- Vanilla HTML, CSS, and JavaScript
- Cal Sans for headings and DM Sans for body copy
- Phosphor Icons
- GitHub Pages ready
