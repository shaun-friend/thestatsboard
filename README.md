# The Stats Board

Rugby fixtures, results and tables for English rugby clubs, served by a single Cloudflare Pages worker.

- `site/` is what gets deployed: `_worker.js`, `index.html`, `README.txt` (the release notes, synced into the worker).
- `tests/` holds the test suites and the release scripts. `bash tests/build_release.sh <zip name>` runs everything and builds a zip in `dist/`.
- `.github/workflows/` runs the tests on every push, uploads `dev` to the DEV site, and deploys `main` to PROD on request.

See `docs/GITHUB_SETUP.md` for the one-off set-up and the everyday routine.

This repository is private and carries no licence: all rights reserved.
No PINs, tokens or settings are stored here. They live in Cloudflare and in GitHub secrets.
