# Mumbai Indians SFL Site

Static two-page website for your fantasy Mumbai Indians team in the SFL-SNT Thomas Fantasy League.

Files:
- `index.html`: Homepage with owner section, league details, and squad overview.
- `players.html`: Full player presentation page with role filters.
- `assets/css/styles.css`: Shared styling.
- `assets/js/data.js`: League info, owner info, and all 19 player profiles.
- `assets/js/main.js`: Renders the pages from the data file.

How to customize:
- Add your name/photo in `assets/js/data.js` under `owner`.
- Add real player photos by setting each player's `image` value in `assets/js/data.js`.
- Update any stats, achievements, or text directly in `assets/js/data.js`.

Notes:
- If an image is missing, the site shows a designed placeholder block.
- Player stats in the current build are based on career IPL/profile snapshots gathered during setup, mainly reflecting records available through the 2025 IPL season.
