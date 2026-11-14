// =============================================================================
// THE STATS BOARD (RFU club dashboard) - Cloudflare Pages, Advanced Mode _worker.js
//
// CHANGE CONTROL
//   0. Numbering (from v3.4): major.minor.patch. New feature = minor (v3.5), fix = patch (v3.4.1), big change in how the site works = major (v4.0).
//   1. Every change gets a new version: bump VERSION and BUILD_DATE below (dates are UK DD-MMM-YYYY), add a
//      line to the changelog in this header, and add the same entry to README.txt.
//   2. RELEASE_NOTES (further down) is a copy of README.txt for the dev-only /release-notes page: refresh it
//      from README.txt whenever a new zip is made.
//   3. Name the zip after the version (RFU_Club_Dashboard_<version>_<topic>.zip) and keep
//      the previous zip: rolling back is just redeploying it.
//   4. To see what is live: open /version (JSON) or read the version stamp that every
//      page shows (footer text, or a small stamp in the bottom-left corner of full-screen
//      views). Every page also sends an X-Stats-Board-Version response header.
//
// CHANGELOG (newest first; dates are only recorded from v22f onwards)
//   v30q  06-Nov-2026  Walkovers (HWO / AWO in the RFU data) now count as played games with a win or loss in form, recent results, records, the fixtures list, Match Stats form and the Opposition report. They show as "W/O" instead of a score and are left out of every score-based figure (points scored and conceded, averages, close games, margins).
//   v3.25.1 14-Nov-2026 Admin: the website back-up switch had the same id as the weather switch, so saving read the wrong box. Fixed.
//   v3.25 13-Nov-2026 Admin: switch "England Rugby website as a back-up" (default on). Off = RFU data service only; no website table, ground or team-search calls.
//   v3.24 13-Nov-2026 Usage: optional &screen=Name on a TV link labels that screen; the Usage page lists named screens with loads and last seen. Ignored when absent.
//   v3.23.3 13-Nov-2026 Usage: a team picked in the link builder is recorded with its name (from the search result) as well as its number.
//   v3.23.2 13-Nov-2026 Usage: teams picked in the link builder or looked up by the app are now counted by team id (the code read the wrong address part), and picks appear in "Teams that are not in our list".
//   v3.23.1 13-Nov-2026 TV screens: the page stays hidden while it measures and fits itself, then fades in once, instead of visibly resizing several times on load.
//   v3.23 13-Nov-2026 Match Centre: the Board layout is removed (not bold enough). Admin offers Next game first and Classic rows; a saved Board setting shows Next game first; more than four teams use Classic rows.
//   v3.22.5 13-Nov-2026 Fixtures TV: cup tag drawn as its own box (own line height, shortens inside its border) so it cannot be clipped by the line.
//   v3.22.4 13-Nov-2026 Fixtures: a club-entered cup game on an elite team takes its cup name (e.g. Prem Rugby Cup) from the RFU match record instead of just "Cup".
//   v3.22.3 13-Nov-2026 Fixtures TV: the cup tag under each opponent is no longer clipped top and bottom.
//   v3.22.2 13-Nov-2026 Match Stats and the Opposition Report show a cup game the RFU lists without a competition (e.g. Premiership Cup) as the next game, with a "no cup stats" note, instead of the next league game.
//   v3.22.1 13-Nov-2026 Fixtures: an elite side's club-entered games with no competition name (e.g. Premiership Cup) are now cup games, so tonight's cup tie is the next game, not a later league game.
//   v3.22 13-Nov-2026 Match Centre (TV layouts): ground and "2nd v 3rd" table line on each next game. New admin-only Match sheet page: team sheets and scorers, under-18 names never shown.
//   v3.21.8 12-Nov-2026 Probe page: five new cards (all matches in one call, match participants, match events, match stats).
//   v3.21.7 12-Nov-2026 Opposition report: space between the tags at the top when they wrap onto more than one line on a phone.
//   v3.21.6 12-Nov-2026 Match Centre layouts: crests shown as they are, with no circle behind or clip around them, so no dark bands.
//   v3.21.5 12-Nov-2026 Match Centre layouts: the circle behind each crest takes on the crest's own colours so it all matches.
//   v3.21.4 12-Nov-2026 Match Centre layouts: a small space each side of the dash in the last-result score.
//   v3.21.3 12-Nov-2026 Match Centre layouts: more room under names so heavy fonts with deep tails (the g in Paignton) are not cut off.
//   v3.21.2 12-Nov-2026 Match Centre layouts: letters that hang below the line (g, p, y) no longer clipped; Board column headings larger.
//   v3.21.1 12-Nov-2026 Match Centre Next game first: equal-height colour blocks (about a quarter smaller), smaller crests that no longer crop, larger "Next game" label, no clipped text.
//   v3.21 12-Nov-2026 Match Centre layouts for TV: Next game first (new default), Board, and the Classic rows, chosen in Admin; crests for every team and opponent.
//   v3.20.1 12-Nov-2026 Page store ignores unknown settings in the address, so made-up extras cannot force fresh builds.
//   v3.20 12-Nov-2026 Security: address checks (team, competition, division, season) and a per-visitor limit on different lookups; new Address checks card on the Usage page.
//   v3.19 12-Nov-2026 Security: random expiring sign-in tokens (club and test PINs) and a temporary lockout after repeated wrong PINs.
//   v3.18.3 12-Nov-2026 Release table in the README put back in order; release check now catches a mis-ordered table.
//   v3.18.2 12-Nov-2026 Match Stats footer spacing; welcome page fits with recent teams.
//   v3.18.1 12-Nov-2026 Tagline changed to "Your club’s rugby fixtures, results and tables at a glance."
//   v3.18 12-Nov-2026 Branding: ball-and-bars logo, new icons, welcome header and tagline, footers, link preview image, "Powered by" line (switchable in Admin).
//   v3.17.2 12-Nov-2026 Maintenance Preview shows the unsaved form values.
//   v3.17.1 12-Nov-2026 Switching maintenance mode on asks for the club PIN again.
//   v3.17 12-Nov-2026 Maintenance mode: admin switch shows a "Back soon" page everywhere except Admin and PIN pages; pun lines; preview.
//   v3.16.4 12-Nov-2026 Match Stats: "Get directions" button (address wraps, nothing cut off on phones); directions use the ground and postcode from the RFU match record.
//   v3.16.3 12-Nov-2026 Usage page: new "Outside calls per day" chart (website vs data service vs weather/postcodes), per hour on Today.
//   v3.16.2 12-Nov-2026 Usage page: a mis-quoted line from v3.14.1 stopped its script running (stuck on Loading); fixed, with new script-compile and real-browser tests.
//   v3.16.1 12-Nov-2026 Match Centre: a cup next game now gets its venue from the RFU match record (website page as fallback), as Match Stats already did.
//   v3.16 12-Nov-2026 Venues now come from the RFU match record (ground and map position, 24-hour cache); the website page is only a fallback, and the forecast skips its postcode/place lookups when the position is known.
//   v3.15.6 12-Nov-2026 Match Centre (four-team board): the version line no longer overlaps the bottom team row.
//   v3.15.5 12-Nov-2026 DEV probe: nine venue checks (match by ID, club record, Find Rugby entry). TV dashboard: the version line no longer overlaps the bottom panels.
//   v3.15.4 12-Nov-2026 Fixtures lists: long competition names are shortened ("Under 18" becomes "U18") so the competition tag is not cut off on the TV board and phone lists.
//   v3.15.3 12-Nov-2026 The other-competition buttons are now only on the Home (team) page of the phone and iPad app view, not Fixtures, Match Stats or Opposition; the unused copy on plain pages is removed.
//   v3.15.2 12-Nov-2026 The other-competition buttons are no longer shown on the Fixtures page (it already lists games from every competition, so they did nothing); they stay on Home and Match Stats.
//   v3.15.1 12-Nov-2026 Fix: the other-competition buttons never appeared on phones and iPads, because those open the app page (?app=1) and the buttons were only added to the plain pages. They now sit under the team bar in the app page, on Home, Fixtures and Next game (Match Stats and Opposition), and tapping one switches the competition.
//   v3.15  12-Nov-2026  A team's competition list and the team search now come from the RFU data service (cluster.england-rfu.com) instead of the englandrugby.com website; the website is only the backup (past seasons, teams with no upcoming games, data service down). Friendlies ("Manual Fixture") are left out of the competition list; competitions seen once are remembered for 30 days so a finished cup does not vanish.
//   v3.14.5 12-Nov-2026 DEV probe page: Copy all results now includes the "found" block, and a new call lists every competition and group in a team's upcoming games (to test replacing the englandrugby.com competition lookups). Diagnostics only.
//   v3.14.4 12-Nov-2026 Venue lookups (RFU match-centre page) kept 24 hours and refreshed an hour early; a failed lookup is remembered for 6 hours across the whole site instead of 5 minutes in one place; no weather lookup when no venue is known; the DEV probe page now also reports whether the RFU data service carries competition ids, venues and crests.
//   v3.14.3 12-Nov-2026 Match Stats weekday cache lengthened to 2 hours (weekends stay 5 minutes).
//   v3.14.2 12-Nov-2026 Match Stats pages are kept for longer on the live site (30 minutes Monday to Friday, 5 minutes at weekends, was 2 minutes) so repeat views cost no computing.
//   v3.14.1 12-Nov-2026 Usage page: a Today view (hourly bars) and the Cloudflare free-limit figure now counts from midnight UTC, when Cloudflare's daily limit restarts, instead of a rolling 24 hours.
//   v3.14  10-Nov-2026  Other-competition buttons on team, Fixtures and Match Stats pages (phones and iPads only, never TV) and a team search that goes straight to the league; a note on the Match Stats cup view saying what is reported; search engines told to skip team, Fixtures, Match Stats, Match Centre and Opposition pages (welcome page stays findable); Sign out link and an Admin setting for how long a PIN sign-in lasts (1, 7, 14 or 30 days); competition lists kept 12 hours; Documentation section on the usage data columns; build date corrected.
//   v3.13.1 10-Nov-2026  Fix: the live and test sites share one Analytics Engine dataset, so test visits showed in the live Usage page. Every counted record is now tagged live or test and each Usage page reads only its own. Counting starts afresh (older records carry no tag and are left out).
//   v3.13  10-Nov-2026  Speed: RFU data that has gone out of date is shown at once and refreshed in the background (so nobody waits), postcodes, place lookups, the season list and forecasts are kept much longer, the wait for RFU is 4 s when an older copy exists, and the Usage page has a Speed panel (page build times and outside fetches). Responses carry a Server-Timing header.
//   v3.12  09-Nov-2026  Usage page: "What the screens are showing" (screen loads by page and team), how often the Usage, Admin, Documentation and Links pages were opened, and wrong PIN entries (club PIN and test PIN, with a count per day and a rough place). The Clubhouse screens and Calendar tiles now say what they count (most screens on one day; subscriber-days).
//   v3.11  09-Nov-2026  Reporting section on the Admin page: Count visits and a new Count clubhouse screen loads switch, and the default period for the Usage page. The Usage page now charts clubhouse screen loads per day (with the number of screens).
//   v3.10  09-Nov-2026  Visit counting: anonymous counts of pages, teams, devices, TV screens and calendar feeds in Cloudflare Workers Analytics Engine (USAGE binding), a Usage report at /usage (club PIN) and a Count visits switch on the Admin page. No cookies, no IP addresses, no typed search text.
//   v3.9.1 09-Nov-2026  The Colts' friendly name is now "Colts" (Match Centre, Links page, admin). "Home at ...", Directions and weather now take the club name from the team's real name in the RFU data, so a short friendly name like Colts cannot turn into "Home at Colts".
//   v3.9   09-Nov-2026  The Colts (Ivybridge U18s) are in the club's team list: Links page, admin notice choices and the Match Centre. The Match Centre now fits four teams (smaller text when there are four or more rows), and the TV notice keeps the right number of rows.
//   v3.8.1 09-Nov-2026  Match Stats recent form follows the view: on a cup game it shows each team's results in that cup (it was all competitions).
//   v3.8   09-Nov-2026  Every screen that shows a next game or last result now covers all competitions: the Match Centre (screen and phone) and the Opposition Report follow a cup game, tagged with the cup name. Together with v3.7 and v3.7.1 this covers Match Stats, the Next fixture panel, the Fixtures board and the calendar.
//   v3.7.1 09-Nov-2026  The Next fixture panel on the standard dashboard and TV view also follows the next game of any competition: a cup game that comes before the next league game is shown, with the cup name.
//   v3.7   09-Nov-2026  Match Stats now covers cup games: if the team's next game (any competition) is a cup game, it shows the cup name and compares the two teams in that cup only. First-round cup games say so instead of showing empty bars.
//   v3.6.4 09-Nov-2026  Fixtures TV heading: age-group names such as "Ivybridge U18s" gave "Ivybridge U18S RFC". Age groups (U18, U18s, Under 18s) are now dropped from the club name, as are Girls teams.
//   v3.6.3 09-Nov-2026  Fixtures TV board: the heading read "The Vandals RFC" for the 2nd XV. It now uses the club name from the feed team name ("Ivybridge RFC").
//   v3.6.2 09-Nov-2026  Fixtures TV board: the bottom of letters such as g, p and y in the opponent name (Next game / Last game banner) was slightly cut off. Fixed.
//   v3.6.1 07-Nov-2026  Documentation fix: it said the calendar file covers league games only, but it already includes cups (it reads the same data as the Fixtures page). Match Stats still looks at the next league game only, and now says so.
//   v3.6  07-Nov-2026  /docs is now Documentation: start here, which page is which, setting up a clubhouse screen, link variables (the old /docs page, now a section), admin guide, how the data works, definitions, troubleshooting, setup and deployment, releases, what's new, privacy. Still behind the club PIN. The PROD/DEV switch is removed from the Links page and the DEV address is no longer written anywhere in the code.
//   v3.5  07-Nov-2026  New admin page (/admin, club PIN): settings kept per club in Cloudflare KV (SETTINGS binding). Homepage notice and TV screen notice (style, hide-after date; TV notice applies to club teams, all screens or chosen teams) and switches for the around-the-league strip, TV weather, last-checked line and walkover colours. No KV binding means every setting stays at its default.
//   v3.4  07-Nov-2026  New version numbering: major.minor.patch (a feature raises the minor number, a fix the patch number). v33 counts as v3.3, so this release is v3.4. No change to the site apart from the version label.
//   v33   07-Nov-2026  New /docs page: every link variable listed by section with what it does, where it works and clickable examples. Behind the club PIN (like the Links page), not cached, not indexed.
//   v32   07-Nov-2026  Fixtures TV board branding: club name, clock and date top right, edge stripe and accents in the two crest colours (&colour=hex overrides, &club=text sets the name), "last checked" line at the bottom; the league and record text in the header is gone.
//   v31h  07-Nov-2026  "Around the league today": in a walkover the side awarded the win is green and the side that conceded is red.
//   v31g  07-Nov-2026  "Around the league today": a walkover now shows which side was awarded the win (that name in bold, W/O in the middle).
//   v31f  07-Nov-2026  Fixtures TV board: on match days an "Around the league today" strip shows other results in the same division as they come in. On Saturdays and Sundays RFU data is cached for 10 minutes (was an hour) and the Fixtures TV board reloads at the same rate.
//   v31e  07-Nov-2026  Fixtures TV banner: the forecast now also shows for away games (at the opponent's ground) when one is available; still left out when not.
//   v31d  07-Nov-2026  Fixtures (phone): a long cup name stays in one piece on its own line instead of splitting across lines.
//   v31c  07-Nov-2026  Fixtures page: cups sit in their own competition, which the team season feed does not name. Now reads every competition/division the team is entered in (same list as the link builder) and labels each game by its source. Diagnostics list the leagues and what each added.
//   v31b  07-Nov-2026  Diagnostics for the Fixtures page: add &debug=fixtures to the summary link to see what the team season feed returned and why games were or were not added.
//   v31a  07-Nov-2026  Cup tags shown whenever a team plays any cup game (not only when it also plays league), as amber chips. Void games are shown (marked Void, not counted). Fixtures page shows every game the team plays this season (league, cups, plates, friendlies), each tagged with its competition when the team plays in more than one.
//   v31   07-Nov-2026  Match Stats on TV / big screens: text now shrinks to fit the screen height so the bars never bunch up, overlap or get cut off on a short window. Summer-gap notice is now a slim strip at the top in the page flow, not floating over the header.
//   v30z  07-Nov-2026  Send or copy a link sheet: tap anywhere on a row to go to that page; the Share / Copy button on the row still works.
//   v30y  07-Nov-2026  Match Stats: bars stay in one column on a phone held sideways (they were split into two columns, hard to read).
//   v30x  06-Nov-2026  Automatic season: links with no season= now follow the RFU season dates (switches on its own each year, with a notice in the summer gap until the team's new fixtures are published); links with season= stay pinned. League and division are re-checked when a link has no season (promotion / relegation). Links page: Follow the current season or Pin to a season. DEV: ?today=YYYY-MM-DD and ?debug=season.
//   v30w  06-Nov-2026  Head-to-head: when the next game is in a cup (e.g. Premiership Rugby Cup), earlier meetings in that same cup count too; other cup games are still left out.
//   v30v  06-Nov-2026  Head-to-head: games the RFU marks void (kick-off code V) are reported as "not counted" instead of leaving a silent gap, e.g. "No played league meetings (2 games void in 2024-25)".
//   v30u  06-Nov-2026  Head-to-head debug (?debug=h2h): lists every game against the opponent in earlier seasons and what happened to it (added, or why skipped).
//   v30t  06-Nov-2026  Head-to-head: also matches the opponent by name when the team ID differs between seasons, and ?debug=h2h on the match summary lists what each earlier season returned.
//   v30s  06-Nov-2026  Opposition report: grouped into four sections (This game, Their form, You v them, Their season folded), new head-to-head history, forecast shortened to one line, "Around you this weekend" removed (it stays on Home).
//   v30r  06-Nov-2026  Head-to-head history: meetings from this season and the previous five (league games only), winner clear on each tile (big screen), summary plus tap-for-all-meetings on phones.
//   v30p  06-Nov-2026  DEV debug (?debug=1): lists results with no usable score (raw records), past fixtures with no result, and teams whose games played in the table differ from the results counted.
//   v30o  06-Nov-2026  League table now comes from the leagueTables section of the RFU feed we already read (no extra request). The englandrugby.com table page is only a fallback, then the calculated table. DEV ?debug=1 compares the two.
//   v30n  06-Nov-2026  RFU API probe: new cards for the league table inside full-matches, the current season flag, and last season's matches for a team (to look for head-to-head history).
//   v30m  06-Nov-2026  DEV-only RFU API probe page (/probe): calls a fixed list of cluster.england-rfu.com endpoints with a team's IDs and shows the raw results, to find which are worth using. PROD answers Not found.
//   v30l  06-Nov-2026  Fix: the version label and /version showed 05-Nov-2026 from v30 to v30k because the build date setting was not updated. It now shows 06-Nov-2026.
//   v30k  06-Nov-2026  Phones turned sideways show "Rotate your phone" with a "Use sideways anyway" button (remembered for the session). iPads and TV screens are not affected.
//   v30j  06-Nov-2026  Match Stats on a phone turned sideways: uses the readable scrolling phone layout instead of squeezing the TV layout into the short screen (the directions link still works sideways).
//   v30i  06-Nov-2026  Turned sideways: the green tab marker no longer covers the words (rail and bottom bar). Phones in landscape get a slim bottom bar; the page and tabs keep clear of the Dynamic Island, camera and notch.
//   v30h  06-Nov-2026  Faster team home page: the team page no longer waits for the "This game" difficulty. It shows straight away and that block fills in a moment later.
//   v30g  06-Nov-2026  Light mode: the W / D / L form chips on the opposition report (Recent form, Close games) keep white text on their green, amber and red cards (they had turned grey).
//   v30f  06-Nov-2026  Light/Dark toggle is a lightbulb button everywhere (including a bulb beside the team chip in the app view); light mode WIN / LOSS / DRAW labels are now readable.
//   v30e  06-Nov-2026  Phone Next fixture panel order: Next 5 opponents, then This game, then the opponent details (crests, venue), so "This game" sits with the opponent it rates.
//   v30d  06-Nov-2026  Phone dashboard Next fixture panel: "This game" difficulty (with a one-line reason) above the "Next 5 opponents" run-in, as two clearly labelled blocks.
//   v30c  06-Nov-2026  Clearer difficulty wording: the run-in bar says it covers the next opponents and shows their average position; the opposition card says it rates this game only.
//   v30b  06-Nov-2026  Links sheet: uses the device's own Share (WhatsApp button removed); Copy only where the device has no Share.
//   v30a  06-Nov-2026  Welcome search: on phones and iPads, choosing a team goes straight to its home page (app view), not the links page. The Share button is now labelled "Links" beside the team name.
//   v30   06-Nov-2026  App navigation for phones and iPads: team chip, Share sheet, four tabs (Home, Fixtures, Next game, Leaders), remembered team, iPad rail and side-by-side Next game. TV and desktop views unchanged.
//   v29g  05-Nov-2026  Match Stats: weather card under the venue (forecast for the day, or "not available yet" until about two weeks before).
//   v29f  05-Nov-2026  Directions: elite sides (Premiership etc.) use the official stadium name from the feed as the Maps destination; community sides still use "<club> Rugby Club".
//   v29e  05-Nov-2026  Directions go to "<club> Rugby Club" (team labels such as Women, II, 2nd XV stripped; postcode added when the venue has one) instead of the venue text.
//   v29d  05-Nov-2026  Phone views: the Next fixture panel (dashboard) and the Match Centre next-game box link to Match Stats and the Opposition Report. Hidden on TV layouts.
//   v29c  05-Nov-2026  Match Stats and Match Centre: "Tap for directions" and the venue link are hidden on wide (TV) screens, 900px and up; phones keep them.
//   v29b  05-Nov-2026  Opposition report: the ground card is replaced by a compact "Your/Their ground" line under the date and a Directions button beside Share on WhatsApp.
//   v29a  05-Nov-2026  League table column headings (#, Club, P, W, D, L ...) are bolder and larger on a filled band, TV and phone; weather finds the venue by town or club name when the address has no postcode; &debug=weather on the opposition summary shows why.
//   v29   05-Nov-2026  Game Difficulty, venue tag, weather predictor, Directions links, WhatsApp share, Luck check, league position chart and "Around you" on the opposition report/phone dashboard; upcoming fixture difficulty bar; clearer League leaders wording; neutral next-game banner on the Fixtures TV board.
//   v28g  03-Nov-2026  Opposition report: when both teams play in several competitions (elite sides), common opponents count both teams' games across all competitions.
//   v28f  03-Nov-2026  Opposition report: form cards (home/away, trend, close games, last results, rest) count the opponent's games in every competition they play in, tagged by competition; table-based cards stay league-only.
//   v28e  03-Nov-2026  Link builder: also reads the RFU team page for competitions the RFU API leaves out (e.g. PREM Rugby Cup pools for Exeter Chiefs).
//   v28d  03-Nov-2026  Link builder: competitions the RFU lists for a team but that give no league table are now reported instead of silently dropped; &debug=1 on /api/builder/team shows the raw competition list.
//   v28c  03-Nov-2026  Opposition report: opponent crest beside the heading; stronger/weaker sides card has W / D / L as column headers.
//   v28b  03-Nov-2026  Opposition trend card says plainly MORE / LESS / about the same than their average, for scoring and conceding.
//   v28a  03-Nov-2026  Opposition report: every statement names whose figure it is (opponent v your team).
//   v28   03-Nov-2026  Opposition report (?view=opposition, Mobile and &layout=wide): the next opponent's home/away record, trend, close games, common opponents, rest, strength of schedule and bonus points.
//   v27d  03-Nov-2026  Release notes only: added a "Parked ideas" section to README.txt. No site change.
//   v27c  03-Nov-2026  League leaders header shows a trophy icon instead of the club crest.
//   v27b  03-Nov-2026  League leaders heading shows the league name instead of the club name.
//   v27a  03-Nov-2026  League leaders: when clubs are level, their names are listed under "N clubs level".
//   v27   03-Nov-2026  League context: gap to the clubs above/below, run-in, season highlights, "In the mix" and League leaders (phone), new League leaders view (Mobile and TV), gap line on Match Centre.
//   v26b  03-Nov-2026  Browser tab icon (favicon) on every page, including the PIN pages; icon files are open to everyone.
//   v26a  03-Nov-2026  Performance and resilience: RFU data is kept for up to 7 days and shown (stale) if RFU is slow, down or blocking; RFU calls time out after 8 s; finished PROD pages are cached at the edge for 2 minutes.
//   v26   03-Nov-2026  Auto-fit for TV/tablet screens: the standard dashboard measures its content and scales and stretches to fill the screen exactly (no cut-off table rows); Match Centre and Fixtures TV shrink text until names fit.
//   v25c  03-Nov-2026  Match Centre badge uses day names: Today, Tomorrow, This Saturday, Next Saturday (blank beyond next week).
//   v25b  03-Nov-2026  Match Centre countdown: dates and countdown both use London time; a game that has passed with no result yet shows "Result due" instead of "Today".
//   v25a  03-Nov-2026  "Now and Next" renamed "Match Centre" (screen heading and links page card).
//   v25   03-Nov-2026  Now and Next redesign: Next game panel is double width with a big date and countdown; "Last game" is now "Last result".
//   v24d  03-Nov-2026  Generated links always use the public domain (thestatsboard.co.uk / dev.thestatsboard.co.uk) even when the page is opened on a *.pages.dev address.
//   v24c  03-Nov-2026  Calendar: every fixture is an all-day event (kick-off time not used).
//   v24b  03-Nov-2026  Fixtures/calendar: one entry per opponent per day, so a fixture listed twice by the feed is no longer duplicated.
//   v24a  03-Nov-2026  Calendar: "Subscribe" button removed (Add to calendar only).
//   v24   03-Nov-2026  Head-to-head on Match Stats; Add to Home Screen (manifest, icons, install button); add-to-calendar (.ics) on the fixtures page.
//   v23c  03-Nov-2026  One crest rule everywhere: club crest, else a circle with tidy initials (no RFU default logo).
//   v23b  03-Nov-2026  Fixtures pages: team name back top left under the season heading.
//   v23a  03-Nov-2026  Fixtures buttons renamed "Fixtures and Results (Mobile)" / "(TV View)"; fixtures pages show the club crest top left and an "<season> Season Fixtures" heading.
//   v23   03-Nov-2026  Fixtures TV view (?view=fixtures&layout=tv): whole season in two columns; kick-off times removed from the fixtures pages.
//   v22z  03-Nov-2026  Fixtures page: "Match Stats" button renamed "Next Match Stats".
//   v22y  03-Nov-2026  Fixtures and results page (?view=fixtures); "Menu" on public pages is now "Home".
//   v22x  03-Nov-2026  DEV PIN cookie now lasts 30 minutes instead of 30 days.
//   v22w  03-Nov-2026  PROD/DEV switch now uses thestatsboard.co.uk and dev.thestatsboard.co.uk.
//   v22v  03-Nov-2026  Club PIN: the links page (/?view=teams) needs CLUB_PIN; "Club access" link on the welcome screen. Screens stay open.
//   v22u  03-Nov-2026  Now and Next: Last/Next game heading and date same size, joined by a hyphen.
//   v22t  03-Nov-2026  Dev-only Release notes page (/release-notes) and footer link.
//   v22s  03-Nov-2026  No venue wording at all when a venue cannot be read (no "to be confirmed" placeholder).
//   v22r  03-Nov-2026  RFU "verify you are not a robot" challenge pages are no longer cached as data; retried after 5 minutes.
//   v22q  03-Nov-2026  Dev-only venue trace shows the start of a small/unexpected match-centre page.
//   v22p  03-Nov-2026  Venue: feed fields such as venueName/stadiumName/groundName now recognised; tolerant fallback for the match-centre label; richer dev-only ?debug=venue trace.
//   v22o  03-Nov-2026  Welcome call to action says "team" instead of "club".
//   v22n  03-Nov-2026  Welcome screen wording updated; shorter search placeholder so it fits on phones.
//   v22m  03-Nov-2026  Welcome screen remembers the last 3 teams chosen (this browser only) and links straight to them.
//   v22l  03-Nov-2026  Standard and mobile dashboards ring the most recent form result, as Match Stats does.
//   v22k  03-Nov-2026  Removed the amber frame from the DEV environment (the corner badge stays).
//   v22j  03-Nov-2026  UK date format (DD-MMM-YYYY); version stamp on every generated page.
//   v22i  03-Nov-2026  Change control (this header, /version, footers, header). Team crest shown in the link builders.
//   v22h  03-Nov-2026  The Stats Board welcome screen (search, unfold results, fold to links) on the bare address.
//   v22g  03-Nov-2026  Match Stats form newest-first; device-aware links page; copy buttons removed; DEV PIN gate.
//   v22f  02-Nov-2026  Elite fixture venue read from the feed "stadium" field; dev-only ?debug=venue trace.
//   v22e              Match Stats header "Next Game Day"; smaller HOME/AWAY tags.
//   v22d              ?debug=1 only works on the dev site (ENV_LABEL set).
//   v22c              Match Stats form alignment and division-best bar scaling.
//   v22b              Match Stats header and bars refinements; games played bar.
//   v22               Match Stats view (?view=match), crest colours, /api/crest proxy.
//   v21k              Now and Next side-tab rows; centred Home/Away record headings.
//   v21d-v21i         ENV banner, PROD/DEV switch, Now and Next row styles.
//   v21b-v21           Hourly cache, link builder, Share links, light/dark toggle, The Vandals naming.
//   v16-v20           Stacked Now and Next view and its phone layout.
//   v15               Links page.
//   v13-v14           Phone layout (?layout=mobile|auto).
//   v8-v12            League points fix (official RFU table), entity decoding, debug output.
// =============================================================================
const VERSION = "v3.25.1";
const BUILD_DATE = "14-Nov-2026"; // UK format DD-MMM-YYYY, used everywhere
const VERSION_LABEL = "The Stats Board " + VERSION + " \u00b7 " + BUILD_DATE;
// <RELEASE_NOTES_START>
const RELEASE_NOTES = `THE STATS BOARD - RELEASE NOTES
================================
How releases are controlled
- Every change gets a version. The same version and a one-line summary go in three places: the header at the top of _worker.js (VERSION, BUILD_DATE and the changelog), this file, and the zip file name.
- To check what is live, open /version on the site (JSON: version, build date, PROD or DEV) or read the version on any page: a footer on the welcome, links and link builder pages, and a small stamp on every other page. Every page also sends an X-Stats-Board-Version header.
- Version numbers (from v3.4) are major.minor.patch. A new feature or visible change raises the minor number (v3.4 to v3.5). A fix, wording change or tidy-up with no new feature raises the patch number (v3.4.1). A big change to how the site works, or a break with earlier behaviour (for example becoming a multi-club service), raises the major number (v4.0). Earlier versions keep their old names; v33 counts as v3.3.
- Dates are always UK format, DD-MMM-YYYY (for example 03-Nov-2026).
- Keep the previous zip. To roll back, redeploy it and check /version shows the old number.
- Test on DEV first (PIN protected), compare /version on both sites, then deploy the same zip to PROD.

Parked ideas (not built; move a line to the release table when it ships)
- Request logging and a Status page: record view, team, status, cache hit and stale-data flag (country and device type, no IP addresses) in Workers Analytics Engine, with a PIN-protected page showing whether each TV is still checking in. Needs a Pages binding set up in Cloudflare first.
- More statistics: close games (decided by 7 points or fewer), points per game against the league average, season pace (labelled as a rough guide), home/away split of points scored.
- Standard dashboard in portrait on an iPad: it fits the screen but the stat boxes and results list are tight.
- Offline support: show the last page if the device loses its connection.
- Head-to-head beyond the current season (the feed only covers the current one).
- Venues: some are unreadable because the RFU site shows its robot check.
- Luck check with both teams on the opposition report (yours first, then the opponent): mocked up, not built.
- Next builds, in order (agreed 07-Nov-2026): (1) DONE v3.4 version scheme and audit of Ivybridge-specific items (below); DONE v3.6 Documentation page and removal of the PROD/DEV switch; (2) DONE in v3.5, except the message address and the QR/message/visit switches: admin page with settings per club in Cloudflare KV: notices for the homepage and for TV screens (each with an "Applies to" choice: all screens, club teams only, chosen teams; style; optional hide-after date), on/off switches (QR code, around-the-league strip, TV weather, last-checked line, walkover colours, Message us form, visit counting), and the address messages go to; (3) Message the Stats Board form (/contact, emailed through Resend, optional reply email, spam protection); (4) DONE v3.10 visit counts per club (Workers Analytics Engine, screens counted separately from people, Usage page); REORDERED 09-Nov-2026: next are (4b) other-competition buttons on the team, Fixtures and Match Stats pages on phone and iPad only (not TV) with a team search that passes straight through to the league, (4c) a small note on the Match Stats cup view saying form and stats cover that cup only, then GitHub set-up; UPDATED 10-Nov-2026: v3.10 to v3.13.1 are built (counting, Reporting section, screens, club page opens and wrong PINs, speed work, live/test split); the NEXT build (v3.14) is (4b), (4c), search engine rule option 2 (noindex on the team, Fixtures, Match Stats, Match Centre and Opposition Report pages; the welcome page stays findable; no robots.txt), a Sign out link (clears the club cookie on that device; footer of the Links, Admin and Usage pages; the sign-in lasts a fixed 30 days from PIN entry and is not renewed by use; and an admin setting for how long a PIN sign-in lasts: 1, 7, 14 or 30 days, agreed 10-Nov-2026, default 30; it applies to the next PIN entry, devices already signed in keep the length they were given; the setting is read when the cookie is issued), keep the englandrugby.com competition-list lookups (api/fixtures-and-result teamSelect, competitionSelect, search, and the search-results page used for the competition list) in the stored copy for 6 to 24 hours via ttlFor instead of the live clock, and probe on DEV whether the RFU data service (cluster.england-rfu.com, for example /fixtures-and-results/search) can supply a team's competition list so the website calls can be dropped (not yet known whether it can; agreed 10-Nov-2026). Remaining englandrugby.com use listed 10-Nov-2026: competition list (builder API plus the team search-results page, used by the builder, the all-competitions lookups and past-season head-to-head), league table page (fallback only), match-centre page (venue for weather, only when the feed has none), crest images. Also and a new Documentation section describing the usage data columns (stats_board_usage: blob and double layout for page, pinfail and up records; table agreed 10-Nov-2026); (5) QR code on the Fixtures TV board, with an on/off switch and a per-link override (&qr=0). Mockups: message_form_mockup.png, admin_page_mockup_v2.png.
- Maintenance mode, a build of its own (v3.15, agreed 10-Nov-2026; mock-up maintenance_mode_mockup_v2.png): an admin switch that makes every page, TV screen, calendar and data call show a centred "The Stats Board / Back soon / Undergoing maintenance" page with rugby H-posts, a ball and stat bars, and nothing club-specific on it (no club name). Only /admin, /api/admin and the PIN pages stay open so it can be switched off. Optional extra single line (for example a return time). A "Pun line" dropdown fed by a per-club list stored in KV that can be added to, edited, deleted and restored to defaults (suggested seeds: "We're just lining up the conversion - Try again soon!", "Back after the break.", "We've gone into touch.", "Currently in the scrum.", "Awaiting the TMO.", "Held up over the line."; up to 20 lines, 100 characters, plain text), with choices "Random each visit" and "None", plus a Preview button. Calendar and data calls answer 503 with Retry-After so calendar apps keep their last copy; the page is noindex and never cached. Should sit in the outer fetch before the page cache and the count.
- Branding, a build of its own after v3.15 (decisions 10-Nov-2026; mock-up branding_mockup.png): logo direction A (green rugby ball with a bar chart cut into it and a gold highlight, wordmark "THE STATS BOARD" with STATS in white and BOARD in green); the name "The Stats Board" is final (owner); the rugby H-posts picture stays for the maintenance page only. Touch points: welcome page header and tagline, tab and home-screen icons (replace the current generic icons), footer on every page (logo, name, Documentation, Contact later), maintenance/PIN/error pages, link preview image and title for shared links, header on Documentation/Admin/Usage, calendar name suffix "(The Stats Board)", and a "Powered by The Stats Board" line on club TV boards that each club can switch off in the admin page. TV boards and team dashboards stay in the club's colours and crest. Tagline still to choose (suggestions given 10-Nov-2026). Before resale consider a UK IPO trade mark search on the name and logo.
- Release safeguard (10-Nov-2026): v3.13 and v3.13.1 went out with BUILD_DATE still reading 09-Nov-2026. check_release.py (in the working folder, not shipped) now fails a release if the version, build date (against today's UK date), header changelog line, What's new entry, README release row (date and zip name) and README entry headed with the version do not all agree, and build_release.sh runs sync, that check, all suites and the zip in one command so no step can be skipped. When GitHub is set up, move the same check into the automatic checks on every push, and consider stamping BUILD_DATE automatically at deploy.
- Security and hardening, to do in future (agreed 10-Nov-2026, after the v3.14 build): (a) replace the static PIN-hash cookie with a random expiring session token (the club cookie is currently a fixed unsalted SHA-256 of the PIN, so a captured cookie could be cracked offline if the PIN is short) and add a lockout or throttle on wrong PINs (today only a 1.2 s delay); (b) check and limit the values taken from the address before they reach the RFU (team, competition, division, season: random values skip the stored copies and could get the site blocked by the RFU) and cap the number of different lookups per visitor; (c) send the usual browser security headers (anti-framing, content-type checking, a content security policy); (d) owner actions, not code: use a long PIN or passphrase for the club and test PINs, turn on Cloudflare bot protection and a free rate-limiting rule on /club-unlock, set a billing alert if the Workers Paid plan is ever used, keep the API token read-only and rotate it if someone leaves, keep the GitHub repo private with two-step login on GitHub and Cloudflare, and before resale give each club its own PIN and settings and confirm the RFU data terms allow a paid product.
- Design rule (07-Nov-2026): the service may be resold, so nothing club-specific goes into the code; settings belong to a club (club:<id> in KV). Club name and colour stay per-link (&club=, &colour=) or come from the team itself, never a site-wide default. Before reselling, confirm the RFU feed terms allow a paid product.
- Ivybridge-specific items to revisit one by one before any resale (audit 07-Nov-2026): (a) several pages fall back to the Ivybridge 1XV (team 11039, competition 1699, division 75791) when a link has no team= (about eight places; another club should get the team picker); (b) the TEAMS list (names, colours, leagues, IDs) is written into the code and drives the Links page and Match Centre; (c) names: the "Ivybridge RFC - Match Centre" heading, the "Ivybridge 2nd XV" to "The Vandals" rule, the default team name "Ivybridge"; (d) the PROD and DEV site addresses and the single CLUB_PIN; (e) the welcome page wording ("a personal project, free of charge") and the calendar file ID suffix @thestatsboard; (f) the TV club-name guess (team name trimmed, RFC added), which suits most clubs but not all (override with &club=).
- GitHub: look at how a GitHub repository could help this project (version history in place of zips, automatic deploys to DEV and PROD, running the tests automatically, tracking ideas). A view to be prepared for the user; nothing set up.
- Use the RFU API (spec at https://api.england-rfu.com/openapi.json, server cluster.england-rfu.com) where the probe shows it is better: previousMatch for head-to-head beyond this season, opta/standings in place of the scraped league table, team comparison and team stats, and search in place of the link builder's englandrugby.com proxy. Not covered by the API: venues and squads. Needs the DEV probe results first.
    Probe results (06-Nov-2026): worth using = seasons (isCurrent flag, could replace setting the season by hand), teamComparisonStats (wins, points, tries, penalties, conversions, drop goals, last-4 form for both teams), leagueStats (league-wide records, fortress, travellers, bonus-point %). Check = leagueTables key inside full-matches (may hold the table with bonus points). Not useful = opta/standings (group IDs only, empty for this league), opta/previousNextFollowing (empty), nextmatch (nothing new; kick-off times not set), playersByTeam. previousMatch and the headToHead block were empty for Thurrock and Old Albanian Saints, so head-to-head is unproven.
    Probe round 3 (06-Nov-2026): (1) full-matches already contains leagueTables with played, won, draw, lost, points, pointsFor, pointsAgainst, pointsDifference, tryBonusPoints, lossBonusPoints, pointsAdjustments and tablePosition for every team, so the englandrugby.com table scrape can be replaced by data from the request we already make (keep the scrape as a fallback). (2) CORRECTION: the seasons isCurrent flag is NOT reliable. On 06-Nov-2026 it still marks 2025-2026 as current and 2026-2027 as not current. If the season is automated, derive it from the start and end dates in the same list instead. (3) full-matches with season and teamId only returns that team's whole season (22 results for Ivybridge in 2025-2026, in a different league), so head-to-head and last-season history can be worked out ourselves from past seasons. previousMatch and headToHead stay empty and are not worth using.
    Cautions: try counts are only complete when the club records match events. Check points = tries x 5 + conversions x 2 + penalties x 3 + drop goals x 3 before showing them (Ivybridge adds up to 73; Old Albanian Saints shows 7 tries for 141 points, so it does not). teamStats tries differ from teamComparisonStats (Thurrock 14 v 7, Old Albanian Saints 4 v 7) and show tries against as 0, so do not use teamStats tries. Some player names are masked with asterisks.
- A combined view of the club's own three teams (position and form side by side).
- Admin settings page (PIN protected) so settings can be changed without editing code:
    - Set the current season (instead of it being changed in the code each year).
    - Team list (IDs per team), venue overrides, notice banner, feature switches, rating thresholds, TV refresh and rotation timings, cache length and clear-cache, change PIN, version and environment panel.
    - Needs a small Cloudflare KV store attached to the project (set up once), as Pages code cannot save to itself.

Release table (newest first; dates are UK DD-MMM-YYYY and recorded from v22f)
Version | Date        | Zip file                                    | Rolls back to
v3.25.1 | 14-Nov-2026 | RFU_Club_Dashboard_v3.25.1_switch_fix.zip           | v3.25
v3.25   | 13-Nov-2026 | RFU_Club_Dashboard_v3.25_website_switch.zip         | v3.24
v3.24   | 13-Nov-2026 | RFU_Club_Dashboard_v3.24_screen_names.zip           | v3.23.3
v3.23.3 | 13-Nov-2026 | RFU_Club_Dashboard_v3.23.3_pick_names.zip           | v3.23.2
v3.23.2 | 13-Nov-2026 | RFU_Club_Dashboard_v3.23.2_usage_other_teams.zip   | v3.23.1
v3.23.1 | 13-Nov-2026 | RFU_Club_Dashboard_v3.23.1_no_flicker.zip           | v3.23
v3.23   | 13-Nov-2026 | RFU_Club_Dashboard_v3.23_no_board.zip              | v3.22.5
v3.22.5 | 13-Nov-2026 | RFU_Club_Dashboard_v3.22.5_cup_pill2.zip            | v3.22.4
v3.22.4 | 13-Nov-2026 | RFU_Club_Dashboard_v3.22.4_cup_name.zip             | v3.22.3
v3.22.3 | 13-Nov-2026 | RFU_Club_Dashboard_v3.22.3_cup_pill.zip             | v3.22.2
v3.22.2 | 13-Nov-2026 | RFU_Club_Dashboard_v3.22.2_cup_matchstats.zip       | v3.22.1
v3.22.1 | 13-Nov-2026 | RFU_Club_Dashboard_v3.22.1_exeter_cup.zip          | v3.22
v3.22   | 13-Nov-2026 | RFU_Club_Dashboard_v3.22_match_sheet.zip           | v3.21.8
v3.21.8 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.8_probe_cards.zip         | v3.21.7
v3.21.7 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.7_tag_spacing.zip         | v3.21.6
v3.21.6 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.6_plain_crests.zip         | v3.21.5
v3.21.5 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.5_crest_circle.zip         | v3.21.4
v3.21.4 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.4_score_dash.zip          | v3.21.3
v3.21.3 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.3_name_room.zip                | v3.21.2
v3.21.2 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.2_descenders.zip            | v3.21.1
v3.21.1 | 12-Nov-2026 | RFU_Club_Dashboard_v3.21.1_next_game_tidy.zip      | v3.21
v3.21   | 12-Nov-2026 | RFU_Club_Dashboard_v3.21_match_centre_layouts.zip  | v3.20.1
v3.20.1 | 12-Nov-2026 | RFU_Club_Dashboard_v3.20.1_cache_key.zip            | v3.20
v3.20   | 12-Nov-2026 | RFU_Club_Dashboard_v3.20_address_checks.zip         | v3.19
v3.19   | 12-Nov-2026 | RFU_Club_Dashboard_v3.19_signin_lockout.zip         | v3.18.3
v3.18.3 | 12-Nov-2026 | RFU_Club_Dashboard_v3.18.3_release_table.zip         | v3.18.2
v3.18.2 | 12-Nov-2026 | RFU_Club_Dashboard_v3.18.2_footer_welcome.zip        | v3.18.1
v3.18.1 | 12-Nov-2026 | RFU_Club_Dashboard_v3.18.1_tagline.zip              | v3.18
v3.18   | 12-Nov-2026 | RFU_Club_Dashboard_v3.18_branding.zip              | v3.17.2
v3.17.2 | 12-Nov-2026 | RFU_Club_Dashboard_v3.17.2_preview_fix.zip           | v3.17.1
v3.17.1 | 12-Nov-2026 | RFU_Club_Dashboard_v3.17.1_maintenance_pin.zip      | v3.17
v3.17   | 12-Nov-2026 | RFU_Club_Dashboard_v3.17_maintenance_mode.zip      | v3.16.4
v3.16.4 | 12-Nov-2026 | RFU_Club_Dashboard_v3.16.4_directions_button.zip   | v3.16.3
v3.16.3 | 12-Nov-2026 | RFU_Club_Dashboard_v3.16.3_outside_calls.zip       | v3.16.2
v3.16.2 | 12-Nov-2026 | RFU_Club_Dashboard_v3.16.2_usage_fix.zip           | v3.16.1
v3.16.1 | 12-Nov-2026 | RFU_Club_Dashboard_v3.16.1_cup_venue.zip           | v3.16
v3.16   | 12-Nov-2026 | RFU_Club_Dashboard_v3.16_venue_from_rfu.zip        | v3.15.6
v3.15.6 | 12-Nov-2026 | RFU_Club_Dashboard_v3.15.6_match_centre_footer.zip  | v3.15.5
v3.15.5 | 12-Nov-2026 | RFU_Club_Dashboard_v3.15.5_venue_probe.zip         | v3.15.4
v3.15.4 | 12-Nov-2026 | RFU_Club_Dashboard_v3.15.4_comp_tag.zip            | v3.15.3
v3.15.3 | 12-Nov-2026 | RFU_Club_Dashboard_v3.15.3_buttons_home_only.zip  | v3.15.2
v3.15.2 | 12-Nov-2026 | RFU_Club_Dashboard_v3.15.2_buttons_home.zip       | v3.15.1
v3.15.1 | 12-Nov-2026 | RFU_Club_Dashboard_v3.15.1_app_buttons.zip        | v3.15
v3.15   | 12-Nov-2026 | RFU_Club_Dashboard_v3.15_data_service.zip        | v3.14.5
v3.14.5 | 12-Nov-2026 | RFU_Club_Dashboard_v3.14.5_probe.zip              | v3.14.4
v3.14.4 | 12-Nov-2026 | RFU_Club_Dashboard_v3.14.4_rfu_calls.zip         | v3.14.3
v3.14.3 | 12-Nov-2026 | RFU_Club_Dashboard_v3.14.3_match_cache_2h.zip    | v3.14.2
v3.14.2 | 12-Nov-2026 | RFU_Club_Dashboard_v3.14.2_match_cache.zip       | v3.14.1
v3.14.1 | 12-Nov-2026 | RFU_Club_Dashboard_v3.14.1_usage_today.zip       | v3.14
v3.14   | 10-Nov-2026 | RFU_Club_Dashboard_v3.14_buttons.zip           | v3.13.1
v3.13.1 | 10-Nov-2026 | RFU_Club_Dashboard_v3.13.1_usage_scope.zip     | v3.13
v3.13   | 10-Nov-2026 | RFU_Club_Dashboard_v3.13_speed.zip             | v3.12
v3.12   | 09-Nov-2026 | RFU_Club_Dashboard_v3.12_screens_pin.zip       | v3.11
v3.11   | 09-Nov-2026 | RFU_Club_Dashboard_v3.11_reporting.zip         | v3.10
v3.10   | 09-Nov-2026 | RFU_Club_Dashboard_v3.10_visit_counts.zip      | v3.9.1
v3.9.1  | 09-Nov-2026 | RFU_Club_Dashboard_v3.9.1_colts_name.zip       | v3.9
v3.9    | 09-Nov-2026 | RFU_Club_Dashboard_v3.9_colts.zip            | v3.8.1
v3.8.1  | 09-Nov-2026 | RFU_Club_Dashboard_v3.8.1_cup_form.zip      | v3.8
v3.8    | 09-Nov-2026 | RFU_Club_Dashboard_v3.8_all_competitions.zip | v3.7.1
v3.7.1  | 09-Nov-2026 | RFU_Club_Dashboard_v3.7.1_next_fixture_cups.zip | v3.7
v3.7    | 09-Nov-2026 | RFU_Club_Dashboard_v3.7_cup_match_stats.zip  | v3.6.4
v3.6.4  | 09-Nov-2026 | RFU_Club_Dashboard_v3.6.4_age_groups.zip    | v3.6.3
v3.6.3  | 09-Nov-2026 | RFU_Club_Dashboard_v3.6.3_club_heading.zip  | v3.6.2
v3.6.2  | 09-Nov-2026 | RFU_Club_Dashboard_v3.6.2_name_clip.zip     | v3.6.1
v3.6.1  | 07-Nov-2026 | RFU_Club_Dashboard_v3.6.1_docs_fix.zip      | v3.6
v3.6    | 07-Nov-2026 | RFU_Club_Dashboard_v3.6_documentation.zip   | v3.5
v3.5    | 07-Nov-2026 | RFU_Club_Dashboard_v3.5_admin_settings.zip  | v3.4
v3.4    | 07-Nov-2026 | RFU_Club_Dashboard_v3.4_version_scheme.zip  | v33
v33     | 07-Nov-2026 | RFU_Club_Dashboard_v33_link_docs.zip        | v32
v32     | 07-Nov-2026 | RFU_Club_Dashboard_v32_tv_branding.zip      | v31h
v31h    | 07-Nov-2026 | RFU_Club_Dashboard_v31h_walkover_colours.zip| v31g
v31g    | 07-Nov-2026 | RFU_Club_Dashboard_v31g_walkover_winner.zip | v31f
v31f    | 07-Nov-2026 | RFU_Club_Dashboard_v31f_around_league.zip   | v31e
v31e    | 07-Nov-2026 | RFU_Club_Dashboard_v31e_away_weather.zip    | v31d
v31d    | 07-Nov-2026 | RFU_Club_Dashboard_v31d_cup_chip.zip        | v31c
v31c    | 07-Nov-2026 | RFU_Club_Dashboard_v31c_fixtures_cups.zip   | v31b
v31b    | 07-Nov-2026 | RFU_Club_Dashboard_v31b_fixtures_debug.zip  | v31a
v31a    | 07-Nov-2026 | RFU_Club_Dashboard_v31a_all_fixtures.zip    | v31
v31     | 07-Nov-2026 | RFU_Club_Dashboard_v31_tv_fit.zip           | v30z
v30z    | 07-Nov-2026 | RFU_Club_Dashboard_v30z_tap_rows.zip        | v30y
v30y    | 07-Nov-2026 | RFU_Club_Dashboard_v30y_landscape_bars.zip  | v30x
v30x    | 06-Nov-2026 | RFU_Club_Dashboard_v30x_auto_season.zip     | v30w
v30w    | 06-Nov-2026 | RFU_Club_Dashboard_v30w_h2h_cups.zip        | v30v
v30v    | 06-Nov-2026 | RFU_Club_Dashboard_v30v_h2h_void.zip        | v30u
v30u    | 06-Nov-2026 | RFU_Club_Dashboard_v30u_h2h_candidates.zip  | v30t
v30t    | 06-Nov-2026 | RFU_Club_Dashboard_v30t_h2h_diagnosis.zip   | v30s
v30s    | 06-Nov-2026 | RFU_Club_Dashboard_v30s_opposition_groups.zip | v30r
v30r    | 06-Nov-2026 | RFU_Club_Dashboard_v30r_head_to_head.zip    | v30q
v30q    | 06-Nov-2026 | RFU_Club_Dashboard_v30q_walkovers.zip       | v30p
v30p    | 06-Nov-2026 | RFU_Club_Dashboard_v30p_unscored_debug.zip  | v30o
v30o    | 06-Nov-2026 | RFU_Club_Dashboard_v30o_table_from_feed.zip | v30n
v30n    | 06-Nov-2026 | RFU_Club_Dashboard_v30n_probe_checks.zip    | v30m
v30m    | 06-Nov-2026 | RFU_Club_Dashboard_v30m_rfu_api_probe.zip   | v30l
v30l    | 06-Nov-2026 | RFU_Club_Dashboard_v30l_build_date_fix.zip  | v30k
v30k    | 06-Nov-2026 | RFU_Club_Dashboard_v30k_rotate_message.zip  | v30j
v30j    | 06-Nov-2026 | RFU_Club_Dashboard_v30j_sideways_match_stats.zip | v30i
v30i    | 06-Nov-2026 | RFU_Club_Dashboard_v30i_sideways_safe_areas.zip | v30h
v30h    | 06-Nov-2026 | RFU_Club_Dashboard_v30h_faster_team_page.zip | v30g
v30g    | 06-Nov-2026 | RFU_Club_Dashboard_v30g_light_form_chips.zip | v30f
v30f    | 06-Nov-2026 | RFU_Club_Dashboard_v30f_lightbulb.zip       | v30e
v30e    | 06-Nov-2026 | RFU_Club_Dashboard_v30e_panel_order.zip     | v30d
v30d    | 06-Nov-2026 | RFU_Club_Dashboard_v30d_game_and_runin.zip  | v30c
v30c    | 06-Nov-2026 | RFU_Club_Dashboard_v30c_clearer_difficulty.zip | v30b
v30b    | 06-Nov-2026 | RFU_Club_Dashboard_v30b_native_share.zip    | v30a
v30a    | 06-Nov-2026 | RFU_Club_Dashboard_v30a_search_straight_in.zip | v30
v30     | 06-Nov-2026 | RFU_Club_Dashboard_v30_navigation.zip       | v29g
v29g    | 05-Nov-2026 | RFU_Club_Dashboard_v29g_match_weather.zip   | v29f
v29f    | 05-Nov-2026 | RFU_Club_Dashboard_v29f_elite_directions.zip | v29e
v29e    | 05-Nov-2026 | RFU_Club_Dashboard_v29e_club_directions.zip | v29d
v29d    | 05-Nov-2026 | RFU_Club_Dashboard_v29d_phone_links.zip     | v29c
v29c    | 05-Nov-2026 | RFU_Club_Dashboard_v29c_no_tv_directions.zip| v29b
v29b    | 05-Nov-2026 | RFU_Club_Dashboard_v29b_compact_ground.zip  | v29a
v29a    | 05-Nov-2026 | RFU_Club_Dashboard_v29a_headings_weather.zip| v29
v29     | 05-Nov-2026 | RFU_Club_Dashboard_v29_game_prep.zip        | v28g
v28g    | 03-Nov-2026 | RFU_Club_Dashboard_v28g_elite_common.zip    | v28f
v28f    | 03-Nov-2026 | RFU_Club_Dashboard_v28f_all_competitions.zip| v28e
v28e    | 03-Nov-2026 | RFU_Club_Dashboard_v28e_builder_cups.zip    | v28d
v28d    | 03-Nov-2026 | RFU_Club_Dashboard_v28d_builder_diag.zip    | v28c
v28c    | 03-Nov-2026 | RFU_Club_Dashboard_v28c_crest_wdl.zip       | v28b
v28b    | 03-Nov-2026 | RFU_Club_Dashboard_v28b_trend_wording.zip   | v28a
v28a    | 03-Nov-2026 | RFU_Club_Dashboard_v28a_clear_wording.zip   | v28
v28     | 03-Nov-2026 | RFU_Club_Dashboard_v28_opposition.zip       | v27d
v27d    | 03-Nov-2026 | RFU_Club_Dashboard_v27d_ideas.zip           | v27c
v27c    | 03-Nov-2026 | RFU_Club_Dashboard_v27c_trophy.zip          | v27b
v27b    | 03-Nov-2026 | RFU_Club_Dashboard_v27b_leaders_heading.zip | v27a
v27a    | 03-Nov-2026 | RFU_Club_Dashboard_v27a_leaders_names.zip   | v27
v27     | 03-Nov-2026 | RFU_Club_Dashboard_v27_league_context.zip   | v26b
v26b    | 03-Nov-2026 | RFU_Club_Dashboard_v26b_favicon.zip         | v26a
v26a    | 03-Nov-2026 | RFU_Club_Dashboard_v26a_performance.zip     | v26
v26     | 03-Nov-2026 | RFU_Club_Dashboard_v26_auto_fit.zip         | v25c
v25c    | 03-Nov-2026 | RFU_Club_Dashboard_v25c_day_names.zip       | v25b
v25b    | 03-Nov-2026 | RFU_Club_Dashboard_v25b_countdown_fix.zip   | v25a
v25a    | 03-Nov-2026 | RFU_Club_Dashboard_v25a_match_centre.zip    | v25
v25     | 03-Nov-2026 | RFU_Club_Dashboard_v25_now_next_bold.zip    | v24d
v24d    | 03-Nov-2026 | RFU_Club_Dashboard_v24d_public_links.zip    | v24c
v24c    | 03-Nov-2026 | RFU_Club_Dashboard_v24c_all_day_calendar.zip | v24b
v24b    | 03-Nov-2026 | RFU_Club_Dashboard_v24b_no_duplicates.zip   | v24a
v24a    | 03-Nov-2026 | RFU_Club_Dashboard_v24a_no_subscribe.zip    | v24
v24     | 03-Nov-2026 | RFU_Club_Dashboard_v24_h2h_install_calendar.zip | v23c
v23c    | 03-Nov-2026 | RFU_Club_Dashboard_v23c_crest_rule.zip      | v23b
v23b    | 03-Nov-2026 | RFU_Club_Dashboard_v23b_team_name.zip       | v23a
v23a    | 03-Nov-2026 | RFU_Club_Dashboard_v23a_fixtures_tweaks.zip | v23
v23     | 03-Nov-2026 | RFU_Club_Dashboard_v23_fixtures_tv.zip      | v22z
v22z    | 03-Nov-2026 | RFU_Club_Dashboard_v22z_next_match_stats_label.zip | v22y
v22y    | 03-Nov-2026 | RFU_Club_Dashboard_v22y_fixtures.zip        | v22x
v22x    | 03-Nov-2026 | RFU_Club_Dashboard_v22x_dev_pin_30min.zip   | v22w
v22w    | 03-Nov-2026 | RFU_Club_Dashboard_v22w_custom_domain.zip   | v22v
v22v    | 03-Nov-2026 | RFU_Club_Dashboard_v22v_club_pin.zip        | v22u
v22u    | 03-Nov-2026 | RFU_Club_Dashboard_v22u_now_next_heading.zip | v22t
v22t    | 03-Nov-2026 | RFU_Club_Dashboard_v22t_release_notes.zip   | v22s
v22s    | 03-Nov-2026 | RFU_Club_Dashboard_v22s_no_venue_text.zip   | v22r
v22r    | 03-Nov-2026 | RFU_Club_Dashboard_v22r_robot_check.zip     | v22q
v22q    | 03-Nov-2026 | RFU_Club_Dashboard_v22q_venue_trace.zip     | v22p
v22p    | 03-Nov-2026 | RFU_Club_Dashboard_v22p_venue_checks.zip    | v22o
v22o    | 03-Nov-2026 | RFU_Club_Dashboard_v22o_welcome_team.zip    | v22n
v22n    | 03-Nov-2026 | RFU_Club_Dashboard_v22n_welcome_text.zip    | v22m
v22m    | 03-Nov-2026 | RFU_Club_Dashboard_v22m_recent_teams.zip    | v22l
v22l    | 03-Nov-2026 | RFU_Club_Dashboard_v22l_form_ring.zip       | v22k
v22k    | 03-Nov-2026 | RFU_Club_Dashboard_v22k_no_dev_frame.zip    | v22j
v22j    | 03-Nov-2026 | RFU_Club_Dashboard_v22j_uk_dates_stamp.zip  | v22i
v22i    | 03-Nov-2026 | RFU_Club_Dashboard_v22i_change_control.zip  | v22h
v22h    | 03-Nov-2026 | RFU_Club_Dashboard_v22h_stats_board.zip     | v22g
v22g    | 03-Nov-2026 | RFU_Club_Dashboard_v22g.zip                 | v22f
v22f    | 02-Nov-2026 | RFU_Club_Dashboard_v22f_elite_venue.zip     | v22e
v22e    | unrecorded  | RFU_Club_Dashboard_v22e_match_stats.zip     | v22d
Earlier versions are described in the notes below. Zips from v22g and earlier were not kept by the assistant; use your own downloaded copies.

v3.25.1 - Website back-up switch fix
- The new website back-up switch shared an id with the weather switch, so saving Admin read the weather switch for both. It now has its own id, and a test checks that no two controls on the Admin page share one.

v3.25 - Website back-up switch
- Admin > Features has a new switch, "England Rugby website as a back-up", on by default. Off means the site only uses the RFU data service: the league-table page, the ground (venue) page and the team-search fallback on englandrugby.com are not called, and a table, ground or team list the data service cannot supply is left blank (the team builder says so). The setting is checked on each request, so it takes effect within a minute or two. Watch the RFU web page row on the Usage page before turning it off.

v3.24 - Named screens
- Add &screen=Clubhouse+Bar to any TV link (Match Centre, Fixtures, team screens) and the Usage page lists that screen by name with its loads and when it was last seen. The label is only what the club types (letters, numbers, spaces, - _ .; 24 characters). It is ignored if absent, does not change the page, and is kept only for TV screens. A browser cannot give its host name, and the site keeps no IP address.

v3.23.3 - Picked teams show their name
- When a team is chosen in the link builder, its name (as listed by the RFU search) is now recorded with its number, so the Usage card "Teams that are not in our list" shows names. Only the team name and numbers are kept, never typed search text.

v3.23.2 - Usage: other teams
- The Usage page card "Teams that are not in our list" was empty even though 16 teams had been picked. Picks were being counted without the team (the code looked for id= but the link builder sends team=), and the card only listed page and screen views, not picks. Picks are now recorded with the team number and shown in the card (as "Team 41" if no name is known). Only the number is kept, never typed text. Picks made before this release have no team and cannot be recovered.

v3.23.1 - No resize flicker on TV screens
- TV and tablet screens measure themselves and shrink text to fit. That ran several times as the page loaded (once straight away, again when crests and fonts arrived, and once more 0.4 seconds later), so the layout visibly jumped. The page is now kept invisible while it fits and fades in once, after the last fit (at most 2.5 seconds). Phones are unaffected.

v3.23 - Board layout removed
- The Match Centre Board layout (one row per team) is removed because it was not bold enough. Admin now offers Next game first and Classic rows. A club that had saved Board now gets Next game first. With more than four teams the Match Centre uses Classic rows instead of the Board. The ground and "2nd v 3rd" lines stay on Next game first.

v3.22.5 - Cup tag clipping, second fix
- The cup tag on the Fixtures TV page is now its own box with its own line height; if the name is too long for the space it is shortened inside the tag instead of being cut at its edge.

v3.22.4 - Real cup name
- Cup games the RFU team feed lists without a name (such as the Premiership Cup) now take the cup name from the RFU match record, for example Prem Rugby Cup, instead of just Cup. Pool and round wording is dropped so the tag stays short. If the record has no name, it still says Cup.

v3.22.3 - Fixtures TV cup tag
- The gold cup tag (for example Investec Champions Cup) under each opponent on the Fixtures TV page was clipped at the top and bottom. The line under the opponent name now has enough height for the tag.

v3.22.2 - Match Stats and Opposition Report on cup games
- For a cup game the RFU lists without a competition (such as an Exeter Premiership Cup tie), Match Stats now shows that game as the next game with a "No cup stats yet" note, and the Opposition Report says there is no report for it, instead of showing the next league game.

v3.22.1 - Cup games on elite teams
- An elite side (such as Exeter Chiefs) showed a later league game as its next game on the Fixtures TV page and Match Centre when it was playing a Premiership Cup game that night. The RFU lists those cup games in the team feed with no competition name, so they were mistaken for league games. For elite teams they are now labelled Cup, and the nearest game is shown. Match Stats still compares the two teams in the league until a cup table is available.

v3.22 - Ground and table line on the Match Centre, and the admin Match sheet
- Owner request (13-Nov-2026): after probing the RFU data service (match record, team sheets, scorers, match stats), build the parts that are new. The ground, directions and head-to-head already existed (v3.16 and v30s), so they are not rebuilt.
- Match Centre on a TV (Next game first and Board layouts): each next game now shows the ground (from the RFU match record, as before) and a line such as "2nd v 3rd - 1 point apart", from the public league table. It appears for league games only. Classic rows and phones are unchanged. No kick-off time, no QR code and no difficulty rating are shown.
- New page /matchsheet (club PIN, linked from Admin): for the chosen team, the next game and the last game with both team sheets (shirt number, position, captain and vice captain) and, for the last game, the scoring (tries, conversions and missed conversions with the minute and player). When no sheet has been entered it says so.
- Names: under-18 teams (by team or league name) and any player the RFU marks as under 18 are shown by shirt number and position only. "Name withheld" is shown as the RFU supplies it. The staff who entered the data, and the players' own ID numbers, are never read into the page.
- Scorers are only listed for clubs that enter match events (normally our own club), so the other side may show none. The page is never cached, not indexed, and is not on PROD pages that need no PIN.
- No change to the data the other pages read; the RFU team sheet and scorers calls are kept for two minutes and appear on the Usage page as "RFU team sheet".

v3.21.8 - Probe page: five more RFU endpoint cards
- Owner request (12-Nov-2026): look at the full RFU explorer list (api.england-rfu.com/explorer/openapi.json, version 1.94.3) for data we do not use yet. The Probe page already had cards for most of it, and earlier rounds (06-Nov-2026) found previousMatch and headToHead empty.
- New cards, testing only (DEV /probe, club PIN): (1) POST matches/all for a team and one group; (2) the same with no group, to see whether one call covers every competition; (3) /gms/matchparticipants (who played); (4) /gms/matchevents (tries, conversions, cards); (5) /stats/matchCentreStats (match stats, expected to be elite games only). Player names appear in (3): for under-18 sides do not put those on a public screen.
- The probe's request builder now accepts a request body made of objects as well as a list of numbers. No change to any public page.

v3.21.7 - Opposition report tag spacing
- Owner feedback (12-Nov-2026, iPhone screenshot): under the heading, the position, "Away at ..." and cup tags wrapped onto two lines with no gap between the lines, so they looked bunched.
- The tags now have 6px below them as well as beside them, so wrapped tags have an even gap. No other change.

v3.21.6 - Crests shown plain
- Owner feedback (12-Nov-2026): some crests (for example Winscombe) still showed a dark band across the top in the new layouts. Crests come in different shapes (round badges with clear corners, white squares, wide or tall pictures), so any circle behind them shows somewhere.
- Fix: in the two new layouts the circle is gone. Each crest is shown whole, at its own shape, straight onto the card or the team colour, with only slightly rounded corners. If a crest cannot load, the initials still show in a circle. Classic and the phone cards are unchanged.
- Replaces the v3.21.5 corner-colour method.

v3.21.5 - Crest circles match the crest
- Owner feedback (12-Nov-2026): where a crest has its own background (for example a white square), the circle around it was a different, darker colour.
- In the two new layouts each crest now sits on a hugely enlarged copy of itself showing only its top-left corner, which is the crest's own background colour, so the circle matches the crest and no ring shows. (A blurred copy was tried first and left a pink ring.) The Classic layout and phone cards are unchanged. If a crest cannot load, the initials show as before.
- Why this way: the crest pictures come from the RFU's image site, which does not allow the page to read their pixels, so the colour cannot be measured directly; an enlarged corner needs no permission.

v3.21.4 - Space around the score dash
- Owner feedback (12-Nov-2026): in the last-result score the dash touched the numbers (10-48) in both new layouts. The dash now has a small space each side (0.14 of the text size), so it reads 10 - 48 without a wide gap.

v3.21.3 - More room under names
- Owner feedback (12-Nov-2026): on the Board, the g in "Paignton II" was still cut off on the owner's screen. Cause: names are kept inside a box that hides overflow (so long names can be cut with an ellipsis), and the heavy bold font on that screen has a deeper tail than the one used in testing, so a line height of 1.2 was too tight. Names, league lines and score lines in both new layouts now use a line height of 1.45 to 1.5, which covers fonts with tall ascenders and deep tails.
- Test: a check that no name or sub-line has a line height under 1.35 times its font size, since that is where clipping starts with the deepest fonts.

v3.21.2 - Match Centre text clipping and Board headings
- Owner feedback (12-Nov-2026): on the Board, letters that hang below the line (the g in Paignton) were clipped. Cause: names are kept to one line and cut with an ellipsis, and the line height was too tight for the cut-off to leave room for the tails. Line heights are now looser on names, league lines and scores in both new layouts.
- Board: the next opponent name can now wrap to two lines instead of being cut with an ellipsis (it showed "Paignton C…").
- Board column headings (Team, Table, Last result, Next game) are larger and brighter.
- Test: every name and sub-line in both layouts is at least as tall as its text, so descenders fit.

v3.21.1 - Match Centre Next game first tidy-up
- Owner feedback (12-Nov-2026): the coloured Next game blocks changed height when a team had no last result; some text looked clipped; crests inside the colour were large and a low-quality crest looked poor; the Next game label was small.
- The coloured block is now a fixed share of each column (about a quarter smaller than before), so every team's block is the same height whatever else is shown. The Last result and Table area below fills the rest and has more room for its text.
- The crest inside the colour is smaller and sits inside the circle with a margin, so square crests are no longer cropped. The Next game label is larger. Table position and points have more room.

v3.21 - Match Centre layouts (Next game first, Board, Classic)
- New setting in Admin > Screens: Match Centre layout. Next game first (the default) gives each team a column with the next opponent's crest, name and date in the team colour, then the last result and the league position. Board gives one row per team: table, last result and next game, each with the opponent's crest. Classic rows is the previous layout, unchanged.
- Crests: the club's own crest and every opponent's crest come from the same place as on the other pages, with initials shown if one is missing.
- Phones always get the stacked cards, whatever is chosen. With more than four teams, Next game first switches to the Board so nothing gets cramped. No kick-off times and no Game Difficulty on these screens.
- A link can force a layout with &ly=next or &ly=classic (used by the Admin preview links). The page store key includes it.
- Changes in Admin reach screens within a few minutes on the live site (up to a minute for the setting, plus the two-minute page store).
- Tests: setting default and cleaning, each layout renders on desktop and the cards on phones, the layout link override, the notice strip still fits, more than four teams falls back to the Board, the Admin selector saves, and screenshots at 1920x1080 and 1366x768 have no overflow.

v3.20.1 - Page store ignores made-up settings
- Owner test (12-Nov-2026): a link with an extra made-up setting (&sillylink=here) still showed the team, which is correct, but each different extra gave the live site a new page to build, because the short-term page store was keyed by the whole address.
- Fix: the store key now uses only the settings the site reads, in a fixed order, so unknown extras (tracking tags, guesses) and the order of settings make no difference. Real links are unchanged and still show the same page. DEV never used the store, so nothing changes there.
- Tests: extras and order share one stored page; real differences (another team, season, theme) still get their own; and a check that every setting the code reads is on the list, so a future setting cannot be forgotten.

v3.20 - Address checks and a limit on different lookups (security part b)
- Team, competition and division in a link must be 1 to 8 digits, and season must look like 2026-2027 (two consecutive years from 2000 to 2099). An id on the API pages must be 1 to 9 digits. Anything else gets a plain "That link does not look right: the <name> value is not valid." (HTTP 400) before the site does any work, so nothing reaches the RFU. Empty values are treated as not given, as before. A link longer than 4,000 characters is refused.
- Limit: one visitor (by network address) may ask for 30 different team/competition/division/season combinations a minute across pages, the calendar and the competition list, and 60 team searches a minute. Beyond that they get "Please slow down and try again in a minute." (HTTP 429, Retry-After 60). The same team asked for again and again does not count towards the 30. Clubhouse screens and phones are nowhere near the limit. The count is kept by each running copy of the site, so it is a brake rather than an exact meter.
- Usage page: new "Address checks" card (after the Club pages and Wrong PIN row): not-valid and slowed-down counts, which part was wrong (only the name of the part, for example "season", never what was typed), a short per-day list and where from (country and county). Records are kind "sec" (one-way daily source code, as for wrong PINs; robots included) and are left out of the visit counts.
- Tests: 14 kinds of bad value refused with nothing sent to the RFU, valid links untouched, no bad value or address stored, the 30-lookup limit per visitor, other visitors unaffected, same team repeated is fine, the limit resets after a minute, the search limit, and the Usage card in a browser.

v3.19 - Safer sign-in and a temporary lockout (security part a)
- Sign-in cookies (club PIN and test-site PIN) are no longer a fixed code made from the PIN. They are random, expire (club: the sign-in length set in Admin; test site: 30 minutes) and are signed with a secret that is not the PIN. A captured cookie therefore cannot be used to work out the PIN, cannot be copied after it expires, and cannot be made up. Changing the PIN still signs everyone out at once.
- The signing secret is the SESSION_SECRET variable if you set one (16 or more characters), otherwise a random secret created once and kept in the settings store. Without either (no settings store) the site falls back to the old strength.
- Lockout: 5 wrong PINs from the same address within 15 minutes pauses that address for 15 minutes; a repeat pause is 1 hour, then 4 hours. The pause is per address, never permanent, and never affects anyone else. During a pause the correct PIN is refused too, with a message saying how long to wait. A correct PIN clears the count. The 1.2 second delay on wrong PINs stays. Wrong PINs typed in the maintenance-mode confirmation box count too. If you lock yourself out: wait, use another network (phone data), or change CLUB_PIN in Cloudflare.
- Everyone is asked for the PIN once more after this update, because old cookies are not accepted.
- Usage page: the "Wrong PIN entries" card now also shows how many temporary pauses started and how many guesses were refused while paused.
- Tests: new cookie format, tampered and expired cookies, PIN change, different cookie each sign-in, the old cookie format refused, lockout after five, other addresses unaffected, pause ends, second pause longer, correct PIN clears the count, test-site PIN and maintenance box covered, usage records written.

v3.18.3 - Release table order
- Owner report (12-Nov-2026): the release table was not in order. Rows v29e to v30v had been listed oldest first and sat above v30w to v30y; they are now newest first like the rest.
- The release check now fails the build if any row in the table has a later date than the row above it.

v3.18.2 - Match Stats footer and welcome page height
- Owner report (12-Nov-2026): on Match Stats the "Powered by" line sat tight under "Last updated"; and the welcome page needed scrolling when three recent teams were listed.
- Match Stats (TV and laptop layouts): more space is kept under the page so the two lines no longer touch (at least 10 pixels at 1280x720, 1366x768 and 1920x1080).
- Welcome page: when recent teams are listed the long introduction and the "To get started" line are hidden (the short no-warranty notice stays), the Recent block sits closer to the search box, and the separate footer is dropped there; Documentation now sits beside Club access. New visitors still see the full introduction.
- Tests: spacing measured at three screen sizes; welcome page height with three recent teams.

v3.18.1 - Tagline
- The tagline is now "Your club’s rugby fixtures, results and tables at a glance." (owner choice: the old line promised "always up to date", which the RFU feed cannot guarantee). Changed on the welcome page and the link-preview picture.

v3.18 - Branding
- New logo (rugby ball with a bar chart and a gold highlight) and wordmark "THE STATS BOARD". Tagline: "Rugby fixtures, results and tables, always up to date." (chosen from the mock-up; easy to change).
- New tab, iPhone and home-screen icons.
- Welcome page: logo header with the tagline. PIN pages and the maintenance page carry the logo too.
- Menu pages (welcome, links, Documentation, Admin, Usage) get a footer with the logo, name and a Documentation link.
- Shared links (WhatsApp, social) now show a branded picture, the site name and the team name, using the page's own address.
- Team pages, Match Centre and TV screens show a quiet "Powered by The Stats Board" line with the version. A new Admin switch (under Screens) turns it off, leaving just the version. TV boards and team dashboards keep the club's colours and crest.
- Calendar names now end "(The Stats Board)".
- Not in this build: a Contact link in the footer (comes with the contact form).
- Tests: link-preview tags, picture and icon files, welcome header, footers, PIN page logo, Powered by on and off, nothing club-specific on the maintenance page, plus all earlier suites and the screen-fit checks.

v3.17.2 - Maintenance preview shows unsaved choices
- Owner report (12-Nov-2026): Preview page showed the last saved pun line, not the one currently picked on the form.
- Fix: Preview now passes the selected pun line, extra message and line list from the form, so it matches what you see before you save. Nothing is stored by previewing.
- Tests: preview with a chosen line, None, extra text, unsaved lines, and hostile characters.

v3.17.1 - Maintenance mode asks for the PIN
- Switching maintenance mode on now needs the club PIN typed again: a PIN box appears under the switch, and the site checks it on the server. A missing or wrong PIN leaves the site as it was (wrong guesses are counted like other PIN failures). Switching it off, or editing lines while it is already on, needs no PIN.
- Tests: refused without a PIN, refused with a wrong PIN, accepted with the right one.

v3.17 - Maintenance mode
- New "Maintenance mode" section on the Admin page: a switch that makes every page, TV screen, calendar and data call show a centred "The Stats Board / Back soon / Undergoing maintenance" page (rugby posts, ball and stat bars; nothing club-specific). Only the Admin page, its save call and the PIN pages stay open so you can switch it off.
- Optional extra line for visitors (for example a return time) and a "Pun line" drop-down: Random each visit, one chosen line, or None. "Manage lines" lets you add, edit, delete and restore the default lines (up to 20, 100 characters each). Press Save changes to keep edits.
- "Preview page" opens the page without switching anything on (/maintenance-preview, club PIN).
- The page answers 503 with Retry-After, is never cached or indexed, and reloads itself every minute so clubhouse screens recover on their own. Calendar and data calls answer 503 plain text, so calendar apps keep their last copy.
- Tests: switch on/off, which paths stay open, 503 and headers, pun choices, escaping, settings clean-up, and Admin page script compile.

v3.16.4 - Clear "Get directions" button on Match Stats
- Owner report (12-Nov-2026): on a phone the "Tap for directions" hint after the ground was cut off at the screen edge, and it was easy to miss.
- Change: the ground address now wraps freely (up to three lines on a phone) and a blue "Get directions" button sits under it. The whole address is still tappable. On big TV screens the button stays hidden, as the old hint was, because nobody can tap a TV.
- The Match Centre keeps its small hint but it can now wrap instead of running off the edge.
- Directions now use the ground's own address and postcode from the RFU match record (for example "Queens Park, Queens Road, PAIGNTON, TQ4 6AT") rather than searching for "<club> Rugby Club", which could land in the wrong place. Grounds that come from the feed or the website keep the old behaviour.
- Tests: browser check at 390 and 360 pixel phones (button fully on screen, nothing cut off, no sideways scroll) and on a 1920 TV (hidden); plus a check that the link carries the postcode.

v3.16.3 - Usage page: outside calls per day
- Owner request (12-Nov-2026): see whether the website calls are falling, as a trend rather than one total.
- New card "Outside calls per day" (per hour on the Today view) between Club pages and Speed. Each bar is the number of times the site went outside for fresh data that day, split into the RFU website (gold, the one we want to shrink), the RFU data service (green: results feed, match record, season list, other) and the weather and postcode services (grey). The gold number under a bar is that day's website calls, and a line above the chart gives the period's totals.
- It follows the same range buttons as the rest of the page: Today, Last 7, 14, 30 and 90 days. (The Today button was added in v3.14.1; it was not visible while the page was stuck loading before v3.16.2.)
- Counts are real outside fetches only (stored copies are not counted), so a quiet day with everything cached shows low bars. A request killed by Cloudflare's CPU limit writes no record. If the query is refused the rest of the page still loads, and the card is simply left out.
- Test: the browser test now clicks Today, 7 and 30 days and checks the card draws with the right wording for each.

v3.16.2 - Usage page loads again
- Owner report (12-Nov-2026): the Usage page was stuck on "Loading...".
- Cause: in v3.14.1 (the Today view) one line of the page's script was mis-quoted (the "People per hour / People per day" chart), so the browser refused to run the page's script at all. The page itself and its data call were fine; only the drawing step never ran.
- Fix: that line is corrected.
- Why the tests missed it: they only checked the page text, never ran its script. Two new checks: every inline script on the main pages (usage, admin, documentation, links, release notes, welcome, team, TV, Match Stats, Fixtures, Opposition, Match Centre, phone app page and the DEV probe) must compile, and the Usage page is opened in a real browser with sample data for the Today, 7-day and 30-day views and must draw. Both fail on v3.16.1.

v3.16.1 - Cup game venue on the Match Centre
- Owner report (12-Nov-2026): the Colts' cup game (away at Paignton) showed its venue on Match Stats but not on the Match Centre.
- Cause: the Match Centre takes a team's next game of any competition from the Fixtures list, and for a cup game that list only used a venue if the RFU feed itself carried one. Match Stats goes through the fuller route, which had the lookup. League games were not affected.
- Fix: both routes now use the same lookup (RFU match record first, website page as the fallback). The lookup for the website page was moved into one shared function so there is a single copy. Fixtures game entries now carry the match id (public data, already in the RFU feed).
- Test added: a cup game with no venue in the feed shows the ground from the match record, and falls back to the website page when the record is down. The same test fails on v3.16.

v3.16 - Venues from the RFU data service
- Owner request (12-Nov-2026): stop reading the RFU website for venues. The DEV probe found that the RFU match record (cluster.england-rfu.com/gms/matches/{matchId}) holds the ground address, postcode and map position.
- The next game's ground is now read from that record first (street, area, town; for example "Showfield, Oaklands, Okehampton"). It is one small call per match, kept for 24 hours. The old website page is only used if the record has no ground or the service is down.
- The forecast uses the record's map position directly, so the postcode and place lookups are skipped when it is there. (Positions outside Great Britain are ignored.) The usage page lists the new call as "RFU match record".
- DEV only: add &venueweb=1 to a team page address to force the old website lookup, for comparison. &debug=venue shows which source supplied the ground.
- The venue text now reads with commas ("Showfield, Oaklands, Okehampton") where the website gave spaces. The map link and forecast work the same.
- Not tested against real data beyond the probe: other teams, cup games and games with no ground set (those fall back to the website).
- Numbering: maintenance mode moves from v3.16 to v3.17.

v3.15.6 - Match Centre: version line no longer overlaps the team rows
- Owner report (12-Nov-2026): v3.15.5 fixed the standard dashboard but the version line still sat over the bottom edge of the last team row on the real Match Centre (the four-team board).
- Fix: the Match Centre page now leaves a deeper strip at the bottom of the screen for the version line. Checked clear at 1920x1080, 2000x1080, 1366x768, 1280x720 and 1024x768. On DEV the orange "Test environment" badge still sits over the bottom-right corner; that is DEV only.

v3.15.5 - Venue probe checks, and the version line no longer overlaps the dashboard
- Owner request (12-Nov-2026): find out whether the RFU data service can supply venues, so the website lookup could be dropped.
- DEV probe page (/probe) has nine new "Venue check" calls: one match by ID (two different records), Match Centre availability, the club record (using the team ID, the opponent ID, or a club ID typed into the new clubId box), and the Find Rugby club entry (same three ways). The match ID fills itself in from the upcoming-games call. The scan for venue-like fields now also looks for town, city, street, lat, lon and lng. Nothing else changed; the probe is DEV only and saves nothing.
- Owner report: on the standard TV dashboard the small version line at the bottom overlapped the bottom of the panels. The fit script now leaves a strip below the panels for it and draws it at a fixed size whatever the page scale. Very small screens that already hit the 50% scale floor can still be tight.

v3.15.4 - Competition tag no longer cut off on fixture rows
- Owner report (12-Nov-2026): on the Fixtures board "NATIONAL UNDER 18 C..." was clipped (the row allows one line and cuts the rest).
- Fix: the tag shows a shortened name ("Under 18" to "U18", so "National U18 Cup"); the full name is in the tooltip. Other long names can still be cut off if they are very long; shorten more here (shortComp) if a case turns up.

v3.15.3 - Competition buttons on the Home page only
- Owner decision (12-Nov-2026): Match Stats picks its next game from every competition, so the buttons did nothing there either. Removed from Match Stats and Opposition; they stay on Home (team table, form, leaders by competition) in the phone and iPad app page. The older copy that was injected into plain pages is deleted (it never showed in the app page and the plain Home page has no bar for it).

v3.15.2 - Competition buttons off the Fixtures page
- Owner report (12-Nov-2026): the Fixtures page lists games from every competition whichever one is selected, so the buttons did nothing there.
- Change: the buttons now show on Home and on Next game (Match Stats and Opposition) only; hidden on Fixtures and Leaders, in the app page and on plain touch pages.
- Open question: Match Stats also picks the next game from every competition and switches to the cup view by itself, so the buttons may have little visible effect there too. Remove them from Match Stats if that proves right.

v3.15.1 - Fix: competition buttons missing on phones and iPads
- Owner report (12-Nov-2026): no buttons on DEV for Kingsbridge Colts (?app=1 address).
- Cause: phones and iPads open the app page (?app=1), which shows each view inside a frame (?embed=1). v3.14 added the buttons only to the plain pages, and skips frames, so they never showed on touch devices (only on a plain touch page, e.g. "use sideways anyway").
- Fix: the app page now has the row under the team bar (above the Match Stats / Opposition switch). It looks up the team's competitions (/api/builder/team) and shows buttons when there are two or more, on Home, Fixtures and Next game (Match Stats and Opposition); hidden on Leaders. Tapping one switches the competition, reloads the views and keeps Back working. The row scrolls sideways if there are many.
- Note: Kingsbridge Colts (11613) may well play in only one competition, in which case no row is correct. The Ivybridge Colts (11057) have the Devon Colts league and the National Under 18 Cup.
- Checked in a real browser at phone and iPad (portrait) width with a mocked lookup; not on the real feed.

v3.15 - Competition lists and team search from the RFU data service
- Why (12-Nov-2026): about half of the lookups to the englandrugby.com website were refused or failed, and the probe showed the RFU data service (cluster.england-rfu.com) answers in tens of milliseconds and carries competition and group ids on a team's upcoming games.
- Team search (/api/builder/search): asks the data service first (search?type=team); falls back to the website when it fails or finds nothing.
- Competition list (/api/builder/team): for the current season, built from the team's upcoming games (nextmatch, up to 60). Each distinct competition and group becomes a league. Games labelled "Manual Fixture" (friendlies) are not competitions and are left out. Competition names lose a trailing season ("Devon RFU Colts 2026-27" becomes "Devon RFU Colts"). Team name comes from the data service; the club line (shown only in the link builder) is blank on this path.
- Remembering: a competition seen once for a team and season is kept 30 days (edge cache plus memory), so a cup the team has finished does not vanish from "last result". The memory is per Cloudflare location.
- Falls back to the website (as before) when: a past or other season is asked for; the team has no upcoming games or only friendlies (off-season, knocked out of everything); the data service errors or is slow.
- Seasons list: now from the data service (current season worked out from dates, not the RFU "current" flag, which lags) and shows the latest 8.
- DEV check: add &webonly=1 to /api/builder/team or /api/builder/search to force the website and compare; every answer says which was used in "via".
- Caching: upcoming games 3 hours, team record 7 days, season list 1 day (unchanged).
- Still on the website: venues (24 hour cache, 6 hour failure memory), crest images, the competition-list backup above. The website table fallback was left in place.
- Not tested against the real feed: a team whose league has finished but whose cup is still running; teams in several leagues; a team whose only upcoming games are friendlies.

v3.14.5 - Probe page additions (DEV only, diagnostics)
- First probe results (12-Nov-2026, Ivybridge 1XV): the RFU data service has no venue, no crest and no competition names on a team's match list (full-matches by team has no competition or group on each match; teams/{id} holds only the name). Upcoming games (nextmatch) DO carry competition and group with ids. So a team's competition list may be buildable from nextmatch with a large count, but only for games still to be played; venues and crests still need the website.
- New call "Upcoming games, up to 60": lists each competition/group (with ids) in a team's upcoming games and how many games each has. To decide whether it can replace teamSelect/competitionSelect, run it for the Colts (team 11057, which plays cups) and for a team with no games left to play.
- "Copy all results" now includes the "found" block per call.

v3.14.4 - Fewer calls to the RFU website
- Owner decisions (12-Nov-2026): keep venues 24 hours; remember a failed lookup; skip the weather lookup when there is no venue; explore removing the RFU website lookups altogether.
- Venues: the RFU match-centre page (read only when the feed has no venue) is kept 24 hours and refreshed in the background during the last hour of that, keeping the old copy if the refresh fails.
- Failures: a refused or failed venue lookup is remembered for 6 hours, in the edge cache as well as in memory, so every copy of the site stops trying (before: 5 minutes, in one place only). Nothing is cached when it fails, so "until the cached result expires" cannot be used literally; 6 hours is the stand-in (VENUE_FAIL_SECONDS). Other pages keep the 5-minute memory.
- Weather: no forecast lookup when no venue is known (before, the club name was guessed). Games without a published venue show no forecast until one is found.
- DEV probe page: every result now has a "found" block listing venue, crest and competition/group fields in that response; new "This season: all matches for the team" call; the match summary lists each competition and group with the ids when present. Run "Run all" on DEV with the Ivybridge ids and send the copied results: this shows whether the RFU data service can replace the website for (1) a team's competition list, (2) venues, (3) crests.
- Still on the RFU website (candidates to remove once the probe answers): builder API (teamSelect, competitionSelect), search-results page (competitions the API omits, table fallback), match-centre page (venue), crest images.

v3.14.3 - Match Stats weekday cache 2 hours
- Owner request (12-Nov-2026): there are no games on weekdays, so Match Stats can be kept for 2 hours Monday to Friday. Weekends stay at 5 minutes; other pages 2 minutes. Effect: a result entered on a weekday can take up to 2 hours to show on Match Stats. If midweek fixtures are played, shorten pageTtlFor in the worker.

v3.14.2 - Match Stats kept longer
- Owner request (12-Nov-2026): Match Stats should be cached for longer (Cloudflare reported CPU-limit overages on the live site; 46 requests cut off, median CPU well above 10 ms).
- Change: on the live site the finished Match Stats page (?view=match) is kept at the edge for 30 minutes Monday to Friday and 5 minutes on Saturday and Sunday (UK days), instead of 2 minutes. Team, Fixtures and Match Centre pages keep 2 minutes. The test site is never cached. Repeat views inside the window cost almost no computing.
- Effect: a result entered on the RFU feed can take up to 30 minutes longer to reach Match Stats on a weekday; at weekends the delay stays short. The page cache is per exact address, so it helps most when the same link is opened often.
- Still to do if the overages continue: the started-versus-finished tracker, longer memory of failed RFU website fetches and caching the Match Centre page (suggested 12-Nov-2026, not built).

v3.14.1 - Usage page: Today view and a correct daily limit figure
- Owner report (12-Nov-2026): the "Cloudflare free limit" card said it showed a day but the figure looked like a longer period, and there was no Today view.
- Cause: the card counted a rolling 24 hours (now minus 24 hours), not Cloudflare's day, which restarts at midnight UTC. Everything else on the page covers the chosen range (7 to 90 days), as labelled.
- Fix: new Today button (first in the range row) shows everything since midnight UTC, with People per hour and Screen loads per hour charts. The free-limit card now counts since midnight UTC and shows the percentage used. If Cloudflare's database refuses the start-of-day calculation the page falls back to a rolling 24 hours and says so on the card (not tested against the real database; check Today and the card on DEV).
- The count is still a lower bound: it includes only requests the site records (pages, screens, calendar, club pages, searches), not robots, images or other files.
- Not changed: the default period setting in Admin stays 7/14/30/90.

v3.14 - Competition buttons, sign out, search engines
- Other-competition buttons: team, Fixtures and Match Stats pages show a row of buttons for the team's other competitions (league, cups) on phones and iPads only (touch screens); never on TV layouts or embeds. Each button keeps the page and swaps the competition and division. Shown only when the team plays in two or more competitions. The welcome-page team search now goes straight to the league when exactly one non-cup competition remains; the other competitions are the buttons on the team page. Links by address still work for any competition.
- Match Stats cup view: the footer line now says "Form and stats here cover the <cup> only".
- Search engines: team, Fixtures, Match Stats, Match Centre and Opposition pages carry noindex; the welcome page stays findable. No robots.txt.
- Sign out: /club-signout clears the club sign-in on that device (links at the bottom of the Links, Documentation and Admin pages and in the Usage page header).
- Admin > Access: how long a PIN sign-in lasts (1, 7, 14 or 30 days, default 30). Applies to the next PIN entry; devices already signed in keep their length; changing CLUB_PIN signs everyone out.
- Competition lists from englandrugby.com (teamSelect, competitionSelect and the team search-results page) are kept 12 hours.
- Documentation: new section "Usage data columns" for stats_board_usage; Admin guide, Privacy and freshness text updated.
- BUILD_DATE corrected to 10-Nov-2026.
- Not done: the probe of whether the RFU data service can supply a team's competition list (still to do on DEV); untested on the real feed: multi-competition teams and the cup note.

v3.13.1 - Fix: test visits showed on the live Usage page
- Cause: DEV and PROD both had the USAGE binding on the same dataset (stats_board_usage), and the report filtered only by club id, so both sites' records were mixed. The earlier advice to use a separate dataset name on DEV was optional and the report could not read a renamed dataset anyway.
- Fix: every record (page, tv, cal, club, search, pick, pinfail and the outside-fetch "up" records) is tagged club + "|live" or "|test" (test = the project has ENV_LABEL set). The report reads only its own tag. One shared dataset is now fine and is the setup to use.
- Effect: counts start afresh. Records written before v3.13.1 carry the plain club id, match neither tag and are left out (about 3 months until they age out). Nothing to change in Cloudflare.

v3.13 - Speed
- Owner concern (10-Nov-2026): pages across the site sometimes take several seconds. Cause found in the code (not measured on live): RFU data went out of date on a fixed clock (1 hour weekdays, 10 minutes Sat/Sun) and the next visitor then waited for the outside fetch, up to 8 s per stage; pages now make many more feed requests since v3.7/3.8 (all competitions, 5-season head to head); rarely-changing lookups used the same short clock.
- Stale-while-revalidate in cachedText: if a stored copy is past its clock but younger than 6 times the clock (weekends 1 hour, weekdays 6 hours), it is returned at once and refreshed in the background with ctx.waitUntil (SITE_CTX is the latest request's context; at worst a refresh is dropped and the next request retries). One background refresh per key per 15 s. Older than that, or no copy: the page waits for RFU as before, with a 4 s timeout when an older copy exists (fallback to it) and 8 s when none does. "Updated" on screen still shows when the data was really fetched, so up to an hour old on a Saturday after a quiet spell.
- Per-kind clocks (ttlFor): postcodes.io and Open-Meteo geocoding 30 days; Open-Meteo forecast 3 hours; RFU season list 1 day; everything else live (1 h weekdays, 10 min Sat/Sun). Cache API entries live for the longer of 7 days and the clock.
- Weather chain (postcode, place, forecast) was NOT parallelised: with the long clocks only the first lookup for a venue pays for the chain, so it was not worth the risk.
- Not done (decided against, 10-Nov-2026): scheduled cache warming (Pages has no cron triggers; a pinger would only warm one location), a shared KV cache for feeds (free KV allows 1,000 writes a day), smooth in-place TV refresh (left as an optional later item).
- Instrumentation: the outer fetch is now wrapped so every counted response records how long the worker took (double 2, ms), the HTTP status (blob 13) and whether it was served from the 2-minute page cache (blob 14: hit or miss). Every real outside fetch (never cache hits) writes a kind "up" data point: source label (RFU results feed, RFU season list, RFU feed (other), RFU web page, Postcode lookup, Place lookup, Weather forecast), outcome (ok, http, blocked, timeout, error), whether a visitor waited or it ran in the background, and the time in ms. No personal data. Both follow the Count visits switch. A Server-Timing: total;dur=N header is added to every response that passes the gates (visible in browser developer tools, Network tab).
- Usage page: new Speed panel with page build time (typical, slowest 1 in 20, share over 2 s, share ready made from the page cache) and outside data (fetches, typical, slowest 1 in 20, failed, visitor waited). The queries use quantileWeighted and IF; they were NOT tested against real Cloudflare, so they are wrapped so a refusal only hides the Speed panel ("Speed figures could not be read this time" if so). The requests-today figure now ignores the new kind "up" and "pinfail" data points. Timings only exist for traffic after this version; older data points have no time and are left out.
- Check after deploying: open /usage a day later; the "Visitor waited" column should be near zero for RFU sources and the "Over 2 s" share low; a Saturday after a quiet spell may still show one slow load per source (no old copy to show).

v3.12 - What the screens show, club page opens, wrong PINs
- Owner requests (09-Nov-2026): show which pages the clubhouse screens are loading; record how many times the Usage, Admin and Documentation pages are opened; show the number of wrong PIN entries.
- "What the screens are showing": screen loads by screen page (Match Centre, Fixtures board, Team dashboard TV layout, and so on) and team, with a share bar and the most different screens seen on any one day (a per-day maximum, because the screen code changes daily). Follows the Count clubhouse screen loads switch.
- Club pages: kind "club" records for /usage, /admin, /docs and the Links page, counted only after the PIN has been accepted (the PIN gate runs first), bots skipped, shown as opens and person-days. The Links page was added to the three asked for because it shares the same gate.
- Wrong PIN entries: kind "pinfail" written from the club PIN page and the test-site PIN page when a PIN is wrong (a blank entry counts). Stored: which PIN page, a one-way daily source code, country and county. The PIN text is never stored. Bots are NOT filtered for this one. Shown as a total, source-days, a per-day list and the top places. It follows the Count visits switch.
- Correction found while building: the Clubhouse screens tile used to count distinct screen codes over the whole range, which overstates it (the code changes daily, so 3 screens over 14 days read about 42). It now shows the most screens on one day. The Calendar tile is labelled subscriber-days for the same reason.
- Docs: Privacy, Admin guide, Usage description and What's new updated.

v3.11 - Reporting section and screen loads per day
- Owner request (09-Nov-2026): chart clubhouse screen loads per day, with an admin option to turn that off, a dedicated Reporting section on the Admin page, and a default period for the Usage page.
- Admin page: the "Visit counting" section is now "Reporting" with three settings: Count visits (features.count), Count clubhouse screen loads (features.screens, default on) and Default period on the Usage page (reporting.days: 7, 14, 30 or 90; default 14). Settings are per club in KV as before.
- Screens switch off: TV loads (layout=tv or view=stack) are not written at all, so the screens box and chart stay empty. Counting of people and calendars carries on.
- Usage page: new "Clubhouse screen loads per day" chart (loads per day, with the number of different screens under each bar). The page opens on the default period; the 7/14/30/90 buttons still work. /api/usage without a days value uses the default period.
- Note: screens are identified by connection plus browser details, so two identical screens on one network count as one screen (loads are still all counted).

v3.10 - Visit counting and the Usage page
- Owner decisions (09-Nov-2026): count in the worker with Cloudflare Workers Analytics Engine (not Web Analytics); report on a Usage page behind the club PIN; show the county for teams not in the club list; do NOT store typed search text (only the team and competition that were picked); more detailed per-club reporting for paying clubs later.
- What is stored per counted request (blobs): club id, kind (page, tv, cal, search, pick), view, team id, team name, competition, division, device (phone, tablet, computer, calendar), country, county, "team is on the club list" flag, and a one-way visitor code. No cookies, no IP address, no typed text. Robots (user agent matching bot, crawler, curl, preview and similar, or no user agent) are skipped. Data fetches (format=, embed=1, app=1), the links page, release notes, icons and the admin pages are not counted.
- Visitor code: first 8 bytes of SHA-256 of IP + user agent + today's UTC date + secret (USAGE_SALT, else CLUB_PIN). It changes every day, so a person counts once a day and cannot be followed across days. The report therefore shows person-days, not unique people over a range. TV screens (layout=tv or view=stack) and calendar feeds are separate kinds.
- Counting happens in the outer fetch before the 2-minute page cache, so cached pages are counted too. It runs through ctx.waitUntil and never delays or breaks a page; any failure is ignored.
- /usage (club PIN, not cached, not indexed): 7/14/30/90 day ranges; people per day (weekends gold), page views, screens, calendars, what people look at, our teams, teams NOT in our list (with competition ids and county; shows other clubs), device split, searches and picks (counts only), and requests counted in the last 24 hours against the Cloudflare free limit of 100,000 a day (a lower bound). /api/usage is the data call behind it.
- Admin page: new "Visit counting" section with a Count visits switch (features.count, default on). Counting also needs the USAGE binding.
- Set up once per project (also in Documentation, Admin guide): Pages project > Settings > Bindings > Add > Analytics Engine, variable USAGE, dataset stats_board_usage; secrets CF_ACCOUNT_ID and CF_API_TOKEN (Account Analytics Read) so /usage can read the data back; optional USAGE_SALT. Redeploy. Without the binding nothing is counted and /usage explains what to connect. Use a separate dataset name on DEV if you want it apart.
- Costs (checked 09-Nov-2026 against Cloudflare docs): Analytics Engine free plan allows 100,000 data points written and 10,000 read queries a day, and Cloudflare says it is not currently billing for it (paid rate quoted as $0.25 per extra million writes). The real limit is 100,000 Workers/Pages Functions requests a day across the whole Cloudflare account (DEV included); static files are exempt but _worker.js runs for nearly everything. Over the limit the free plan stops serving until midnight UTC rather than charging; Workers Paid is about $5 a month with 10 million requests a month included (price not confirmed on the pages read). Rough guide: one TV refreshing every minute is about 1,440 requests a day, so around 15 to 20 clubs with three screens each would need the paid plan.
- Data kept about 3 months by Analytics Engine. For paying clubs a nightly roll-up into longer-term storage is a later item.
- Privacy section, Admin guide, Reference (/usage, bindings) and What's new in the Documentation were updated.
- Not tested against the real Cloudflare SQL API from here (mocked). Check on DEV after adding the binding and secrets: visit a few pages, wait a minute, open /usage.

v3.9.1 - Colts friendly name
- The Colts' name in the TEAMS list is now "Colts" (it was "Ivybridge U18s"), so the Match Centre row, Links page card and admin tick list read "Colts". Their short label is also "Colts".
- Side effect handled: with a friendly name of just "Colts", the text "Home at <club>", the Directions search ("<club> Rugby Club") and the weather place guess were built from the friendly name and would have said "Home at Colts". They now use the club name taken from the team's real name in the RFU data (Ivybridge U18s gives Ivybridge), with the friendly name only as a last resort. This also fixes the same quirk for The Vandals ("Home at The Vandals" becomes "Home at Ivybridge").
- Checked with the mock feed: friendly name Colts gives "Home at Ivybridge" in the Opposition data and the Fixtures banner.

v3.9 - The Colts join the team list
- "Ivybridge U18s" (team 11057, Devon RFU Colts 2026-27, group 1: competition 2388, division 77306) is added to the TEAMS list in _worker.js, colour blue (#3d8fd6, change "accent" to alter it), label "Colts". That list drives: the Links page cards (dashboard, Match Stats, Fixtures, Opposition report, TV links), the "chosen teams" tick list on the admin page and the "club teams" scope of TV notices, and the Match Centre (view=stack).
- Match Centre with four teams: the four rows share the screen, so the text is scaled down when there are four or more rows (four: about 74%, five: 63%, six: 55% of the three-row size). With three rows nothing changes. Checked at 1920x1080, 1366x768 and 1280x720, with and without a TV notice: nothing is cut off.
- TV notice on the Match Centre: it used to assume three rows. It now counts the rows on the page, so four (or custom 5 and 6) fit under the notice.
- The Colts' league entry rolls over each season like the others (the link is re-pointed when their competition or division changes), through the same check as the other teams.
- Reminder for resale: the team list is still a fixed list in the code (audit item). A per-club team list in the admin page is on the later list.

v3.8.1 - Match Stats form follows the view
- Owner decision (09-Nov-2026): recent form stays in the competition being shown. On a cup game, Recent match form now lists each team's results in that cup only (it briefly showed all competitions in v3.7 to v3.8). In the early rounds it can read "No results yet", which is correct for that cup. League games are unchanged. The Match Centre form strip stays league only.

v3.8 - Every next game and last result covers all competitions
- Rule from the owner (09-Nov-2026): anywhere a next game is shown, it includes every competition the team plays in.
- Match Centre (view=stack, TV and phone) and the plain team summary behind it: the "Next game" box shows the team's next game of any competition and "Last result" the latest result of any competition. A cup game is tagged with the cup's name (gold text under "Next game", after the date on "Last result").
- Opposition Report: when the next game is a cup game the report is about that game and its opponent, read from the cup's own data (the cup name appears as a tag in the heading; "Group position over time" replaces "League position over time"). The report's other cards work as before, so a first-round cup opponent can show "too early to say" notes. The "Opposition Report" button is back on the Next fixture panel for cup games.
- Where it already covered every competition (unchanged): Fixtures page and board, calendar file, Match Stats (v3.7), Next fixture panel (v3.7.1).
- Form on the Match Centre and the old "Now and Next" form strip is still league only; say if you want it to cover all competitions.
- Checked with the mock feed: cup game first, league game first, first-round cup (Match Centre, plain summary, Opposition Report, Match Stats, Next fixture panel).

v3.7.1 - Next fixture panel follows cup games
- The "Next fixture" panel on the standard team dashboard (and its TV layout) took the next LEAGUE game, so a cup game due sooner was missed (seen on the Colts: cup game at Paignton on Sun 15 Nov, panel showing Kingsbridge on Sat 28 Nov). It now shows the team's next game of any competition. For a cup game the panel shows the date and kick-off time, the cup name with Home or Away fixture, the two teams with crests, and the venue if the RFU has one.
- For a cup game the phone buttons show Match Stats only. The Opposition Report still reads the next league game, so its button is left off for cup games until that is changed too.
- When the next game is a league game nothing changes. The "Next 5 opponents" and "This game" difficulty blocks are league-only and are not shown for a cup game.
- Not changed yet: the Match Centre (view=stack) screen and the Opposition Report still use the next league game.
- Checked with the mock feed: cup next, first-round cup, league next.

v3.7 - Match Stats for cup games
- Match Stats used to look at the next LEAGUE game only. It now takes the team's next game of any competition. If that game is a cup game it:
  * shows the cup name as a gold tag beside "Next game day";
  * reads the two teams from that cup's own RFU feed, so Games played, Wins, Points scored and conceded, Home wins and Away wins count only their games in that cup;
  * shows "Group position" and "Group points" bars only when the cup has a table of three or more teams (a straight knockout has none, so those two rows are left out);
  * says "First game in this cup" instead of empty bars when neither team has played in the cup yet;
  * (v3.7 kept Recent match form as all competitions; from v3.8.1 it is that cup only, see below);
  * uses the existing cup head-to-head: earlier meetings in that same cup over the last 5 seasons (it relies on the RFU naming the cup in earlier seasons; unnamed games are treated as league games, as before).
- League games behave exactly as before: when the next game is a league game there is no tag and the bars still say League position and League points.
- Not changed: the Opposition report still looks at the next league game only. Say if you want it to follow the cup too.
- How it works: the Fixtures data now carries the competition and division numbers for each game, and Match Stats asks for that cup's data in place of the league's. If the cup's data has no usable next game it falls back to the league game.
- Checked with a test team and a mock RFU feed: league game first (no tag), cup game first (tag, cup bars, Exmouth as the opponent, footer names the cup), and first round (message, no bars). Needs checking on DEV with a real cup game: the Colts' National Under 18 Cup game at Paignton on Sun 15 Nov is the live example.

v3.6.4 - Fix: age-group teams in the Fixtures TV heading
- The Colts are listed in the RFU feed as "Ivybridge U18s", and the heading read "IVYBRIDGE U18S RFC": the label-stripping rule knew "U18" but not "U18s". The rule that removes a team label from a club name (used for the heading, "Home at <club>" tags and the Directions links) now also removes U18s, U15's, Under 18s and similar, and Girls. Note: this is pattern based. If another team label turns up (for example "Ivybridge Colts"), send me the feed name and it is a one-line addition.

v3.6.3 - Fix: club name in the Fixtures TV heading
- The heading at the top right of the Fixtures TV board is the club name. For The Vandals it read "The Vandals RFC", because it was built from the team's display name. It is now built from the real team name in the RFU feed (Ivybridge II or similar), so all three Ivybridge teams read "Ivybridge RFC". A link can still set its own heading with &club=.

v3.6.2 - Fix: opponent name clipped on the Fixtures TV board
- In the Next game / Last game banner the opponent name has a fixed single-line height with overflow hidden (so long names are shortened with "..."). That also trimmed the bottom of letters that drop below the line (g, p, y, j, q), e.g. the g in "Paignton". The name now has a little extra room underneath, with matching negative margin so the banner layout and row sizes do not change. No other change.

v3.6.1 - Documentation correction (no change to the site's behaviour)
- The Documentation said the calendar file (/calendar.ics) covers league games only. It does not: it reads the same data as the Fixtures page, so cup, plate and friendly games are already in it (checked with a test team that has a league game and two cup games: all three are in the file). The Documentation now says so.
- Match Stats looks at the next LEAGUE game only (checked: with a cup game due tomorrow and a league game in 3 days, Match Stats compares the league game). The Documentation now says this plainly. Whether Match Stats should cover cup games is an open question: its bars compare league position and points, which a cup opponent from another division may not have.

v3.6 - Documentation page, and the PROD/DEV switch removed
- /docs (still behind the club PIN, locked on PROD until CLUB_PIN is set, never cached, noindex) is now called Documentation. The old Link variables page is one section of it. The Links page footer link now reads "Documentation".
- Layout: a contents list down the left on a wide screen (jump buttons across the top on a phone), then one block per section, each marked for who it is for (Everyone, Club admins, Site owner). Sections: Start here; Which page is which; Setting up a clubhouse screen; Link variables (with the "how a link is built" picture and a Try it button for each variable); Admin guide; How the data works; Definitions; Troubleshooting; Setup and deployment; Releases and versions; What's new; Privacy and security.
- To change it: everything is in one list in _worker.js (DOC_SECTIONS for the sections, DOCS for the link variables, both just above notesPage). Add or edit an entry and the page, its contents list and its Try it buttons follow. Keep it free of the DEV site's address.
- When a feature is added that changes what the site collects or how it behaves (visit counts, the Message form, the QR code), update the Privacy, Admin guide and What's new sections in the same release.
- The PROD/DEV switch is gone from the Links page ("You are on PROD / Switch to DEV"). The DEV site's address is no longer written anywhere in the code (the SITES list holds only the public address), so no page can point visitors at it. Moving between the two sites is now done by hand. A test checks that no PROD page mentions the DEV address or a switch. Side effect: on the DEV site, links created or shown on screen use the address the page was opened on.
- Old entries below still mention the switch and the DEV address; they are history and are only served on the DEV site.

v3.5 - Admin page and per-club settings (Cloudflare KV)
- New page /admin, behind the club PIN like the Links page and Link variables (PROD stays locked until CLUB_PIN is set; DEV is behind the DEV PIN). It is never cached and not indexed. There is an "Admin" link in the Links page footer.
- SET UP (once per Pages project): Cloudflare > Workers & Pages > the project > Settings > Bindings > Add > KV namespace. Variable name: SETTINGS. Pick a namespace (create one first under Storage & databases > KV). Use a separate namespace for DEV and PROD so test notices never reach the live site. Redeploy afterwards. Without the binding the site works exactly as before, every setting stays at its default, and /admin explains what to connect.
- Settings are stored per club (key club:ivybridge). Only one club exists today. Changes reach the screens within about a minute (a 30 second copy in the worker plus KV's own 60 second read cache); finished PROD pages are also kept for 2 minutes, so allow up to about 3 minutes on PROD.
- Homepage notice: a coloured block at the top of the page where visitors pick a team. On/off, text (up to 200 characters), style (Information blue or Warning amber) and an optional "hide automatically after" date. Everyone sees it (the homepage has no team, so it has no "applies to").
- TV screen notice: a slim one-line strip (up to 120 characters). On the Fixtures TV board it sits under the header and the fixture rows shrink slightly to make room, like the around-the-league strip. On other TV pages (layout=tv, and the Match Centre, view=stack) it is added at the top of the page and the page fits around it. It is not shown on phone pages.
- "Applies to" for the TV notice: Club teams only (the default: the teams on this club's Links page, so another club's screen never shows it), All screens, or Chosen teams (tick which). The Match Centre counts as a club screen.
- Switches (all on by default): "Around the league today" strip, weather on the TV banner, "last checked" feed time, walkover colours (off = the winner is just bold). These apply to the Fixtures TV board.
- Hide-after dates use UK time. On DEV, ?today=YYYY-MM-DD tests them.
- Saving checks everything: text is trimmed and stripped of control characters, unknown styles fall back to Information, unknown teams are dropped, only a real "off" turns a switch off. Saves must come from this site (same-origin check) and carry the club PIN cookie.
- Not in this version (planned, see Parked ideas): QR code, Message the Stats Board form, visit counts and their switches, the message address.

v3.4 - New version numbering (no change to the site)
- Version numbers are now major.minor.patch. v33 is treated as v3.3, so this release is v3.4. A new feature raises the minor number, a fix raises the patch number (v3.4.1), and a big change to how the site works raises the major number (v4.0). The old letter versions (v31a to v31h) are no longer used.
- Only the version label changes: the footer stamp, /version, the X-Stats-Board-Version header and the zip name now read v3.4. Nothing else on any page or screen is different.
- The rule is written into the release notes (How releases are controlled) and the worker header. The parked idea "Version numbering" is closed.
- Next builds and the design rule for a possible multi-club future are recorded under Parked ideas.

v33 - Link variables documentation page (/docs)
- A new page at /docs lists every setting you can add to a link, in sections: Team settings, Choosing the page, Screen and look, Colours and names, Data (JSON), Diagnostics and testing, Other addresses. Each entry shows the variable, its values, where it works, what it does, and "Try it" buttons that open a working example (using Ivybridge 1XV). It starts with a colour-coded picture of how a link is built.
- It is protected by the club PIN, the same as the Links page: on PROD it asks for CLUB_PIN (locked until that variable is set), on DEV it sits behind the DEV PIN. It is never cached and is marked noindex so search engines skip it. There is a "Link variables" link in the footer of the Links page.
- DEV-only items (debug=season, today=, /release-notes, /probe) show as plain "DEV only" labels on PROD.
- To keep it accurate: the list lives in one place in _worker.js (the DOCS list, just above notesPage). When a new variable is added, add one entry there; the page, its examples and its test all follow.
- This is also a first step towards an admin area; anything added later can be placed behind the same PIN.

v32 - Fixtures TV board: club branding
- Top right of the header: the club name (for example IVYBRIDGE RFC), the time and the date. The time is the screen's own clock (UK time) and updates by itself. The old league line and the Played / Won / Lost record that used to sit there are gone from the TV board (phones still show them).
- A narrow stripe down the left edge, the next-game highlight and banner outline, and the club name all use two colours taken from the team crest (the same method Match Stats uses). Win / loss badges stay green / red. A faint glow in the bottom corner uses the first colour. If the crest has no usable colours (mostly white or grey) or cannot load, it falls back to green and gold.
- Overrides on the link: &colour=1b7f3b sets the first colour (the second is still taken from the crest, or gold); &club=Ivybridge%20Rugby%20Club sets the club name text. By default the name is the team name without U18 / XV / Women etc, with RFC added unless it already looks like a club name (RFC, Rugby, Chiefs, Albion, Saracens).
- A small low-contrast line at the bottom left: "Data from the RFU fixtures feed - last checked 17:05". That is when this system last pulled the RFU data (not a time supplied by the RFU), which is why it says "checked" rather than "updated".
- Light theme (&theme=light): same layout, no dark glow, the club name in the first colour.
- No large logo or watermark. The full season is still listed, as before.

v31h - Around the league today: walkover colours
- In a walkover the side awarded the win is now green and the side that conceded is red (both bold), so it stands out from normal results. Normal results are unchanged (winner in bold white).

v31g - Around the league today: walkover winner
- A walkover in the strip showed only "W/O" with no sign of who got the win. The RFU kick-off code says: HWO = the home side is awarded the win, AWO = the away side. That side's name is now in bold, as for a normal win.

v31f - Fixtures TV board: "Around the league today"
- On a match day, a strip under the fixture list shows the other finished results in the same division (for example Newquay 24-17 Bideford), with the winner in bold and "N still to come" for games not yet in. Your own team's game is not repeated. It appears only on a day when at least one other game in the division has a score, so on quiet days and before the first result it is not there. Walkovers show W/O. Up to 8 results.
- To make it feel live, on Saturdays and Sundays (UK time) the RFU data is now cached for 10 minutes instead of an hour, and the Fixtures TV board reloads every 10 minutes then. Monday to Friday is unchanged (hourly). This applies to every view on those days, not just this strip.
- Only the division the team is linked to is used (the league, not cups). Phone views are unchanged.

v31e - Fixtures TV banner: weather for away games
- The "Forecast for the day" box on the Fixtures TV banner used to appear for home games only. It now also appears for away games, using the venue in the RFU feed (or the opponent's town or club name). If no forecast is available (more than about 15 days away, or the place cannot be found) the box is simply left out, as before.

v31d - Fixtures (phone): long cup names
- A long cup name such as National Under 18 Cup was split over two lines inside its amber chip on a phone. The chip now stays in one piece: if it does not fit beside Home / Away it drops to its own line, and if it is still too wide it is shortened with an ellipsis.

v31c - Fixtures page: cups read from their own competitions
- Diagnosis (U18s, from the v31b debug output): the RFU's team season feed returned only the 10 league games and carried no competition names at all, so tagging by name could never work. Cups live in their own competition/division.
- Now the Fixtures page reads the same list the link builder uses (every competition and division the team is entered in this season, including cups the RFU team page lists), fetches each one, adds the team's games from it and labels each game by the competition it came from. Games in the linked division are labelled League unless that division is itself a cup. Void games and walkovers behave as before.
- If the competition list cannot be read the page falls back to the league games only.
- &debug=fixtures now also shows "leagues" (what the team is entered in, with the linked one marked) and "otherDivisions" (what each added).
- If a cup still does not appear, open /api/builder/team?team=ID&season=2026-2027 and check the cup is listed; if the RFU does not list it there, it is not available to the dashboard.

v31b - Fixtures page diagnostics
- Added &debug=fixtures to the summary link: /?season=..&competition=..&division=..&team=..&teamName=..&format=summary&detail=fixtures&debug=fixtures . The "debug" part of the answer shows the version, how many games the league feed had, what the team's own season feed returned (matches found, how many are the team's, which competition names, how many were already in the league feed, how many were added) and the final count by competition and status. Use it when a team's cup games do not appear.

v31a - Fixtures page shows every game in the season, with the competition
- Teams such as the U18s, or elite sides, play league and cup games. The Fixtures page (phone and TV) used to show only the league division you linked to. It now also reads the team's own whole-season feed from the RFU and adds every other game: cups, plates, friendlies. Anything already in the league feed is not doubled up.
- Tags show whenever the team plays in more than one competition OR plays any cup game at all (so an elite team whose linked division is itself a cup is tagged too). Cups appear as amber chips on phone and TV.
- When a team plays in more than one competition, each row says which: "Home - League" or "Away - Devon Cup" (cup names in amber, stage words such as Pool, Semi Final removed). A team that only plays league shows no tags and looks exactly as before. The summary line says "All competitions: Played ... Won ..." in that case.
- Void games (kick-off code V: not played, no score) are shown in the Results list marked "Void" with a V badge, with their competition, and are not counted in Played / Won / Lost (the summary adds "Void n"). The RFU records no winner for a void game, so there is no win or loss to show; walkovers still show W/O with a W or L. If the team feed cannot be read, the page falls back to the league games only.
- Which words mean "not league" is the NOT_LEAGUE_RE list in _worker.js (cup, plate, vase, trophy, shield, bowl, friendly, festival, sevens, tens).
- Not changed yet: Match Stats and the calendar (.ics) still use the league feed only. Say if you want them to include cups too.
- Tests: t_v31a.mjs (16 checks).

v31 - Match Stats on TV fits any screen height
- On a TV or big screen whose window is short (for example 2000 x 746), the bars were squashed together, the Away wins label ran into the Head to head heading and the bottom was cut off. The page now measures itself and shrinks the text a step at a time until everything fits, and keeps a visible gap between the bar rows (not just touching), then re-checks whenever the window is resized or anything on the page changes (weather, crests and other late-loading content), so it cannot slip back. Full-height screens (for example 1920 x 1080) look as before. Phones still scroll as before.

v30z - Tap a row in the Send or copy a link sheet to open that page
- Each row (This page, Match Stats, Opposition report, Fixtures, Leaders and the clubhouse screen links) is now a link: tap anywhere on the row to go to that page. The Share / Copy button on the right still shares or copies instead. Keyboard: Tab to a row and press Enter.

v30y - Match Stats on a phone held sideways
- The stat bars were laid out in two columns in landscape on a phone, which made them hard to read. They are now a single column like portrait (the page scrolls if needed). TV and portrait layouts are unchanged.

v30x - Automatic season
- A link with no season= now follows the RFU season dates and switches to the new season by itself. A link with season= in it is pinned and behaves exactly as before. The eight places that had "2026-2027" typed in are now one calculation.
- To make a TV or sign follow automatically, remove season=2026-2027& from its link. Links already out there keep working, pinned to 2026-2027, until you change them.
- How the season is chosen: the season list is read from the RFU (cached about a day). The RFU "current" flag is not used because it lags. If the RFU list cannot be read, the date decides (August onwards = the new season), so screens never go blank.
- Summer gap (between the end of one season and the start of the next): the screen keeps showing last season's final table with a small amber notice, "New season fixtures not published yet. Showing the 2026-27 final table. This switches to 2027-28 automatically." It switches as soon as the RFU publishes that team's new-season fixtures (or on the new season's start date). Tap the notice to hide it. It shows on pages only, not inside the phone app's frames, and not in data feeds. (v31: it is a slim strip at the very top of the page, in the page flow, so it never covers the header; TV pages shrink slightly to make room.)
- Promotion / relegation: when a link has no season, the league is re-checked. If the team is not in that division this season, the worker looks up where the team plays and uses that (same competition and division name as last season, else the team's only league). If it cannot tell, the link is left as it is.
- Links page: a Season menu at the top. "Follow the current season" (default) gives links with no season in them; "Pin to 2026-27" etc. puts the season in every link. Screens themselves have no season menu.
- Link builder: new tick box "Follow the current season", ticked by default, which leaves season= out of the links it makes.
- DEV only: ?today=YYYY-MM-DD pretends today is that date (try 2027-06-20 for the summer gap, 2027-09-20 for next season); ?debug=season shows which season was chosen and why, the league check, and the banner.
- Tests: t_v30x.mjs (30 checks) covers in-season, mid-season, the gap with and without new fixtures, new season with a stale league, pinned links, RFU season list down, links page, stack view and builder.
- Not changed: the team names/league text shown on the links page still come from the TEAMS list in _worker.js (it only affects the label, not the data).

v30w - Head-to-head: cups count when the next game is in that cup
- Elite sides: the next game is often in a cup (for example Exeter Chiefs v Bath in the Premiership Rugby Cup). League-only meant those meetings were dropped. Now, when the next game is in a cup, earlier meetings in that same cup also count (matched by competition name, ignoring pool, group, round, stage and leg words, so "Premiership Rugby Cup Pool A" matches "Premiership Rugby Cup Pool B"). League meetings still count, and meetings in a different cup (for example a county cup) are still left out. When the next game is a league game, cup meetings are left out as before.
- h2hMeta.sameCup says how many meetings were counted this way; ?debug=h2h marks them "added (same cup as the next game)". Cup detection uses the group name and the competition name together, so a cup recognised only by its competition name is now caught too.
- To change which words mean "cup", edit NOT_LEAGUE in _worker.js.

v30v - Head-to-head: void games explained
- Found on DEV (2XV v Torquay Athletic II): both 2024-2025 games had kick-off time "V", no scores and matchNotSetup true. The RFU time field uses HWO (home awarded win), AWO (away awarded win) and V (void: not played, not counted). So the pair genuinely has no played league meeting, and head-to-head is working. Many pairs in a league have no recent meeting (promotion and relegation).
- Void games are now reported instead of leaving a silent gap. Match Stats: "No played league meetings in the last 5 seasons (2 games void in 2024-2025)", or a "Not counted: 1 game void in 2024-2025" line under a list that has meetings. Opposition report: the same, in the head-to-head card. h2hMeta.voided lists them (season and date). Void games never count as a result, a win, a loss or a score. A void game in a cup competition is ignored.
- ?debug=h2h marks them "skipped: void game (kick-off code V)".
- (Elite cup question answered in v30w.)

v30u - Head-to-head: what happens to each game against the opponent
- DEV result (2XV v Torquay Athletic II, &debug=h2h): the earlier-season lookup works (team IDs are the same across seasons; Brixham II and Brixham Crusaders both show ID 3319), and the 2024-2025 list shows The Vandals did play Torquay Athletic II [22970], yet no meeting was counted. So that game is being rejected somewhere.
- ?debug=h2h on the match summary now adds h2hMeta.candidates: every game against the opponent found in the feeds (up to 30), with season, type, date, time, scores, notSetup, group name and a result: "added", "skipped: no usable score", "skipped: no date" or "skipped: not a league game". h2hMeta also counts skippedUnplayed and skippedNoDate. Likely culprits: a postponed or void game with no scores, or a group name caught by the cup filter.

v30t - Head-to-head: find out why no meetings show
- Found on DEV (2XV v Torquay Athletic II): all five earlier seasons loaded (seasonsOk 5, seasonsFailed 0, nothing skipped) but no meetings were found. So either the pair genuinely have not met in a league game, or the opponent has a different team ID in older seasons.
- Fix 1: the opponent is now also matched by name (case, punctuation and "&" ignored) when the ID does not match. h2hMeta.matchedByName says how many meetings were found that way.
- Diagnosis: h2hMeta.perSeason lists, for each earlier season, how many matches the RFU returned and how many involve your team. Add &debug=h2h to the match summary address (/?format=summary&detail=match&...&debug=h2h) to also list every opponent your team met that season, with their ID and group name. Look for the opponent under another spelling or ID.
- Match Stats now says "No league meetings in the last 5 seasons" instead of showing nothing when the earlier seasons loaded but there are no meetings.
- Still to learn from DEV: whether older seasons carry the same team IDs. If the &debug=h2h list for 2025-2026 shows Torquay Athletic II under a different ID, name matching covers it. If it is not in the list at all, they did not meet in a league game that season.

v30s - Opposition report grouped, with head-to-head
- The opposition report was 12 cards in one long list. It is now four named groups, each in one panel with sub-headings:
  1. This game: game difficulty, rest and workload, and a one-line forecast (the full weather card stays on Match Stats).
  2. Their form: last results, last 3 games v their season average, their home or away record.
  3. You v them: head-to-head (new), common opponents, league position over time.
  4. Their season in numbers (folded away, tap to open, one-line summary on the header): close and heavy games, record v stronger and weaker sides, bonus points, luck check.
- Head-to-head on the report uses the same data as Match Stats (this season plus the previous five, league only): a bar of your wins, draws and their wins, the last three meetings as coloured tiles (green you, blue them, amber draw, W/O for a walkover), the average score (walkovers left out), and "Show all N meetings" for the full list grouped by season. With no meetings it says so. The opposition and Match Stats summaries share one helper (h2hFor), so the two screens always agree.
- Removed from the report: "Around you this weekend" (it is about your own league position, and it is still on Home). Forecast on the report is one line.
- Wide layout (&layout=wide): groups 1 and 2 on the left, groups 3 and 4 on the right. Light theme supported.
- Unchanged: the share-on-WhatsApp text, the Directions button, the data behind each card. The opposition summary JSON gains h2hAll, h2hSum, h2hMeta and h2hIds.
- Tests changed on purpose: the two weather checks now look for the one-line "Forecast".

v30r - Head-to-head history
- Match Stats now shows every league meeting between the two sides: this season plus the previous five seasons. It asks the RFU for each earlier season (full-matches with season and the team ID, five extra requests, cached for an hour like everything else) and keeps only games against the next opponent.
- League games only: a meeting is skipped if the competition or group name contains cup, plate, vase, trophy, shield, bowl, friendly, festival, sevens, tens (or 7s/10s). Games with no name are assumed to be league games. If a cup game slips through, or a league game is wrongly skipped, add or remove a word in NOT_LEAGUE (search for it in _worker.js). DEV ?debug=1 style check: the match summary JSON (format=summary&detail=match) has h2hMeta with seasonsFailed, skippedNotLeague and skippedNames.
- Big screen (option 1B): a split bar of wins / draws / wins, then up to five tiles, newest first. Each tile is coloured by the winner (the left team's colour, the right team's colour, or amber for a draw), shows the score, and says who won ("KINGSBRIDGE WON", "DRAW"). A walkover shows W/O and "(WALKOVER)". Under the tiles: average score (walkovers left out) and number of draws. The rest of the screen is tightened slightly so it still fits one screen.
- Phone (layout A): the same split bar, three tiles, the average line, and a "Show all N meetings" button that opens the full list grouped by season, with a colour bar for the winner, the date, the competition name, and the score.
- A failed season request is ignored (that season is missing), never an error. If there are no meetings at all, the old "Earlier this season" line is used when there is one, otherwise nothing is shown.
- Counts include walkovers as wins and losses; averages do not. Duplicates are removed.
- Not checked against the live RFU for past seasons from the build environment (no access). Please check on DEV: pick a team with a long-standing rival and compare the list with the RFU website.

v30q - Walkovers counted
- The RFU data marks a walkover with a kick-off "time" of HWO (the home side is awarded the win) or AWO (the away side is awarded the win) and no scores. These used to be ignored by everything worked out from match results. Checked against the league table on 06-Nov-2026: Salcombe v Plympton Victoria (HWO), Paignton II v Dartmouth (HWO), Plympton Victoria v Old Technicians (AWO, dated the day after, but the RFU already counts it).
- A walkover now counts as a played game with a win or a loss in: the form strip, the recent results list, home and away records, the fixtures list and its counts, the Match Stats form and home/away win counts, and the Opposition report (games played, recent results, recent form chips, the difficulty rating's "last 3" and venue record, the top-half and bottom-half record).
- It shows as "W/O" instead of a score (W/O WIN, W/O LOSS; the TV banner says "Won by walkover").
- It is left out of everything score-based, and no score is ever made up: points scored and conceded, averages, trend, close games, biggest win and defeat, the luck check, common opponents, head-to-head scores, and the "last result" on the Now and Next screen (which shows the latest played game with a score).
- The league table needs no change: it already comes from the RFU feed and counts walkovers.
- DEV ?debug=1 lists each unscored match with a "walkover" note saying which side was awarded the win.

v30p - Unscored matches debug (DEV only)
- DEV ?debug=1 now has an "unscored" section: results with no usable score (full raw records and their field names), duplicate results, past fixtures that never got a result, and "playedGap" (teams whose games played in the league table differ from the results we count). Purpose: find out what walkovers and conceded matches look like in the RFU data (seen on 06-Nov-2026: Women's league 1 such game, 1XV league 0, 2nd XV league 3), so they can be counted in form and win/loss records. No change to any live page.

v30o - League table from the RFU feed
- The league table (position, played, won, drawn, lost, points for and against, try and loss bonus points, points) now comes from the leagueTables section of the RFU data we already read for fixtures and results. It needs no extra request, so pages build faster, and it no longer depends on the englandrugby.com page (and its robot check).
- Order of use: 1) the RFU feed table, 2) the englandrugby.com table page (as before), 3) the table calculated from results (bonus points estimated). If the feed table is missing, has no table for the division, or has a row that cannot be read, the next one is used automatically.
- The page footer says where the table came from ("League table from the RFU feed" or "from englandrugby.com"); the calculated table keeps its "bonus points are estimated" wording.
- DEV only: add &debug=1 to a team link to see tableSource, any errors, and tableCompare, which compares the feed table with the englandrugby.com page table team by team (same, sameOrder, differences). Check this on DEV for a few leagues before deploying to PROD.

v30n - More RFU API probe checks (DEV only)
- Three new cards on /probe: what is inside "leagueTables" in the full-matches answer (does it hold the league table with bonus points?), the current season (seasons marked isCurrent), and last season's matches for the team and the opponent using the team ID only (to look for head-to-head history beyond this season).

v30m - RFU API probe (DEV only)
- New page on the DEV site only: /probe (behind the DEV PIN). PROD answers Not found. It opens with the team, season, competition and group filled in from the link (e.g. /probe?season=2026-2027&competition=1782&division=76176&team=124080&teamName=Ivybridge) and finds the next opponent's ID by itself; any box can be edited.
- "Run all" calls a fixed list of cluster.england-rfu.com endpoints taken from https://api.england-rfu.com/openapi.json (previous meetings, standings, team and league stats, team comparison, next match, search, teams, competitions, groups, players) and shows for each: the address called, status, time, size, the shape of the answer and the raw answer. Each card also has its own Run button.
- "Copy all results" copies a compact summary of every call, to paste back for review.
- It only calls the fixed list (not a general proxy), nothing is saved or cached, and nothing on the live pages uses it. Ideas it is checking: head-to-head history (previousMatch), league table without scraping (opta/standings), and extra team stats.

v30l - Build date fix
- The version label on the pages and the /version page showed 05-Nov-2026 for v30 to v30k, because the build date setting (BUILD_DATE) was not updated with the version. It now shows 06-Nov-2026. Release rule reminder: bump VERSION and BUILD_DATE together every time.

v30k - Rotate your phone message
- A phone turned sideways (short touch screen, 500px high or less) now shows "Rotate your phone" with a "Use sideways anyway" button. Tapping the button hides the message for the rest of that browser session. Turning the phone upright removes it.
- iPads, desktops and the TV screens never see it. It only appears inside the phone/iPad app (?app=1). The sideways layouts from v30i and v30j stay as the fallback for people who choose to stay sideways.

v30j - Match Stats on a phone turned sideways
- Match Stats used the fit-to-one-screen TV layout on a sideways iPhone (844px or wider), squeezing the bars into about 250px of height so they overlapped. Short screens now use the scrolling phone layout, with a compact sideways version: smaller crests and the stats in two columns.
- The "Tap for directions" link keeps working on a sideways phone (it was switched off at 900px wide and above).
- The Match Stats / Opposition toggle is slimmer on a sideways phone to leave more room.

v30i - Turned sideways, and the island / notch
- The green marker on the active tab (Home, Fixtures, Next game, Leaders) was misplaced when the device was turned sideways and could cover the words. It is now centred on the bottom bar, or sits as a bar down the left edge of the side rail on iPads.
- The side rail is now only used on iPad-sized screens. A phone turned sideways keeps a slim bottom bar so the page gets the height.
- The side rail and the page now keep clear of the Dynamic Island, camera and notch when turned sideways (safe-area spacing).

v30h - Faster team home page
- The team page used to wait for the "This game" difficulty, which re-reads the opponent's data and the weather, before showing anything. It now shows straight away and the "This game" block says "Checking..." then fills in a moment later (no weather lookup for that block). If it cannot load, the block quietly disappears.

v30g - Light mode form chips
- Opposition report, light mode: the W / D / L chips in "Recent form (oldest to latest)" and "Close games (oldest to latest)" were grey on the green, amber and red cards. They are white again, as in dark mode.

v30f - Lightbulb toggle and readable light mode
- The Light / Dark mode button is now a lightbulb icon on every page that has one (outline in dark mode, filled in light mode), with a tooltip and screen-reader label. In the phone and iPad app view the bulb sits beside the Links button at the top, so it is always visible (it was inside the team menu before).
- Light mode: the WIN / LOSS / DRAW labels in Latest results were pale and hard to read; they are now dark green, red and amber.

v30e - Next fixture panel order
- The phone Next fixture panel now reads: Next 5 opponents, then This game, then the opponent details (crests, venue). "This game" sits directly above the opponent it rates.

v30d - This game and the run-in, side by side
- The phone dashboard Next fixture panel now has two labelled blocks: "This game" (Easy / Medium / Hard for the next opponent, with a one-line reason such as "Kingsbridge: 11th, won 1 of last 3, at home: 0 wins from 1.") and "Next 5 opponents" (the run-in, with their average position). Under 3 games played, "This game" says "Too early to say".
- The rating is the same one shown on the Opposition report. It is only worked out for phone layouts, so TV screens are unchanged.

v30c - Clearer difficulty wording
- The bar on the phone dashboard is now headed "Run-in: your next 5 opponents" and underneath says, for example, "Medium run-in: these 5 opponents are on average 7th of 13 in the table. This is not a rating of the game above."
- The Opposition report card is now headed "Game Difficulty: this game only".

v30b - Native sharing
- On the Links sheet each row now has one Share button that opens the phone or iPad's own share menu (WhatsApp, Messages, Mail, Copy and so on). Where a device has no share menu (a desktop browser) the button is Copy. The separate WhatsApp button is gone.

v30a - Search goes straight to the team
- "Another club" then search: on phones and iPads, choosing a team now opens that team's home page directly. The links page (all the links for the team) is still shown on desktop, where it is useful for setting up TVs.
- The Share button beside the team name is now labelled "Links" so it is easy to find.

v30 - App navigation for phones and iPads
- Phones and iPads (touch devices up to iPad Pro size, and narrow windows) now open an "app" page: a team chip at the top, a Share button, and four tabs (Home, Fixtures, Next game, Leaders). The normal views load inside it, so you move between them without the browser Back button and without searching for the team again.
- Next game holds Match Stats and the Opposition report as a two-way toggle. On an iPad held sideways they show side by side. Match Stats, Opposition report and Home also use two columns on a wide iPad.
- The team chip opens "Choose a team" (the club teams, your recent teams, and "Another club" which goes to the search page). The team is remembered on the device: opening the bare address on a phone or iPad goes straight to the last team.
- The Share button replaces the old link buttons: This page, Match Stats, Opposition report, Fixtures, Leaders with WhatsApp and Copy, plus TV dashboard, TV fixtures and TV leaders links for clubhouse screens. Shared links are clean (no app parameters) and open in the right layout on any device.
- Light/Dark mode, Add to Home Screen and the version are inside the team chip sheet.
- Not changed: TV and desktop screens. Links with layout=tv or layout=wide, and wide non-touch screens, behave exactly as before. A link with layout=mobile opens the app page on any device. The links page now writes layout=tv on its "Standard / TV view" links.
- How it works: ?app=1 is the app page; each view loads inside it with ?embed=1.

v29g - Weather on Match Stats
- A weather card sits under the venue line on the Match Stats page, for home and away games: a factual headline, temperature, chance of rain and wind. Until about two weeks before the game it says "Weather not available yet". No kick-off time is implied. On wide screens the card is one slim line and the team crests are slightly smaller so the comparison bars keep their room. Uses the same free forecast and location lookup as the Opposition Report; a failed lookup simply shows no card.

v29f - Directions for elite sides
- Elite fixtures (feed flag "elite") now send Google Maps the official stadium name as the destination, for example the Premiership ground. Community fixtures are unchanged: "<club> Rugby Club" plus postcode if known.

v29e - Directions use the club name
- All Directions links (opposition report, WhatsApp message, Match Stats and Match Centre on phones) now go to "<club> Rugby Club" in Google Maps, for example "Ivybridge Rugby Club" for Ivybridge Women, Ivybridge II or Ivybridge 2nd XV. Team labels (Women, Ladies, Girls, Vandals, 1XV/2nd XV, and trailing I, II, III, IV, V, VI) are removed from the end of the name, up to three times. If the venue text contains a postcode it is added ("Tavistock Rugby Club PL19 9DR"). If there is no club name the venue text is used instead.
- The ground line shown on the report is still the venue text from the RFU, so it can be read against the map result. The separate "map search" fallback is no longer needed because every link now uses the club name.
- Limits: clubs whose Google Maps listing is not called "<name> Rugby Club" (for example Richmond FC, or a stadium used by an elite side) may still need a check. The destination is the club, which is where the game is played for community sides.

v29d - Phone links from Next fixture
- Phone layouts: the Next fixture panel on the team dashboard now has "Match Stats" and "Opposition Report" buttons for that team. The Match Centre next-game box has the same two buttons on narrow screens (800px and below). Neither appears on the TV layouts.

v29c - No directions link on TV screens
- Match Stats and Match Centre: the "Tap for directions" text and the venue link are hidden on wide screens (900px and up, which covers TVs and wall displays). Phones and small tablets still show the link. This follows the rule that map links never appear on TV screens.

v29b - Compact ground and directions
- Opposition report: the separate "Your ground / Their ground" card is gone. The ground name is now one line under the date, and the Directions button (or the map-search button when the address cannot be read) sits beside Share on WhatsApp.

v29a - Table headings and weather location
- League table column headings (#, Club, P, W, D, L, PF, PA, PD, TB, LB, Pts) are now bold, larger and bright on a filled band with a green underline, on the TV and phone dashboards, dark and light.
- Weather predictor and the TV banner forecast: the RFU venue text often has no postcode (for example "Hartley Park & Pavilion, Plymouth"). The location is now found from the postcode if there is one, otherwise from the town in the venue text, otherwise from the club name (Open-Meteo place search, Great Britain only). The forecast is for that town, so it is a close guide rather than the exact pitch. If no place is found the card is still left out.
- To see why a forecast is missing, open the opposition summary with &debug=weather, e.g. /?<team settings>&format=summary&detail=opposition&debug=weather. It lists the venue text and each lookup step.

v29 - Game preparation batch
- Opposition report: new Game Difficulty card at the top (Easy / Medium / Hard bar from the opponent's table position, their last 3 results and their record at the venue you play them at, with the three reasons and W/D/L chips, oldest to latest). It says "Too early to say" until the opponent has played 3 games. It is deliberately NOT shown on any TV screen, because the opposition could see it.
- Venue tag now reads "Away at Tavistock" or "Home at Ivybridge" (the club name is your team name without Women / 2nd XV / 1XV). The venue record card says whose ground it is.
- Ground strip with a blue Directions button (Google Maps), at home and away. If the address cannot be read it offers "Search for <club> RFC on the map" (a search, labelled as one). Match Stats and Match Centre venue lines are links too ("Tap for directions").
- Weather predictor card: forecast for the afternoon of the game from Open-Meteo (venue located from its postcode with postcodes.io; no keys). No kick-off time is shown. Factual headlines only (Dry with light wind, Some showers possible, Rain likely, Strong wind, Cold with a chance of frost, Mild for the time of year, Wet and windy). More than about two weeks ahead it says "Not available yet"; if the venue cannot be located the card is left out.
- Share on WhatsApp button on the report: a pre-written message (opponent, venue tag and date, Game Difficulty, scoring/conceding at the venue, last 3, close games, rest, forecast, directions or map search, report link). Lines with no data are left out. Nothing is sent automatically.
- Luck check card (opposition report for the opponent; phone dashboard for your own team): league table position against position by points difference per game, close-game W/L chips. Hidden until the club has played 5 games. Scores only.
- League position over time: two lines (your team and the opponent) from a Start point (all clubs level, alphabetical), weekly tables rebuilt from results (points, points difference, points scored, then name). Try bonuses are estimated, so earlier rounds are approximate; the latest position is exact. Line colours come from the crests (override with &colour= and &oppColour=); light mode darkens pale colours.
- Around you this weekend (opposition report and phone dashboard): clubs within 3 places of yours playing this Monday-Sunday, "A <club> win helps you", amber "Mixed" when two nearby clubs meet, and "Rest weekend" when your team has no game.
- Next fixture panel: the "Run-in" line is replaced by an Upcoming fixture difficulty bar (Easy / Medium / Hard from the opponents' average current position, next 5, at least 2 known)). Shown on phone layouts only, never on the TV screen, because a rating of named opponents should not be visible to visiting sides.
- League leaders wording (pane and phone panel): "Ivybridge Women: currently 6th, averaging 18.3 points scored per game" and similar; unit lines say "average points scored per game", "total points difference, all games" and so on.
- Fixtures TV board: a neutral banner above the list. "Next game" (opponent crest, name, position, Home/Away tag, This Saturday / Next Saturday wording, and a factual forecast for home games) or, after a result, "Last game" (score, W/D/L, margin) until the end of Sunday, then back to "Next game". No difficulty or form. Played rows are dimmed and unplayed rows say "To play". The banner is hidden when the next game is more than "Next Saturday" away.
- Test on DEV first: check the weather and Directions on a venue with a postcode, the position chart on a mid-season division, and the Fixtures TV banner.

v28g - Opposition report: common opponents for elite teams
- When the opponent plays in several competitions and your own team does too (elite sides such as Exeter), the common opponents card counts both teams' games across all competitions. For clubs in a single league it stays league-only. The footer says which applies.

v28f - Opposition report: all competitions
- For clubs that play in several competitions (e.g. Exeter: Prem, PREM Rugby Cup, Champions Cup) the opposition form cards (home/away, last 3 v season, close and heavy games, last results, rest and workload, their next game after yours) now count the opponent's games in every competition, found through the builder lookup. Each last result shows its competition, and the footer lists the competitions and game counts. Common opponents, top/bottom half and bonus points stay league-only, because positions and common opponents are only meaningful within one table. Competitions that cannot be read are skipped.

v28e - Link builder: competitions missing from the RFU API
- The RFU API lists only some of a team's competitions (Exeter Chiefs: Gallagher Prem and Champions Cup but not PREM Rugby Cup, which the website shows). The builder now also reads the RFU team page and adds any competition and division it links to (e.g. "PREM Rugby Cup Pool A"), so they appear in the League box. The "fromPage" field of /api/builder/team shows which ones came from the page.

v28d - Link builder diagnostics
- Some teams (e.g. Exeter Chiefs) appear in more competitions on englandrugby.com than the builder offered. The builder now lists any competition the RFU returns for the team but that gave no divisions or failed, in the message under the League box, instead of dropping it silently. Adding &debug=1 to /api/builder/team?team=<id> shows the raw competition list and what each returned, so the cause can be pinned down.

v28c - Opposition crest and W/D/L headers
- The opponent's crest (initials until it loads, or if the club has none) sits beside the report heading.
- The "stronger and weaker sides" card now has W / D / L as column headers with the numbers beneath, instead of a "1 · 0 · 0" string.

v28b - Opposition trend wording
- The trend card now says in words, separately for scoring and conceding, whether the opponent's last 3 games are MORE, LESS or about the same (within 2 points) than their season average, with the difference in points per game and the season average underneath.

v28a - Opposition report wording
- Every card and statement now names whose figure it is (the opponent's, or your team's), e.g. "Kingsbridge in their last 3 games, compared with their own season average: scoring about the same, conceding less". Rows say "Their ..." / "They ...", results are marked as the opponent's point of view, and the common-opponents columns are headed with both club names.

v28 - Opposition report
- New page for coaches: /?view=opposition (phone, stacked cards) and &layout=wide (wide-screen grid). No TV layout and no auto-refresh. Open by address like the other screens. Links added to the links page, the link builder and the share text as "Opposition Report (Mobile)" and "Opposition Report (Wide Screen)". No button on Match Stats.
- The opponent is the team's next fixture, counted from today (London date) onward, so it moves to the following opponent the day after a game. Home/away of that fixture decides whether the "At home" card shows their home or away record. No fixtures gives "No upcoming fixture found".
- Cards: at home/away, recent trend (last 3 v season), close and heavy games, last three results, common opponents, rest and workload, v top/bottom half, bonus points. Cards with no data are left out.
- Worked out from scores and the table only (no tries, penalties, set piece, cards, players). Small samples early in the season are flagged.
- Not built: &opponent=<club id> override and a builder dropdown.

v27c - Leaders trophy
- The League Leaders page (Mobile and TV) shows a trophy icon in the corner instead of the club crest, so nothing on the heading points at one club. The club still appears on each card as the rank line.

v27b - Leaders heading
- The League Leaders heading now shows the league name under "League Leaders" (same size the club name had) instead of the club name, since the club may not be a leader. The club still appears on each card as the "you" line with its rank.

v27a - Leaders: names when clubs are level
- On League Leaders (the view and the phone card), when several clubs share a top figure the card still says "4 clubs level" and now lists their names underneath (up to 8, then "+N more").

v27 - League context
- League points tile: shows the gap to the clubs either side, e.g. "6 behind 5th - 4 ahead of 7th" (red for the club above, green for the one below, "level with" when tied; at the top it reads "Top of the table - N clear of 2nd").
- Next fixture panel: a run-in line, "Run-in: next 5 opponents average 8th", from the opponents' current league positions (shown when at least 2 known opponents remain).
- Season snapshot: a highlights row with Current run (Won 3 / Lost 1 / Drew 1), Bonus points, Biggest win and Worst defeat.
- Phone layout: new "In the mix" panel (two clubs above and below with the points gap) under the stats, and a "League leaders" card near the bottom. Both are hidden on TV/tablet layouts, where the full table is already on screen.
- New League Leaders view: /?view=leaders plus the usual team settings (season, competition, division, team, teamName, friendlyName, theme); add &layout=tv for the full-screen board. Four cards - best attack and best defence (per game played), best points difference, most bonus points - each with the leader and this team's rank ("joint" when tied). It uses this team's own division. A note appears while any club has played fewer than 3 games.
- Links page and link builder: "League Leaders (Mobile)" and "League Leaders (TV View)" for every team; the share text includes the Leaders link.
- Match Centre: each team card shows the same gap line under the position / points / played tags.
- Everything is worked out from the live league table and the match results already fetched; nothing new is requested from the RFU.

v26b - Browser tab icon
- Every page now has the club icon in the browser tab and bookmarks (it was only used for the phone home-screen app before). The links page, PIN pages and release notes show it too.
- The icon files are open on DEV even before the PIN is entered; they contain nothing private.

v26a - Performance and resilience
- RFU data is still refreshed hourly, but the last good copy is now kept for up to 7 days. If the RFU site is slow, down, or shows its robot check, the screens carry on with that copy instead of an error; the "Updated" time shows when the data was really fetched.
- Requests to the RFU site time out after 8 seconds so one slow call cannot hold a screen up.
- PROD only: finished team dashboards, Match Centre, Match Stats and Fixtures pages are cached at the edge for 2 minutes, so several screens and phones opening at once share one build. DEV is never page-cached, so changes show straight away. Error pages are never cached, and a new release clears the cached pages automatically.
- Links page, link builder, welcome screen, calendar, PIN pages and release notes are not page-cached.

v26 - Auto-fit for TVs and tablets
- Standard team dashboard (TV layout): the page now measures its own content. If everything would not fit the screen (for example a long league table on an iPad), the whole page is scaled down just enough that every team and panel is visible; if there is spare height, the league table and the lower panels share it so the page fills the screen exactly. It will not scale below 50%.
- Match Centre and Fixtures TV: if a team name would be cut short (common on 4:3 screens such as iPads) the text is reduced a step at a time until it fits.
- Re-checks on rotation, resize and when crests finish loading. Phone layouts are unchanged.
- Known limit: the standard dashboard is designed for landscape screens. An iPad held upright (portrait) now fits the screen but the stat boxes and results list are tight; use landscape for a wall display.

v25c - Match Centre day names
- The badge on the Next game panel no longer counts days. It reads "Today", "Tomorrow", "This Saturday" (later in the current Monday-Sunday week), "Next Saturday" (the following week) or "Result due" (date passed, no result yet). Games further away show no badge; the big weekday and date are still there.

v25b - Match Centre countdown
- The weekday/date and the countdown now both use London time (the date used the server clock before, which could differ by a day around the clock change).
- A game whose date has passed but has no result yet now shows "Result due" instead of "Today". "Today" is only used on game day itself.
- Counting is by calendar day, so Tuesday to Saturday is "In 4 days" and the evening before is "Tomorrow". The page refreshes hourly, so the badge can be up to an hour behind right after midnight.

v25a - Match Centre
- The "Now and Next" screen is now called "Match Centre": the screen heading reads "Ivybridge RFC - Match Centre" and the links page card is renamed. Nothing else changes; existing links keep working.

v25 - Bolder Now and Next
- The Next game panel is now double width. It shows the weekday very large (SAT), the date and any kick-off time beneath it, and a countdown badge in the team's colour ("In 4 days", "Tomorrow", "Today"). The two teams are stacked beside it with larger crests and names, the Home/Away tag is top right of the panel, and the venue (when known) sits underneath.
- "Last game" is now "Last result", shown as a smaller panel with the date, the two teams and bigger scores; the winner stays highlighted.
- The team column is narrower, and the crests are larger. The phone layout keeps its stacked cards, with the new wording and a compact version of the Next game panel.

v24d - Links use the public domain
- Links created or shown by the site (the welcome screen and link builder, the links page, Home buttons) now always use https://thestatsboard.co.uk on PROD and https://dev.thestatsboard.co.uk on DEV, even when you opened the site on its irfu-tables.pages.dev or irfu-dev.pages.dev address. On the public domains nothing changes.
- The web addresses are the SITES list near the top of _worker.js, so a different domain only needs changing there.

v24c - Calendar events are all-day
- Every fixture added to the calendar is now an all-day event on the day of the game, whether or not the feed has a kick-off time. The time is not used. The venue is still included when the feed has one.

v24b - No duplicate fixtures
- The Fixtures pages and the calendar file now keep one entry per opponent per day. If the RFU feed lists the same fixture twice (for example once with a kick-off time and once without), only one appears, preferring the one with a time. Fixes fixtures being added to the calendar twice.
- If you still see doubles after this, check whether the event was added twice from your phone (each tap of "Add to calendar" imports again; the games have fixed IDs so most calendars replace rather than duplicate, but some do not).

v24a - Subscribe button removed
The "Subscribe" button on the phone Fixtures and Results page is gone; "Add to calendar" is the only calendar button. (The /calendar.ics file itself is unchanged.)

v24 - Head-to-head, Add to Home Screen, Add to calendar
HEAD-TO-HEAD
- Match Stats shows an "Earlier this season" line under the stat bars listing each earlier game between the two teams (date and score, home team first, winner in bold). Nothing is shown if they have not met yet. It uses the RFU results for this competition, so only this season's games appear.
ADD TO HOME SCREEN
- Every page now carries a web app manifest and icon (new Stats Board icon), so "Add to Home Screen" installs the page you were on: add the Mobile view and it opens the Mobile view; add Match Stats and it opens that. It opens full-screen with the Stats Board icon (the team's crest is not used for the icon).
- On phones, team pages show a button in the top bar: "Install app" on Android (Chrome) and "Add to Home Screen" on iPhone (it shows how: Share, then Add to Home Screen). The button disappears once the app is installed.
- Not included: working without a signal. The links page and PIN pages are not installable on purpose.
ADD TO CALENDAR
- The phone Fixtures and Results page has an "Add to calendar" button that downloads an .ics file of the team's upcoming games (/calendar.ics plus the team settings). (From v24c every game is an all-day event.) The venue is included when the feed has one.
- (A "Subscribe" button was added here and removed again in v24a.)
- The calendar needs no PIN. It is not on the TV board.

v23c - One crest rule on every screen
- Every screen now follows the same rule: show the club's crest when the RFU has one, otherwise a white circle (or rounded square on the dashboard) with the club's initials. The RFU default logo is no longer used anywhere (dashboard header, next fixture, league table).
- Initials are tidier and at most two letters. Words like FC, RFC, AFC, The, Rugby, Club and squad labels (1XV, 2nd XV) are skipped, then the first letter of the first and last remaining word is used: Richmond FC Women = RW, Exeter Saracens Women = EW, Ivybridge Women = IW. A one-word name uses its first two letters: Ivybridge RFC = IV, Cullompton = CU.
- Applies to the team dashboards (Standard and Mobile), Now and Next, Match Stats, Fixtures pages, and the welcome screen and link builder.

v23b - Team name back on the fixtures pages
- The team name is back top left on both fixtures pages, under the "2026-2027 Season Fixtures" heading and beside the crest. The smaller text on the right (TV board) and under the header (phone page) now shows only the league and the played/won/drawn/lost record.

v23a - Fixtures buttons and header
- The two fixtures buttons on the links page, link builder and welcome screen are now "Fixtures and Results (Mobile)" and "Fixtures and Results (TV View)". On the links page and welcome screen the Mobile one shows on phones and the TV View one on TVs and computers (use "Show all links" to see both).
- On both fixtures pages the team's crest is top left and the heading is the season, e.g. "2026-2027 Season Fixtures". The team name moves to the smaller text on the right (TV board) or under the heading (phone page), and the words "Season fixtures" / "Fixtures and results" are no longer repeated there.

v23 - Fixtures TV view
- New TV board: add &layout=tv to a Fixtures link (/?view=fixtures&layout=tv plus the usual team settings). It shows the whole season in date order, split across two full-screen columns with no scrolling (first half of the season on the left, second half on the right). Each row has the date, the opponent's crest and name, Home or Away, and the score with a W/D/L marker once the game has been played. Games not yet played show no score; the next game has a green outline. A game past its date with no result shows "Awaited". The row size adjusts to the number of games, and the page reloads itself every hour.
- Kick-off times are removed from both the TV board and the phone Fixtures page, so they match the other pages.
- "Fixtures TV view" is a new button on the links page (TV devices only), the link builder and the welcome screen.
- Fix: on the welcome screen, switching between light and dark mode would have pointed the "Fixtures and results" button at the wrong page (introduced in v22y). It now keeps the right link.

v22z - Fixtures page button label
The "Match Stats" button at the top of the Fixtures and results page is now "Next Match Stats", as it opens the next game's stats.

v22y - Fixtures and results page
- New page for each team: /?view=fixtures plus the same team settings as the dashboard (season, competition, division, team, teamName, friendlyName, theme). It lists the whole season: Upcoming (soonest first, the next game highlighted) and Results (most recent first, with score, W/D/L marker, Home or Away and the opponent's crest). The top shows the team's played, won, drawn and lost.
- A fixture whose date has passed but has no result yet shows "Result awaited". Kick-off times show only when the feed has one.
- Fixtures and results is a new button on the links page and the link builder (welcome screen and /builder), and is included in the "email/WhatsApp" share text. Like the other screens it needs no PIN.
- Limit: the page shows what the RFU feed returns for the team's competition this season. Earlier seasons are not included.
- The "Menu" button on the public pages (Match Stats, Now and Next, phone dashboard, link builder) is now "Home" and goes to the welcome screen. It used to go to the links page, which now asks for the club PIN. Use "Club access" on the welcome screen for the links page.

v22x - DEV PIN remembered for 30 minutes
- After a correct DEV PIN the device is remembered for 30 minutes (it was 30 days), then asks for the PIN again. The 30 minutes count from when the PIN was entered, not from the last page view.
- Only the DEV PIN changes. The club PIN on the links page still remembers a device for 30 days.

v22w - Custom domains
- The "Switch to DEV" / "Switch to PROD" buttons now go to https://thestatsboard.co.uk (PROD) and https://dev.thestatsboard.co.uk (DEV). The old irfu-tables.pages.dev and irfu-dev.pages.dev addresses keep working.
- SET UP (Cloudflare): in each Pages project > Custom domains > Set up a custom domain: thestatsboard.co.uk on the PROD project, dev.thestatsboard.co.uk on the DEV project. Wait for Active.
- PINs and cookies are per address, so each device enters the PIN once more on the new domains.

v22v - Club PIN for the dashboard links page
- The dashboard links page (/?view=teams or /teams) now asks for a PIN. A "Club access" link at the bottom of the welcome screen takes you there, and a correct PIN opens the page and remembers the device for 30 days.
- Every screen stays open to anyone with its address: team tables, Now and Next, Match Stats, the link builder and the welcome screen. TVs and phones need no PIN.
- SET UP (once, on PROD): Cloudflare Pages > the PROD project > Settings > Variables and Secrets > add a Secret called CLUB_PIN with the PIN you want, then redeploy. Until it is set, PROD keeps the links page locked and says so.
- DEV: already behind DEV_PIN, so the links page only asks for the club PIN if you also add CLUB_PIN to the DEV project (add it to test the PIN there).
- Changing CLUB_PIN signs every device out again. Wrong guesses are delayed by about a second. The PIN cookie (rfuClub) is separate from the DEV one.
- The link builder's "Menu" button is now "Home" and goes to the welcome screen, so visitors are not sent to the PIN page.

v22u - Now and Next headings
The "Last game" and "Next game" headings and their dates are now the same (larger) size, joined by a hyphen, e.g. "Last game - Sat 25 Oct". Only the Now and Next screen changes.

v22t - Release notes page on the DEV site
- The DEV site has a Release notes page at /release-notes (also reachable from the "Release notes" link after the version in the footer of the welcome, links and link builder pages). It shows this file. It exists only on DEV (behind the PIN); on PROD the address returns "Not found" and there is no link.
- The page shows a copy of this file that is built into _worker.js. The copy is refreshed whenever a new zip is made (see the CHANGE CONTROL notes at the top of _worker.js).

v22s - No venue wording when there is no venue
- When a venue cannot be read, nothing is shown: the "Venue details to be confirmed" line is gone from Match Stats, Now and Next and the Standard/Mobile dashboards, and the layout closes up. Venues are still shown whenever they can be read.
- Background (Topsham v Weston-super-Mare, match 1279084): the browser capture shows the venue ("Bonfire Field Exeter Road Topsham Exeter") is only in the HTML of the RFU match-centre page, with no separate data call, and that page returns a robot check to the worker. The page sends no CORS headers, so a script on another site cannot read it either. The worker still reads it whenever the RFU lets a request through (retried every 5 minutes, see v22r).
- Older notes below that mention "Venue details to be confirmed" describe earlier versions.

v22r - RFU robot-check pages are not cached
- Finding (Topsham v Weston-super-Mare, match 1279084): the RFU match-centre page sometimes returns a "verify that you are not a robot" challenge page to the worker instead of the real page, so no venue can be read. The feed itself had no venue for that game.
- The worker does not try to get past the challenge. It now recognises that page, never saves it as data (it used to be saved for an hour as if it were the real page), and retries after 5 minutes. The same protection applies to the league table page (the calculated table is used meanwhile).
- Dev only: the venue trace shows blockedByRfuChallenge: true for that case.
- Limit: if the RFU keeps challenging the worker, the venue stays "to be confirmed" for those games. Nothing in the dashboard can read it.

v22q - Venue trace shows small match-centre pages
- Dev only: when the match-centre page has no Location/Venue/Ground label, or is under 20 KB, &debug=venue now includes "head": the start of the page text (scripts and styles removed). Found because Topsham v Weston-super-Mare (match 1279084) returned only 2,566 bytes with no label.

v22p - More venue sources and a better venue trace
- Venue is now also read from feed fields named venueName, stadiumName, groundName, locationName, matchVenue and similar (previously only a few exact names such as venue, location and ground were recognised).
- The match-centre page lookup has a fallback: any "Location", "Venue" or "Ground" label followed by text is accepted, and a value of TBC is ignored.
- Dev only: &debug=venue on a plain team URL now also lists every venue-like field in the feed for the next game, and for the match-centre page shows the address used, its size, whether a Location/Venue/Ground label exists and the text around it.

v22o - Welcome call to action
- "To get started, search for an English rugby team." (was "club"), to match what the search finds.

v22n - Welcome screen wording
- Welcome text replaced with the new wording (description, free-of-charge and no-warranty paragraph, "To get started, search for an English rugby club."). The page description used by search engines and link previews matches.
- The search box placeholder is now "Try Exeter Chiefs" because the longer text was cut off on phones. "Search by club or team name." under the box is unchanged.

v22m - Recent teams on the welcome screen
- The welcome screen remembers the last 3 teams chosen (saved when a league is picked) and lists them under the search box with crest, name, league and season. Clicking one goes straight to its links.
- Choosing a team again moves it to the top without duplicating it. Each entry has an x to remove it and there is a Clear link.
- Stored only in that browser's local storage (key statsBoardRecent): team, league and season IDs and names, nothing personal, never sent to the server. It is per device and per site (DEV and PROD keep separate lists), and is lost if site data is cleared or in a private window. If storage is blocked the welcome screen works as before without the list.
- Saved entries keep the season they were chosen in, so when a new season starts, pick the team again to get the new season.

v22l - Form ring on the dashboards
- The Standard/TV and Mobile team dashboards now ring the most recent result in "Recent form - last five" with the same outline Match Stats uses (white in dark mode, dark in light mode). Nothing else on those pages changed.

v22k - DEV frame removed
- The amber border around every page on the DEV site is gone because it covered on-screen elements. The amber environment badge (bottom-right), the [DEV] tab title prefix and the PIN gate are unchanged.

v22j - UK dates and version on every page
- Build dates use UK DD-MMM-YYYY (03-Nov-2026) in the code header, /version, the page footers and these notes.
- Every generated page now shows "The Stats Board v22j - 03-Nov-2026". Pages that fit the screen (TV views, Match Stats, Now and Next, standard dashboard) get a small stamp centred along the bottom edge; pages that scroll (phone layouts) show it as a footer at the end. The PIN screen shows it too.

v22i - Change control and team crests
- Change control: version header and changelog in _worker.js, /version endpoint, version footer on the welcome, links and link builder pages, X-Stats-Board-Version header, release table above.
- Link builder (both the welcome screen and /builder): selecting a team now shows its crest and club name next to the team name, so you can confirm it is the right team. If the RFU has no crest for the team, its initials are shown instead. The crest also appears in the summary line once a league is chosen on the welcome screen.

---- Earlier notes ----
RFU Club Dashboard - match-centre venue fix

Deploy _worker.js and index.html to your existing Cloudflare Pages Advanced Mode project.

Venue behaviour:
- Uses venue/location fields already present in the fixtures JSON when available.
- If the fixture JSON has no venue, fetches the RFU match-centre page for that fixture ID.
- Extracts the Location value from the official match details section (the same HTML field confirmed in the supplied browser HAR capture).
- Falls back to “Venue details to be confirmed” only if neither source provides a location.

All existing dashboard features are retained, including club crests and RFU fallback logo, full league table priority, supporting statistics, and hourly refresh/cache.

Latest display adjustment (v5): league table club names increased from 13px to 15px for improved readability while retaining the existing table layout.

v8: points fix - bonus points now calculated consistently for both teams (losing bonus + 4-try bonus where tries supplied); 0-0 placeholder results no longer counted in table. Add ?debug=1 to the URL for a JSON diagnostic.
v9: ?debug=1 now also lists any bonus/tries/points-style fields found in the RFU feed and dumps two raw match objects, to locate where RFU supplies bonus data.
v10: league table now read from the official englandrugby.com table (TB, LB and Pts columns) because the results feed has no bonus-point data. If that page cannot be fetched or parsed, the calculated table is used as a fallback. ?debug=1 shows which source was used (tableSource / rfuTableError).
v11: league table shows Try Bonus (TB) and Lost Bonus (LB) columns instead of a single BP column.
v12: fixed double-encoded HTML entities (e.g. "&amp;amp;") in venue and club names so "Penzance & Newlyn" displays correctly.
v13: optional phone layout. Add &layout=mobile (always phone layout) or &layout=auto (phone layout below 700px wide) to the URL. Default (no layout parameter, or layout=tv) is unchanged. Phone layouts: scrolling single column, trimmed league table (PF/PA/PD hidden), safe-area padding for iPhone, Add-to-Home-Screen tags, and a refresh that only fires when the page is visible and at the top.
v14: in phone layouts (layout=mobile or layout=auto) tapping a club name in the league table opens the dashboard for that club. friendlyName is dropped for the other club; the TV layout is unchanged.
v15: links page listing Standard/TV and Mobile links (with copy buttons) for each team. Open /?view=teams (or /teams). Edit the TEAMS list at the top of _worker.js to add or change teams.
v16: new stacked all-teams screen view: add ?view=stack to the URL (optional &theme=light, &season=, &clubName=). Shows 1XV, 2nd XV and Women on one 16:9 page with last game and next game for each. Each team loads independently so one failing team does not blank the page. Also fixed opponent crest initials on the single-team page. Links page has a new "All teams, stacked" card.
v17: stacked view heading is now "Ivybridge RFC - Now and Next" (override with &clubName=); "P" now reads "Played"; Won/Lost/Draw tags removed from the last-game panel; Last game and Next game headings larger and bold; Ivybridge 2nd XV is now Ivybridge 2XV everywhere (including old links that still say 2nd XV, and our own side in fixtures/results); links page reorganised into sections (Club screens, Team dashboards) driven by a SECTIONS list in _worker.js, with the stacked view added.
v18: stacked view heading is now "Ivybridge RFC - Now and Next" (override with &clubName=). Links page card renamed "Now and Next".
v19: Last game and Next game panels now share the same layout (heading, date/time and Home/Away tag on one line, then the two teams, with the venue under Next game). Phone layout of the stacked view reworked: each team is one card with a sticky team header, panels separated by dividers, a sticky jump bar (1XV / 2XV / Women) at the top, and a refresh that only reloads when the page is at the top.
v20: removed the sticky team headers in the phone layout of the stacked view (they made the next card slide under the previous one while scrolling). The jump bar at the top stays pinned.
v21:
- Refresh is now hourly. RFU data (results feed, league table, match-centre pages, link builder lookups) is cached for one hour, using the Cloudflare Cache API plus an in-memory copy. Pages reload hourly (phones still only reload when visible and scrolled to the top).
- The "Updated" time now shows when the RFU data was last pulled, so it no longer changes on every page load. It only moves when the hourly cache expires. Single-team pages now show it too.
- The 2nd XV is now "The Vandals" everywhere (jump bar label "Vandals"). Old links saying "Ivybridge 2nd XV" or "Ivybridge 2XV" still work and display as The Vandals.
- Phone layouts (mobile team pages, Now and Next on a phone, link builder) have a "Menu" button back to the links page and a Light mode / Dark mode toggle. The choice is saved in the browser and applies to every page on that phone. TV layouts ignore the saved choice and keep using &theme=.
- Now and Next on a phone: each team card has a "Table & Stats" button that opens that team's mobile dashboard. Not shown on the TV layout.
- Links page: one Now and Next link. Every link on the page follows the Light/Dark toggle at the top, so copied links carry the selected theme. Plus a link to the new link builder.
- Link builder: /?view=builder (or /builder). Search any team on englandrugby.com, pick season and league, set the display name and theme, and copy Standard/TV, Mobile and Auto links.
- Builder API routes: /api/builder/search?name= and /api/builder/team?team=&season= (proxy englandrugby.com's own fixtures-and-results search API).
Note: Cloudflare's Cache API is most dependable on a custom domain. If the Updated time still moves on every load on a *.pages.dev address, the in-memory cache is the only layer working there.
v21b: link builder has a "Share links" button. On phones it opens the native share sheet (email, WhatsApp, Messages, Teams, etc.) with the TV, Mobile and Auto links, each with a one-line explanation of when to use it; on desktop it shows Email, WhatsApp and Copy all instead.
v21d: optional environment banner. In a test Pages project, add a variable ENV_LABEL (e.g. TEST) under Settings > Variables and Secrets, then redeploy. Every page then shows an amber frame, a "TEST environment" badge bottom-right, and "[TEST]" in the tab title, and is marked noindex. The banner floats over the page so no layout moves. Production has no ENV_LABEL, so the same zip shows nothing extra there.
v21e:
- PROD/DEV switch at the bottom of the links page ("You are on PROD - Switch to DEV" and vice versa), opening the same page on the other site. Addresses are set in SITES at the top of _worker.js. A site is DEV when its project has ENV_LABEL.
- Link builder button now uses /builder and all buttons/links use touch-action: manipulation, to stop missed or delayed first taps on phones.
v21g: Now and Next rows are colour-coded per team (1XV green, The Vandals gold, Women purple): coloured bar and tinted team panel on the TV layout, coloured top band on phone cards, matching jump-bar buttons. Change colours via "accent" in TEAMS; other teams get colours from a built-in palette.
v21h (preview): four row styles for Now and Next, selectable with &rows=a|b|c|d (a solid team panel, b title bar per row, c framed row, d coloured side tab). Without &rows the current style is used. Theme scripts now only swap the light/dark class.
v21i: framed rows (option C) are now the default on Now and Next. Women's colour changed to dark red (#a3202f, later lightened to #c0303f) to match their kit. Other styles still available via &rows=a|b|d.
v21k: Now and Next default row style switched to the coloured side tab (option D): a solid tab with the team's short name (1XV / Vandals / Women) on the TV layout, a coloured header strip on phone cards. Women's colour #c0303f. Other styles via &rows=a|b|c.

Fix: "Home record" and "Away record" headings are centred over their win/draw/loss figures (stronger rule, applies in the standard and mobile layouts).

v22: new Match Stats view. Add view=match to a team link (same season, competition, division, team, teamName and friendlyName settings as the dashboard), e.g. /?view=match&season=2026-2027&competition=1782&division=76176&team=124080&teamName=Ivybridge&friendlyName=Ivybridge%20Women&theme=dark
- Shows the selected team's next match (opponent, date, time, venue) with large crests and names, the home team always on the left, and seven mirrored bars: league position, points, wins, points scored, points conceded (fewer is better), home wins and away wins.
- Bars never fill the track (the leader is capped at 88%), the weaker side is faded, and a tally shows how many stats each side leads.
- Bar and crest-ring colours are taken from each club crest (crests are served through /api/crest so the page can read their colours). If both clubs come out similar, the opponent switches to a contrasting colour. Override with &colour=hex (selected team) and &oppColour=hex (opponent), e.g. &colour=1b7f3b.
- Light and dark via &theme=. On phones the crests sit above the date and each stat label sits above its pair of bars; the Menu button and saved Light/Dark toggle are shown. Reloads hourly.
- "Match Stats (next match)" links added to the links page for each team and to the link builder.

v22b: Match Stats refinements.
- The "Match Stats" heading is gone from the page (the browser tab is still titled Match Stats). NEXT MATCH, the date/time and the venue are now the large page header.
- Removed the "fewer is better" note and the stats-led tally at the bottom.
- Position and points under each crest removed. "Games played" is now the first bar (neutral: neither side is faded).
- HOME and AWAY are larger, bolder and filled with each team's colour.
- Recent form now reads oldest to latest, left to right, for BOTH teams, with the latest game ringed and labelled "latest", so it no longer looks reversed on the away side.

v22c: Match Stats fixes.
- Form: the away side's form is now right-justified (its class name clashed with the bar rows). "oldest" sits under the first result box and "recent" under the latest one (which is ringed), for both teams. The heading is now just "Form".
- Bars are now scaled against the best in the division (most points, wins, points scored and so on; fewest points conceded), so the leader's bar length changes from row to row instead of always being the same. League position is still scaled by rank. Add &scale=duel to the Match Stats link to go back to scaling the two teams against each other only. Bars still never fill the track (maximum 88%).

v22d: the ?debug=1 diagnostic (JSON view of the RFU feed and table calculations, mentioned in the v8-v10 notes above) now only works on the development site, i.e. a Pages project that has the ENV_LABEL variable set. On production, ?debug=1 is ignored and the normal page is shown.

v22e: Match Stats header now reads "NEXT GAME DAY"; the HOME and AWAY tags under each crest are smaller.

v22f - Venue for elite (Premiership) fixtures
- The RFU feed carries elite venues in a "stadium" field on the fixture. The worker now reads it first, then the other fields, then the community match page.
- Dev only: add &debug=venue to a plain team URL for a JSON trace of the venue lookup.
(An Opta feed lookup was tried and removed: Opta refuses requests from the worker with 403.)

v22g
- Match Stats: Recent Match Form is now newest -> oldest, left to right, for both teams (latest game keeps its white ring and "recent" caption; "oldest" removed). Heading is "Recent Match Form".
- Dashboard links page: shows only the links that suit the device (Standard / TV view on desktop and TV, Mobile view on phones). A "Show all links" link at the top reveals everything. Force with &device=mobile, &device=desktop or &device=all.
- Copy link buttons removed (links page and link builder rows). The builder keeps Share links; "Copy all" appears only as the fallback where the browser has no share sheet. The builder is not device-filtered on purpose, as it is used to make links for other devices.
- DEV PIN: the dev site (the project with ENV_LABEL) now asks for a PIN before showing anything. Set a variable DEV_PIN (as a Secret) on the DEV Pages project and redeploy. A correct PIN sets a 30-day cookie; changing DEV_PIN locks everyone out again. If DEV_PIN is not set, the dev site shows a "locked" message instead of its pages. Production is unaffected. Remove OPTA_USER/OPTA_PSW if you added them.

v22h - The Stats Board welcome screen
- Opening the site with no team, view or competition in the link (the bare address) now shows "The Stats Board" welcome screen instead of the default 1XV dashboard. Every link that carries parameters works exactly as before, including /teams and /builder.
- Search for any English rugby union team; results unfold underneath the search box. Choosing a team shows its leagues in place (a team with one league goes straight through, and a season picker appears when there is more than one season). The results then fold away, leaving a summary line with "Change team" and the links: Standard / TV view on desktop and TV, Mobile view on phones (Show all links reveals both), Match Stats, and Share links. Links follow the light/dark toggle.
- Uses the existing /api/builder/search and /api/builder/team endpoints, so no new variables are needed.
`;
// <RELEASE_NOTES_END>
// v33: Link variables documentation page (/docs). One structured list below is the only place the variables are described.
// To document a new variable, add an entry to the right section. Examples are relative links, so they open on whichever site you are on.
const DOCS_TEAM = "competition=1699&division=75791&team=11039&teamName=Ivybridge&friendlyName=Ivybridge%201XV";
const DOCS = [
  { id: "team", title: "Team settings", intro: "These six identify the team. Every page needs them (the Links page builds them for you). The examples on this page use Ivybridge 1XV.", items: [
    { v: "team", values: "RFU team id, e.g. 11039", where: "All pages", what: "Which team the page is about. Also where the team crest comes from.", ex: [["Table", "?" + DOCS_TEAM]] },
    { v: "competition", values: "RFU id, e.g. 1699", where: "All pages", what: "The league (competition) the team plays in.", ex: [["Table", "?" + DOCS_TEAM]] },
    { v: "division", values: "RFU id, e.g. 75791", where: "All pages", what: "The division within that competition.", ex: [["Table", "?" + DOCS_TEAM]] },
    { v: "teamName", values: "text, e.g. Ivybridge", where: "All pages", what: "The team's name as the RFU spells it. Used to find the team's games in the feed.", ex: [["Table", "?" + DOCS_TEAM]] },
    { v: "friendlyName", values: "text, e.g. Ivybridge 1XV", where: "All pages", what: "The name shown on screen, which can differ from teamName.", ex: [["Table", "?" + DOCS_TEAM]] },
    { v: "season", values: "2026-2027", where: "All pages", what: "Pins the link to one season. Leave it out and the link follows the RFU season dates automatically, including the summer gap notice.", ex: [["Pinned to 2025-2026", "?season=2025-2026&" + DOCS_TEAM], ["Following the season", "?" + DOCS_TEAM]] }
  ] },
  { id: "view", title: "Choosing the page", intro: "view picks which page you get. With no view you get the team's league table page.", items: [
    { v: "view", values: "match · fixtures · opposition · leaders · stack · teams", where: "All pages", what: "Match = Match Stats. fixtures = Fixtures and Results (phone) or the season board (with layout=tv). opposition = the opposition report. leaders = League leaders. stack = all club teams on one screen. teams = the Links page (club PIN).", ex: [["Match Stats", "?view=match&" + DOCS_TEAM], ["Fixtures", "?view=fixtures&" + DOCS_TEAM], ["Opposition", "?view=opposition&" + DOCS_TEAM], ["Leaders", "?view=leaders&" + DOCS_TEAM], ["Stack", "?view=stack"], ["Links page", "?view=teams"]] }
  ] },
  { id: "screen", title: "Screen and look", intro: "How a page is laid out for the device it is on.", items: [
    { v: "layout", values: "tv · wide · mobile · auto", where: "Table, Match Stats, Fixtures", what: "tv is the large-screen board (fixed to the screen, no scrolling). mobile forces the phone layout. wide is a wide desktop layout. auto chooses by screen size.", ex: [["Match Stats on TV", "?view=match&layout=tv&" + DOCS_TEAM], ["Fixtures on TV", "?view=fixtures&layout=tv&" + DOCS_TEAM], ["Fixtures on phone", "?view=fixtures&layout=mobile&" + DOCS_TEAM]] },
    { v: "theme", values: "dark (default) · light", where: "All pages", what: "Dark or light colours.", ex: [["Light Fixtures TV", "?view=fixtures&layout=tv&theme=light&" + DOCS_TEAM]] },
    { v: "embed", values: "1", where: "All pages", what: "Hides the page chrome so a page can sit inside another page or a signage player.", ex: [["Embedded Match Stats", "?view=match&embed=1&" + DOCS_TEAM]] },
    { v: "app", values: "1", where: "Home screen app", what: "Marks a launch from the phone home screen and skips the welcome screen. Set by the Add to Home Screen button, so you rarely type it.", ex: [] },
    { v: "choose", values: "any value", where: "Welcome screen", what: "Skips the first-visit \"choose your device\" screen.", ex: [["Table with no welcome screen", "?choose=1&" + DOCS_TEAM]] },
    { v: "device", values: "mobile · desktop · all", where: "Links page (view=teams)", what: "Previews the links for one device type.", ex: [["Mobile links", "?view=teams&device=mobile"]] }
  ] },
  { id: "colour", title: "Colours and names", intro: "Overrides for how a page is coloured or labelled. Leave them out and the page picks sensible values itself (colours from the team crest).", items: [
    { v: "colour", values: "6-digit hex, no #, e.g. 1b7f3b", where: "Match Stats, Fixtures TV", what: "Match Stats: your team's colour. Fixtures TV: the first accent colour (edge stripe, highlight). Fixtures TV takes the second colour from the crest.", ex: [["Match Stats in green", "?view=match&colour=1b7f3b&" + DOCS_TEAM], ["Fixtures TV in red", "?view=fixtures&layout=tv&colour=c0392b&" + DOCS_TEAM]] },
    { v: "oppColour", values: "6-digit hex", where: "Match Stats", what: "The opponent's colour.", ex: [["Blue opponent", "?view=match&oppColour=1f5fbf&" + DOCS_TEAM]] },
    { v: "club", values: "text", where: "Fixtures TV", what: "The club name top right. Default is the team name without U18 / XV / Women, with RFC added.", ex: [["Custom club name", "?view=fixtures&layout=tv&club=Ivybridge%20Rugby%20Club&" + DOCS_TEAM]] },
    { v: "clubName", values: "text", where: "Stack", what: "The heading of the all-teams stack screen.", ex: [["Custom heading", "?view=stack&clubName=Clubhouse%20Screen"]] },
    { v: "title", values: "text", where: "Table page", what: "Replaces the page title on the league table page.", ex: [["Custom title", "?title=Our%20League&" + DOCS_TEAM]] },
    { v: "rows", values: "a · b · c · d (default)", where: "Stack", what: "The row style of the stack screen.", ex: [["Row style a", "?view=stack&rows=a"], ["Row style c", "?view=stack&rows=c"]] },
    { v: "scale", values: "duel", where: "Match Stats", what: "Switches the comparison bars to the \"duel\" scaling.", ex: [["Duel scaling", "?view=match&scale=duel&" + DOCS_TEAM]] },
    { v: "teams", values: "a list of teams", where: "Stack", what: "A custom set of teams for the stack screen. The Links page builder creates this for you, so you will not normally write it by hand.", ex: [] }
  ] },
  { id: "data", title: "Data (JSON)", intro: "The same numbers a page shows, as JSON. Useful for checking what the page received. Add format=summary and choose the data with detail.", items: [
    { v: "format", values: "summary", where: "Any team address", what: "Returns JSON instead of a page.", ex: [["Fixtures data", "?format=summary&detail=fixtures&" + DOCS_TEAM]] },
    { v: "detail", values: "fixtures · match · leaders · opposition", where: "With format=summary", what: "Which data set to return.", ex: [["Fixtures", "?format=summary&detail=fixtures&" + DOCS_TEAM], ["Match", "?format=summary&detail=match&" + DOCS_TEAM], ["Leaders", "?format=summary&detail=leaders&" + DOCS_TEAM], ["Opposition", "?format=summary&detail=opposition&" + DOCS_TEAM]] }
  ] },
  { id: "diag", title: "Diagnostics and testing", intro: "For checking and testing. Not needed on a live screen.", items: [
    { v: "debug", values: "fixtures · season · venue · weather", where: "With format=summary", what: "Adds diagnostic detail to the data. fixtures: which feeds were used. season: how the season was chosen (DEV only). venue and weather: the venue lookup and forecast steps.", ex: [["Fixtures debug", "?format=summary&detail=fixtures&debug=fixtures&" + DOCS_TEAM], ["Season debug (DEV)", "?debug=season&" + DOCS_TEAM, "dev"]] },
    { v: "today", values: "2026-12-01", where: "DEV only", what: "Pretends it is another date, to test automatic season changes and the summer gap.", ex: [["Pretend it is 1 July 2027", "?today=2027-07-01&" + DOCS_TEAM, "dev"]] },
    { v: "nowx", values: "any value", where: "Match data", what: "Turns off the weather lookup.", ex: [["No weather", "?format=summary&detail=opposition&nowx=1&" + DOCS_TEAM]] },
    { v: "frag", values: "gd", where: "Internal", what: "Returns just a block of the page for the page's own script to load. Not for typing.", ex: [] },
    { v: "force", values: "1", where: "Internal", what: "Used by a page script. Not for typing.", ex: [] }
  ] },
  { id: "addr", title: "Other addresses", intro: "Addresses other than the home page, and the variables they take.", items: [
    { v: "/calendar.ics", values: "team settings", where: "Calendar apps", what: "The team's upcoming fixtures as a calendar file.", ex: [["Download", "/calendar.ics?" + DOCS_TEAM]] },
    { v: "/api/crest", values: "id = team id", where: "Images", what: "The team crest image.", ex: [["Ivybridge crest", "/api/crest?id=11039"]] },
    { v: "/manifest.webmanifest", values: "s = start page, n = app name", where: "Home screen", what: "Used by Add to Home Screen. Set automatically.", ex: [] },
    { v: "/version", values: "none", where: "Any", what: "Shows which version is live (compare PROD and DEV).", ex: [["Version", "/version"]] },
    { v: "/release-notes", values: "none", where: "DEV only", what: "The release notes (README).", ex: [["Release notes", "/release-notes", "dev"]] },
    { v: "/probe", values: "ep", where: "DEV only", what: "Checks the RFU feeds are answering.", ex: [["Probe", "/probe", "dev"]] },
    { v: "/usage", values: "days (7, 14, 30, 90) on the data call", where: "Club PIN", what: "The Usage report: people per day, what is viewed, our teams, teams that are not in our list, devices.", ex: [["Usage", "/usage"]] },
    { v: "/admin", values: "none", where: "Club PIN", what: "The admin page: homepage and TV notices, and switches for screen features. Settings are stored per club in Cloudflare KV (the SETTINGS binding).", ex: [["Admin", "/admin"]] },
    { v: "/unlock, /club-unlock", values: "pin, next", where: "PIN pages", what: "The DEV PIN page and the club PIN page. Redirects here automatically.", ex: [] }
  ] }
];
// -----------------------------------------------------------------------------------------------------------------
// Documentation (v3.6; the Link variables page of v33 is now one section of it). Everything on the page comes from the
// DOC_SECTIONS list below: add or edit a section there and the page, its contents list and its test follow.
// Block types: {h} sub-heading, {p} paragraph, {ul} bullets, {ol} numbered steps, {dl} term/definition pairs,
// {note} callout, {ex} "Try it" buttons ([label, address] or [label, address, "dev"]), {vars:true} the link variables.
// The page is behind the club PIN (clubGate). Never write the DEV site's address into it.
const DOC_SECTIONS = [
  { id: "start", title: "Start here", who: "All", blocks: [
    { p: "The Stats Board turns the England Rugby fixtures and results feeds into clear pages for a club: league tables, fixtures and results, match previews and full-screen boards for clubhouse TVs and digital signage. The same link works on a phone, a laptop or a screen." },
    { h: "How to use this page" },
    { ul: [
      "Club admins: start with Setting up a clubhouse screen, then Which page is which. If something looks wrong, go to Troubleshooting.",
      "The site owner: Admin guide, Setup and deployment and Releases and versions.",
      "Anyone building links: Link variables lists every setting you can add to a link, with a button to try each one."
    ] },
    { h: "Three kinds of page" },
    { dl: [
      ["Screens", "Full-screen boards for TVs and signage (layout=tv, the Fixtures board, the Match Centre). They never ask for a PIN: anyone with the address can open one."],
      ["Phone and desktop pages", "The same information as scrolling pages with tabs. Also open to anyone with the address."],
      ["Club pages", "The Links page, this Documentation and the Admin page. They ask for the club PIN."]
    ] },
    { note: "Everything shown is taken from the public RFU fixtures feed. The Stats Board does not hold any club's private data." }
  ] },
  { id: "pages", title: "Which page is which", who: "Club admins", blocks: [
    { p: "Every page needs a team. The Links page and the link builder create the full address for you." },
    { dl: [
      ["League table page (the default)", "The team's league table, form, results, next fixture and season snapshot. On a big screen it fits the screen; on a phone it is a set of tabs (Home, Fixtures, Next game, Leaders)."],
      ["Fixtures and Results", "Every game the team plays this season, league and cups, with results as they come in. On a phone it is a list; with layout=tv it becomes the season board for a clubhouse screen."],
      ["Match Stats", "A head-to-head comparison for the next game: the two teams side by side, recent form and earlier meetings."],
      ["Opposition report", "A phone page about the next opponent: this game, their form, you against them, and their season."],
      ["League leaders", "Who leads the league in the main statistics, with where your team sits."],
      ["Match Centre", "All of a club's teams on one screen: last game and next game for each. Made for a clubhouse TV (view=stack)."],
      ["Links page", "Every link for the club's teams, ready to copy or share. Club PIN."],
      ["Link builder", "Builds the same links for any team listed on englandrugby.com. Open to anyone."],
      ["Calendar file", "The team's fixtures as a calendar file that phones and calendar apps can import (/calendar.ics)."],
      ["Home screen app", "On a phone, Add to Home Screen installs the page you were on, so it opens straight to that page."]
    ] },
    { ex: [["League table", "?" + DOCS_TEAM], ["Fixtures (phone)", "?view=fixtures&" + DOCS_TEAM], ["Fixtures TV board", "?view=fixtures&layout=tv&" + DOCS_TEAM], ["Match Stats", "?view=match&" + DOCS_TEAM], ["Match Centre", "?view=stack"], ["Links page", "?view=teams"], ["Link builder", "/builder"]] }
  ] },
  { id: "screen", title: "Setting up a clubhouse screen", who: "Club admins", blocks: [
    { ol: [
      "Open the Links page and enter the club PIN if asked.",
      "Find the team. For a season board choose Fixtures and Results (TV View). For all teams at once choose Match Centre (Stacked view).",
      "Copy the link. Screen links do not need a PIN, so they work on any TV browser or signage player.",
      "Open it full screen on the TV. It refreshes by itself: the Fixtures board every 10 minutes on Saturdays and Sundays and hourly otherwise, other screens hourly.",
      "Leave season out of the link. The screen then moves to the new season on its own when the RFU season changes."
    ] },
    { h: "Making it your own" },
    { ul: [
      "colour=1b7f3b sets the accent colour (otherwise it comes from the team crest). club=Your%20Club sets the club name top right.",
      "theme=light switches to light colours. embed=1 hides the page chrome for signage players that frame a web page.",
      "A notice for the screens (for example Bar closed on Saturday) is set on the Admin page, with no change to any link."
    ] },
    { h: "Another club's team" },
    { p: "Use the Link builder, or search for the team on the welcome page. Pick its league and copy the links. A club notice set on the Admin page applies to the club's own teams by default, so it never appears on another club's screen." },
    { ex: [["Fixtures TV board", "?view=fixtures&layout=tv&" + DOCS_TEAM], ["Light theme", "?view=fixtures&layout=tv&theme=light&" + DOCS_TEAM], ["Match Centre", "?view=stack"]] }
  ] },
  { id: "vars", title: "Link variables", who: "Everyone", vars: true, blocks: [
    { p: "Every setting you can add to a link, what it does and where it works. Press an example to try it. The examples use Ivybridge 1XV." }
  ] },
  { id: "admin", title: "Admin guide", who: "Site owner", blocks: [
    { p: "The Admin page (/admin) changes site settings without editing code. It asks for the club PIN, like the Links page. Settings are stored per club in Cloudflare KV. With no storage connected every setting stays at its default." },
    { h: "Notices" },
    { ul: [
      "Homepage notice: a block at the top of the page where visitors pick a team. Text up to 200 characters.",
      "TV screen notice: a one-line strip on TV screens (the Fixtures board, the Match Centre and other layout=tv pages). Text up to 120 characters; keep it short. The normal phone pages do not show it (the Match Centre does, because it is a screen).",
      "Style: Information (blue) or Warning (amber). Hide automatically after: an optional date (UK time) after which the notice stops showing.",
      "Applies to (TV notice): Club teams only (the default), All screens, or Chosen teams. Club teams only means the teams on the club's Links page, so another club's screen never shows it."
    ] },
    { h: "Switches" },
    { dl: [
      ["Around the league today strip", "Other results in the same division on match days (Fixtures board)."],
      ["Weather on the TV banner", "The forecast for the next game, home or away (Fixtures board)."],
      ["Last checked feed time", "The small line at the bottom of the Fixtures board."],
      ["Walkover colours", "Green for the side awarded the win, red for the other, in the around-the-league strip. Off means the winner is simply bold."]
    ] },
    { h: "Access and signing out" },
    { ul: [
      "How long a PIN sign-in lasts: 1, 7, 14 or 30 days (default 30). It applies the next time a PIN is entered; devices already signed in keep the length they were given. The time is counted from the moment the PIN was entered and is not extended by using the pages.",
      "Changing the CLUB_PIN variable signs every device out at once.",
      "Sign out (bottom of the Links, Documentation and Admin pages, and the Usage page header) clears the sign-in on that device straight away."
    ] },
    { h: "How quickly changes appear" },
    { p: "About a minute on the test site. On the live site finished pages are also kept for 2 minutes (Match Stats pages for 2 hours Monday to Friday and 5 minutes at weekends), so allow up to about 3 minutes, or up to 2 hours for Match Stats on a weekday." },
    { h: "Test and live settings" },
    { p: "Each site (test and live) has its own Cloudflare project and its own KV namespace, so a notice tried on the test site never reaches the live one. A setting you want live is entered again on the live Admin page." },
    { h: "Usage and visit counting" },
    { p: "The Usage page (/usage, club PIN) shows people per day, what they look at, which of the club's teams are viewed, which other teams are viewed (and the league and county), the device split, what the clubhouse screens are showing, how often the club pages were opened, wrong PIN entries, a Speed panel (how long pages took to build and how long outside fetches took), and how close the site is to Cloudflare's free daily request limit. A person counts once a day, so the totals are person-days. TV screens and calendar feeds are counted separately so an hourly refresh does not look like a crowd. The Reporting section of the Admin page has a Count visits switch, a Count clubhouse screen loads switch (off means TV screens are not counted at all and the screens chart stays empty) and the default period the Usage page opens on (7, 14, 30 or 90 days)." },
    { p: "Set up once per project: in Cloudflare open the Pages project, Settings, Bindings, Add, Analytics Engine, variable name USAGE, dataset stats_board_usage, then redeploy. To read the numbers back add two secrets, CF_ACCOUNT_ID (your account ID) and CF_API_TOKEN (an API token with Account Analytics Read). Use a separate dataset name for test if you want the two kept apart. Optionally add USAGE_SALT, a long random text, for the daily one-way code (the club PIN is used if it is missing). Nothing is counted until the binding exists." },
    { ex: [["Admin page", "/admin"], ["Usage page", "/usage"]] }
  ] },
  { id: "usagedata", title: "Usage data columns", who: "Site owner", blocks: [
    { p: "Visit counting writes one row per request to the Cloudflare Analytics Engine dataset stats_board_usage (binding USAGE). The Usage page reads it through the SQL API. In SQL the columns are numbered from 1 (blob1, double1). Nothing typed by a visitor is stored. Rows from before v3.13 have no double2." },
    { h: "Page rows (kinds page, tv, cal, club, search, pick)" },
    { dl: [
      ["index1 / blob1", "Scope: club id then |live or |test, e.g. ivybridge|live. Keeps test and live apart in the shared dataset."],
      ["blob2", "Kind: page, tv, cal (calendar feed), club (Links, Usage, Admin, Documentation), search (team search), pick (league lookup)."],
      ["blob3", "View: the page view, or for club pages usage, admin, docs or links."],
      ["blob4 / blob5", "Team id and team name."],
      ["blob6 / blob7", "Competition and division."],
      ["blob8", "Device: phone, tablet, computer or calendar."],
      ["blob9 / blob10", "Country and county."],
      ["blob11", "Known-team flag: whether the team is one of the club's own."],
      ["blob12", "One-way visitor code. It changes every day, so it counts a person once a day and cannot follow anyone from one day to the next."],
      ["blob13", "HTTP status returned."],
      ["blob14", "Page cache: hit or miss."],
      ["double1 / double2", "double1 is always 1 (a count). double2 is the time taken in milliseconds."]
    ] },
    { h: "Wrong-PIN rows (kind pinfail)" },
    { dl: [
      ["blob1 / blob2", "Scope and the word pinfail."],
      ["blob3", "Which PIN: club or dev."],
      ["blob9 / blob10", "Country and county."],
      ["blob12", "One-way source code (also changes daily)."],
      ["double1", "1."]
    ] },
    { h: "RFU request rows (kind up)" },
    { dl: [
      ["blob1 / blob2", "Scope and the word up."],
      ["blob3", "Which RFU source was asked."],
      ["blob4", "Outcome: ok, http, blocked, timeout or error."],
      ["blob5", "wait (a visitor was waiting) or bg (refreshing in the background)."],
      ["double2", "Time taken in milliseconds."]
    ] },
    { p: "Cloudflare removes the rows by itself after about 90 days; there is nothing to clear." }
  ] },
  { id: "data", title: "How the data works", who: "Everyone", blocks: [
    { dl: [
      ["Where it comes from", "The public England Rugby (RFU) fixtures and results feed. Clubs enter results there; the Stats Board shows what the feed holds. Grounds come from the RFU match record, which also gives the map position. Forecasts come from Open-Meteo; postcodes.io and Open-Meteo's place search are only used when the record has no map position."],
      ["How fresh it is", "Live results are treated as fresh for 10 minutes on Saturdays and Sundays and for an hour on other days. When they go out of date the previous copy is shown straight away (for up to six times that long, so up to an hour at weekends) while the site refreshes it in the background, so nobody waits; after that, or when there is no copy, the page waits for RFU (4 to 8 seconds at most). Postcodes and place lookups are kept for 30 days, the list of a team's competitions for 12 hours, a game's venue for 24 hours (a refused venue lookup is not tried again for 6 hours), the season list for a day and forecasts for 3 hours. On the live site, finished pages are also kept for 2 minutes. Fixtures TV boards reload themselves at the same pace; other screens reload hourly."],
      ["Last checked", "The small line on the Fixtures board is when the Stats Board last read the feed. It is not a time supplied by the RFU, which is why it says checked and not updated."],
      ["If the feed is down", "The last good copy is kept for up to 7 days and shown meanwhile, so a screen carries on instead of going blank."],
      ["Seasons", "A link with no season follows the RFU season dates and moves on by itself each year. Between seasons a notice says the new fixtures are not published yet. A link with season=2025-2026 stays on that season."],
      ["Cups", "The Fixtures page and board, and the calendar file, include every game the team plays this season (league, cups, plates, friendlies), and the Fixtures views tag each cup. Every screen that shows a next game or last result (Fixtures, the Next fixture panel, Match Stats, the Opposition Report and the Match Centre) and the calendar use the team's games in every competition. On a cup game, Match Stats shows the cup's name and compares the two teams using their games in that cup only, including recent form (position and points when the cup has a group table), with a note when neither team has played in the cup yet. League games show league figures, and the Match Centre form strip is league only."],
      ["Walkovers and void games", "A walkover counts as a played game with a win or a loss, shown as W/O, and is left out of score figures (points, averages, margins). A void game is shown as Void and not counted."],
      ["Weather", "Shown for a game up to 15 days ahead, for the afternoon of the game. The venue is found from its postcode or place name. No forecast is shown when the game is further away, when the venue cannot be found or when the forecast service does not answer."],
      ["Kick-off times", "Not shown anywhere."],
      ["Around the league today", "On match days, other finished results from the same division appear on the Fixtures board as they come in."]
    ] }
  ] },
  { id: "defs", title: "Definitions", who: "Everyone", blocks: [
    { dl: [
      ["League position and points", "Taken from the league table in the RFU feed. If that is missing, the table is read from the englandrugby.com site, and failing that calculated from the results (bonus points are then estimated)."],
      ["Played, won, drawn, lost", "Counted from finished games. Walkovers count as played with a win or loss; void games are not counted."],
      ["Points difference", "Points scored minus points conceded."],
      ["Average scored and conceded", "Points per game, from games with a real score."],
      ["Win rate", "The share of played games that were won."],
      ["Recent form", "The last five results."],
      ["Win, draw and loss colours", "Green for a win, amber for a draw, red for a loss, grey for a void game."],
      ["Around you", "Clubs within 3 places of your team in the league table."],
      ["Head-to-head", "Meetings in the last 5 seasons, league games only. If the next game is in a cup, earlier meetings in that same cup count too."],
      ["Game difficulty", "An Easy, Medium or Hard indication on the phone Opposition report. It is never shown on a clubhouse screen."],
      ["Rest weekend", "A weekend with no game for the team."]
    ] }
  ] },
  { id: "trouble", title: "Troubleshooting", who: "Club admins", blocks: [
    { dl: [
      ["My team is missing", "Search for it with the Link builder or the welcome page and pick its league. A team only appears once the RFU has published its fixtures, so early in a season it can be missing. Between seasons a notice explains this."],
      ["A result is wrong or late", "The Stats Board shows what the RFU feed holds. Check the last checked time on the Fixtures board. If the feed has the right result and the page does not, wait for the refresh (up to 10 minutes on a weekend). To see what was read, add format=summary&detail=fixtures&debug=fixtures to a team link."],
      ["No weather shows", "The game may be more than 15 days away, the venue may not be found, or the forecast service did not answer. Away games show a forecast only when one is available."],
      ["A screen has stopped updating", "Reload it once. Fixtures boards reload themselves every 10 minutes at weekends and hourly otherwise, other screens hourly. Check the TV has a network connection."],
      ["It shows the wrong season", "A link with no season follows the RFU dates. A link with season= stays pinned, so remove it to follow the current season."],
      ["A game or cup is missing", "Cups come from the competitions the team is entered in. Void games show as Void. Check the game exists in the RFU feed."],
      ["It asks for a PIN", "Only the Links page, this Documentation and the Admin page do. Screen links never do. The test site is also behind its own PIN."],
      ["My notice is not showing", "Check it is switched on, its hide-after date has not passed, and Applies to fits the screen. The normal phone pages do not show the TV notice. Allow a few minutes for a change."]
    ] },
    { ex: [["Fixtures data check", "?format=summary&detail=fixtures&" + DOCS_TEAM], ["Fixtures debug", "?format=summary&detail=fixtures&debug=fixtures&" + DOCS_TEAM], ["Version", "/version"]] }
  ] },
  { id: "setup", title: "Setup and deployment", who: "Site owner", blocks: [
    { p: "The site is one Cloudflare Pages project per environment, using Advanced Mode (_worker.js). The test (DEV) and live (PROD) sites are separate projects with separate settings." },
    { h: "Settings in each project" },
    { dl: [
      ["CLUB_PIN", "The club PIN for the Links page, Documentation and Admin. On the live site these pages stay locked until it is set. On the test site it is only enforced when set. Changing it signs everyone out."],
      ["ENV_LABEL", "Set on the test project only (for example TEST). It marks the site as the test site: a corner badge, the DEV tools, and a PIN."],
      ["DEV_PIN", "The PIN that protects the whole test site. The test site stays locked until it is set."],
      ["USAGE (Analytics Engine binding)", "Counts visits (dataset stats_board_usage). Without it nothing is counted and the Usage page explains what to connect."],
      ["CF_ACCOUNT_ID, CF_API_TOKEN", "Secrets that let the Usage page read the counts back. The token needs Account Analytics Read only."],
      ["SETTINGS (KV binding)", "The KV namespace for admin settings. Use a different namespace for test and live. Without it the site runs on its defaults and the Admin page says storage is not connected."]
    ] },
    { h: "Deploying" },
    { ol: [
      "Upload the release (the three files in the zip) to the test project and check /version shows the new version.",
      "Work through the release's test list on the test site.",
      "Upload the same zip to the live project and check /version there.",
      "To roll back, upload the previous zip and check /version shows the old number."
    ] },
    { h: "PINs and cookies" },
    { p: "A correct PIN sets a cookie holding a hash of the PIN: 30 days for the club PIN, 30 minutes for the test site PIN. No cookie is set until someone enters a PIN." },
    { ex: [["Version check", "/version"]] }
  ] },
  { id: "releases", title: "Releases and versions", who: "Site owner", blocks: [
    { p: "Version numbers are major.minor.patch (for example v3.6). A new feature or visible change raises the minor number (v3.6 to v3.7). A fix or tidy-up with no new feature raises the patch (v3.6.1). A big change to how the site works raises the major number (v4.0). Versions before v3.4 keep their old names; v33 counts as v3.3." },
    { h: "For every release" },
    { ol: [
      "Raise VERSION and BUILD_DATE in _worker.js and add a line to the changelog in its header.",
      "Add a row to the release table in README.txt and write the entry, then run the notes sync so the in-code copy matches.",
      "Run the tests.",
      "Make the zip, named RFU_Club_Dashboard_<version>_<topic>.zip, and keep the previous one.",
      "Test on the test site, then upload the same zip to the live site."
    ] },
    { p: "To see what is live, open /version (JSON: version, build date, environment) or read the stamp at the bottom of any page. Every page also sends an X-Stats-Board-Version header." }
  ] },
  { id: "new", title: "What's new", who: "Everyone", blocks: [
    { dl: [
      ["v3.25.1", "Admin: fixed the England Rugby website back-up switch, which was reading the weather switch when saved."],
      ["v3.25", "Admin has a new switch, England Rugby website as a back-up. It is on by default; turn it off to use only the RFU data service."],
      ["v3.24", "You can name a TV screen by adding &screen=Clubhouse+Bar to its link. The Usage page then lists each named screen with its loads and when it was last seen. Links without it work as before."],
      ["v3.23.3", "Usage page: teams picked in the link builder now show their name, not just a number."],
      ["v3.23.2", "Usage page: other teams that people pick are now listed by team number in Teams that are not in our list."],
      ["v3.23.1", "TV screens no longer flicker while they size themselves: the screen stays blank for a moment, then fades in already fitted."],
      ["v3.23", "The Match Centre Board layout has been removed. Next game first and Classic rows remain; with more than four teams the Match Centre uses Classic rows."],
      ["v3.22.5", "Fixtures on a TV: the cup tag is now its own box, so it can no longer be clipped at any screen size."],
      ["v3.22.4", "Premiership cup games now show their real cup name from the RFU match record (for example Prem Rugby Cup) instead of just Cup."],
      ["v3.22.3", "Fixtures on a TV: the gold cup tag beside Home / Away is no longer cut off at the top and bottom."],
      ["v3.22.2", "Match Stats and the Opposition Report now show tonight's cup game as the next game for a Premiership side, with a note that no cup stats are available, instead of a later league game."],
      ["v3.22.1", "Fixed a Premiership side showing a later league game as its next game when it was playing a cup game that night. Club-entered games with no competition name are now treated as cup games for elite teams."],
      ["v3.22", "Match Centre on a TV now shows where the next game is played and how the two teams sit in the table (for example \"2nd v 3rd, 1 point apart\"). Admins also get a new Match sheet page with team sheets and scorers; under-18 players are never named."],
      ["v3.21.8", "Probe page (testing only): five new cards to try the RFU endpoints for all matches in one call, who played, tries and cards, and match stats."],
      ["v3.21.7", "Opposition report on a phone: the position, home/away and cup tags under the heading no longer sit tight against each other when they wrap onto a second line."],
      ["v3.21.6", "Match Centre layouts: crests are shown whole, as the club supplies them, with no circle behind them, so no dark band or ring appears around any crest."],
      ["v3.21.5", "Match Centre layouts: the circle behind each crest now takes on the crest's own background colour instead of a different shade."],
      ["v3.21.4", "Match Centre layouts: the dash in the last-result score has a small space each side so it no longer touches the numbers."],
      ["v3.21.3", "Match Centre layouts: more room under team and opponent names so the tails of letters like g and p are not cut off on any screen."],
      ["v3.21.2", "Match Centre layouts: letters that hang below the line (such as the g in Paignton) are no longer cut off, and the Board column headings are larger."],
      ["v3.21.1", "Match Centre Next game first: the coloured blocks are now the same height on every team and a little smaller, crests sit smaller so they are not cropped, and the Next game label is larger."],
      ["v3.21", "The Match Centre has two new TV layouts with club and opponent crests: Next game first (now the default) and a Board. The club picks one in Admin; the old rows are still there as Classic. Phones are unchanged."],
      ["v3.20.1", "Extra made-up settings on the end of a link no longer force the live site to rebuild the page each time."],
      ["v3.20", "Links with invalid team, competition, division or season values are now refused before they reach the RFU, and one visitor can only ask for a limited number of different teams a minute. The Usage page has a new Address checks card."],
      ["v3.19", "Safer sign-in: PIN cookies are now random, expiring and signed, and repeated wrong PINs from one source pause that source for a while. Everyone is asked for the PIN once more."],
      ["v3.18.3", "Housekeeping: the release table in the notes is back in the right order."],
      ["v3.18.2", "The footer on Match Stats has more room, and the welcome page is shorter when you have recent teams, so it fits without scrolling on most laptops."],
      ["v3.18.1", "New tagline on the welcome page and shared links: Your club\u2019s rugby fixtures, results and tables at a glance."],
      ["v3.18", "The Stats Board now has its logo: new tab and home-screen icons, a proper header and tagline on the welcome page, a footer on the menu pages, a branded picture when you share a link, and a small \"Powered by The Stats Board\" line on team pages and TV screens that you can switch off in Admin."],
      ["v3.17.2", "Maintenance mode Preview now shows the pun line and extra message you have selected, even before you save."],
      ["v3.17.1", "Switching Maintenance mode on now asks you to type the club PIN again."],
      ["v3.17", "New Maintenance mode switch on the Admin page: shows a friendly \"Back soon\" page everywhere while you work on the site, with an optional pun line and extra message."],
      ["v3.16.4", "Match Stats has a clear \"Get directions\" button under the ground, and it is no longer cut off on phones."],
      ["v3.16.3", "The Usage page has a new chart of outside calls per day, so you can see how often the site goes to the RFU website."],
      ["v3.16.2", "The Usage page loads again (it had been stuck on \"Loading\")."],
      ["v3.16.1", "The Match Centre now shows the venue for a cup game as well as league games."],
      ["v3.16", "Game venues now come straight from the RFU match record, so they load faster and more reliably, and the weather forecast no longer needs extra look-ups."],
      ["v3.15.6", "Match Centre: the version line at the bottom no longer overlaps the last team row."],
      ["v3.15.5", "The version line at the bottom of the TV dashboard no longer overlaps the panels. (Behind the scenes: the test page gained checks for where venues can be found.)"],
      ["v3.15.4", "Fixtures lists: long competition tags such as \"National Under 18 Cup\" are shortened (\"National U18 Cup\") so they are no longer cut off."],
      ["v3.15.3", "The other-competition buttons now show on the Home page only."],
      ["v3.15.2", "The other-competition buttons are taken off the Fixtures page, which already shows every competition."],
      ["v3.15.1", "Fix: the buttons for a team's other competitions now show on phones and iPads (they were missing in the app view)."],
      ["v3.15", "Team search and each team's list of competitions now come from the RFU data service, so far fewer calls go to the englandrugby.com website."],
      ["v3.14.5", "Probe page (DEV only): the copied results now carry more detail, and a new check lists a team's competitions from the RFU data service."],
      ["v3.14.4", "Fewer calls to the RFU website: venues are kept 24 hours, a refused lookup is remembered for 6 hours, and no weather lookup is made without a venue."],
      ["v3.14.3", "Match Stats pages are now kept for 2 hours Monday to Friday on the live site (5 minutes at weekends)."],
      ["v3.14.2", "Match Stats pages are kept for longer on the live site (30 minutes on weekdays, 5 minutes at weekends), so they load faster and use less computing."],
      ["v3.14.1", "Usage page: a Today button (by the hour) and the Cloudflare free-limit figure now counts from midnight UTC, when the daily limit restarts."],
      ["v3.14", "Buttons for a team's other competitions on phones and iPads, a note saying what the cup view reports, a Sign out link and an Admin setting for how long a PIN sign-in lasts, and search engines skip the team pages."],
      ["v3.13.1", "Fix: the live Usage page no longer shows visits from the test site. Counts start afresh."],
      ["v3.13", "Faster pages: out-of-date RFU data is shown straight away and refreshed in the background, so nobody waits for it, and rarely-changing lookups (postcodes, places, season list, forecasts) are kept for longer. The Usage page has a Speed panel."],
      ["v3.12", "Usage page: what the clubhouse screens are showing, how often the Usage, Admin, Documentation and Links pages were opened, and wrong PIN entries."],
      ["v3.11", "Admin page: a Reporting section with the visit counting switch, a switch for counting clubhouse screen loads and the default period for the Usage page. The Usage page charts screen loads per day."],
      ["v3.10", "Visit counting and a Usage page (club PIN): anonymous counts of visits by page, team and device, with TV screens and calendars counted apart from people. An on/off switch is on the Admin page."],
      ["v3.9.1", "The Colts show as \"Colts\" on the Match Centre and Links page. Home-at, Directions and weather use the club name from the RFU data."],
      ["v3.9", "The Colts are now in the team list: on the Links page, in the admin notice choices and on the Match Centre, which now fits four teams."],
      ["v3.8.1", "Match Stats recent form on a cup game now shows results in that cup only, matching the rest of the page."],
      ["v3.8", "The Match Centre and the Opposition Report also follow cup games, tagged with the cup name. Every next game and last result now covers all competitions."],
      ["v3.7.1", "The Next fixture panel on the dashboard and TV view now shows a cup game when it comes before the next league game, with the cup name."],
      ["v3.7", "Match Stats now covers cup games: it shows the cup name and compares the two teams in that cup. If neither team has played in the cup yet it says so."],
      ["v3.6.4", "Fixtures TV heading: age-group teams such as Ivybridge U18s now read Ivybridge RFC."],
      ["v3.6.3", "Fixtures TV board: the heading for The Vandals now reads the club name (Ivybridge RFC), not \"The Vandals RFC\"."],
      ["v3.6.2", "Fixtures TV board: the bottoms of letters like g and y in the opponent name are no longer clipped."],
      ["v3.6.1", "Documentation corrected: the calendar file already includes cup games."],
      ["v3.6", "Documentation page (this one). The PROD/DEV switch has been removed from the Links page."],
      ["v3.5", "Admin page: homepage and TV notices, and switches for screen features, stored per club in Cloudflare KV."],
      ["v3.4", "New version numbering (major.minor.patch)."],
      ["v33", "The link variables page."],
      ["v32", "Fixtures TV board branding: club name, clock and date, and an accent colour taken from the crest."],
      ["v31h, v31g", "Walkover winners shown in green and the other side in red in the around-the-league strip."],
      ["v31f", "Around the league today strip on the Fixtures board, and 10-minute refresh at weekends."],
      ["v31e", "Forecast shown for away games when available."],
      ["v31c, v31a", "The Fixtures page includes cups, plates and friendlies, each tagged."],
      ["v31", "Match Stats on TV fits any screen height."],
      ["v30x", "Automatic season: links with no season follow the RFU dates."],
      ["v30", "New phone navigation: Home, Fixtures, Next game and Leaders."]
    ] },
    { p: "Older history is in the release notes on the test site." }
  ] },
  { id: "privacy", title: "Privacy and security", who: "Everyone", blocks: [
    { ul: [
      "The Stats Board has no accounts and collects no personal data itself. It shows public RFU information.",
      "Screens and team pages are open to anyone with the address. The Links page, this Documentation and the Admin page need the club PIN. The test site is behind its own PIN.",
      "The Documentation and Admin pages are marked so search engines skip them, and are never cached. Team, Fixtures, Match Stats, Match Centre and Opposition pages are marked the same way (v3.14); only the welcome page is left for search engines to find.",
      "A cookie is set only after a PIN is entered. The browser also remembers your theme and chosen team on your own device; this stays in the browser and is not sent to us.",
      "Saving on the Admin page needs the club PIN cookie and must come from this site. Notice text is shown as plain text, so it cannot add code to a page.",
      "Visit counting (v3.10) is anonymous. For each page view the site stores the page type, the team and league being viewed, phone, tablet or computer, the country and county, and a one-way code that lets it count a person once a day. The code is made from the connection and browser details plus a secret and the date, so it cannot be turned back into who someone is or linked from one day to the next. How long a page took to build, and how long each fetch from RFU or the weather service took, is recorded as a number and nothing else. The same is done for the Usage, Admin, Documentation and Links pages (how often they were opened, once signed in) and for a wrong PIN typed on a PIN page (no PIN text is kept, only that it was wrong, a one-way code for the source, and the country and county). No cookies, no IP addresses and no typed search text are stored. Known robots are left out (except for wrong PINs, where a guessing robot is exactly what the count is for) and the data is kept for about 3 months. It can be switched off on the Admin page.",
      "To look up forecasts the site contacts Open-Meteo (and postcodes.io when a ground has no map position), sending only a map position, venue name or postcode and a date, never anything about a visitor."
    ] }
  ] }
];
const DOC_WHO = { "All": "Everyone", "Everyone": "Everyone", "Club admins": "Club admins", "Site owner": "Site owner" };
function docsPage(theme, isDev) {
  const t = theme === "light" ? "light" : "dark";
  const esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ex = (e) => { const dev = e[2] === "dev"; const href = e[1].startsWith("/") ? e[1] : "/" + e[1]; return dev && !isDev ? `<span class="xg" title="Test site only">${esc(e[0])} <i>DEV only</i></span>` : `<a class="xl" href="${esc(href)}" target="_blank" rel="noopener">${esc(e[0])}</a>`; };
  const exRow = list => `<div class="dx"><span>Try it</span>${list.map(ex).join("")}</div>`;
  const varGroups = DOCS.map(s => `<div class="ds" id="${s.id}"><h3>${esc(s.title)}</h3><p class="di">${esc(s.intro)}</p>${s.items.map(i => `<div class="dv"><div class="dh"><code>${esc(i.v)}</code><span class="dw">${esc(i.where)}</span></div><div class="dvl">${esc(i.values)}</div><p>${esc(i.what)}</p>${i.ex.length ? exRow(i.ex) : ""}</div>`).join("")}</div>`).join("");
  const varsNav = DOCS.map(s => `<a class="pill sm" href="#${s.id}">${esc(s.title)}</a>`).join("");
  const anat = `<div class="anat"><b>https://thestatsboard.co.uk/</b>?<span class="a1">team=11039&amp;competition=1699&amp;division=75791&amp;teamName=Ivybridge&amp;friendlyName=Ivybridge%201XV</span>&amp;<span class="a2">view=fixtures</span>&amp;<span class="a3">layout=tv</span>&amp;<span class="a4">colour=1b7f3b</span></div>
<p class="di"><span style="color:#7fd19a">Green</span>: which team (<code>team</code>, <code>competition</code>, <code>division</code>, <code>teamName</code>, <code>friendlyName</code>). <span style="color:#f0c85a">Amber</span>: which page (<code>view</code>). <span style="color:#7fb6f0">Blue</span>: how it is laid out (<code>layout</code>, <code>theme</code>). <span style="color:#e79ac0">Pink</span>: your own touches (<code>colour</code>, <code>club</code>, <code>title</code>). Anything a page does not use is ignored.</p>`;
  const block = b => b.h ? `<h3 class="bh">${esc(b.h)}</h3>` : b.p ? `<p class="bp">${esc(b.p)}</p>` : b.ul ? `<ul class="bl">${b.ul.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : b.ol ? `<ol class="bo">${b.ol.map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : b.dl ? `<dl class="bd">${b.dl.map(x => `<div><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join("")}</dl>` : b.note ? `<div class="bn">${esc(b.note)}</div>` : b.ex ? exRow(b.ex) : "";
  const sections = DOC_SECTIONS.map(s => `<section class="sc" id="sec-${s.id}"><div class="sh"><h2>${esc(s.title)}</h2><span class="who">${esc(DOC_WHO[s.who] || s.who)}</span></div>${s.blocks.map(block).join("")}${s.vars ? `<h3 class="bh">How a link is built</h3>${anat}<div class="toc">${varsNav}</div>${varGroups}` : ""}</section>`).join("");
  const side = DOC_SECTIONS.map(s => `<a href="#sec-${s.id}">${esc(s.title)}</a>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Documentation</title>
<style>
${MENU_CSS}
.wrap.dc{max-width:1120px}.dg{display:grid;grid-template-columns:230px minmax(0,1fr);gap:34px;align-items:start;margin-top:10px}
.side{position:sticky;top:14px;display:flex;flex-direction:column;gap:2px;max-height:calc(100vh - 28px);overflow:auto}.side a{color:#c5d1ca;text-decoration:none;font-size:14px;padding:7px 10px;border-radius:9px}.side a:hover{background:#17211c;color:#fff}
.main{min-width:0}.sc{margin-bottom:46px;scroll-margin-top:12px}.sh{display:flex;justify-content:space-between;align-items:baseline;gap:12px;border-top:1px solid #26312d;padding-top:14px;margin-bottom:10px}.sh h2{font-size:22px;margin:0}.who{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#91a49a;border:1px solid #2c3a34;border-radius:99px;padding:3px 10px;white-space:nowrap}
.bp{font-size:15px;line-height:1.6;color:#d7e2db;margin:0 0 12px;max-width:760px}.bh{font-size:16px;margin:20px 0 8px}
.bl,.bo{margin:0 0 12px;padding-left:22px;max-width:760px}.bl li,.bo li{font-size:15px;line-height:1.6;color:#d7e2db;margin-bottom:6px}
.bd{margin:0 0 14px;display:grid;gap:8px}.bd>div{background:#111719;border:1px solid #26312d;border-radius:12px;padding:10px 14px}.bd dt{font-weight:700;font-size:15px;margin-bottom:3px}.bd dd{margin:0;font-size:14.5px;line-height:1.55;color:#c5d1ca}
.bn{background:#14283a;border:1px solid #24435e;color:#cfe4f7;border-radius:12px;padding:10px 14px;font-size:14.5px;line-height:1.5;margin:12px 0;max-width:760px}
.anat{background:#111719;border:1px solid #26312d;border-radius:14px;padding:14px 16px;margin:10px 0 0;font:14px/1.7 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-wrap:anywhere;color:#cfe2d6}.anat b{font-weight:700}.anat .a1{color:#7fd19a}.anat .a2{color:#f0c85a}.anat .a3{color:#7fb6f0}.anat .a4{color:#e79ac0}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 6px}.pill.sm{font-size:13px;padding:6px 12px}
.ds{margin-top:24px;scroll-margin-top:12px}.ds h3{font-size:17px;margin:0 0 4px}.di{color:#91a49a;font-size:14px;margin:4px 0 12px}
.dv{background:#111719;border:1px solid #26312d;border-radius:14px;padding:12px 16px;margin-bottom:10px}.dh{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap}.dh code{font:700 17px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#7fd19a}.dw{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#91a49a}
.dvl{font:13px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#f0c85a;margin:4px 0 6px;overflow-wrap:anywhere}.dv p{margin:0 0 8px;font-size:14.5px;line-height:1.5;color:#d7e2db}
.dx{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:4px 0 12px}.dx>span{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#91a49a;margin-right:2px}.xl{font:700 13px Arial,Helvetica,sans-serif;color:#0b1110;background:#7fd19a;border-radius:99px;padding:6px 12px;text-decoration:none}.xg{font:13px Arial,Helvetica,sans-serif;color:#91a49a;border:1px dashed #3a4a42;border-radius:99px;padding:5px 11px}.xg i{font-style:normal;font-size:11px;letter-spacing:.06em;text-transform:uppercase;margin-left:4px}
.dv .dx{margin-bottom:2px}
@media(max-width:860px){.dg{grid-template-columns:1fr}.side{position:static;flex-direction:row;flex-wrap:wrap;gap:8px;max-height:none}.side a{background:#17211c;border:1px solid #294333;border-radius:99px;font-size:13px;padding:6px 12px}}
body.light .side a{color:#33443a}body.light .side a:hover{background:#e4efe7;color:#14301e}body.light .bp,body.light .bl li,body.light .bo li,body.light .bd dd{color:#24342a}body.light .bd>div,body.light .anat,body.light .dv{background:#fff;border-color:#cbd8ce}body.light .anat{color:#24342a}body.light .sh{border-color:#cbd8ce}body.light .who{border-color:#cbd8ce;color:#53665a}body.light .bn{background:#e3f0fb;border-color:#b7d5ea;color:#12354f}body.light .dv p{color:#24342a}body.light .dh code{color:#1b7f3b}body.light .dvl{color:#8a5a00}body.light .xl{background:#1b7f3b;color:#fff}body.light .xg{border-color:#b8c7bc}body.light .pill.sm{background:#eef5ef;color:#1d3a28;border-color:#cbd8ce}
@media(max-width:860px){body.light .side a{background:#eef5ef;border-color:#cbd8ce}}
</style></head><body class="${t}">${themeBoot("true")}<div class="wrap dc">
<nav class="mbar"><a class="pill" href="/?view=teams">&lsaquo; Menu</a><button type="button" class="pill tgl">Light mode</button></nav>
<h1>Documentation</h1><p class="sub">${esc(VERSION_LABEL)} &middot; how The Stats Board works, how to set up a screen, and every setting you can put in a link.</p>
<div class="dg"><nav class="side" aria-label="Contents">${side}</nav><div class="main">${sections}</div></div>
<p class="ver">${esc(VERSION_LABEL)} &middot; <a href="/club-signout" style="color:inherit">Sign out</a></p></div>
${themeToggleScript}
</body></html>`;
}

function notesPage(theme) {
  const t = theme === "light" ? "light" : "dark";
  const esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex"><title>Release notes</title>
<style>
${MENU_CSS}
.notes{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#111719;border:1px solid #26312d;border-radius:14px;padding:16px 18px;margin:12px 0 0;color:#d7e2db}
body.light .notes{background:#fff;border-color:#cbd8ce;color:#24342a}
.wrap.nt{max-width:900px}
</style></head><body class="${t}">${themeBoot("true")}<div class="wrap nt">
<nav class="mbar"><a class="pill" href="/?view=teams">&lsaquo; Menu</a><button type="button" class="pill tgl">Light mode</button></nav>
<h1>Release notes</h1><p class="sub">${esc(VERSION_LABEL)}</p>
<pre class="notes">${esc(RELEASE_NOTES)}</pre>
<p class="ver">${VERSION_LABEL}</p>
</div>
${themeToggleScript}
</body></html>`;
}


// -----------------------------------------------------------------------------------------------------------------
// Settings and admin page (v3.5). Settings live in a Cloudflare KV namespace bound to the project as SETTINGS, one
// record per club (key "club:<id>"). Only one club exists today (CLUB_ID); nothing here is tied to Ivybridge beyond that
// id and the TEAMS list. Without the KV binding every setting keeps its default and the admin page explains how to
// connect it. Changes reach the screens within about a minute (30 s here, plus KV's own 60 s read cache).
let SITE_ENV = {}; // set from the Pages env at the start of every request
const CLUB_ID = "ivybridge";
const SETTINGS_KEY = "club:" + CLUB_ID;
// Maintenance mode (v3.17). Nothing here is club-specific: the page says only "The Stats Board".
const MAINT_LINES_DEFAULT = ["We're just lining up the conversion - Try again soon!", "Back after the break.", "We've gone into touch.", "Currently in the scrum.", "Awaiting the TMO.", "Held up over the line."];
const SETTINGS_DEFAULT = () => ({
  notices: { home: { on: false, text: "", style: "info", until: "" }, tv: { on: false, text: "", style: "info", applies: "club", teams: [], until: "" } },
  features: { around: true, weather: true, checked: true, wocolour: true, count: true, screens: true, powered: true, webfallback: true },
  reporting: { days: 14 },
  signin: { days: 30 },
  matchCentre: { layout: "next" },
  maintenance: { on: false, pun: "random", extra: "", lines: MAINT_LINES_DEFAULT.slice() },
  savedAt: ""
});
function kvOf() { const k = SITE_ENV && SITE_ENV.SETTINGS; return k && typeof k.get === "function" && typeof k.put === "function" ? k : null; }
function cleanSettings(raw) {
  const d = SETTINGS_DEFAULT(), r = raw && typeof raw === "object" ? raw : {};
  const n = r.notices && typeof r.notices === "object" ? r.notices : {}, f = r.features && typeof r.features === "object" ? r.features : {};
  const txt = (x, max) => String(x == null ? "" : x).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  const style = x => x === "warning" ? "warning" : "info";
  const until = x => /^\d{4}-\d{2}-\d{2}$/.test(String(x || "")) ? String(x) : "";
  const h = n.home || {}, t = n.tv || {}, ids = TEAMS.map(x => String(x.team));
  d.notices.home = { on: h.on === true, text: txt(h.text, 200), style: style(h.style), until: until(h.until) };
  d.notices.tv = { on: t.on === true, text: txt(t.text, 120), style: style(t.style), applies: ["all", "club", "chosen"].includes(t.applies) ? t.applies : "club", teams: Array.isArray(t.teams) ? t.teams.map(String).filter(x => ids.includes(x)) : [], until: until(t.until) };
  for (const k of ["around", "weather", "checked", "wocolour", "count", "screens", "powered", "webfallback"]) d.features[k] = f[k] === false ? false : true;
  { const rp = r.reporting && typeof r.reporting === "object" ? r.reporting : {}; d.reporting.days = [7, 14, 30, 90].includes(Number(rp.days)) ? Number(rp.days) : 14; }
  { const mc = r.matchCentre && typeof r.matchCentre === "object" ? r.matchCentre : {}; d.matchCentre.layout = ["next", "classic"].includes(mc.layout) ? mc.layout : "next"; }
  { const sg = r.signin && typeof r.signin === "object" ? r.signin : {}; d.signin.days = [1, 7, 14, 30].includes(Number(sg.days)) ? Number(sg.days) : 30; }
  { const m = r.maintenance && typeof r.maintenance === "object" ? r.maintenance : {};
    d.maintenance.on = m.on === true;
    d.maintenance.extra = txt(m.extra, 120);
    if (Array.isArray(m.lines)) { const seen = new Set(), out = []; for (const x of m.lines) { const l = txt(x, 100).replace(/[<>]/g, ""); if (l && !seen.has(l) && out.length < 20) { seen.add(l); out.push(l); } } d.maintenance.lines = out; }
    const pk = typeof m.pun === "string" ? txt(m.pun, 100).replace(/[<>]/g, "") : "random";
    d.maintenance.pun = pk === "random" || pk === "none" || d.maintenance.lines.includes(pk) ? pk : "random"; }
  d.savedAt = typeof r.savedAt === "string" ? r.savedAt.slice(0, 40) : "";
  return d;
}
let SETTINGS_CACHE = { at: 0, v: null };
async function siteSettings() {
  const kv = kvOf();
  if (!kv) return SETTINGS_DEFAULT();
  if (SETTINGS_CACHE.v && Date.now() - SETTINGS_CACHE.at < 30000) return SETTINGS_CACHE.v;
  let v = null, failed = false;
  try { v = await kv.get(SETTINGS_KEY, { type: "json", cacheTtl: 60 }); } catch (_) { failed = true; }
  if (failed && SETTINGS_CACHE.v) return SETTINGS_CACHE.v; // KV hiccup: keep the last good copy
  const s = cleanSettings(v); SETTINGS_CACHE = { at: Date.now(), v: s }; return s;
}
const UK_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function ukStamp(iso) {
  const d = new Date(iso); if (!iso || isNaN(d)) return "";
  const p = {}; for (const x of new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "numeric", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d)) p[x.type] = x.value;
  return p.day + "-" + UK_MONTHS[Number(p.month) - 1] + "-" + p.year + ", " + (p.hour === "24" ? "00" : p.hour) + ":" + p.minute;
}
function noticeToday(url, isDev) {
  const t = isDev === true && url ? url.searchParams.get("today") : "";
  return t && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}
function homeNoticeFor(s, url, isDev) { const n = s.notices.home; return n.on && n.text && !(n.until && noticeToday(url, isDev) > n.until) ? n : null; }
function tvNoticeFor(s, url, isDev) {
  const n = s.notices.tv;
  if (!(n.on && n.text) || (n.until && noticeToday(url, isDev) > n.until)) return null;
  const team = url.searchParams.get("team") || "", stack = url.searchParams.get("view") === "stack";
  if (n.applies === "club" && !stack && team && !TEAMS.some(t => String(t.team) === team)) return null;
  if (n.applies === "chosen" && !stack && !n.teams.includes(team)) return null;
  return n;
}
const NOTICE_CSS = `<style>.sbn.info{background:#14283a;color:#cfe4f7;border:1px solid #24435e}.sbn.warning{background:#3a2a0a;color:#ffe3a3;border:1px solid #6b4d12}body.light .sbn.info{background:#e3f0fb;color:#12354f;border-color:#b7d5ea}body.light .sbn.warning{background:#fff1cf;color:#5a3a00;border-color:#e3c274}</style>`;
const noticeEsc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Homepage: a block at the top of the team-picker page.
function homeNoticeHtml(n) { return NOTICE_CSS + `<div class="sbn ${n.style}" id="sbnh" role="note" style="margin:0 0 14px;padding:10px 14px;border-radius:10px;font:15px/1.45 Arial,Helvetica,sans-serif">${noticeEsc(n.text)}</div>`; }
// TV: a slim one-line strip in the page flow. "fx" is the Fixtures TV board, which reserves exact room for it.
function tvNoticeHtml(n, fx, grid) {
  return NOTICE_CSS + (grid ? `<style>body{grid-template-rows:auto auto repeat(${Math.max(1, Number(grid) || 3)},minmax(0,1fr))!important}</style>` : "") + `<div class="sbn ${n.style}" id="sbnt" role="note" style="flex:none;box-sizing:border-box;width:100%;${fx ? "height:5.4vh;margin-top:1.2vh;" : "margin:.6vh 0;padding:.4em 1em;"}display:flex;align-items:center;justify-content:center;text-align:center;border-radius:1.2vh;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font:700 ${fx ? "2.5vh" : "clamp(14px,2.4vh,40px)"}/1.2 Arial,Helvetica,sans-serif;position:relative;z-index:7"><span style="overflow:hidden;text-overflow:ellipsis;max-width:96%">${noticeEsc(n.text)}</span></div>`;
}
// Applied to every HTML page by the outer wrapper: homepage notice on the welcome page, TV notice on TV pages (not on the
// Fixtures TV board, which places its own).
async function noticeInject(html, url, isDev) {
  const welcome = html.includes('class="wrap wl"');
  const tv = !welcome && (url.searchParams.get("layout") === "tv" || url.searchParams.get("view") === "stack") && !html.includes('id="sbnt"');
  if (!welcome && !tv) return html;
  const s = await siteSettings();
  if (welcome) { const n = homeNoticeFor(s, url, isDev); return n ? html.replace('<h1 style="display:flex;justify-content:center">', m => homeNoticeHtml(n) + m) : html; }
  const n = tvNoticeFor(s, url, isDev);
  return n && /<body[^>]*>/i.test(html) ? html.replace(/<body([^>]*)>/i, m => m + tvNoticeHtml(n, false, url.searchParams.get("view") === "stack" ? (html.includes('data-ly="') ? 1 : ((html.match(/class="rw"/g) || []).length || 3)) : false)) : html;
}
function adminPage(theme, isDev, s, kvOk) {
  const t = theme === "light" ? "light" : "dark", ea = noticeEsc;
  const sw = (id, on, label, hint) => `<div class="r"><div><b>${label}</b><small>${hint}</small></div><label class="tg"><input type="checkbox" id="${id}"${on ? " checked" : ""}><span></span></label></div>`;
  const seg = (name, cur, opts) => `<div class="seg">${opts.map(o => `<label><input type="radio" name="${name}" value="${o[0]}"${cur === o[0] ? " checked" : ""}><span>${o[1]}</span></label>`).join("")}</div>`;
  const styleOpts = [["info", "Information"], ["warning", "Warning"]];
  const h = s.notices.home, v = s.notices.tv, m = s.maintenance;
  const setup = kvOk ? "" : `<div class="card"><h3>Settings storage is not connected</h3><p class="msg">The site is running on its default settings. To change settings here, connect a KV namespace: in Cloudflare open the Pages project, Settings, Bindings, Add, KV namespace, name the variable <b>SETTINGS</b>, then redeploy. Use a separate namespace for the DEV and PROD projects so test notices never reach the live site.</p></div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Admin</title>
<style>
${MENU_CSS}
.wrap.ad{max-width:620px}[hidden]{display:none!important}
.cs{display:flex;justify-content:space-between;align-items:center;margin:14px 0 0;background:#111719;border:1px solid #26312d;border-radius:14px;padding:10px 16px}.cs b{font-size:16px}.cs small{color:#91a49a;font-size:12.5px;display:block}
.ad h2{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#91a49a;margin:26px 0 8px}
.cd{background:#111719;border:1px solid #26312d;border-radius:16px;padding:6px 18px}
.r{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid #1f2925}.r:last-child{border:0}.r b{font-size:15px;display:block}.r small{color:#91a49a;font-size:12.5px;line-height:1.4;display:block;margin-top:2px}
.nb{padding:14px 0;border-bottom:1px solid #1f2925}.nb:last-child{border:0}.nh{display:flex;justify-content:space-between;align-items:center;gap:14px}.nh b{font-size:15px;display:block}.nh small{color:#91a49a;font-size:12.5px;line-height:1.4;display:block;margin-top:2px}
.ad .in{margin-top:9px}.two{display:flex;gap:14px;flex-wrap:wrap;margin-top:6px}.two>div{flex:1;min-width:200px}.l{font-size:12px;color:#9eafa5;font-weight:700;margin-top:10px}.l span{font-weight:400}
.cnt{font-size:12px;color:#91a49a;text-align:right;margin-top:3px}
.tg{position:relative;flex:0 0 auto;width:46px;height:27px}.tg input{position:absolute;inset:0;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}.tg span{position:absolute;inset:0;border-radius:99px;background:#2c3a34;transition:.15s}.tg span::after{content:"";position:absolute;top:3px;left:3px;width:21px;height:21px;border-radius:50%;background:#cfd8d3;transition:.15s}.tg input:checked+span{background:#2f9d57}.tg input:checked+span::after{left:22px;background:#fff}.tg input:focus-visible+span{outline:3px solid #7fd89a;outline-offset:2px}
.seg{display:inline-flex;flex-wrap:wrap;border:1px solid #2c3a34;border-radius:18px;overflow:hidden;font-size:13px;font-weight:700;margin-top:6px}.seg label{position:relative}.seg input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}.seg span{display:block;padding:7px 12px;color:#91a49a}.seg input:checked+span{background:#2f9d57;color:#fff}.seg input:focus-visible+span{outline:3px solid #7fd89a;outline-offset:-3px}
.tw{margin-top:8px;display:flex;flex-direction:column;gap:6px}.tw label{display:flex;gap:8px;align-items:center;font-size:14px}
.save{margin:22px 0 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap}.btn{font:700 15px Arial,Helvetica,sans-serif;background:#7fd19a;color:#0b1110;border:0;border-radius:99px;padding:12px 24px;cursor:pointer}.btn:disabled{opacity:.5;cursor:default}.n{font-size:12.5px;color:#91a49a}
body.light .cs,body.light .cd{background:#fff;border-color:#cbd8ce}body.light .r,body.light .nb{border-color:#e3ebe5}body.light .btn{background:#1b7f3b;color:#fff}body.light .seg{border-color:#cbd8ce}body.light .tg span{background:#c9d4cc}
</style></head><body class="${t}">${themeBoot("true")}<div class="wrap ad">
<nav class="mbar"><a class="pill" href="/?view=teams">&lsaquo; Menu</a><button type="button" class="pill tgl">Light mode</button></nav>
<h1>Admin</h1><p class="sub">Changes reach the screens within about a minute. This page is behind the club PIN.</p>
<div class="cs"><div><small>Settings for</small><b>Ivybridge RFC</b></div></div>
${setup}
<form id="af" onsubmit="return false"><fieldset ${kvOk ? "" : "disabled"} style="border:0;padding:0;margin:0;min-width:0">
<h2>Site notices</h2><div class="cd">
<div class="nb"><div class="nh"><div><b>Homepage notice</b><small>Shown at the top of the page where visitors pick a team. Everyone sees it.</small></div><label class="tg"><input type="checkbox" id="hon"${h.on ? " checked" : ""}><span></span></label></div>
<input class="in" id="ht" maxlength="200" autocomplete="off" placeholder="e.g. The RFU feed is having problems today, so some results may be late." value="${ea(h.text)}"><div class="cnt" id="hc"></div>
<div class="two"><div><div class="l">Style</div>${seg("hs", h.style, styleOpts)}</div><div><div class="l">Hide automatically after <span>(optional)</span></div><input class="in" type="date" id="hu" value="${ea(h.until)}" style="margin-top:6px"></div></div></div>
<div class="nb"><div class="nh"><div><b>TV screen notice</b><small>A slim one-line strip on TV screens (Fixtures board, Match Centre and other layout=tv pages). Keep it short.</small></div><label class="tg"><input type="checkbox" id="ton"${v.on ? " checked" : ""}><span></span></label></div>
<input class="in" id="tt" maxlength="120" autocomplete="off" placeholder="e.g. Bar closed for the Christmas party on Saturday" value="${ea(v.text)}"><div class="cnt" id="tc2"></div>
<div class="l">Applies to</div>${seg("ta", v.applies, [["club", "Club teams only"], ["all", "All screens"], ["chosen", "Chosen teams"]])}
<div class="tw" id="tw" hidden>${TEAMS.map(x => `<label><input type="checkbox" class="tc" value="${ea(x.team)}"${v.teams.includes(String(x.team)) ? " checked" : ""}> ${ea(x.name)}</label>`).join("")}</div>
<p class="n" style="margin:6px 0 0">Club teams only means the teams on this club's Links page. Another club's screen never shows this notice.</p>
<div class="two"><div><div class="l">Style</div>${seg("ts", v.style, styleOpts)}</div><div><div class="l">Hide automatically after <span>(optional)</span></div><input class="in" type="date" id="tu" value="${ea(v.until)}" style="margin-top:6px"></div></div></div>
</div>
<h2>Screens</h2><div class="cd">
${sw("fa", s.features.around, "&ldquo;Around the league today&rdquo; strip", "Other results in the same division on match days (Fixtures TV board).")}
${sw("fw", s.features.weather, "Weather on the TV banner", "Forecast for the next game, home or away (Fixtures TV board).")}
${sw("fc", s.features.checked, "&ldquo;Last checked&rdquo; feed time", "The small line at the bottom of the Fixtures TV board.")}
${sw("fp", s.features.powered, "&ldquo;Powered by The Stats Board&rdquo; line", "The small line at the bottom of team pages and TV screens. Off shows only the version.")}
<div class="nb"><div class="nh"><div><b>Match Centre layout</b><small>How the all-teams Match Centre screen is laid out on a TV. Phones always get the stacked cards. With more than four teams, &ldquo;Next game first&rdquo; switches to Classic rows automatically. <a href="/?view=stack&amp;ly=next" target="_blank" rel="noopener" style="color:#7fd89a">Preview next game first</a> &middot; <a href="/?view=stack&amp;ly=classic" target="_blank" rel="noopener" style="color:#7fd89a">Classic</a></small></div></div>${seg("ml", s.matchCentre.layout, [["next", "Next game first"], ["classic", "Classic rows"]])}</div>
<div class="nb"><div class="nh"><div><b>Match sheet</b><small>Team sheets and scorers for each team's next and last game, for admins only. Under-18 teams are always shown without names. <a href="/matchsheet" target="_blank" rel="noopener" style="color:#7fd89a">Open the match sheet</a></small></div></div></div>
${sw("fo", s.features.wocolour, "Walkover colours", "Green for the side awarded the win, red for the other, in the around-the-league strip.")}
${sw("fb", s.features.webfallback, "England Rugby website as a back-up", "When the RFU data service has no league table, ground or team list, the site asks the englandrugby.com website instead. Turn this off to use the data service only: a table or ground it cannot supply is then left blank. Check the RFU web page row on the Usage page first.")}
</div><h2>Access</h2><div class="cd">
<div class="nb"><div class="nh"><div><b>How long a PIN sign-in lasts</b><small>After this many days a device is asked for the club PIN again. Devices already signed in keep the length they were given; changing the PIN signs everyone out at once. Anyone can also use Sign out (bottom of the Links, Documentation and Admin pages).</small></div></div>${seg("sd", String(s.signin.days), [["1", "1 day"], ["7", "7 days"], ["14", "14 days"], ["30", "30 days"]])}</div>
</div><h2>Reporting</h2><div class="cd">
${sw("fv", s.features.count, "Count visits", "Anonymous counts of pages, teams and devices. No cookies, no IP addresses, no typed text. Needs the USAGE binding.")}
${sw("fs", s.features.screens, "Count clubhouse screen loads", "Adds each TV screen load to the counts, for the screens-per-day chart. Off means screens are not counted at all.")}
<div class="nb"><div class="nh"><div><b>Default period on the Usage page</b><small>The range shown first. It can still be changed on the page. <a href="/usage" style="color:#7fd89a">See the usage report</a>.</small></div></div>${seg("rd", String(s.reporting.days), [["7", "7 days"], ["14", "14 days"], ["30", "30 days"], ["90", "90 days"]])}</div>
</div>
<h2>Maintenance mode</h2><div class="cd">
<div class="nb"><div class="nh"><div><b>Maintenance mode</b><small>Shows a &ldquo;Back soon&rdquo; page in place of every page, TV screen, calendar and data call. Only this Admin page and the PIN pages stay open.</small></div><label class="tg"><input type="checkbox" id="mon"${m.on ? " checked" : ""}><span></span></label></div>
<div id="mpr" hidden style="margin-top:10px"><div class="l">Enter the club PIN to switch maintenance mode on</div><input class="in" id="mpin" type="password" inputmode="numeric" autocomplete="off" maxlength="40" placeholder="Club PIN" style="max-width:220px"></div>
<div class="l">Pun line</div><select class="in" id="mpun"><option value="random"${m.pun === "random" ? " selected" : ""}>Random each visit</option>${m.lines.map(x => `<option value="${ea(x)}"${m.pun === x ? " selected" : ""}>${ea(x)}</option>`).join("")}<option value="none"${m.pun === "none" ? " selected" : ""}>None (leave the line out)</option></select>
<div class="l">Extra line for visitors <span>(optional, e.g. a return time)</span></div><input class="in" id="mex" maxlength="120" autocomplete="off" placeholder="e.g. Back around 8pm tonight" value="${ea(m.extra)}"><div class="cnt" id="mxc"></div>
<div class="save" style="margin-top:10px"><button type="button" class="btn" id="mlb" style="background:#26312d;color:#e6efe9">Manage lines</button><a class="btn" id="mpv" href="/maintenance-preview" target="_blank" rel="noopener" style="background:#26312d;color:#e6efe9;text-decoration:none">Preview page</a></div>
<p class="n" id="mwarn" style="margin:10px 0 0;background:#3a2f12;color:#f0c870;border-radius:10px;padding:9px 12px">While this is on, team pages, Fixtures, TV screens, calendars and links all show the maintenance page. Clubhouse screens will show it too until you switch it off. Press Save changes to apply, then switch off and save again when you are done.</p></div>
<div class="nb" id="mlc" hidden><div class="nh"><div><b>Manage pun lines</b><small>Up to 20 lines, 100 characters each. Press Save changes to keep your edits.</small></div></div><div id="mll"></div>
<div style="display:flex;gap:8px;margin-top:10px"><input class="in" id="mnl" maxlength="100" autocomplete="off" placeholder="Add a new line" style="margin:0;flex:1"><button type="button" class="btn" id="mad">Add</button></div>
<div class="cnt" id="mcn"></div><div class="save" style="margin-top:8px"><button type="button" class="btn" id="mrs" style="background:#26312d;color:#e6efe9">Restore the default lines</button></div></div>
</div>
<div class="save"><button type="button" class="btn" id="as">Save changes</button><span class="n" id="am" aria-live="polite">${s.savedAt ? "Last saved " + ea(ukStamp(s.savedAt)) + " UK time" : "Not saved yet: the site is using the defaults."}</span></div>
</fieldset></form>
<p class="ver">${VERSION_LABEL}${isDev ? " &middot; DEV settings" : ""} &middot; <a href="/club-signout" style="color:inherit">Sign out</a></p></div>
${themeToggleScript}
<script>(function(){var $=function(i){return document.getElementById(i)};if(!$("as"))return;
function radio(n){var e=document.querySelector('input[name="'+n+'"]:checked');return e?e.value:""}
function vis(){$("tw").hidden=radio("ta")!=="chosen"}
[].forEach.call(document.querySelectorAll('input[name="ta"]'),function(e){e.addEventListener("change",vis)});vis();
function cnt(i,o,n){var e=$(i);function u(){$(o).textContent=e.value.length+" / "+n}e.addEventListener("input",u);u()}cnt("ht","hc",200);cnt("tt","tc2",120);
var DEFL=${JSON.stringify(MAINT_LINES_DEFAULT).replace(/</g, "\\u003c")};var lines=${JSON.stringify(m.lines).replace(/</g, "\\u003c")};
function rl(){var h="";lines.forEach(function(x,i){h+='<div style="display:flex;gap:8px;margin-top:6px"><input class="in ml" data-i="'+i+'" maxlength="100" style="margin:0;flex:1" value="'+x.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'"><button type="button" class="btn md" data-i="'+i+'" style="background:#26312d;color:#e6efe9;padding:8px 14px">Delete</button></div>'});$("mll").innerHTML=h;$("mcn").textContent=lines.length+" of 20 lines used";var sel=$("mpun"),cur=sel.value,o='<option value="random">Random each visit</option>';lines.forEach(function(x){o+='<option></option>'});sel.innerHTML=o;[].forEach.call(sel.options,function(op,i){if(i>0){op.value=lines[i-1];op.textContent=lines[i-1]}});var n=document.createElement("option");n.value="none";n.textContent="None (leave the line out)";sel.appendChild(n);sel.value=cur;if(sel.value!==cur)sel.value="random"}
function sync(){[].forEach.call(document.querySelectorAll(".ml"),function(e){lines[+e.getAttribute("data-i")]=e.value})}
$("mll").addEventListener("click",function(e){var b=e.target.closest(".md");if(!b)return;sync();lines.splice(+b.getAttribute("data-i"),1);rl()});
$("mll").addEventListener("change",function(){var c=$("mpun").value;sync();rl();$("mpun").value=c;if($("mpun").value!==c)$("mpun").value="random"});
$("mpv").addEventListener("click",function(){sync();var u="/maintenance-preview?pun="+encodeURIComponent($("mpun").value)+"&extra="+encodeURIComponent($("mex").value);lines.forEach(function(x){u+="&l="+encodeURIComponent(x)});$("mpv").href=u});
$("mlb").addEventListener("click",function(){$("mlc").hidden=!$("mlc").hidden});
$("mad").addEventListener("click",function(){var v=$("mnl").value.replace(/\s+/g," ").trim();if(!v||lines.length>=20||lines.indexOf(v)>=0)return;sync();lines.push(v);$("mnl").value="";rl()});
$("mrs").addEventListener("click",function(){lines=DEFL.slice();rl()});
rl();cnt("mex","mxc",120);var wasOn=$("mon").checked;function pv(){$("mpr").hidden=!($("mon").checked&&!wasOn)}$("mon").addEventListener("change",pv);pv();
$("as").addEventListener("click",function(){sync();var b=$("as"),m=$("am");b.disabled=true;m.textContent="Saving...";
var teams=[].map.call(document.querySelectorAll(".tc:checked"),function(e){return e.value});
var body={notices:{home:{on:$("hon").checked,text:$("ht").value,style:radio("hs"),until:$("hu").value},tv:{on:$("ton").checked,text:$("tt").value,style:radio("ts"),applies:radio("ta"),teams:teams,until:$("tu").value}},features:{around:$("fa").checked,weather:$("fw").checked,checked:$("fc").checked,wocolour:$("fo").checked,webfallback:$("fb").checked,count:$("fv").checked,screens:$("fs").checked,powered:$("fp").checked},reporting:{days:radio("rd")},pin:$("mpin").value,maintenance:{on:$("mon").checked,pun:$("mpun").value,extra:$("mex").value,lines:lines},signin:{days:radio("sd")},matchCentre:{layout:radio("ml")}};
fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.json().catch(function(){return{ok:false}})}).then(function(j){b.disabled=false;m.style.color="";if(j&&j.ok){wasOn=$("mon").checked;$("mpin").value="";pv();m.textContent="Saved "+j.label+" UK time. Screens update within about a minute."}else{if(j&&j.needPin){$("mpr").hidden=false;$("mpin").focus()}m.style.color="#f09595";m.textContent=(j&&j.error)||"Sorry, that did not save. Try again."}}).catch(function(){b.disabled=false;m.style.color="#f09595";m.textContent="Sorry, that did not save. Check your connection."})});
})();</script>
</body></html>`;
}

// Maintenance page (v3.17): centred, dark, nothing club-specific. Never cached, never indexed.
function maintenancePage(m, preview) {
  const e = x => String(x == null ? "" : x).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let pun = "";
  if (m.pun === "none") pun = "";
  else if (m.pun !== "random" && m.lines.includes(m.pun)) pun = m.pun;
  else if (m.lines.length) pun = m.lines[Math.floor(Math.random() * m.lines.length)];
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow">${preview ? "" : '<meta http-equiv="refresh" content="60">'}<title>Back soon - The Stats Board</title>
<style>*{box-sizing:border-box}html,body{height:100%;margin:0}body{background:#0b1110;color:#e6efe9;font-family:Arial,Helvetica,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px}
.w{max-width:620px;width:100%}.lb{font-size:13px;letter-spacing:.32em;font-weight:700;color:#7fd19a}svg{width:min(320px,70vw);height:auto;margin:22px auto 8px;display:block}
h1{font-size:clamp(44px,12vw,84px);margin:6px 0 4px;letter-spacing:-.02em}.u{font-size:clamp(16px,3.6vw,22px);color:#91a49a}.p{font-size:clamp(17px,3.8vw,24px);font-style:italic;color:#e8c26a;margin:18px 0 0}
.x{display:inline-block;margin-top:20px;padding:9px 20px;border-radius:99px;background:#16201c;border:1px solid #2c3a34;color:#cfd8d3;font-size:clamp(14px,3.3vw,18px)}.pv{position:fixed;top:0;left:0;right:0;background:#3a2f12;color:#f0c870;font-size:13px;padding:6px}</style></head><body>${preview ? '<div class="pv">Preview only: visitors see this page while maintenance mode is on.</div>' : ""}<div class="w"><div style="display:flex;justify-content:center;color:#fff">${sbWordmark(false)}</div>
<svg viewBox="0 0 320 190" aria-hidden="true"><g stroke="#e8c26a" stroke-width="5" stroke-linecap="round" fill="none"><path d="M60 150V50M110 150V50M60 90h50"/><path d="M210 150V50M260 150V50M210 90h50"/></g><g fill="#e8c26a"><rect x="48" y="150" width="74" height="8" rx="3"/><rect x="198" y="150" width="74" height="8" rx="3"/></g>
<path d="M85 140Q160 10 235 140" stroke="#7fd19a" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round" fill="none"/><ellipse cx="160" cy="62" rx="17" ry="11" fill="#8a5a2b" transform="rotate(-20 160 62)"/><path d="M148 66l24-8" stroke="#e6efe9" stroke-width="1.6"/>
<g fill="#2f9d57"><rect x="130" y="170" width="14" height="14" rx="3"/><rect x="153" y="162" width="14" height="22" rx="3"/><rect x="176" y="154" width="14" height="30" rx="3"/></g></svg>
<h1>Back soon</h1><div class="u">Undergoing maintenance</div>${pun ? `<div class="p">${e(pun)}</div>` : ""}${m.extra ? `<div class="x">${e(m.extra)}</div>` : ""}</div></body></html>`;
  return new Response(body, { status: preview ? 200 : 503, headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "Retry-After": "600" } });
}
// Returns a Response when maintenance mode should answer this request, else null.
async function maintenanceGate(request) {
  const url = new URL(request.url), path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/maintenance-preview") {
    // Preview shows what is on the Admin form right now (saved or not): pun, extra and lines arrive as query parameters.
    const m = JSON.parse(JSON.stringify((await siteSettings()).maintenance)), q = url.searchParams, cl = (x, n) => String(x || "").replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
    if (q.has("pun")) {
      const ls = q.getAll("l").map(x => cl(x, 100)).filter(Boolean).slice(0, 20); if (q.has("l")) m.lines = ls;
      const pk = cl(q.get("pun"), 100); m.pun = pk === "random" || pk === "none" || m.lines.includes(pk) ? pk : "random";
      m.extra = cl(q.get("extra"), 120);
    }
    return maintenancePage(m, true);
  }
  if (["/admin", "/api/admin", "/unlock", "/club-unlock", "/club-signout", "/manifest.webmanifest"].includes(path) || isIconPath(path)) return null;
  const st = await siteSettings();
  if (!st.maintenance.on) return null;
  const data = path === "/calendar.ics" || path.startsWith("/api/") || url.searchParams.has("format");
  if (data) return new Response("The Stats Board is undergoing maintenance. Back soon.", { status: 503, headers: { "Content-Type": "text/plain;charset=utf-8", "Cache-Control": "no-store", "Retry-After": "600", "X-Robots-Tag": "noindex" } });
  return maintenancePage(st.maintenance, false);
}
// ---- Admin match sheet (v3.22) -------------------------------------------------------------------------------
// Team sheets (who played) and scorers for a game, read from the RFU data service. Admin only (club PIN).
// Only the fields below are ever copied out of the feed: the staff who entered the data (creator, updater, who recorded
// the result) and the people's own ID numbers are never read into the page.
const SHEET_U18_RE = /\bU\s?(1[0-9]|[0-9])s?\b|colts|junior|youth|\bmini\b|\bmidi\b/i;
const sheetHidesNames = text => SHEET_U18_RE.test(String(text || ""));
async function sheetJson(target) {
  try { const r = await cachedText(target, "application/json"); return r.ok ? JSON.parse(r.text) : null; } catch (_) { return null; }
}
function sheetOrder(no) { const n = String(no || ""); return /^\d+$/.test(n) ? +n : /^S\d+$/i.test(n) ? 15 + +n.slice(1) : 99; }
async function matchSheetFor(g, hideTeam) {
  const id = String(g.id || "");
  if (!/^\d{1,10}$/.test(id)) return null;
  const [rec, ppl, evs] = await Promise.all([
    sheetJson("https://cluster.england-rfu.com/gms/matches/" + id),
    sheetJson("https://cluster.england-rfu.com/gms/matchparticipants?matchId=" + id),
    sheetJson("https://cluster.england-rfu.com/gms/matchevents?matchId=" + id)
  ]);
  if (!rec) return { g, error: true };
  const hideSide = hideTeam || sheetHidesNames((rec.competitionName || "") + " " + (rec.groupName || ""));
  const sideName = { [rec.homeTeamId]: rec.homeClubName || rec.homeTeamName || "Home", [rec.awayTeamId]: rec.awayClubName || rec.awayTeamName || "Away" };
  const nameOf = (p, hide) => hide || p.isU18 === true ? "" : (p.hasDisclosure === true || /name withheld/i.test(String(p.lastName || ""))) ? "Name withheld" : [p.firstName, p.lastName].map(x => String(x || "").trim()).filter(Boolean).join(" ");
  const list = Array.isArray(ppl && ppl.participants) ? ppl.participants : [];
  const mk = teamId => list.filter(p => String(p.teamId) === String(teamId)).map(p => ({
    pid: p.id, no: String(p.playingPositionNo || ""), pos: String(p.description || ""), name: nameOf(p, hideSide), hidden: !!(hideSide || p.isU18 === true),
    started: p.startedMatch !== false,
    tag: p.subMatchRole && p.subMatchRole.value === "CPTAIN" ? "Captain" : p.subMatchRole && p.subMatchRole.value === "VCPTAIN" ? "Vice captain" : ""
  })).sort((a, b) => sheetOrder(a.no) - sheetOrder(b.no));
  const home = mk(rec.homeTeamId), away = mk(rec.awayTeamId);
  const byPid = new Map(list.map(p => [p.id, p]));
  const events = (Array.isArray(evs) ? evs : []).filter(x => x && x.eventType && /SCORE|CARD|SUB/i.test(String(x.eventType.value || ""))).map(x => {
    const sub = String((x.eventSubType && x.eventSubType.value) || "");
    const what = /SCORETRY$/.test(sub) ? "Try" : /SCORECONV_MISS$/.test(sub) ? "Conversion missed" : /SCORECONV$/.test(sub) ? "Conversion" : String((x.eventSubType && x.eventSubType.display) || (x.eventType && x.eventType.display) || "Event");
    const pl = byPid.get(x.matchParticipantId) || { firstName: x.firstName, lastName: x.lastName, hasDisclosure: x.hasDisclosure, isU18: x.isU18 };
    return { min: Number(x.duration) || 0, what, kind: /^Try$/.test(what) ? "try" : /^Conversion$/.test(what) ? "conv" : "other", team: sideName[x.teamId] || String(x.teamName || ""), no: String(x.playingPosition || ""), name: nameOf(pl, hideSide) };
  }).sort((a, b) => a.min - b.min);
  const hs = Number(rec.homeFullTimeScore), as = Number(rec.awayFullTimeScore);
  return {
    g, ok: true, hideSide, homeName: rec.homeClubName || rec.homeTeamName || "Home", awayName: rec.awayClubName || rec.awayTeamName || "Away",
    score: Number.isFinite(hs) && Number.isFinite(as) && rec.homeFullTimeScore !== null && rec.awayFullTimeScore !== null ? hs + "–" + as : "",
    submitted: !!(ppl && ppl.lineup) && (home.length + away.length) > 0, home, away, events
  };
}
function matchSheetPage(theme, isDev, teams, sel, d) {
  const t = theme === "light" ? "light" : "dark", ee = noticeEsc;
  const tm = teams[sel];
  const tab = (x, i) => `<a class="tab${i === sel ? " on" : ""}" href="/matchsheet?t=${i}${t === "light" ? "&theme=light" : ""}">${ee(x.short || x.name)}${sheetHidesNames(x.name + " " + x.league + " " + x.teamName) ? ' <small>names hidden</small>' : ""}</a>`;
  const squad = (name, rows, hasSheet, who) => `<div class="sq"><div class="sqh">${ee(name)}</div>${rows.length ? rows.map(r => `<div class="pr"><span class="no">${ee(r.no)}</span><span class="pn"><b>${ee(r.name)}</b>${r.name ? " " : ""}<small>${ee(r.pos)}</small></span><span class="tg2">${ee(r.tag)}</span></div>`).join("") : `<div class="none">${ee(who)} sheet not in yet.</div>`}</div>`;
  const status = m => !m ? "" : m.submitted ? `<span class="chip ok">Sheets in</span>` : `<span class="chip">Not submitted yet</span>`;
  const head = (kind, m, g) => `<div class="kk">${kind}${g && g.dateLabel ? " &middot; " + ee(g.dateLabel) : ""}${g && g.comp ? " &middot; " + ee(g.comp) : ""}</div><div class="ti">${m && m.ok ? ee(m.homeName) + (m.score ? " " + ee(m.score) + " " : " v ") + ee(m.awayName) : g ? "v " + ee(g.oppName) : ""}</div>`;
  const block = (kind, m, g, withEvents) => {
    if (!g) return `<section class="card"><div class="kk">${kind}</div><div class="none">No ${kind.toLowerCase()} found in this season's fixtures.</div></section>`;
    if (!m || m.error) return `<section class="card">${head(kind, m, g)}<div class="none">The RFU match record could not be read just now. This page tries again on every refresh.</div></section>`;
    const sheets = m.submitted
      ? `<div class="sqs">${squad(m.homeName, m.home, m.submitted, m.homeName)}${squad(m.awayName, m.away, m.submitted, m.awayName)}</div>`
      : `<div class="wait"><span class="dot"></span><div><b>Team sheet not submitted yet</b><small>Clubs usually enter sheets one to two days before kick-off, and the opposition's sometimes on the morning of the game. This page checks every few minutes.</small></div></div>`;
    const ev = withEvents && m.events.length ? `<div class="kk" style="margin-top:14px">Scoring &middot; events recorded by the clubs that enter them</div><div class="evs">${m.events.map(x => `<div class="ev"><span class="mn">${x.min}'</span><span class="${x.kind}">${ee(x.what)}</span><span class="who">${ee(x.team)}${x.no ? " &middot; " + ee(x.no) : ""}${x.name ? " &middot; " + ee(x.name) : ""}</span></div>`).join("")}</div>` : "";
    return `<section class="card"><div class="top">${head(kind, m, g)}${status(m)}</div>${sheets}${ev}</section>`;
  };
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="300"><title>Match sheet</title>
<style>
:root{--bg:#080b0d;--card:#111719;--bd:#26312d;--tx:#f2f6f4;--mu:#9fb0a8;--ac:#4fc27d;--am:#e8c26a;--in:#0c1113}
body.light{--bg:#eef2ef;--card:#fff;--bd:#cbd8ce;--tx:#18221c;--mu:#53665a;--ac:#1d6b3a;--am:#7a4d06;--in:#f3f7f4}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font-family:Arial,Helvetica,sans-serif;padding:max(16px,env(safe-area-inset-top)) 16px 32px}
.wrap{max-width:1100px;margin:0 auto}h1{margin:.2em 0 .5em;font-size:1.9rem}.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}
.tab{min-height:44px;display:flex;align-items:center;gap:6px;padding:0 16px;border-radius:10px;border:1px solid var(--bd);color:var(--tx);text-decoration:none;font-weight:600}.tab.on{background:var(--ac);border-color:var(--ac);color:#07100b;font-weight:700}.tab small{color:var(--mu);font-weight:400}.tab.on small{color:#07100b}
.note{border-radius:12px;background:#1d1a0c;border:1px solid #5b4b1a;color:#e8c26a;padding:12px 16px;font-size:.95rem;line-height:1.5;margin-bottom:14px}body.light .note{background:#fbecc8;border-color:#e0c06a;color:#7a4d06}
.card{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:18px;margin-bottom:14px}.top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
.kk{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);font-weight:700}.ti{font-size:1.5rem;font-weight:800;line-height:1.4;margin:.15em 0 .4em}
.chip{border:1px solid var(--bd);border-radius:6px;padding:3px 10px;font-weight:700;font-size:.85rem;color:var(--mu)}.chip.ok{background:var(--ac);border-color:var(--ac);color:#07100b}
.wait{display:flex;gap:12px;align-items:flex-start;background:var(--in);border-radius:12px;padding:14px;margin-top:8px}.wait b{display:block}.wait small{display:block;color:var(--mu);line-height:1.5;margin-top:4px}.dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--mu);flex:none;margin-top:4px}
.sqs{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:8px}.sqh{font-weight:800;padding-bottom:8px;border-bottom:2px solid var(--ac)}
.pr{display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:center;min-height:32px;border-bottom:1px solid var(--bd);font-size:.95rem}.no{font-weight:700;color:var(--mu)}.pn small{color:var(--mu)}.tg2{font-size:.8rem;font-weight:700;color:var(--am)}
.none{color:var(--mu);padding:10px 0;line-height:1.5}
.evs{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:0 28px}.ev{display:grid;grid-template-columns:44px 140px 1fr;gap:8px;align-items:center;min-height:34px;border-bottom:1px solid var(--bd);font-size:.92rem}.mn{font-weight:700;color:var(--mu)}.try{font-weight:700;color:var(--ac)}.conv{font-weight:700;color:var(--am)}.other{font-weight:700;color:var(--mu)}.who{color:var(--tx)}
.ft{color:var(--mu);font-size:.85rem;margin-top:10px;line-height:1.5}
</style></head><body class="${t}"><div class="wrap">
<div class="kk">Admin</div><h1>Match sheet</h1>
<div class="tabs">${teams.map(tab).join("")}</div>
<div class="note">Admin only. Player names never appear on a public screen, a TV board or any link without the club PIN. Under-18 teams and any player the RFU marks as under 18 are shown by shirt number and position only. "Name withheld" is shown exactly as the RFU supplies it.</div>
${block("Next game", d.next, d.nextG, false)}
${block("Last game", d.last, d.lastG, true)}
<div class="ft">Last checked ${londonTime(Date.now())}. This page refreshes every five minutes. Scorers are only listed for clubs that enter match events, so a side with no events listed has not recorded them.</div>
</div></body></html>`;
}
async function adminApi(request, url) {
  const H = { "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  const J = (o, st) => new Response(JSON.stringify(o), { status: st || 200, headers: H });
  if (request.method !== "POST") return J({ ok: false, error: "Use the Admin page." }, 405);
  const kv = kvOf();
  if (!kv) return J({ ok: false, error: "Settings storage is not connected (no SETTINGS binding)." }, 503);
  const origin = request.headers.get("Origin");
  if (origin) { let oh = ""; try { oh = new URL(origin).host; } catch (_) { oh = ""; } if (oh !== url.host) return J({ ok: false, error: "Not allowed." }, 403); }
  let b = null;
  try { const raw = await request.text(); if (raw.length > 20000) return J({ ok: false, error: "Too much data." }, 413); b = JSON.parse(raw); } catch (_) { b = null; }
  if (!b || typeof b !== "object") return J({ ok: false, error: "That did not look right. Reload the page and try again." }, 400);
  const s = cleanSettings(b); s.savedAt = new Date().toISOString();
  // Switching maintenance mode ON needs the club PIN typed again (it takes the whole site offline).
  { let was = false; try { const old = await kv.get(SETTINGS_KEY, { type: "json" }); was = cleanSettings(old).maintenance.on; } catch (_) { was = SETTINGS_CACHE.v ? SETTINGS_CACHE.v.maintenance.on : false; }
    const pin = SITE_ENV && typeof SITE_ENV.CLUB_PIN === "string" ? SITE_ENV.CLUB_PIN.trim() : "";
    if (s.maintenance.on && !was && pin) {
      const given = typeof b.pin === "string" ? b.pin.trim() : "";
      { const lk = await lockSecs(request, "club"); if (lk > 0) { await usagePinFail(request, "club-lock"); return J({ ok: false, needPin: true, error: lockMsg(lk) + " Maintenance mode was not switched on." }, 429); } }
      if (!(await pinOk(given, pin))) {
        if (given) { await usagePinFail(request, "club"); const f = await lockFail(request, "club"); await pinDelay(); if (f.locked) return J({ ok: false, needPin: true, error: lockMsg(f.secs) + " Maintenance mode was not switched on." }, 429); }
        return J({ ok: false, needPin: true, error: given ? "That PIN was not right. Maintenance mode was not switched on." : "Enter the club PIN to switch maintenance mode on." }, 403);
      }
      await lockClear(request, "club");
    } }
  try { await kv.put(SETTINGS_KEY, JSON.stringify(s)); } catch (_) { return J({ ok: false, error: "Could not save to settings storage. Try again." }, 502); }
  SETTINGS_CACHE = { at: Date.now(), v: s };
  return J({ ok: true, savedAt: s.savedAt, label: ukStamp(s.savedAt) });
}

// Visit counting and the Usage page (v3.10). Each counted request writes one data point to a Cloudflare Workers Analytics
// Engine dataset (binding USAGE). No cookies, no IP addresses and no typed search text are stored. A person is counted once a
// day by a one-way code made from IP + browser + date + a secret, which cannot be reversed or linked from one day to the next.
// The Usage page (/usage, club PIN) reads the data back through the Cloudflare SQL API (CF_ACCOUNT_ID and CF_API_TOKEN secrets).
const USAGE_DATASET = "stats_board_usage";
// Every counted record is tagged with the club AND whether it came from the live site or a test site (one that has ENV_LABEL set),
// so a test project and the live project can share one dataset without mixing their numbers.
const usageScope = () => CLUB_ID + (SITE_ENV && typeof SITE_ENV.ENV_LABEL === "string" && SITE_ENV.ENV_LABEL.trim() ? "|test" : "|live");
const USAGE_BOT = /bot|crawl|spider|slurp|preview|monitor|uptime|pingdom|curl|wget|python|node-fetch|axios|go-http|java\/|headless|lighthouse|facebookexternalhit|whatsapp|telegram|discord|slack/i;
function usageClassify(request, url) {
  if (request.method !== "GET") return null;
  const p = url.pathname.replace(/\/+$/, "") || "/", q = url.searchParams, ua = request.headers.get("User-Agent") || "";
  if (!ua || USAGE_BOT.test(ua)) return null;
  let kind = "", view = "";
  if (p === "/calendar.ics") { kind = "cal"; view = "calendar"; }
  else if (p === "/docs" || p === "/admin" || p === "/usage" || (p === "/" && q.get("view") === "teams") || p === "/teams") { kind = "club"; view = p === "/" || p === "/teams" ? "links" : p.slice(1); }
  else if (p === "/api/builder/search") { kind = "search"; view = "search"; } // counted only; the typed text is never read
  else if (p === "/api/builder/team") { kind = "pick"; view = "pick"; }
  else if (p === "/") {
    if (q.get("format") || q.get("embed") === "1" || q.get("app") === "1") return null; // data and embedded fetches, not visits
    view = q.get("view") || (q.has("team") ? "team" : "home");
    if (view === "teams" || view === "notes" || view === "version") return null;
    kind = q.get("layout") === "tv" || view === "stack" ? "tv" : "page";
  } else return null;
  const screen = String(q.get("screen") || "").replace(/[^A-Za-z0-9 _.\-]/g, "").trim().slice(0, 24); // v3.24: optional label for a club screen, chosen by the club
  const team = String(kind === "pick" ? q.get("team") || q.get("id") || "" : q.get("team") || "").slice(0, 12); // v3.23.2: the builder sends team=, not id=
  const known = TEAMS.some(t => String(t.team) === team);
  const dev = /iPad|Tablet|Kindle/i.test(ua) || (/Macintosh/.test(ua) && /Mobile/.test(ua)) ? "tablet" : /Mobi|iPhone|Android/i.test(ua) ? "phone" : "computer";
  return { kind, view: view.slice(0, 16), team, teamName: String(q.get("friendlyName") || q.get("teamName") || "").replace(/[\u0000-\u001f<>]/g, "").slice(0, 40), comp: String(q.get("competition") || "").slice(0, 8), div: String(q.get("division") || "").slice(0, 8), known: known ? "1" : "0", device: kind === "cal" ? "calendar" : dev, ua, screen: kind === "tv" ? screen : "" };
}
async function usagePinFail(request, which) {
  try {
    const ds = SITE_ENV && SITE_ENV.USAGE;
    if (!ds || typeof ds.writeDataPoint !== "function") return;
    if ((await siteSettings()).features.count === false) return; // robots are NOT filtered here: a guessing bot is what this is for
    const ua = request.headers.get("User-Agent") || "", day = new Date().toISOString().slice(0, 10), salt = String(SITE_ENV.USAGE_SALT || SITE_ENV.CLUB_PIN || "sb");
    const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode([request.headers.get("CF-Connecting-IP") || "", ua, day, salt].join("|")));
    const who = Array.from(new Uint8Array(h)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join(""), cf = request.cf || {};
    ds.writeDataPoint({ indexes: [usageScope()], blobs: [usageScope(), "pinfail", which, "", "", "", "", "", String(cf.country || ""), String(cf.region || "").slice(0, 40), "", who], doubles: [1] });
  } catch (_) { /* counting never breaks the PIN page */ }
}
// v3.20: security events (kind "sec"): blob3 = what happened ("badreq" or "slow"), blob4 = which part of the address was wrong
// (the NAME of the part, never the value). Like pinfail rows: a one-way daily source code, country and county. Robots included.
async function usageSec(request, type, part) {
  try {
    const ds = SITE_ENV && SITE_ENV.USAGE;
    if (!ds || typeof ds.writeDataPoint !== "function") return;
    if ((await siteSettings()).features.count === false) return;
    const ua = request.headers.get("User-Agent") || "", day = new Date().toISOString().slice(0, 10), salt = String(SITE_ENV.USAGE_SALT || SITE_ENV.CLUB_PIN || "sb");
    const who = (await sbSha([request.headers.get("CF-Connecting-IP") || "", ua, day, salt].join("|"))).slice(0, 16), cf = request.cf || {};
    ds.writeDataPoint({ indexes: [usageScope()], blobs: [usageScope(), "sec", String(type).slice(0, 12), String(part).slice(0, 16), "", "", "", "", String(cf.country || ""), String(cf.region || "").slice(0, 40), "", who], doubles: [1] });
  } catch (_) { /* counting never breaks a request */ }
}
async function usageRecord(request, url, ms, status, hit) {
  const ds = SITE_ENV && SITE_ENV.USAGE;
  if (!ds || typeof ds.writeDataPoint !== "function") return;
  const c = usageClassify(request, url); if (!c) return;
  const st = await siteSettings();
  if (st.features.count === false || (c.kind === "tv" && st.features.screens === false)) return;
  const day = new Date().toISOString().slice(0, 10), salt = String(SITE_ENV.USAGE_SALT || SITE_ENV.CLUB_PIN || "sb");
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode([request.headers.get("CF-Connecting-IP") || "", c.ua, day, salt].join("|")));
  const who = Array.from(new Uint8Array(h)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
  const cf = request.cf || {};
  ds.writeDataPoint({ indexes: [usageScope()], blobs: [usageScope(), c.kind, c.view, c.team, c.teamName, c.comp, c.div, c.device, String(cf.country || ""), String(cf.region || "").slice(0, 40), c.known, who, String(status || ""), hit ? "hit" : "miss", c.screen || ""], doubles: [1, Math.max(1, Math.round(ms || 0))] });
}
async function usageQuery(sql) {
  const id = SITE_ENV.CF_ACCOUNT_ID, tok = SITE_ENV.CF_API_TOKEN;
  const r = await fetch("https://api.cloudflare.com/client/v4/accounts/" + encodeURIComponent(id) + "/analytics_engine/sql", { method: "POST", headers: { "Authorization": "Bearer " + tok }, body: sql });
  if (!r.ok) throw new Error("Cloudflare returned HTTP " + r.status);
  const j = await r.json(); return Array.isArray(j.data) ? j.data : [];
}
async function usageApi(url) {
  const st = await siteSettings();
  const H = { "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  const J = (o, st) => new Response(JSON.stringify(o), { status: st || 200, headers: H });
  const hasBind = !!(SITE_ENV.USAGE && typeof SITE_ENV.USAGE.writeDataPoint === "function"), hasKey = !!(SITE_ENV.CF_ACCOUNT_ID && SITE_ENV.CF_API_TOKEN);
  if (!hasBind || !hasKey) return J({ ok: false, setup: { binding: hasBind, key: hasKey } });
  const days = [1, 7, 14, 30, 90].includes(Number(url.searchParams.get("days"))) ? Number(url.searchParams.get("days")) : st.reporting.days;
  // Cloudflare's 100,000 a day limit restarts at midnight UTC, so "today" and the limit figure both count from then.
  // If the database refuses the start-of-day maths, fall back to a rolling 24 hours and say so on the page.
  const dayStart = await usageQuery(`SELECT toStartOfInterval(NOW(), INTERVAL '1' DAY) AS s FROM ${USAGE_DATASET} WHERE blob1 = '${usageScope()}' LIMIT 1`).then(() => true, () => false);
  const sinceExpr = days === 1 ? (dayStart ? "toStartOfInterval(NOW(), INTERVAL '1' DAY)" : "NOW() - INTERVAL '1' DAY") : "NOW() - INTERVAL '" + days + "' DAY";
  const limSince = dayStart ? "toStartOfInterval(NOW(), INTERVAL '1' DAY)" : "NOW() - INTERVAL '1' DAY";
  const bucket = days === 1 && dayStart ? "toStartOfInterval(timestamp, INTERVAL '1' HOUR)" : "toDate(timestamp)";
  const W = `FROM ${USAGE_DATASET} WHERE blob1 = '${usageScope()}' AND timestamp > ${sinceExpr}`;
  try {
    const [perDay, tot, pages, teams, devs, others, srch, today, tvDay, tvPages, clubPg, pinDay, pinWhere, spPages, spUp, spDay, secDay, secWhere, scr] = await Promise.all([
      usageQuery(`SELECT ${bucket} AS d, COUNT(DISTINCT blob12) AS people ${W} AND blob2 = 'page' GROUP BY d ORDER BY d`),
      usageQuery(`SELECT blob2 AS kind, COUNT(DISTINCT blob12) AS who, SUM(_sample_interval) AS n ${W} GROUP BY kind`),
      usageQuery(`SELECT blob3 AS view, SUM(_sample_interval) AS n ${W} AND blob2 = 'page' GROUP BY view ORDER BY n DESC LIMIT 12`),
      usageQuery(`SELECT blob4 AS team, blob5 AS name, SUM(_sample_interval) AS n ${W} AND blob2 IN ('page','tv') AND blob11 = '1' GROUP BY team, name ORDER BY n DESC LIMIT 20`),
      usageQuery(`SELECT blob8 AS device, COUNT(DISTINCT blob12) AS who ${W} AND blob2 = 'page' GROUP BY device`),
      usageQuery(`SELECT blob4 AS team, blob5 AS name, blob6 AS comp, blob7 AS div, blob10 AS region, blob9 AS country, SUM(_sample_interval) AS n ${W} AND blob2 IN ('page','tv','pick') AND blob11 = '0' AND blob4 != '' GROUP BY team, name, comp, div, region, country ORDER BY n DESC LIMIT 25`),
      usageQuery(`SELECT blob2 AS kind, SUM(_sample_interval) AS n ${W} AND blob2 IN ('search','pick') GROUP BY kind`),
      usageQuery(`SELECT SUM(_sample_interval) AS n FROM ${USAGE_DATASET} WHERE blob1 = '${usageScope()}' AND blob2 NOT IN ('up', 'pinfail', 'sec') AND timestamp > ${limSince}`),
      usageQuery(`SELECT ${bucket} AS d, SUM(_sample_interval) AS loads, COUNT(DISTINCT blob12) AS screens ${W} AND blob2 = 'tv' GROUP BY d ORDER BY d`),
      usageQuery(`SELECT toDate(timestamp) AS d, blob3 AS view, blob4 AS team, blob5 AS name, blob11 AS known, COUNT(DISTINCT blob12) AS screens, SUM(_sample_interval) AS loads ${W} AND blob2 = 'tv' GROUP BY d, view, team, name, known LIMIT 2000`),
      usageQuery(`SELECT blob3 AS view, SUM(_sample_interval) AS n, COUNT(DISTINCT blob12) AS who ${W} AND blob2 = 'club' GROUP BY view`),
      usageQuery(`SELECT toDate(timestamp) AS d, blob3 AS which, SUM(_sample_interval) AS n, COUNT(DISTINCT blob12) AS sources ${W} AND blob2 = 'pinfail' GROUP BY d, which ORDER BY d`),
      usageQuery(`SELECT blob10 AS region, blob9 AS country, SUM(_sample_interval) AS n ${W} AND blob2 = 'pinfail' GROUP BY region, country ORDER BY n DESC LIMIT 5`),
      // Speed figures are extra: if one of these queries is refused only the Speed panel is lost, not the whole page.
      usageQuery(`SELECT blob3 AS view, blob2 AS kind, SUM(_sample_interval) AS n, quantileWeighted(0.5)(double2, _sample_interval) AS p50, quantileWeighted(0.95)(double2, _sample_interval) AS p95, SUM(IF(double2 > 2000, _sample_interval, 0)) AS slow, SUM(IF(blob14 = 'hit', _sample_interval, 0)) AS hits ${W} AND blob2 IN ('page', 'tv') AND double2 > 0 GROUP BY view, kind ORDER BY n DESC LIMIT 15`).catch(() => null),
      usageQuery(`SELECT blob3 AS src, SUM(_sample_interval) AS n, quantileWeighted(0.5)(double2, _sample_interval) AS p50, quantileWeighted(0.95)(double2, _sample_interval) AS p95, SUM(IF(blob4 != 'ok', _sample_interval, 0)) AS bad, SUM(IF(blob5 = 'wait', _sample_interval, 0)) AS waited ${W} AND blob2 = 'up' GROUP BY src ORDER BY n DESC LIMIT 10`).catch(() => null),
      // v3.16.3: outside fetches per day (or per hour for Today), by source, so a fall in website calls can be seen.
      usageQuery(`SELECT ${bucket} AS d, blob3 AS src, SUM(_sample_interval) AS n, SUM(IF(blob4 != 'ok', _sample_interval, 0)) AS bad ${W} AND blob2 = 'up' GROUP BY d, src ORDER BY d LIMIT 2000`).catch(() => null),
      // v3.20: address checks. Extra: if refused, only this card is lost.
      usageQuery(`SELECT toDate(timestamp) AS d, blob3 AS type, blob4 AS part, SUM(_sample_interval) AS n, COUNT(DISTINCT blob12) AS sources ${W} AND blob2 = 'sec' GROUP BY d, type, part ORDER BY d LIMIT 500`).catch(() => null),
      usageQuery(`SELECT blob10 AS region, blob9 AS country, SUM(_sample_interval) AS n ${W} AND blob2 = 'sec' GROUP BY region, country ORDER BY n DESC LIMIT 5`).catch(() => null),
      usageQuery(`SELECT blob15 AS screen, blob3 AS view, COUNT(DISTINCT blob12) AS devices, SUM(_sample_interval) AS loads, MAX(timestamp) AS last ${W} AND blob2 = 'tv' AND blob15 != '' GROUP BY screen, view ORDER BY loads DESC LIMIT 40`).catch(() => null)
    ]);
    return J({ ok: true, days, limitBasis: dayStart ? "utcday" : "rolling", screensOn: st.features.screens !== false, countOn: st.features.count !== false, tvDay, tvPages, clubPg, pinDay, pinWhere, secDay, secWhere, screens: scr, speed: { pages: spPages, up: spUp, day: spDay }, perDay, tot, pages, teams, devs, others, srch, today: today[0] ? Number(today[0].n) || 0 : 0, teamsKnown: TEAMS.map(t => ({ id: String(t.team), name: t.name })) });
  } catch (e) { return J({ ok: false, error: "Could not read the usage data: " + String(e && e.message || e).slice(0, 120) }, 502); }
}
function usagePage(theme, isDev, defDays) {
  const t = theme === "light" ? "light" : "dark";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Usage</title>
<style>
${MENU_CSS}
.wrap.us{max-width:900px}.us h1{font-size:24px;margin:0 0 4px}.sub{color:#91a49a;font-size:13.5px;margin:0 0 14px}
.rng{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.rng button{border:1px solid #26312d;background:transparent;color:#91a49a;border-radius:99px;padding:7px 16px;font-size:14px;cursor:pointer}.rng button.on{background:#163d26;color:#7fd89a;border-color:#2c6a43}
.kp{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:12px}.k,.cd{background:#111719;border:1px solid #26312d;border-radius:12px;padding:14px 16px}.k b{display:block;font-size:28px;margin-top:3px}.k span{font-size:13px;color:#91a49a}.k em{font-style:normal;font-size:12px;color:#91a49a;display:block;margin-top:2px}
.cd{margin-bottom:12px}.cd h2{font-size:15px;margin:0 0 3px;text-transform:none;letter-spacing:0;color:#f5f7f6}.cd .n{font-size:13px;color:#91a49a;margin:0 0 10px;line-height:1.45}
.ch{display:flex;gap:6px;align-items:flex-end;height:190px}.col{flex:1;min-width:0;text-align:center}.bar{background:#3f8f62;border-radius:4px 4px 0 0;margin:2px auto 0;width:70%}.bar.we{background:#e0b84c}.bv,.bl{font-size:11px;color:#91a49a}.bl{margin-top:5px;white-space:nowrap}
.tw{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:700px){.tw{grid-template-columns:1fr}}
table{width:100%;border-collapse:collapse;font-size:14px}td{padding:7px 4px;border-top:1px solid #1f2925}tr:first-child td{border-top:0}td.nu{text-align:right;width:60px;font-variant-numeric:tabular-nums}.mu{color:#91a49a}
.hl{border-color:rgba(224,182,76,.5)}.msg{color:#c9d4ce;line-height:1.5;font-size:14px}
</style></head><body class="${t}">${themeBoot("true")}<div class="wrap us"><div class="top"><h1>Usage</h1><span><a class="mb" href="/admin" style="color:#7fd89a;font-size:14px">Admin</a> &nbsp; <a class="mb" href="/club-signout" style="color:#7fd89a;font-size:14px">Sign out</a></span></div>
<p class="sub">No cookies and no IP addresses are stored. Screens and calendars are counted apart from people, and known robots are left out.</p>
<div id="o"><p class="msg">Loading&hellip;</p></div></div>
<script>(function(){
var o=document.getElementById("o"),days=${JSON.stringify([7, 14, 30, 90].includes(defDays) ? defDays : 14)};
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function num(x){return Number(x||0).toLocaleString("en-GB")}
function rows(a,fn){return a.length?"<table>"+a.map(fn).join("")+"</table>":'<p class="msg mu">Nothing yet.</p>'}
var VN={team:"Team dashboard",home:"Welcome page",fixtures:"Fixtures",match:"Match Stats",opposition:"Opposition Report",stack:"Match Centre",builder:"Link builder",docs:"Documentation"};
var SN={stack:"Match Centre",fixtures:"Fixtures board",match:"Match Stats",opposition:"Opposition Report",team:"Team dashboard (TV layout)",home:"Welcome page"};
function screensCard(d){
 if(!d.screensOn&&!(d.tvPages||[]).length)return"";
 var m={};(d.tvPages||[]).forEach(function(r){var key=r.view+"|"+(r.known==="1"?r.team:r.name||r.team);var o2=m[key]||(m[key]={view:r.view,known:r.known==="1",team:r.team,name:r.name,loads:0,screens:0});o2.loads+=Number(r.loads);o2.screens=Math.max(o2.screens,Number(r.screens))});
 var a=Object.keys(m).map(function(k2){return m[k2]}).sort(function(x,y){return y.loads-x.loads}),tot=a.reduce(function(s2,r){return s2+r.loads},0)||1;
 var nm=function(r){if(r.view==="stack")return"All club teams";if(r.known){var t=d.teamsKnown.filter(function(x){return x.id===r.team})[0];return t?t.name:(r.name||r.team)}return r.name?r.name+" (other club)":"Not named"};
 return'<div class="cd"><h2>What the screens are showing</h2><p class="n">Screen loads by page and team. "Most screens on a day" is the most different screens seen in one day.</p>'+(a.length?'<table><tr><td class="mu">Screen page</td><td class="mu">Team</td><td class="nu mu" style="width:90px">Most screens</td><td class="nu mu">Loads</td><td class="bw" style="width:22%"></td></tr>'+a.map(function(r){return"<tr><td>"+esc(SN[r.view]||r.view)+"</td><td>"+esc(nm(r))+'</td><td class="nu">'+num(r.screens)+'</td><td class="nu">'+num(r.loads)+'</td><td><i style="display:block;height:8px;border-radius:4px;background:#4a8fd6;width:'+Math.max(3,Math.round(r.loads/tot*100))+'%"></i></td></tr>'}).join("")+"</table>":'<p class="msg mu">Nothing yet.</p>')+"</div>"}
function clubCard(d){
 var CP={usage:"Usage page",admin:"Admin page",docs:"Documentation",links:"Links page"},cp={};(d.clubPg||[]).forEach(function(r){cp[r.view]=r});
 var pf=(d.pinDay||[]),isL=function(w){return /-(lock|pause)$/.test(w)},bad=pf.reduce(function(a,r){return isL(r.which)?a:a+Number(r.n)},0),paused=pf.reduce(function(a,r){return /-pause$/.test(r.which)?a+Number(r.n):a},0),refused=pf.reduce(function(a,r){return /-lock$/.test(r.which)?a+Number(r.n):a},0),src=pf.reduce(function(a,r){return isL(r.which)?a:a+Number(r.sources)},0),byDay={};pf.forEach(function(r){if(isL(r.which))return;var o2=byDay[r.d]||(byDay[r.d]={n:0,w:{}});o2.n+=Number(r.n);o2.w[r.which]=1});
 var days=Object.keys(byDay).sort().reverse().slice(0,7);
 return'<div class="tw"><div class="cd"><h2>Club pages</h2><p class="n">Times each page was opened by someone who had signed in. Robots are left out.</p>'+rows(["usage","admin","docs","links"],function(k2){var r=cp[k2]||{n:0,who:0};return"<tr><td>"+CP[k2]+'</td><td class="nu">'+num(r.n)+'</td><td class="nu mu" style="width:110px">'+num(r.who)+" person-days</td></tr>"})+"</div>"+
 '<div class="cd'+(bad||paused?" hl":"")+'"><h2>Wrong PIN entries</h2><p class="n">'+(bad?"Each wrong PIN typed on the club PIN page (or the test site PIN page). Robots are included here.":"No wrong PINs in this period.")+"</p>"+(bad?'<p class="msg"><b>'+num(bad)+"</b> wrong entries from about "+num(src)+" source-days.</p>"+(paused?'<p class="msg"><b>'+num(paused)+"</b> temporary pause"+(paused===1?"":"s")+" started (5 wrong PINs from one source)"+(refused?"; "+num(refused)+" further guess"+(refused===1?" was":"es were")+" refused while paused":"")+".</p>":"")+rows(days,function(dd){var o2=byDay[dd];return"<tr><td>"+esc(new Date(dd+"T12:00:00Z").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",timeZone:"UTC"}))+'</td><td class="nu">'+num(o2.n)+"</td></tr>"})+((d.pinWhere||[]).length?'<p class="n" style="margin-top:10px">Where from: '+d.pinWhere.map(function(r){return esc((r.region?r.region+", ":"")+(r.country||"unknown"))+" ("+num(r.n)+")"}).join("; ")+"</p>":""):"")+"</div></div>"}
function screenCard(d){
 var sc=d.screens||[];
 return'<div class="cd"><h2>Named screens</h2><p class="n">Screens whose link carries &amp;screen=Name (a label the club chooses). Loads and the last time each was seen.</p>'+(sc.length?rows(sc,function(r){return"<tr><td>"+esc(r.screen)+'</td><td class="mu">'+esc(r.view)+'</td><td class="nu">'+num(r.loads)+'</td><td class="nu mu" style="width:150px">'+esc(String(r.last||"").slice(0,16).replace("T"," "))+"</td></tr>"}):'<p class="msg">None yet. Add &amp;screen=Clubhouse+Bar to a TV link to name it.</p>')+"</div>"
}
function secCard(d){
 var sd=d.secDay||[],bad=0,slow=0,byDay={},parts={};
 sd.forEach(function(r){var n=Number(r.n),o=byDay[r.d]||(byDay[r.d]={bad:0,slow:0});if(r.type==="badreq"){bad+=n;o.bad+=n;parts[r.part]=(parts[r.part]||0)+n}else{slow+=n;o.slow+=n}});
 var any=bad+slow>0,days=Object.keys(byDay).sort().reverse().slice(0,7),pk=Object.keys(parts).sort(function(a,b){return parts[b]-parts[a]});
 return'<div class="cd'+(any?" hl":"")+'"><h2>Address checks</h2><p class="n">'+(any?"Requests turned away because the team, competition, division or season in the address was not valid, and visitors slowed down for asking for too many different teams in a minute. Robots are included. Only the name of the wrong part is kept, never what was typed.":"Nothing was turned away in this period.")+"</p>"+(any?'<p class="msg"><b>'+num(bad)+"</b> not valid"+(slow?"; <b>"+num(slow)+"</b> slowed down":"")+".</p>"+(pk.length?'<p class="n">Wrong part: '+pk.map(function(k){return esc(k)+" ("+num(parts[k])+")"}).join(", ")+"</p>":"")+rows(days,function(dd){var o=byDay[dd];return"<tr><td>"+esc(new Date(dd+"T12:00:00Z").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",timeZone:"UTC"}))+'</td><td class="nu">'+num(o.bad)+' not valid</td><td class="nu">'+num(o.slow)+" slowed</td></tr>"})+((d.secWhere||[]).length?'<p class="n" style="margin-top:10px">Where from: '+d.secWhere.map(function(r){return esc((r.region?r.region+", ":"")+(r.country||"unknown"))+" ("+num(r.n)+")"}).join("; ")+"</p>":""):"")+"</div>"}
function upDayCard(d){
 var sp=d.speed||{},a=sp.day;
 if(!a)return"";
 var hr=d.days===1,by={},keys=[];
 a.forEach(function(r){var k2=String(r.d),o2=by[k2]||(by[k2]={web:0,svc:0,oth:0}),n=Number(r.n)||0,s2=String(r.src||"");if(s2==="RFU web page")o2.web+=n;else if(/^RFU/.test(s2))o2.svc+=n;else o2.oth+=n;if(keys.indexOf(k2)<0)keys.push(k2)});
 keys.sort();
 var mx=Math.max.apply(null,keys.map(function(k2){var o2=by[k2];return o2.web+o2.svc+o2.oth}).concat([1])),tw=0,ts=0,sc=140/mx;
 keys.forEach(function(k2){tw+=by[k2].web;ts+=by[k2].svc});
 var seg=function(v,c){return v?'<div style="background:'+c+';height:'+Math.max(2,Math.round(v*sc))+'px;margin-top:1px"></div>':""};
 var cols=keys.map(function(k2){var o2=by[k2],h2=k2.length>10,dt=new Date(h2?k2.replace(" ","T")+"Z":k2+"T12:00:00Z"),lab=h2?k2.slice(11,16):dt.toLocaleDateString("en-GB",{day:"numeric",month:"short",timeZone:"UTC"});
  return'<div class="col"><div class="bv">'+num(o2.web+o2.svc+o2.oth)+'</div><div style="width:70%;margin:2px auto 0;border-radius:4px 4px 0 0;overflow:hidden">'+seg(o2.oth,"#6b7a73")+seg(o2.svc,"#3f8f62")+seg(o2.web,"#e0b84c")+'</div><div class="bl">'+esc(lab)+'</div><div class="bv" style="color:#e0b84c">'+(o2.web?num(o2.web)+" web":"&nbsp;")+"</div></div>"}).join("");
 return'<div class="cd"><h2>Outside calls per '+(hr?"hour":"day")+'</h2><p class="n">Each time the site went outside for fresh data (stored copies are not counted). <b style="color:#e0b84c">Gold</b> is the RFU website, which we are trying to cut back; <b style="color:#5fbf86">green</b> is the RFU data service; grey is the weather and postcode services. The gold number under a bar is the website calls in that '+(hr?"hour":"day")+'.</p>'+(keys.length?'<p class="msg"><b>'+num(tw)+'</b> website calls and <b>'+num(ts)+'</b> data service calls in this period.</p><div class="ch" style="height:210px">'+cols+"</div>":'<p class="msg mu">Nothing yet.</p>')+"</div>"}
function speedCard(d){
 var sp=d.speed||{};
 if(!sp.pages&&!sp.up)return'<div class="cd"><h2>Speed</h2><p class="n">Speed figures could not be read this time.</p></div>';
 var ms=function(x){x=Number(x||0);return x>=1000?(x/1000).toFixed(1)+" s":Math.round(x)+" ms"};
 var pg=(sp.pages||[]),up=(sp.up||[]);
 if(!pg.length&&!up.length)return'<div class="cd"><h2>Speed</h2><p class="n">Timings appear here once the site has been running on v3.13 for a while.</p></div>';
 return'<div class="cd"><h2>Speed</h2><p class="n">How long the site took to build each page, before it travels to the device. "Typical" is the middle load, "slowest 1 in 20" is the time that 19 out of 20 loads beat, and "over 2 s" is the share of loads slower than two seconds.</p>'+
 (pg.length?'<table><tr><td class="mu">Page</td><td class="nu mu" style="width:70px">Loads</td><td class="nu mu" style="width:80px">Typical</td><td class="nu mu" style="width:110px">Slowest 1 in 20</td><td class="nu mu" style="width:70px">Over 2 s</td><td class="nu mu" style="width:80px">Ready made</td></tr>'+pg.map(function(r){var n=Number(r.n)||1;return"<tr><td>"+esc(r.kind==="tv"?"Screen: "+(SN[r.view]||r.view):(VN[r.view]||r.view))+'</td><td class="nu">'+num(r.n)+'</td><td class="nu">'+ms(r.p50)+'</td><td class="nu">'+ms(r.p95)+'</td><td class="nu">'+Math.round(Number(r.slow)/n*100)+'%</td><td class="nu">'+Math.round(Number(r.hits)/n*100)+"%</td></tr>"}).join("")+"</table>":'<p class="msg mu">No page timings yet.</p>')+
 '<h2 style="margin-top:16px">Outside data</h2><p class="n">Each time the site had to fetch fresh data from RFU, the weather or the postcode service (stored copies are used the rest of the time). "Visitor waited" means someone was waiting for that fetch; otherwise it ran in the background.</p>'+
 (up.length?'<table><tr><td class="mu">Source</td><td class="nu mu" style="width:70px">Fetches</td><td class="nu mu" style="width:80px">Typical</td><td class="nu mu" style="width:110px">Slowest 1 in 20</td><td class="nu mu" style="width:70px">Failed</td><td class="nu mu" style="width:110px">Visitor waited</td></tr>'+up.map(function(r){return"<tr><td>"+esc(r.src)+'</td><td class="nu">'+num(r.n)+'</td><td class="nu">'+ms(r.p50)+'</td><td class="nu">'+ms(r.p95)+'</td><td class="nu">'+num(r.bad)+'</td><td class="nu">'+num(r.waited)+"</td></tr>"}).join("")+"</table>":'<p class="msg mu">No outside fetches recorded yet.</p>')+"</div>"}
function show(d){
 if(!d.ok){
  if(d.setup){o.innerHTML='<div class="cd"><h2>Visit counting is not set up yet</h2><p class="msg">'+(d.setup.binding?"":"The USAGE binding is missing: in Cloudflare open the Pages project, Settings, Bindings, Add, Analytics Engine, variable name <b>USAGE</b>, dataset <b>${USAGE_DATASET}</b>, then redeploy. ")+(d.setup.key?"":"To read the numbers back, add two secrets, <b>CF_ACCOUNT_ID</b> and <b>CF_API_TOKEN</b> (a token with Account, Account Analytics, Read). ")+"Nothing is counted until the binding is added.</p></div>";return}
  o.innerHTML='<div class="cd"><p class="msg">'+esc(d.error||"Sorry, the usage data could not be loaded.")+"</p></div>";return}
 var k={};d.tot.forEach(function(r){k[r.kind]=r});
 var pv=k.page?Number(k.page.n):0,tvs=(d.tvDay||[]).reduce(function(a,r){return Math.max(a,Number(r.screens))},0),cals=k.cal?Number(k.cal.who):0;
 var tot=d.perDay.reduce(function(a,r){return a+Number(r.people)},0);
 var mx=Math.max.apply(null,d.perDay.map(function(r){return Number(r.people)}).concat([1]));
 var bars=d.perDay.map(function(r){var hr=d.days===1&&String(r.d).length>10,dt=new Date(hr?String(r.d).replace(" ","T")+"Z":r.d+"T12:00:00Z"),wd=dt.getUTCDay(),we=!hr&&(wd===0||wd===6),lab=hr?String(r.d).slice(11,16):dt.toLocaleDateString("en-GB",{day:"numeric",month:"short",timeZone:"UTC"});return'<div class="col"><div class="bv">'+num(r.people)+'</div><div class="bar'+(we?" we":"")+'" style="height:'+Math.max(3,Number(r.people)/mx*140)+'px"></div><div class="bl">'+esc(lab)+"</div></div>"}).join("");
 var pt=d.pages.reduce(function(a,r){return a+Number(r.n)},0)||1;
 var ours=d.teams.map(function(r){var nm=(d.teamsKnown.filter(function(x){return x.id===r.team})[0]||{}).name||r.name||r.team;return{n:nm,v:Number(r.n)}});
 var dv=d.devs,dt2=dv.reduce(function(a,r){return a+Number(r.who)},0)||1;
 var DN={phone:"Phone",tablet:"Tablet",computer:"Computer"};
 o.innerHTML='<div class="rng">'+[1,7,14,30,90].map(function(n){return'<button data-d="'+n+'"'+(n===d.days?' class="on"':"")+">"+(n===1?"Today":"Last "+n+" days")+"</button>"}).join("")+"</div>"+
 '<div class="kp"><div class="k"><span>Visits by people</span><b>'+num(tot)+'</b><em>person-days (a person counts once a day)</em></div><div class="k"><span>Page views</span><b>'+num(pv)+'</b><em>screens not included</em></div><div class="k"><span>Clubhouse screens</span><b>'+num(tvs)+'</b><em>most on one day</em></div><div class="k"><span>Calendar subscribers</span><b>'+num(cals)+'</b><em>subscriber-days</em></div></div>'+
 '<div class="cd"><h2>'+(d.days===1?"People per hour":"People per day")+'</h2><p class="n">'+(d.days===1?"Today so far, by hour (UTC). Someone active in two hours is counted in both, so the bars add up to more than the number of people today.":"Weekends are shown in gold.")+'</p><div class="ch">'+bars+'</div></div>'+
 '<div class="cd"><h2>Clubhouse screen loads per '+(d.days===1?"hour":"day")+'</h2><p class="n">'+(d.screensOn?"Each time a TV screen loads or reloads the page. The small number under each bar is the number of different screens that day.":"Screen counting is switched off on the Admin page, so nothing new is recorded here.")+'</p>'+(d.tvDay.length?'<div class="ch" style="height:170px">'+d.tvDay.map(function(r){var m2=Math.max.apply(null,d.tvDay.map(function(x){return Number(x.loads)})),hr=d.days===1&&String(r.d).length>10,dt=new Date(hr?String(r.d).replace(" ","T")+"Z":r.d+"T12:00:00Z"),lab=hr?String(r.d).slice(11,16):dt.toLocaleDateString("en-GB",{day:"numeric",month:"short",timeZone:"UTC"});return'<div class="col"><div class="bv">'+num(r.loads)+'</div><div class="bar" style="background:#4a8fd6;height:'+Math.max(3,Number(r.loads)/m2*120)+'px"></div><div class="bl">'+esc(lab)+'</div><div class="bv">'+num(r.screens)+(Number(r.screens)===1?" screen":" screens")+"</div></div>"}).join("")+"</div>":'<p class="msg mu">Nothing yet.</p>')+"</div>"+
 screensCard(d)+'<div class="tw"><div class="cd"><h2>What people look at</h2><p class="n">Share of page views</p>'+rows(d.pages,function(r){return"<tr><td>"+esc(VN[r.view]||r.view)+'</td><td class="nu">'+num(r.n)+'</td><td class="nu mu">'+Math.round(Number(r.n)/pt*100)+"%</td></tr>"})+"</div>"+
 '<div class="cd"><h2>Our teams</h2><p class="n">Views of teams on the club list</p>'+rows(ours,function(r){return"<tr><td>"+esc(r.n)+'</td><td class="nu">'+num(r.v)+"</td></tr>"})+"</div></div>"+
 '<div class="cd hl"><h2>Teams that are not in our list</h2><p class="n">Where other clubs show up. Only the team, league ids and county are kept. Searches: '+num((d.srch.filter(function(r){return r.kind==="search"})[0]||{}).n)+", teams picked from a search: "+num((d.srch.filter(function(r){return r.kind==="pick"})[0]||{}).n)+". Typed search text is never stored.</p>"+
 rows(d.others,function(r){return"<tr><td>"+esc(r.name||("Team "+r.team))+'</td><td class="mu">'+esc(r.comp?"comp "+r.comp+(r.div?" / "+r.div:""):"")+'</td><td class="mu">'+esc(r.region||r.country||"")+'</td><td class="nu">'+num(r.n)+"</td></tr>"})+"</div>"+
 clubCard(d)+screenCard(d)+secCard(d)+upDayCard(d)+speedCard(d)+'<div class="tw"><div class="cd"><h2>Device</h2><p class="n">Share of people</p>'+rows(dv,function(r){return"<tr><td>"+esc(DN[r.device]||r.device)+'</td><td class="nu">'+num(r.who)+'</td><td class="nu mu">'+Math.round(Number(r.who)/dt2*100)+"%</td></tr>"})+"</div>"+
 '<div class="cd"><h2>Cloudflare free limit</h2><p class="n">'+(d.limitBasis==="utcday"?"Requests counted so far today, since midnight UTC (1am UK time in summer), which is when Cloudflare's daily limit restarts.":"Requests counted in the last 24 hours (the start of Cloudflare's day could not be used, so this is a rolling figure).")+'</p><p class="msg"><b>'+num(d.today)+"</b> of 100,000 a day ("+(Math.round(Number(d.today)/100)/10)+"%). Cloudflare's limit also counts requests this page does not (robots, images), so treat this as a lower bound. If it nears the limit, move to the $5 a month Workers Paid plan.</p></div></div>";
 [].forEach.call(o.querySelectorAll(".rng button"),function(b){b.onclick=function(){days=+b.getAttribute("data-d");load()}})}
function load(){o.innerHTML='<p class="msg">Loading&hellip;</p>';fetch("/api/usage?days="+days,{cache:"no-store"}).then(function(r){return r.json()}).then(show).catch(function(){o.innerHTML='<div class="cd"><p class="msg">Sorry, the usage data could not be loaded.</p></div>'})}
load()})();</script></body></html>`;
}


// Teams shown on the links page (/?view=teams) and the default Now and Next
// screen. "short" is the label used on the phone jump bar; "accent" is the
// team colour used to tell rows apart on Now and Next. Add or edit here.
const TEAMS = [
  { name: "Ivybridge 1XV", short: "1XV", accent: "#2f9e5b", league: "Regional 2 Tribute Ale South West", competition: "1699", division: "75791", team: "11039", teamName: "Ivybridge" },
  { name: "The Vandals", short: "Vandals", accent: "#d9a21b", league: "Counties 3 Tribute Ale Devon South & West", competition: "1699", division: "75801", team: "11063", teamName: "Ivybridge" },
  { name: "Ivybridge Women", short: "Women", accent: "#c0303f", league: "Women's Championship South 1", competition: "1782", division: "76176", team: "124080", teamName: "Ivybridge" },
  { name: "Colts", short: "Colts", accent: "#3d8fd6", league: "Devon RFU Colts Group 1", competition: "2388", division: "77306", team: "11057", teamName: "Ivybridge U18s" }
];

// The public address of the live site. Links created on a *.pages.dev address use it. A site counts as DEV when its
// Pages project has the ENV_LABEL variable. (v3.6: the PROD/DEV switch is gone, and the DEV address is deliberately
// not written anywhere in the code, so no page can ever point visitors at it.)
const SITES = {
  PROD: "https://thestatsboard.co.uk"
};

// Data refresh: RFU data is cached for one hour and pages reload hourly.
const REFRESH_SECONDS = 3600;
// v31f: on Saturdays and Sundays (match days) RFU data is kept for 10 minutes instead of an hour, and the Fixtures TV board reloads at the same rate.
function liveDataSeconds() { const wd = new Date().toLocaleDateString("en-GB", { weekday: "short", timeZone: "Europe/London" }); return wd === "Sat" || wd === "Sun" ? 600 : REFRESH_SECONDS; }

// Brand (v3.18): the ball-and-bars logo, wordmark, tagline and a small footer. Nothing here is club-specific.
const BRAND_TAGLINE = "Your club’s rugby fixtures, results and tables at a glance.";
const sbLogo = px => `<svg class="sblg" viewBox="0 0 64 64" width="${px}" height="${px}" aria-hidden="true" style="flex:0 0 auto;vertical-align:middle"><defs><linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fdc98"/><stop offset="1" stop-color="#1f8a4c"/></linearGradient></defs><ellipse cx="32" cy="33" rx="27" ry="18" transform="rotate(-25 32 33)" fill="url(#sbg)"/><path d="M9 45Q32 31 55 21" fill="none" stroke="#0b2016" stroke-opacity=".3" stroke-width="1.6" stroke-linecap="round"/><rect x="20" y="32" width="7" height="10" rx="1.6" fill="#0b2016"/><rect x="29.5" y="26" width="7" height="16" rx="1.6" fill="#0b2016"/><rect x="39" y="20" width="7" height="22" rx="1.6" fill="#0b2016"/><circle cx="53" cy="14" r="4.6" fill="#e8c26a"/></svg>`;
const sbWordmark = (big) => `<span style="display:inline-flex;align-items:center;gap:${big ? 14 : 8}px;text-align:left">${sbLogo(big ? 56 : 28)}<span style="display:inline-flex;flex-direction:column;line-height:1.05"><span style="font-size:${big ? 13 : 9}px;letter-spacing:.42em;font-weight:700;color:#9fb2a8">THE</span><span style="font-size:${big ? 38 : 20}px;font-weight:800;letter-spacing:.02em;color:currentColor">STATS <span style="color:#4fc27d">BOARD</span></span></span></span>`;
const BRAND_FOOT = `<div class="sbft" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:26px 0 6px;padding-top:14px;border-top:1px solid rgba(128,140,134,.25);font:13px Arial,Helvetica,sans-serif;color:#91a49a"><a href="/" style="display:inline-flex;align-items:center;gap:8px;color:inherit;text-decoration:none">${sbLogo(20)}<span>The Stats Board</span></a><a href="/docs" style="color:inherit">Documentation</a></div>`;
// Link preview (WhatsApp and social) tags, and brand footer, added to ordinary pages.
function brandInject(html, url) {
  const q = url.searchParams, esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  let out = html;
  if (!/name="robots"/i.test(out) && !/property="og:title"/i.test(out) && /<\/head>/i.test(out)) {
    const tm = out.match(/<title>([^<]*)<\/title>/i), fn = (q.get("friendlyName") || q.get("teamName") || "").replace(/[\u0000-\u001f<>]/g, "").slice(0, 60);
    let title = fn ? fn + " \u00b7 Fixtures and results" : tm ? tm[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'") : "The Stats Board";
    if (!fn && /^\s*$/.test(title)) title = "The Stats Board";
    const desc = BRAND_TAGLINE, img = url.origin + "/og-image.jpg";
    out = out.replace(/<\/head>/i, `<meta property="og:type" content="website"><meta property="og:site_name" content="The Stats Board"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:image" content="${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:image" content="${img}"></head>`);
  }
  if (out.includes('<p class="ver"') && !out.includes('class="sbft"') && !out.includes('id="intro"')) out = out.replace('<p class="ver"', BRAND_FOOT + '<p class="ver"');
  return out;
}
// Home-screen app icons (original artwork, PNG, base64) used by the web app manifest and the iPhone icon.
const ICON_B64 = { "icon-192": "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", "icon-512": "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAQAElEQVR4Aey9B8Cnx1Xe+5ztVVr1asm2JFtucpNc5G5UwMYFAzYYMMXYoYVL4AYCScgNlw6mJXEgGANJuDeBhCSEALnhUhMuDsUQMLjiJsuqVlmtVlvP/T1n5v3//9+upC3a3e/b3Xn9vjNnnueZM2fOOzPvt99K8qrNZ20b98jAyMDIwMjAaZiBVRrXyMDIwMjAyMBpmYHxATgtX/uY9MiApJGE0z4D4wNw2i+BkYCRgZGB0zUD4wNwur75Me+RgZGB0z4D4wNw2i6BMfGRgZGB0z0D4wNwuq+AMf+RgZGB0zYD4wNw2r76MfGRgZGB0zUD07zHB2DKxKhHBkYGRgZOswyMD8Bp9sLHdEcGRgZGBqYMjA/AlIlRjwycLhkY8xwZ6BkYH4CeiFGNDIwMjAycbhkYH4DT7Y2P+Y4MjAyMDPQMjA9AT8TpU42ZjgyMDIwMtAyMD0DLwyhHBkYGRgZOuwyMD8Bp98rHhEcGRgZO1wwcOO/xATgwI6M9MjAyMDJwmmRgfABOkxc9pjkyMDIwMnBgBsYH4MCMjPbIwKmagTGvkYEDMjA+AAckZDRHBkYGRgZOlwyMD8Dp8qbHPEcGRgZGBg7IwPgAHJCQU7c5ZjYyMDIwMrA0A+MDsDQfozUyMDIwMnDaZGB8AE6bVz0mOjIwMnC6ZuCR5j0+AI+UmYGPDIwMjAyc4hkYH4BT/AWP6Y0MjAyMDDxSBsYH4JEyM/CRgVMlA2MeIwOPkIHxAXiExAx4ZGBkYGTgVM/A+ACc6m94zG9kYGRgZOARMjA+AI+QmFMHHjMZGRgZGBl4+AyMD8DD52WgIwMjAyMDp3wGxgfglH/FY4IjAyMDp2sGDjXv8QE4VIYGPzIwMjAycIpmYHwATtEXO6Y1MjAyMDJwqAyMD8ChMjT4kYGTNQMj7pGBQ2RgfAAOkaBBjwyMDIwMnKoZGB+AU/XNjnmNDIwMjAwcIgPjA3CIBJ289Ih8ZGBkYGTg0TMwPgCPnp/BjgyMDIwMnLIZGB+AU/bVjomNDIwMnK4ZONx5jw/A4WZq6EYGRgZGBk6xDIwPwCn2Qsd0RgZGBkYGDjcD4wNwuJkaupGBkyUDI86RgcPMwPgAHGaihmxkYGRgZOBUy8D4AJxqb3TMZ2RgZGBk4DAzMD4Ah5mok0c2Ih0ZGBkYGTi8DIwPwOHlaahGBkYGRgZOuQyMD8Ap90rHhEYGRgZO1wwc6bzHB+BIMzb0IwMjAyMDp0gGxgfgFHmRYxojAyMDIwNHmoHxATjSjA39yMBKzcCIa2TgCDMwPgBHmLAhHxkYGRgZOFUyMD4Ap8qbHPMYGRgZGBk4wgyMD8ARJmzlykdkIwMjAyMDR5aB8QE4snwN9cjAyMDIwCmTgfEBOGVe5ZjIyMDIwOmagaOd9/gAHG3mRr+RgZGBkYGTPAPjA3CSv8AR/sjAyMDIwNFmYHwAjjZzo9/IwErJwIhjZOAoMzA+AEeZuNFtZGBkYGTgZM/A+ACc7G9wxD8yMDIwMnCUGRgfgKNM3MrpNiIZGRgZGBk4ugyMD8DR5W30GhkYGRgZOOkzMD4AJ/0rHBMYGRgZOF0z8FjnPT4AjzWDo//IwMjAyMBJmoHxAThJX9wIe2RgZGBk4LFmYHwAHmsGR/+RgeXKwBh3ZOAxZmB8AB5jAkf3kYGRgZGBkzUD4wNwsr65EffIwMjAyMBjzMD4ADzGBC5f9zHyyMDIwMjAY8vA+AA8tvyN3iMDIwMjAydtBsYH4KR9dSPwkYGRgdM1A8dq3uMDcKwyOfyMDIwMjAycZBkYH4CT7IWNcEcGRgZGBo5VBsYH4FhlcvgZGThRGRjjjAwcowyMD8AxSuRwMzIwMjAycLJlYHwATrY3NuIdGRgZGBk4RhkYH4BjlMgT52aMNDIwMjAycGwyMD4AxyaPw8vIwMjAyMBJl4HxATjpXtkIeGRgZOB0zcCxnvf4ABzrjA5/IwMjAyMDJ0kGxgfgJHlRI8yRgZGBkYFjnYHxATjWGR3+RgaOVwaG35GBY5yB8QE4xgkd7kYGRgZGBk6WDIwPwMnypkacIwMjAyMDxzgD4wNwjBN6/NwNzyMDIwMjA8c2A+MDcGzzObyNDIwMjAycNBkYH4CT5lWNQEcGRgZO1wwcr3mPD8DxyuzwOzIwMjAysMIzMD4AK/wFjfBGBkYGRgaOVwbGB+B4ZXb4HRk4VhkYfkYGjlMGxgfgOCV2uB0ZGBkYGVjpGRgfgJX+hkZ8IwMjAyMDxykD4wNwnBJ77NwOTyMDIwMjA8cnA+MDcHzyOryODIwMjAys+AyMD8CKf0UjwJGBkYHTNQPHe97jA3C8Mzz8jwyMDIwMrNAMjA/ACn0xI6yRgZGBkYHjnYHxATjeGR7+RwaONgOj38jAcc7A+AAc5wQP9yMDIwMjAys1A+MDsFLfzIhrZGBkYGTgOGdgfACOc4KP3v3oOTIwMjAycHwzMD4Axze/w/vIwMjAyMCKzcD4AKzYVzMCGxkYGThdM3Ci5j0+ACcq02OckYGRgZGBFZaB8QFYYS9khDMyMDIwMnCiMjA+ACcq02OckYHDzcDQjQycoAyMD8AJSvQYZmRgZGBkYKVlYHwAVtobGfGMDIwMjAycoAyMD8AJSvThDzOUIwMjAyMDJyYD4wNwYvI8RhkZGBkYGVhxGRgfgBX3SkZAIwMjA6drBk70vMcH4ERnfIw3MjAyMDKwQjIwPgAr5EWMMEYGRgZGBk50BsYH4ERnfIw3MvBIGTgN8c0b11x+0ZbnXH3u1Y/fdu62DadhBpZ3yuMDsLz5H6OPDJxGGdiwfvUrrr34H739ub/4/Tf87r947V/82y/8X//mjb/1k6/9pR+46b/8+Kve8/Nv+Mh/evN7fv7z/suPf84///aXfOnnXHXJ+ZtPo+wsx1THB2A5sj7GHBk4nTLwuAs2f/XnXf2vvuuV7/vFN73rH778La9+8nOfcv6lF2zZtGHtwWk4d9vGqx9/1k0veNw//prrfu+nX/dbP/ma/+Ptz33Zcy86WDmQx56B8QF47Dk8Rh6Gm5GBUy4D55214Xu+7nm/+c7XfPtXPOf6Z154FPO7/KKtX/bqJ7/7O1/BHwv408NReBhdHiUD4wPwKMkZ1MjAyMBRZuCMTeu+7S3P+u2feu0X3XzlmjXH4JzhjwX86eEXv/9G/sLgKGMa3Q7KwDF4MQf5HMDIwMjAaZ2Ba646+/9556vf/vlP3bh+zbFNxHOfch5/YfAdX/WcVafW0XVss3T43kYWDz9XQzkyMDJw6Ax8yedc9W+/78bzztp4aOnRKt76uqv/5T9+5bat647WwejXMzA+AD0RoxoZGBl4jBlYv271P/3WF3/X11y3bu3qx+jqkN1feM2Fv/Ijn/OsJ51zSOUQPEoGxgfgUZIzqJGBE5KBU2KQi87d9B9+6ObPedFlJ2w2l5y/+f/+3hveeOMVJ2zEU2+g8QE49d7pmNHIwInOwNlnrOevZ5/8+G0neGD+qPF93/D8N3/2lSd43FNmuPEBOGVe5ZjIyMDyZIDf/Pzkd7z04vOW7V/a+s63XctfDi/P5E/yUccHYNlf4AhgZODkzsAPf9MLl/f8Xbtm1T//9pc84eKtJ3celyP68QFYjqyPMUcGTpUM/K3Pf+qrTuDv/R8pbeecueFf/IOXbdn0MP9q8SN1GTgZGB8AkjDukYGRgaPJAH8N+y1fcs3R9DwOfZ54yRnf9MUrJZjDnd9y68YHYLnfwBh/ZOCkzcC3vuWZq1evoDOEvw1+3AXL9lcRJ+NrXEEv72RM34h5ZOC0zcBzrj73c1/y+BU1ff46+m9/0TNWVEgrPJjxAVjhL2iEdwpn4OSe2rd82TNX4ARe/7LHX/34E/1Po67APBxmSOMDcJiJGrKRgZGBeQZe+pyLXvD0C+btFWPxK6lvevP4m4DDfR/jA3C4mRq6kYGRgVkGvv0rnj2zV5px4/Mvve6p5620qFZmPOMDsGzvZQw8MnCSZuC8szZcddmZKzn4Vzz34pUc3sqJbXwAVs67GJGMDJwcGeBH7IhYybHe8IJLV3J4Kye28QFYOe9iRDIycHJkgA/ACg/0ikvPvOLSlfwvBq+U/I0PwEp5EyOOkYGTIgNbNq55wTNW4l//HpC9G57/uAOQ0Tw4A+MDcHBOBjIycCIysHbrhg3nbd1y2dlnPunCbU+9uN9PuWjrFedtvvSsDedvXbdt05qNK+7/8+Tl11687vj/5/4f+wt46XMueuxOTnkP4wNwyr/iMcETlwHO9DOuPP+CF175+Nc9+8oveeHVX/3Sp33DZz3z7372s//ha677ns9/wTve9OJ3ftlLf+YrP+vffu0r/83XvORdX3H9P3nz837wjc/5x697zne+Bg33s/7ha6797jdc94Nf+MIf/+Lr3/klL/6Zr3jZL7zt5f/X21/0ri+//p1f+rwffdO1P/AFz/6u113zHa+6+ute8cQvft6lr3rG+S+84synXLTxojNXbzgR/yWcpz7+rBOX0Mcw0rOfdO5j6H26dB0fgNPlTY95HsMMrF6/duvl55x/3RMue/Uzn/wVL37Wt73qhe/4olf8q7e9/N1f9bzv+4JnfPNNnP58Ay696WkXvfRJ5177hLOfcSkfhs2Xnr3+nM1rt6zPTAfjkr9KTf4+1aYhRQRshApprJE1G9etPXPjxvPP2HzptjOuOG/bUy8+//orLn31NU988/Of/HUvf+bff/W1P/gF1//0W65/11uu/eEvvOYfvPrqr3/FE7/k+Rfd8JStVx7jfyDy3LOP4//Xo47dtX7d6jM2rbg/Px27+R0bT+MDcGzyOLycwhnYevm5F7/s6id96Quf+S2f/YIfeOMrfu6rP+sX3v7Cd3zxM7/tVVd/5Ysve/U15133BH6Ts2bDOk5tzmwl5zhFSpzdtttxnmAzpNtoTPrEN4LN98C95AsWG8QNHr4N6h4YB3amty2JL9OG87ee+eQLz33+Ey6++WlP/LIXPPM7X/Oin//KZ3/P66/86hf7e3DFY/0enLdtAwOdFPd5Z68/KeJcxiDHB+CEJ38MuLIzsGbTurOffunjX/OsZ3zDDdf/8Bfd+G+/7vof/eJnfOMNT/i8515w/ZVnXnn+2i3tBMxQndlqP6675XOco7gAt5UdQYPN2S1oTm1SYL6zXR98IQqxpnxbg5TvCiV31J8PcNa+BGg6ArdwF+t2Yyk3XXrWBS+5iu/BNd/5uS9895c/6/983ZVf9aILP+vqLU88d9Wa1ZYe9nPeWSfHnwCY0LnbTppQiXZZ7vEBWJa0j0FXVgbWb9t08cue/LSvfeVL/9lbbvjXf+t5/+cbnvyVL7nklU/Z+oRzV/MXnj6A+Umcg5ezO6nS4XeEU1icy9PJHj60zfMEJ35V1tjOcEeJE9/68gBk/7RhJ4RW6S2VJr1Hj3Bn2aNdc9ZH4ALArCspYo4EsZV/1YV+1epVmx531vkv6tzsfgAAEABJREFUveoJX/r8a77zc5/3z9/8lG++4YKXPYm/wCjJIYqT6U8AZ7VP9SFmdDrTq07nyY+5n84Z2HDOlkte8ZRn/O0bXvaTX/7Kn/3qa77p5sfd9PRNF53pnCRnsc9gjlJOTJDpZ3NMzt/GpmwuIpojKk2muFxyImd0vQ/v4HxXLtVz+meXQ6jpjShpH/Dng0Lsecm536MtHFdx4OlvrGlsFRtrVm97xiVP/IoXXvsTb3r6P3jVxa96On+fDPuw9+pVse2Mk+b3KuetvD8BPGxWlxEcH4BlTP4Y+kRnYP1Zmy552dXP+PobXv5TX/GKd33VNf/bTZe+8qmbLtjGmRjEwrnJmYjBEe0ztyqf1Jy2dc6WSCCdVXCmczzPkZQvSk5zaa4HwYMmPXaG3Fm+YNEnrFsetiGKCFqAFSEazH4bMesmNhVlBHpM+6cyojlSZEZF21lDjNUG0ZYnnnv5Fzz3md/zumd93+dd9gXP2cJfGATC+b1vf9529855e2Vbt9yxY2UHuPzRjQ/A8r+DEcFxzcC6Mzde9OInPf1rX/myd375Z/3s2575d25+3I1P23j+GeLs48T32InNWUnJwcmJl2qm6uLE9Bk/QeZ7Vw7wlNvKjrQWJ6w6oUI62/UH/CyfTYOwh0Ob71A2n2brzx+c/tiaX/bWkej6uaYhiOlLyb2IhPsqqheU70LUIpc2XLCVPwo87Ts++zk/8oVP+PIXbLvmkljTz4q77hkfAJ0yV3+pp8x8xkRGBloGtl5+7pVvfN6L3/HFN/z825/zd1912c3P2HzJWe285Kzn7OOs5whsCHZHfALKZ3qmK/viVC3TiM9usDL5qTltyyw+XXHu4yETD/gEqfO3PISUTQ87IZPePiA5hY3QNYmn5LQzms9QuzwWVioWkFg8zR1agqDibnrKRSQYKzMUCLiLdS2PJa5CYu0ZG85/6ZOe9I2vvPaffNEVX/2iLVeed+e9D8GeFPedJ8+3arnyOT4Ay5X5Me6xz0BEnPP0S5/61pe94l985Ut/4kuf/CXXn3nlBYCcZT7ofN5xnkqzs/JgRJyJnL+SfECKk1QctHOE8zJBO+mWnznkVszY7j/niNKKdIcq3CrWiJJR/Y2ZIyqkpFWIK6b4JyRnCCy35+tzPLG5J5avzgEIAxaS81GYcVT8MfeAf8Xa1ee84IlP/Xs373z8efhc+ffeffvvuX/Xyo9zeSMcH4Dlzf8Y/dhk4NxrHnfNN9xw0//1tS/4ni94wuues+mCM8UpyfnGeZacX5x9HiilkCFxyGFgSh3hvJMvn54FCQ+pMvGAr1RpGiJfhaTKmSv3xadN6FTXMzq2YASSTY/JdyWpMhuSsiKjNNjtxmdEYFNgY1BGGLFNXNa7L03uic2o+BcR7HZbo+ahYuPEl/UqNy2e9meXBT0mdOzYvAFr5d/33r+Lv7FY+XEub4TjA3DC8j8GOvYZ2HbVBfy8f8PPvf0F3/0Fl930jDWb1ys4zFIcbpnRTkafg9g+3MInbIWRScVjhIqGukbNg+xnMn1KWtk01lfL3rKE9F/Uc7Ib4Qy1zmO5FlLN9O5c/rNKqdhoMWt2NTZp4ybaXKoE4T5Ir6aB8invoPDg+EH6bWf+c0Y1Z2xprMdDix/eUkIWUbkKgv74Pp0U11999J6TIs7lDXJ8AJY3/2P0o8nA5ou2PfnNL3zlT33li9/x5ie+/rkbzt4sTi4l55OPLp+PdlsnIEQKRII1oroWEBPGOAHLrIOWsxusTA69lE9As3hwpUKyma5KXx5qGNFJxDMhSuEBd/RIBRojLVhrVHqVplhxeSwjTQ+APoPI7cdNHjQgGNzYrVxEsAv3kI2VzVR5FuOmfVKrkHDC0hJxVWxugJgA+otdenA/9Uq//9t7blnpIa6A+MYHYAW8hBHC4WVgw9lbrnjDtS/9sS995b/4qid98Qs3XbzNZ1lylvn4Cp9f2ZAwIM3OyuT8qhP34RCOVVnvvv2snOsbaX9+0NUBKbnVTeyuzzmitELNp4RGWWyKsVz4Z/AZAhjEr0SYSct3TNFOCB44kSfakiXIpJ9rJgRp77WIRB3pHrcPgLc+3/qeuVfTaCG2/Yo/36MVfvEeV9YHYKXma3wAVuqbGXFNGVi7ZcPln33Ni77/TTf83Nue+lUvPfOK82HY4fJhSeGTVD5VOb84+zA5R+EMiQPMAOdaBgYnHacqRpGuG5JqbJhNcJ6GNEKcgLnoAR6fihKZ5SmNZkjOTOJJ+ExNeiNhPbDaxYxAINC089cIjaILYXY5AYyesgeQUF2THrzanuOMdV/QSYOJB8fTPLvd9ZgZ9oyBJmtEfOKh6/9oxf9zQH/+wbvvvGfFR+kEL/MzPgDL/ALG8I+UgdXr1lzysquf/48+7+Z//TXP/IYbz376JbGKH1kt5zRS+LhqZXBa1cHp0w1YBUtVWSsuTvZ2AGdG07iCxWdyxqVNzrg0rFlXs/KVah5kxJpUmeLiDC1kBrk1Yx0aI2b2USCUQcyJHgIH3FmsEeDGRh8Rlj6ODQuWknvGMmualDOEpm87670YZmInJBWeioWwrkB6VP6mNrZFUmyLEDPeu1t7E2Pl3v/P+P3P4b2c8QE4vDwN1QnMwJZLz77maz/r5l/42ud+66vPv+4Jq9as5nSTOK5akaE6snw+YqnOX9gUiARb+kmjujg4YSkbTIkNQm/b4rzjx12qlLoHKrOcmPI11xuZ9KXwuSkj1arRiWeGNMfuJcMeAU3pm+OGqBBs9BnE5hERzBEa3PRtJRoMbhDsVtLkxlbFH1R20H0y12JlOBlF7Wr6eSbRpWKKtqbVPCDPnbnqL1f2b4F+8z2fJNBxHzID4wNwyBQNwQnKAD/gX3T9Vdd/7xe+8qe+6vGvftaajes4dzi/OJUUdSARCKcSp20RHEiGBcnZmuLiREOI4aPrYZBJT1eLqBqCi7ScAy8nxLYglJMzI8U+DIKwe+h6u2sI8ZcHI0qE/vmaqlhxRTvriTzdop4h6IVUbUTTkmasT235ejREKQdOMWVJikKoD/LQY6tOpCflK1XTDjLvoIMIf+Z+7U9zK/D52V/5wEdu2b4CA1uBIY0PwAp8KaddSOvO2PikN73gxp99+3V//7XnPfNyDh6fOKTB51QGDc4aTkmOJc6enBBswSFPcaRJ6noIIylfnHFBnbQ43ZA0vaH2dLYq1RlXZmo+IqZwKlgeSryViNaCSXzZkc4aCeuBVR48OggEIfNtMJoZERh1Nw8g1aJPNoQYiB+7PMz1lnmOE4INRBnRfeIAs8aaIc0/3vgqIJ/5BMGWyCQhUokLTWLiITyXBLpjX/zWivxPQmx/cM87/91fEuG4DycD4wNwOFl6TJrR+VEycPZTLn7u3331zf/qa57ylhdvOHeLzxfOneDYcydOLp87VEYyOH3M1nlUkqgSTR1a1eDUtp4DDD1qRUPK36Q3C8BJ1hF1xC663ojZEuESPayR8lojVsvCRuIFOKMjZqPFDI+f4ot1A59ms+mNoNKkzwmIHk95hk30PQNauDjxW6vpm2cjqXA8aduRV11+pPCMzGJNPlOll2RWvjImvb8BXa9f3KHdaXpFPe/+T+//zH3jXwA+3HcyPgCHm6mhO4YZWLVuzeU3PePlP/FlL33Hl1z68qesWrvaJ8t0yviY4pQR5w4HlOQTUFxNw0EosxSYM41g0QBFQPtk4gkcZAoP5iCbviONpUQljy5fXZ8qBGd0Ey7FxSmJidFYSne1hvExU9g4kJ2m7KFGlK86o8tDZ3GcQWwWIqAqpDq7bUeFhDs0JKx3L5rc5ZOau4cIYs0UD84agoIbm5JIowhsBgl3ZXRXBePfjBy/uMjtpO/xg9y/P359B73gV8p9970Pvfs//fVKieZkiGN8AE6Gt3QKxbjp/DOe9taXf/a/+tpnfdPNZ155QT+PkmOnfr8RHE3p6eYSxLAK4bgSGuw64eo0BKARnFauOKEShCcQWs+5lrZBu/5gBC59DrrbjJ0QRsssD1kmYrcmPWf0UoRWpno8jRWxRBvd7mk2Dz1aAheulWGWvuKK0sdBCFTPmxSlka+UlVpAsNvo0ygCafYs2yBoUr5SDoqiaypmWLiZvkXYkX+3I27Zi71S7m/9iT98YOdKCkgrJTOPFMf4ADxSZgZ+jDOw+eKzrv3Wz73x3W+/6vOvW7t1fYjjShTiwsycIfx0CUYJkompsjmJUhFudz0HlJE01DQmaIGg8ylpfdILGwQXttHSVVpAxMVYJU/57DZLL1fWcyY2M6mIxxpMXNDN3rIhsG7hIZmRTXxO+ozoEZpoGjzIl8cyogggvBGs9WnTAh40EbCYZqmWIvTtOBR3sa6jPNtK+6zRq3A4DBBQsiYFooxmIwEIUasI1ffGgBJkV+pH7tWO/VoJ10/9u/f9zp/cuhIiOYliGB+Ak+hlnayhbrrwzOd+y6tu+Om38tueWBWchsH5wgkSdbAwLR8mdXIVEo2l5LQqSUeCBlJKtZNIhbgAKL3qaog4K7PpE5vTkJJhGuvSLAce5x3RNNL9K0IjklmXtJpZiPsqJ/du+VGKy4VbE8uA9KlZ2wO0WRFt6R2CfJUeFj1l0/PVwTY7ezyLakQ/i+ea6P6LriIYxQM0b3iuSIx0usyohIJkPIzeveCsCQrisTfhSejFnwD+6X1a9ut/vu+OH/rXf77sYZx0AYwPwEn3yk6mgDn6n/PNn3Pju776shueHhEcGnW2TmeWDxOBeEq2wZvJyeLDrPQUnEENEY1Jn/IJKK6UwkdTCkS+OCVB6DZDsCPKJ2ecBItG1ictzsEJIR4FmqQUXtU1zSxkYumlWILQAKkIPRcGdDeedPyJz7neyIKeABVhGpDYwqNkRNDkBqHkjpgjsRAbFBoQDG5sl2oe0nZiq8VGNUOITh5LXLDlAX2PHwS89EbkwRtLaThCf7Irf21Z/6+3br1zx9f/wO+nI3Kw4zn8DIwPwOHnaiiPIAP8rv/Z3/TZN77rbZfd+PRYvcrnCGdHcoDUz49l290SJBscnEecLeGjqQqJk67t77nep3ljqzTBIVr2TD/XzD2ojwIy6ZNTrNzP9Pa2BEl8IpfkESY9EZposyu9kSB+GnYmdT2nJ8oDPBhRojBbPlN1xTTfdo6DPQoCiwsGVBtXvia9PbstTYgIUdGKGdszEHMPHdEkJfSgkwN0HTU7W4X8q+35vmX6R4L27N3/Nd/7e+Of/NFRXeMDcFRpG50eOQMbz9ny7G+8+cafedvjP/uaWM1BwVFRak4KzMzgTGk2hx9nipYgAZKdtjBhDYkzsbsBsSNRiIKjaab3iYYHoLAeXDwNUbiWneHBlTjveGymTCatzGYmcp/saEBgIVCWP5sg3c5mLugzguBSvigrKouqXZ0pIoBgCdZ6ENP1cO5HwLqBTUUZcSAC3u5iMTMqWluZEeF4eTxIjVIzkzWJyezCtrgSgJBrRi7cK0jRQd8AABAASURBVAPCDeLXpDdBY0FvZJ/iu+/W7+9Mndjrjs/sfP23/Mb7/mb8l5+PMu/jA3CUiTt0t9NPsfGcrc/6hhtv+vmvefznPLP99xuC84UTJDgjnA5ODZ8jVIVEYylBkCTk7M8HWR0kznHYMO0CYNLPHXPSoVFpup4zy+cXXtyLqlgXPE0jM35AsO3Bre6sNG4rO4IGm0FU7lyY7yynZ6Jw/IWkaFlpjegFQCV11nqgpne0WnpxpjcgWiRVLiLNbmVMOfGZbs+MMvcZhQiN4xGxTPo2Ot8G9C7hYBUu1PVu+CHYhlRj5tPSQvZKP3Gvfva+3OdM6gRc7/3AXa/95l9//8fuPQFjnapDjA/AqfpmT+i8Npy95Vlff+NNP/f2J37uc1atXsUJ4pOI8yKTw8HHDmeQZjZnk2YaHzxmATDR9AYexIUHHzaCBsGbT0YQ+cIGoZs4Hw1gZgQesiGwaERl1uPazMamHGEjU/aQ4jxLzKomdvKQmhBoMYgmBKf4BM2M0sDSKr014up6IlSEG2A1I6JKAJrcHotKaFQe0MNaQ7vdaCJiZmPYzwKCiUaaa0DKG37ENekdW6Zg0Xf1Qvwh4szSC83cg+EMiCkDcsPIr+3I7/mMHjz+/5mIX/39j3/xd/zm+E9++iU8hmfVY+g7uo4MiJ/0r37z9Tf/3N96wmuevar+fS6fBUnhny6pOF8oOSiCk6UqjrTgLFnQdJh0cgrTwTSdmgfOrIQpTUOqMwXoXO/Tx7qGQOUcYUQAenCKJaKqapBkGCNVFaIyJSplCSVsi8wvIm5rwYOaPsXlwnzp3VDixfHPERViz1OAIFP8BTf9lAH54qSmaiVGdP1cMyGQydPHLXezDATvYikiEKRCkuECy6MTIsIZAhM+/Se26BnLdwXgL3blN92Rv7Ujj9NX4MOfvO9t3/27/9sP/w9++08cK/M+WaIaH4CT5U2txDgvuPYJN/z0W5/65S9ZtW51sPXrwPEx4jOCc4RKhjlCODm0gNjm1KPDXBNClPKJhiVOkxAsCHYh9gMioRHerA/sFBdFuMpisez/YRCg8pMSJqKwS7eAGyIca0IKkkcBQY5ZPCdmKvgf3QCW6FVwUkHi3/54kpg5qVUXLN4yImhStDOdMsIIoG2PYiVNbiPFxjye5qE0rahREHOjdySyJjurmOarjmSNR6NiKxYNwZWHmd4TkOPRgj5pJCiQB2ge4jP785/fl99yx773H9O/Gb73gV3f8zN/8qpv/LXf+qNPaVzHIgPjA3Assnj6+dh43hkv/D/e8KLveeOWi87ilAnOBY6T4IyoXPhI4ABJToeC/bNkNA0Sw0aKTXegaCdamHYhyNIIBBs3EseSTxkQzizOmgSp0c22XuJKWCONlTjSCknM6oUDLUGqb07u3fKjrK5SVZ21M6nmUkhi2x+aud5AZyc9ULQ5ql0eIczigVwpio0JQRSFYMzuGeJZFztDrLFL13w7Xan7pC59G4XSIxKPur7l2Y3w6MCVJQNqCB4mvfuWf9ONtQVcjSrcQPPJffEP7tz/fXfvu2UPiB7LtXvPvp/+D3/9yrf/yrt/5QP7jtOfLB5LfCdt3/EBOGlf3TIFzu95nvIlL7r53W+76AVXEQL7PDgNs3Y4BScI52ARwganVM40pfcZBKIl+oyw1L2UwXlDXxq4KhuEbuLUmyHWp3onyCyGgvML2N1kvXGcIUdUiPDWzkQjxK+OuBL6RQ+0J6S6CcciwtKAqLGUJjyKETuOqOAMw6JPALpzM7oYN1VICk3CosHsN5oID0Abu5URcySYXdJ3jqib3Q+90OBb01hGuqg01tsDuNClwiGnSi/sTEs8o7k+imiaSd87Z8KJhuyBRvzxQ/o7d+z/h3fs+7UH9t+9L3Uk1559+3/3T2799n/6hy/8il/+/p977307Vvb/C8GRTG2FaMcHYIW8iJMjDH7nc9PPvO2pb3nxqnVrvNGTon5+jLblXQY7n/MiJjs5QeaamFifODFpSm8EYInPJC9+2klnPd5QSw0RHWQYw0eRtUBlpqpqbJkWcTA3BLaNaD2PSR94kvmD9Hijq9RY65cirSt4SjXH8uAGWBRC12wAiin+QsKaCVG/csGDorOcwt3FhKB+GCQqnmDcGqD89/j5BtNnEZnZgWVnrpsH4cH5PggxkFVIck3R8mkHNJTlwa390l/t0c/cu//tn9739+7Y+x+37/urXfs/uic/vSc/sy93VoS7Mu/bl3fs3f+JPfmh3fv/4MF9P3bXni+/dc///psf/8X/9jf3PjCOfh2Pa3wAjkdWT0Gfmy448/rv+gJ+57P5gm21Yeuo4JRhn7Pb2ebYRXC+xAwptp0LahrlxPazbKmenpxTXUqjWI8VPgGd2OKMKMJtm/h0BQILyIgRDsi2hA7EleAZt5kpNOICWfDQZlEko8snoIL/gYcYRiCwamaP1mRnGQNv+BSdmojRO+mgUqCZEcZs08M+s/QAiz7xk0D2YL1tmtwTgtn0LiMYoCEqE/00ikeEMpIUPQZXRnOmd0uOxwh02E5hZSHuXKPwRpQBoZQ1xWJZuYBYbwga9EO79S/v28+vhr75tr1ff/u+t96690tu2ft5n9j9Rbfs/fJP7flbn973jbfu+bu37f3BO/f+zoO5Y78u+aLnbLv2Mo3r+GRgfACOeV5PNYf+nc+Xvpgf/C98/hXBPme3B/tZ7GeOHNlMFRKNbUgRHQlDTaOmMcLZ4T8ZRENkTbhQKZf65KxJ9IxdpOrKpPJTrHzgdQ0252Nju09xZlnrEWymSl8a26U30WGbqr7l02MV1LBmVufSZ5W03SOYkfUeSg+j95le+lRdS/WGos0IB4nnpndprp6srhWz25O+NBVbuCyRc4YjZMVWPMViFRJmGyKwrk/DHqbekb0Vh8smNeJG+0ayEkovLqPFdqTrDTVWeMru3xpJpbGdKVcdkUPTJW9+7voLtmKP+5hnYHwAjnlKTymHF73gypveVb/zWbs6OJXkfasUu7ROH3Y1Jts0qTgLoioBIDKJ3pVh9raJBUS2ux8oC0HcWYyVQBwsIBApClEYUbvQyAiQsMs/RQgP6Dm5hI1/SiChgeLOZC7u5ZNaZrPpUw0BAnEfWE5JBYgaS9mJquwm8NxhKvT4V7sYXXLo0T2gh0WjutB3pJq2MegV4Q4z2wh+aDNq4qGsihbLrPXNmzCNaO6hzAyqbJq0pmbUi8zAUTUSiUMGoXIDZNJ7eNV8F/QphKIotopAM0OwcaF+EZtAJDzYth4P/X2RAojC4TEVq+Pyt1+/av0ajetYZ2B8AI51Rk8Vf/zO58Xf+yZ+7bP5om0cC+GzJpmcN3KwZdmZ7NikMlJsUJa0Cs64LH2i6UhVtbeXePCetxRh9QpYTh/UEidFDUDDsAQy6UsDGxw/Zc/JOYK+RpyQtKgQMUx1xZhY5RzBRqGUydJoxppQzbf0KV8ZhUx6QzHFT5iCsIeao9rlHIb9Nw+Kuf4gRAciBBHuK49bA+C0IWqRyFd0nx4LKW4W9AlSXYuloYzyqeYhGCSrkIqtohBxmWl6Wwbc2XY5zUUEu+6oeKyhGU3fc7JU75afiHXnbr70Lc9DvtLvky2+8QE42d7YCYn3ytdfe/PPvO2C5z7Bo7GT2aScCzTYjtggHAtGaIgTof3s30/Vppmzs73NqTHTiwt9VOcq6MbBnuHTAVK0g5qxwnWZaasQ2I7Agjge3NiDq+oNvKB3DyNAVD7dcIBeOGi9UQQ4bEC5tWCinJDOMgbxMDupI9ggdoZPZifMzAjT2LQ09y8uNGFE4Vnj36NgQ81uayJaExuDMqIyiUf7dyTSXAMJA5J2Ofmshgt3hWj6itlmhiMBRy97KGkV9h/igkUv2QMFg3QEPVGJiw7MRcXSz5KkkQ2BLSTQAMkNYYvRaYhR7McINsNY1JCtT7vwnJdfadF4jl0Gxgfg2OXylPC08ZwtL/2hNz/r626c/XM+imkfMsFgxyo4KWrHcu6DcWA0BEJs2LBGpSmEve2fLqMhMhsuBFt7241oLDs/0S+4ESxOjahYyhpxAUEjBUJx9Wjdspmq+BtbZmlUo6RkjbiYS2lmULUmVqnqm1UiNxstZlrJE4w4sQSInrOy6U2j0BK9uKLNiJ7MuuwZAju7naVqNDbwk6mKrSFFZpUUHpcKr9E0k36aBWTAUlFGYynVosWx429V86BiKUtfLJYSDbEFdkK2waoEEZcZP7ANKXeFJH3taIYgL00wVmbYRmNvUQj6C1779E2PP7uEozg2GRgfgGOTx1PDy+U3PePGd73t/Gdd3k5DNji7jh0uV+KyzZYU+5NTBkAoxcklI0oJNqnYvguIbLsvtERBrxAaib5dbk2dCAKARU8pLnwKFn2WPsE6y1h4oG2yNEprCsFbBJ1TPkGEN3q5QtOQgkRfAXtGAK1lpWziwBVPCrvj3cM0otmUyoNdpLtmBrHZdMsPiEw3u5VoMLjxjE2J3e4F254BQazx6ExO4cllKKC4YSmJJUBqXBBrrC8PXY8KuhDUKg/ZkUlvQhV/IFdjKcsCmev5ussaEOutge8IedbECp8pNFJnsem1VFNro8fWJtkQBo7Vqx731hes3rxO4zpGGRgfgGOUyJPczbqtG1/8PW+87n//3HWbN3BqMJvamOxY9io7nH072enzgj0J4T3J7s0sfc6RIpqfMmcespQU7PAsPd6QSP0saKMcjDS9DzDOjrS8EKE/2EMhJeoxKH2ugcge3Ek5mfbn5wCkCVuJVAselGLWlAeyibCSYX81YqpfByJR8w176JoopMurWkDa6JTTrKVwX6lFIl/RPfRsE8mEwNLXx6m6fhaP1BADcw1pVUNsSdWIPiIzB3CjEMdf66GQru8a8m83kkpKCaKmKaTY5kGwhNiRqg5G1mzd8LivfL5xjesYZGB8AI5BEk92Fxded8XNP/v2C697otjCSrae2JLYHCHeqyA01Nl+ypjoSFUx4ZwFUQiFuOiaSz0AgliPxVCweEtFuN31HUlDHAsZYYIWCDqfIyC07SdBEOEBFiwTszz4dAOABMKg5AxV6TWrrFfpGYSI6GVhIRQTsqBvI4oQmK+6ns6pBT0sTW5H2zX4Kk1mOHLIfqMBaQ1sjF33P3jfh++490O3cd/zwdvu+/DtlPd+6PbpNnLfhynR3H7fh8Fvu/8jd9xnBPv2+z9Cafa+D9++49P34TNq2uFIWgyO3/GKyOWCqMQF6ywZEQWSjjQP4spUxR/YzKn57G6a3jkPNBYUgp1ZelESj0Ck4H+ZsiTVERoS3ozzPcO0NyqyvfnK887/nKdoXMciA+MDcCyyWD5OxmLNpnXX/d3PffH3vnH9GZsU3nDMInnCOzDY1fKOZdcpQLA5F7JstTJKg81+bnYrQZTiqi3cdy/IxNpP4FII2eFJhUhcKXEK0M00I9IJwHrVZRhjita9ut7xN3ZGMkJDcGGlSuMq+miZAAAQAElEQVRCmB1hhIYAZY1IOUNUiAgLZxIa5cx/Jm3HVkh2tuUEOYB8TawHDNjEg3uZ64+l5JDWLb/913/1L37nPf/g3//R3//lv/yJ//a+f/L/cv/VP+0lxnT/Vhku//qfUf7WX/+z3/6rf+oS4/3v/O0qfwfj/e/8nb/8od/4o7/37//yx3/z4//xvTvv3l7xELnjYURX03z9rouJKX4jZnNC3FBzgcb9zfhJuQQp1nYmLatmSG+jdAasUaqzRuCTp4gq3OKJljdK5bk3Pmn9RWegGvdjzMD4ADzGBJ7E3c992qU3v/vtj7/pGdP+r10mhdiwScXOD/Zb0m6IT2oQNqzZ2ttN0xFxRvQ9LHpxUAiEvpLPaHFN+pRZCgZH0xuwaIC0RA+AntEbiR6fcwQ6Ag8pouUxmQrVRTxlEi0+lYBlWqQJAcYBkPCQwLik0hzBtIgnNWmKtTLwY1iFMCIR1vAERQ/QxGchtrP0lOh917lv9qG7t//5j/zGx375T+75y0/tuW+nuWP35J59Oz5+9+2//6G//OH/esd7/iam2BxgxQ9CdPLsUs1yUNjMiPgRZgFJwzFXo4oUvXgmn8X6fc3ZSrp1wjV1eWNcmtydbf5pO6uyN4rYt3Pvztu3b//onQ985K4dn753387dUlz4hms0rsecgfEBeMwpPAkdrF635llff+PLf/TLNp6z1XuRrZ/ee+38PRBhExfkXc3mZecWEt7zJtwrTERDwrazkt69E9v9x4ImmpBTIHOpnq3f9Ad7kOb6rpkjmiMcIbL/lJ1huppGbOSEpGYaoq1kSB3iFMtuVmUPROuuEggj2k5xuTBfHtxQouD0zDkixRQ/blRXQ277gw/96ff96vaP3lXYcSz27973sV/84w/8zO/v3bnHGXLIWQWDug7PSLaykMyGqL870zOWjCFlbcwQklt6d/ZTjWLd8rMUIUuaIZIspXDedm9/6IFPfGbHJ+7ec8+O3L0/9+7bd/9DD378nofuuJ9fBG192oVaKdfJGseqkzXwEffRZmDbFeff9NNvu/L117LpvPc4AzLFqSQF/8OeISlflGx5ZbEo2OBJxc5vCBp3QpNd09jClyDoMxNcFF3vweTRgewZDZVgRYEJ3ho+EULWh/VYsNZUxUndEPTWCE2q9Ao7SHF+pQrplbqwKgo5WgdYIlkPYmKJBzdSviiJSgBuIazOFCDkB5D5RkWC3e6GzGwMEH68/fC/ec/+Xftonpj7vr/69Cf+03vlOVKIaGvS8xmBiKsm4wIblfUp55PCE5YReY5mC6n52hucAfR+O0ZwJEN0SAxuELxR4kdCQza4d927Y8dH737oU/f5533YMCMuuoV237Nz970Pnv/ap2sVOOi4jzID4wNwlIk7Sbs96fOfd8M7v2rLxduIn61UG46CU8wnnfc8Oy2xjUB4U7PFspmu0oXZ8I51A014U9tm6zZpdNZKj2WSU8AVehCXPikaUiMCNQS6wRhh19Sc8tHYKg1L4bNDvhIP9NcEmeiszcZmR2QIafI0E0RZPsHaiG51fWmiZlQImkBE7yoJTe3q7BJ9z0ATTHo8GIiay/7d+z7wL/+HOmb8xDx3//HH733/rZ6Jh569nYyKX5WTKkz7qUbTu5RU0irgC6tGWeLq6AFvp2YN63uuR6t9e/ftuuuB7R+5c9ftD+zbvVfNUWks5imE4qG7Hlh//pazrq9/VxF83EeVgfEBOKq0nYSd1mxY+8Lv/Lxnfu0N9UMTO8iby0cXu10ZnG7egAAp9mchSgk2qZpJoxA1vXFRGDZSNueduPiW4BN39iAKzJkGId04DDPCnYWpnPScRABNb0KOZ0Ksp681AUlsVCY9rk0jsGjwQFeLxOx4bKZKRItvFSblAlKm0DQP5bNEqr6Bn1SJXLlvNSiYr6xRxDSj9IzQAEBxY0shLkvwQIQZER/55T/mOAM+8Te/C9rz4O5wUMTj+RIgcRYwR5jZHJHQt/kyARqZmrNukL0ZQjYV0xuc9Fl6cTEWdEr86efBW+/z0X/3Du3Dy6RBSktOWenVzNiXe3ftPe9znrJqw/hvBOmor/EBOOrUnUwdt1xy9o0/+dZLX/oUdqA3lHdlPezM9E7zfi4ifMaxH2GTnUZlhEo8S5Ew5CwYZs+7WvA/Q5obqcYSl4WN5cTJAhSMywiBzxaPNNcfhGiOMKJ8ZXBE2JkruxEOGumWH2mC3FrUQzDwImJFpuxMomJE2ykuF+ZL74YShecyR6SY4seN6pohC/rYu2vP7X/woeKXodhz/0P3/PknfQrL0wsXhNHfDunzPHOGkKScIbDVybSf6lysW36WIsxaM8Qu8aZQ7ObX+p+854GP3rX3/ocYGMSrERIXQTWX4sFA0gsTXKs3rj33pifbGs9RZWB8AI4qbSdVp4uvv+rGn/yqLZee7X3OqST2T9/oIAGS8kUJLHY4uwwNGzyp2I1RVWkKydKkCqbSXDPzkMYhrEn07OQUYxniAUEKgq0wmc2d0Ex6xyZfxVlk1oBjoxeVEWiTGbgsfwCwzE5UDclmUvmkxkemGqQaUfaAidoEbATusM2I71OaFZfh1BzBJhBGx7PqmiNudn3XGPFYTZ87PnUPQzZwWcodt94rOUQ5D3LCHBBzSRoJB0Q6ar5CY9YTsJ2ClFxWtjnARdqYqrjoZb2ssQ2cwg+P7IHf4/OXHw/deu/eHbsBgGQ2S48JgF5UwgcmYWJVqTWxuv5fic56yRVrz96kcR1VBsYH4KjStthpBduxKp75tz7rRd/1hWs2+t+eD3ZXendxXottarvvc2/q8Eargq3WALNBL1phVtiZYgdWWTB7Po3TQJKQhXQ9EKT9QHAABB5EDKWR2XChxoorMzg1Ekfu1dhWQpYHJVbT0C3RA0uFlDKrlORA5Ssn00i4EEjrRjlD0kLHVkg2EWVlDKF8pTrb/LQZ1ehm/dT4ZtOtRF9zmSHqiCR/AKiW737QHwBC5DUkUXimcvw1x7KAq1GFG0hVDevo43YDKvOWeKpA/ioUi036Sp/79+7bedf2+z9y587b7s9d+8h5+aAovuuXVG4U6QL/0vqzN8sNrVod53/u0+g87qPIwPgAHEXSTo4u68/c9Iofe8uTvvD5bBP2HkGzt4PTqvaPEc4ssWPZq2Ivea92syrvObPG5YY1D6O3xt4swcakLA8uarDMCDdmHson5yx+m96d5XgmxPpU72SNiXrSMHoqPCSYkZghdLIeAEhL5isy0BDcI5JHxAOnMyZybGui9QoByXZOplmBJvoKDluweEj7hAMhIJktJMGYbzCWTbf8JHp7feCWe2gu4/3Qp+/L/U4GIRN7UCWBMiOFJ4ENnDSAw4GmKidGsFRsFcEcaXJbiocsPW38J3p+a7/z0/c98KE7d9+1I/fsD/tXaRJRezsYRuwBE7xE5R9ptbV6y/p1Z20iq01xxrMu2XjZWdjjPtIMjA/AkWbs5NCfffXFN7/rbec89RLCZc/IW8270XuM7QV0EBJtV7PTlApXATLZByNmE591CscSvXfmwQgSO57p6Yt3iVMjTXBIVKcJER00Q2ABuCtw9JwLMw+QKbQ5Q3z6GFGWHnOmn5C5PsuUqNAzbKa4XHj87qGQqJwUYhqtkdJXgUjRZgRniec7Q0zjoaTOkrR/994Cl63Yv2ff/j17QuSQGBytqlGFERiQFq0nVI1i3fITU25rXvTRDHHDDvY+sGvHJ+/e8dG7/C+4ubNcuLOqcMtPtcqNfVbvLGkVqVXrV6+/5MxNl5yJMMgkFe4zz3rZFSU+0cXJPt74AJzsb/Bh4r/qDde98sffsv6szeyQtq29ezmV5F2kdGXE+8eIbbabsvTyxRZcRLBB2GkzDUjZ7kuH5rMQ2W7nL+bk0/ppLGprGovTDGIDwVSGvaXCdZlJ6VmgsYWZgd3jkXXYQY3S42IhEhqBNBPX2JxuCmZtPb4KSZBiYwFpNjGjtF52371lFKKY6bNYgbRsUEZAp+w4w/qEpck9sQoitH+w5b6ZqYjH4VI7KGKr+Tp9jr9YOEuYS2Uy3BAXHawXQOkpukb7c/c9O7Z/7K4Hb7ln7449zaXLNiJ96/bPJYwiPEDQV7hWYGPYJImrN6/b9Lhtmy8/Z92W9ekRcQNcmtDWZ1zEXwiXehRHkIHxATiCZK186er1a67/zjc8++tuitWr2I3eV95F3ifeM95KUhFVpAoJ9l6Whj0VBRVSbE569nx2pKpAM9dPvTrSvXVN18OpvNkPjc5ydnh0AMg+CkeIukt2eNPj0xot0ReiSUOrWBUS5aESIC6yUQjemt5jTWxH3KOZzYPtnGnsofu3UGg8YgvWSBQb1auxUYi4GJZSis7SC880tOxXppyZlCq4KtxoUyLQzrrdJNmRkjZIxTYbdt+evQ/d+YB/0X/79v0P7YHFjyAmxyCYlNxRaynsIdV8isxgKyPWbNu4+fHnbLp02+pN6ya4fen9BkGEcPWqrc/2n3c1riPJwKojEQ/tis7A5gu33fjP33rpy57Sz6kWrDe39wm7i30C5i8Bm0sqJFW7LjinlIUIwh6qEqw9aAlCyx7Quyqh/bDDoxpVmPVYNPBiIQjuJI8lLtjSp8xS4CDl2kW3PDrxi8tmr4wEzrJ8Oh4jkLiQ/bt3ppqGKkXBqUEp+qk0wblThBHbNJqJR+zSExumYcYCyQg8+E4GELQKscgzwrPNmQf0vQMs3egUsYB0E2bZbsLh/Xr4Cs5FNdRy4inKYUKQh9RB+tR0Mcd9u/ftuO2+Bz5y5667tue++usFOjQBQrxRVtM+yRM+leGxCmUU6zNWr153zpYtTzx3wwVbV69bQyc0qoposRnLHSbkzOdd5uZ4jiQD4wNwJNlawdqzr774pp966xmXn8sJGOwodhHRem/4zGqmTFAsIt6O4b2HlK6Cpgo8sNWqimJdLkWEhlGCik6cv0k125NBr67PUlLUuIGe3Q4n+aw0S8OwBMLo4koZsf8WIRJxLJT/OQK0BEmB4MF9laWXNNNnmVJV1uBfxMPj1qQ3EhX/HMEbSOmroItiir8QZ2CGQNtDERUhwKI+3ZYRdVPLeFWY0aY9ZY9wprxVhC5iEWn6CUEu7XngoQc/ec/2v7lz77077bP0kjVqV+vkkdy2T7KqLDgRKsGDX/RvuPCMzVecs/7czav8Z1nnFoJzv2miejUbnF4gGx63bd35W9wcz2FnYHwADjtVK1h44bVPfMWPfOnaLRvYveJUaqGyl7z12F0BwOOTCESFwIKyTa0HqU0JC+LdpeB/2CCld1/rZbgQ4YG+aNwVD5YWK67SzxBYRBnWQ9I1g5q+4brMOYLjjsCioatwzORSIPQmwlzUp9BkI1OwPJSZsvukNTNx4HPErLDpJ8KEXkSM4p8vFl3lltksvSa944lgAPwTU0ZpYFUXGYgIzPCsS5OJDTK70cz0M/DEG46SGTh+EQ/5AanYOHkV1RBXa/IAnwAAEABJREFUJo2UAGY5obE/c8+9D3LuP3jLvXt27IppviRIgZYeahcORLZFofLAqBltXNqZa7as2/i4M7dcfu7aMzeuan6stwYpfconxYQUC54ycubzL8ce9+FnYHwADj9XByhXSvOyVzztJd/7ptXr17It1PZMCy28pVzIO5AnvNO8T9gtCliJ/elNWYpCAo3QyBqxvbDDdjR9lS4SkhGj60sjE+FCja2SotiKrbFRvcQ1H53TduaT0aXSq7xFlZLjkS+UTW+ksdNUoIkZD6muN99Zy0HNdoRWZtlZpkSlDCLMFJeL8PjVF0CpqNjCSEpmY4leXBNLkjK6vmKGq7u5x1u1lrPw+2UWmcE8mRBzUUbNriPVUCvRONii9+7feaf/0z0P3nb//t37mGrpsysnveU8wPRtJU1ZGzWWVsXaMzby255Nl5y1dtP6igdnMuuo2vqhM90qhzU4tOytWMjMM699nBgU1bgPLwPjA3B4eVqpqqtef+0L/v7rYvWq2i7eG0GoyQOQbIaUCqFms7CrvVsKMeGf8uBNNn1p2JMNocXJpYymabtObDXaNETFXoXtfqQJsUb0bX5qDzOAeidMiBCXEfyjTy3RT4iEDv+UQEKjuvDJVs9URQuLRvYmTcikR8OIQu4KNDXT0+r6guR2yh7SemHTidKuF5EgEmBxUVXmAxc0m55SEXMkrEdpAQ/RRidpLfvt+OUpUpAC4gQREdb7LWRp/Pt273nw9u33f+SO3Xc9kHv8HzFlRnRwT2bDe3Hn3gJwIif/oEYatCY2nLt1yxPO3XjRGavWrgaHDXVpjU4kYMSggnPOMorhObJq89otT71A4zrsDIwPwGGnauUJr/nqVzz7b98s7zRVyU7wrlJ4W0Q7xWzO2L6XvHECoulzqd5fiEVEFi5oGIHtaRcQCGf6LCVFjTL3L83OjpRhSY45xZWKilOFhF1ilgezLUIB+XwRdCGpGeIzwvFIclUeskypKiPZTAlEWUNJ2OCMvohgF2KyWIYsfT4MonZ5hK4pINp8HU4WoI60RpUHIwUvVzHLiRxxOPQqiKe930LIhbRv194dt/KL/rt237OjODE9PnfRZl2ahsiX/bl2klSFWzyrNqzdcOFWfupfd86mVWv5CQa2++Od0iCUmN4F9sFIY1s5Y8+47nE4P+73qTLA+ACclG+Szfb8b3vt1V98fRA+WyzYgFR9m9BgP7CLkLWDuhDvrqV6EITuTDXp7ac5MlJE+TE+QwqWSw+Ah7KV5T9LL67ScySkwowQZtpKI4nCZEaYoAUCm8XSVJ0pIFP8xjpJ5dNBsKWHSlkvEPR2qRSaFDaIGGsRsc2TURpF8bZBLAUhfhlRxCzCnBC1y6N3jb0BgkSgx+RGz+AZ4QHcduRLEMBlvwmqAnS0BMeEjTgskPoeh3bv2PXgJz/zAH/He98uphrMmgqNpdYEdrsLKbPnAUBlktI1m9dt9D/Rf/a6MzcFF8mGNpvRRPQ8AIEFQalJA1I22UYuh0mRW55ywerN64yM5zAyMD4Ah5GkFSZZtXb1i7/7jZff9AziYtmzZdix4b0BwB6QfA56n3hvmEgQNGoaI4pp97IhFWymRb0UllZBX7oWq17O2WzKnBC+KNj9LEiTDcEbLUogs6XHm4xWtGpklap4QBgYu2bRIrR+RqKtCIXGSpXGhRF6FZuT3i0/+Gga9EojdbKoQsEncANAgixllgfogI1ChAVAJU2sQ2hsTDOSr5qv9b3DjCVC8yvgyVQ4QkKp1ESVIKSgmD3bH9r+0bsf/MQ9ex7YLTKgtF6JXdOe6TW/cOpGloNWaO22jfy2Z9Pj/Iv+6P6bF2cpynOXYpcHZyksDRBreRLHkB0JsyAQovOq2Hz1+RrX4WVgfAAOL08rRrVm07pXvONLL3rBlSz7FlTtEM5Z1j47oe2NDM4gpTXeKN5dKn5CxLkfIJazhVNdz0620D5xZnNChLfmpxPlYbIZxaY1uJM7YWOmffSCClGKsVJck4c0IoVJ96Kb0KiuTOZiBFZqGqoUF/FgQqSsT6BMzEJ8XmimBxIIrJopRldDENECpjM90CwgjN5g+NJnhGnRNuHQ0NDkJm/YVdLyXfYB+pqRSfetepmLmN6XAyKTzMshE7t23bNj+9/c9eAt9+7buYcZEyh5C/ImMgXgZFmHixmidtmprZTWrl537uatV5y38YIzVq9fU3pnPKAZCzfKwGdS0khct1GUsp3pUrDdZ7GqshAXKa7MiNhw+fjvApGLw7pXHZZqiFZGBtZv23zDT3zFuU+7NNgmLaRka3AOJi0/wVbIqL20FBG7xUiJ2IFhD0lniJjrFxAINJn0wrSmKoqDkc5OftB0JOziID0RImHwHjnnjoXo2umDkV2jCSEOa6jU5oiHLDNVlVmpTIlK5QESO6nMV3rkK4tVdpJKWezDIXRIHr6yiZDs0eCOFpvDSZrcHZkmvYjM7JmmEIreF2u57nQIbXaeDJnav2//rrsf3P7hO3bedv++h2b/tSKY9CN38BNd33IyQ2oiSa5WrV+z4eIztzzxnPXnbok1q0DoGtM6SXTdQxudhSB1BGEqSCWF10mZCwg8JKEXEfgEcTi5cXwAdLjXqsMVDt1yZ2DzhWfe+M6vPOMJ5xFIil3h5U/FyR7Bwpcv74cwQgORJVQgCNEklVmfXCig1ZGqAgAPlGKfo++syVyKoCkkU1z2WSIKmpScCOFKYixZNEfoC0xJZyKXrEn8G7ItX5kKairvbdt4cIU3fE5sYIO0rl3vSvRCUy6Exn58voSnlZ0V3SDpPyGmseeI7AEdfYnQnS2Bp2tmhBHTi0hrZ/nJ0kxITJEUYJ+aDaBlu2qKROtzdv++fQ/euX37h+/cefv9+/fu97RMwxIeZVtL2I673siEJKyTIuYo+Z/ov3Qbv/BZe8aGVbGKDrgpPS4zNOWNXtaD0FeGQXh3NtGkEcESm3ylZohsg1NhWkMFu+6iM6L+gSKN61AZ8Is5lGbwSzKwLI0zn3D+jf/sqzZfcGbUNiEGr3p2TrLu6xwxkYraM01jROG9VBo2R7FGEmWJwmUVRgpmP6N3SWd3wkMRbfd2pCqQ6otwric2SFVsMj3z1vcqAsO9SmomoK53/I2tYE0SYkPQWKnSuJCqV2MnfWsRQqppqupsIcGMlEsRHDckcVoj1oyEyeO79FnOKDyXqNHN+YkmJSduSY0Nj5iCy45gL9y91wKyDCbfbyn279nDz/v3fcj/ZCd/AlALrZULjQ4wI/pQZnakpqpVseaM+kX/JWe3fzOx2BRKKVR5s500lEBOkIyoIdaY4DFNPjsSJWqlzSw9o/tNBZ7pIRPBb4Eu24Y57kNmYHwADpmi5RdsvfTsz/rxt6zbtkmcOFKIVZ5VJGsdqyOw2VsTwp7IYG8Au1MKjYwoJW89qmbSKERm2XXigjRsRM22f8wFRNh1etqdqkDqwcRYzbQGR2lEvvAf1KkZggvmQim6SrBoXImLU6NMRsen6GZhlEjMjodeZkUtkJzpUWdHut5INE0gh23ePErrVnrmBY1pvUoYwSww0WcQSVK6yeNoqzNFnaczDWSzW1k+7c3jUosOWuZr/679O2655/4P38Vv/ImvRca0HdpCo+bFaWuYyRA0pPOAJcXqVevP27rliedtvuiM1evWIHJOyBKUmChaXJIxewCwB9KZ4FQNSPdSRlVAjBj2MCEIrccbChqissZvM9Uuw7lx/N8DtGwcqhwfgENlaLn5Teef8Yof/bK1W9YHKzvZCfJKrwb7xHvM20HqCKx5P+ycrk+FRTHtE/bMHKGHyQUNSBgSl2F2rKuCy8ZPNaoopGJDvoiww5ubmOvn8bfIZxpVtPYgRRu8ZiTbHr30HmZi6Qrplh+bZlW9p65Gis05omwIwkyJCsRCN+TCfOndAAniz5wj9JmizZJIiglZ0PNF6fSMrVmIa4Z4frSX9d7+sTv2bN9JbEE0LWRKN2ZhueGH6aEBDqfMSOaqdas3nn8Gf8e74ZzNq9esoqtMUPQMFNL0HbGbmQcaC/oyk84Fdz2xzZEijBCJhX0FAhNXvZHj9/fAjHBK3eMDsKJf54Ztm1/5o2/ZePYW+QxSzE8ZFr7XPbtFddV+AJGR2gQgpW+0IDj3g8omp2eK/aM0YpNGQtILXCnbrnisKZfdprO4mibNQojYXPHMEGyFHTephMZ6Q7blq7ilSIJNSAoPjOi52J+fhjRCLTOa6XMyXQuWhxKf1Y3W3KRT+TNiVlyVAc4dhZHmLcORQ3LPERrcpSdAa2hyg5TeSprcDcGIFgnj5lwPvtx3n2+PmCoIcR4UK0dEziNwaM+XBPF3vJsu3rb1CeeuO5s/nsJVNqkzxYGvmmPSrl7kEIQWCCya7tONmd7wTGM9rGb5JJKQkV5gugOVCsmQx9r4+LM1rsPIwPgAHEaSlknCr1Bf8SNfuvmibQrWt1c250ize8lSb7GlWPe1N5QgXc+uzkZUWR6KZ8uE9x4I34xJA1KEJWHXAeKGd3sYOEBvSOzq3quzQS8QyLnjahAYeNdPM5JiIhnGtqSKn8qIhZieS2NdpqRGEF9OppGFrhKRiKhEZrDx5pKWhaoLtmeA0ApReZj7pG+0mBstj0/hd1FIZ+0zC1BHWqPKGTLzNkOKX+4iMxz/FEZNcWpQZwGtFNMjkyzOjdPf8TakNOJyFipjRjJVlaYBEoURRb0dWuRExRrpeilYFq1IKrIdpW8lSL1GAmlKawppbzNWbVq79pxNGtehMjA+AIfK0DLxq9evffkPvdn/eWc2gncFK9vL3ku+dpeqFTKNmaLglJSvrmfHsq0Fwf6hahr2iRGZLRwPkGIfRhEu8GDYGggjso1+rhH+EKUcj7iaBzRGpDBJLyoajl9cmRFElTbVNa7ki7706nMs/0aAEr09lIkHxIVkdYXFpfXOAO7twcNmcGo0TWeTnpjWUJlFYymOiB/WzgLESpBomjDjB7qkkweGyggPb9Y+J4S23ZSfLM2EhDNmvIAVUDgeZjVFQmieb2u64Yc81HTWbFm/5Qnnbrp027rN67siU3iQ3Am7ZJ7jDIE1bt4PthOWQY8UF29ZaDQhsGjwI3UNSLFWqhP1dia765uHpNuG8dcAJOpQ9/gAHCpDy8HH6lUv+74vOvvJFytY+Bnsjb6+1REv+5RLLUGioLk+VUh496ZM5hIkDB2MROlbeQDrHRjuFaUpNsMAJmd0898RtUhML0UIRTIsKTxHlQfs8m9kxhqB9v5XYjSfGMretarST4jc8qPErOS5VUI9DCIPH9OM5nqQalQRiMpDWu7C850hgDHXmzYyRTvNQjEhsL670OZyPS22HkirWumAwrP2k2vP3LT1yvM2X3rW6vVrjJqFUMxmDRLt3fEltgs/HRHnNXzLJCOGuyadIWLuYQGBQFMdMK2pigI/lItItyc/sBvGvw3gNB3iGR+AQyToxNMRcf13vuG8Z8/cP+AAABAASURBVF3moVn9dV6EG37YOQKRjMC2HVKIuFIQaILKpn8axWTvGYGVO0wItmw3P8quYQuXjR9x0WtCZHu2txf1uKmxqK1BCIv/ZDrlfo5oinbynw0Jj9X0aVNqiMI1LfS2cDf3UCQIOx+FB0yViBbwZHr0jgBBoASjF3IQ244/6Jyqi8oznQY3q64P9+bJjEI0XY6wOgQRJh7cC7vxBRTCKAWhn8xqL1MRNa5LQnalioqGmKVWr1p7zuYzrjhv04VbV6+tf4/XqCUtfq+u8BJBzfTE3EVmSkThafOlVPA/bAsz0EzuDVtvAg/2Sa8ZYjitoa8rVZFCk4nPtCnHYCIpoCjXXbDVxngeNQPjA/Co6VkkT5T9vG99zaUvuVosYZZ2sPxTrHWeugM7WfeseKnY8BlkjaEw7cINP1GsS1oBKxUiTDoVEiCwIK20f3ZsKgyhLNinYSGMbjamXrDRhK6y6QM2U97n6JHIiGukHVHFX/pCUiDs/0CCWaVr/IgrGys5J9ZkM8VV+795Nys0tJopHDX/OQ3o3tEj9JElbDUWp6or6IabhcGdgfKAxmzU7Erci/CIsPjEW9O7bHSxNonWlRT2oGW/HLFnK3la8mUoYnWsP3/r1ivO3Xje1lizWuHpLUrC8acR0lRV0+ChHNhptNzazMYa6XopTMgFrKvoeq+xxhrp+iUa2IXVMtfbW2rNtg0a16EyMD4Ah8rQieWf8w03Pf7ma4JBveLr7Ai3/IB4g7DswVHQYD943RcrCPaD2JM2i6XgXGNHVV+OJbGFC1FaVHpM9rAJLeijpFUghciI0rhIWPcFpg9lglBJNbowQaxPWU/B4CnX4qJvVKUlendrCCwaJEBy/PKVWWyqENzjVN2/c0KvSY/GpjXMb9LjAL0JI2nWEIoMIzJCC4Vxu15Egmi7YypGTBDV1aKl0yKC3fCSECz6ZtLXBmyEjeV9HAITIgjKaqxat2rjBVu3XnX++rM3r1rFKQHh+EkQVkmojQQ5kTqCTQqqJS5spzCjcltACo1ASLEEi0a+0ChlRLDkh8akKUQAk54v6FJ9RVKdq8ADH4CNGtehMsCrPZRk8CcqA09584uuesPzGI2lrvBiD7ZA7ZAlCFvBhNBwgggNTyHhnWatn+7BXwhFiTpC/2xIlN4lWFgTIGXbcxyEALjr3GdJJHY1cbrhvcf+7IjoIMMYNTo1d3T9NMeCPCJGNg9SmJWv7GZV5W1CZE1DykTtVgk1Q4inIyKe1HyOEiJlgCQ454jUEDueI5MHIxKKfkL1mEHajOx+0kyI2pXzXqgqnpTH1bJfxEFwciV+v7/x0rO2XnHeurM3h2aw00GT+bqUVBOw3fImzZHmyN6cJWtAqgrP14SfIA0KEFjM8sML6EgAiQs4miaMRLMpIUxPHhygveKsafjjyzH870Iz1Cl5jw/ASnmtV7z62dd89SuiwqFkp4kTRMJmV4jFz4ovBNtIrfgoPjrL4vdZRjVpfFLDGim92Dk8lPYGbL3HEi6EM590VblAY9gapEYsYXB2Gu7cKD2iFLGluAqBTVHQNokHV0IzQ+oEoZVSRZgCEVc/NRgGJAF616qIXELvmKkqLMJsJg4YHd4IEBWdxOj4BJZbeEiQMgHECLBJX7eIORuiCLsAxGe4F2a/GT0iaAQzsp5g8WAEsN1opI7YxrOsKflMz1haEVdq7Zb1my47y/9Q/9b18nwdG4/nQNDMFJQSW2QvhS2ZlS/PkV4qBM3S+SpNtExK1pQeOINWsTgVPukrm2oebFqzVJ+wqCjBJw9e7YB9lNSaM8dvgcjHo93jA/Bo2Tlh3HnPeNy1f+dV4bXuMVMs7DojGhJshYwle6MQs2jFE+y9zGhIVQprBFI0okBDBSKUdeo1JAyplZiZzY5iW4kfdbhVrQS2H9VYQV8pqpe45pKmgWZcz0vTXFIKYHH1aN1q7MxniQgKEexSvVslFI7qLLD/jgCJEfu5IPw0pA1FV0NUCdz9Y9bo5SHtVOWh02rXxLaxPLuoXo2lnOR4oKWJbUp6zRCzy/5w9G+94lz/Z/o3r6+InaDKi0MzUrMzwsTCLBPwNHgflrgy61yp6WGDlWC9WQUlmYQ1X7DfS6ABC1gcOT+lVCujsZBJ34P1EChnvRY06VHWjA+ADnGND8AhEnQC6I3nbHnxd7+RP7GyZoPxau02u0xWeWragUrJGzAFYrNYCtXqT/miW9OISi4aUhqVpv2UVCfmgkZ2FDEhaj7dwQ9kGhENRqe0PiPQp0cRBRs/qxZX+Xc3TXojXc9+FvM1grScJl2xc/LJ/k8hx6kYBKohNlK2KYssR4UIPT4FUj73PLjrng98+hO/+Rfve/fv/uk7fu1P3/Hr3O/9kV9/7zt+7b0/8hvv/RGXf/Yjv/5nP9rv9/7or//5j/3Ge3/0N/7sx9r9X//sR3/jz3/8v/75j83vD/zC//fp//7B7R+7a9/uPYwVnp0jUV2FlOWpGy+EgGY2MWdUiF23rNWmS85atc7/ZCfxEgjRihlJIYBZzP19EbpgE9y8H+x6O+E3Qp/qhUbMEVuCRQNrk4ar2QoUVzlriJptPSYeDtbPEbpO8ZQp62fxr9o0/q/BnJZHecYH4FGScyKoVWtXv/T7vmj91o214MXiV7C+WcfNZv/kQYhqpyXx+el69mdCuFtHMDvS9IEzsKrCu9Fs7RYTSxAAk3OfAcJ47GoCdaNFiKh+/oLCnDTekyBSdP3ijGb65sEixyCuDAtFt4b4RGiIXHnYip8QEDHapG8Dmu9I6XNffvTX3vt73/IL733Hr3/4l/7o9vd85N4P3rZw3172rMTwfd8He4nR7w/dboNyum//gw9/+N+8589++Nf/8Nt/6fY//HCLVtMVbdbVbHaQ7QoarCEYzI5yRdyZQTYdiutwsiekGkYz4f3MEN5F67WIWIqwv+XSWxRkoOuTl8ML60iYpQNkNE0YibJbWXqK2WrMg/Q92gW9kVgzzjen6lGekaBHSc6JoF7w91531lUXsaKD0doeo+QEESuenZDCBsEsxGcN+1Osb1figkVjpIus8f5R8D+z4qzBxkROw7AmD7gpommUKpaCTTpvFIv/DMYCxlTiE5Gl8sW4QY03NLLICDaI9SXEDqtEhIkHiBQa+UqbhcBK6PDgyt44U5qJiHbCL+jnSBM9eOf2P/6h//I3//FPtQ+ljtO1f9e+D/3CH77vp35nz4O7GMLROvyMIK0ApMc22XOjHjQRzIwGMzqOsTHA4d4VrGMioWQ+FbwR254MjZTMyhfxC1YyUpqOIBJ6QTDfoLLpDGB2pDSTPkNzfZkglRPHM9lF2EMa4TXLo9vR3Kf1wps9U0OCZPLTFb3H/SgZGB+AR0lOo45j+aQ3PO+yVzyVVeu1yzjhZRus72QJe6krCqltAg8a3p/sBNhUQFBa09hCKOpnJUhUtBJ9IdYLwHBjCwl8atLIRLjAM1Ur6dQ8eH8WOyGl70WL3PTkrRADQq8UV48W1yqWkkOia2ak8KAFffGNneckyyyfylJUj9Snfv8D7/mu/3D/39wBdwLue/7ylj/93l/lF03RZsTcMlXRzpAeRlI7h1SoYCnLXs6CYBm+QnNsziRQ9AnwdjpbVWNd0ixNsH6sr6kE5fxdFNx8tvUDS2KMUMFSKimKhUz6mg18FkHBOC5bbsOiaCxlZmMDGMtVRxQRa8f5RlIe7R4JerTsHFeOv/h99tffyGoNNlobidVcq5xl7BXPmm6IVAha4Aw0MwQbDbxJtmqWmVGV8EAPNJoQxrLeRNeAFMt3CL3vCVHKbkoPW/o0IrzVWDQkivpZDJ+w7F5xLejZ20isDwiVxsZMn7R4YOmFFFve25hCpIofq7oCwM99im4QC/r9e/fd8tt/vX/X7P/I0F2P97Pnvp23/4F/F8TbaWMxlyCTmREOERCkRRtUTMJToQqo5b0dQRJJvSNnm/gcnLDBK/6uYUZSVLbFVez09gVRc+xvB3dGlKW3/0VEAHizB0xrqBb19Joh4sqMoINmmsmbuBg3XKlY+UI//n/BnIhHe8YH4NGyc/w4/uL3Jd/9puCqjVYDpYL1nazjpF1VeKe55aeznLBu+ekI2yQVOKIwW+YSBH/sUmikgc+q2DPgZbJjux4kk2KOTHp7hliqt/QAJByIop0ddMjZjGYe5gh7uOvpZWezDKRspqpqmjIlKpUHSOyk6tHaVHzkV/7kgVs+oxN+3fWnH7/zTz/WsyrNMvAwiFKendAwby33lQQQDqgKt/xUw5mvtDaEuRip+CmYAAi9i/VUgtW1oK/3299O0xeCmYq5vswFBN7hPBxCJ8Nzn9VXauutGlUgimPwdwA6xa/xAViGF8yvJl/6fV+8busGr9o2vvdMPx9T8goGYQ+Ik86VuIx43cMKkXcCFQh6NEnFKR/egaihNUMW9JiTTzrRQojnklYBa2jmp/lk38KqLvY8rLuy61xB0svu4FMWohEniHxhBzWjWI/V9B5FRMtjM1UiWhbKUFifZTbSNoToNYma3bpGaO+ePZ/8f/9Ky3Td8t/eNxvZsyYgt6c3mxkxZSllM1Ny7Fr2i0jIds6jIX6BSI4PVvXWChEXCFPJjOKjWMxptaAwJOvRYEulp0qe6Q02fQJp0gg9Uk16NQ2VEcE6kqJbYQRIjFV+Jn3G6nG+6dGvkaBHz89xYV/w7a8768oLar3WgmWQOgy8i7D7RvCpUUjKFSW7IuH9GAHm9PfqZ8WrdlRQKiEoemlvHWlsK8Vl2B5K6Qa9OuuhmmfI0pS+F95pTY+m2IZ4LPS4UVWpdjV2YY7RELN4aHoPqeoW3ZxlQB1R1AjoUx0yMjM5R+7/mztzzz4t07Xj1nt3P/DQNLjjLzuj5hu8HUIMTyLaHE2ni+V9CGEKCLPF4jAzXdIuNlr8NBF1pN6FJ6TGhu2kAaHSWJ5SEYEHEzx4dn46Eu7WNMLMbHaUvpXgdOt2WNQ0QtP1+EQCXGsSyb79GtejZmB8AB41PceBfNLnP++ylz9V/URggPTjFcyqFQvbP8uwdpWBRhOCjaZagsXmBEHj1Q8gvgGlz/IghP4JTr4KSSOC9a4zyjN5UMosPvEsa9QQYRMOpX1YUwiQHI+4PK5wlAKR0DEupZKGZySuTGJzL/vvGoVVRcpWpuwhOwIEwuykMtNVOQUGsbeuZ0ayMwjpng/epmN2HbEjJrz9b+4gA9UzQ2TGJkgsRGs4M8KUaGi5L8LMluGKBnvxTREdSMXvkFOImJGMqBAg3k0G78smnRPCGlczfddQCYma3qVSFjKKTAjPDZHZ8iMAk2nEDccMgD4jaEi9YGmgDcHsHR8A0vBo9/gAPFp2jjnnv/j92hvl9ZqsUNapxLIt2yvbC1szNs37mSHFU4R3WvWqRhWcg9b6Cda+Ag0EZoMSPQdUQhTc9wkneEMmffeDpiMOMMWVCGce8IakkExI3AVjYXn3PgIi9AhxbZ5nAAAQAElEQVQl6uplXffvavIwaVSjTCL3ArFQKg+lz0qPBKK89wOf1rJe933ojpgy0HLLRGcIGYop/n6u7V8Bh1RW7tKJc1EhVm6lsls5IUwibTMxTGliZ2tjhqhlgCpYjVm9qlFF1zsPYUeBpghefwCkYo5gw9nzgh4E0eKKBbEGD8LD8v1ZkNFPint8AE7ca1q7af2Lv+sL+b2kVzCrU17TXqmcF9iUmeKixFZjxVV6dktDkop9FWgSsjsyUkQA4IFS7DcOGxWcsj7FRWG4sS5LrslDChfI0KRZCNHXFc+E2L8QOragFg1sW4kHRytr0FOlvJPFhQYlkPCZavrAxrfRjlhpxHs7SiQ0eEZDL2JrrBR4Lhxm35599330Ti3rdd+Hb2eOEdGiIDRMEBGpfGGDEO3+PfseuPW+3dtnvzIyuzyP81nxES6RUZLtFkqzKcFlDfGr2BDdUlywRtq7VsHgXgNdg1CwvE35MqlpvWnSL0WEns3RpdYUAhSMBex40OA6YVUXsQXGFE+OPwGQjUe9xwfgEdNzzIlr/86r1m/b7BXstWv3SeHVzDoGTkVbzVU2DcsZ2HZpSo802qkXJuSysZZ68cN6t7ADjcgFe88VdukpOtv2TNuNlBDWMFBKFZu6/9LjmQFmw0qNFddc7/jdSZA1rrhahFKbo3CR3axRJj2Tg3PLD6EUK5VPF82kDZfWOB7XEKvXrl6zfo2W9Vq9YW30mB1HtJhtkiBXodi7aw9H/70fvG33PQ8wDaPL+pDC4IUQQ4UbMXtrUngCnS1N1BoI29lYysSFEfSuAk1NzCsKO3lTtX7CrFppEw+uAo0mjeZIKZdoQBgrLMEsn6XvRYvctL3t37MC/nRFZCv4XrWCYzulQrvwuisuv+HprF2xRiWWaDvqQGIRwc5sfNewAd1mT4oLvdB4t/RNYMT7Rwt6r/7CJ4313VHD2ZlBjxqq2YVPGkHQN8VYybC07dMxg0hhEoSKRpQEO5mLNZjAlMwl0IoL/7YKaXojQCBT/CB2zWgg2Uwq/Kca0vWlmCHVcl8t/1UBEi2TdzBENSXAidm3a+/2T33m/g/fsZujH76E1Mt7EyFrwDHwLni/mczCSWUSmQKRCkmBKKMQbE8JOzPgTQJkmQtI108ISyyz+iKkISpGx0M2XJohQoikcFg0HRHeaiykEkV5ILiU4xEX+v0792CM+1EyMD4Aj5KcY0at27rhhd/xepZn1GoOLHxXw3Zb34uIkpYfr+Za6yCWKnzqmfETdhQgsDal7rNOzGgQJR7mSHT9QUhYKa5UNE0YcaGHQVSxiSvxXxFMSEqtlyoe4Yans07BjGWXwsDPELZ1RyzEdFVsTs7c8sOYJkujGUtzOW/m3oefYmtz3PvQngdu+cy9H7pt9707GyKkTKOrl7NKIlGF29+RQwPgXRBgi7Yk1gRrozpYVK8keH80qopi4yCE6dlPEYGm9EZQJkPNV2MpKfiJx0QJG1sIjOGGVOcZQlRhxIUUEXvvP+pfr+k0ucYH4ES86Ou++dXrztwosYK9Ltu6Z3fRSFD1yzg7UGIFm/Vi5lxzL3GVtH7SMW+gVnxHYEsvPGRaAcKGZQMxrkDKTyEhKmg6qEyzAqCvK54Zgo2EcEy3BnGG6JuyHgsY/RyBRVNEaShoEJX1aVNCg1OFa1robWWCpHyVac9y/IJF4woMJJvpigxYg4lIK+Ui2ppc7nto7/aP330fP/Xf92AEIaZDpJhMN5f9qXQ75orEoTVE5Hm2WlL1BmHrJfACE96PSkMhVkKtNLEeZLgQlQj/MmxNR4Td/ahpZAQoGAtkrs/yhgNINB5MaJRAeEZfpgsiBNm33f+BJthxP1IGxgfgkTJzzPBLXvTkx738qcFyTVat1y6rlqqXXt81VqqtWpcA1SF80jVCjZb1Sckyb6zLalTB3kuUmaLsCBW9so++qJdxiV2UqXAjGNH68iOQgjECO6mLLLZHWAC98ACdNQpGsdTMtJs1it2ofNqZkyIc46NYwTQPsEWWvnyCFGuN9TiWCrGGXqXXirlCsWfn7gc+cfe9H759T/3LAdHnWCGGp13WyijC6ZsFRbKj3mk4zFSxvTQiFRFoVG9HCcSZ25DG9tL6bHZjWykuwws/y4elUT7Rl7fy25CuN6KWyUDP6M1DrUkAybB87b1v/AnAeXiUZ3wAHiU5x4Dilz/P/7bX4ChZ66xaeXX66MIuSJohXtnBWk9xsfqFRqzvvqgbAhU87it+8g3rewexhYXele0FjZAYNosfei0g+M8I0+6lLDbLZiSCBUGjQlJcmRHosxAKawQChRAWI2HZmVhmTU5IlEZUSjn+ZqZqvh2Btb4UTQNSLeIXV0qE0BHh37g1euzXY/RA4Pyu//5P3n3/R+7Yvf2hiq1HGHLQ9l/x21gZT2XP7yuIhwnwjuS3TJgAvELxdoz3+EuvaQWWRE2f5UFCaL0dFZJG0Phtpgxrhghg0uM5iqjC3kAslWbIFI+4YEufxVJAutf+3fty/GOgJOhR7/EBeNT0PGby+d/22nVbN7IkgxVf+yHxWUfCAUimVy07qpYwxfwnGhrskFiyc7xdjBRBIUSP6CEh0cz0jCUuw+x5Vw1Jmx0pPYXUdz4T0OShxwYdht2NOaqu6PoWIRKpI0jbHI1M+gwLJblq3g5GipSoNNPjjbajXdRr2a/MHZ+6554P3rZn9gto0uPJpXiDSoKmEFfyrIw705lvJRFVQhtCy9HOEBommITXQJlJo2Aj6JOniJjmmwWxxmZI6VkCJpaseRPdj83JA1K8HoCEl4A0X11aRPbes1PjOlQGxgfgUBl6DPzlr3wav//x2mWNyqtTdbETNENqc4BEIeZBOC/EnmQ9iweWin0SVU2aOvtosIlKL+8WFLV/ClnQQ2ruoVh5/9Qok4cAYXR8LCCz+Bf02SRG5nrH05CaS9oWQjtV4FsiwmTEjljRTVELlgcrU5YnrclMEOLvSGf7jNDA0g9Wy33tfXD3rnt3rPJ807FQkO1k1gTdGqpoqwTQCrhq7QVlVkCU2KowASp+WmWS5oTgXZRevqzv74IKxCsWoWrWqQU9DRMdqSp473gw3PQJLK4aF1YpOR4qFmPTiIt2uEpYanU9jozsvm27wfE8agbGB+Cg9BwjYP22Tdd+86tZsAovTLwmT92sWnaIS5rFxrQH2lqnV7CM3fATxUZDqlIhAsFpIQFiLY93SPmvEzkQIewluAqJ0rfSdALP9NkQoWFn9gjxPGlkb+FCKlZc2ccFYZTGthKSGVFyajRWck7MMpRNccEawSpWlIzZWVdmGcWmVKwRNOqhtIrW8t5B3lpUxBEtqMotTfCOFI5tcJmf/r4y1d5mKytAESGw7SRKP8UGc7TehAopNhVGAlasB/FO58hcP9fA1ujOT+sFQjd7S2HDUrJ+JrZ+vrGDgqWqkDao2Ipn9+3jA6BDXqsOqRiCo8vAC7/j9Ws3rRM/ubR1L4VYo16pPNhe2Q1BI+8WFWHcyKIelpWNujxwAsqI5nrMCUEi2/gJfDSNqEwIz5iTBzQ4BXCZ7mVhsSDedbWXZIQCAG2Ywpn1roTPgvAWgTQbgg6kGArHD4KLYhMoE7N5aMNOmmr1vk3TEeuNlyNxysCKK/3gTiawl/f2qTdFshitJ0FkBDuFScixempALdMd9QYdhwPiLRwQogMPZgTs15WyntVCQ/ILT1ftsQf0sPiRrwUEYtJjWkNlRLadq2pUAdL8dz9ktWLIYilYSgsaj4Q+mQsErfEnAJJwyHt8AA6ZoqMRPOGmay687gqFN0d4WdpJUsyQyUZT617FWho+19zy0/X++UgBK3UEfaqQKH2YXEDgPfiBCHvDSsNzn0Yksatrr1bXxrL3Ulyp0rQqC5C63sMUOyEilJwhjAgAVIGLXiCN7YhmHrJMiUrZWZMSc5whsMRZSDepOptaKVePJFqWHFVWmLaULletX73lcdvWbtngxrI+CyvQ6a63UyESVcXfkaqCzDv/NYngxTKtWi02pWgeCikWCP9lpqoKPLj3XNORwEWKKxHO2DSsRQTb/VWxiSu7ZoakdHQfAJydVvf4ABz7173ujI3P/ts345d17xUpsYI59eTlnWLVYnFn2em1SwvNpAfxLgJ0L+tB6CwZTio/AkkjguWkpg2iGaIsO6kwraGaWBwbX0SAgrE63PSJXnU5NhopoREsY2XpgcRD/HiAlS/iyRkCC0YgAUTl/a8y01X1BgYpD7RTaFKT3kgUohADy3bzLzT8bFgItmmtiMsZIBDyFsFrw2yB21i1bs3mi7edeeUFa8/YqBUQskNIB0a08vtVIYZAAsQm8ScE2S52pu9vhwoIvazvb0eeOjbZwKSceYBI9O5l05qy69z3UDOk4EKEDzp1vSExlnwxbkWVHdmzb/wlsPNyqGd8AA6VoSPnn/7lL13nH+tYwRxoVeIkvGxZo6xUWr5niBttlXuHWEOrWNVJJ5Y6TxFVJC0/xQal9U3US3apwnYU20p6lbD2WJhdisxHj+rVWEqP1eOhFzNqHmb6NhRCs60SO5NDXdOspbkD4UH2KbMwdOtmVeF2Tnq3/LQe7ubWxJJh+jieQkxrRVzE7/yITJIHh4ypWLNm08VnnnHleevO2lQTIgNa9stZqwhdZLokpkpoLImfaK31E35JUWzYTF4DLyMKwc4UJXM0UhUr33bi3++rsaJvKWELmbEte9AFowtspJRSW109QrwDzPR40K5Pj78A0OFc4wNwOFk6As2WS86+6vXXsRPETuBhy3h9smqTRZogwuZBkgtIAnFqBytbYqlDyzar2S5Ep0yVGa0CUZY+O2I2USpRuEFln0RCXxOaIWiaLfxk8+BuC/qAahpbCcu+NcZeDRMdifJggscxUxmS7aThrgZSPSgmx4hmNGmAAkcV1lJ9yvHLJKw9TIghbLrijf2PUI/pOladHVRF5Sm1hlatXb3pwjO2XXX++rM2R6xijpriP1bDPhY/vFPiIdaobOOqEN44ueXlyewUdAgkjQi2Mt+RpvdLMovepjVKGZFtPEc1qgDBG2z5meuzWHGVvmnE+gQhuRFIm8Ye0AjEHGSOvwGuTBy6GB+AQ+foiBTP/ds3xyqWN6u5rUt6t5VqhEbyBKsZdhGxJrz3zLNxvJoTTa34QK8oNmwmDYgoBH+1+k0YKcKICYTek1TABpKixo1FfSEwiXCmTwB6RRsl0Ld4FJza2diOALHtSl8IZLQZ4WBGzhGginBCSl8I+qyuOJtYMJsLCKPPEDU9LogQzQq4K7ZoeZNizepNF/FT/wXrz96qUF0tZszexlreO+qdEo1P2Kpiit+ZDec2QOSWn/AkOxJmBct7sZmepou+rpb4xIO7prgS4Xy92c0SBBa1VLGJa852z9DBuFW1FZjIIsZfAJCGw7nHB+BwsnS4mvOfedlFz7sCNWdZsGqxuNkV2JmBLVHCCkQg3griypwQTgbDlgAAEABJREFUbyAZTnllY4IkFbsoQFK+KNF0DzKLB4SLiBCxKVza7HpE6dg6nPhEZA/yRWyFSBWhLM8FvaIQBTUkXdMWo1s/IUAgRCuVma4qCGAQusn6lL1hVtX1tbdLJJBUMxmQDHTEjZQvSvQCcGtlPJ5jyzZH/wVnbruKo3/zqtXMo0dLmM6zARBay39XPM6kQ/EEeFv1ZqUKM6nIf1Qlvy4Q9ImNtGD0QTP81nKOJBgdZCRLA1L5keElSIBkpye9IXm1IGeopk/ZQyFzvePBA6trz20PmBvPoTIwPgCzDD1WI1bFtd/0KnEUZVaR3WM1WJetTRm1Q4KFzXoutvVCD6siqnDLT9fPflZS06h7cBVolK0EVyI5UN9Zdg4RutMBejpJ7LR0Z3bRpO/7KiHdS77QuNKkt9NobPMgLvyXT5mlbb6ZNeumLxPSLT/u0UXoO1tAYwuZxVJzRAeAj5VxE6FWrdp4/hnbrjx/w7lbYhWBO4ciD0pYkhe8r6q0Eq7MeTxkskIMslqxGahoC8maxAF6SwONkh7tO+EvSkPCLLhJv8csDxTt3bWS5TYh1uekr7wV4kKTRvbZEFW0ALiItvZSD91yr5HxHCoD4wNwqAwdNn/la557xuPPYxWyIjPF6rTNQnWDVb6AKL1Sm+fGUsKnIXZOM6NVeOj6DHg0bReVXUiWELZ2i/WaIcqy7Z9wrOmIbHsspBJF7Vs6p7yLxAUb8mACkcIkveSrEBt4jtKYtYZhNLHlAVX5pObORG4NpwOwe1Wl1ISAlYcJqYEFmorSUNGS7QzVRQj2UPbyFiEO/bOedMHG87bG6tWZLRriJEQ3QMgA2RbTMKDlv/y+iLAllZeTMiLnlnANw7K6KlIQs0acck8LPeaEzPUgbuCo5tvs8kMvwVIlTnkYq1YLiBb0GTFHmsa0fJUenynHMyERD33sM7l7n9vjOVQGxgfgUBk6PH7NpnXPeOsrWIysRTaQVyodvXbTNnvGnOZsIeKaacQ6tiimc817JuYI2uSZIaUvN+woRuEbk+osISTaJR6stxLcJqNUhfRgpNxI7KsaAM2jILBymMibyY4lHrwLiF1KBXGgB2VNXZL1soclSOlzIt0qfaKUixliACTajKq1jMXqjes2nn+m/FM/UcxnNH8XfbrhGVOgWu673hEpFNnub6ree6XZ4UbLbThk1WsoM1VVwGaGyQUEf+7afCKcrc9SWjhDYFGjrPVZjgKfYPMViGamT3ksqbFBo3xKDdn54bt1pNfpqh8fgGPz5p/yRdev27JerNrsq7OWZXpFgtaeERcsq1aCZXnLSzdFLx65AcFJEWiAF5EiCjBhTUPYY8rSGxdFQ4oNPDMijpXY7G1gnFCy5wuRbdEN0pqSux2iWypcC58J25GEsjkh2EJiD67oXfG7Z6awQdBgqiqiwqDMLPcQ7HyhT5uoU2aN4FS+JgQRzYpHTWMEFmFG9dCyXhHBJKNiIxDnOVyL2AizRy40mjRa7ssBivicQ/l9KfgfL4MoKY2QWxoWMSOqmgpIWihYv0FxpWaImo0HhLJGDRF2jSUTkx47g7HQYFrjZBWLrulBJDRmES3qFTKiiJ0fvAtz3IeTgfEBOJwsHUKzZuO6J3/B81l5LFJWYS1gUdZqTiPsgWDtJpraP2ZlohXJAH5KEz4XshEqpNiOmFX51AJi/6x+KVwGHoplrGa3srFCksKGpSxh+9mKPdw8NzirSnFRsOs8imcReJCiIfLVECAy4LaVmNmQxoa7QrrlxwN7RMlEZ23ShsuOtNZ8RvLVHVMxCoD9xUI8QMt6O5/R59LmSDhLoqVNFom7jGUussanDPKcGUTGG6gJRCHwsO1VRGNdAnt2gcb6DrVXws8ok97ZUNPImoP0CEvjjPXRu6br8S5VPOJyhE3fRjcbdgyn/Tv37Lr1PlvjOYwMjA/AYSTpUBJOf74BdZ6yLsVa7HuAlcqppAnBBpGvrmHFC7YqVnCm0Mh7QGnCPmWtH7PAsKx7+WoaGVGz0eBHC0jZ3U/TGLFIjAVis+nTiMRY6IM6aXhG4sKz9UDiCXo1BKpsEM8aTSHYEczLWj+lwSW1OAuymVT4z47gAp9N0TQgNVrF0wmfLJgp3DOKsGca6wGO9D7m+sSjYyYBFZsL4sx0zG70N9jmgnh5b6ctK2YRIW+kwgHx28yQpwHEjJo5R7oeDdNTsfixvmtswlKByw+mGjLT8xqXIPT1WLiTKMhSCP8px4M103cEtvSm/ON/2hjP4WRgfAAOJ0uPpuHov/qNL2B5srfbKvTyq8ZsXS5ByllD0FujlCvvARD45DECzG50y0/3WUixqNgKZSbSclMsp2c1qijEoiw9wjliWA+DiJ3G/hfTIircCGQaS62XejydrcjZ3HN9IcLFot5teliI6arYlM1C1DwsRTqLM4SOvwaf6Y1AtJBBl/8m/FkORWOKvIeYLf4gaNjlDjcJoAIinv7WgDpCfNnCnLGcyAciqTlCD78vIJYMcH87BRtB6lFiyokJvojW25yv3gWEvFmfLiTNcptzpLl+8IN3alyHnYHxATjsVD2C8KrXX7tmc/vtP8uSNd1WbdJIifXKmpbhFKtWKiRVSIDYdEPY8mpWIW2HsNNCbCbkLO8UmsxqSIax2TmYlEk16VNcFGgSn1RqrDzUIgJcnqnneovEWKhtonel7qbpG8K4wLY9lwq93BhR94AGbEJSgVtKe0t5tzckW2Wkm66cBzSYrRtuRDz4RCi3zII0s0rgZb0zxVyIPKjERbSJ2d6OWcIEmDKAYvlvwvL7mmeS+EVuedTCVYufCsBlxe85pjw7PCAUHkwYsT1bLaUpBMirhV5zfZZeXIw7+awvB5rMBT1CQ4pAzF36jqS08wPjA0BWDvceHwAdbqoeTrd6/Zqr3/RClmJbhckCrIZXpxsCEAs1q8gsUypNsLuyER0Ry5gnXEWxYbNp6NvPETstItDQYLtlZ2cIMJ4ypWIpQSa2/OA5G9yqFBcFpwDdeoR0UjSk2KAXRtgpde1kikTUMyBZkxJ1EhUeUl3vXgumrFRpUqKVVIVZKBVS+ixTqvlaYWUPxVXX20Sp5b4qZoLo5xdhBZE7ZiONbSUi2CqXtSC26S0ngYSDqsItPxV/UCqd4VSVVLSzbIqaXdOoeTACgaiVMw/TauHtl6brLVSLJPAwsYUYkFopLmKm5C5WldA9tz+wb8dusHEfZgbGB+AwE/Xwsitf89z1Z25iKQarUGJ1chwKG0j9Yq2LE0oUnLziKsTrvvSCMEJl0+ses/201d1Q4VPeD0qLSo+5gMh24X2w8oA39NO4pakIVW4w3as10Isrk7lA2FQSoX0GNQCwESo5ngmBTfvzw4DYlrs1mVn6pIMRWCqUUnBepHDQWh5LzVTF48jNdj2jTwg8QuOerzWFtAIfy3gziykeR0skzCUiiFfTfK1RAQLHWtabt5nObcsesRFUisK5lcPMQKN0rEVYA5880K48R88umx6iIQLATVKxcPBAQzO2+5EmpHmb8pZNn8VSNA/y5XhcAwk7k8bOD41//oc0HME9PgBHkKwDpLF61dVveiHrj13BOnaJotZit2lmsnPQ2GQrFBG1T4KlDuoqAwQWhGUc3iGBDVKVYPFDOSHRbDSZCioKf1Go+liG5wgS+WJfmZjcYBcChWmfwgNzUV0BYv/EkwA8UbPDZpT7P37nXe//1N0fuPWuv77l7vffevf7b/nM+z91118buZvy/bfe9f5PfcYs1KdBPvN+jFtB7jb+6c984FP3fADkU/d+5PbdD/qnNp8XfShm5JxQVTwMGO0htugakIwpHsIU0jYxLeuVmkVF/DFFS+RSxQyaErnt0bqhZb2IzZG1eFIRPWjeiIoIos0MIq84S99XV6ZkvbgO0pemiMBD+aevwo5iQlhLliTwTD+N1d5vND39EfUVi5+C6QprPdZDH7uH8kju0107PgBHvwIue9lTNpyzRaxRyWvRW4HFnDEhNIQNHvDyY9vrOFj9KS7WsdAoww3JWy9d2vTKLhu2r3ulCXZaFOFiwecCy+DuNUPElRnBAHIvZXlIeXRxEUm40hLEejRKYInj/n/9zO/89+/8pV//ip/8g3/07//o+/+z7x/41T/6gf/8Ry5/9Y9/8Ff/+Aeq/MFf/ZMftPEnP/Srdf+XP/mh2f1rZVP+2p/+8K/98ff/59/9xn/5P/7+L/7FT/3Wrf/jQwzItBmNeCgZeEKYEaGRhwYnFZpixYUt1ey0rBchkOcpEqKqCHu0ROZ3NyU6gYGW+45aAxVUOnCHxTQcFvEbkVeLYb+bLH1GES4mYo50fdoFj50t6oF4mwuIcDMhEg1nSQyWIrbEmljGApHCJB7kq5D9u/aOvwBwNo7kGR+AI8nWUu2TPv/5wcpOr0Iv0Wq0dYnwkRB2lDXKWsIUnGg56VnUByAeIPhaTHqUbIVFxHbioX56islD6Rmr9OVzAUEec5/z+Cf9wYh2b9/55+/67T/83v/4qd9///ZPHPt/03LnHdvv+OOP/tXP/d4ffd9/3nHrvUyj0sm8mC6T8OxmSE3FCBNjLtDcwSnQJ0Br+W6H3GPrcTrEmGZEyP2NM7Hg9S5fpLORW9oqTAJqbz8JdBa/o69GFT1+9yoiprVkBKfuOs+AgaSoXkEamuNUvS+I8klxANL0s3iQF0KHbBEKaBrRyI733Z779mtcR5KB8QE4kmwtaM9/1uXnPPWS9KKdr0uvSIlFrrq8OlnlKgQpiz8zQFK+KFneyig+isWsn31MlCZlPRpoyXBSzTWFhAnwuaYQhLUPDePBUguBQRL9DIE15Njkq/wbUcT+zE/+3l//3t/7vzn67db8cXzu+5s7/vC7/sOHfvmP9jy0J4KBiFMVD3mWZkgSs+NHAytp//79uz6z44iOAHodn5uYe7TEFkGcIBz4sslsBCIFGmahZb96UgkqiZM1o+B/2CDKcJwVo0l5RmYVsGg0RwRCi9I4lRoSQjT3M3lIWBhKdkpUJcbCg+XWO2XYUlDikyElockEMYstX5na8b8+bWs8R5KB8QE4kmwtaK987XNZf6xC1i4rEruXrNRJ1liXIKzdZNV6z6tBLkFY7wnPE/wk1TRg0Rx1fRZdMPuTBmaViYdCun5JL6IKfGrS1DDRJVT2oCScNorLxkb1Qo6HfQ/u/uC/+597Htjl5ol59ucn/utf7LjlM5mMFwQa83gmhOOlaArYh+598L4P37b9U5+BXu7bQTtmR0gsziopdpwTAgtCbuV5adkvRxwtKK+lMlMPv2I1sQ4/HP+0umLy4Kli44ESvX1SsVNKgtkR1p7nnhLn+NQrymdH7EBRZVVIaaS63glt7P4Hdz/0kWP/B1Od6tf4ABzNG15/xsZLX3K1V6HE+qut0Pa5W35YzSxUs+DyBcKqFbulE+wHGdGCHhZ9ll4Q089KZduD5ojddH2UtIrWNyPYG9VLCeuxvJRClkEAABAASURBVK/EhR2upBpd+MmMQJ+iEAUTyqrF9Rc//7u77nsQ44Teqb969+/t272H6ETkRKh+Eb+MiJBhd+946J4P3vbAJ+7e+9BerYiLN+g4iLNFqClaI+JybtOFbb8L6mW9HQMB+e1nVLSEQ7SkeL7eYNGQcQmNKv7GWqlONKSzXW+fHRH2tLomD3QFEqsRxG7QeDAjUoAkCBUNvhzyBUJy0x140Nz33z+W+zBNjufwM3AafwAOP0kHKZ/4uc9ZtWZVW/dedLUWWYUPgyhrCUte36laxrKUgpNihnjFB3tvrkfqdc+OQlqw9Yuame1xAz1CdkhSGQGw2RH2WEmkFokbzf+EiA4yjFEzov7UH37otvd8BOPE3zvv2v6hX/qfmnJSm12EGFP8ex7cc//H7rr/I3fse2iPswS5Iu4Mv0wy6fdVEXVEbS5iEuk8JxZvh3KZ7wrE0TqqWmpVGCEy57aImOI/EAlmhNBlNE0s2AcjZj1mH6Wq2fqMub6yhOP2xjHyQAQvIe3fvW/7//wk/LiPNAPjA3CkGRM7+6rXPjeTWu3yacsaVSEQYjFDe2+zOlneEGiCqjTYmOwiIylf9LIHr++ZXt4JCPtx0vTuKwYQRENKP9+r3SedLKlISlpF85/BWDVuecBbKkJ1Tf6NpPTJ335fwctT3Pr7H9y/b58jSwdItCInmfv37L3/43fd86FP775/pxGlNVopV71MtWipVDFXgomTNwVg2AhSrYgrM2NaFRUcRYZqGXmB8AIeDqFX01iYzMR+PF8V3DwYp7ORuZ7dYbzpO+tOS1es9R5exCZfpZ8jYTN3/OVt+3fyh0ULxnNEGRgfgCNKl8XnP/PyTeefgeX1SyW1VehSUrAVvO5ZqWJ18pgAYZG7B094h4DUHoguWqpXoKGHyerhnbCoN6GmCezuLRoiEDxU/8DGAyVI88AZhN5szPXW+Kn4ccBGDOnBu7bbXq4nc9c9O9JhEY7j37dn7wO33vOZ93969707CU9T/CXRCrlmKWxJJ/QgTk/D+W9swBG0qxUQdbIevCpIcVsWLomQqiKMit/lUgS9121YGmiKBQmAhPR8qYCZZKbEOU5VdHR9jSs6KFyoKqTV6Pq2p+wmGiJYYjaiiO3vOeIf/3EwbjIwPgAk4cjuK1/zXNYcfViv7G0MVqvXJRa317fXfbG0kST6lAqhZtVm6bMjLG9hu5IXdiLl58eoyohAms/SuEhwXHdNIdjsPeM8HcGdyo31sGjoVQgFJniIa65PscdApD07dz90944yl63Ycdt94QBz/779D9x27z0fuO2hux4wQE7qBAnFsgX3CANXnhvH6SYCnN5m0qgFQvTY/e1o2S+/cVZgj4f4W0TOrMN1tEG2sSEIvK8WV55d4dMcZUT2hh96aa7Hf0ZUL0xlsVl6cZXehBwPAHZGoE8aPGEgYWlyN/2uT9y765P30hz3UWRgfACOLGmr1qy+6PlXsvLoljy1Ovu6pAnE2u37QTJBwSkAIT9dPyFAHYFNpFRROy1Y69WoYqZf0BTRIinTX4jmQfRNiupVjgKfFhUCk03YqgQwiYbI5/Fo5x3384kwu3zPjtvv3b8/d971wD0fuPWhO7Zn/YPehKmaQTBTQtd01VSmxvLUFUK9C4/P+dVSWIjDzSrgXNcksJf5bqvIkfegKlrnVurroZBixZU1CzJfSLBysFsZ7haT3TxDHoAw1gwplkKMNemb/wUE046p+vdAQu71fP8ffFzjOtoMjA/AkWXuguc8fs2mdUGnZA2zt5NlmDS5Qbw4WbvmebyaQVRIE1njvQQrEFgQ7xYF/8MGkfWYuFTTyIiaXcQBP22h9Fj2oCrQs10y/DUS16RPWJrc6GtECY1dey7oqURXKaR9+5b//1h19z0773n/p3fcek/uJWRmpHYxI/W8qV8pB63DuI6nhLy1/NWLcjoDyA1OKxFhRa65BpbWst5BWPJDiqmI0Aj5FGGmWCGZYVsK1kpS+SH/mQ0JVykuCjSJnkqiLz1woxmikpCZqlthPaIsvbgqhqVIJjjdrOlm7rt/F38BYHw8R5WB8QE4srRd8qInB8uSTmzrzGB9Zy3GGWLWCE/UDomGVMXa9Qo2IhUSaLwjeNyDHdiRKFErbeaiPqZedOt2IFqiUcVm2EP5qyOu5KGTGivTGc1b6YUbFawVce2+fyd/5asponmyHacn40d1haGylrOoeBxKcABmxZ1qVUNao5Xo6mVoeS9OWwKoMPlKsR4IKitmYCPYzjzhGu5riV7Bykn0hcSU/1Tpk5LVHmg0aWRNuFBjxZVSW3uVoMZG9RKX/QsJGrwBUJZQINv/+BbtN6lxHVUGxgfgSNIWuuRFT2Ldu08m66/O67acWZaFSCGQdKEMVrYmxCcCOJW46AuBt6jKSNdnRxAyShFzBA17o+FQaApRc1w4nkufzXE4nBQNiaJGNCRiA7bZRkwjlngu9NKKuFJ9vhVRzVfELAX/U11IqCmDaplvh9DfgmKKdvZ2zFaDd0SghEy57LejajHLK6FMUpyq+KMqFxCLCJKudy+lrHFlQm11TfrF+WKHJg0Gd2YE0hSFKLwCqxbXpIflSwNg1nL+WogPgIHxHGUGTsMPwFFmim5nXXHBhrO3iPWZXossQ9ZxSgBl189KtbDl5ZnRTy5INCxtEPZHKiyKYsPmEkQg9k+FkBVvlj0ATuegV1UUIAgFQhWL+h4JmoLtoYKYNNbP4lF4r6a4skUooD6ilv3yDMLBtggVzFctzkIIMDwvanNIbS3b45gqHgLJecMRRkUuoiR+z0gr5KowHVCPMBytagJlpqoK4k8y39ekDHfbqyXcK9AUwXoLgAVNh5lzW29Fu5ghGNYjlGp04YGn61uEnWXEB993+977HoIf91FnYHwAjiB1F153BeuVlc3qZP3RM6U5oozwGhVXpli1ILYlw0nlRyzqNAKLJmmDqCNVlRsT9dM6nTtrEs9a1GN73AnOKBEFKkriLERiLJXPzMDOsoHtIGHFVXhgwIZrzOW9iV+cKT3AFNEqAwRrdgOH1p+9+awnX6hVMYOXzah4KnJCcIN0yq+xInejLaLGUq6Am6h4+86tU+xoQSrPUQ0XZuc/W8wQeYr/P3t/Au/pcZV34s/pbkmtrbXa1mIbG4wtG2aCIUDyn4SEP8lnJgmZTyaQzGdmMkMmn1mSyQxJIMlMNpY4kAHHycwkBAIBhmAwxjEGjBewDV6QJUvWYknWZu1Sq9X7vnffM9/nVL2/3++2FK3d995WV/l9q04956lTp85bderqqlvu+PIdC4WVWl0cKiKA/QzmAkZUBqtnrnBbYlOk4EhGMwM5U+Z3RBH7bhz/+peQvKJn3SsafY4Nfv0feZv3YHCUk31puXYke5HTboQ9WloQNj7hMccKVeWe3+IEp8v8MhGuq0qoBftnq4AjI1XVGQsz4XSkmj678MqjmpbZlVI7OR4109qOAZRlTO5ApZPqfK9Ra6BUqPCqhdOORovJzLfM8y6/8PKvfd0l11+xbsOGGbyaQg9eENByg8h3/50fS2tdoqSlXu2HDUdUXXvLCKeSqvaS15AqbVCjD0OiAFtMqCwvSttqlHNiQMoJKZu1xwyLoYWoc8yrTw5QNjEjLeMXojjyyK7xpz/1isu4AF5sCC+86pIrb7gONtnWO1JiB7NH5a2bwR7VhCD7LFnvF5kzb201xRccZagQKjjgMw5IaT2XusK541T+goU534OL6NNkD5mricXpiKAgYqHZ5xzKJZO1oLC8Bt5MlT92hQioZxm1ct4lGy/72ms2veGqDRvPq2U0eJVrvloEPqTwlqo8W0SQay0oSq3VLuyQvjfsCf7LmyijGiC8jUVOacGVMNyhMcfrTeO8hrHAGtW0QkwQFNmQKER0JKqyYEieSxQ8gePdWAgyCDik3b/zYAmjekURGBfAiw3f9f+/t7Iv2Xk+CZkM8xvezTHt+wWEo+GeX/Zusu8LCQwo5vykg8IIjZXLkTDEXCiDUdVURb5OPRsJ+ODUGC5OIa5gz/nNHyD/04Ao3UOpvJUNUL3Y58zxKsC1IuFzrah827Dx/E1vfs1lb35NpX6nCKmtUqtegjgnPgeelv/lmRGAbIgKEx2tgZJpX5WqJsr/wNnlCI46/5Yi4JTWCEwPra8TdCD2L2JtIdH5s/3GVDN+1oBCMmkYHGUmpt04QxQ+cQfvfuboE+Mvfzlsr/AdF8CLDeD1f+QG72b2cWaEd6FHJvvV+5j9ynEAMYddKxWSYh+n+WmRjlDUTzpYEKX4DM0oxRxpAxhlIg1HwBzDhRTfOIM9NK0t2f40O8WRta5swS2DsGA+/qTKW1nEgpuGREFUq/tkSuUKTcVN6y/YcMlXXXXZW157/iUbiV6E1bLjnYq8uk/56RDjBv7jIIhYhh10BiyP3cF/rYkS9sYepiuxE/CzPEvNEDWZJRFtmaOGCHn57ioEKNhdcOb8LGuisPZoHTjKjiBbdD8YxVxBixJjnsXNydz92+PHf8fklb/jAnhRMTzvogte+w1fFd6d3oXsXUWd8FazUzHDRk25yuIYMSfqziiFem1+owJw0uBzApchKKZDgNi1zBuMtf2OmGMEy7YDlRMSzIiivFVpgxrJTdKiVNOW/4YFUBYEFX9MAaK3+o9dto/rzlt/8XVXXP6112zcdFGU/+EAW43TUcjqe2sP+tfJdAipJftfVSL3+0COs9ZAKX9UtfdA9P1DUFU+i2JtGInSthqcYV0OtNn4URzkvmOFWDERHGQGSe17BQhxKG0hBlACq0qFz1JpGbX/C0+c2H3YyHhfcQROxwXwip1Y+wau/da3kH28m9mFEnuUPCtk7073/CKTj6zlFIkC3xyxv2s7o4WDQlrgo4WfolDBMd8NJFvwUHO0oAUPq1UVWkgp+yMKZ7W0hUhhZePQ4aTJJZOM6VWgVeco4IpS9lEk8pp41sdF11x+xVuvvfDqS5qP9nBaL46KjNNWpLVQiBvf1OG0n3iUHZEDnEHTEFRr4Cl/7Id3DlEVHragskHw3HLneGOiZXXG/U6I6CB7XR61nG9ErFqi8izCZoq5Esna4qcRKaxkFrnAcWNIEUtHju/9zCMNGPUrj8C4AF5UDK96x/Vs0rYvGZC85KH0HmU302tIO+1GTFVUVpq07OBCfFDq7RbIyImiIDiTzUAGLi12UC8i00kruDjWtrHTqAVE0U9sXwU+zRDJREnljzytkFkLjVa9RFz42kuvvOG6C19zaaxjFThkf2PBf03xKZ+1Jgp7w98IX5Z/nZwjeMtK6K/68xw7Fj9xLhXLY5sLSO09NhTu812sKKSttxA0hhvCxkqAzilDDA5g0NnXzL6HdQrC0HBA937m0ZMHjjFiPKclAuMCeFFhvPSNV3lHSuxXVeH0ij0qGUm2J5s5A8QimzpRcK6CpjjFZ/OnkZQLo8yvDhXbG73PG2Pq/BRSfNTYFArsFFJU8IAOAAAQAElEQVSy+byTTfOh2JOmplN8xqaYSy7lVUMYWwie0FLDgViy19L19Fft4Uf+i6+5nNSPP5MTKaJkb9VKrdGLX+A0zSrVdtBfMDy/OzgrO6gAqg4VMt/ClLXw2k2+98JewkW2iRYQZFZRuCY+C2LDRe0c1sGKQiZR0aWefR3B8TDoucBXwMNmuKVTfCZOmY8OPqKRE3uO7LvxMUPjPU0RGBfAiwrkFW95nbchm3Cis1vbTk0Q9m5mzLISUEfY73So1bRhC0nH0DK+FQFSilS31pGwlnmUYizzUiNH8VstKNng1iQIHHGKMqnxP+BIUaNEAS5E5S2AOT68KGb5y/AqvuvW+/95rRzMcoO6fqKkg0gt3Le3Yi2slGbVn7Ar6nF2p/yXJXyupiFwoGrVy+QVjrD3ylEqxznaKsJuBjIRDsuo2V0BUg17MgzXvi2EytZsub6O1TOtEQNqZloD1Sb07B3rPSnKnk89lCeWEMZzuiIwLoAXjuTGKy+54PKLG49dS5ZEZrcGu5/GnfSuFfu77WAoKbS8AkEW52qBL7GnBd+NZc4VxBkyyZyrRjVHtuPKJ0SUyaZx3mBUzmxyeqEYimAW9DXUADJca7FvKVPYNGDPIxp/slD4alUpXCNfqIp75bO9BkFudURH6K76Qzhld+wtAcUfEBzkezVZRDtlSv8mwKv6+IOnyqOgLhFvkVuEm5sN6TJLYi9ptt/UtMXHnI0VAilV6xWiGr8QKUAShIbOtN+ytNQNpkYOHdt64MCdT2uU0xqBdafV2qvT2OVf8zrv1FpcUvsoe9eyv9sWlve3NX6LGs7+7vntfPZ3KtjOqnrRAoC10UaFOTGX+6hFJEzpo2jUKVgmV7ZOsz8hnQ/RSM9Kkprn3cOurTMsRjALzfM9Z16HD5M/TOZeOZt0eKL8DxIOOYL+2njspR10K/tG1UJuZOat909pVt/rxA/vQDzp0Z4hdhmY7TBxCom2P6lb5Jfx0wNykd93o0d1fkdUX7D4c4RghSeU60TpIO7++APjP/xJLE7vMy6AF44nv/9hE7IX2ZewfULYtUg87Gbk9N6lB6e0ZFIQdi0YGzkFRyDIEnAmjd/quLK2crcmTiEqkm0axgKDVXwq3GnqhqCFlMFcwIhK/IEEFQC52SmE0w4MKYuPXrxwmlYukz+WV+21V3bLDpT/eKVwGNDgbPPf2rXz4hke4pycH+fezhFRMqyFi7z6D7cR/rRNgCwi7F3KDpFlK3C/+SwKnOInWrrUfJ1CJHbgAr9EV4ExbDo0cJo1Q8UXpSwUQmSkiS+gI4/tPvzgDqTxnN4IjAvghePJvwH2XoTI3s12BpJebWoflK5ln4pdS4aCgzLpsM3B2NlCmyqEivxLpzjs9WaT3qIh8xNqweYHTDpC0eCmTQBgazPF2cs2u4ygQA3sQVL5L0rjJIqZt4rGoQWHw1j4Flb57e5IuDOLZBCNzKj1al5yLq6eFEQSR6oJbxBccactoCQjzqFoEVf7sSfE018c1xXImTQArTZCB28zwxRq78mmxf1MqX0Lq2da7y6ZL8NIbqA2qLQVIMNSNAuiYIH5BFQnSLvH3/zSGSmv5AI4Iw6tQaOb3ni19zee0bBH5d0ptnGdB/ZoiexpWmC07GzYhXQ+VInKFjqHRlDU+K6FAThurOA8WCwk2pk0zCAOxal8MmPx07MIrTmiIxdraT075xbJ2olvJLCMtjTyXHLpiMXVffEfB3DHPiOVt8jggesTomm9WtVCPvX8KfH1U+Vg0sFbOpbkBajiXFqtbgl7gl/l1bTfBIBM0IHFjqKj8t+y11KdqkAgpWq9Qux8EKUUINk4dLzfRAHh4yX6OUcgqOb8BNn72UfHf/ihonL6q3EBvEBMI+KyN71GtYXl/Z0M8GtEMZ2cQjgh7HL2d6KoTd0QxI40frC/waoJLJTsExVWxCIC4KFzmwGCB82T6kTnc+skmjI24xcisYrJPh5CMWREmJsjXAsAQGHHxTCtjRLTervPwrW+3kogonQO0uo/QQzlGDr+dR+4Y9RAjz/RNrL63uJP4i2N2EsVUPtczgVIKU5FgiWmKMnQ+X4zrEUEuca3LyiPKg7Dpi+oOYeYCApv58fxnQf3fPIhgPGciQiMC+AFonrJG65cv/E878vakexdBlA7E3GoRfZ0A9g5RmoLA/sscTbY37XXQaxFNl0pFJyrqMaV+cCTzc7HcKeaI7TYT9kfUSYLIEr6VsLxYHMKw9vKj1bDCVrmCrclwvew4gMwI2Ih7q3ui7/4kxG1osmXtqLWQ0agjugroruqDz77K5c3GeRQR9tfwg4iO7RJiFMKrY1SrvS9JLzCfyB8tv80ogDwEbKQJpeijwJhXWKsv5dbkM5HkWLHymXig3g8EeDblQLE84JgIuDn0o4P3J0nxx/9dHjOxDsugBeI6hVf87rapN7I7MssOnXUqQ42Nmo3yf5m16LPlIxQkf3pwPCZYZcHo+iFh6FGFCIDConSthocbZfDpInvE1IyNqEg9lnomMhIn5xEgT+BTdv3qMCMClYV8ELU+dMaU7JIozVQyvPm4dwb+0Y8G1CZIlvdkNWuHb4WbRF/4RufgqC6VpTWVa1Ca6DgSLkb5S0OEdsmt1rRNkrVzfNCoviup70UpmTxEzuiat+urdpalP6mTVt8qbSiJLEqbY3a97nHxi9/iMqZe8YF8AKxvZwLoO948qzYr3WI2dgZ7H72NwYyVftVglqVkc6hkfd941O7YyKcUiCb46Foa/cXBXz6WUmWOz8jTDWiDJjGaYtTiD20P6L4JJtfHopBKD1KFDgyAqTGsTWLDUmtgZIZ+Om6O8OKpPl6ZZ87B3ktPPbQnyjtZRJFvqmiELsH4hXJWqE1tsovvuEVkRQ+0xHOtb3ntVSnqvKWqvzXxDenD2LjzCz4vMABikDNMPGy6uJ3LTIIHGHTbMSMMP/YMwfGL38qJGewGhfACwR345WXsCXZo+xUqOxgdmpH2M9W6NlI+G7IqBOiagKk+D5oYUVMCLAAEj6nIic+k6TgZE5I05JNUpQEbogHG2hI52OtDHOuQEodEBFOQVKq86bSTqJPIHzA53pWEJu8bYtg4pgQlhcVnzmCeg084eDhx/zrzBDHOKimryM6MFf7Sfywt3hD3qfTY1sNG/HZSDGBPYqmE1lH+zpWtzViuu/YVCPSOECmSOr8ZyGpHR+4a/zyR2e4jAvgBQK88cqLvUel4H8tCVGza41wkt3U3cBJgAGSNJwi+BBFSc0QzonlUjROR8Rp6edEy/gZzAWCYSU2+2mUC/MWIsGxFmUu8BViWCrclpiWmN18APilBCGTSmix6UZJ7+SxE1r1khmBX/bDvnlBy5BgLYm3JqyRF3fCLuMVeU0qDw1UVNGqwfJiqFb/sT8Z7AFcxhvqCSmX2SdAiObQzPyvL2JqIWhrRV4vViCCoM3SUnU7NIIjtOYHsoOilEJGFLH3c48ee2Y/vfGc0QiMC+AFwss/AbDL2Zfka/Zl37vTflUpqmL3egerdnNwlugFu1ly3bRZMhW3BbvfNZ0izuVTkNnssWizDKvmUtCZWfMtYqBNKzWtWul8n8nOsZilxAKOSGFo6WTu37xz72Nr4K/e2J3mIa7V6p6FaE2VlGOb+GRHp0593+pM2hZtvh3M1X6Sr18e2rlyxv6z2bNcpipt24HoO9yaBGiLYa+q9k8zE6fy1bSitBkzQRgVFYZWozy2Zd/45Q9xWIHn5VwAK+DW2pli4xUXB3lTYndyIIScPi2qwt4Vx1xU1bCP0cIRHDpWmIPe4oRY61wmSgolt0tU4yqBtAwR1hq/ZnEFgrUUc6UoEz+NSGFl49Dh9MoFy+YnMm/jCIT+xM+lpUM79++476nD29fGz1+Jg/iXfjP9LSy657cQBJ6KM+1qP/V17EQmrlOJQCtFNqyOJTncvbIWcXUf767A0XKOvWRvLIOr4CwtkFciu98QNa0omXydOiNwMooj1HLh64CUtu9GI0GwUrUD0YJA5dc+O8af/CEQK/KMC+D5wrxuw7rzN13Y9yXE2q/eqexwumzdOtUdqSYKKaUUHAIqdnwK0ZWbgIOFQAbmUKAoTiHRtNQJbk5HAvk5EMOqWTq/zp4kztWzECab+IiSfAIboogj+w7temDLgSd36cRSzaS1UGoRjk/MVmS3yE32sX0dgOVagFV67FRF1FV9iwkJB7sQXKsOFRuB3mo/qfKNGn+CvVcNWyRq08UcaRSpfYtAreja/kVqqL8XCizIFGnOn0egf7ucI/D3fOrh8csfrVQZF8DzRXr9xvNj/bqAkrxsThp2tgpJGn5WCu9sa9n3HakGqO1vcxrCGYNkfqJFLJjdj8J1dtgyk5VWrrMhyMxuEpbDClHoB2csU0Er2Rh8Q2IuuRS/EJ9VwQNxgxNwUiePHt/78NZ9j2w/ceQ4A1Kl1FopeBt4zhonj4zUesP+4y8BS+RJv7ot/pANRRAtaYp8Kvg6xLwh9hxpLTx2S1QV4VN2bNj9lNVS4H2CEG5N/k/8FBbk4q/TOnDU+YGcpRU6G1XYkix2zvGtB/Z+9lGQ8axMBMYF8HxxXn/+BtTetGzUVFXeqQnq3YzMOc+mqDrRcB5KpnK+DjKXkk5Vp/CBzaGpMwOlbNIGxwLYB001l4zMtGXHlIKZtbS0DFXncxzhG+hIqU1E4Oy1037i5IEtu3bc9/TR/UcmH9Q50NbEk9FWtOBMeHEJYJ9LG1WDrPaDV46fX8T6RhVQVlFfkw6RDy9gtV2d5rc/djRqr7bausTXvj/tepgjOJ2fDQiQ2mVU0Sm1P92B02TXBhjfOKJJV7z17ZaOntj2vjs9Ech4ViQC4wJ4vjCvP399U5NlOArs1mCv03jrZrBrlQEDxMe5GkG0moabIMwHX4YIoPMRsUDHwxb4i0gby/kRpXF8SDoFEQtw1GYUJRPfUFgUMNpUhKqwFktppH7dv/nQ1n3eByB4K6FNrZVSnrD2WlE5hf+0OBuBp4gs1NrCO2J01V4+DF6TNx1JnMMRvBW7JWX/6FhuHZRr4LHL9qftrookO9OOIQdep1zhubyXIhggI8owUGq5FN+QvMYJMT+NSI1PLRe+rBFHKWL7++86vv2g4fGuVAR88FdqrrNvnnXn+Z8AxNYlM2bt9epUxd5NluSX7ZzsY858GnFlbTCqqFRCTis4Y1BButaHxfgcCUOiJMSyWYgrFVJ2ik8F5LlEmfM7koLP4aLtNi35ZOaxQ8d23r+ZX/cvnVhSIXJpa7T0nO/Kg151rZfM0maPydtnIyyycVa1TpEec4pkuFNV4pXf6tS6ANbGk7jsPRPsUvZUOJBVWeE4Vye61kz7beV8f4Ikb/s6gYV5BGwB1UJMOqKsYEgRez/zyOEHtmuUlY3AuACeL97+FVCmOMLeqez7Is8QFPLbdjOZPeilIcvtJIiToILTWovYyTmShkRhlixOIVgAo/ao+bd0EgAAEABJREFUjjCosjmHBl3nYz/FXCCI+CkrXIlqke95Qzp57Pjex3fsfnDLycPHsziQ1C1wngVHVRJ1CatY4UKEPQo8LIeINvKiS89GFrUrLhNnRYhv56nx2Z7LawDjGzVEhSBrDZTyNsjvzR8HHV/7bgz7DzRDEtezvCbyah04gu/lFV8UOOEmFW5L7ByQpG96ojx0/7bdv/OVAka1ohEYF8DzhdsXANszM9rZCDas2LtkzBK9hzMVaGv3+8yHOQFSCiX8CXGHod2aOSBhrSjF9IkqJLCAlho7UJJZ6LcmodMRpw5t97CAiU8nGAWvtLRMDLh/y+6d9285uvtg07q2MRIAXqF3x68HYL6aVa3KQ3tEZKLW2+qZUwQAGS312ngyHE58se8OYrnoNciI30zXptDSrPaTeMbd74ZNQIc62EvVENsmt9q+TsRitg4raha4/5AZWUqz2YjZWtUXpGY3BjBoxLFtB3b86l0g9MazwhF4KRfACru2BqY7eewEu5/9SmZnv7ZNbcRnQ4UkTWnZ9+VxzpEFPiKngsSgBX62TkNEMdDtNJs+FX0Q4jIL0IEiUDMM+5gBSHHGrLM8ecjJ1JHdB7ff+xS/7pf/24pG0HotNDU6JYtyQaZhKdSr++BJRPcLb4PVLbhVSHcQuUur3eCgPaZhn1C7U7FFBpGCj+aYkwJZn1a/lD8hN67sZ9s/EyLvvYpw2FvDIPgv+YuIgjaEIgUiBcosjqRCRMnSUlsrc46d2PZLdywdWQN/5xz3zr1nXADP9825AIIT2/YrxPC2DRAlPb8+yuxy8mnWdgb2GQiIcKqJOb9zOhKQkgFFnFnAGgDGZgiyEXGKyhM60WxOCFYCY6Xg4JasiR/HDx7lFz782if5dX+zoD4LHPhymRDLmixUZ7UrMktzIab1ti71IrIoo1rdh/tbMe0EPk//OotIxRjO6jpas7cIl892NJbvLqUmBG16RC5DAhh09nVy2kvPhbDfGp+lZ2rHh748/sUvwVutZ1wAzxf5peMnOBXs10byOWFPi/3tkwy4gNQhAFbK56dOCBu8kKAHrDmnI6UtuNlUIwZExopGhaBFTnl2UcorBoPUfFamBELlmwMLnDQy/p4ntu968Onjh46Jgk2OHQIe5rNtMt7W0NvWOm284mLktfHgkRcU4ZXhkiNfq46YIxFdhrCqD7Hln+SSgKao7CitffYXBFtAtPol8DF5y2dck/0n3EBZ3mVm42jyn7V0xHwFtExN8S8tCiOJyiI23Yi9x2sx9372kYNf2qJRVi8C4wJ4vtjzTwCo2w5WKti76X1M/hV73fJ0ZlIKNnWr6HB8YFobjKrBVIJipbWN2rVwsikanK2BX6NsR31GAx61jK+mFSU979LS0sFt+7bf99TRXQelECV5+/TNf06pUJlvm0Ip+vZt4+UXXfm26y686lKtlVIRwMNsy1CQiUquVaCYI2vA5X4H4yCht8fB3ZxV0SusOkhrwFu+fsoOZrAP1Ws7ZliJVFo4bI7G0Sz+Ujj8cmHBbqSmndZYFvoXhNv4Rx7bPf7Fr1a7jAvg+b7AyWMnUbNf2ffiDKjOhrcz2zjFLi9EKaFl91Nb7A15NjhR6VGdI2TGQlrGmeyLQkZjlJpNN/AzAn56FmUYQKaFzlAjNLI/Rg7vObjr/i0Hnt6dJ9N93kx1OuewRCPOU1aqELmsv/C8K996zaY3XrXBfwkuDa2B1zEhAuUJMi11RF8SS2EBiwiE1XzKIWKHg+wBewLC10ncpJeqXSEQrYkSYnepKvYSO8QeimIYhA0n4S2wRRAUKSpgkASRi5G0AOLFWyYCAZQpLCAU/+SeI9t/efydrwrHqlbjAni+8C/Vfw85odRuDs6tUsEWNkTGoWF/NyTQssut7BwjxW/MEivnBqT02GToDEGGInFOsGOOAptgDRGjZghyFqBo2jBy8vDxXQ9t3fvo9hNH/V90gNCf4GiaD6mL1XiQ1Op1G9ZvesOVV7312g0XXaBmU2jkstpvdH/sR5Nb7b4UXpxX1+Os1S7lELHjM0puNUNEsbtGc8qbYKv69Lilou83tknao1yGBLDRdkO405HZ15nzOydVFpIWvteLxG8mt7739pMH69eSGmU1IzAugOeL/sljJ44fOGIGO5hdLu9gsYU5wkJm/0/7e4agZQD1IlJywTVqruUHdzqcDWGIu8QW21wdbvwsrSh1Vm1Okz8gEXHy+NK+J3fteGDz8f2Hoc0frNGhNh/JMwbTgIi7RxZDF71u01U3XLvxykuBQSDJ/PSA1X1xiPBkRtgvfGnrpUZuD3JE07a6watW40+Lnr1JYriYDQltlpaq46vm6GxiOyqxrTLDTclKtcizTyzSR2tILdqd35GiNI4VHiuFlanO93pBdv7Gvcee3qdR1kAExgXwAh/hyO6DHFn5DKS8myW2cLYqBSJORdvZ5NNsCnBlVZkNCSyomMpSAD+bbzsomDFsGbE4DEjkGslZwqaRsuZko4Pb9u6876lDO/ZNbNTT0/k+k7aZEpm9LLT75vzLLrzqhusuuebyWM9mSJkoVQNfq15m3jafcXBCFlyruLmfrlb7rZDjSX2N6hBJ+vhFXQDfjo+cqg74Kj/p+R1gf/1UuRu1Y1XRjsXd6E7WADWtCnEFwCgbEqUhmq0RPGLPZx45cPtmtONZCxHgzL+gG+c04Qj/EpUzIE4sh0Oi8j4WJyDcEaUyqXNQVKdg9P3QOEUzSrZguWAT04gglhaElBDhTrOAteLTNiV8BqfsT0eOHTiy877N+zfvXjqxBC8NT2/rZBY/QUucW9iw8bxNX/2ay9/8Wv99N59bKNbiAo0UF6yBPwW04aLzI1iZKEQDseo5Ao63oYqbtOHi8wtZtWqD//vheIMDxNy7QvW9wgAIHxmAu0EN2XDZRjSr+MSGdXH++trDBFLCW7upQohqigoYZbIDewetKCBRCFqhZXXwvbpSGgESNulL+299cvdvP1jiqNZEBNatCS/WsBOHtu5lB3NWveOrCedK7+xliNj3EKXwUQg4hVTlLLAcAW5813QmrZmiGOYUuSmjUCROUXYkpONHj+95ZNvurzxz8shxOCCp5aVBPp/NWwxAhBOc+U2vv+LKG667YNNF5FPJ1CIidh9Y3cbLLzp/04Va1bLpza8pD+1EtAgQYOJgQHOECHkRuvj6K0qzatVF115WjuCA2yA9lrf+OtUxuoBceO1lUFfx2Xg9DuPZfL/ZQymW7WHiC9T3Bp1J2xFWNyH+PEElafpebDuQA3dt2fnr92qUtRSBcQG8wNc4+Mwe+SSIHcw+piEzBghbXmzznCGcCsv9bJNzOfoyIss9i+UcUSqmE9JsTvZFKf6iBc9VfC2dXNq3eRc/+B/dewgTkHlSCi0veAJEzVBZi81cpwtfc8lVN1y/8apNKGvGOvlwUgFkPojCa8xL3nClVq+sO2/9RddePpsf/yOCbpRvCDOkZOH0xdfP+VqNcuF1l6VwhNC6JZx2mUY9xEaR+fwGcuN1q+zwBdf7Bpp2oHC95Oa/VO46zrK7YsciIMq7GpL6JkVsVAlOooWUgSwXsv/47z04EGvsHRfAC3wQ/h0A5wESu1uVd5x9lAr2NwDbP2UxGxJw0DakFB0JQ8s4HppR/FZDZ2gUsZjLbXKWMo/4/69x8+Ft+zhwxU/X9c6l6io8ASJ4s3n+pRde9dZrL73+ynXrQ1amihM1Y4nQ3fOLK4pLV/UCuOj6y2MdvuCVnyBWmUh8kahotBqEJ7wiXbTa/wRwYd1YeFn+8H3rQ1WnRRtX0Up2N6QLrrw4zluv1Ssbr9lEPDXFls8eyNVQiYK7FW1cZjHh3cK6+s/+cAqR2hqFOqPzzUF76IHtZP9cQ/8vc3g5HkdgXACOwvO8ex7eGuKsmsI58c5WBj2fCo5Da2B439OYUw0UPx4K343hlr9yAbE1nxOhlqjKAtaQwUWpn7/8X3TY+cDTe5/YmcdPggiqJE6a/gMls2nxdt356y9782sv/5rXbrjw/Gz0TNbCAuTTLji2aTfRe14QnLj+225Yf8EGrVK57o+8tc1s3/CGWEX5hVz+N3zGQXnZW1530fWr9jP15f/x9edfurGi6irq69jjTCG7bs6iLURaty6u+kNv6uiKN+svueCSr31NiA+PP8pygKgWIsMNy7ZbOoIWjiJUBdlSJkjOELSFHH5017ZfumNk/wrMmqvGBfACn2TvI9v8Z+rZ4JlBrkzvcL9BElKAcELq+Ag5i1MIlaCkueR0qCATnwxrfAExFf4pSADznFza88QOsv+JQ8caona6GJDMyCCk5Y/N261YHxdfd8WVb7/+gk38y8ZCMAi35SPLZWHGL0QmSoqLXrPpq//cN0Ff+eeKt1/32m/9mjZvzLxNOwo4Q5D9JC47qvzW6C3/9R+S/0ST4ZV811943hv+3DckU4bD5y9V3tbXnyGo/UStyBzpmj/xjvOvvMjoir/X/NmvX3/+eeWhP3zzR+WbfUkFu5r99RwI/ITjd66tvQQ6IUef2rvtF27LE0tg41mDERgXwAt8lJNHT+x9dBs/sIk9Le9vecsDuOHkcEKMcMCF1jnIFlFOiFJwcsoFyAwGSvMQPQpOIcZgwim64cM79m2/96kjOw/EnF9nz/4YYkxTudNeBnv2pY1XXXrV266/+LX1637z4TIjU5UFn23k8tkm0CKDoFXYgpE3fPs7+LG6GV6xesNF57/lv/lDTEc0Wh1hF0umYhX2zRLO9vU6kogXX3/F9X/iHU21kjXZH7c9I0442iqP7adX4XgWgrZ8juLA5zdyb/iubywdvZV7Nn3j6y95y/Tv2O0m+40Y2jlNvk07PFX+45zX0jrmdP5sLSl03cKxbQee+blbl+qv02uUNRmBcQG88GfZdd/TCrY/e5sTInGsk4p/U+rdzwkRZUJQmLTAAeHMhLMtfI8CgRMcEwbasAcX0rRkYZg6eujozvs373tyZ55cIuHB9cOpI4OUP91Cs2Pd9Ebwq54r33bdpjdcyS9/mF0L/BJherRfT2wnJPe6tgD3levWr3vHX/62WL+iW+XN/8U3XXCZfyiOWm+rVSXKtxKzakVx1CJc2tf/iXdcuLK/COKXP1f8gTfgg79UlBP9uziKflOuJZXWMt9RRYq4+KuuvOoPvZneij388ud1f/IG7167UtMmtfeejHgHoo2KKgpvk3JW5X8hcBrfdZS21WiP7zr0zM/eunR4+d9IRzGetRSB5zvVa8nP1fRl132bnUPF3q6Xc8sBV9v9doxzgoI6qnEFx+fBHHGu5vzeMUdoTZLzV7dTFnLp5El+57P7gaf5nY/kwVUxFn7K/BSiFFpeMteft2HTV1115duu5Q6wLjMCC/DDL6Mya1iKs51NpEGbslbQncWQpSjORa/b9O0/8T1v+QvfsgL/upJf+3zrj/2Fa/7wW1SFyMe03gJwjRU1kbxjoXHKX7QKnN6w7gn3KxMAABAASURBVBv+9p96+1//9vP8iy9zzty78dpNN/yN73jzf/2twRyOLV6l3KkKhBjKMn4KL0FYkYyUu1Tw47o/8x/d8P1/4uI3XaUzXNZfdN613/UH3vK3vp2vGXiRqorGzkWwWzqCtnwOVUG2NPkPZsT8LAtUtRbpxP6jz/zbW07uPwpnPGs5AuvWsnNrxLed9z0dPsOJP2x+IWd2JDgz7Ps68xaTjlzN8mmKksCFmJ8Ac04hrozazqHte7d/eTO/85EHBUdKlHSHO0Z13hq/1Sj7sy4uvvbyK2+4duPllzCqa8k1mUXAZ2DEbrOszZGJPyFq/BqbinXrvupPfv23/bP/6g9873/6pj/7ziu+7roNF52HrVf+xIZ1l7756uu//e03/JU/+i3v+vNv/Ut/+LyLLiCzNMsx978APKn4t054Kak50sIjgSj5zdU7/+Gf/fq/+Sff+OfeedU733j+lafnv25N3Da+9tIrv/lNb/yub7zhb33H2//Gd7Q/yw/epnckccr7AUf8TY1IXTutyJRagLX1jc674qKv/h/+k6/93m9//Z//hiu++as2vm6TOToNZd0l51/ytte95jve9obv+Zav/ht/fNM7ri1v+dYpT0/V9qe99XyGG8IyEsRv89z82hugDUFILCgRIpYOHeNn/xO7l/8nSVCNZ+1FYFwAL/xNDm3de2Q3v4In2YhtzsmJmJ+TjtBY2XFzQDgQnBbJok/43II4VuIUwUdU8XXs4JEd/M7nqd25NP3Oh1HMZUrjYAGjyJh0XRpXF1x+0dVvv+7i113G72qwBgTPk2PB2RDApz0KEjZTk4idVHEKQZa9A0lNfI8FXb/x/Ku//vqv/s5veOf3/md/9F/8pf//v/kr3/5T/309f5n6j/8k9V+m/uM/9Zf/2L/+HoSp/u8Qvu1fV/0T/923Tc8f/Vf/LfIf+b/+m3f+7T/15j//Ta/5xjedf/lFEfaCudpTN0FHLBMAZZT/EECQy1t6foxUq/J/3XnrL37jldf9sbe95S/94Xf+w+/8lvf8l9/6z//Lb3nPX/yW97T6L37zP0Om/gsI3/xu13/w3d+NQP0H3/0XvunHv/sPvvu7Xf/4d3/Tj30Xwjf+2Hf9wR//7nd8/59803d/09Xf/KaLrrmcicq/RGB22UMqnAJx3PDQkgqx51l8c4pPnkVmmFkg3C6Xv/MNr//P/+O3/PU/9h+9689+3T/+zq//x63+zq/74T9D9x3UP/yd7/ihP4Pwjh/609Rvp/6hP/P2H/zTCDf84J96+w/+6Rta/QN/CuFtP/CfvfX7vuP6v/jOK/+TN1/0xiuJCTskmDNl37xDNCFAyJLsuYRXrSqfM4svSgpdX5Gq4HlIJw8c3fIztxzfdqCwUa31CKxb6w6uDf923f80J8RbPqnI2m58UNjyFjnDiad1BiwH2Qd1cEKAOUtimJtCommpOVFFWTp+cvfj23Y98PSJ9jtTjEVM/IziRPHVZawj+tlw0XlXvPWay970mnUb1qtGxYyDHVO6BbR4KNlyEZvYtFWb30e39WZDMhf4EhaU5qXVs9mAZ0C0TOep4Jgbk/+aSnRtLbTzK7YTobylgwVqRXFUdsJjZ4h6MdHxr24WJ/u8ne+5pCifLVvyKBnpnWbBHb+ldWULWPMoNQs1gTySyly/2XRSaQtJueQccVcpRVuLLaQ6v0cgJYUVVbnnt/PLw1KYVEFv3wujAYfGQ2tEYmaRb0Xn9BVZ2xE1bY0P5ASgE81mxT+AhU3gpq1aUsTxPYe3/NTNx57Zr1HOkgiMC+BFfSh+C2QeJ40zI7KAG1GB+DwsIKXtmYujAceISfL5KTNGUKSopEPb/Od8+v9zC8dLWaTUMj55pxAJSla9bsO6TW+86sq3Xnf+RRegjsCcNX6ZEN+gikJO8Sg4wmbZtxItjc+2gjqFAcbJMitqIuwspLTmL0foFR8O4mSBqTKYi6Gi0OCDETo8LT4Yg0OXBwSZGrk9yCAzGWFCsNbsu5ZCVdCWiJa5DIFgIXHLHiocnix25xixtlZaHFndtNTWwWnq8hakLNAxPxu/BqVAeJkFFmPgEAEQuSO0pyLwMoojStdmWaNfq7O1NkkhyuJn51jreZWN44b1Br3s/BLhm9pkFI5MdaqyFkR0JKqygM/I3A2ioC2bWVqq8s2tNPl/7Jl9W37q5uM7D2mUsycC4wJ4Ud9q931Pc8bUzrCPhk8CCKeC06JnI2EIfM4xwkkDoOZc2UL9p9ye2rd5Zy5xxExHLZmq4MTCNBDMSxvY7IikjVdfetXbX3/hlZcYps85JIMgaOKUBQB7aGOIbiY+Z7iQzrc/5YT101BmVNTsExJAUQiKmjCM2HBi7tkIoOZ8cyTF5G3NKMoMQW7PItLkwE5NAKEhCMxe9dwmSNgfLfCzIcKCmg9zBD5UwhFIVrptfEsNyTm/4ukJZtpCMJAzhE5Z8GC/1Smte36XI3ZqhkjlDxU3mbl+a3Dgf7rnKnC3OAy2O1Jpg7qQqiYLDIhT+LbTOdXgsyhZNju/VgQ4fa9OLGTim3PkyT1b/s0tJ/bWfzsd7XjOkgiMC+BFfSh+OcN255wHp0N+nbk4dWL3uxElhQLcnCaLhnfimGgZzsnjJ/Y8un3ng1uOHz4e8slkLG09jIKaICmqmpnWHW4OnX/xBVfdcN1lb7gq1i8M9Ym1VhhDrkY+t2okpxd8cXZoSLZGIF2kmeULwceS/DafpWbIfBArQFgLCiaMQJ0yTI0doVUVOEEnBQUZjDoiEOpJ6kUEeY5Y6QgEa7H/aPzAAbFU/iB0pPNrLvP7LKU1K8xHwKaiWjWEkKutCxP2PwoRpZbnCllNmwxOUbFgt9bOPKyOK7kwC7PLWiF7YmCr/b0KEQpz8MQilDQi/LETonQ+CDPKWhCLIMVxZbnsWGHOzAKzPwdflOJ7cOM3JMxHVAoYa6mwp7LILG5Akr508L5tW/7tLUtHxp/4rHCcVdW4AF7U5zp59MTW2x/jBHAHMICjFJzV5CRwhlPBeQCezm12JODUCaozhhZiLOXSwe37dnx5c/2LZQFBpzZRlBQdQ7YZrgA4n+Bat2H95V919RVfe82GC8/HZtO6thIq/pQZzqoteNSC2LRVm28tphk2TWhkgS+V/2XfA7wAqMxgolxS4UyRYSQlc4NRnt2GVWXS2kB0PhkWfqknPivq/eIgG7FltVEg/fHQmQVmt9znDc8bNarIppbL5oi5BL88MRGtB/hFLK2qM1lwpyEyn8qI3yzYgCcrfqph1TFHLh3N7EhpNVsjFCuaFq54A0/MX9hdbVTzIdwEHM1HsaSGKKztdXFKhmlr0RAmzYIRAn7vRNOWbwGsxklR0rXf0qr8gXPgS1u2vff2HH/bixCdhc9zXQBn4TJWwOVHP3IHuz/EaVdVdaLqVKgU3A1zLYjPjzmczOJT6eiBw/zrhP1P8TufpaKYxFGyBVHAsJ/ijNFDmVhwo3Vx4es2Xf326y644uKI4visKqyEX2yQJiaNTztoiSYJLa9FtKIVCGohGsF/GRHm7TOwmJ28WYiytK4RzaGBkxl4CywKDXwQZD/O4OZgAU87UnyY7vLCAUHgQW71IhJeboYCFY85FgspMyCBD/aH2QWxEFWZEDW+B2QqsKmU10tdUtkshIoAwC/XzTFCpyjwie3MAnDSsU2VbH4h0sRv9j1KFFPxqtmn77lk/1X8QpRhJDuCt4xCj2H0yCBwPBd9+dt1vhUmwkGTWJgQWSYyQi1RMWqyjz+ioA0rPE0Kyb4ZkehM/BRzZUrad8uT295/J7/ARB7P2RiBcQG82K/2zC0PH9t7mDOg4JxTcZ6TRlkWEnGOFKXOG+rqLB0/sfuxbbsefObEkf5/hVqwGFZHSVUKc8VYRkp10s6/9EJ+57Ppuiu1fl1D5DLncEwNKIPDnohubKaL1aC148JC8a1/Fn/BQuenbEyiAbGcwo4rr7csuAMo8pES4mxFUf7L/KSmnSHVdbWINDmwM5loCDxHnkZahtgfLfDn/pPL5LKAlG+9sjtR/jgYlhqSp/A9wUxrH6pTFdatZfo2VxkwUlr3/MYyhDGaIXRMVdR6A286klEIvbJghZFyPQtixhlSMBncisnDslkKmNgp0d8LhRcMlIhzJDyJNH2v4lOdgjR+X9GuTzy440P3FEmjnKURWHeW+r3ybi+dWHryd7/seVPyEfAp9e5HdsO7DInZGV7Kg9v2bvvyk/XnfDyYV3XeYt4gAaGxOdU5RLvuvPWXffXrLn/L6zZccF7pioO205lxQlBbTNILrZidV4gpDOEdSBdppnxh0SSh5aUmwZzKFzYrjzDKMkblN8N8KeQebxphqolPqskIq2Ggl/kgaqVsds4yGRONwRhsdgvMnsAwIypK1qpE8D5Lac2S5xIl0xymUUM8NIudWmahd8xHYR9qRvNPsVB5EI6pcFTWXDO76uvgVc042ZTM8YTANFhoSNKQtYNRKZdmU+VhIbaJGSPNFU38pla3UE14jcbNKYRKFIZimQ5KZGxgM5nF/qMvviFF0BUcazvCIEA8iVIgb/+1e/b87sMI4zmrIzAugJfw+R7/5PTzTmYdBNccJU4F50ecPTrtyDQ5dHT/4R33bd7/1C4toUu5cOqQMeC6AFd+OXtYRsqMdesuuuayq9/x+o2XXRjY1CK/W5CzBjZ9WPvQjmB54shaueQkGpn45CN0nsEv4zrJvc5hdoZ6UE5IadsaGZ28hRSHTqaiPGk1SD3mIKCl5plpnVmegw/FD1o3YnayVQbzYiJwi1ma/+iTtx5zJKvD/pTU+dkQtP17pWZImaNKUYn6FAtq1OJ3bUfMF8WoZ0yPnDpwmv8AKoUr26+3rXphRaoJmjUVNdCqbCoLQa41Rk1cdRQHLXM1udUgDLK1VMlZNRU3ELLtRDfTEDopClX5BpUQd04heXJp26/cuf/WJ2GN52yPwLgAXsIX3Pvwtt0PbGm5w+eqTjsnBCTccGiAOZ8cmVw6fnJ3/V82Tr/zAY82GTwkklLrum4das6YdMGmC696+7WXXnsF2cCGRWWbmoqJyG7q3NaxNbkjnc8saER2YEohpjn4WIhl8+mjJhd4FCRZOyE2gczsCnxD7Aj8tCgX8o48yhxVASl+aiKBaOqUjM2EoyogyK0uwNomiFEpStMSbdVchhMLqoI/1SqjFHQyFXwjpeTGVSbIbI3ItimKOenK8mTBNs2xBQalKgIBxQjaQiQjHozPCjgzBDnTWrkwF+qUjCQt/Cx+dgQ3jbvnFxlEaJlLLkb8xQMbGEALgmvFUUPU+HSsKCLIJC/jZ2mp7Ilos1U08FP2XxRiHgYyj5985ue+yL/4BRzPqyAC4wJ4aR/xkY/cEWQfcTY4ELKcnC6fSToF+8/5HNi6d9s9Tx7dc7AhnB+mmepG1NTIJXyUQdadt+GKr3ndZV/zuvUX+M/5WNWnkhpHLiWi8KiwI5JjbhGcAAAQAElEQVTFbM2EkDUKURYfZUOEJx2pYcVPiynRqPETMVOimSGaJusIfT/hTJEQneMMYKHPpXSft3OQpCa3WlVm8mShc0qZ8uo04+BEFCK+Rbm4DGHKWtKMg1bFj84PkJmWaGDnVMSUrEpicNlsvqUo1pQF9/xWx2j5swyBXk9UlMyhG3Youj9YlzqC7NF+F5HAQWnOTxUSIIywcjkShkQxvGx/st5oo8KcqiDZH+gYi641EqYwlS0c33HwqX954+FHdpo23ldFBMYF8NI+4+bPPcBP9MGJSFVFjljIdKEjBw7tvHfzgc27OEhTvjBHVWoQP20tdODRy4z16y6+5oqr33Hd+Zv8Ox+TOP+oOIFoETJFBkFoCDIIshSisZZGnF5EIdL43E5iIWgFv3yuYfQwM4l4kx0BQsEgMEYZlnu8xrEgHCSbGM2MIF8g8pjK2gHo8CC3OsJGZ3LD6fIgR6BFxDIWCEDZBPCMNVeCN07TostovpmTZaA4rcoMKJP/aPE2zEeNBdtk3KlIosUHoYYvyoRggV4wZhGxbKj4QmvTBlJ8I2kRCZCUC6OQVR4WQgRkRMH/0M4slFbUDjB8N9G1wB0pm6qhE2Iiw3BnGRJTBBi8wE/V7CrLcBgmW6BCzEP3bd/8rz5/fPtBCON51URgXAAv7VOePHJ88+8/OOUFzkZl2ODQ6OTxE3se3rr7wa3L/h/E5LPX+YKvlKbGo1rngisuvurt111yzWUiQxg2i2MnywJ0dhDHEWvNAhmqyzW5VFq5ZImpapo2PFQCURvVtQ0BroTjyYqfy/m1RlkrqFiwNSzYwSCbGLE/6qXzu00pyCzVaasgGjNEC6W09Jnd1my5RgGFZ6Tl8bw0k9ZzNe2EoEx1vrX0cT14E9FI55sDtIA0TqmrshZM1ZksyGiN7UhpG4cJ0Da5tO75rQh0xI0aR7YuFRJEMjOMpMpmFKIw1OoS0U6RN9/+N60gZtO6xtHAghvHs7QQl/FRqnxTeLArZTTEAxqcu3/3oWf+3ReXjp4AG8+rKQKLF8CraV1ncC2PfeROrJPFOBzUUc3BHXv5nc/hPYd8NAupKtHCER25pErqjSjrz19/xVuuufxNr1l//oYGVx4MVFAZa8mnus6tDylwa0AswzdHKc6th1nLGaYR5x8YyRZg5AwBK74RFGETyHY/apRC5lhmFcgCwR8aG+ta+GidXxYsGBGFLIlprGRGeABYedv4cwScJ2KOhNdif8pAzdKVyHCBm01zMhV9LjeoPYv5KfsvCp7DwRcVgmyO4HeOEawKSorZqZCN2FtBFFVpqyq+XGp6rFmu1zIWtMi3tzlDsMao0pebiWgPyzdR0NpCRilcgTCvEBnsZuKnKFSGn81vSDIsRUX0GuIOFkTJjPBgi0pmnPkPwk88z/y723Z/4itiPP3xvLoiMC6Al/w9d93/9LYvPtrPCWcyc++TO/c94d/50GuHzEYTkRydluv0dIkmirg+Ln3DlVd/3RvOv2SjOQm/eD6NOSEt+3A+OZnWlhLtHBGZIhcQizXKk2TxMTbjpywuIIydIWr8RC1XdnSyYHPhDJVzC4I/zZUMCkjFd0cJ0do5IkX31plIVU5FGDVxrJ98c1ZyHwttrC0bML8jzC67QNW07kRZiOY5AxKf4SPV1wkGZVVG6DAYtRGA6jQL9JK3Ota6Qz81Q+jVE+W/OXTD08c0e84RwuOe3zk/FXZBc35HAoQRVi5HwpAohmcrwozlaKPCnKogtcg0xBzV7GVAMec7Jke37Nv8E58/dN82tON5VUZgXAAv57Pe87OfXjq5xGnhSB49eOTQ9r1lJcUJmir5iFUHyTI6N5UQ8sKrLrnq7ddffPUmco2AGofchJAJkgjQMyOcQeiBRCFoacVZTYE0C+2nuQQBokELgxoZBEctN75scoaghSNKqjgCsRbDHZn4RiLwR1WaFg+rh0+2Q35RBCbQdr7hTulI67WcTh0B3xiyMO8Bc6SUGc23miUiaBnQiIwKhtlnZk9EomHEamYUdBAJ01TmhCipZtMw9lU20aqIhdiCESzYkKCkyJjSggWQmluldZUBx2PdEbKy+KLGWxlR8L/igBSf8fBl2PyQEJm22ceCHRUlhcKj3JQsIF5zbNLEJhtHYWIawZxqdnmqGaKUmA+bbhkUsf9LT2/+1zeNX/rrVV3GBfByPu++x3Y8/tt3OaeEDm8l+/vsqE6QKDmTqkOlCQmt33jeVW+9dtMbr95wHr/zSVHStV9OJnJwfDmZPrZqiM+q2hyihSNKlkg959dQVOb6tQ1rBVXZtQU0bUdKC8crUk1WSGmxX0mDXNktJJR6ygb0CYjyNmwfyD9dRiFFnleVZdxt2la7Ly3IWBAlmLfWi29hy4scZPsmOGr8nPieXZ3fOMJTkOqUlk5ms6luIeD4tbHi2EJ2pFF7p83njl/zCylOIamSW21ELilZZl5mYkRxgtkzS9HUTUyZg8wNhA/dHwaBexXlG2oQW6DBjmA25Sl8qX2LwGhxzCyOQGQYofxh/M6P3LftfXfm8ZNg43kVR2BcAC/z497/3huXjp1U6vix4z5AnCDOMDX2OJnyGUOUz6QoKNetX3fZ66+6+u3Xn3fxRp+3hEMrBjm7CTOpdkotonVjRIJH3qQGEhxVwUI7sczCUHRZjVITAlZ8EM41IsAkW0zZaBa/ZpRA8IfGxtDSFDPKJlp64jUeCCDFx34GvmGstGG+EXMKaQKcJnhF5rcBxhpiyXy3WF7gK4htm7cNSuxDo0OWRGDlIMFoefbOp4+iIapO0GTKsytESZlPbaIRtEbkGdEJk0nHMLI058xlR0DYnCHIHkCe1cRv9ru3DBAcZYiFeRgREFOJfiGWrW240gpi0hpIDQcpC6ihwMcwdVlwZRxIzNVEWVtj7ZuYJUHcLB0+/vS/vWXPZx8BHM+rPgLjAniZn/jonkMP/8ZtDF63br0UHJ2qfLzSFefKDbh1qQuv3kTqv/DqS5VFlOTTmKKkwrmGhsPqc5hSzLUdAaoTi8lCitQRZXiopN6QESbRSHjQTOnecv4iYqr7uWDT9slZTIlWwrQRUkpHovwvm4XAmPyfPFQsRzLniCh2080Cv9mfzxvmpBR2oldN605p0TUEytz/Fg3MmYcBvFVC7Ygo1jQLdJK3OlXRgZ2qjnkGQASCtx1p2tkaJbST/RTu8DaO5VQb9iwkmm8LnI6EoTYqGieMRMmtPkWLb6cgkz/AtT8DC+mqfIN/bMv+J/+f3z/88PiT/kTknHjGBfDyP/OD77+Za+D8TRs5V+JMZat8ojhY4ZMpyoaLzif1X/aGK9edt4GuiVmcTJEvDGEgI5ze6KUUjC+tKHAyQSAJGcRaxGqmWTi9KpLgpCaRPJWCk8K8LTAIbIYgm58CT3OcK7t2yqRwjKQtwLObKSPwmQcZw2jha1bwJwItHGvBZ8gkN9ycGYIXYX8ArEUGqY5U8wbN5A8i3pqTzQcFnNJWhT8ZoqBFlqwVHEzT8SAj5uBbQ6z1YKZNqHAWLIBYZwSFKRl4a8yd4qe1crFNaxX8b+KrkFJLzG6cXIyIU80+FlDIBa3FCUEGYSotICV7LgakMOSYVCPmeg6+AgvGMTfjG9p/65NP/evPn9h9WKOcMxEYF8DL/9QnDh27/5duvPDKS7Ses5R1sKg4zynyo3LdhvX8rv/qt12/4cLzUHDERbGSfJQN8WkEnJ/VgguZ+DAb37M0fliExEMuUNJ2yIoFsWmzI2U7yjdEJ4FqutZD6YcziGWsBolBYMxgRC6p4jebKZkTk/+aSpiP1ouI0ra66RdkcwBnCLksPFZRo1D58SS09o0GryZti0ybxXXTynwsN7470Wwy0rCbhqiiUXKah5bBhGbqGABR1xqWVAMsw1QzXTWG1UvTulaq88tb9CmVoio6MACsjfKHjiFk22dd2ZCu9Swp6gSuNQYdgFbbDgqGBRaE58VBb74SIWC6pROKk4ePb/vAXds+ePf4pT+xOaceXwDn1IJP72If//hdh7bsveKrX8chq6PKgUIMjtdFr9109Ttef9FVl5LRxHHkuJEi0AtlKjilSPThT4jkkbkMEQWkMoh8njvHjSi2wyhOu7CJvW6smlP5KRCsCa3U/SkLmEi0jGf2CaFX/EbFhRrWpjJH7jMKOSMwAYAWhFoRcyTwreybwah8Nn8ZEviW2JlbkEUjhucWOtL4pngC/FHjB00NoDLHK7JvBWfIhuQ1qmk7Ym+BhZq3DfBM9DHUajjSAj+FiRkCx3J5IjrW+ma1LLXVUVssLZXwBz61O+YUojTJu8h8tG5kCjKuURfiCiqKjHBnZsFj6TDGyiyfpfJf0sH7tz35zz+7/7ankMdzrkVgXACv6IvnUn75Zz9zwaYLX/N1r7/4tZvOu+SCCy676OJrLqe76fqr1q9fx5nnpHFMPU0qyDUcaJ9Pn8NUIZVT4ATnUxIn8z+AYM0chokT7gZkEo1YK80R1SwmWmsFSBPFZKWdIx4deFizVxWQylmbaAgzzhBsxJxvjpHJ/8o7AIoJcYc3NRtFb9I699HlmRDE5FUu8jPK/wULHRGeQBUuL0c6nwCjC9TNgsynsnoBYbJC4KXEzNg0kB4pqahVWe23OtZWgJYhNZaKUUTDHEnVBLOfyq+f0z1X4zBjR7DQ+K6rU1XXYnlusxRGxAKAO6ctvvlmbaDNpSPHt/7ql7b8/K0n9o3/L1/idS4+4wJ4pV99222PbrvtsQ0XnHfp66+86q3X8U8Dl1x3+frz/TsfTlpwBjnnZEBOpg+dT7VPI+dc6BBTZBCJuvgmhfmieGhvOMkKK+EbEpwuZthaGk3BwWhr5CwjtIyjwb6Q4HQ+OVdhDpA1Krn4iJhJGvtgCNlI8YHVCjYjwjI2odo+/hRSMqo5pyEwZU7Ry6Yt2L5aldYyUOUPLtat42GyBUEHkWYIfKGR+VTNJgDmao0mIi9D6IiSqVkkPT18kJKatmwGHGMMQgtHbYXUrE7WCpmJGeS6kEkGyMCOzCk+tozQiNJ8EAj2Bckc80FwnRnFem0BpiaOmlYTX41DY0Quzc6EwGdsei2pQw9sf/I9n91/2/jB34E6Z99xAZyGT/+lf/WJI7sP+nxy1IIzVjZTIgtwYo1k1HnuiMwJV5IbqHSyTmaqRhlGWcdflMyGoCWdSFaEK0TyUdd2pLQoMFpiWsZC59tAlD/F71pzyv8EUA01P+ccIXsulGocpOLQgkTzvGojUkOEsW50GRIeO0egqRDhW+fPZqx5A0Nqo+SSKkSd707TRkMCPha8Xjh0ip8FS3SYZeqkKO74TXQsSCpzVSUdG6qOOXIpFLhsApSWUZV5PSEy6uLDtc0o38LKVDVqo0BSKiTgqNk0hLWGNG2vzc8mN22rRemwSts71nq9cfLoiR2/fs/TP3fL+MFf53wZF8Bp2AKHt+27/cc+srTU/24wp46fxWw3M4KUVqLPDioi0QAAEABJREFUMzKn0T/LA9Wp5hBLZEy5GDE/5fOvQJnpRhQyYIlGsJBAJZqkU/lo4VOX1vaRQYR58pGAy59uQU3rukQqZBODsRYbggVWxGg/eFtN2USPzURrjvEFpLpYsyFGYXOGhEOSoVhEsCRWZLpHRaB1J6k6X1WYSzW0LFgNX9Ar/lCt9YyieLApHWaShNoQOszhwcwrYLxPUVBXBLrWcqJOqSOMRAZXlc7Hn6bAZKq0C/yMQjwgJfxhlJtJBlEGnqC1mSx+gggErflWgHdE1rJSm5DKGIg5Yi5GIWbCP/zwjif/+Wf23vS4RhkRkMYFcHp2wY67n/zKr9xcJ5CjpuD0KuWzl0zAOyFoM6hAJy1J4lREcw5auIwIn3xENxO/Kd3za6W1knvP4ucc6fYTYuIcDYiHuqOk7zum+Kkq0VfUZjQUk/8LFsjIna85vyML/GchTCmXGWe2Xs9bE6AOe+i28jtCWxHW7C1OYyYYCTB1GBrNk0ImCxCzgIyJb5vVqQrjNZmrpOO3BpfWPb/LEYxqhjDGVAWzZ81ixOYaQq/4nt4InUCe8RdX1KPq3TXjFN8Ig7JGFdI+Tybma5T5ffY8fnLbh+7e/NM3Hx9/0JPwjKciMC6ACsPpqB58381bb33EeYQzKU6dTztHk8NYx7DaViVaSClyaE2dEhyf3hmSYBOni+n0Ind4J74gyVlmwUKNpYLftTDMyUaiZ62akmlT1mriM0dGIQoVyZygk4KTDAbNjAjU9aTMB1ErcEJEQMGKEm1ZiGjaVpvTkcpWM5umw2esPZH6qOILljyXKIUwiwd4EkRGoHCNTWGeLxLmdw6ITcvUqcIkWvOFtx5bCHIqbM01cwlEMuLJMIOaTD0hmDTekeJjK8OzywWtLYBgXwwzB61APNhIyYVPnEKUMz5i4xfiqjypwVWhZWwGczEKUXnkkZ2Pv6d+8C9Eo4wIVATGBVBhOB0Vh/aO93zs8Lb9ixmHwxo+geJkckxF4QT6ZKbCZ75pXSc6qGkZsbRScVwhkqG61hzzm4JJsogJiVkWhko9vwB3LQjTFF8uqeJn1QC2HYwiW9FL3oBfWneAo/wPT24EhiY+WlWJ4iASlia3GmTxQVtdZm+rcy1PqLD9UrK+1vZZrG7aaEjg4IxfHfPTkh0iI+fEJw7q1LJvjiQ3jcOK3FENKEkUo+ZnR5p2tkYYDbEjcO1xlLb4qWoUNgE3eQsJ/DeXN5u2I2FDarVFtG6i+K1u2jCskpdxNM2+dOzE9g99+al/c9P4G14aZVkE3BkXgKNwut7jB49+8Z9+eOnoCec1TmDZReaUcsR9JgshCUXMcwFaOKIpLbJFMpctJFiJHHRkcpmJ5hRJZIQ0gk11PjkUsfGZlpw1IfTMT0Yh4gIk8SZ8c5DpqTilFYW5ZASOSstUGcyVdHncwAGhw4Pc6kUEGTwUqHiQqevp84KYg1vMgUmHJzu7Zi8yiBXILSbctcLmMr47aIUdzfieJRgqtChS5f8Coo6IkvKMKfOpil9VMEpVmAA5sV9da+H3r0OAQKcVTRawlqnqeV3IIMKCG80tTAgwHBRiDB03rDeab2KAUBQyycUvBH6i3X/Xlsff/em9Nz2m1CgjAs+OwLgAnh2TV4TsfWjr3T/5u5w9skDUwVRlCrnD2a6T2JCaxzBC1IktfjRtGJm0GGsn+BQL1hdRqsZ9ZYmS3POrRKzk4F5pnwtRK2SxmdZIdH/wgW6zQD5NOvU0BG1HGj/s/jIEMrmJmieaTSR1bxcQhceiK09oOwdrhXjCOccxW8a3epkFA30WyZ2q0hImq0NFvpZtUdncpFVRZoh7MFQTmOOOh0Xl5bCoSduj5DFzvnvtWzBj8VPVRFmQLSwgNT9McERzqqF6NtK1ZefY9gNP/eRNz7z3thN7x5/xd6jG+5wRGBfAc4blFYFPfurLT37qXk41+S6wlBnOd0gc22yIwi3QdLY582Q3gYKE+WmtjJBcFWikOtuWMkGwL/KFxWrQSmix4IbZQNAKrUCKT1aSjWHBcKKwyDDzmap5aE7xC2EAxDk/AVTFc7VZDJkEEva/1FU1pERmn3MKwX7NNTkBWHy3UZYtJTOG5+fFgBMyjTUqTqBUhmXjmbYJF62SyvOGKO6gFRbo8VSHqrTA+JPCf1FhIEWxun8d1AWAdwRvZWsZjAIutZCVtlmIOfgmBf+zNRHbBb4VRqwVpfjFaUjZt5jYdMcyejtoJNsssrx05PiOj9z7xHs+c/h5/9/bmWU8IwLjAjgje+Cen/zUnq9s5bT7JJMLkpMpDqkRtz64TAyi4Dy7JbNEg5fxG3vi0CutZKTx5wbUZ2la18oiyqX5QO2hAB4dzkpJB6KgKufWkn7lTfNTLjnjZwOk6P7gPlDju9by4jgYyYk/cRILjLWO1bfGs3gCMix8ayfElLA/EMMdWnxGOpXvUVJxXCUyGZYabgdESZU5I/TQqQFpJHunQSptk60Var9RETCCD27UOOp8N1FxDovZtAEy51tRfLSWrRU+OAKKCSm+IzlDZD5IARBj321PPfZjv7f7M4/kUmJwPCMCzx+BcQE8f3xepvbk0RM3//0P7LrvabKDUxE5S5xPRI4lp9Ud8pEln2rOuSglctpT5BQJLWdbLh0psckpZxAFlj2MTKBoiCgpW0gJteBgFNlE8A67wX6oiokNmfHtbUz8yYKzkgd0fucYgZFZfNczpAngTfCMwZzMxQAJOx6lVtAiODITBwQRRKZW1flY4BYRBW1Es2kEEQQc51QxYWibDGtqEvSKmRF8UKNg04OWWXAEjNc4tCmQZXyvN2cI1rL3xBhkEGU0TzrCFwehI6GFIxc4qqH4j2zfgBeQri1+43REOrZl3xP/8nPP/ModJw8cZdB4RgReTATGBfBiovRyOCeOHL/lB39t+x31N26SY+6jKqeWtLlUP+GFREsFs1yQzg4Jr7SC2xCgQoqfJUozLTPYgjRDMkuUyD5q/JSkBHYOooEyR+jMLJhPPs2mFVQjlQFldwObnV8cKciMICirlk5FgGccUaa5eqbTjD+fd4GfCkxTTdruzwKSbY0SmBo/PSilQqJmnCPwMWktbChWz7VgNcCIKDNt2TQwR+jZzJzvng1UlMpClgtU3f9kTCkCDlR7YowQdySAIAFQ9+8FMTq/2zl58Nj2X7v78X/x2SNP7IE3nhGBFx+BcQG8+Fi9ZCZ3wK3/5De23/kEI7NyjY8yWZI+RxsEOX3meaMQkUGs9dkGmfjom2iSfP6FFptuSAkgORPppzkpG+v2yVnYBBYm/CaIRTj8LNmR6iBbYZsJUF1mTxnBpmcWDCygBqZTD/5EoHUHmYY6Yo4ggkjLECxFWRZSs8kKLAsifLRywf80ogTJNERtm6JDLpa1iVaMVrPZYQBzMjXxCyH+8KJkVd0Q5LLJ7Fq00LTUGIJDjSwoaqX4ZGoQhjEZVjLgZOmpgZWBXn6LL+JvpLQ4IfPhWFTniw4cJpwQFAzQnpsff+zHfneP/5yPu/DGMyLw4iMwLoAXH6uXw1w6fvKLvgMeV51qBQfZZ5szr0IMSK126yMuSCotNam3a/uRt7YjalD15mK3Hw2BIxCyUiUIV+Z3bXGCXAnHstWevRDP1AApuj+4A2RrHdGy4oxWQNO2uoDJgjtYcON5a71EIzz7IgeZuaB5Lhq8mvhGJn7joE8FFARrVR0DKQr2C8g2StVRrahzmsI+eIBfudO13bBvoEJSnW+OmraapnWtzgkiyRqjSFVXlaanorSuzS9OISgYRF1wWxErzYCS1Eb4ef/xf/GZbR+86+Sh41gbz4jAi4zAIm1cAIvROCNy3QG/+cxND8kZx1OQJUOVO0CE1M82p1uFiMI5b1nGGUFRCE0izBCnB+cCYynoGNKkZRbVsELIGir7jEk1DtpEZhBashuwzLHWCB0sOHuCZkbgszEsR+OEu7wg1DwRHQIJ1pLNPpqaJeZaICxHzBFERqmmVJ/RrTyXKBMfm/a28T0eoHF6B60hXjhY0qTFnaJYw1xobVNQUvZW1hIhA4WoEIYVEnBmCLJxj/CLXOGJNpc8QHCUYVlCCwfYIh03NXv3VjlHutz5WFjGP/rMvqd/4YtP/KvPHX16n0YZEXgFERgXwCsI3oseyh1wx7s/yh1ALvAxJy/U2SYpNkSnIEUiQzGDcwTHH0Ruip8lopyQ1BxRhmGpQx6xiLjP7DNO52OikhOjliPhjNZsFge7k7eYUZWYI+bg+QxBH9Nc4HR5ovPnuW9CUGa5QDVpuz+oJiSbP4Wo8TNwP43QRs04R+Z82KlSz7REeI5gQNYUpWyCVMdoJj2/MwR7zAe6iJhqqK23+CYFkez8rEmwX/d3WMsAlNE4YSRKbnXxdXzHoS2/dNtj7/nMgbu3QPaQ8Y4IvIIIjAvgFQTvpQzNk0u+A25+KDja5BHyBcMrD4JwEwgZxFrEanz+hdZ5hIYTD6dSR/Hpp+CkbAybDAKbIcjmp8DTHGe6rq0EiQJOR9yR4dQcQWaqDNvRrOAPiLud3zlGPFfje+wCgjjHJwvFoep2vEh59rQnanxRWFxYmSqFq0wDMpKuSgKqDhX8Wq8dUvmPkg4WmF3MiCSKBy9DGGwfFIyyVQYlnZTKgijFJ3cXYr4jIPNRwpdsHw89grf42CoEQ1AYZT4Inc6XRRAPnlnwWOn4rkPPfODOx378d/fdsZnJYL7MZwwbEViIwLgAFoJxhkXfAT/+0Yd+9RbPw/mnoSYLVM2pdqaQguNfOYJs0JAJKkVVDSltTnz3/JJnGkduutYifXJW4zNBccl0cz4Tqvip4uMLUDQPNStNm+6nmrbVRtQRLZSZNpPZ/VP8DDFrYS531TnCN/MJDDZdy4UpcQrJa5G8iigLltLamqXxjamp2yAZaYAlpS1kWs7SSar1FpJ0bKgN6BbcNK1rCT6cKG9FqUEYDhPpoFSU1vWksJxdi7rgtiL4DccrIyf2H936a3c/+n/+7t4vPJHjT/cT4fGcvgiMC+D0xfJFWOIAP/jLN33xXb958shxn3KGkAUq41hUpQIjJARRSiSRpOA0zGIh5BQpLAKJViBddFM//5JtRfoiqciMyikoGWZraI2USJXmJHwSKmJDimN+ITgkayM6VNnWHKvrbUiJTJsIpyDBWpoddHiVGTYGEzuGJn5H0Bqxhrc4cz4cZpE5+NsigIPYhNuRVPGrSs04cy151hRmUfenI820cSaQOYXUyLKj4osVKcu+VLO7tmh1yWjxnNmXIQKY883piCyfOHB0+4e//MiPfnLPjY/y04NGGRE43REYF8DpjuiLsLf99sdu/L73HXh8J8dfZJbKVshkkKSRU4JlTFkEcnMq4hzhdKTiUzvjmygVUvwsUaIxH36qUpAaYr4RJX2yXpY7qSrhHGe5vDIUZLrqOCcagD/lNXexTzNHJv6zEWi23Octm/gV9qc8WY4IT6AKSoYrJH4fBNIAABAASURBVLcTv8+LpiHqfJszz1N5dZiGOkMmftmUVIOr8gC/1Sm+e34rAkbwp5ooRNjibQizl/+NXzPOZlefxfzUqfyOLB0+sf1j95H6d3364Tx+UqOMCJyZCIwL4MzE9YWsHtyy56a/+/6tn3+I7CDyBS8ZgaxBRnBmIWM6OaB1fgGxtiONS236nO8sBjFIejTYdDKhk3KhLpvmC0OVwWcIWqbCghFNBU5EDbCZidMQ+wMCn7oPKD5yxiwnpmW4oHYKCYTp3a+xWFZxykymohDJjTrfrWpFBcO3oiETfwERJcN8zCklOCyPFvt00tgCH29nCHIq1AsrEohkxIMxk1GIKCC4mRmlD5v0YOwHSMIwJPPhIEvFp0FZnDQitChEWTpyYucnH3z4Rz5BvXT0BMh4RgTOXATGBXDmYvsClk8eO8G/Fr73pz+9dOJEVHJQkAVScj2JzpJN2xG0gsObiM5Q1XSth9L3z5uFpK3BBaMurSippq2avmcI8lQmnelJmZ/uppq21UbUES2UmRavmtzqTrE1RPtGw4onrdeo0kbVTQuCyyKPu2kekn+BO5/OxLcWhRHsiuJZmta6lKpTlTtmVae0hbD2QmQdlZ+mdU2vtIE/MOl6kN0N8+k0L+1bR6rRxPegQgLEXF5GNb69zRMnd336IVI/P/svHR5/tF+jnOYIPJe5cQE8V1RWEHvi43d/4R988Mjug8GkJAmyMJmBnJJOWWQ0OV8ILVnVjbVkjSaalDOkSGKs/BNlGaseFugwIlUVjQ0Hc1nUZCEDC3LxXEUtxCSQMN+yZ+BN+H0AWoZRw0HgaTK1sCMX5DAdC/YfqBAgkOYPddJHxZPA7oA4zzYEC5O3wrAtiGJq46OtQR2Z+HZX9l/WsuIWExAVwmBk16KYg8wgoe3e4pzgCH+6gtkL0QIf7SJf5Q/+21DxFxCbMf/ojgPbfuOer/zQb2/7zS+fPHhMo4wIrFQExgWwUpH+D8+z9ytbb/r+X9l5z2aRSZKMQI5oorMYWYL8koiltULpvDYh1i4iyIypAVVZX3wPUGLFP2/OEVskZ6U8ispPkOlqcFXNQudY3bKn+R4FssA/FYEFoc9b5kCClJjlSUfUEGEZqqDIs1prb+kgFoLO7XK+zRlNa8m58MnXM2RmzggU1JmW0wP8lrlCrF6G4E9TzDhQjGClx2SB371lkOb81AK/xI4c+sqOp37uC4/800/u+szD46d+4jqeFY7AuABWOODPPd3RPYe++EMfevy37kSdcrogf9E6l5ETUySTymJTxpkhaOFRVy4zx3LjW+GfOudIygxyH3YQeQrJjCAveVTxmbwjxYADn5qeHzgRjd/xGWJ1vUZkDj1kRNYSQaYGaPZJkticc0oykq6sjYBPB74sgtVoeUXZ+FGyIIIGy4OPV+54RlEmBKUg0qS44Zosl/KQ3C0MeDJTFjg4BJ8aXOYUH2/wgYlTFLRwBNJJ5uCb4BeHylr7xi/3d33ukYf/z08+8ZM37r9nZf5Kl0YZEXh2BMYF8OyYrA6SS3n/z3/u8/yjwB1PkExE3nC+EFkMsWUTcpPzIAmHbELt/OKM07VwoVJ3rTNR8RN4wSY5KNULGS87B3oqyGI5R2AFs2QizJ7Gocu8TW41SH+Kbs+rP2lr3vJtQlB3qpgFz0Vps6vPG7ilqFFSdQSS0flk7WzaMKyiNATL1hrKtFYuoHDsOXwDvKWdccpcVBys4w1Pv2ghmL3zU6Wlxibc5A2brsq9ikOzEMd2HNj6G3d/5Qc/vvXX7jq27QDc8YwIrGIExgWwisF/jqn3P7bjtn/ym7f/yG8e3LxLzjIij5D3RT5yfiSHIpJfemaJxgkBybJxiCSlQtpQROMtE5GnSisKsjyqbDLMxAzmMl30/JLpwhM0udURcyTMZ8AcURft7QIfTveHeWMiJXCYFSDIzJoKEqb9KQvImQFlERGIFZr8r9UxGMCjFvg2l8BCS9t84G6QOQlSMquAwAOCnNin4wdvBSJNfDFXLCLI5lsvT5JQU1R4KAoWDty39Yl/8/mHfvQTu/htz9Hxx3uIynhWPwLjAlj9b/BsD3bc8cTnv+9X7v/Zz544eDSdSMgjzkfkHZKKERo9F2KiUDYO/CjEkPlkupy0IlOVdoaQvzIql6GrpyFkzKyuutY2lyNWPwcSZk6jzEHGGlJ5QquGMLaQzu+cyUOJLC9zTkXsID7P+WoIPFHcKR8Y6/GqTlXLEfgVMlo45GsGm1FNMHtpjdTg50Kwbz1N04ZtZf225+GHf+QTT/z0TQfu34oWk+MZEVgjERgXwBr5EKe6kSeXnvjYXb//v773yY/dtXTipMhBvCKppEgtTiTTz7kpkMpZhaDt2SqDUaVlGCQ4IYtOYjML7kCiT42FBIDFA19lIbgV0DM00ZKkNStw0LYuMgL1IhLQ05ZR8ZTWrcqyZja7fU18a2QOMwpWlGwpzQGRME1VPouSMofKtgJGzUuFTXqiVMcVslnAKa/O/bpGZtbULXiSDHoMg0VtPghj6TMoxby8jVN8LWn/vc9s/sUvPvgDH33mg3cd23lQo4wIrL0IjAtg7X2TBY+OHzhy/8997ubvf/+OOx4PEg6ppmUZavIXucaIFeS4lltJUCptkJWqA7EjEx+4aduorp34aFUlyHTVseXSzpDSM69btG6kSescKkrOkOr0atIqo/xpnqCU+eRTxOimlVHzihq58xsHCgOQs2mpgYIXgJq++ViAI8kdtSlLO0Nm/jetLcgFM1ERKCSbttfNQimqqllkzuEndm/90N0P/KOP8CP/3tueXDrG5W1r4x0RWKUIPN+04wJ4vuisEd3Bzbvv+NHfuv1HfuvQ07sr80w51AkHH1Pkx2ypiYY8lIVkkJzkks7jjDKnLJAT0RqROTO+OwwofufQ5QGJlg1jgdPFsoPdtE3a4gvLbZSqIIOgDRomRDK/e0tjuBA0qhXJUhafAZ6Fyfm9FnjxO2KW+XAKRp0lpxo/GlL+yx36DLIarwpIIGTBkYx0CxmLCLJx62UDCTVFFUd3HNj+2/d/5Z/8ziPv+b2dn3no5Pjj/BrlLIjAuADOgo/UXNx55xM3fd+vfOndH99191NRP86SeJyOyH0iT5GvIVoRhUxawKbNCQlyV/RchgihIVhIOjxda2PLEeg15ZyDNM3eRxlReCwSOfoUC/13/Uo4My0dZl/kN58LMdUTz2zSkV3OqswBaVojBjx9Q9SjUQi8VJVUqTtfM23ZhDHT1npzEcEfusmYOLH/iP9A5z//va+863e2ffTeY9vHH+whNOM5ayIwLoCz5lPhaC7l9lsfvf1dv/n5v/m+p37nnhOH/LdG+Yk4yHEpEhL5jYafZEMWncScrcizinCOA7bC/JRJBuDLiIJbwXxycSKXqFbgGKkOMi31IhI2n1I3WlpNcyFMNsuok+oyPh4yI7SM8sRSCpvNggcVP1BUp1sQfCipGgWfaIiCmrWkFvjupApBaz498ZoDAh8tNbLKJrKKLxdWJEbxSvyr3T23PfHYT/3+A//oo1v+/Z2HH9+ltVqGXyMCzxOBcQE8T3DWrurQ03se+NnP/f5f+3f3/fSnDz6+c8p6OEw2S+fBSmyksiBnZUMKqoy3wGeIgkyXqZ5hWy52bd3CWxnQ/cZvNX0PbRbo2L4b1bxyabNrxocSngtdiA6tMjrf/3zQtK0uZfMN0VopGOU3JUYpAfBt4pfpSZ2iuOM3IcKWiupKLklV/hcnm7bXzISWBxg5lw4+sO3J937x/n/wkaf+3a0H7tvKlYxyPCMCZ2kExgVwln44u33y8PGnP3XfF/7uB27/wd/YetNDeXKJPChyItmqkpmcszKc3SQQZz9n9qiOSttqOFYWgoydCDR+kN3U22TqsM0Eq+w/++kewLIbZTCLKUbCaZkOjQxngjAbnQS2lMV3BwStZ5EV8lxUvQPeJTfwWZG14NGQ4sudqjBHTGQZjiggxTEFmUkyA0Tm4K6Q05YlwTm++9Cuzz/y+M/cdO/f+c1Hf+Jze255fOnY+IP8GuVVEIFxAbwKPqL23L/ly//3J2/86+997IO3Hd19kKTl9KUQWZiUWx2R0FCITEeKc4eVO+vlcyCoslPUOCA8TW41XZ6Y7Oc0IKbs6X/OIH3mogU6zO5xE7/NXoisdWWbi0jaTBohV0dpjRhwpyFylk8mYwJrU5TyoTiMpN+o3UOm0gLfA/w2TubBh7dv/fA9D/7TT9z/Ax/d/Cu377v76ZH3NcqrKwLjAnj1fM9jew49+u+/eONf+8Vb/s4HHvnVW/c9vI21kZZJaAg8lXP7z8stH4KEsyFKHme/htDhQW41HAQeEGRq5PYggyAH+ZfJsJtZSLMmOf0ih1yYHS1ShvkIpGtFIBSnVVgAcH6GL2FB8G2aTqbgO7OrkPLfBpSyzZT5VKXtSPvdUSHmlzVVKXOp4ktHt+7f8dmHHv+5m+/9Pz788P/16W2/c/+Rp/dqlBGBV2kExgXwKvywB5/c9fiHbr/tH37oxr/6iw/+3O/vvPPJ+qtkct50vnPOFZlRGZUN1QtZlEyI1jVY0wb5lFH0hQUycteqSmCntGTkKGutLiV8rDWxjcqJ74wctrycE+Ro+NZK7vj10ELMzzaqaYtitd/qNL5rSUWtCn1h1SlJLngecXTb/l03PvL4z99879//8APv+vjTv3rH3jueOln/gt2c8Y4InJ0ReDFejwvgxUTpbOUc23v46U/ee9ePfezG//EX7nnPb2/59IPH9x0RyZA0mxmVu0mJbXn8LC+FpEJMAgnndFGQWw2CwNMR5SKCXDipGgrZH60FeS5R2j3B/JbTcxW/Adwukl1ImoZbmiMKDNtz+NakK9Epijt+4YgWOBkAZ651h7tER5/Zt/PGh5/4xVvv/Qcfvv+HP/bU+27bc9uTJwgOxsYzInDORGBcAOfEpz559MSO2x5/4Kc/8/n/5b13/uMPP/lbXzr8zN6eYbNHIJzr3SFJyvma3E1GNiKRSLvcRkkzpOOk3JkFUq9Iukk1aYU17gOpLKtKkKkTqVNRW5qQpn02IiwoVeqZlntFtpYzpPnQvE06S3nw0R3bP/nAoz/1+/f83V+//10ff+qXb9v9hceO7zmsUUYEztUIjAvgHPvymXsfeOaR991y69/+wE1/7b13/9jHHn3fLVtvfOjgU7uXTi5FkD8dEPJmTPeB+yTQTBDkIP8mGZV03ZAma8q/IZfK+2RkZVhhiEERCPCtsJRo3co2qZQqJM2hgg8iCp3i2IA5M/tYt3NqWnwWY5Unl44+s3/P7U9t/di9j/3sTff/k4/f9bc++JV3f+rpD31p712bz4m/pqtRRgReOALjAnjhGL1aGcf3H9l99+YnP3LXAz/56dv+jw/+/vf83O3/6Ncf/OnPbv74Pfvuf+b4gSOLCw9n2MqtyiDPZq8bJ0jpVqrna+XE5/ctSZJOqolDwgZRMrRjr9OEAAAK3ElEQVS01QnQGVKdyaY7RcFmDcITlZwF829utx/Y9+UtOz/30OZfu/PRn/n8/T/623f+r7967w9/9NGfuXHLh+/ec9sTR57emyeWmG88IwIjAosRGBfAYjTOdfnAozu2fu4rj/zSF+760Y/e/Nd+6da/+f57fvy3H/r5G5/8zS/xTwn7Hth6ZLv/UwcL/3xAdnbQCrEgsnOKwk0QgdadKfs7a6Pige/k7Tzer4XiW6NmwXDjYyGwAP/YnkMHHtq+86ZHtvzWPY/9ws0PvudTd/+937j9r77vyz/wWw/9y08/8ctf3Po79+25/cnDT+7WKCMCIwIvIgLjAngRQTr7KKfH46O7Du65Z/Mzv/fA4//+tq/89Gfv/tGP3va3P3Dj9/z8F//mr971ro88+JOfefz9tz7zqft33fHk/oe2H3h85+Fn9h3ddeDkwaMn/fekyNrkbnvCReAMTmZXIUkyjxMHjx7befDgU7v3P7h1z12bd93y2Nbfe3DLx+996tfueOJ9tz7ys59/6Cc+c/8/+8S97/rY3X//N770fR/84v/0y3f977/+wLs/8dj/e/PTH757502PHvjKtmO7D3mC8Y4IjAi8rAiMC+Blhe3cHsRP4vsf2rbjC49u/tg9j/zizff/35+650c+etcPfvjOv/eh27//39/6v/3KLf/zL938V37hlr/6y1/83vff8Xc+eOff//V7fvi37v2nH//yj378S3/v12/73vd/4X/4xdu+91fv/N8/dM8P/dZ97/7Eg//P7z38Mzc+/ku3PPXBO7Z87Mvbfu/BnTc/uudLm/c/uO3Qk7uP7jjAbXFuh3ysfkTgjERgXABnJKzDKBFYOnbixIGjR3cePPLMvoNP7Nr/0LYDD28/sm3/ifFH7InOeEYEzlAEXorZcQG8lGgN7ojAiMCIwKsoAuMCeBV9zLGUEYERgRGBlxKBcQG8lGgN7ojAWo/A8G9E4CVEYFwALyFYgzoiMCIwIvBqisC4AF5NX3OsZURgRGBE4CVEYFwALyFYa586PBwRGBEYEXjxERgXwIuP1WCOCIwIjAi8qiIwLoBX1eccixkRGBE4VyPwctY9LoCXE7UxZkRgRGBE4FUQgXEBvAo+4ljCiMCIwIjAy4nAuABeTtTGmBGBtRaB4c+IwMuIwLgAXkbQxpARgRGBEYFXQwTGBfBq+IpjDSMCIwIjAi8jAuMCeBlBW3tDhkcjAiMCIwIvPQLjAnjpMRsjRgRGBEYEXhURGBfAq+IzjkWMCIwInKsReCXrHhfAK4neGDsiMCIwInAWR2BcAGfxxxuujwiMCIwIvJIIjAvglURvjB0RWO0IjPlHBF5BBMYF8AqCN4aOCIwIjAiczREYF8DZ/PWG7yMCIwIjAq8gAuMCeAXBW/2hw4MRgRGBEYGXH4FxAbz82I2RIwIjAiMCZ3UExgVwVn++4fyIwIjAuRqB07HucQGcjigOGyMCIwIjAmdhBMYFcBZ+tOHyiMCIwIjA6YjAuABORxSHjRGBlY7AmG9E4DREYFwApyGIw8SIwIjAiMDZGIFxAZyNX234PCIwIjAicBoiMC6A0xDElTcxZhwRGBEYEXjlERgXwCuP4bAwIjAiMCJwVkZgXABn5WcbTo8IjAicqxE4neseF8DpjOawNSIwIjAicBZFYFwAZ9HHGq6OCIwIjAiczgiMC+B0RnPYGhE40xEY9kcETmMExgVwGoM5TI0IjAiMCJxNERgXwNn0tYavIwIjAiMCpzEC4wI4jcE886bGDCMCIwIjAqcvAuMCOH2xHJZGBEYERgTOqgiMC+Cs+lzD2RGBEYFzNQJnYt3jAjgTUR02RwRGBEYEzoIIjAvgLPhIw8URgRGBEYEzEYFxAZyJqA6bIwKnOwLD3ojAGYjAuADOQFCHyRGBEYERgbMhAuMCOBu+0vBxRGBEYETgDERgXABnIKin3+SwOCIwIjAicPojMC6A0x/TYXFEYERgROCsiMC4AM6KzzScHBEYEThXI3Am1z0ugDMZ3WF7RGBEYERgDUdgXABr+OMM10YERgRGBM5kBMYFcCajO2yPCLzSCIzxIwJnMALjAjiDwR2mRwRGBEYE1nIExgWwlr/O8G1EYERgROAMRmBcAGcwuK/c9LAwIjAiMCJw5iIwLoAzF9theURgRGBEYE1HYFwAa/rzDOdGBEYEztUIrMS6xwWwElEec4wIjAiMCKzBCIwLYA1+lOHSiMCIwIjASkRgXAArEeUxx4jAS43A4I8IrEAExgWwAkEeU4wIjAiMCKzFCIwLYC1+leHTiMCIwIjACkRgXAArEOSXPsUYMSIwIjAicOYjMC6AMx/jMcOIwIjAiMCajMC4ANbkZxlOjQiMCJyrEVjJdY8LYCWjPeYaERgRGBFYQxEYF8Aa+hjDlRGBEYERgZWMwLgAVjLaY64RgReKwNCPCKxgBMYFsILBHlONCIwIjAispQiMC2AtfY3hy4jAiMCIwApGYFwAKxjsF55qMEYERgRGBFYuAuMCWLlYj5lGBEYERgTWVATGBbCmPsdwZkRgROBcjcBqrHtcAKsR9THniMCIwIjAGojAuADWwEcYLowIjAiMCKxGBMYFsBpRH3OOCJwagdEfEViFCIwLYBWCPqYcERgRGBFYCxEYF8Ba+ArDhxGBEYERgVWIwLgAViHoz55yICMCIwIjAisfgXEBrHzMx4wjAiMCIwJrIgLjAlgTn2E4MSIwInCuRmA11z0ugNWM/ph7RGBEYERgFSMwLoBVDP6YekRgRGBEYDUjMC6A1Yz+mHtEYERgRGAVIzAugFUM/ph6RGBEYERgNSMwLoDVjP6Ye0RgRGBEYBUjMC6AVQy+NCYfERgRGBFYvQiMC2D1Yj9mHhEYERgRWNUIjAtgVcM/Jh8RGBE4VyOwFtY9LoC18BWGDyMCIwIjAqsQgXEBrELQx5QjAiMCIwJrIQLjAlgLX2H4cO5FYKx4RGANRGBcAGvgIwwXRgRGBEYEViMC4wJYjaiPOUcERgRGBNZABMYFsCofYUw6IjAiMCKw+hEYF8Dqf4PhwYjAiMCIwKpEYFwAqxL2MemIwIjAuRqBtbTucQGspa8xfBkRGBEYEVjBCIwLYAWDPaYaERgRGBFYSxEYF8Ba+hrDl1d/BMYKRwTWUATGBbCGPsZwZURgRGBEYCUjMC6AlYz2mGtEYERgRGANRWBcACv6McZkIwIjAiMCaycC4wJYO99ieDIiMCIwIrCiERgXwIqGe0w2IjAicK5GYC2ue1wAa/GrDJ9GBEYERgRWIALjAliBII8pRgRGBEYE1mIExgWwFr/K8OnVF4GxohGBNRiBcQGswY8yXBoRGBEYEViJCIwLYCWiPOYYERgRGBFYgxEYF8CKfJQxyYjAiMCIwNqLwLgA1t43GR6NCIwIjAisSATGBbAiYR6TjAiMCJyrEVjL6x4XwFr+OsO3EYERgRGBMxiBcQGcweAO0yMCIwIjAms5AuMCWMtfZ/h29kdgrGBEYA1HYFwAa/jjDNdGBEYERgTOZATGBXAmoztsjwiMCIwIrOEIjAvgjH6cYXxEYERgRGDtRmBcAGv32wzPRgRGBEYEzmgExgVwRsM7jI8IjAicqxE4G9Y9LoCz4SsNH0cERgRGBM5ABMYFcAaCOkyOCIwIjAicDREYF8DZ8JWGj2dfBIbHIwJnQQTGBXAWfKTh4ojAiMCIwJmIwP8HAAD//55lHIMAAAAGSURBVAMAqSmDUb1f6mQAAAAASUVORK5CYII=", "apple-touch-icon": "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", "og-image": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAJ2BLADASIAAhEBAxEB/8QAHQABAQABBQEBAAAAAAAAAAAAAAEHAgMFBggECf/EAF0QAAEDAwEEAwcLEAYJAwQDAAABAgMEBREGBxIhMRNBUQgUImFxgZEVMjNyc4KSobGy0RYXGDU2QlJTVVZjdKKzwdIjN2J1k6QkJkNmlJXh4/A0wtNEVIPxJaXD/8QAGgEBAQADAQEAAAAAAAAAAAAAAAECAwQFBv/EADcRAQACAgECAwQIBgICAwAAAAABAgMRBBIxBSFBEzJRcRQVImGBobHRMzRSkcHwI+FCcmOS8f/aAAwDAQACEQMRAD8A8+AA1uEKQpUAABQAQUAAUEKECkKAAAAAAUAAUABFBCgAABQQoAABAAAACBQAAACAAABAAFQAAAAAIUgAAgAABUAAEABQIUgUABAIUgUAIUAABAABAAAAAAhSBQhSAAABAABAAFAABAAAIUgAAFVAAFAAUQAACFIAIUgUIUgAAAQAAAAAIUgAhSBQhSAAABAAAABVQABQhSACFIAAAAABUAAAhSACFIAIUgUAAAhSAAAAAAAAAAABzgANbkCkBRQAEUEKQCkKAKQAUpAEUAAAAAKQAUpAEUAAUEAFAAApABSAAAAABAAAAAgAAgAUAAAAACAACFIFCFIAAIAABRAAFAAQCFIVQhSAACAACAAAAAAAhSBQhSAACAAABAAVQAEEAAAhSBQhSFAABQAFEAAAhSACFIFCFIAAAEAAAAACFIAIUgUIUgAAAQAAAAVUAAUIUgAhSAAAAAAVAABAAAIAAIUgUAAAhSAAAAAAAAAAABzgANblAAEUEKVApABQAQUEKBQQoApAEUAAAAAKQAUEKBQQBFBABQQoAAgFBABQQAACBVIAAAAAAACAAACBQAgAAACAFAAgAABQAEVAAUCAACFIAIUgAAAAAFQAACAACFIAAIFAAUACEAAACABQhSFUABQAAEAAEAAUIUgAhSACFIAAAAAAQAACFIFCFIAAAEAAAAFVAAFCAACFIAAAAABUAAEAAEAAAhSBQAACFIAAAAAAAAAAAHNlIDByqACIAAooIUIFIAKACCghQBSAClIAighQAAAAAAAAKCACggAoIAKCAAAAAAAAAAAQCkAAAgCgBAAAAEAKABAAACgAIBACqAEAAEAAACAAAAAABAoAQAAAIAABCkCgAAEKQAAAIAAqAAqgAKBCkAAACAAKgAAgAAEKQAAAAAAgACoAAIAABCkAAAKEKQoAAKgAAgAAAAAAQKAACAACAAKgAAAACAAAAAAAAAAAAAObBCmDlCkAFABEAAUUEKEAABQQpAKQAUEKBQQAUEKEUEAFBABQQoAAAAAAAIBQQAUEAAAAAQBQAgFIAAAIBSAFAAgAABQAEAgBVACAAAAIAAIAAAAAABUAAAgAAhSAACBQAFAAEEAAAhSBQAhQAAUABQIAAIUgAhSBQAgAAAQAAAAAIUgAAgUAIAAAAgAAABQhSFUAIAAAEAAAABQhSACFIAAIAAAVAAAAAEAAAAAAAAAAAAAc0CFMHKoIAKUgAoIUiAAAFICighQgUgAoICClIAKCACghQBSACggAoIAKCACggApAAABAKCACkAAAgApACgAQCkACgAIAAAEAKoCAAAQCkAAEAAAAAAAoQAAQAAAQAAABAAoAABAAABAAAKoQAKAAoAEAAACAAKEAAEAAEKQAAAAAAEAAEAChCkAAACAAAACqgAChCkAEKQAAAAACoAABAABCkAEKQKAAAQpAAAAAAAAAAAAAADmQQpg5VBABSkAFBCgUEAFABEAAAKQFFBABQQoQKQAUEA0KCAgoIAKCACggAoIAKCAooIAKQAAAQCggCqQAAACAAAAICqAEApAAAIAABAKQAAAAAAChAAAIAABAAAAEACgAAEKQAAABAAoQAqgAKAAAgAAEAAEKQKAEAAACAAAAAABAABAoAAIAABCkAAAKEKQqgAAgAAEAAAAKAEAAACAACAAAQAKAAAQAAAAAAAAAAAAAAA5gAGDlUEAFKQAUEKAKQAUEKAKQAUEAFABEAAAAAAAFFBABQQAUEAFBABQQAUEAAAAAAAABAAAAAhVUgAAAgFIAAAIBSAAAQAAAAAAAAgUAAAgAAAgAAACABQAAACAAAAIAFACFAAFUAAAgAAAgAAgUAAAgAAgAAAAAABAAAIAFCFIAAAEAAAAFVAAFCFIAAIAAAAABQgAAhSACFIAAIFAAAAIAAAAAAAAAAAAAAAABzAIUwcwAAgAAKCACgACggAoIUCggAoIAKAAKCACggIKCAooICIoIAqggAoICiggAoIAKCACkAAAgAoIAABAKCAAAAAIAAAAAAAAAoQAAAQAAABAAABAqkAKAAIAIAAAAEACgBCgACqAAAQAAAQAAAqAAAQAAAQAAAAAAEAAEKQKAEAAAAQAAAAoQAqgBAAAAgAAAAKAEAAACAACAAAQAKAAAQAAAAAAAAAAAAAAAAADlwQpg5gpABQQoAABAAACkAFBABQQoFBABQQAUEAFAAApABQQAUEAFBABQQAUgAAAAAQAUEAFBAAAIBQQAUgAAAAAAAAIFUEAAAgFIAABAAAAAEAUABQAIQUgAAAgFIAFCAFUAAAAFAgAAAgAABQgAAgAAAgAAAAAAIUgAAgUAAEAAAAgAABQAhQAAUIAAIUgAAAAAFCAACAACFIAAIFAAAAIAAAAAAAAAAAAAAAAAAAHLAgMHMpSACggAoAAoIAKCFRMrhAACq1vr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gApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAAUgAoIAKCACggAoIAKCAGlBABQQAUEAFBABQQAUEAFBABQQAUEAFBABQQAUEAFBABSAAAAAAAAAAAAAAAAAgFBABQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUEAFBABQQAUEAFBABQQoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgFBABQQAUEAFBABQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//Z" };
const PWA_SCRIPT = `<script>(function(){try{if((window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone)return;if(!matchMedia("(max-width:820px)").matches)return;var bar=document.querySelector(".mbar");if(!bar||getComputedStyle(bar).display==="none")return;var last=bar.lastElementChild,ev=null,pill=null,tip=null;
function mk(t){bar.style.flexWrap="wrap";bar.style.rowGap="8px";var a=document.createElement("a");a.href="#";a.className="pill";a.textContent=t;bar.insertBefore(a,last);return a}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();ev=e;if(!pill){pill=mk("Install app");pill.addEventListener("click",function(x){x.preventDefault();if(ev){ev.prompt();ev=null;pill.remove()}})}});
window.addEventListener("appinstalled",function(){if(pill)pill.remove()});
var ua=navigator.userAgent||"";if(/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1)){var p=mk("Add to Home Screen");p.addEventListener("click",function(x){x.preventDefault();if(tip){tip.remove();tip=null;return}tip=document.createElement("div");tip.style.cssText="margin:8px 0;padding:10px 12px;border-radius:12px;background:rgba(127,140,134,.18);font:14px/1.4 Arial,Helvetica,sans-serif";tip.textContent="Tap the Share button in Safari, then choose Add to Home Screen.";bar.parentNode.insertBefore(tip,bar.nextSibling)})}}catch(e){}})();</script>`;

// One crest rule for every screen: show the club crest when the RFU has one, otherwise a circle with the
// club's initials. Initials skip words like FC/RFC/The and squad labels (1XV, 2nd), then use the first letter of
// the first and last remaining word ("Richmond FC Women" = RW) or the first two letters of a single word
// ("Ivybridge RFC" = IV). initialsOf is also sent to the browser (INITIALS_FN), so keep it self-contained.
function initialsOf(name) {
  var SKIP = /^(the|and|of|fc|rfc|rufc|afc|rc|ufc|rfu|rugby|football|club|union|\d+(st|nd|rd|th)?|\d*xv)$/i;
  var w = String(name || "").replace(/&/g, " ").split(/[\s\-_\/]+/).map(function (x) { return x.replace(/[^A-Za-z0-9]/g, ""); }).filter(Boolean);
  var k = w.filter(function (x) { return !SKIP.test(x); });
  if (!k.length) k = w;
  k = k.map(function (x) { return x.replace(/[^A-Za-z]/g, ""); }).filter(Boolean);
  if (!k.length) return "?";
  if (k.length === 1) return k[0].slice(0, 2).toUpperCase();
  return (k[0].charAt(0) + k[k.length - 1].charAt(0)).toUpperCase();
}
const INITIALS_FN = initialsOf.toString();
// Same circle as an image, for places that only take a picture (league table rows).
function badgeUri(name) {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='#fff' stroke='#cbd8ce' stroke-width='2'/><text x='50' y='50' text-anchor='middle' dominant-baseline='central' font-family='Arial,Helvetica,sans-serif' font-weight='700' font-size='46' fill='#33443a'>" + initialsOf(name) + "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
// League context helpers (pure functions; table rows are {id,name,p,w,d,l,pf,pa,pd,tb,lb,bp,pts}, best first).
const ordinalOf = n => { const v = n % 100; return n + (["th", "st", "nd", "rd"][(v - 20) % 10] || ["th", "st", "nd", "rd"][v] || "th"); };
function gapInfo(table, sel) {
  const i = sel && Array.isArray(table) ? table.indexOf(sel) : -1;
  if (i < 0) return null;
  const parts = [];
  if (i === 0) parts.push({ k: "lead", t: "Top of the table" });
  if (i > 0) { const d = table[i - 1].pts - sel.pts; parts.push(d > 0 ? { k: "chase", t: d + " behind " + ordinalOf(i) } : { k: "level", t: "level with " + ordinalOf(i) }); }
  if (i < table.length - 1) { const d = sel.pts - table[i + 1].pts; parts.push(d > 0 ? { k: "lead", t: (i === 0 ? d + " clear of " : d + " ahead of ") + ordinalOf(i + 2) } : { k: "level", t: "level with " + ordinalOf(i + 2) }); }
  if (!parts.length) return null;
  const esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return { parts, text: parts.map(x => x.t).join(" · "), html: parts.map(x => `<i class="gp gp-${x.k}">${esc(x.t)}</i>`).join(" &middot; ") };
}
// Walkovers: the RFU data marks them with a time of "HWO" (home side awarded the win) or "AWO" (away side awarded the win)
// and no scores. They count as played, but no score is ever made up for them.
function walkoverInfo(m) {
  const t = String(m && m.time || "").trim().toUpperCase();
  if (t !== "HWO" && t !== "AWO") return null;
  const empty = x => x === null || x === undefined || x === "";
  if (!empty(m.homeTeam && m.homeTeam.score) || !empty(m.awayTeam && m.awayTeam.score)) return null;
  return { homeWins: t === "HWO" };
}
function gdBlockHtml(gd) {
  const esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const df = gd.df, on = esc(gd.opp.name); let why;
  if (df.status !== "ok") why = `${on} has played ${df.games} game${df.games === 1 ? "" : "s"}. The rating needs at least 3.`;
  else { const v = gd.venue || {}; why = `${on}: ${gd.opp.position ? ordinalOf(gd.opp.position) + ", " : ""}won ${df.wins} of last 3${v.n ? `, ${v.oppHome ? "at home" : "away from home"}: ${v.record.w} win${v.record.w === 1 ? "" : "s"} from ${v.n}` : ""}.`; }
  return `<div class="fdiff mobonly${df.status === "ok" ? " fd-" + df.level : ""}"><div class="fdt"><span>This game</span><b>${df.status === "ok" ? df.label : "Too early to say"}</b></div><div class="fdbar"><i></i><i></i><i></i></div>${df.status === "ok" ? `<div class="fdl"><span>Easy</span><span>Medium</span><span>Hard</span></div>` : ""}<div class="fdn">${why}</div></div>`;
}
function runInInfo(table, oppIds) {
  const pos = (oppIds || []).map(id => table.findIndex(t => String(t.id) === String(id)) + 1).filter(x => x > 0).slice(0, 5);
  if (pos.length < 2) return null;
  const avg = Math.round(pos.reduce((a, b) => a + b, 0) / pos.length);
  const size = (table || []).length || 1;
  const level = avg <= size / 3 ? "hard" : avg <= (2 * size) / 3 ? "medium" : "easy";
  return { n: pos.length, avg, size, level, label: level === "hard" ? "Hard" : level === "medium" ? "Medium" : "Easy", text: "Upcoming fixture difficulty: " + level };
}
function highlightsInfo(games) { // games newest first: {mine, opp}
  const g = (games || []).filter(x => x.mine !== null && x.opp !== null);
  let run = "—";
  if (g.length) {
    const t = x => x.mine > x.opp ? "W" : x.mine < x.opp ? "L" : "D";
    const first = t(g[0]); let n = 0; for (const x of g) { if (t(x) === first) n++; else break; }
    run = (first === "W" ? "Won " : first === "L" ? "Lost " : "Drew ") + n;
  }
  const best = (f) => { let b = null; for (const x of g) { const m = f(x); if (m > 0 && (!b || m > b.m)) b = { m, x }; } return b ? b.x.mine + "–" + b.x.opp : "—"; };
  return { run, biggestWin: best(x => x.mine - x.opp), worstDefeat: best(x => x.opp - x.mine) };
}
function leadersInfo(table, sel) {
  const rows = (table || []).filter(t => t.p > 0);
  if (!rows.length) return null;
  const defs = [
    { key: "attack", label: "Best attack", unit: "average points scored per game", phr: v => "averaging " + v + " points scored per game", v: t => t.pf / t.p, hi: true, fmt: x => x.toFixed(1) },
    { key: "defence", label: "Best defence", unit: "average points conceded per game", phr: v => "averaging " + v + " points conceded per game", v: t => t.pa / t.p, hi: false, fmt: x => x.toFixed(1) },
    { key: "diff", label: "Best points difference", unit: "total points difference, all games", phr: v => v.replace("-", "\u2212") + " points difference in total", v: t => t.pd, hi: true, fmt: x => (x > 0 ? "+" : "") + x },
    { key: "bonus", label: "Most bonus points", unit: "total try + losing bonus points", phr: v => v + (v === "1" ? " bonus point" : " bonus points") + " in total", v: t => t.bp, hi: true, fmt: x => String(x) }
  ];
  const metrics = defs.map(d => {
    const val = t => Math.round(d.v(t) * 100) / 100;
    const better = (a, b) => d.hi ? a > b : a < b;
    let best = val(rows[0]); for (const t of rows) if (better(val(t), best)) best = val(t);
    const lead = rows.filter(t => val(t) === best);
    const out = { key: d.key, label: d.label, unit: d.unit, value: d.fmt(best), leaderName: lead.length === 1 ? lead[0].name : lead.length + " clubs level", leaderId: lead.length === 1 ? lead[0].id : "", leaderNames: lead.length > 1 ? (lead.length > 8 ? lead.slice(0, 8).map(t => t.name).concat(["+" + (lead.length - 8) + " more"]) : lead.map(t => t.name)) : [] };
    const me = sel && rows.includes(sel) ? sel : null;
    if (me) { const mv = val(me); out.you = { rank: 1 + rows.filter(t => better(val(t), mv)).length, joint: rows.some(t => t !== me && val(t) === mv), value: d.fmt(d.v(me)), phrase: d.phr(d.fmt(d.v(me))) }; }
    return out;
  });
  return { metrics, early: rows.length < (table || []).length || rows.some(t => t.p < 3) };
}
// ---------- v29 helpers ----------
// Club name without a trailing team label: "Ivybridge Women" -> "Ivybridge", "Ivybridge 2nd XV" -> "Ivybridge".
function clubOf(name) {
  let n = String(name || "").trim(), t = n;
  for (let k = 0; k < 3; k++) {
    const u = t.replace(/\s+(women|ladies|girls|vandals|u\s*\d{1,2}'?s?|under\s*\d{1,2}'?s?|\d+\s*(st|nd|rd|th)?\s*xv|xv)$/i, "").replace(/\s+(I{1,3}|IV|V|VI)$/, "").trim();
    if (u === t || !u || /^the$/i.test(u)) break;
    t = u;
  }
  return t && !/^the$/i.test(t) ? t : n;
}
function plainClub(name) { return String(name || "").replace(/\s+(rfc|rugby club|rfu)$/i, "").trim(); }
// Game Difficulty: table position, recent form and venue record each score 0-2; 0-2 Easy, 3-4 Medium, 5-6 Hard.
function difficultyInfo(o) {
  if (!o || !o.pos || o.games < 3) return { status: "early", games: o ? o.games : 0 };
  const third = o.size / 3;
  const tPts = o.pos <= third ? 2 : o.pos <= 2 * third ? 1 : 0;
  const last = (o.lastOuts || []).slice(0, 3);
  const wins = last.filter(x => x === "W").length;
  const fPts = wins >= 2 ? 2 : wins === 1 ? 1 : 0;
  let vPts = 1;
  if (o.venueN > 0) { const rate = o.venueW / o.venueN; vPts = rate >= 0.6 ? 2 : rate >= 0.3 ? 1 : 0; }
  const total = tPts + fPts + vPts;
  const level = total <= 2 ? "easy" : total <= 4 ? "medium" : "hard";
  return { status: "ok", total, level, label: level === "hard" ? "Hard" : level === "medium" ? "Medium" : "Easy", chips: last.slice().reverse(), wins, parts: { table: tPts, form: fPts, venue: vPts } };
}
// Luck check: league table position against position by points difference per game.
function luckInfo(table, oppId, closeOuts, gamesN) {
  const rows = (table || []).filter(t => t.p > 0);
  const opp = rows.find(t => String(t.id) === String(oppId));
  if (!opp) return null;
  if (opp.p < 5) return { status: "early", name: opp.name, played: opp.p };
  const pg = t => t.pd / t.p;
  const pdRank = 1 + rows.filter(t => pg(t) > pg(opp) + 1e-9).length;
  const tableRank = table.indexOf(opp) + 1;
  const N = rows.length, gap = pdRank - tableRank, thr = Math.max(2, Math.round(N / 7));
  const verdict = gap >= thr ? "lucky" : -gap >= thr ? "unlucky" : "right";
  const outs = closeOuts || [];
  const cw = outs.filter(x => x === "W").length, cl = outs.filter(x => x === "L").length;
  return { status: "ok", verdict, label: verdict === "lucky" ? "Slightly lucky" : verdict === "unlucky" ? "Unlucky" : "About right", tableRank, pdRank, N, pdPerGame: Math.round(pg(opp) * 10) / 10, closeN: outs.length, gamesN, cw, cl, chips: outs.slice(-8) };
}
function weekKey(day) { const t = new Date(day + "T00:00:00Z"); const dow = (t.getUTCDay() + 6) % 7; return new Date(t.getTime() - dow * 864e5).toISOString().slice(0, 10); }
// "Around you this weekend": clubs within 3 places of the selected team and the results that help.
function aroundInfo(o) { // {table, myId, fixtures:[{d,hId,hName,aId,aName,played}], todayStr, day}
  const table = o.table || [];
  const idx = table.findIndex(t => String(t.id) === String(o.myId));
  if (idx < 0) return null;
  const wk = weekKey(o.todayStr);
  const near = new Map();
  for (let i = Math.max(0, idx - 3); i <= Math.min(table.length - 1, idx + 3); i++) near.set(String(table[i].id), i);
  const inWeek = (o.fixtures || []).filter(f => !f.played && f.d && weekKey(o.day(f.d)) === wk && o.day(f.d) >= o.todayStr);
  const mine = inWeek.find(f => String(f.hId) === String(o.myId) || String(f.aId) === String(o.myId));
  const rows = [];
  for (const f of inWeek) {
    if (f === mine) continue;
    const hn = near.has(String(f.hId)), an = near.has(String(f.aId));
    if (!hn && !an) continue;
    const pos = id => near.has(String(id)) ? near.get(String(id)) + 1 : (table.findIndex(t => String(t.id) === String(id)) + 1 || null);
    const key = Math.min(hn ? near.get(String(f.hId)) : 99, an ? near.get(String(f.aId)) : 99);
    const base = { hName: f.hName, aName: f.aName, hPos: pos(f.hId), aPos: pos(f.aId), key };
    if (hn && an) rows.push({ ...base, kind: "mixed", text: "Mixed: either result moves clubs around you" });
    else { const other = hn ? f.aName : f.hName; rows.push({ ...base, kind: "help", text: "A " + other + " win helps you" }); }
  }
  if (!rows.length) return null;
  rows.sort((a, b) => a.key - b.key);
  return { mine: mine ? { hName: mine.hName, aName: mine.aName, home: String(mine.hId) === String(o.myId) } : null, rest: !mine, rows };
}
function aroundHtml(a, esc, ordinal, myName) {
  if (!a) return "";
  const top = a.rest ? `<div class="arow arest"><span>${esc(myName)}</span><b>Rest weekend</b></div>` : a.mine ? `<div class="arow arest"><span>${esc(myName)}</span><b>${a.mine.home ? "v " + esc(a.mine.aName) : "at " + esc(a.mine.hName)}</b></div>` : "";
  const rows = a.rows.map(r => `<div class="arow ${r.kind}"><span>${esc(r.hName)}${r.hPos ? " (" + ordinal(r.hPos) + ")" : ""} v ${esc(r.aName)}${r.aPos ? " (" + ordinal(r.aPos) + ")" : ""}</span><b>${esc(r.text)}</b></div>`).join("");
  return top + rows;
}
const AROUND_CSS = ".arow{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid #1f2a26;font-size:14px;align-items:center}.arow:first-of-type{border-top:0}.arow span{color:#a9b8af;min-width:0}.arow b{text-align:right;flex:0 0 auto;max-width:48%}.arow.help b{color:#7fd89a}.arow.mixed b{color:#e0b44e}.arow.arest b{color:#9ccaf0}body.light .arow{border-top-color:#e0e7e1}body.light .arow span{color:#53665a}body.light .arow.help b{color:#1b7f3b}body.light .arow.mixed b{color:#8a5a00}body.light .arow.arest b{color:#1d5a85}";
function luckText(lk, name, ord) {
  const closeTxt = lk.closeN >= 3 && lk.verdict === "lucky" && lk.cw / lk.closeN >= 0.6 ? ` They have won ${lk.cw} of their ${lk.closeN} close games, which is hard to keep up.` : lk.closeN >= 3 && lk.verdict === "unlucky" && lk.cl / lk.closeN >= 0.6 ? ` They have lost ${lk.cl} of their ${lk.closeN} close games.` : "";
  return lk.verdict === "lucky" ? `${name} are ${ord(lk.tableRank)} in the table, but their points difference is only the ${ord(lk.pdRank)} best.${closeTxt}` : lk.verdict === "unlucky" ? `${name} are ${ord(lk.tableRank)} in the table, but ${ord(lk.pdRank)} by points difference.${closeTxt}` : `${name}'s table position and points difference tell the same story (${ord(lk.tableRank)} and ${ord(lk.pdRank)}).`;
}
const LUCK_CSS = ".lkp .lkv{font-size:18px;font-weight:900;margin:0 0 6px}.lkp .lk-lucky{color:#e0b44e}.lkp .lk-unlucky{color:#6fb6ea}.lkp .lk-right{color:#b4c4bb}.lkp p{font-size:13px;color:#b4c4bb;margin:0 0 8px;line-height:1.4}.lkp .lkt{display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center}.lkp .lkt div{background:#19221e;border-radius:10px;padding:9px 4px}.lkp .lkt b{display:block;font-size:18px}.lkp .lkt span{font-size:11px;color:#a9b8af;text-transform:uppercase;letter-spacing:.05em}body.light .lkp .lk-lucky{color:#8a5a00}body.light .lkp .lk-unlucky{color:#1d5a85}body.light .lkp p,body.light .lkp .lkt span{color:#53665a}body.light .lkp .lkt div{background:#edf2ee}";
const WX_DIRS = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
function wxHeadline(w) {
  const dir = WX_DIRS[Math.round(((w.dir % 360) + 360) % 360 / 45) % 8];
  const windy = w.wind > 20, wet = w.rain >= 50, showers = w.rain >= 20 && w.rain < 50;
  let headline, icon;
  if (wet && windy) { headline = "Wet and windy"; icon = "\u{1F327}"; }
  else if (wet) { headline = "Rain likely"; icon = "\u{1F327}"; }
  else if (showers) { headline = "Some showers possible"; icon = "\u{1F326}"; }
  else if (windy) { headline = "Strong wind, from the " + dir; icon = "\u{1F4A8}"; }
  else if (w.temp <= 3) { headline = "Cold, with a chance of frost"; icon = "❄"; }
  else if (w.temp >= 15) { headline = "Mild for the time of year"; icon = "⛅"; }
  else { headline = w.wind < 12 ? "Dry with light wind" : "Dry with moderate wind"; icon = w.cloudy ? "☁" : "☀"; }
  return { headline, icon, dirName: dir, windWord: w.wind < 12 ? "Light wind" : w.wind <= 20 ? "Moderate wind" : "Strong wind" };
}
// Forecast for the afternoon of the game (no kick-off time is shown). Open-Meteo and postcodes.io need no key.
// v3.16: the ground for a match, from the RFU data service (the same record the RFU website reads), with its map position.
// Returns { venue, postcode, geo } or null when the record has no ground, so callers can fall back to the website page.
// The RFU website match page (fallback for the ground when the RFU match record has none). Returns the venue text or "".
// Decode HTML entities repeatedly: RFU text can arrive double-encoded (e.g. "&amp;amp;").
const decodeHtmlEntities = input => {
  let str = String(input ?? "");
  for (let i = 0; i < 4; i++) {
    const next = str.replace(/&nbsp;|&#160;/gi, " ").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d))).replace(/&quot;/gi, '"').replace(/&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&");
    if (next === str) break;
    str = next;
  }
  return str;
};
async function websiteVenue(p, matchId, vt) {
  let venue = "";
  try {
          const matchUrl = new URL("https://www.englandrugby.com/fixtures-and-results/match-centre-community");
          matchUrl.searchParams.set("competition", p.competition);
          matchUrl.searchParams.set("division", p.division);
          matchUrl.searchParams.set("season", p.season);
          matchUrl.searchParams.set("team", p.teamId);
          matchUrl.searchParams.set("matchId", String(matchId));
          const matchPage = await cachedText(matchUrl.toString(), "text/html,application/xhtml+xml");
          const note = {step:"community-page", url: matchUrl.toString(), ok: matchPage.ok, status: matchPage.status, blockedByRfuChallenge: matchPage.blocked === true};
          if (vt) vt.push(note);
          if (matchPage.ok) {
            const html = matchPage.text;
            note.htmlBytes = html.length;
            const lab = html.search(/>\s*(Location|Venue|Ground)\s*</i);
            note.labelFound = lab >= 0;
            if (lab < 0 || html.length < 20000) note.head = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "<$1…>").replace(/\s+/g, " ").slice(0, 1800);
            note.snippet = lab >= 0 ? html.slice(Math.max(0, lab - 60), lab + 420).replace(/\s+/g, " ") : null;
            const locationBlock = html.match(/<p[^>]*class=["'][^"']*c036-club-details-information[^"']*match-information-label[^"']*["'][^>]*>\s*Location\s*<\/p>[\s\S]*?<p[^>]*class=["'][^"']*c036-club-details-information[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)
              || html.match(/<p[^>]*class=["'][^"']*match-information-label[^"']*["'][^>]*>\s*Location\s*<\/p>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
            if (locationBlock && locationBlock[1]) {
              venue = decodeHtmlEntities(locationBlock[1].replace(/<[^>]*>/g, " "))
                .replace(/\s+/g, " ").trim();
              note.matchedBy = "location block";
            }
            if (!venue) {
              // Fallback: any Location / Venue / Ground label followed by the next element's text.
              const loose = html.match(/>\s*(?:Location|Venue|Ground)\s*<\/[a-z0-9]+>\s*<[a-z0-9]+[^>]*>([\s\S]{1,300}?)<\/[a-z0-9]+>/i);
              if (loose && loose[1]) {
                const v = decodeHtmlEntities(loose[1].replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
                if (v && !/^(tbc|tba|to be confirmed)$/i.test(v)) { venue = v; note.matchedBy = "fallback label"; }
              }
            }
          }
  } catch (_) { /* Venue remains optional if the RFU match page is unavailable. */ }
  return venue;
}
const venueGeo = new Map(); // venue text -> { latitude, longitude }, so the forecast can skip the postcode and place lookups
const venuePc = new Map(); // venue text -> postcode from the RFU match record, so the directions link can use the real address
function rememberVenue(gv) {
  if (!gv || !gv.venue) return;
  if (venueGeo.size > 300) venueGeo.clear();
  if (venuePc.size > 300) venuePc.clear();
  if (gv.geo) venueGeo.set(gv.venue, gv.geo);
  if (gv.postcode) venuePc.set(gv.venue, gv.postcode);
}
async function gmsVenue(matchId) {
  try {
    if (!/^\d{1,10}$/.test(String(matchId))) return null;
    const r = await cachedText("https://cluster.england-rfu.com/gms/matches/" + matchId, "application/json");
    if (!r.ok) return null;
    const j = JSON.parse(r.text) || {};
    const clean = x => String(x == null ? "" : x).replace(/\s+/g, " ").trim();
    const parts = [];
    for (const x of [j.groundAddress1, j.groundAddress2, j.groundCity].map(clean)) if (x && !parts.some(q => q.toLowerCase() === x.toLowerCase())) parts.push(x);
    if (!parts.length) return null;
    const lat = Number(j.groundYCoordinate), lon = Number(j.groundXCoordinate);
    const geo = j.groundYCoordinate != null && j.groundXCoordinate != null && Number.isFinite(lat) && Number.isFinite(lon) && lat > 49 && lat < 61 && lon > -9 && lon < 2.5 ? { latitude: lat, longitude: lon } : null;
    return { venue: parts.join(", "), postcode: clean(j.groundPostalCode), geo };
  } catch (_) { return null; }
}
async function weatherFor(venue, fxDate, club, trace) {
  const tr = (step, ok, info) => { if (trace) trace.push({ step, ok, info }); };
  try {
    if (!String(venue || "").trim()) { tr("no venue", false, "skipped"); return null; } // no venue known: no guessing from the club name, no lookups
    const day = d => d.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
    const days = Math.round((new Date(day(fxDate) + "T00:00:00Z") - new Date(day(new Date()) + "T00:00:00Z")) / 864e5);
    if (days < 0) return null;
    if (days > 15) return { status: "later" };
    // Find the venue: postcode first, then a town or club name (RFU venue text is often just "Hartley Park, Plymouth").
    let loc = venueGeo.get(String(venue || "").trim()) || null; // map position from the RFU match record: no lookups needed
    if (loc) tr("coordinates", true, "from the RFU match record");
    const pc = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/i.exec(String(venue || ""));
    if (pc && !loc) {
      const pr = await cachedText("https://api.postcodes.io/postcodes/" + encodeURIComponent(pc[1] + pc[2]), "application/json");
      try { const j = pr.ok ? (JSON.parse(pr.text) || {}).result : null; if (j && typeof j.latitude === "number" && typeof j.longitude === "number") loc = { latitude: j.latitude, longitude: j.longitude }; } catch (_) { /* fall through */ }
      tr("postcode", !!loc, pc[1] + " " + pc[2]);
    }
    if (!loc) {
      const parts = String(venue || "").split(/[,;|]/).map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean).reverse().filter(x => x.split(" ").length <= 3 && !/\b(park|ground|grounds|rfc|club|road|lane|street|pavilion|playing|fields?|stadium|centre|center|sports?)\b/i.test(x) && !/\d/.test(x));
      const cands = [...new Set([...parts, plainClub(club)].filter(Boolean))];
      for (const name of cands) {
        const gu = new URL("https://geocoding-api.open-meteo.com/v1/search");
        gu.searchParams.set("name", name); gu.searchParams.set("count", "5"); gu.searchParams.set("language", "en"); gu.searchParams.set("format", "json");
        const gr = await cachedText(gu, "application/json");
        let hit = null;
        try { const res = gr.ok ? (JSON.parse(gr.text) || {}).results : null; hit = Array.isArray(res) ? res.find(x => x.country_code === "GB" && typeof x.latitude === "number") : null; } catch (_) { hit = null; }
        tr("place", !!hit, name);
        if (hit) { loc = { latitude: hit.latitude, longitude: hit.longitude }; break; }
      }
    }
    if (!loc) return null;
    const ds = day(fxDate);
    const u = new URL("https://api.open-meteo.com/v1/forecast");
    u.searchParams.set("latitude", loc.latitude.toFixed(3)); u.searchParams.set("longitude", loc.longitude.toFixed(3));
    u.searchParams.set("hourly", "temperature_2m,precipitation_probability,wind_speed_10m,wind_direction_10m,cloud_cover");
    u.searchParams.set("wind_speed_unit", "mph"); u.searchParams.set("timezone", "Europe/London"); u.searchParams.set("start_date", ds); u.searchParams.set("end_date", ds);
    const fr = await cachedText(u, "application/json");
    tr("forecast", fr.ok, fr.status);
    if (!fr.ok) return null;
    const h = (JSON.parse(fr.text) || {}).hourly;
    if (!h || !Array.isArray(h.time)) return null;
    const ix = h.time.map((t, i) => [t, i]).filter(([t]) => /T1[3-6]:00$/.test(t)).map(x => x[1]);
    const pick = k => ix.map(i => h[k][i]).filter(v => typeof v === "number");
    const T = pick("temperature_2m"), R = pick("precipitation_probability"), W = pick("wind_speed_10m"), D = pick("wind_direction_10m"), C = pick("cloud_cover");
    if (!T.length || !W.length) return null;
    const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
    const sx = mean(D.map(v => Math.sin(v * Math.PI / 180))), cx = mean(D.map(v => Math.cos(v * Math.PI / 180)));
    const w = { temp: Math.round(mean(T)), rain: R.length ? Math.max(...R) : 0, wind: Math.round(mean(W)), dir: D.length ? (Math.atan2(sx, cx) * 180 / Math.PI + 360) % 360 : 0, cloudy: C.length ? mean(C) > 60 : false };
    return { status: "ok", ...w, ...wxHeadline(w), updated: new Date(fr.fetchedAt || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/London" }) };
  } catch (x) { tr("error", false, String(x && x.message || x)); return null; }
}
function wxCardHtml(w, esc) {
  if (!w) return "";
  const mk = h => h + "<style>@media (min-width:900px){.big{width:7rem;height:7rem;margin-bottom:.4rem}.big .ini{font-size:2.2rem}}</style>"; // the card needs room on wide screens: slightly smaller crests
  if (w.status === "later") return mk(`<div class="mwx later"><span class="wi">&#128337;</span><div><b>Weather not available yet</b><small>Forecasts show about two weeks before the game.</small></div></div>`);
  if (w.status !== "ok") return "";
  return mk(`<div class="mwx"><span class="wi">${w.icon}</span><div><b>${esc(w.headline)}</b><span class="ws"><i>${w.temp}&deg;C</i><i>Rain ${w.rain}%</i><i>Wind ${w.wind} mph ${esc(w.dirName)}</i></span></div></div>`);
}
const MWX_CSS = ".mwx{display:flex;align-items:center;justify-content:center;gap:.7rem;margin:.25rem auto 0;padding:.1rem .9rem;border:1px solid var(--bd);background:var(--card);border-radius:.7rem;width:fit-content;max-width:90%}.mwx .wi{font-size:1.5rem;line-height:1}.mwx>div{display:flex;align-items:baseline;gap:.9rem;flex-wrap:wrap;justify-content:center}.mwx b{font-size:1.2rem}.mwx .ws{display:flex;gap:.8rem;flex-wrap:wrap;color:var(--mu);font-size:1.05rem}.mwx .ws i{font-style:normal}.mwx small{color:var(--mu);font-size:1rem}.mwx.later b{font-weight:400;color:var(--mu)}";
const MWX_CSS_PHONE = ".mwx{margin-top:.5rem;padding:.45rem .8rem;gap:.7rem;width:auto;max-width:100%}.mwx .wi{font-size:1.9rem}.mwx>div{display:block}.mwx b{display:block;font-size:1rem}.mwx .ws{font-size:.85rem;gap:.7rem;margin-top:.15rem}.mwx small{display:block;font-size:.8rem}";
function mapsLink(venue, clubName, elite) {
  const base = "https://www.google.com/maps/dir/?api=1&destination=";
  if (elite && venue) return { kind: "directions", query: venue, href: base + encodeURIComponent(venue) }; // elite sides: official stadium name
  const rpc = venue && venuePc.get(String(venue).trim()); // ground and postcode from the RFU match record: the exact place
  if (rpc) { const q = venue + ", " + rpc; return { kind: "directions", query: q, href: base + encodeURIComponent(q) }; }
  const c = plainClub(clubOf(clubName));
  const pc = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/i.exec(String(venue || ""));
  if (c) { const q = c + " Rugby Club" + (pc ? " " + pc[1].toUpperCase() + " " + pc[2].toUpperCase() : ""); return { kind: "directions", query: q, href: base + encodeURIComponent(q) }; }
  if (venue) return { kind: "directions", query: venue, href: base + encodeURIComponent(venue) };
  return null;
}
// League position week by week, rebuilt from results. Order: points, points difference, points scored, name.
// Try bonuses are estimated: each club's table total goes to its highest-scoring games (20+ points).
function positionHistory(table, results, ids, dayOf) { // results: [{d,hId,aId,hs,as}]
  const clubs = (table || []).map(t => ({ id: String(t.id), name: t.name, tb: t.tb || 0 }));
  if (clubs.length < 3 || !results.length) return null;
  const games = results.slice().sort((a, b) => a.d - b.d);
  const scored = {};
  games.forEach((g, i) => { for (const [id, f] of [[String(g.hId), g.hs], [String(g.aId), g.as]]) (scored[id] = scored[id] || []).push({ i, f }); });
  const tbGames = new Set();
  for (const c of clubs) for (const x of (scored[c.id] || []).filter(x => x.f >= 20).sort((a, b) => b.f - a.f).slice(0, c.tb)) tbGames.add(c.id + "#" + x.i);
  const S = {}; for (const c of clubs) S[c.id] = { name: c.name, pts: 0, pd: 0, pf: 0 };
  const order = () => Object.entries(S).sort((a, b) => b[1].pts - a[1].pts || b[1].pd - a[1].pd || b[1].pf - a[1].pf || a[1].name.localeCompare(b[1].name)).map(x => x[0]);
  const posIn = (ord, id) => ord.indexOf(String(id)) + 1;
  const alpha = Object.entries(S).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(x => x[0]);
  const out = { labels: ["Start"], series: ids.map(id => [posIn(alpha, id)]), N: clubs.length };
  let curWk = null, lastDay = "";
  const flush = () => { const ord = order(); ids.forEach((id, k) => out.series[k].push(posIn(ord, id))); out.labels.push(new Date(lastDay + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })); };
  games.forEach((g, i) => {
    const dd = dayOf(g.d), wk = weekKey(dd);
    if (curWk !== null && wk !== curWk) flush();
    curWk = wk; lastDay = dd;
    const h = S[String(g.hId)], a = S[String(g.aId)];
    if (!h || !a) return;
    h.pf += g.hs; a.pf += g.as; h.pd += g.hs - g.as; a.pd += g.as - g.hs;
    h.pts += g.hs > g.as ? 4 : g.hs === g.as ? 2 : (g.as - g.hs <= 7 ? 1 : 0);
    a.pts += g.as > g.hs ? 4 : g.hs === g.as ? 2 : (g.hs - g.as <= 7 ? 1 : 0);
    if (tbGames.has(String(g.hId) + "#" + i)) h.pts += 1;
    if (tbGames.has(String(g.aId) + "#" + i)) a.pts += 1;
  });
  if (curWk !== null) flush();
  const actual = ids.map(id => (table || []).findIndex(t => String(t.id) === String(id)) + 1);
  out.exact = ids.every((id, k) => out.series[k][out.series[k].length - 1] === actual[k]);
  ids.forEach((id, k) => { if (actual[k] > 0) out.series[k][out.series[k].length - 1] = actual[k]; });
  return out;
}
const OPP_COLOUR_SCRIPT = String.raw`<script>(function(){var root=document.documentElement;var C=__CFG__;
function lum(c){return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255}
function fix(c){if(lum(c)<0.14){c=c.map(function(v){return v+(255-v)*0.38})}return c}
function dk(c){return lum(c)>0.4?c.map(function(v){return v*0.62}):c}
function hx(c){return "#"+c.map(function(v){return ("0"+Math.round(v).toString(16)).slice(-2)}).join("")}
function rgb(h){return [1,3,5].map(function(k){return parseInt(h.slice(k,k+2),16)})}
function dist(a,b){return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))}
function pal(img){var S=48,cv=document.createElement("canvas");cv.width=S;cv.height=S;var x=cv.getContext("2d");x.drawImage(img,0,0,S,S);var d;try{d=x.getImageData(0,0,S,S).data}catch(e){return []}
var B=[],i;for(i=0;i<24;i++)B.push({w:0,r:0,g:0,b:0});
for(i=0;i<d.length;i+=4){if(d[i+3]<160)continue;var r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mx===mn)continue;var l=(mx+mn)/510,s=(mx-mn)/(255-Math.abs(mx+mn-255));if(s<0.28||l>0.9||l<0.08)continue;var dl=mx-mn,h;if(mx===r)h=((g-b)/dl+6)%6;else if(mx===g)h=(b-r)/dl+2;else h=(r-g)/dl+4;var k=Math.floor(h/6*24)%24,w=s*(1-Math.abs(2*l-1)+0.2);B[k].w+=w;B[k].r+=r*w;B[k].g+=g*w;B[k].b+=b*w}
return B.filter(function(z){return z.w>0}).sort(function(p,q){return q.w-p.w}).map(function(z){return [z.r/z.w,z.g/z.w,z.b/z.w]})}
function load(id){return new Promise(function(res){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src="/api/crest?id="+encodeURIComponent(id)})}
function set(n,c){root.style.setProperty("--"+n,hx(c));root.style.setProperty("--"+n+"d",hx(dk(c)))}
Promise.all([C.a?null:load(C.ida),C.b?null:load(C.idb)]).then(function(r){var pa=r[0]?pal(r[0]):[],pb=r[1]?pal(r[1]):[];
var ca=C.a?rgb(C.a):(pa[0]?fix(pa[0]):null),cb=C.b?rgb(C.b):(pb[0]?fix(pb[0]):null);
if(ca&&cb&&!C.b&&dist(ca,cb)<110){cb=null;for(var i=1;i<pb.length;i++){var c=fix(pb[i]);if(dist(c,ca)>=110){cb=c;break}}if(!cb)cb=[240,160,32]}
if(ca)set("c1",ca);if(cb)set("c2",cb)})})();</script>
`;
// v32: Fixtures TV board branding. The two accent colours come from the team crest (same method as Match Stats); &colour=hex overrides the first.
const TV_BRAND_SCRIPT = String.raw`<script>(function(){var R=document.documentElement,OV="__OV__",ID="__ID__";
function lum(c){return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255}
function fix(c){if(lum(c)<0.14){c=c.map(function(v){return v+(255-v)*0.38})}return c}
function hx(c){return "#"+c.map(function(v){return ("0"+Math.round(v).toString(16)).slice(-2)}).join("")}
function rgb(h){return [1,3,5].map(function(k){return parseInt(h.slice(k,k+2),16)})}
function dist(a,b){return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))}
function pal(img){var S=48,cv=document.createElement("canvas");cv.width=S;cv.height=S;var x=cv.getContext("2d");x.drawImage(img,0,0,S,S);var d;try{d=x.getImageData(0,0,S,S).data}catch(e){return []}
var B=[],i;for(i=0;i<24;i++)B.push({w:0,r:0,g:0,b:0});
for(i=0;i<d.length;i+=4){if(d[i+3]<160)continue;var r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mx===mn)continue;var l=(mx+mn)/510,s=(mx-mn)/(255-Math.abs(mx+mn-255));if(s<0.28||l>0.9||l<0.08)continue;var dl=mx-mn,h;if(mx===r)h=((g-b)/dl+6)%6;else if(mx===g)h=(b-r)/dl+2;else h=(r-g)/dl+4;var k=Math.floor(h/6*24)%24,w=s*(1-Math.abs(2*l-1)+0.2);B[k].w+=w;B[k].r+=r*w;B[k].g+=g*w;B[k].b+=b*w}
return B.filter(function(z){return z.w>0}).sort(function(p,q){return q.w-p.w}).map(function(z){return [z.r/z.w,z.g/z.w,z.b/z.w]})}
function paint(a,b){R.style.setProperty("--b1",hx(a));R.style.setProperty("--b2",hx(b));R.style.setProperty("--bg1",hx(a.map(function(v){return v*0.3})))}
function go(p){var a=OV?rgb(OV):(p[0]?fix(p[0]):null);if(!a)return;var b=null;for(var i=0;i<p.length;i++){var c=fix(p[i]);if(dist(c,a)>=110){b=c;break}}if(!b)b=[240,170,40];paint(a,b)}
if(OV&&!ID){go([])}else if(ID){var im=new Image();im.onload=function(){go(pal(im))};im.onerror=function(){if(OV)go([])};im.src="/api/crest?id="+encodeURIComponent(ID)}
var ck=document.getElementById("sbclk"),dt=document.getElementById("sbdt");
function tick(){var n=new Date();if(ck)ck.textContent=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",timeZone:"Europe/London"}).format(n);if(dt)dt.textContent=new Intl.DateTimeFormat("en-GB",{weekday:"long",day:"numeric",month:"long",timeZone:"Europe/London"}).format(n)}
tick();setInterval(tick,15000)})();</script>
`;
function hexParam(v) { const t = String(v || "").trim().replace(/^#/, ""); return /^[0-9a-f]{6}$/i.test(t) ? "#" + t.toLowerCase() : ""; }
// Fixtures TV banner (neutral: no difficulty, no form). "Last game" until the end of Sunday, then "Next game".
function bannerInfo(o) { // {todayStr, day, games, table, ownClub}
  const games = o.games || [], today = o.todayStr, wk = weekKey(today), dayOf = g => o.day(new Date(g.iso));
  const weekMs = (a, b) => Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 864e5 / 7);
  const nextG = games.filter(g => g.status === "upcoming" && dayOf(g) >= today).sort((a, b) => a.iso < b.iso ? -1 : 1)[0] || null;
  const lastG = games.filter(g => g.status === "done").sort((a, b) => a.iso < b.iso ? 1 : -1)[0] || null;
  const posOf = id => { const i = (o.table || []).findIndex(t => String(t.id) === String(id)); return i < 0 ? null : i + 1; };
  const nextThisWeek = nextG && weekKey(dayOf(nextG)) === wk;
  if (!nextThisWeek && lastG && weekKey(dayOf(lastG)) === wk && dayOf(lastG) <= today) {
    const wo = !!lastG.wo, m = wo ? 0 : lastG.mineScore - lastG.oppScore;
    return { mode: "last", opp: { id: lastG.oppId, name: lastG.oppName, position: posOf(lastG.oppId) }, tag: lastG.home ? "Home at " + o.ownClub : "Away at " + lastG.oppName,
      score: wo ? "W/O" : lastG.mineScore + "–" + lastG.oppScore, outcome: lastG.outcome, text: wo ? (lastG.outcome === "W" ? "Won by walkover" : "Lost by walkover") : m > 0 ? "Won by " + m : m < 0 ? "Lost by " + (-m) : "Drawn", label: "Full time" };
  }
  if (!nextG) return null;
  const nd = dayOf(nextG), wd = weekMs(wk, weekKey(nd));
  if (wd > 1) return null;
  const diff = Math.round((new Date(nd + "T00:00:00Z") - new Date(today + "T00:00:00Z")) / 864e5);
  const wdName = new Date(nd + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  const when = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : wd === 0 ? "This " + wdName : "Next " + wdName;
  return { mode: "next", opp: { id: nextG.oppId, name: nextG.oppName, position: posOf(nextG.oppId) }, home: nextG.home, tag: nextG.home ? "Home at " + o.ownClub : "Away at " + nextG.oppName,
    when, dateFull: new Date(nd + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }), date: new Date(nextG.iso), venue: nextG.venue || "" };
}
const BANNER_CSS = ".ban{display:grid;gap:0;background:#111719;border:.3vh solid #3fb865;border-radius:2vh;padding:1.2vh 1.6vw;margin-top:1.2vh;height:14.5vh;align-items:center}.ban.last.w{border-color:#3fb865}.ban.last.l{border-color:#d9534f}.ban.last.d{border-color:#e0a82e}.ban>div{padding:0 1.6vw;min-width:0}.ban>div:first-child{padding-left:0}.ban>div+div{border-left:1px solid #26312d}.ban .bl{font-size:1.6vh;letter-spacing:.12em;text-transform:uppercase;color:#91a49a;margin:0 0 .8vh}.ban .bt{display:flex;align-items:center;gap:1.2vw}.ban .bc{width:8.6vh;height:8.6vh;flex:0 0 8.6vh;border-radius:1.6vh;background:#f5f7f6;display:grid;place-items:center;overflow:hidden;position:relative}.ban .bc img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:.8vh}.ban .bc span{font-weight:900;font-size:2.8vh;color:#18221c}.ban .bn{font-size:4.2vh;font-weight:900;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-bottom:.7vh;margin-bottom:-.7vh}.ban .tg span{display:inline-block;background:#1d2b36;color:#9ccaf0;border-radius:99px;padding:.3vh 1vw;font-size:1.9vh;font-weight:700;margin:.6vh .5vw 0 0}.ban .bw{font-size:5.4vh;font-weight:900;line-height:1}.ban .bd{font-size:2.2vh;color:#a9b8af;margin-top:.8vh}.ban .bs{font-size:6vh;font-weight:900;line-height:1}.ban .bs i{font-style:normal;font-size:.5em;margin-left:.8vw;padding:.3vh .9vw;border-radius:99px;color:#fff;vertical-align:middle}.ban .bs i.w{background:#2f9e5b}.ban .bs i.l{background:#d9534f}.ban .bs i.d{background:#c58f1c}.ban .bwx{display:flex;align-items:center;gap:1vw}.ban .bwx .ic{font-size:6vh}.ban .bwx b{display:block;font-size:3vh}.ban .bwx small{font-size:2vh;color:#a9b8af}body.light .ban{background:#fff}body.light .ban>div+div{border-left-color:#e0e7e1}body.light .ban .bl,body.light .ban .bd,body.light .ban .bwx small{color:#53665a}body.light .ban .tg span{background:#dcebf6;color:#1d5a85}.fx.pd{opacity:.78}";
// ---------- v30 app navigation (phones and iPads) ----------
// Touch devices up to iPad Pro size, and narrow windows, are moved to an "app shell" page (?app=1): a team chip,
// a Share sheet and four tabs around the normal views, which load inside a frame (?embed=1) so each keeps its own
// layout. TV and desktop links never change (layout=tv / layout=wide, and wide non-touch screens, are left alone).
const APP_SHELL_CSS = `:root{--bg:#080b0d;--tx:#f2f6f4;--mu:#93a59b;--cd:#111719;--bd:#26312d;--ac:#3fb865;--bar:#0e1513}
html.light{--bg:#eef2ef;--tx:#14301e;--mu:#4a6455;--cd:#ffffff;--bd:#c9dccd;--ac:#1b7f3b;--bar:#f7faf8}
*{box-sizing:border-box}html,body{height:100%;margin:0}
body{background:var(--bg);color:var(--tx);font-family:Arial,Helvetica,sans-serif;overflow:hidden;-webkit-text-size-adjust:100%}
body.light{background:#eef2ef}
.sbx-app{display:flex;flex-direction:column-reverse;height:100vh;height:100dvh}
.sbx-col{flex:1 1 auto;min-height:0;min-width:0;display:flex;flex-direction:column}
.sbx-top{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:max(8px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) 6px max(12px,env(safe-area-inset-left))}
.sbx-chip{display:flex;align-items:center;gap:8px;max-width:calc(100% - 160px);background:var(--cd);color:var(--tx);border:1px solid var(--bd);border-radius:99px;padding:9px 14px;font:700 15px Arial,Helvetica,sans-serif;cursor:pointer;min-height:40px}
.sbx-chip .sbx-cn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sbx-chip b{color:var(--ac);font-size:11px}
.sbx-ic{flex:0 0 auto;min-width:40px;height:40px;padding:0 14px;gap:7px;font:700 14px Arial,Helvetica,sans-serif;border-radius:99px;background:var(--cd);color:var(--tx);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;cursor:pointer}
.sbx-seg{display:none;flex:0 0 auto;margin:2px max(12px,env(safe-area-inset-right)) 6px max(12px,env(safe-area-inset-left));background:var(--cd);border:1px solid var(--bd);border-radius:99px;padding:3px}
.sbx-cmp{flex:0 0 auto;display:flex;gap:8px;margin:0 max(12px,env(safe-area-inset-right)) 8px max(12px,env(safe-area-inset-left));overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.sbx-cmp::-webkit-scrollbar{display:none}
.sbx-cc{flex:0 0 auto;background:var(--cd);color:var(--tx);border:1px solid var(--bd);border-radius:99px;padding:8px 14px;font:700 13px Arial,Helvetica,sans-serif;cursor:pointer;min-height:36px}
.sbx-cc.on{border-color:var(--ac);box-shadow:inset 0 0 0 1px var(--ac);color:var(--ac)}
.sbx-sg{flex:1;text-align:center;padding:8px 6px;border-radius:99px;color:var(--mu);text-decoration:none;font:700 14px Arial,Helvetica,sans-serif}
.sbx-sg.on{background:#1d3a28;color:#fff}html.light .sbx-sg.on{background:#1b7f3b}
.sbx-main{flex:1 1 auto;min-height:0;display:flex;padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
.sbx-fr{flex:1 1 0;min-width:0;width:100%;height:100%;border:0;background:var(--bg)}
.sbx-main.two .sbx-fr+.sbx-fr{border-left:1px solid var(--bd)}
.sbx-tabs{flex:0 0 auto;display:flex;background:var(--bar);border-top:1px solid var(--bd);padding-bottom:env(safe-area-inset-bottom);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
.sbx-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:58px;color:var(--mu);text-decoration:none;font:12px Arial,Helvetica,sans-serif;position:relative}
.sbx-tab.on{color:var(--ac);font-weight:700}
.sbx-tab.on:before{content:"";position:absolute;top:0;left:50%;margin-left:-18px;width:36px;height:3px;background:var(--ac);border-radius:0 0 3px 3px}
.sbx-dim{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:40}
.sbx-sheet{position:fixed;left:0;right:0;bottom:0;margin:0 auto;max-width:520px;max-height:86vh;max-height:86dvh;overflow:auto;background:var(--bar);border:1px solid var(--bd);border-radius:18px 18px 0 0;padding:12px 14px calc(18px + env(safe-area-inset-bottom));z-index:41;box-shadow:0 -10px 30px rgba(0,0,0,.45)}
.sbx-sh{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.sbx-sh h3{margin:0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mu)}
.sbx-x{border:0;background:transparent;color:var(--mu);font-size:26px;line-height:1;padding:2px 8px;cursor:pointer}
.opt{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;padding:12px;border:1px solid var(--bd);border-radius:12px;margin:0 0 8px;background:var(--cd);color:var(--tx);font:15px Arial,Helvetica,sans-serif;cursor:pointer}
.opt.on{border-color:var(--ac)}.opt small{display:block;color:var(--mu);font-size:12px;margin-top:3px}.opt b{color:var(--ac)}
.opt.sh{cursor:default}.sbx-bs{display:flex;gap:6px;flex:0 0 auto}
.sbx-b{display:inline-block;border:1px solid var(--bd);background:var(--cd);color:var(--tx);border-radius:9px;padding:8px 11px;font:700 13px Arial,Helvetica,sans-serif;text-decoration:none;cursor:pointer}
.sbx-b.go{background:#1f8f4d;border-color:#1f8f4d;color:#fff}
.sbx-sub{margin:14px 2px 8px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mu)}
.sbx-hr{height:1px;background:var(--bd);margin:12px 0}.sbx-ver{margin:10px 0 0;text-align:center;color:var(--mu);font-size:11px}
.sbx-chip:focus-visible,.sbx-rt{display:flex;gap:8px;align-items:center}.sbx-bulb{padding:0;width:40px;justify-content:center}.sbx-ic:focus-visible,.sbx-tab:focus-visible,.sbx-sg:focus-visible,.opt:focus-visible,.sbx-b:focus-visible,.sbx-x:focus-visible{outline:3px solid #7fd89a;outline-offset:2px}
#sbv{display:none!important}
@media (min-width:900px) and (min-height:600px) and (orientation:landscape){
 .sbx-app{flex-direction:row}
 .sbx-main{padding-left:0}
 .sbx-tabs{flex-direction:column;width:calc(88px + env(safe-area-inset-left));border-top:0;border-right:1px solid var(--bd);padding-top:max(8px,env(safe-area-inset-top));padding-right:0;justify-content:flex-start}
 .sbx-tab{flex:0 0 76px;min-height:0}.sbx-tab.on:before{top:50%;margin-top:-19px;left:0;margin-left:0;width:3px;height:38px;border-radius:0 3px 3px 0}
 .sbx-sheet{bottom:auto;top:50%;transform:translateY(-50%);border-radius:18px}
}
/* Phone turned sideways: keep the bottom bar but make it slimmer so the page gets the height */
@media (max-height:500px) and (orientation:landscape){
 .sbx-tab{min-height:44px;flex-direction:row;gap:8px;font-size:13px}
 .sbx-top{padding-top:max(4px,env(safe-area-inset-top));padding-bottom:4px}
 .sbx-chip,.sbx-ic{min-height:36px;height:36px;padding-top:0;padding-bottom:0}
 .sbx-seg{margin-top:0;margin-bottom:4px}.sbx-sg{padding:5px 6px;font-size:13px}
}
@media (max-width:899px),(max-height:599px),(orientation:portrait){div[role=note][style*="position:fixed"]{bottom:calc(70px + env(safe-area-inset-bottom))!important}}
.sbx-rot{display:none}
@media (max-height:500px) and (orientation:landscape) and (pointer:coarse){
 html:not(.sbx-ok) .sbx-rot{position:fixed;inset:0;z-index:80;background:var(--bg);color:var(--tx);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:12px max(24px,env(safe-area-inset-right)) 12px max(24px,env(safe-area-inset-left))}
 .sbx-rot svg{color:var(--ac);width:44px;height:44px}.sbx-rot h2{margin:0;font-size:20px}.sbx-rot p{margin:0 0 6px;color:var(--mu);font-size:14px}
}
`;
const APP_SHELL_JS = `(function(){
var d=document,L=location,H=d.documentElement,CFG=window.__SB||{teams:[],version:""};
var KEY="statsBoardRecent",TK="rfuTheme";
function mm(s){try{return matchMedia(s).matches}catch(e){return false}}
function $(i){return d.getElementById(i)}
function el(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var q0=new URLSearchParams(L.search);
var force=q0.get("force")==="1";
var capable=force||mm("(max-width:820px)")||(navigator.maxTouchPoints>0&&mm("(hover:none)")&&mm("(pointer:coarse)")&&Math.min(screen.width,screen.height)<=1100);
if(!capable){q0.delete("app");q0.delete("force");L.replace("/?"+q0.toString());return}
var PK=["season","competition","division","team","teamName","friendlyName"];
var T={};PK.forEach(function(k){T[k]=q0.get(k)||""});
var view=q0.get("view")||"";
if(["","fixtures","leaders","match","opposition"].indexOf(view)<0)view="";
var theme="dark";
try{var st=localStorage.getItem(TK);if(st==="light"||st==="dark")theme=st;else if(q0.get("theme")==="light")theme="light"}catch(e){}
function setTheme(t){theme=t;H.className=t;d.body&&(d.body.className=t);try{localStorage.setItem(TK,t)}catch(e){}var m=d.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"#eef2ef":"#080b0d")}
H.className=theme;
function nameOf(t){return t.friendlyName||t.teamName||"Team"}
function params(t,v,extra){var p=new URLSearchParams();PK.forEach(function(k){if(t[k])p.set(k,t[k])});if(v)p.set("view",v);if(extra)for(var k in extra)p.set(k,extra[k]);return p}
function shellUrl(t,v){return "/?"+params(t,v,{app:"1",force:force?"1":""}).toString().replace(/&force=(?=&|$)/,"")}
function frameUrl(t,v){var x={embed:"1",theme:theme};if(!v)x.layout="mobile";return "/?"+params(t,v,x).toString()}
function shareUrl(t,v,extra){return L.origin+"/?"+params(t,v,extra).toString()}
// recent teams (shared with the welcome screen)
function okRec(r){return r&&/^\\d+$/.test(r.team)&&/^\\d+$/.test(r.competition)&&/^\\d+$/.test(r.division)&&/^\\d{4}-\\d{4}$/.test(r.season)&&typeof r.name==="string"&&typeof r.league==="string"}
function recGet(){try{var a=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(a)?a.filter(okRec).slice(0,3):[]}catch(e){return[]}}
function recSet(a){try{localStorage.setItem(KEY,JSON.stringify(a.slice(0,3)))}catch(e){}}
function leagueOf(t){for(var i=0;i<CFG.teams.length;i++)if(CFG.teams[i].team===t.team)return CFG.teams[i].league;var a=recGet();for(var j=0;j<a.length;j++)if(a[j].team===t.team&&a[j].league)return a[j].league;return ""}
function remember(t){if(!/^\\d+$/.test(t.team)||!/^\\d+$/.test(t.competition)||!/^\\d+$/.test(t.division)||!/^\\d{4}-\\d{4}$/.test(t.season))return;
 var r={team:t.team,name:nameOf(t),competition:t.competition,division:t.division,season:t.season,league:leagueOf(t),tn:t.teamName||nameOf(t)};
 recSet([r].concat(recGet().filter(function(x){return !(x.team===r.team&&x.competition===r.competition&&x.division===r.division)})))}
remember(T);
function fromRec(r){return {season:r.season,competition:r.competition,division:r.division,team:r.team,teamName:r.tn||r.name,friendlyName:r.name}}
// ---------- build the page ----------
var ICON={home:'<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>',fixtures:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',next:'<ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)"/><path d="M9 15l6-6"/>',leaders:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8"/>'};
var TABS=[["home","Home",""],["fixtures","Fixtures","fixtures"],["next","Next game","match"],["leaders","Leaders","leaders"]];
function tabOf(v){return v==="fixtures"?"fixtures":v==="leaders"?"leaders":(v==="match"||v==="opposition")?"next":"home"}
function svg(k){return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[k]+'</svg>'}
var app=el("div","sbx-app"),tabs=el("nav","sbx-tabs"),col=el("div","sbx-col"),top=el("div","sbx-top"),seg=el("div","sbx-seg"),main=el("div","sbx-main");
tabs.setAttribute("aria-label","Main");
var tabEls={};
TABS.forEach(function(t){var a=el("a","sbx-tab");a.href=shellUrl(T,t[2]);a.innerHTML=svg(t[0]==="home"?"home":t[0])+"<span>"+t[1]+"</span>";a.setAttribute("data-t",t[0]);a.addEventListener("click",function(ev){ev.preventDefault();go(t[2],true)});tabs.appendChild(a);tabEls[t[0]]=a});
var chip=el("button","sbx-chip");chip.type="button";chip.setAttribute("aria-haspopup","dialog");
var chipName=el("span","sbx-cn");var chipAr=el("b",null,"▾");chip.appendChild(chipName);chip.appendChild(chipAr);
var BULB='<svg viewBox="0 0 24 24" width="19" height="19" fill="FILL" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>';
var bulbBtn=el("button","sbx-ic sbx-bulb");bulbBtn.type="button";
function bulbSync(){bulbBtn.innerHTML=BULB.replace("FILL",theme==="light"?"currentColor":"none");var t=theme==="light"?"Switch to dark mode":"Switch to light mode";bulbBtn.setAttribute("aria-label",t);bulbBtn.title=t}
bulbBtn.addEventListener("click",function(){setTheme(theme==="light"?"dark":"light");bulbSync();if(f1)f1.removeAttribute("data-u");if(f2)f2.removeAttribute("data-u");render()});
var shareBtn=el("button","sbx-ic");shareBtn.type="button";shareBtn.setAttribute("aria-label","Share links");shareBtn.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"/></svg><span>Links</span>';
var rt=el("div","sbx-rt");rt.appendChild(bulbBtn);rt.appendChild(shareBtn);top.appendChild(chip);top.appendChild(rt);bulbSync();
var bMatch=el("a","sbx-sg","Match Stats"),bOpp=el("a","sbx-sg","Opposition report");seg.appendChild(bMatch);seg.appendChild(bOpp);
bMatch.addEventListener("click",function(ev){ev.preventDefault();go("match",true)});bOpp.addEventListener("click",function(ev){ev.preventDefault();go("opposition",true)});
var cmp=el("div","sbx-cmp");cmp.hidden=true;cmp.setAttribute("role","group");cmp.setAttribute("aria-label","Other competitions");
col.appendChild(top);col.appendChild(cmp);col.appendChild(seg);col.appendChild(main);app.appendChild(tabs);app.appendChild(col);
function mount(){d.body.className=theme;d.body.insertBefore(app,d.body.firstChild)}
// frames
var f1=null,f2=null,split=false;
function mkFrame(){var f=el("iframe","sbx-fr");f.setAttribute("title","Stats Board");f.addEventListener("load",function(){hook(f)});return f}
function hook(f){try{var doc=f.contentDocument;if(!doc||doc.__sbx)return;doc.__sbx=1;doc.addEventListener("click",function(ev){
 var a=ev.target&&ev.target.closest?ev.target.closest("a[href]"):null;if(!a||ev.defaultPrevented||ev.button||ev.metaKey||ev.ctrlKey)return;
 var u;try{u=new URL(a.getAttribute("href"),f.contentWindow.location.href)}catch(e){return}
 if(u.origin!==L.origin)return;
 var p=u.searchParams,v=p.get("view")||"";
 if((u.pathname==="/"||u.pathname==="")&&p.get("team")&&["","fixtures","leaders","match","opposition"].indexOf(v)>=0){ev.preventDefault();var t={};PK.forEach(function(k){t[k]=p.get(k)||""});T=t;remember(T);go(v,true);return}
 if(a.target==="_blank")return;
 ev.preventDefault();L.href=u.href},true)}catch(e){}}
function wantSplit(){return tabOf(view)==="next"&&mm("(min-width:900px)")&&mm("(min-height:600px)")&&mm("(orientation:landscape)")}
function setSrc(f,u){var had=f.getAttribute("data-u");f.setAttribute("data-u",u);if(had){try{f.contentWindow.location.replace(u);return}catch(e){}}f.src=u}
// Other competitions (league, cups) for this team: a row of buttons under the team bar, only when there are two or more.
var LG={};
function lgKey(){return T.team+"|"+(T.season||"")}
function loadLeagues(){var k=lgKey();if(LG[k]!==undefined||!/^\\d+$/.test(T.team))return;LG[k]=null;
 fetch("/api/builder/team?"+new URLSearchParams(T.season?{team:T.team,season:T.season}:{team:T.team})).then(function(r){return r.json()}).then(function(j){LG[k]=(j&&j.leagues)||[];if(lgKey()===k)drawCmp()}).catch(function(){LG[k]=[]})}
function drawCmp(){var l=LG[lgKey()];var ok=l&&l.length>1&&tabOf(view)==="home";
 cmp.innerHTML="";cmp.hidden=!ok;if(!ok)return;
 var cnt={};l.forEach(function(x){cnt[x.competitionName]=(cnt[x.competitionName]||0)+1});
 l.forEach(function(x){var on=x.competition===T.competition&&x.division===T.division;
  var b=el("button","sbx-cc"+(on?" on":""),x.competitionName+(cnt[x.competitionName]>1&&x.divisionName?" \\u00b7 "+x.divisionName:""));b.type="button";if(on)b.setAttribute("aria-current","true");
  b.addEventListener("click",function(){if(on)return;var t={};PK.forEach(function(k){t[k]=T[k]});t.competition=x.competition;t.division=x.division;T=t;remember(T);go(view,true)});
  cmp.appendChild(b)})}
function render(){
 loadLeagues();drawCmp();
 chipName.textContent=nameOf(T);d.title=nameOf(T)+" · The Stats Board";
 for(var k in tabEls){tabEls[k].className="sbx-tab"+(k===tabOf(view)?" on":"");if(k===tabOf(view))tabEls[k].setAttribute("aria-current","page");else tabEls[k].removeAttribute("aria-current")}
 TABS.forEach(function(t){tabEls[t[0]].href=shellUrl(T,t[2])});
 var isNext=tabOf(view)==="next";split=wantSplit();
 seg.style.display=(isNext&&!split)?"flex":"none";
 bMatch.className="sbx-sg"+(view==="match"?" on":"");bOpp.className="sbx-sg"+(view==="opposition"?" on":"");
 bMatch.href=shellUrl(T,"match");bOpp.href=shellUrl(T,"opposition");
 if(split){
  if(!f1||!f2||main.children.length!==2){main.innerHTML="";f1=mkFrame();f2=mkFrame();main.appendChild(f1);main.appendChild(f2)}
  main.className="sbx-main two";var u1=frameUrl(T,"match"),u2=frameUrl(T,"opposition");if(f1.getAttribute("data-u")!==u1)setSrc(f1,u1);if(f2.getAttribute("data-u")!==u2)setSrc(f2,u2)
 }else{
  if(!f1||main.children.length!==1){main.innerHTML="";f1=mkFrame();f2=null;main.appendChild(f1)}
  main.className="sbx-main";var u=frameUrl(T,view);if(f1.getAttribute("data-u")!==u)setSrc(f1,u)
 }
}
function go(v,push){view=v;if(push){try{history.pushState({v:v,T:T},"",shellUrl(T,v))}catch(e){}}else{}render()}
addEventListener("popstate",function(ev){var s=ev.state;if(s&&s.T){T=s.T;view=s.v}else{var q=new URLSearchParams(L.search);PK.forEach(function(k){T[k]=q.get(k)||T[k]});view=q.get("view")||""}render()});
var rz=null;addEventListener("resize",function(){clearTimeout(rz);rz=setTimeout(function(){if(wantSplit()!==split)render()},150)});
// ---------- sheets ----------
var dim=el("div","sbx-dim"),sheet=el("div","sbx-sheet");dim.hidden=true;sheet.hidden=true;sheet.setAttribute("role","dialog");sheet.setAttribute("aria-modal","true");
function closeSheet(){dim.hidden=true;sheet.hidden=true;sheet.innerHTML="";lastFocus&&lastFocus.focus&&lastFocus.focus()}
var lastFocus=null;
dim.addEventListener("click",closeSheet);addEventListener("keydown",function(ev){if(ev.key==="Escape"&&!sheet.hidden)closeSheet()});
function openSheet(title,build,btn){lastFocus=btn||null;sheet.innerHTML="";var h=el("h3",null,title);var x=el("button","sbx-x","×");x.type="button";x.setAttribute("aria-label","Close");x.addEventListener("click",closeSheet);var hd=el("div","sbx-sh");hd.appendChild(h);hd.appendChild(x);sheet.appendChild(hd);build(sheet);dim.hidden=false;sheet.hidden=false;sheet.setAttribute("aria-label",title);var f=sheet.querySelector("button.opt,button.sbx-b,a.opt");if(f&&f.focus)f.focus()}
function opt(label,sub,on,tick){var b=el("button","opt"+(on?" on":""));b.type="button";var t=el("div");t.appendChild(el("span","ol",label));if(sub)t.appendChild(el("small",null,sub));b.appendChild(t);if(tick)b.appendChild(el("b",null,"✓"));return b}
chip.addEventListener("click",function(){openSheet("Choose a team",function(s){
 var cur=T.team,items=[],seen={};
 var inClub=CFG.teams.some(function(t){return t.team===cur})||recGet().some(function(r){return CFG.teams.some(function(t){return t.team===r.team})});
 if(inClub)CFG.teams.forEach(function(t){seen[t.team]=1;items.push({t:{season:T.season,competition:t.competition,division:t.division,team:t.team,teamName:t.teamName,friendlyName:t.name},sub:t.league})});
 recGet().forEach(function(r){if(seen[r.team])return;seen[r.team]=1;items.push({t:fromRec(r),sub:r.league})});
 if(!seen[cur]&&cur){items.unshift({t:T,sub:leagueOf(T)})}
 items.forEach(function(it){var on=it.t.team===cur;var b=opt(nameOf(it.t),it.sub,on,on);b.addEventListener("click",function(){closeSheet();if(on)return;T=it.t;remember(T);go(view,true)});s.appendChild(b)});
 var o=opt("Another club…","Search for any team",false,false);o.appendChild(el("b",null,"›"));o.addEventListener("click",function(){L.href="/?choose=1"});s.appendChild(o);
 var hr=el("div","sbx-hr");s.appendChild(hr);
 addHome(s);
 s.appendChild(el("p","sbx-ver",CFG.version))},chip)});
// add to home screen
var evInst=null;addEventListener("beforeinstallprompt",function(e){e.preventDefault();evInst=e});
function standalone(){return mm("(display-mode: standalone)")||navigator.standalone===true}
function addHome(s){if(standalone())return;var ua=navigator.userAgent||"",ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1);
 if(evInst){var b=opt("Install app","Add to your home screen",false,false);b.addEventListener("click",function(){var e=evInst;evInst=null;closeSheet();e.prompt()});s.appendChild(b)}
 else if(ios){var b2=opt("Add to Home Screen","Tap the Share button in Safari, then choose Add to Home Screen",false,false);b2.disabled=false;s.appendChild(b2)}}
function copy(txt,btn){function done(){var o=btn.textContent;btn.textContent="Copied";setTimeout(function(){btn.textContent=o},1500)}
 try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,function(){fb()});return}}catch(e){}fb();
 function fb(){try{var ta=el("textarea");ta.value=txt;ta.style.cssText="position:fixed;opacity:0";d.body.appendChild(ta);ta.select();d.execCommand("copy");ta.remove();done()}catch(e){}}}
function row(s,label,sub,url){var r=el("div","opt sh");var t=el("div");t.appendChild(el("span","ol",label));if(sub)t.appendChild(el("small",null,sub));r.appendChild(t);
 var g=el("div","sbx-bs"),can=!!navigator.share;var b=el("button","sbx-b"+(can?" go":""),can?"Share":"Copy");b.type="button";
 b.addEventListener("click",function(){if(can){navigator.share({title:nameOf(T)+" \\u2013 "+label,url:url}).catch(function(e){if(!e||e.name!=="AbortError")copy(url,b)})}else copy(url,b)});
 g.appendChild(b);r.appendChild(g);
 // The whole row is a link: tap anywhere except the Share / Copy button to go to that page.
 r.setAttribute("role","link");r.tabIndex=0;r.style.cursor="pointer";
 function go(){try{window.top.location.assign(url)}catch(e){location.assign(url)}}
 r.addEventListener("click",function(ev){if(ev.target.closest(".sbx-bs"))return;go()});
 r.addEventListener("keydown",function(ev){if((ev.key==="Enter"||ev.key===" ")&&!ev.target.closest(".sbx-bs")){ev.preventDefault();go()}});
 s.appendChild(r)}
shareBtn.addEventListener("click",function(){openSheet("Send or copy a link",function(s){
 var cv=view,names={"":"Home","fixtures":"Fixtures","leaders":"Leaders","match":"Match Stats","opposition":"Opposition report"};
 row(s,"This page",names[cv]+" · "+nameOf(T),shareUrl(T,cv));
 if(cv!=="match")row(s,"Match Stats","Next game",shareUrl(T,"match"));
 if(cv!=="opposition")row(s,"Opposition report","Next game",shareUrl(T,"opposition"));
 if(cv!=="fixtures")row(s,"Fixtures","Fixtures and results",shareUrl(T,"fixtures"));
 if(cv!=="leaders")row(s,"Leaders","League leaders",shareUrl(T,"leaders"));
 s.appendChild(el("h4","sbx-sub","For clubhouse screens"));
 row(s,"TV dashboard","Table and stats",shareUrl(T,"",{layout:"tv"}));
 row(s,"TV fixtures","Fixtures and results",shareUrl(T,"fixtures",{layout:"tv"}));
 row(s,"TV leaders","League leaders",shareUrl(T,"leaders",{layout:"tv"}))},shareBtn)});
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",boot);else boot();
function rotateNote(){var KEY="sbxSideways";try{if(sessionStorage.getItem(KEY)==="1")d.documentElement.classList.add("sbx-ok")}catch(e){}
 var o=el("div","sbx-rot");o.setAttribute("role","alertdialog");o.setAttribute("aria-label","Rotate your phone");
 o.innerHTML='<svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="15" y="5" width="18" height="34" rx="3"/><path d="M22 34h4"/><path d="M6 30a18 18 0 0 0 10 12M42 18A18 18 0 0 0 32 6"/><path d="M16 42l-1-5M32 6l1 5"/></svg>';
 o.appendChild(el("h2",null,"Rotate your phone"));o.appendChild(el("p",null,"The Stats Board works best with your phone upright (portrait)."));
 var b=el("button","sbx-b","Use sideways anyway");b.type="button";b.addEventListener("click",function(){d.documentElement.classList.add("sbx-ok");try{sessionStorage.setItem(KEY,"1")}catch(e){}});o.appendChild(b);d.body.appendChild(o)}
function boot(){mount();rotateNote();d.body.appendChild(dim);d.body.appendChild(sheet);try{history.replaceState({v:view,T:T},"",L.href)}catch(e){}render()}
})();
`;
const APP_GATE_JS = `<script>(function(){try{var q=new URLSearchParams(location.search);if(q.get("embed")||q.get("app")||window.top!==window.self)return;var lay=(q.get("layout")||"").toLowerCase();if(lay==="tv"||lay==="wide")return;var mm=function(s){try{return matchMedia(s).matches}catch(e){return false}};var ok=lay==="mobile"||mm("(max-width:820px)")||(navigator.maxTouchPoints>0&&mm("(hover:none)")&&mm("(pointer:coarse)")&&Math.min(screen.width,screen.height)<=1100);if(!ok)return;if(lay==="mobile")q.set("force","1");q.delete("layout");q.set("app","1");location.replace("/?"+q.toString())}catch(e){}})();</script>`;
const APP_WELCOME_JS = `<script>(function(){try{var q=new URLSearchParams(location.search);if(q.get("choose"))return;var mm=function(s){try{return matchMedia(s).matches}catch(e){return false}};if(!(mm("(max-width:820px)")||(navigator.maxTouchPoints>0&&mm("(hover:none)")&&mm("(pointer:coarse)")&&Math.min(screen.width,screen.height)<=1100)))return;var a=JSON.parse(localStorage.getItem("statsBoardRecent")||"[]"),r=null;if(Array.isArray(a))for(var i=0;i<a.length;i++){var x=a[i];if(x&&/^\\d+$/.test(x.team)&&/^\\d+$/.test(x.competition)&&/^\\d+$/.test(x.division)&&/^\\d{4}-\\d{4}$/.test(x.season)&&typeof x.name==="string"){r=x;break}}if(!r)return;var p=new URLSearchParams({season:r.season,competition:r.competition,division:r.division,team:r.team,teamName:r.tn||r.name,friendlyName:r.name,app:"1"});location.replace("/?"+p.toString())}catch(e){}})();</script>`;
const EMBED_CSS = `<style>.mbar,#sbv,.envsw,div[role=note][style*="position:fixed"]{display:none!important}@media(min-width:700px) and (max-width:899px){html.layout-mobile body{max-width:680px;margin-left:auto;margin-right:auto}}@media(min-width:900px){html.layout-mobile body{display:block!important;column-count:2;column-gap:16px;max-width:1100px;margin-left:auto;margin-right:auto}html.layout-mobile body>*{margin-bottom:10px}html.layout-mobile .topline,html.layout-mobile .clubhead,html.layout-mobile .stats,html.layout-mobile .foot{column-span:all}html.layout-mobile .panel,html.layout-mobile .table-panel,html.layout-mobile .main>*{break-inside:avoid}html.layout-mobile .main{display:block!important}html.layout-mobile .main>*{margin-bottom:10px}}</style>`;
const APP_VIEWS = ["", "fixtures", "leaders", "match", "opposition"];
function appShellPage(url) {
  const q = url.searchParams;
  const nm = String(q.get("friendlyName") || q.get("teamName") || "Stats Board").replace(/[<>"&]/g, "").slice(0, 45);
  const cfg = JSON.stringify({ teams: TEAMS.map(t => ({ team: t.team, name: t.name, league: t.league, competition: t.competition, division: t.division, teamName: t.teamName })), version: VERSION_LABEL }).replace(/</g, "\\u003c");
  return `<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#080b0d"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="${nm}"><meta name="generator" content="${VERSION_LABEL}"><title>${nm} \u00b7 The Stats Board</title><style>${APP_SHELL_CSS}</style></head><body class="dark"><script>window.__SB=${cfg};</script><script>${APP_SHELL_JS}</script></body></html>`;
}
function appInject(html, url) {
  if (url.pathname.replace(/\/+$/, "") !== "") return html;
  const q = url.searchParams, v = q.get("view") || "";
  if (q.get("embed") === "1") return html.replace(/<\/head>/i, EMBED_CSS + "</head>");
  if (q.get("app")) return html;
  const welcome = !["team", "view", "format", "competition", "division"].some(k => q.has(k));
  if (welcome) return html.replace(/<\/head>/i, APP_WELCOME_JS + "</head>");
  const lay = (q.get("layout") || "").toLowerCase();
  if (!q.has("team") || !APP_VIEWS.includes(v) || lay === "tv" || lay === "wide") return html;
  return html.replace(/<\/head>/i, APP_GATE_JS + "</head>");
}

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36";

// Fetch an RFU URL with a one-hour cache (Cloudflare Cache API, plus an
// in-memory copy). Returns {ok, status, text, fetchedAt}; fetchedAt is when
// the data was actually pulled from RFU, so the "Updated" time on screen only
// moves when the data does.
const memCache = new Map();
// If the RFU site answers with its "verify you are not a robot" challenge page instead of the real page,
// that answer is not data: it is never cached as data and the lookup is retried after BLOCK_RETRY_SECONDS.
// The worker does not try to get past the challenge.
const BLOCK_RETRY_SECONDS = 300;
// The RFU match-centre page (read only to find a game's venue) is refused about half the time and a venue rarely changes,
// so it is kept 24 hours, refreshed in the background during the last hour before that, and a failed try is remembered
// for 6 hours (site-wide, in the edge cache, not just in one place) before the next try.
const VENUE_PAGE_RE = /englandrugby\.com\/fixtures-and-results\/match-centre-community/;
const VENUE_FAIL_SECONDS = 6 * 3600;
const blockSecondsFor = key => VENUE_PAGE_RE.test(key) ? VENUE_FAIL_SECONDS : BLOCK_RETRY_SECONDS;
const earlyFor = key => VENUE_PAGE_RE.test(key) ? 3600 : 0;
const failKeyOf = key => key + (key.includes("?") ? "&" : "?") + "_fail=1";
// Data older than REFRESH_SECONDS is re-fetched, but if RFU is slow, down or blocking, the last good copy (up to
// STALE_SECONDS old) is shown instead of an error. "Updated" on screen then shows when that data was really fetched.
const STALE_SECONDS = 7 * 24 * 3600;
const RFU_TIMEOUT_MS = 8000;
const blockedMem = new Map();
const CHALLENGE_RE = /id=["']challenge-container["']|verify that you.?re not a robot/i;
// ---- RFU API probe (DEV only, behind the PIN) ----
// Calls a fixed list of cluster.england-rfu.com endpoints (from https://api.england-rfu.com/openapi.json) with a team's IDs
// and shows the raw answers, so we can see which ones are worth using. It is not a general proxy: only the list below can be called.
const PROBE_BASE = "https://cluster.england-rfu.com";
const PROBE_EPS = [
  { k: "fullmatches", label: "Matches and league table (what we use today)", m: "GET", p: "/fixtures-and-results/full-matches", q: { season: "{season}", competitionId: "{competitionId}", groupId: "{groupId}" }, need: ["season", "competitionId", "groupId"] },
  { k: "tables", label: "League tables inside full-matches (what is in leagueTables?)", m: "GET", p: "/fixtures-and-results/full-matches", q: { season: "{season}", competitionId: "{competitionId}", groupId: "{groupId}" }, need: ["season", "competitionId", "groupId"], pick: "leagueTables" },
  { k: "currentseason", label: "Current season (seasons where isCurrent is true)", m: "GET", p: "/fixtures-and-results/seasons", need: [], pick: "currentSeason" },
  { k: "team_now", label: "This season: all matches for the team (team ID only) - does it list every competition?", m: "GET", p: "/fixtures-and-results/full-matches", q: { season: "{season}", teamId: "{teamId}" }, need: ["teamId", "season"], pick: "matchSummary" },
  { k: "prev_team", label: "Last season: all matches for the team (team ID only)", m: "GET", p: "/fixtures-and-results/full-matches", q: { season: "{prevSeason}", teamId: "{teamId}" }, need: ["teamId", "season"], pick: "matchSummary" },
  { k: "prev_opp", label: "Last season: all matches for the opponent (team ID only)", m: "GET", p: "/fixtures-and-results/full-matches", q: { season: "{prevSeason}", teamId: "{opponentId}" }, need: ["opponentId", "season"], pick: "matchSummary" },
  { k: "standings_teams", label: "Standings (POST, team IDs)", m: "POST", p: "/opta/standings", body: ["{teamId}", "{opponentId}"], need: ["teamId"] },
  { k: "standings_group", label: "Standings (POST, group ID)", m: "POST", p: "/opta/standings", body: ["{groupId}"], need: ["groupId"] },
  { k: "previous", label: "Previous meetings of two teams", m: "GET", p: "/fixtures-and-results/previousMatch", q: { homeTeamId: "{teamId}", awayTeamId: "{opponentId}", count: "10" }, need: ["teamId", "opponentId"] },
  { k: "previous_rev", label: "Previous meetings (teams the other way round)", m: "GET", p: "/fixtures-and-results/previousMatch", q: { homeTeamId: "{opponentId}", awayTeamId: "{teamId}", count: "10" }, need: ["teamId", "opponentId"] },
  { k: "compare", label: "Team comparison", m: "GET", p: "/stats/teamComparisonStats", q: { homeTeamId: "{teamId}", awayTeamId: "{opponentId}", homeSeason: "{season}", awaySeason: "{season}", homeTeamCompId: "{competitionId}", awayTeamCompId: "{competitionId}" }, need: ["teamId", "opponentId"] },
  { k: "teamstats", label: "Team stats", m: "GET", p: "/stats/teamStats", q: { teamId: "{teamId}", season: "{season}", competitionId: "{competitionId}", groupId: "{groupId}" }, need: ["teamId"] },
  { k: "oppstats", label: "Team stats (opponent)", m: "GET", p: "/stats/teamStats", q: { teamId: "{opponentId}", season: "{season}", competitionId: "{competitionId}", groupId: "{groupId}" }, need: ["opponentId"] },
  { k: "leaguestats", label: "League stats", m: "GET", p: "/stats/leagueStats", q: { groupId: "{groupId}" }, need: ["groupId"] },
  { k: "nextmatch", label: "Next match for the team", m: "GET", p: "/fixtures-and-results/nextmatch", q: { teamId: "{teamId}", count: "3" }, need: ["teamId"] },
  { k: "nextmatch_opp", label: "Next match for the opponent", m: "GET", p: "/fixtures-and-results/nextmatch", q: { teamId: "{opponentId}", count: "3" }, need: ["opponentId"] },
  { k: "nextmatch_all", label: "Upcoming games, up to 60 (team ID only): which competitions and groups do they belong to?", m: "GET", p: "/fixtures-and-results/nextmatch", q: { teamId: "{teamId}", count: "60" }, need: ["teamId"], pick: "nextComps" },
  { k: "gms_match", label: "Venue check 1: one match by ID (GMS match record). Does it name the ground?", m: "GET", p: "/gms/matches/{matchId}", need: ["matchId"] },
  { k: "match_rel", label: "Venue check 2: one match by ID (fixtures-and-results record)", m: "GET", p: "/fixtures-and-results/matchesRelGMS/{matchId}", need: ["matchId"] },
  { k: "match_avail", label: "Venue check 3: is Match Centre data available for this match?", m: "GET", p: "/fixtures-and-results/mcAvailable", q: { matchId: "{matchId}" }, need: ["matchId"] },
  { k: "club_team", label: "Venue check 4: club record, using the team ID as the club ID", m: "GET", p: "/clubs/{teamId}", need: ["teamId"] },
  { k: "club_opp", label: "Venue check 5: club record, using the opponent ID as the club ID", m: "GET", p: "/clubs/{opponentId}", need: ["opponentId"] },
  { k: "club_id", label: "Venue check 6: club record, using the club ID typed in the boxes above", m: "GET", p: "/clubs/{clubId}", need: ["clubId"] },
  { k: "find_team", label: "Venue check 7: Find Rugby entry (clubs), using the team ID", m: "GET", p: "/find-rugby/entity/{teamId}", q: { type: "clubs" }, need: ["teamId"] },
  { k: "find_opp", label: "Venue check 8: Find Rugby entry (clubs), using the opponent ID", m: "GET", p: "/find-rugby/entity/{opponentId}", q: { type: "clubs" }, need: ["opponentId"] },
  { k: "find_id", label: "Venue check 9: Find Rugby entry (clubs), using the club ID typed in the boxes above", m: "GET", p: "/find-rugby/entity/{clubId}", q: { type: "clubs" }, need: ["clubId"] },
  { k: "prevnext", label: "Previous, next and following (team)", m: "GET", p: "/opta/previousNextFollowing", q: { teamId: "{teamId}" }, need: ["teamId"] },
  { k: "search", label: "Search teams, groups or competitions by name", m: "GET", p: "/fixtures-and-results/search", q: { name: "{name}", type: "team", season: "{season}" }, need: ["name"] },
  { k: "teams", label: "Team by ID", m: "GET", p: "/teams/{teamId}", need: ["teamId"] },
  { k: "competition", label: "Competition by ID", m: "GET", p: "/competitions/{competitionId}", need: ["competitionId"] },
  { k: "group", label: "Group by ID", m: "GET", p: "/groups/{groupId}", need: ["groupId"] },
  { k: "count", label: "Matches count", m: "GET", p: "/fixtures-and-results/matchesCount", q: { season: "{season}", competitionId: "{competitionId}", teamId: "{teamId}", groupId: "{groupId}" }, need: ["season"] },
  { k: "seasons", label: "Seasons", m: "GET", p: "/fixtures-and-results/seasons", need: [] },
  { k: "players", label: "Players by team", m: "GET", p: "/players/playersByTeam", q: { teamId: "{teamId}" }, need: ["teamId"] },
  { k: "matches_all", label: "New 1: all matches for a team in one chosen group (POST matches/all, club-entered data)", m: "POST", p: "/fixtures-and-results/matches/all", bodyObj: [{ teamId: "{teamId}", groupIds: ["{groupId}"], opta: false, gms: true }], need: ["teamId", "groupId"] },
  { k: "matches_all_any", label: "New 2: all matches for a team with no group given (does one call cover every competition?)", m: "POST", p: "/fixtures-and-results/matches/all", bodyObj: [{ teamId: "{teamId}", groupIds: [], opta: false, gms: true }], need: ["teamId"] },
  { k: "gms_people", label: "New 3: who played in a match (GMS match participants; needs a match ID)", m: "GET", p: "/gms/matchparticipants", q: { matchId: "{matchId}" }, need: ["matchId"] },
  { k: "gms_events", label: "New 4: tries, conversions and cards in a match (GMS match events; needs a match ID)", m: "GET", p: "/gms/matchevents", q: { matchId: "{matchId}" }, need: ["matchId"] },
  { k: "mc_stats", label: "New 5: match stats for one match (stats/matchCentreStats; usually elite games only)", m: "GET", p: "/stats/matchCentreStats", q: { matchId: "{matchId}" }, need: ["matchId"] },
];
const PROBE_FIELDS = ["teamId", "opponentId", "season", "competitionId", "groupId", "name", "matchId", "clubId"];
async function probeRun(url) {
  const ep = PROBE_EPS.find(e => e.k === url.searchParams.get("ep"));
  if (!ep) return { error: "Unknown endpoint" };
  const v = {};
  for (const f of PROBE_FIELDS) {
    let x = String(url.searchParams.get(f) || "").trim();
    if (f === "name") x = x.replace(/[^\p{L}\p{N} '&.\-]/gu, "").slice(0, 60);
    else if (f === "season") x = /^\d{4}-\d{4}$/.test(x) ? x : "";
    else x = /^\d{1,10}$/.test(x) ? x : "";
    v[f] = x;
  }
  v.prevSeason = /^(\d{4})-(\d{4})$/.test(v.season) ? (Number(v.season.slice(0, 4)) - 1) + "-" + (Number(v.season.slice(5)) - 1) : "";
  const miss = ep.need.filter(f => !v[f]);
  if (miss.length) return { ep: ep.k, label: ep.label, skipped: true, error: "Needs: " + miss.join(", ") };
  const fill = s => String(s).replace(/\{(\w+)\}/g, (_, f) => v[f] ?? "");
  const target = new URL(PROBE_BASE + fill(ep.p));
  for (const [k, val] of Object.entries(ep.q || {})) { const x = fill(val); if (x !== "") target.searchParams.set(k, x); }
  let body;
  if (ep.body) body = JSON.stringify(ep.body.map(fill).filter(x => x !== "").map(Number));
  if (ep.bodyObj) {
    const fv = x => typeof x === "string" ? (/^\{\w+\}$/.test(x) ? (fill(x) === "" ? undefined : Number(fill(x))) : fill(x)) : Array.isArray(x) ? x.map(fv).filter(y => y !== undefined) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, y]) => [k, fv(y)]).filter(([, y]) => y !== undefined)) : x;
    body = JSON.stringify(ep.bodyObj.map(fv));
  }
  const t0 = Date.now();
  const out = { ep: ep.k, label: ep.label, method: ep.m, url: String(target), requestBody: body ? JSON.parse(body) : undefined };
  try {
    const r = await fetch(String(target), { method: ep.m, headers: { "User-Agent": UA, "Accept": "application/json, text/plain, */*", ...(body ? { "Content-Type": "application/json" } : {}) }, body, signal: AbortSignal.timeout(RFU_TIMEOUT_MS) });
    const text = await r.text();
    out.status = r.status; out.ok = r.ok; out.ms = Date.now() - t0; out.bytes = text.length;
    out.contentType = (r.headers && r.headers.get && r.headers.get("content-type")) || "";
    out.challenge = CHALLENGE_RE.test(text) || undefined;
    try { out.json = JSON.parse(text); } catch (_) { out.text = text.slice(0, 4000); }
    if (out.json !== undefined && text.length <= 300000) {
      // What does this endpoint carry that could replace an englandrugby.com website lookup? Paths and sample values only.
      const hits = { venue: {}, crest: {}, ids: {} };
      const walk = (o, path, d) => {
        if (d > 7 || o === null || typeof o !== "object") return;
        if (Array.isArray(o)) { o.slice(0, 3).forEach((x, i) => walk(x, path + "[]", d + 1)); return; }
        for (const [k, x] of Object.entries(o)) {
          const here = path ? path + "." + k : k;
          if (x && typeof x === "object") { walk(x, here, d + 1); continue; }
          if (x === null || x === "" || x === undefined) continue;
          if (/venue|stadium|ground|location|facility|pitch|address|postcode|latitude|longitude|^lat$|^lon$|^lng$|town|city|street/i.test(k) && Object.keys(hits.venue).length < 12) hits.venue[here] = String(x).slice(0, 80);
          else if (/crest|logo|badge|image|img|icon/i.test(k) && Object.keys(hits.crest).length < 8) hits.crest[here] = String(x).slice(0, 120);
          else if (/(^|\.)(competition|group|division)\.(id|commonId|name)$/i.test(here) && Object.keys(hits.ids).length < 12) hits.ids[here] = String(x).slice(0, 80);
        }
      };
      try { walk(out.json, "", 0); } catch (_) { /* scan is best effort */ }
      out.found = { venueFields: hits.venue, crestFields: hits.crest, competitionGroupFields: hits.ids };
    }
    if (out.json !== undefined && ep.pick) {
      const j = out.json;
      if (ep.pick === "leagueTables") out.json = { note: "contents of the leagueTables key", leagueTables: j && j.leagueTables !== undefined ? j.leagueTables : "(no leagueTables key)" };
      else if (ep.pick === "currentSeason") out.json = Array.isArray(j) ? { current: j.filter(s => s && s.isCurrent).map(s => ({ name: s.name, startDate: s.startDate, endDate: s.endDate })), seasonCount: j.length, latestFive: j.slice(-5).map(s => ({ name: s.name, isCurrent: s.isCurrent })) } : j;
      else if (ep.pick === "nextComps") {
        const by = new Map();
        for (const g of (Array.isArray(j) ? j : [])) {
          const c = (g && g.competition) || {}, gr = (g && g.group) || {};
          const k = (c.commonId || c.id || "?") + "/" + (gr.commonId || gr.id || "?");
          const e = by.get(k) || { competition: c.name || "", competitionId: c.commonId || c.id || null, group: gr.name || "", groupId: gr.commonId || gr.id || null, games: 0, first: "", last: "" };
          e.games += (g.matches || []).length || 1;
          const d = String(g.date || "").slice(0, 10); if (d && (!e.first || d < e.first)) e.first = d; if (d && d > e.last) e.last = d;
          by.set(k, e);
        }
        out.json = { returned: Array.isArray(j) ? j.length : "not a list", competitions: [...by.values()], firstGame: Array.isArray(j) && j[0] ? j[0] : null };
      }
      else if (ep.pick === "matchSummary") {
        const flat = a => (Array.isArray(a) ? a : []).flatMap(g => (g && Array.isArray(g.matches)) ? g.matches : (g && g.homeTeam ? [g] : []));
        const res = flat(j && j.results), fx = flat(j && j.fixtures), me = Number(url.searchParams.get(ep.k === "prev_opp" ? "opponentId" : "teamId"));
        const opp = new Map(); const groups = new Set();
        for (const m of res.concat(fx)) { const h = m.homeTeam || {}, a = m.awayTeam || {}; const o = (h.commonId === me || h.id === me) ? a : h; if (o && o.name) opp.set(o.commonId || o.id, o.name); if (m.group && m.group.name) groups.add((m.competition && m.competition.name ? m.competition.name + " / " : "") + m.group.name + " [competition id " + ((m.competition && (m.competition.id || m.competition.commonId)) || "none") + ", group id " + ((m.group && (m.group.id || m.group.commonId)) || "none") + "]"); }
        out.json = { keys: Object.keys(j || {}), resultsPlayed: res.length, fixtures: fx.length, groups: [...groups], opponents: [...opp].map(([id, name]) => id + " " + name), firstResult: res[0] || null };
      }
    }
    if (out.json !== undefined && text.length > 300000) { out.json = undefined; out.text = text.slice(0, 4000); out.truncated = true; }
  } catch (e) { out.ms = Date.now() - t0; out.error = String(e && e.message || e); }
  return out;
}
function probePage(url, th) {
  const e = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const g = k => url.searchParams.get(k) || "";
  const init = { teamId: g("team"), opponentId: "", season: g("season"), competitionId: g("competition"), groupId: g("division"), name: "", matchId: "", clubId: "" };
  const eps = PROBE_EPS.map(x => ({ k: x.k, label: x.label, m: x.m, p: x.p }));
  const q = new URLSearchParams(); for (const k of ["season", "competition", "division", "team", "teamName"]) if (g(k)) q.set(k, g(k));
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>RFU API probe</title><style>
:root{--bg:#080b0d;--cd:#111719;--bd:#26312d;--tx:#f2f6f4;--mu:#93a59b;--ac:#3fb865}
body.light{--bg:#eef2ef;--cd:#fff;--bd:#c9dccd;--tx:#14301e;--mu:#4a6455;--ac:#1b7f3b}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font-family:Arial,Helvetica,sans-serif;padding:18px;max-width:1000px;margin:0 auto}
h1{font-size:20px;margin:0 0 4px}.s{color:var(--mu);margin:0 0 14px;font-size:14px}
.f{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;background:var(--cd);border:1px solid var(--bd);border-radius:12px;padding:12px;margin-bottom:12px}
label{display:block;font-size:12px;color:var(--mu);margin-bottom:3px}input{width:100%;padding:8px;border-radius:8px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font:14px Arial}
button{font:700 13px Arial;border-radius:9px;border:1px solid var(--bd);background:var(--cd);color:var(--tx);padding:8px 12px;cursor:pointer}button.go{background:#1f8f4d;border-color:#1f8f4d;color:#fff}
.bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;align-items:center}.card{background:var(--cd);border:1px solid var(--bd);border-radius:12px;padding:12px;margin-bottom:10px}
.h{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap}.h b{font-size:15px}.m{color:var(--mu);font-size:12px;word-break:break-all;margin:4px 0}
.pill{display:inline-block;padding:2px 9px;border-radius:99px;font:700 12px Arial;background:#444;color:#fff}.pill.ok{background:#1f7a43}.pill.bad{background:#8a2f2f}.pill.skip{background:#80621c}
.k{font-size:13px;margin:6px 0}pre{background:var(--bg);border:1px solid var(--bd);border-radius:8px;padding:8px;max-height:320px;overflow:auto;font-size:12px;white-space:pre-wrap;word-break:break-word;margin:6px 0 0}
</style></head><body class="${th}"><h1>RFU API probe</h1><p class="s">DEV only. Calls a fixed list of cluster.england-rfu.com endpoints with the IDs below and shows what comes back. Nothing is saved or changed.</p>
<div class="f">${PROBE_FIELDS.map(f => `<div><label for="f_${f}">${f}</label><input id="f_${f}" value="${e(init[f])}" autocomplete="off"></div>`).join("")}</div>
<div class="bar"><button class="go" id="all">Run all</button><button id="copy">Copy all results</button><span class="s" id="st" style="margin:0"></span></div><div id="out"></div>
<script>(function(){var EPS=${JSON.stringify(eps).replace(/</g, "\\u003c")},TQ=${JSON.stringify(q.toString())},R={};
function $(i){return document.getElementById(i)}function val(f){return $("f_"+f).value.trim()}
function qs(k){var p=new URLSearchParams();["teamId","opponentId","season","competitionId","groupId","name","matchId","clubId"].forEach(function(f){if(val(f))p.set(f,val(f))});p.set("ep",k);return p.toString()}
function shape(j){if(j===undefined||j===null)return "";if(Array.isArray(j))return "array of "+j.length+(j[0]&&typeof j[0]==="object"?"; first item keys: "+Object.keys(j[0]).slice(0,25).join(", "):"");if(typeof j==="object")return "object; keys: "+Object.keys(j).slice(0,30).join(", ");return typeof j}
function card(ep){var id="c_"+ep.k,c=$(id);if(!c){c=document.createElement("div");c.className="card";c.id=id;$("out").appendChild(c)}return c}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function draw(ep,r){var c=card(ep),cls=r.skipped?"skip":(r.ok?"ok":"bad"),st=r.skipped?"skipped":(r.status?r.status:"error");
var body=r.json!==undefined?JSON.stringify(r.json,null,1):(r.text||"");
c.innerHTML='<div class="h"><b>'+esc(ep.label)+'</b><span><span class="pill '+cls+'">'+st+'</span> '+(r.ms!=null?r.ms+" ms":"")+(r.bytes!=null?" · "+r.bytes+" bytes":"")+' <button data-k="'+ep.k+'">Run</button></span></div><div class="m">'+ep.m+" "+esc(r.url||ep.p)+(r.requestBody?" body "+esc(JSON.stringify(r.requestBody)):"")+'</div>'+(r.error?'<div class="k">'+esc(r.error)+'</div>':"")+(r.challenge?'<div class="k">The RFU robot check page came back instead of data.</div>':"")+(r.json!==undefined?'<div class="k">'+esc(shape(r.json))+'</div>':"")+(body?'<pre>'+esc(body.slice(0,6000))+(body.length>6000?"\\n... ("+body.length+" characters in total)":"")+'</pre>':"");
c.querySelector("button").onclick=function(){run(ep)}}
function run(ep){var c=card(ep);c.innerHTML='<div class="h"><b>'+esc(ep.label)+'</b><span class="pill">running</span></div>';return fetch("/api/probe?"+qs(ep.k),{cache:"no-store"}).then(function(r){return r.json()}).then(function(r){R[ep.k]=r;if(ep.k==="nextmatch_all"&&!val("matchId")){try{var fm=r.json.firstGame.matches[0];if(fm&&fm.id)$("f_matchId").value=fm.id}catch(x){}}draw(ep,r)}).catch(function(e){var r={error:String(e)};R[ep.k]=r;draw(ep,r)})}
function all(){$("st").textContent="Running...";var i=0;(function next(){if(i>=EPS.length){$("st").textContent="Done";return}run(EPS[i++]).then(next)})()}
$("all").onclick=all;
$("copy").onclick=function(){var o=EPS.map(function(ep){var r=R[ep.k]||{};return {endpoint:ep.k,method:r.method||ep.m,url:r.url,status:r.status,ms:r.ms,bytes:r.bytes,error:r.error,found:r.found,shape:shape(r.json),sample:r.json!==undefined?JSON.stringify(r.json).slice(0,1500):(r.text||"").slice(0,500)}});var t=JSON.stringify(o,null,1);try{navigator.clipboard.writeText(t).then(function(){$("st").textContent="Copied"},function(){$("st").textContent="Could not copy"})}catch(e){$("st").textContent="Could not copy"}};
EPS.forEach(function(ep){draw(ep,{skipped:true,error:"Not run yet"})});
if(!val("opponentId")&&TQ){fetch("/?"+TQ+"&format=summary&detail=opposition&nowx=1",{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){if(j&&j.opp){$("f_opponentId").value=j.opp.id||"";$("f_name").value=j.opp.name||""}}).catch(function(){})}
})();</script></body></html>`;
}

// v3.8: the team's next game of ANY competition, from the Fixtures data. Returns the game when it is a cup game that comes first, else null.
async function cupNextGame(worker, origin, p) {
  try {
    const qf = new URLSearchParams({ ...p, format: "summary", detail: "fixtures" });
    const fr = await worker.fetch(new Request(origin + "/?" + qf.toString()));
    if (!fr.ok) return null;
    const fj = await fr.json();
    const ng = (fj.games || []).find(g => g.status === "upcoming");
    return ng && ng.cup ? ng : null;
  } catch (_) { return null; }
}
// How long each kind of data is kept before it counts as old (seconds). Live results use the short clock; things that
// hardly ever change (postcodes, place lookups, the season list) are kept far longer, and forecasts a few hours.
function ttlFor(key) {
  if (/postcodes\.io|geocoding-api\.open-meteo/.test(key)) return 30 * 86400;
  if (/api\.open-meteo\.com/.test(key)) return 3 * 3600;
  if (/fixtures-and-results\/seasons/.test(key)) return 86400;
  if (VENUE_PAGE_RE.test(key)) return 24 * 3600;
  if (/cluster\.england-rfu\.com\/gms\/matches\/\d+$/.test(key)) return 24 * 3600;
  if (/cluster\.england-rfu\.com\/fixtures-and-results\/nextmatch\?.*count=60/.test(key)) return 3 * 3600;
  if (/cluster\.england-rfu\.com\/teams\/\d+$/.test(key)) return 7 * 86400;
  if (/cluster\.england-rfu\.com\/gms\/match(participants|events)\?/.test(key)) return 120; // team sheets and scorers (admin match sheet): kept two minutes
  if (/englandrugby\.com\/api\/fixtures-and-result\/(teamSelect|competitionSelect)/.test(key)) return 12 * 3600;
  if (/englandrugby\.com\/fixtures-and-results\/search-results\?team=\d+&season=[^&]+$/.test(key)) return 12 * 3600;
  return liveDataSeconds();
}
const SWR_FACTOR = 6; // old data is shown at once, and refreshed behind the scenes, until it is this many times past its clock
const RFU_TIMEOUT_STALE_MS = 4000; // when an older copy exists there is no reason to wait long for RFU
const refreshing = new Map();
let SITE_CTX = null; // set at the start of every request, so a refresh can carry on after the page has been sent
const upLabel = k => /full-matches/.test(k) ? "RFU results feed" : /gms\/matches\//.test(k) ? "RFU match record" : /gms\/match(participants|events)/.test(k) ? "RFU team sheet" : /fixtures-and-results\/seasons/.test(k) ? "RFU season list" : /cluster\.england-rfu\.com/.test(k) ? "RFU feed (other)" : /englandrugby\.com/.test(k) ? "RFU web page" : /postcodes\.io/.test(k) ? "Postcode lookup" : /geocoding/.test(k) ? "Place lookup" : /open-meteo/.test(k) ? "Weather forecast" : "Other";
// One data point per real outside fetch (never per cache hit): how long it took, whether it worked, and whether a visitor was waiting.
function usageUp(key, ms, outcome, waited) {
  try {
    const ds = SITE_ENV && SITE_ENV.USAGE;
    if (!ds || typeof ds.writeDataPoint !== "function") return;
    siteSettings().then(st => { if (st.features.count !== false) ds.writeDataPoint({ indexes: [usageScope()], blobs: [usageScope(), "up", upLabel(key), outcome, waited ? "wait" : "bg"], doubles: [1, ms] }); }).catch(() => {});
  } catch (_) { /* timing never breaks a page */ }
}
// The real fetch from outside. Returns { kind: "ok" | "blocked" | "http", v } and stores good answers; throws on network failure or timeout.
async function rfuNetwork(key, accept, cache, ttlS, timeoutMs, waited) {
  const t0 = Date.now();
  let r, text;
  try {
    r = await fetch(key, { headers: { "Accept": accept || "*/*", "User-Agent": UA }, signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined });
    text = await r.text();
  } catch (err) {
    usageUp(key, Date.now() - t0, /timeout|abort/i.test(String(err && (err.name || err.message))) ? "timeout" : "error", waited);
    await rememberFailure(cache, key, { ok: false, status: 0, text: "", fetchedAt: Date.now() });
    throw err;
  }
  const now = Date.now();
  if (CHALLENGE_RE.test(text)) {
    usageUp(key, now - t0, "blocked", waited);
    const bv = { ok: false, status: r.status, text, fetchedAt: now, blocked: true };
    if (blockedMem.size > 300) blockedMem.clear();
    blockedMem.set(key, { until: now + blockSecondsFor(key) * 1000, v: bv });
    await rememberFailure(cache, key, bv);
    return { kind: "blocked", v: bv };
  }
  const v = { ok: r.ok, status: r.status, text, fetchedAt: now };
  usageUp(key, now - t0, r.ok ? "ok" : "http", waited);
  if (!r.ok) { await rememberFailure(cache, key, v); return { kind: "http", v }; }
  if (memCache.size > 300) memCache.clear();
  memCache.set(key, v);
  if (cache) {
    try {
      await cache.put(key, new Response(text, { headers: {
        "Content-Type": "text/plain;charset=utf-8",
        "Cache-Control": "public, max-age=" + Math.max(STALE_SECONDS, ttlS),
        "x-fetched-at": String(now)
      }}));
    } catch (_) { /* Cache API unavailable; in-memory copy still used */ }
  }
  return { kind: "ok", v };
}
// Long-lived "this failed, do not try again yet" note (only for lookups with a long wait): kept here and in the edge cache,
// so every copy of the site sees it and stops trying, not just the one that failed.
async function rememberFailure(cache, key, v) {
  const secs = blockSecondsFor(key);
  if (secs <= BLOCK_RETRY_SECONDS) return;
  const until = Date.now() + secs * 1000;
  blockedMem.set(key, { until, v: { ok: false, status: v.status || 0, text: "", fetchedAt: Date.now(), blocked: !!v.blocked } });
  if (!cache) return;
  try { await cache.put(failKeyOf(key), new Response("x", { headers: { "Cache-Control": "public, max-age=" + secs, "x-until": String(until), "x-status": String(v.status || 0), "x-blocked": v.blocked ? "1" : "" } })); } catch (_) { /* in-memory note still used */ }
}
async function cachedText(target, accept) {
  const key = String(target);
  const now = Date.now();
  const ttlS = ttlFor(key), ttl = ttlS * 1000;
  let stale = null;
  const useStale = fallback => (stale && now - stale.fetchedAt < Math.max(STALE_SECONDS, ttlS) * 1000) ? { ok: true, status: 200, text: stale.text, fetchedAt: stale.fetchedAt, stale: true } : fallback;
  let cache = null;
  try { cache = typeof caches !== "undefined" && caches.default ? caches.default : null; } catch (_) { cache = null; }
  // During the last hour of a long-kept copy, refresh it behind the scenes (unless a failure note says to wait).
  const early = fetchedAt => {
    const e = earlyFor(key);
    if (!e || now - fetchedAt < ttl - e * 1000 || !(SITE_CTX && typeof SITE_CTX.waitUntil === "function")) return;
    const b = blockedMem.get(key), st = refreshing.get(key);
    if ((b && now < b.until) || (st && now - st < 15000)) return;
    refreshing.set(key, now);
    SITE_CTX.waitUntil((async () => {
      try {
        if (cache) { const f = await cache.match(failKeyOf(key)); if (f && Number(f.headers.get("x-until")) > Date.now()) return; }
        await rfuNetwork(key, accept, cache, ttlS, RFU_TIMEOUT_MS, false);
      } catch (_) { /* the older copy stays in use */ } finally { refreshing.delete(key); }
    })());
  };
  const mem = memCache.get(key);
  if (mem && now - mem.fetchedAt < ttl) { early(mem.fetchedAt); return mem; }
  if (mem) stale = mem;
  const blocked = blockedMem.get(key);
  if (blocked && now < blocked.until) return useStale(blocked.v);
  if (cache && blockSecondsFor(key) > BLOCK_RETRY_SECONDS) {
    try {
      const f = await cache.match(failKeyOf(key));
      const until = f ? Number(f.headers.get("x-until")) : 0;
      if (f && until > now) {
        const bv = { ok: false, status: Number(f.headers.get("x-status")) || 0, text: "", fetchedAt: now, blocked: f.headers.get("x-blocked") === "1" };
        blockedMem.set(key, { until, v: bv });
        return useStale(bv);
      }
    } catch (_) { /* no failure note */ }
  }
  if (cache) {
    try {
      const hit = await cache.match(key);
      if (hit) {
        const fetchedAt = Number(hit.headers.get("x-fetched-at")) || 0;
        if (fetchedAt && now - fetchedAt < ttl) {
          const v = { ok: true, status: 200, text: await hit.text(), fetchedAt };
          memCache.set(key, v);
          early(fetchedAt);
          return v;
        }
        if (fetchedAt && !stale) stale = { text: await hit.text(), fetchedAt };
      }
    } catch (_) { /* cache miss */ }
  }
  // Old but not too old: show it at once and refresh behind the scenes, so no visitor waits for the outside fetch.
  if (stale && now - stale.fetchedAt < ttl * SWR_FACTOR && SITE_CTX && typeof SITE_CTX.waitUntil === "function") {
    const started = refreshing.get(key);
    if (!started || now - started > 15000) {
      refreshing.set(key, now);
      if (refreshing.size > 300) refreshing.clear();
      SITE_CTX.waitUntil(rfuNetwork(key, accept, cache, ttlS, RFU_TIMEOUT_MS, false).catch(() => {}).then(() => { refreshing.delete(key); }));
    }
    return { ok: true, status: 200, text: stale.text, fetchedAt: stale.fetchedAt };
  }
  let res;
  try { res = await rfuNetwork(key, accept, cache, ttlS, stale ? RFU_TIMEOUT_STALE_MS : RFU_TIMEOUT_MS, true); }
  catch (err) { if (stale) return useStale(null); throw err; }
  if (res.kind === "blocked") return useStale(res.v);
  if (res.kind === "http" && stale) return useStale(res.v);
  return res.v;
}
const londonTime = ms => new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

// Light/dark choice on phones is saved in the browser and shared by every page.
const THEME_KEY = "rfuTheme";
// Placed straight after <body>: applies the saved theme when the media test passes.
const themeBoot = mq => `<script>(function(){try{var t=localStorage.getItem("${THEME_KEY}");if((t==="light"||t==="dark")&&(${mq}))document.body.classList.remove("light","dark"),document.body.classList.add(t)}catch(e){}})();</script>`;
// Wires up every .tgl button: flips the theme, saves it and relabels the buttons.
const themeToggleScript = `<script>(function(){function sync(){var l=document.body.classList.contains("light");document.querySelectorAll(".tgl").forEach(function(b){b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="'+(l?"currentColor":"none")+'" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>';b.setAttribute("aria-label",l?"Switch to dark mode":"Switch to light mode");b.title=l?"Switch to dark mode":"Switch to light mode"});var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",l?"#eef2ef":"#080b0d")}sync();document.addEventListener("click",function(ev){var b=ev.target.closest(".tgl");if(!b)return;var t=document.body.classList.contains("light")?"dark":"light";document.body.classList.remove("light","dark"),document.body.classList.add(t);try{localStorage.setItem("${THEME_KEY}",t)}catch(e){}sync()})})();</script>`;

// Shared styles for the menu and link builder pages.
const MENU_CSS = `*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:Arial,Helvetica,sans-serif;background:#080b0d;color:#f5f7f6;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(24px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}
.wrap{max-width:760px;margin:0 auto}h1{font-size:24px;margin:8px 0 4px}.sub{color:#91a49a;font-size:14px;margin:0 0 18px}
.top{display:flex;justify-content:space-between;align-items:center;gap:10px}
.card{background:#111719;border:1px solid #26312d;border-radius:16px;padding:16px 18px;margin-bottom:12px}.card h3{margin:0 0 2px;font-size:20px;font-weight:700}.grp{margin-top:26px}.gt{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7fd89a;margin:0 0 2px}.gn{margin:0 0 12px;color:#91a49a;font-size:14px}.lg{margin:0 0 12px;color:#9eafa5;font-size:14px}
.ver{margin:28px 0 0;text-align:center;font-size:12px;color:#5f7168}body.light .ver{color:#6b7d72}.crest{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:56px;height:56px;border-radius:50%;background:#fff;border:1px solid #cbd8ce;overflow:hidden}.crest .ini{font:700 18px Arial,Helvetica,sans-serif;color:#33443a}.crest img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:5px;background:#fff}.tid{display:flex;align-items:center;gap:14px}.tid b{font-size:18px;font-weight:700;display:block}.tid span.sm{display:block;color:#91a49a;font-size:14px;margin-top:2px}body.light .tid span.sm{color:#53665a}
.row{display:flex;gap:8px;margin-top:8px}.only-mob{display:none}@media (max-width:820px),(hover:none) and (pointer:coarse) and (max-width:1100px){.only-tv{display:none}.only-mob{display:flex}}body.dm .only-tv{display:none!important}body.dm .only-mob{display:flex!important}body.dd .only-mob{display:none!important}body.dd .only-tv{display:flex!important}body.all .only-tv,body.all .only-mob{display:flex!important}.btn{flex:1;display:block;text-align:center;text-decoration:none;color:#fff;background:#18512f;border:0;border-radius:10px;padding:12px 10px;font-weight:700;font-size:15px;font-family:inherit;cursor:pointer}.btn.mob{background:#1d4f6b}.btn.lt{background:#4a5a52}.btn.share{background:#7a4d06}[hidden]{display:none!important}
.copy{flex:0 0 auto;background:#19221e;color:#dce4df;border:1px solid #2c3a34;border-radius:10px;padding:0 14px;font-size:14px;font-family:inherit;cursor:pointer}
.pill{font:700 14px Arial,Helvetica,sans-serif;color:#f5f7f6;background:#17211c;border:1px solid #294333;border-radius:99px;padding:8px 14px;text-decoration:none;cursor:pointer;white-space:nowrap}
.mbar{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px}
label.f{display:block;font-size:13px;font-weight:700;color:#9eafa5;margin:14px 0 6px}
input.in,select.in{width:100%;font:16px Arial,Helvetica,sans-serif;color:#f5f7f6;background:#0b1110;border:1px solid #2c3a34;border-radius:10px;padding:11px 12px}
.hits{display:flex;flex-direction:column;gap:6px;margin-top:10px}.hit{text-align:left;font:15px Arial,Helvetica,sans-serif;color:#f5f7f6;background:#19221e;border:1px solid #2c3a34;border-radius:10px;padding:11px 12px;cursor:pointer}.hit[aria-current="true"]{background:#18512f;border-color:#18512f;color:#fff}
.msg{color:#91a49a;font-size:14px;margin:10px 0 0}.msg.err{color:#f09595}
:focus-visible{outline:3px solid #7fd89a;outline-offset:2px}
a,button,select,input{touch-action:manipulation;-webkit-tap-highlight-color:rgba(127,216,154,.25)}
body.light{background:#eef2ef;color:#18221c}body.light .card{background:#fff;border-color:#cbd8ce}body.light .copy,body.light .hit{background:#edf2ee;color:#24342a;border-color:#cbd8ce}body.light .hit[aria-current="true"]{background:#18512f;color:#fff}body.light .lg,body.light .sub,body.light .gn,body.light .msg,body.light label.f{color:#53665a}body.light .gt{color:#1d6b3a}body.light .pill{background:#fff;color:#18221c;border-color:#cbd8ce}body.light input.in,body.light select.in{background:#fff;color:#18221c;border-color:#cbd8ce}body.light :focus-visible{outline-color:#1d6b3a}`;

// Welcome screen: shown when the site is opened with no team in the link.
const WELCOME_CSS = `
.wrap.wl{max-width:620px;padding-top:min(7vh,56px)}
.wl h1{font-size:34px;text-align:center;margin:6px 0 14px;line-height:1.15}
.wl .intro p{margin:0 0 12px;text-align:center;font-size:16px;line-height:1.6;color:#c9d6ce}
.wl .intro p.small{font-size:14px;color:#91a49a}
.wrap.wl:has(.intro.cmp){padding-top:6px}.wrap.wl:has(.intro.cmp) .hint{display:none}.wrap.wl:has(.intro.cmp) .ver{margin-top:16px}.wl .intro.cmp p:not(.small){display:none}.wl .intro.cmp p.small{margin:0 0 14px;font-size:13px}.wl .rec{margin-top:14px}
.wl .intro p.go{margin:20px 0 16px;font-size:17px;font-weight:700;color:#f5f7f6}
.wl .sbox{display:flex;align-items:center;gap:8px;background:#0b1110;border:1px solid #2c3a34;border-radius:99px;padding:5px 6px 5px 18px}
.wl .sbox:focus-within{border-color:#7fd89a;box-shadow:0 0 0 3px rgba(127,216,154,.25)}
.wl .sbox svg{flex:0 0 auto;color:#7d8f85}
.wl .sbox input{flex:1;min-width:0;border:0;background:transparent;color:inherit;font:17px Arial,Helvetica,sans-serif;padding:11px 4px;outline:0}
.wl .sbox button{flex:0 0 auto;border:0;border-radius:99px;background:#18512f;color:#fff;font:700 15px Arial,Helvetica,sans-serif;padding:11px 20px;cursor:pointer}
.wl .hint{text-align:center;color:#7d8f85;font-size:14px;margin:10px 0 0}
.wl .msg{text-align:center}
.wl .res{margin-top:14px;border:1px solid #26312d;border-radius:14px;overflow:hidden;background:#111719}
.wl .res .rh{font-size:13px;color:#91a49a;padding:10px 16px;border-bottom:1px solid #26312d}
.wl .hit{display:block;width:100%;border:0;border-radius:0;border-bottom:1px solid #26312d;background:transparent;padding:14px 16px;font-size:16px}
.wl .hit:last-child{border-bottom:0}
.wl .hit:hover{background:#19221e}
.wl .hit[aria-current="true"]{background:#18512f}
.wl .lgp{padding:12px 16px 14px;background:#0e1513;border-bottom:1px solid #26312d}
.wl .lgp p{margin:0 0 8px;color:#91a49a;font-size:14px}
.wl .lgp select{margin:0 0 10px}
.wl .lgb{display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;text-align:left;font:15px Arial,Helvetica,sans-serif;color:#f5f7f6;background:#19221e;border:1px solid #2c3a34;border-radius:10px;padding:12px 14px;margin-top:6px;cursor:pointer}
.wl .lgb small{color:#91a49a;font-size:12px}
.wl .lgb:hover{border-color:#7fd89a}
.wl .chip{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#111719;border:1px solid #26312d;border-radius:14px;padding:14px 16px;margin:6px 0 10px}
.wl .chip b{display:block;font-size:19px}.wl .chip span:not(.crest):not(.ini){display:block;color:#91a49a;font-size:14px;margin-top:2px}.wl .lgp .tid b{font-size:17px}
.wl .tip{color:#91a49a;font-size:14px;margin:0 0 6px}.wl .tip a{color:inherit}
.wl .rec{margin-top:20px}
.wl .rec .rt{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#91a49a;margin:0 4px 8px}
.wl .rec .lk{border:0;background:transparent;color:#91a49a;font:13px Arial,Helvetica,sans-serif;letter-spacing:0;text-transform:none;font-weight:400;text-decoration:underline;cursor:pointer;padding:4px}
.wl .recrow{display:flex;align-items:stretch;margin-bottom:8px;background:#111719;border:1px solid #26312d;border-radius:14px;overflow:hidden}
.wl .recgo{flex:1;min-width:0;display:flex;align-items:center;gap:12px;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:10px 14px;cursor:pointer}
.wl .recgo:hover{background:#19221e}
.wl .recgo b{display:block;font-size:16px;font-weight:700}
.wl .recgo span:not(.crest):not(.ini){display:block;font-size:13px;color:#91a49a;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wl .recgo>div{min-width:0}
.wl .recx{flex:0 0 auto;width:46px;border:0;border-left:1px solid #26312d;background:transparent;color:#91a49a;font-size:22px;line-height:1;cursor:pointer}
.wl .recx:hover{color:#f09595}
.crest.sm{width:42px;height:42px}.crest.sm .ini{font-size:14px}
body.light .wl .rec .rt,body.light .wl .rec .lk,body.light .wl .recgo span:not(.crest):not(.ini),body.light .wl .recx{color:#53665a}
body.light .wl .recrow{background:#fff;border-color:#cbd8ce}body.light .wl .recx{border-color:#cbd8ce}body.light .wl .recgo:hover{background:#edf2ee}
body.light.wl-b .intro p,body.light .wl .intro p{color:#34463b}
body.light .wl .intro p.small,body.light .wl .hint,body.light .wl .res .rh,body.light .wl .lgp p,body.light .wl .chip span,body.light .wl .tip,body.light .wl .lgb small{color:#53665a}
body.light .wl .intro p.go{color:#18221c}
body.light .wl .sbox{background:#fff;border-color:#cbd8ce}body.light .wl .sbox input{color:#18221c}
body.light .wl .res,body.light .wl .chip{background:#fff;border-color:#cbd8ce}body.light .wl .res .rh,body.light .wl .hit{border-color:#cbd8ce}
body.light .wl .hit:hover{background:#edf2ee}body.light .wl .hit[aria-current="true"]{background:#18512f;color:#fff}
body.light .wl .lgp{background:#f4f7f5;border-color:#cbd8ce}body.light .wl .lgb{background:#fff;color:#18221c;border-color:#cbd8ce}
`;
function welcomePage(theme, base) {
  const t = theme === "light" ? "light" : "dark";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="${t === "light" ? "#eef2ef" : "#080b0d"}"><meta name="generator" content="${VERSION_LABEL}"><meta name="description" content="The Stats Board transforms England Rugby’s fixtures and results feeds into clear, easy-to-read pages for English rugby clubs."><title>The Stats Board</title>
<style>
${MENU_CSS}
${WELCOME_CSS}
</style></head><body class="${t}">${themeBoot("true")}<div class="wrap wl">
<nav class="mbar" style="justify-content:flex-end"><button type="button" class="pill tgl">Light mode</button></nav>
<h1 style="display:flex;justify-content:center">${sbWordmark(true)}<span style="position:absolute;left:-9999px">The Stats Board</span></h1>
<p class="tag" style="text-align:center;color:#91a49a;margin:0 0 16px;font-size:17px">${BRAND_TAGLINE}</p>
<div id="intro" class="intro">
<p>The Stats Board transforms England Rugby’s fixtures and results feeds into clear, easy-to-read pages for English rugby clubs. These pages can be displayed on clubhouse TVs, screens and digital signage, or viewed conveniently on a mobile device.</p>
<p class="small">This is a personal project and is provided free of charge. It comes with no warranty, and while every effort is made to ensure the information is accurate and up to date, no guarantee can be given regarding the availability or accuracy of the data.</p>
<p class="go">To get started, search for an English rugby team.</p>
</div>
<div id="sb"><form id="sf" role="search" class="sbox"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg><input id="q" type="search" placeholder="Try Exeter Chiefs" autocomplete="off" enterkeyhint="search" aria-label="Search for an English rugby team"><button type="submit">Search</button></form>
<p class="hint" id="hint">Search by club or team name.</p><p id="sm" class="msg" aria-live="polite"></p></div>
<div id="rec" class="rec" hidden></div>
<div id="res" class="res" hidden></div>
<div id="out" hidden></div>
<p class="ver">${VERSION_LABEL}</p>
<p class="ver" style="margin-top:6px"><a href="/?view=teams" style="color:inherit">Club access</a> &middot; <a href="/docs" style="color:inherit">Documentation</a></p>
</div>
${themeToggleScript}
<script>
(function(){
var $=function(i){return document.getElementById(i)},cur=null,sel=null,seq=0;
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var SB_BASE=${JSON.stringify(base || "")}||location.origin;
${INITIALS_FN}
function crest(id,name){var w=document.createElement("span");w.className="crest";var i=document.createElement("span");i.className="ini";i.textContent=initialsOf(name);w.appendChild(i);if(id){var m=document.createElement("img");m.alt="";m.src="/api/crest?id="+encodeURIComponent(id);m.onload=function(){i.style.display="none"};m.onerror=function(){m.remove()};w.appendChild(m)}return w}
function api(p,q){return fetch(p+"?"+new URLSearchParams(q)).then(function(r){return r.json()})}
function theme(){return document.body.classList.contains("light")?"light":"dark"}
function qs(o){return new URLSearchParams(o).toString()}
function teamLink(layout){var o={season:sel.season,competition:sel.competition,division:sel.division,team:sel.team,teamName:sel.name,friendlyName:sel.name,theme:theme()};if(layout)o.layout=layout;return SB_BASE+"/?"+qs(o)}
function linkFor(k){return k==="match"?matchLink():k==="fixtures"?matchLink().replace("view=match","view=fixtures"):k==="fixturestv"?matchLink().replace("view=match","view=fixtures")+"&layout=tv":k==="leaders"?matchLink().replace("view=match","view=leaders"):k==="leaderstv"?matchLink().replace("view=match","view=leaders")+"&layout=tv":k==="opp"?matchLink().replace("view=match","view=opposition"):k==="oppwide"?matchLink().replace("view=match","view=opposition")+"&layout=wide":teamLink(k)}
function matchLink(){return SB_BASE+"/?"+qs({view:"match",season:sel.season,competition:sel.competition,division:sel.division,team:sel.team,teamName:sel.name,friendlyName:sel.name,theme:theme()})}
var KEY="statsBoardRecent";
function okRec(r){return r&&/^\\d+$/.test(r.team)&&/^\\d+$/.test(r.competition)&&/^\\d+$/.test(r.division)&&/^\\d{4}-\\d{4}$/.test(r.season)&&typeof r.name==="string"&&typeof r.league==="string"}
function recGet(){try{var a=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(a)?a.filter(okRec).slice(0,3):[]}catch(e){return[]}}
function recSet(a){try{localStorage.setItem(KEY,JSON.stringify(a.slice(0,3)))}catch(e){}}
function recAdd(r){var a=recGet().filter(function(x){return !(x.team===r.team&&x.competition===r.competition&&x.division===r.division)});a.unshift(r);recSet(a)}
function renderRec(){
 var box=$("rec");box.innerHTML="";var a=recGet();
 if(!a.length||$("res").children.length&&!$("res").hidden){box.hidden=true;$("intro").classList.remove("cmp");return}
 $("intro").classList.add("cmp");
 var t=el("div","rt");t.appendChild(el("span",null,"Recent"));var cl=el("button","lk","Clear");cl.type="button";cl.addEventListener("click",function(){recSet([]);renderRec()});t.appendChild(cl);box.appendChild(t);
 a.forEach(function(r){
  var row=el("div","recrow"),b=el("button","recgo"),tx=el("div"),c=crest(r.team,r.name);c.classList.add("sm");
  tx.appendChild(el("b",null,r.name));tx.appendChild(el("span",null,r.league+" \\u00b7 "+r.season));b.type="button";b.appendChild(c);b.appendChild(tx);
  b.addEventListener("click",function(){cur={team:r.team,name:r.name};finish({competition:r.competition,division:r.division,divisionName:r.league},r.season)});
  var x=el("button","recx","\\u00d7");x.type="button";x.setAttribute("aria-label","Remove "+r.name+" from recent");x.addEventListener("click",function(){recSet(recGet().filter(function(z){return !(z.team===r.team&&z.competition===r.competition&&z.division===r.division)}));renderRec()});
  row.appendChild(b);row.appendChild(x);box.appendChild(row)});
 box.hidden=false}
function showSearch(){$("out").hidden=true;$("sb").hidden=false;$("res").hidden=!$("res").children.length;renderRec();$("q").focus()}
function appDevice(){var mm=function(s){try{return matchMedia(s).matches}catch(e){return false}};return mm("(max-width:820px)")||(navigator.maxTouchPoints>0&&mm("(hover:none)")&&mm("(pointer:coarse)")&&Math.min(screen.width,screen.height)<=1100)}
function finish(lg,season){
 sel={team:cur.team,name:cur.name,competition:lg.competition,division:lg.division,season:season,league:lg.divisionName};
 recAdd({team:String(sel.team),name:sel.name,competition:String(sel.competition),division:String(sel.division),season:season,league:sel.league});
 if(appDevice()){location.href=SB_BASE+"/?"+qs({season:season,competition:sel.competition,division:sel.division,team:sel.team,teamName:sel.name,friendlyName:sel.name,app:"1"});return}
 $("sb").hidden=true;$("res").hidden=true;$("rec").hidden=true;$("intro").hidden=true;
 var out=$("out");out.innerHTML="";out.hidden=false;
 var chip=el("div","chip"),left=el("div","tid"),d=el("div");d.appendChild(el("b",null,sel.name));d.appendChild(el("span",null,sel.league+" \\u00b7 "+season));left.appendChild(crest(sel.team,sel.name));left.appendChild(d);chip.appendChild(left);
 var ch=el("button","pill","Change team");ch.type="button";ch.addEventListener("click",showSearch);chip.appendChild(ch);out.appendChild(chip);
 var tip=el("p","tip","Showing the links that suit this device. "),al=el("a",null,"Show all links");al.href="#";al.addEventListener("click",function(ev){ev.preventDefault();var on=document.body.classList.toggle("all");al.textContent=on?"Show device links only":"Show all links"});tip.appendChild(al);out.appendChild(tip);
 var card=el("div","card");
 [["Standard / TV view","",""," only-tv"],["Mobile view","mobile","mob"," only-mob"],["Match Stats (next match)","match","lt",""],["Fixtures and Results (Mobile)","fixtures","mob"," only-mob"],["Fixtures and Results (TV View)","fixturestv","lt"," only-tv"],["League Leaders (Mobile)","leaders","mob"," only-mob"],["League Leaders (TV View)","leaderstv","lt"," only-tv"],["Opposition Report (Mobile)","opp","mob"," only-mob"],["Opposition Report (Wide Screen)","oppwide","lt"," only-tv"]].forEach(function(r){
  var row=el("div","row"+r[3]),a=el("a","btn "+r[2],r[0]);a.setAttribute("data-k",r[1]);a.href=linkFor(r[1]);row.appendChild(a);card.appendChild(row)});
 out.appendChild(card);
 var sr=el("div","row"),sb=el("button","btn share","Share links");sb.type="button";sr.appendChild(sb);out.appendChild(sr);
 var alt=el("div","row");alt.hidden=true;
 function text(){return sel.name+" \\u2022 "+sel.league+" ("+sel.season+")\\n\\nStandard / TV view - full-screen layout for TVs and large screens:\\n"+teamLink("")+"\\n\\nMobile view - scrolling layout for phones:\\n"+teamLink("mobile")+"\\n\\nMatch Stats - next match, head to head:\\n"+matchLink()+"\\n\\nFixtures and results - whole season:\\n"+matchLink().replace("view=match","view=fixtures")+"\\n\\nLeague leaders - best attack and defence in the division:\\n"+matchLink().replace("view=match","view=leaders")+"\\n\\nOpposition report - next opponent, for coaches:\\n"+matchLink().replace("view=match","view=opposition")}
 var em=el("a","btn lt","Email"),wa=el("a","btn lt","WhatsApp"),cp=el("button","btn lt","Copy all");wa.target="_blank";wa.rel="noopener";cp.type="button";
 alt.appendChild(em);alt.appendChild(wa);alt.appendChild(cp);out.appendChild(alt);
 function fillAlt(){var x=text();em.href="mailto:?subject="+encodeURIComponent(sel.name+" dashboard")+"&body="+encodeURIComponent(x);wa.href="https://wa.me/?text="+encodeURIComponent(x)}
 cp.addEventListener("click",function(){var x=text(),done=function(){cp.textContent="Copied";setTimeout(function(){cp.textContent="Copy all"},1500)};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(x).then(done,function(){window.prompt("Copy this",x)})}else{window.prompt("Copy this",x)}});
 sb.addEventListener("click",function(){var x=text();if(navigator.share){navigator.share({title:sel.name+" dashboard",text:x}).catch(function(e){if(e&&e.name!=="AbortError"){fillAlt();alt.hidden=false}})}else{fillAlt();alt.hidden=false;sr.hidden=true}});
 out.refresh=function(){out.querySelectorAll("a.btn[data-k]").forEach(function(a){var k=a.getAttribute("data-k");a.href=linkFor(k)});fillAlt()};
 window.scrollTo(0,0)}
function leagues(panel,d,t){
 panel.innerHTML="";
 if(d.seasons&&d.seasons.length>1){var s=el("select","in");s.setAttribute("aria-label","Season");d.seasons.forEach(function(x){var o=el("option",null,x);o.value=x;if(x===d.season)o.selected=true;s.appendChild(o)});s.addEventListener("change",function(){load(panel,t,s.value)});panel.appendChild(s)}
 if(!d.leagues.length){panel.appendChild(el("p",null,"No league found for this team in "+d.season+". Try another season."));return}
 if(d.leagues.length===1){finish(d.leagues[0],d.season);return}
 var NL=new RegExp(${JSON.stringify(NOT_LEAGUE_RE.source)},"i"),lg1=d.leagues.filter(function(l){return !NL.test(l.competitionName)});
 if(lg1.length===1){finish(lg1[0],d.season);return}
 panel.appendChild(el("p",null,"This team plays in more than one competition. Choose a league."));
 d.leagues.forEach(function(l){var b=el("button","lgb");b.type="button";b.appendChild(el("span",null,l.divisionName));b.appendChild(el("small",null,l.competitionName));b.addEventListener("click",function(){finish(l,d.season)});panel.appendChild(b)})}
function load(panel,t,season){
 var my=++seq;panel.innerHTML="";panel.appendChild(el("p",null,"Loading leagues\\u2026"));
 api("/api/builder/team",season?{team:t.id,season:season,friendlyName:t.name||""}:{team:t.id,friendlyName:t.name||""}).then(function(d){if(my!==seq)return;if(d.error)throw new Error(d.error);cur={team:d.team,name:d.name||t.name};if(t.clubEl)t.clubEl.textContent=d.club||"Is this the right team?";leagues(panel,d,t)}).catch(function(e){if(my!==seq)return;panel.innerHTML="";var m=el("p",null,"Couldn\\u2019t load this team. "+e.message);panel.appendChild(m)})}
$("sf").addEventListener("submit",function(ev){
 ev.preventDefault();var n=$("q").value.trim(),sm=$("sm"),res=$("res");
 if(n.length<2){sm.className="msg err";sm.textContent="Type at least two letters.";return}
 sm.className="msg";sm.textContent="Searching\\u2026";$("hint").hidden=true;$("rec").hidden=true;
 api("/api/builder/search",{name:n}).then(function(d){
  var ts=d.teams||[];sm.textContent="";res.innerHTML="";res.hidden=false;
  if(!ts.length){sm.textContent="No teams match \\u201c"+n+"\\u201d. Check the spelling or try the club name only.";res.hidden=true;return}
  res.appendChild(el("div","rh",ts.length+(ts.length===1?" team found":" teams found")));
  ts.forEach(function(t){var b=el("button","hit",t.name);b.type="button";b.addEventListener("click",function(){
   var open=res.querySelector(".lgp");if(open)open.remove();res.querySelectorAll(".hit").forEach(function(x){x.removeAttribute("aria-current")});
   b.setAttribute("aria-current","true");var panel=el("div","lgp"),tid=el("div","tid"),tx=el("div"),cl=el("span","sm","Checking team\\u2026");tx.appendChild(el("b",null,t.name));tx.appendChild(cl);tid.appendChild(crest(t.id,t.name));tid.appendChild(tx);tid.style.marginBottom="12px";panel.appendChild(tid);var body=el("div");panel.appendChild(body);t.clubEl=cl;b.after(panel);load(body,t)});res.appendChild(b)})
 }).catch(function(e){sm.className="msg err";sm.textContent="Search failed. "+e.message})});
$("q").addEventListener("input",function(){if(!$("q").value.trim()){$("sm").textContent="";$("hint").hidden=false;if($("res").hidden)renderRec()}});
renderRec();
document.addEventListener("click",function(ev){if(ev.target.closest(".tgl")){setTimeout(function(){var o=$("out");if(o.refresh)o.refresh()},0)}});
})();
</script></body></html>`;
}


// ---- Automatic season (v30x) -------------------------------------------------------------------------------------
// A link with no season= follows the RFU season dates; a link with season= stays pinned to it. The RFU "isCurrent" flag
// is not used because it lags (2025-2026 was still "current" in November 2026).
const SEASONS_TTL_MS = 24 * 3600 * 1000;
let seasonsMem = null;
const seasonName = y => y + "-" + (y + 1);
const dateSeasonName = iso => { const y = +iso.slice(0, 4), m = +iso.slice(5, 7); return m >= 8 ? seasonName(y) : seasonName(y - 1); };
const seasonShort = n => /^\d{4}-\d{4}$/.test(n) ? n.slice(0, 4) + "-" + n.slice(7) : String(n || "");
function todayIso(url, isDev) {
  const t = isDev === true && url ? url.searchParams.get("today") : "";
  return t && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : new Date().toISOString().slice(0, 10);
}
// Season list from RFU (one entry per season name, earliest start and latest end). Cached about a day; if RFU cannot be
// read the last known list is used, and with none the dates alone decide.
async function seasonsFromRfu() {
  const now = Date.now();
  if (seasonsMem && now - seasonsMem.at < SEASONS_TTL_MS) return seasonsMem;
  let list = null, err = "";
  try {
    const r = await cachedText(new URL("https://cluster.england-rfu.com/fixtures-and-results/seasons"), "application/json, text/plain, */*");
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = JSON.parse(r.text);
    const arr = Array.isArray(j) ? j : (Object.values(j || {}).find(v => Array.isArray(v) && v.length && v[0] && typeof v[0] === "object") || []);
    const by = new Map();
    for (const it of arr) {
      const name = String(it.name || it.id || "").trim();
      const st = String(it.startDate || "").slice(0, 10), en = String(it.endDate || "").slice(0, 10);
      if (!/^\d{4}-\d{4}$/.test(name) || !/^\d{4}-\d{2}-\d{2}$/.test(st) || !/^\d{4}-\d{2}-\d{2}$/.test(en)) continue;
      const o = by.get(name);
      if (!o) by.set(name, { name, start: st, end: en });
      else { if (st < o.start) o.start = st; if (en > o.end) o.end = en; }
    }
    list = [...by.values()].sort((a, b) => a.start < b.start ? -1 : 1);
    if (!list.length) throw new Error("no seasons in answer");
  } catch (e) { err = String(e && e.message || e); }
  if (list) { seasonsMem = { at: now, list, err: "" }; return seasonsMem; }
  if (seasonsMem) return { at: seasonsMem.at, list: seasonsMem.list, err: err + " (using last known list)" };
  return { at: now, list: [], err };
}
// Which season do the dates say it is? gap = we are between the end of one season and the start of the next.
function seasonCalc(iso, list) {
  if (!list.length) { const cur = dateSeasonName(iso), y = +cur.slice(0, 4); return { season: cur, prev: seasonName(y - 1), next: seasonName(y + 1), gap: false, source: "dates" }; }
  const yOf = n => +n.slice(0, 4);
  const idx = list.findIndex(x => x.start <= iso && iso <= x.end);
  if (idx >= 0) { const cur = list[idx].name; return { season: cur, prev: (list[idx - 1] && list[idx - 1].name) || seasonName(yOf(cur) - 1), next: (list[idx + 1] && list[idx + 1].name) || seasonName(yOf(cur) + 1), gap: false, source: "rfu" }; }
  const before = list.filter(x => x.end < iso), after = list.filter(x => x.start > iso);
  const p = before[before.length - 1], n = after[0];
  if (p && n) return { season: n.name, prev: p.name, next: n.name, gap: true, source: "rfu" };
  if (p) return { season: seasonName(+p.name.slice(5)), prev: p.name, next: seasonName(+p.name.slice(5)), gap: true, source: "rfu" };
  if (n) return { season: n.name, prev: seasonName(yOf(n.name) - 1), next: n.name, gap: false, source: "rfu" };
  const cur = dateSeasonName(iso), y = +cur.slice(0, 4);
  return { season: cur, prev: seasonName(y - 1), next: seasonName(y + 1), gap: false, source: "dates" };
}
const feedMem = new Map();
async function teamHasFixtures(season, teamId) {
  const key = season + "|" + teamId, now = Date.now(), hit = feedMem.get(key);
  if (hit && now - hit.at < 3600 * 1000) return hit.v;
  let v = false;
  try {
    const u = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
    u.searchParams.set("season", season); u.searchParams.set("teamId", String(teamId));
    const r = await cachedText(u, "application/json, text/plain, */*");
    v = !!(r.ok && /"homeTeam"/.test(r.text));
  } catch (_) { v = false; }
  if (feedMem.size > 200) feedMem.clear();
  feedMem.set(key, { at: now, v });
  return v;
}
// Is this team in that division for that season? true / false / null (could not tell).
async function teamInDivision(season, comp, div, teamId) {
  try {
    const u = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
    u.searchParams.set("season", season); u.searchParams.set("competitionId", comp); u.searchParams.set("groupId", div);
    const r = await cachedText(u, "application/json, text/plain, */*");
    if (!r.ok || r.blocked) return null;
    const id = String(teamId).replace(/\D/g, "");
    return new RegExp('"(?:commonId|id)"\\s*:\\s*"?' + id + '"?\\s*[,}]').test(r.text);
  } catch (_) { return null; }
}
const NOT_LEAGUE_RE = /\b(cup|plate|vase|trophy|shield|bowl|friendly|friendlies|festival|sevens|7s|tens|10s)\b/i;
const leagueFixMem = new Map();
// A link with no season may carry last year's competition and division (they change every season, and teams move
// up and down). If the team is not in that division this season, find where it plays now.
async function leagueFix(worker, origin, teamId, season, prev, comp, div) {
  const key = [teamId, season, comp, div].join("|"), now = Date.now(), hit = leagueFixMem.get(key);
  if (hit && now - hit.at < 3600 * 1000) return hit.v;
  const keep = why => ({ competition: comp, division: div, changed: false, why });
  let v;
  try {
    const inDiv = await teamInDivision(season, comp, div, teamId);
    if (inDiv === true) v = keep("team is in this division");
    else if (inDiv === null) v = keep("could not check, link left as it is");
    else {
      const get = async sn => { const r = await worker.fetch(new Request(origin + "/api/builder/team?" + new URLSearchParams({ team: String(teamId), season: sn }))); const j = await r.json(); return (j && j.leagues) || []; };
      const now_ = await get(season);
      const oldL = (await get(prev).catch(() => [])).find(l => l.division === String(div));
      let pick = null, how = "";
      if (oldL) {
        pick = now_.find(l => l.competitionName === oldL.competitionName && l.divisionName === oldL.divisionName); if (pick) how = "same competition and division name as last season";
        if (!pick) { const c = now_.filter(l => l.competitionName === oldL.competitionName); if (c.length === 1) { pick = c[0]; how = "same competition name as last season"; } }
      }
      if (!pick) { const lg = now_.filter(l => !NOT_LEAGUE_RE.test(l.competitionName + " " + l.divisionName)); if (lg.length === 1) { pick = lg[0]; how = "the team's only league this season"; } }
      v = pick ? { competition: pick.competition, division: pick.division, changed: true, why: "moved to " + pick.divisionName + " (" + how + ")", from: oldL ? oldL.divisionName : "" } : keep(now_.length ? "several leagues and no clear match, link left as it is" : "no league found for this season, link left as it is");
    }
  } catch (err) { v = keep("lookup failed: " + String(err && err.message || err)); }
  if (leagueFixMem.size > 200) leagueFixMem.clear();
  leagueFixMem.set(key, { at: now, v });
  return v;
}
const AUTO_SKIP = /^\/(api|builder|probe|release-notes|admin|version|unlock|club-unlock|manifest|icon|apple-touch|favicon)/;
// One calculation for every page: which season (and league) does a link with no season= mean today?
async function autoSeasonFor(worker, url, isDev, teams) {
  const p = url.searchParams, iso = todayIso(url, isDev);
  const out = { auto: false, season: p.get("season") || "", competition: "", division: "", banner: "", why: "", today: iso, gap: false };
  if (out.season) { out.why = "pinned by the link (season=" + out.season + ")"; return out; }
  const sl = await seasonsFromRfu();
  const c = seasonCalc(iso, sl.list);
  out.auto = true; out.season = c.season; out.prev = c.prev; out.next = c.next; out.gap = c.gap; out.source = c.source; out.seasonsError = sl.err; out.seasonsCount = sl.list.length;
  out.why = c.source === "rfu" ? (c.gap ? "between seasons" : "inside the season dates") : "RFU season list not available, chosen from the date";
  if (AUTO_SKIP.test(url.pathname)) return out;
  if (!["team", "view", "format", "competition", "division"].some(k => p.has(k)) && url.pathname.replace(/\/+$/, "") !== "/teams" && url.pathname !== "/calendar.ics") return out;
  const view = p.get("view") || "";
  const multi = view === "stack" || view === "teams" || url.pathname.replace(/\/+$/, "") === "/teams";
  const teamId = p.get("team") || "11039";
  if (c.gap) {
    const ids = multi ? teams.map(t => t.team) : [teamId];
    let has = false;
    for (const id of ids) { if (await teamHasFixtures(c.season, id)) { has = true; break; } }
    out.newSeasonFixtures = has;
    if (has) out.why += "; " + seasonShort(c.season) + " fixtures are published, so switching now";
    else {
      out.season = c.prev;
      out.banner = "New season fixtures not published yet. Showing the " + seasonShort(c.prev) + " final table. This switches to " + seasonShort(c.season) + " automatically.";
      out.why += "; no " + seasonShort(c.season) + " fixtures published yet, so still showing " + seasonShort(c.prev);
    }
  }
  if (!multi) {
    const comp = p.get("competition") || "1699", div = p.get("division") || "75791";
    const fx = await leagueFix(worker, url.origin, teamId, out.season, seasonName(+out.season.slice(0, 4) - 1), comp, div);
    out.league = fx;
    if (fx.changed) { out.competition = fx.competition; out.division = fx.division; }
  }
  return out;
}
const SEASON_BANNER_CSS = "flex:none;display:block;box-sizing:border-box;width:100%;text-align:center;background:#8a5a00;color:#fff;font:clamp(13px,1vw,20px)/1.3 Arial,Helvetica,sans-serif;padding:.4em .9em;border-radius:8px;cursor:pointer;position:relative;z-index:5";
function seasonBannerInject(html, text) {
  // In the page flow (not floating), so it never covers the header; on TV pages the fit-to-screen script makes room for it.
  const b = '<div id="sbgap" role="note" title="Tap to hide" style="' + SEASON_BANNER_CSS + '" onclick="this.remove()">' + String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;") + '</div>';
  return /<body[^>]*>/i.test(html) ? html.replace(/<body([^>]*)>/i, m => m + b) : html;
}
// ------------------------------------------------------------------------------------------------------------------

const worker = {
  // isDev is true only when the Pages project has the ENV_LABEL variable (the dev site). Debug output needs it.
  async fetch(request, isDev = false) {
    const url = new URL(request.url);
    // v30x: a link with no season= is resolved once here (season and, if needed, league), then handled as normal.
    let AUTO = { auto: false, season: url.searchParams.get("season") || "", competition: "", division: "", banner: "" };
    if (!url.searchParams.get("season") && !AUTO_SKIP.test(url.pathname) && request.method !== "POST") {
      try { AUTO = await autoSeasonFor(worker, url, isDev === true, TEAMS); } catch (_) { AUTO.season = dateSeasonName(todayIso(url, isDev === true)); }
    }
    if (!AUTO.season) AUTO.season = dateSeasonName(todayIso(url, isDev === true));
    if (isDev === true && url.searchParams.get("debug") === "season") {
      return new Response(JSON.stringify({ today: AUTO.today || todayIso(url, true), pinned: !AUTO.auto, chosenSeason: AUTO.season, why: AUTO.why, gap: !!AUTO.gap, newSeasonFixtures: AUTO.newSeasonFixtures, banner: AUTO.banner || null, previous: AUTO.prev, next: AUTO.next, listSource: AUTO.source, seasonsInList: AUTO.seasonsCount, seasonsError: AUTO.seasonsError || null, league: AUTO.league || null, correctedCompetition: AUTO.competition || null, correctedDivision: AUTO.division || null }, null, 2), { headers: { "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (AUTO.banner && request.method === "GET" && url.searchParams.get("embed") !== "1" && !url.searchParams.get("format")) {
      const inner = await worker._main(request, isDev, AUTO);
      if (!(inner.headers.get("Content-Type") || "").includes("text/html")) return inner;
      const h = new Headers(inner.headers); h.delete("Content-Length");
      return new Response(seasonBannerInject(await inner.text(), AUTO.banner), { status: inner.status, statusText: inner.statusText, headers: h });
    }
    return worker._main(request, isDev, AUTO);
  },
  async _main(request, isDev = false, AUTO = {}) {
    const url = new URL(request.url);
    // Links shown or shared on screen use the public domain, even if this page was opened on the *.pages.dev address.
    const pubSite = String(SITES[isDev === true ? "DEV" : "PROD"] || "").replace(/\/+$/, "");
    const pubOrigin = /\.pages\.dev$/i.test(url.hostname) && /^https:\/\//.test(pubSite) ? pubSite : url.origin;

    // Crest proxy: serves club crests from this site so the Match Stats page can read their colours.
    if (url.pathname === "/api/crest") {
      const id = url.searchParams.get("id") || "";
      if (!/^\d+$/.test(id)) return new Response("Bad id", { status: 400 });
      const target = "https://images.englandrugby.com/club_images/" + id + ".png";
      const key = target + "?crest-proxy";
      let cache = null;
      try { cache = typeof caches !== "undefined" && caches.default ? caches.default : null; } catch (_) { cache = null; }
      if (cache) { try { const hit = await cache.match(key); if (hit) return hit; } catch (_) { /* miss */ } }
      try {
        const r = await fetch(target, { headers: { "Accept": "image/*", "User-Agent": UA } });
        if (!r.ok) return new Response("Not found", { status: 404 });
        const buf = await r.arrayBuffer();
        const resp = new Response(buf, { headers: { "Content-Type": r.headers.get("Content-Type") || "image/png", "Cache-Control": "public, max-age=86400" } });
        if (cache) { try { await cache.put(key, resp.clone()); } catch (_) { /* cache unavailable */ } }
        return resp;
      } catch (_) { return new Response("Unavailable", { status: 502 }); }
    }

    // Admin page and its save endpoint (club PIN protected by clubGate, never cached, not indexed).
    if (url.pathname === "/api/admin") return adminApi(request, url);
    if (url.pathname === "/api/usage") return usageApi(url);
    if (url.pathname.replace(/\/+$/, "") === "/usage") {
      const th = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      return new Response(usagePage(th, isDev === true, (await siteSettings()).reporting.days), { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
    }
    // Admin match sheet (v3.22): team sheets and scorers for a team's next and last game. Club PIN protected, never cached, not indexed.
    if (url.pathname.replace(/\/+$/, "") === "/matchsheet") {
      const th = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      const ti = Math.max(0, Math.min(TEAMS.length - 1, parseInt(url.searchParams.get("t") || "0", 10) || 0));
      const tm = TEAMS[ti];
      let games = [];
      try {
        const q = new URLSearchParams({ season: tm.season || AUTO.season, competition: tm.competition, division: tm.division, team: tm.team, teamName: tm.teamName, friendlyName: tm.name, format: "summary", detail: "fixtures" });
        const fr = await worker.fetch(new Request(url.origin + "/?" + q.toString()));
        if (fr.ok) games = (await fr.json()).games || [];
      } catch (_) { games = []; }
      const nextG = games.find(g => g.status === "upcoming" && g.id) || null;
      const lastG = games.filter(g => g.status === "done" && !g.wo && g.id).pop() || null;
      const hideTeam = sheetHidesNames(tm.name + " " + tm.league + " " + tm.teamName);
      const [nextM, lastM] = await Promise.all([nextG ? matchSheetFor(nextG, hideTeam) : null, lastG ? matchSheetFor(lastG, hideTeam) : null]);
      return new Response(matchSheetPage(th, isDev === true, TEAMS, ti, { next: nextM, last: lastM, hideTeam, nextG, lastG }), { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
    }
    if (url.pathname.replace(/\/+$/, "") === "/admin") {
      const th = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      return new Response(adminPage(th, isDev === true, await siteSettings(), !!kvOf()), { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
    }

    // Link variables documentation (club PIN protected by clubGate, never cached, not indexed).
    if (url.pathname.replace(/\/+$/, "") === "/docs") {
      const th = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      return new Response(docsPage(th, isDev === true), { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
    }

    // Release notes: dev site only (behind the PIN). Production answers Not found.
    if (url.pathname === "/release-notes" || url.searchParams.get("view") === "notes") {
      if (isDev !== true) return new Response("Not found", { status: 404 });
      const th = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      return new Response(notesPage(th), { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store" } });
    }

    // RFU API probe: dev site only (behind the PIN). Production answers Not found.
    if (url.pathname === "/probe" || url.pathname === "/api/probe") {
      if (isDev !== true) return new Response("Not found", { status: 404 });
      if (url.pathname === "/api/probe") return new Response(JSON.stringify(await probeRun(url)), { headers: { "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store" } });
      const th = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      return new Response(probePage(url, th), { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store" } });
    }

    // Version check: shows which release is live (useful for comparing PROD and DEV).
    if (url.pathname === "/version" || url.searchParams.get("view") === "version") {
      return new Response(JSON.stringify({ app: "The Stats Board", version: VERSION, built: BUILD_DATE, environment: isDev === true ? "DEV" : "PROD" }, null, 2), { headers: { "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store" } });
    }

    // Home-screen app support: manifest (start page = the page it was added from) and icons.
    if (url.pathname === "/manifest.webmanifest") {
      let start = url.searchParams.get("s") || "/";
      if (!(start.startsWith("/") && !start.startsWith("//") && !start.startsWith("/\\"))) start = "/";
      const nm = (url.searchParams.get("n") || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 45);
      const man = { name: nm || "The Stats Board", short_name: (nm || "Stats Board").slice(0, 12), description: "Fixtures, results and league tables for English rugby clubs.", start_url: start, scope: "/", display: "standalone", orientation: "any", background_color: "#080b0d", theme_color: "#080b0d",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] };
      return new Response(JSON.stringify(man), { headers: { "Content-Type": "application/manifest+json;charset=utf-8", "Cache-Control": "public, max-age=3600" } });
    }
    if (url.pathname === "/og-image.jpg") return new Response(Uint8Array.from(atob(ICON_B64["og-image"]), c => c.charCodeAt(0)), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" } });
    { const im = url.pathname === "/favicon.ico" ? [null, "icon-192"] : url.pathname.match(/^\/(icon-192|icon-512|apple-touch-icon)\.png$/);
      if (im) return new Response(Uint8Array.from(atob(ICON_B64[im[1]]), c => c.charCodeAt(0)), { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } }); }

    // Calendar file: /calendar.ics + team settings. Upcoming fixtures only; phones can add or subscribe.
    if (url.pathname === "/calendar.ics") {
      const season = url.searchParams.get("season") || AUTO.season;
      const competition = AUTO.competition || url.searchParams.get("competition") || "1699";
      const division = AUTO.division || url.searchParams.get("division") || "75791";
      const team = url.searchParams.get("team") || "11039";
      const friendly = url.searchParams.get("friendlyName") || "";
      let d = null;
      try {
        const q = new URLSearchParams({season, competition, division, team, teamName: url.searchParams.get("teamName") || "__none__", friendlyName: friendly, format: "summary", detail: "fixtures"});
        const r = await worker.fetch(new Request(url.origin + "/?" + q.toString()));
        if (!r.ok) throw new Error("HTTP " + r.status);
        d = await r.json();
      } catch (_) { return new Response("Calendar unavailable. Please try again shortly.", { status: 502, headers: { "Content-Type": "text/plain;charset=utf-8" } }); }
      const me = friendly || (d && d.team) || "Fixtures";
      const pad = n => String(n).padStart(2, "0");
      const utc = dt => dt.getUTCFullYear() + pad(dt.getUTCMonth() + 1) + pad(dt.getUTCDate()) + "T" + pad(dt.getUTCHours()) + pad(dt.getUTCMinutes()) + "00Z";
      const ymd = dt => dt.toLocaleDateString("en-CA", { timeZone: "Europe/London" }).replace(/-/g, "");
      const esc = t => String(t ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
      const fold = line => { let out = "", rest = line; while (rest.length > 73) { out += rest.slice(0, 73) + "\r\n "; rest = rest.slice(73); } return out + rest; };
      const stamp = utc(new Date());
      const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Stats Board//Fixtures//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:" + esc(me + " fixtures (The Stats Board)"), "X-PUBLISHED-TTL:PT6H", "REFRESH-INTERVAL;VALUE=DURATION:PT6H"];
      for (const g of ((d && d.games) || []).filter(x => x.status === "upcoming")) {
        const start = new Date(g.iso);
        if (Number.isNaN(start.getTime())) continue;
        const home = g.home ? me : g.oppName, away = g.home ? g.oppName : me;
        lines.push("BEGIN:VEVENT", "UID:" + start.toISOString().slice(0, 10) + "-" + team + "-" + g.oppId + "@thestatsboard", "DTSTAMP:" + stamp);
        // Every fixture is an all-day event on its London date; the kick-off time is not used.
        const dayStr = ymd(start), nextDay = new Date(Date.UTC(+dayStr.slice(0, 4), +dayStr.slice(4, 6) - 1, +dayStr.slice(6, 8) + 1));
        lines.push("DTSTART;VALUE=DATE:" + dayStr, "DTEND;VALUE=DATE:" + nextDay.getUTCFullYear() + pad(nextDay.getUTCMonth() + 1) + pad(nextDay.getUTCDate()));
        lines.push("SUMMARY:" + esc(home + " v " + away), "DESCRIPTION:" + esc((g.home ? "Home" : "Away") + " game" + (d && d.league ? " - " + d.league : "")));
        if (g.venue) lines.push("LOCATION:" + esc(g.venue));
        lines.push("END:VEVENT");
      }
      lines.push("END:VCALENDAR");
      return new Response(lines.map(fold).join("\r\n") + "\r\n", { headers: { "Content-Type": "text/calendar;charset=utf-8", "Content-Disposition": 'inline; filename="fixtures.ics"', "Cache-Control": "public, max-age=900" } });
    }

    // Welcome screen: the bare address with no team or view in the link.
    if ((url.pathname === "/" || url.pathname === "") && !["team", "view", "format", "competition", "division"].some(k => url.searchParams.has(k))) {
      const th = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      return new Response(welcomePage(th, pubOrigin), { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // App shell (phones and iPads): tabs, team chip and Share around the normal views, which load in a frame.
    if ((url.pathname === "/" || url.pathname === "") && url.searchParams.get("app") === "1" && url.searchParams.has("team")) {
      return new Response(appShellPage(url), { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store" } });
    }

    // Match Stats: /?view=match&team=..&competition=..&division=..  Next match, with mirrored stat bars.
    // The home team is always on the left. Bar colours come from each club's crest (override with &colour=hex for
    // the selected team and &oppColour=hex for the opponent, e.g. &colour=1b7f3b).
    if (url.searchParams.get("view") === "match") {
      const season = url.searchParams.get("season") || AUTO.season;
      const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      const competition = AUTO.competition || url.searchParams.get("competition") || "1699";
      const division = AUTO.division || url.searchParams.get("division") || "75791";
      const team = url.searchParams.get("team") || "11039";
      const e = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      const hexOf = v => { const t = String(v || "").trim().replace(/^#/, ""); return /^[0-9a-f]{6}$/i.test(t) ? "#" + t.toLowerCase() : ""; };
      const onColour = hex => { const [r,g,b] = [1,3,5].map(k => parseInt(hex.slice(k,k+2),16)/255); return (0.2126*r + 0.7152*g + 0.0722*b) > 0.55 ? "#101010" : "#ffffff"; };
      const ord = n => { const v = n % 100; return n + (["th","st","nd","rd"][(v - 20) % 10] || ["th","st","nd","rd"][v] || "th"); };
      const menuHref = "/?" + new URLSearchParams({theme}).toString();
      let d = null, err = "", cupG = null, cupNoIds = null;
      try {
        // v3.7: if the team's next game (any competition) is a cup game, Match Stats compares the two teams in that cup.
        try {
          const qf = new URLSearchParams({season, competition, division, team, teamName: url.searchParams.get("teamName") || "__none__", friendlyName: url.searchParams.get("friendlyName") || "", format: "summary", detail: "fixtures"});
          const fr = await worker.fetch(new Request(url.origin + "/?" + qf.toString()));
          if (fr.ok) { const fj = await fr.json(); const ng = (fj.games || []).find(g => g.status === "upcoming"); if (ng && ng.cup && ng.competition && ng.division) cupG = ng; else if (ng && ng.cup) cupNoIds = ng; }
        } catch (_) { cupG = null; cupNoIds = null; }
        const q = new URLSearchParams({season, competition: cupG ? cupG.competition : competition, division: cupG ? cupG.division : division, team, teamName: url.searchParams.get("teamName") || "__none__", friendlyName: url.searchParams.get("friendlyName") || "", format: "summary", detail: "match"});
        const r = cupG ? await worker._main(new Request(url.origin + "/?" + q.toString()), isDev, { auto: false, season, competition: String(cupG.competition), division: String(cupG.division), banner: "" }) : await worker.fetch(new Request(url.origin + "/?" + q.toString()));
        if (!r.ok) throw new Error("HTTP " + r.status);
        d = await r.json();
        // v3.22.1: a cup game the RFU lists without a competition/division (e.g. a Premiership Cup tie) has no table or stats to compare.
        // Show the cup game itself as the next game, with a note, instead of the next league game.
        if (cupNoIds && d && d.next) {
          const ng = cupNoIds, id0 = String(team);
          const nm = d.team || url.searchParams.get("friendlyName") || url.searchParams.get("teamName") || "";
          const blank = (id, name) => ({ id, name, played: 0, points: 0, wins: 0, pf: 0, pa: 0, homeWins: 0, awayWins: 0, form: [], position: null });
          d.next = { dateLabel: ng.dateLabel, iso: ng.iso, time: ng.time || "", mineHome: !!ng.home, homeName: ng.home ? nm : ng.oppName, awayName: ng.home ? ng.oppName : nm, homeId: ng.home ? id0 : String(ng.oppId), awayId: ng.home ? String(ng.oppId) : id0, venue: ng.venue || "", venueElite: false, wx: null, comp: ng.comp };
          d.match = { h2h: [], h2hAll: [], h2hSum: null, h2hMeta: { seasonsOk: 0 }, divMax: {}, divisionSize: 0, me: blank(id0, nm), opp: blank(String(ng.oppId), ng.oppName), noStats: true };
          d.cupName = ng.comp; d.league = ng.comp;
        } else if (cupG && d && d.match) { d.cupName = cupG.comp; d.league = cupG.comp; }
        else if (cupG) { // the cup feed had no usable next game: fall back to the league game as before
          cupG = null;
          const q2 = new URLSearchParams({season, competition, division, team, teamName: url.searchParams.get("teamName") || "__none__", friendlyName: url.searchParams.get("friendlyName") || "", format: "summary", detail: "match"});
          const r2 = await worker.fetch(new Request(url.origin + "/?" + q2.toString()));
          if (r2.ok) d = await r2.json();
        }
      } catch (x) { err = String(x && x.message || x); }
      const m = d && d.match, n = d && d.next;
      const meHome = !!(n && n.mineHome);
      const L = m ? (meHome ? m.me : m.opp) : null, R = m ? (meHome ? m.opp : m.me) : null;
      const meAccent = (TEAMS.find(t => String(t.team) === String(team)) || {}).accent;
      const meCol = hexOf(url.searchParams.get("colour")) || hexOf(meAccent) || "#2f9e5b";
      const oppCol = hexOf(url.searchParams.get("oppColour")) || "#4aa3df";
      const colA = meHome ? meCol : oppCol, colB = meHome ? oppCol : meCol;
      const fixedA = meHome ? !!hexOf(url.searchParams.get("colour")) : !!hexOf(url.searchParams.get("oppColour"));
      const fixedB = meHome ? !!hexOf(url.searchParams.get("oppColour")) : !!hexOf(url.searchParams.get("colour"));
      const crest = (id, name, side, fixed) => `<span class="big"><span class="ini">${e(initialsOf(name))}</span>${id ? `<img data-side="${side}" ${fixed ? 'data-fixed="1" ' : ""}src="/api/crest?id=${encodeURIComponent(id)}" alt="" onload="this.previousElementSibling.style.display='none'" onerror="this.remove()">` : ""}</span>`;
      // Form is shown latest -> oldest, left to right, for BOTH teams (as on the other pages), with the latest game ringed.
      const formBlock = (f, cls) => {
        const arr = (f || []).slice();
        const dots = arr.map((x, i) => {
          const last = i === 0;
          const cap = last ? "recent" : "";
          return `<span class="fx"><span class="dot ${x}${last ? " new" : ""}">${x}</span>${cap ? `<small>${cap}</small>` : ""}</span>`;
        }).join("");
        return `<div class="fm${cls ? " " + cls : ""}"><div class="fh">Recent Match Form</div>${arr.length ? `<div class="fd">${dots}</div>` : `<div class="mu">No results yet</div>`}</div>`;
      };
      // Bars never fill the track: the leader is capped at CAP% so there is always room to see the gap.
      const CAP = 88;
      // Default: bars are scaled against the best in the division, so a bar shows how strong the stat is.
      // Add &scale=duel to scale the two teams against each other only (the leader then always gets the full length).
      const duel = url.searchParams.get("scale") === "duel";
      const dm = (m && m.divMax) || {};
      const rowHtml = (label, a, b, kind, fmt, ref) => {
        const ok = a !== null && a !== undefined && b !== null && b !== undefined;
        let wa = 0, wb = 0, better = 0;
        if (ok) {
          if (kind === "rank") {
            const N = Math.max(Number(m.divisionSize) || 1, a, b, 1);
            wa = (N - a + 1) / N * CAP; wb = (N - b + 1) / N * CAP;
            better = a < b ? 1 : a > b ? 2 : 0;
          } else if (kind === "lo") {
            const lo = Math.min(a, b), hi = Math.max(a, b);
            if (!duel && ref && ref.max > ref.min) {
              const top = Math.max(ref.max, hi), bot = Math.min(ref.min, lo);
              const fit = v => 20 + (CAP - 20) * (top - v) / (top - bot);
              wa = fit(a); wb = fit(b);
            } else if (hi === 0) { wa = wb = CAP; }
            else { const wLo = CAP, wHi = CAP * lo / hi; wa = a <= b ? wLo : wHi; wb = b <= a ? wLo : wHi; }
            better = a < b ? 1 : a > b ? 2 : 0;
          } else {
            const hi = Math.max(a, b), top = duel ? hi : Math.max(Number(ref) || 0, hi);
            if (top > 0) { wa = a / top * CAP; wb = b / top * CAP; }
            better = kind === "even" ? 0 : (a > b ? 1 : a < b ? 2 : 0);
          }
        }
        const show = v => ok ? (fmt ? fmt(v) : String(v)) : "-";
        return `<div class="r"><div class="t l"><div class="b${better === 2 ? " lo" : ""}" style="width:${wa.toFixed(1)}%">${show(a)}</div></div><div class="c">${e(label)}</div><div class="t rt"><div class="b${better === 1 ? " lo" : ""}" style="width:${wb.toFixed(1)}%">${show(b)}</div></div></div>`;
      };
      let inner;
      if (!d || !m || !n) {
        const who = d && d.team ? d.team : "this team";
        inner = `${d && d.league ? `<div class="ttl"><p>${e(d.league)}</p></div>` : ""}<div class="note">${err ? "Couldn't load the match data just now. It will retry on the next refresh." : "No upcoming fixture found for " + e(who) + "."}</div>`;
      } else {
        const cupMode = !!(d && d.cupName);
        const firstRound = cupMode && !(Number(L.played) > 0) && !(Number(R.played) > 0);
        const tabled = cupMode && Number(m.divisionSize) >= 3;
        const bars = m.noStats ? `<div class="cupnote"><b>No cup stats yet</b>The RFU has not published a table or results for this cup that we can compare, so only the fixture is shown.</div>` : firstRound ? `<div class="cupnote"><b>First game in this cup</b>Neither team has played in the ${e(d.cupName)} yet, so there are no cup stats to compare.</div>` : [
          rowHtml("Games played", L.played, R.played, "even", null, dm.played),
          ...(cupMode && !tabled ? [] : [
          rowHtml(cupMode ? "Group position" : "League position", L.position, R.position, "rank", ord),
          rowHtml(cupMode ? "Group points" : "League points", L.points, R.points, "hi", null, dm.points)]),
          rowHtml("Wins", L.wins, R.wins, "hi", null, dm.wins),
          rowHtml("Points scored", L.pf, R.pf, "hi", null, dm.pf),
          rowHtml("Points conceded", L.pa, R.pa, "lo", null, {min: dm.paMin, max: dm.paMax}),
          rowHtml("Home wins", L.homeWins, R.homeWins, "hi", null, dm.homeWins),
          rowHtml("Away wins", L.awayWins, R.awayWins, "hi", null, dm.awayWins)
        ].join("");
        const h2hList = Array.isArray(m.h2h) ? m.h2h : [];
        const voidTxt = (() => { const vs = (m.h2hMeta && m.h2hMeta.voided) || []; if (!vs.length) return ""; const by = {}; for (const x of vs) by[x.season] = (by[x.season] || 0) + 1; return Object.keys(by).sort().reverse().map(k => by[k] + (by[k] === 1 ? " game" : " games") + " void in " + k).join(", "); })();
        const haAll = Array.isArray(m.h2hAll) ? m.h2hAll : [];
        const h2hBlock = haAll.length ? (() => {
          const idL = String(L.id), idR = String(R.id);
          const cls = g => g.winId === idL ? "wa" : g.winId === idR ? "wb" : "wd";
          const nmOf = id => id === idL ? L.name : R.name;
          const lbl = g => g.winId ? e(nmOf(g.winId)) + (g.wo ? " (walkover)" : " won") : "Draw";
          const sc = g => g.wo ? "W/O" : e(g.homeScore) + " &ndash; " + e(g.awayScore);
          const cL = haAll.filter(g => g.winId === idL).length, cR = haAll.filter(g => g.winId === idR).length, cD = haAll.length - cL - cR;
          const pc = v => (v / haAll.length * 100).toFixed(1);
          const ns = haAll.filter(g => !g.wo); const sum = (id) => ns.reduce((t, g) => t + (g.homeId === id ? g.homeScore : g.awayScore), 0);
          const avg = ns.length ? `<div class="hav">Average score <b>${(Math.round(sum(idL) / ns.length * 10) / 10)} &ndash; ${(Math.round(sum(idR) / ns.length * 10) / 10)}</b>${cD ? ` &nbsp;|&nbsp; ${cD} draw${cD > 1 ? "s" : ""}` : ""}</div>` : (cD ? `<div class="hav">${cD} draw${cD > 1 ? "s" : ""}</div>` : "");
          const tiles = haAll.slice(0, 5).map((g, i) => `<div class="tj ${cls(g)} x${i + 1}"><small>${e(g.label)}</small><b>${sc(g)}</b><em>${lbl(g)}</em></div>`).join("");
          const seasons = []; for (const g of haAll) { let grp = seasons.find(x => x.s === g.season); if (!grp) { grp = { s: g.season, list: [] }; seasons.push(grp); } grp.list.push(g); }
          const all = seasons.map(grp => `<div class="hsn">${e(grp.s)}</div>` + grp.list.map(g => `<div class="hrw ${cls(g)}"><div>${e(g.homeName)} v ${e(g.awayName)}<small>${e(g.full)} &middot; ${lbl(g)}${g.comp ? " &middot; " + e(g.comp) : ""}</small></div><b>${sc(g)}</b></div>`).join("")).join("");
          const voidLine = voidTxt ? `<div class="hav">Not counted: ${e(voidTxt)}</div>` : "";
          return `<div class="h2h"><div class="fh">Head to head &middot; last 5 seasons</div><div class="hsp"><div class="s wa" style="width:${pc(cL)}%">${cL ? e(L.name) + " " + cL : ""}</div>${cD ? `<div class="s wd" style="width:${pc(cD)}%">${cD}</div>` : ""}<div class="s wb" style="width:${pc(cR)}%">${cR ? e(R.name) + " " + cR : ""}</div></div><div class="hts">${tiles}</div>${avg}${voidLine}<details class="hall"><summary>Show all ${haAll.length} meeting${haAll.length > 1 ? "s" : ""}</summary>${all}</details></div>`;
        })() : (h2hList.length ? (() => { const ex = `<div class="h2h"><div class="fh">Earlier this season</div><div class="hh">${h2hList.map(g => { const hw = g.homeScore > g.awayScore, aw = g.awayScore > g.homeScore; return `<span class="hc"><small>${e(g.dateLabel)}</small><span class="${hw ? "w" : ""}">${e(g.homeName)} ${e(g.homeScore)}</span> &ndash; <span class="${aw ? "w" : ""}">${e(g.awayScore)} ${e(g.awayName)}</span></span>`; }).join("")}</div></div>`; return ex; })() : (m.h2hMeta && m.h2hMeta.seasonsOk > 0 ? `<div class="h2h"><div class="fh">Head to head</div><div class="hav">${voidTxt ? "No played " + (cupMode ? "meetings in this cup" : "league meetings") + " in the last 5 seasons (" + e(voidTxt) + ")" : "No " + (cupMode ? "meetings in this cup" : "league meetings") + " in the last 5 seasons"}</div></div>` : ""));
        inner = `<div class="top"><div class="k">Next Game Day${cupMode ? ` <span class="cupchip">${e(d.cupName)}</span>` : ""}</div><div class="dt">${e(n.dateLabel)}${n.time ? " &middot; " + e(n.time) : ""}</div>${n.venue ? `<div class="vn"><a class="dl" target="_blank" rel="noopener" href="${e(mapsLink(n.venue, n.homeName, n.venueElite).href)}">${e(n.venue)}</a></div><div class="vb"><a class="dbtn" target="_blank" rel="noopener" href="${e(mapsLink(n.venue, n.homeName, n.venueElite).href)}">&#128205; Get directions</a></div>` : ""}${wxCardHtml(n.wx, e)}</div>
<div class="hd"><div class="tm ta">${crest(L.id, L.name, "a", fixedA)}<div class="nm">${e(L.name)}</div><span class="tag">Home</span></div>
<div class="vs">v</div>
<div class="tm tb">${crest(R.id, R.name, "b", fixedB)}<div class="nm">${e(R.name)}</div><span class="tag">Away</span></div></div>
<div class="bars">${bars}</div>
${h2hBlock}<div class="ft">${formBlock(L.form)}${formBlock(R.form, "fmr")}</div>
<div class="upd">${cupMode ? "Form and stats here cover the " + e(d.cupName) + " only &middot; " : ""}${e(d.league || "")} &middot; Season ${e(season)} &middot; Last updated ${e(londonTime(Number(d.updatedAt) || Date.now()))} &middot; refreshes hourly</div>`;
      }
      const colourScript = `<script>(function(){var root=document.documentElement;function ink(r,g,b){return (0.2126*r+0.7152*g+0.0722*b)/255>0.55?"#101010":"#ffffff"}
function hex(c){return "#"+c.map(function(v){return ("0"+Math.round(v).toString(16)).slice(-2)}).join("")}
function lum(c){return (0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255}
function fix(c){var y=lum(c);if(y<0.14){var t=0.38;c=c.map(function(v){return v+(255-v)*t})}return c}
function dist(a,b){return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))}
function pal(img){var S=48,cv=document.createElement("canvas");cv.width=S;cv.height=S;var x=cv.getContext("2d");x.drawImage(img,0,0,S,S);var d;try{d=x.getImageData(0,0,S,S).data}catch(e){return []}
var B=[],i;for(i=0;i<24;i++)B.push({w:0,r:0,g:0,b:0});
for(i=0;i<d.length;i+=4){if(d[i+3]<160)continue;var r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mx===mn)continue;var l=(mx+mn)/510,s=(mx-mn)/(255-Math.abs(mx+mn-255));if(s<0.28||l>0.9||l<0.08)continue;var dl=mx-mn,h;if(mx===r)h=((g-b)/dl+6)%6;else if(mx===g)h=(b-r)/dl+2;else h=(r-g)/dl+4;var k=Math.floor(h/6*24)%24,w=s*(1-Math.abs(2*l-1)+0.2);B[k].w+=w;B[k].r+=r*w;B[k].g+=g*w;B[k].b+=b*w}
return B.filter(function(z){return z.w>0}).sort(function(p,q){return q.w-p.w}).map(function(z){return [z.r/z.w,z.g/z.w,z.b/z.w]})}
function ready(img){return new Promise(function(res){function go(){res(img)}if(img.complete&&img.naturalWidth)go();else{img.addEventListener("load",go);img.addEventListener("error",function(){res(null)})}})}
var imgs={a:document.querySelector('img[data-side="a"]'),b:document.querySelector('img[data-side="b"]')};
Promise.all([imgs.a?ready(imgs.a):null,imgs.b?ready(imgs.b):null]).then(function(r){var pa=r[0]&&!r[0].dataset.fixed?pal(r[0]):[],pb=r[1]&&!r[1].dataset.fixed?pal(r[1]):[];var ca=pa[0]?fix(pa[0]):null,cb=pb[0]?fix(pb[0]):null;
if(ca&&cb&&dist(ca,cb)<110){cb=null;for(var i=1;i<pb.length;i++){var c=fix(pb[i]);if(dist(c,ca)>=110){cb=c;break}}if(!cb)cb=[240,160,32]}
if(ca){root.style.setProperty("--ca",hex(ca));root.style.setProperty("--ka",ink(ca[0],ca[1],ca[2]))}
if(cb){root.style.setProperty("--cb",hex(cb));root.style.setProperty("--kb",ink(cb[0],cb[1],cb[2]))}})})();</script>`;
      const refresh = `<script>(function(){var MAX=${REFRESH_SECONDS * 1000},t0=Date.now(),phone=window.matchMedia("(max-width:800px),(max-height:560px)").matches;function tick(){if(Date.now()-t0>=MAX&&document.visibilityState==="visible"&&(!phone||window.scrollY<40))location.reload()}setInterval(tick,60000);document.addEventListener("visibilitychange",tick)})();</script>`;
      const css = `:root{--bg:#080b0d;--card:#111719;--bd:#26312d;--tx:#f2f6f4;--mu:#93a59b;--tr:#1a2420;--ca:${colA};--ka:${onColour(colA)};--cb:${colB};--kb:${onColour(colB)}}
body.light{--bg:#eef2ef;--card:#fff;--bd:#cbd8ce;--tx:#18221c;--mu:#53665a;--tr:#e3ebe5}
*{box-sizing:border-box}html{font-size:min(1.05vw,1.9vh)}
body{margin:0;height:100vh;height:100dvh;overflow:hidden;background:var(--bg);color:var(--tx);font-family:Arial,Helvetica,sans-serif;display:flex;flex-direction:column;padding:1rem 1.6rem max(1rem,24px);gap:.7rem}
.mbar{display:none}.mu{color:var(--mu)}.top,.hd,.ft,.upd,.r,.ttl{flex:none}
.ttl{text-align:center}.ttl p{margin:.25rem 0 0;color:var(--mu);font-size:1rem}
.vn a.dl{color:inherit;text-decoration:none}.vb{margin:.5rem 0 .2rem}.vb a.dbtn{display:inline-block;background:#2f6fd0;color:#fff;text-decoration:none;font-weight:700;font-size:1rem;line-height:1;padding:.7rem 1.3rem;border-radius:99px;box-shadow:0 1px 3px rgba(0,0,0,.25)}@media (min-width:900px) and (min-height:561px){.vb{display:none}.vn a.dl{pointer-events:none;cursor:default}}.top{text-align:center}.top .k{font-size:1.4rem;letter-spacing:.22em;text-transform:uppercase;color:var(--mu);font-weight:700}.top .dt{font-size:3.6rem;font-weight:700;line-height:1.05;margin:.15rem 0}.top .vn{font-size:1.8rem;color:var(--mu);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}${MWX_CSS}
.hd{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem}
.vs{font-size:2.2rem;font-weight:700;color:var(--mu)}
.tm{text-align:center;min-width:0}
.big{position:relative;display:flex;align-items:center;justify-content:center;width:8.5rem;height:8.5rem;border-radius:50%;margin:0 auto .6rem;background:#fff;border:.3rem solid var(--ca);overflow:hidden}
.tm.tb .big{border-color:var(--cb)}
.big .ini{font-size:2.6rem;font-weight:700;color:#333}.big img{position:absolute;inset:9%;width:82%;height:82%;object-fit:contain}
.nm{font-size:2.5rem;font-weight:700;line-height:1.1;overflow-wrap:anywhere}
.tag{display:inline-block;margin-top:.6rem;font-size:1.2rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:.25rem 1.4rem;border-radius:99px}
.tm.ta .tag{background:var(--ca);color:var(--ka)}.tm.tb .tag{background:var(--cb);color:var(--kb)}
.bars{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:space-evenly}
.r{display:flex;align-items:center;gap:.8rem;width:100%}.r .t{flex:1 1 0;min-width:0}.r .c{flex:0 0 14rem}
.c{text-align:center;font-size:1.15rem}
.t{height:2.2rem;background:var(--tr);border-radius:.5rem;display:flex}.t.l{justify-content:flex-end}
.b{height:100%;display:flex;align-items:center;border-radius:.5rem;font-size:1.2rem;font-weight:700;padding:0 .8rem;min-width:3.4rem}
.t.l .b{background:var(--ca);color:var(--ka);justify-content:flex-start}
.t.rt .b{background:var(--cb);color:var(--kb);justify-content:flex-end}
.b.lo{opacity:.62}
.ft{display:grid;grid-template-columns:1fr 1fr;align-items:end;gap:1rem}
.fm{display:flex;flex-direction:column;gap:.35rem;justify-self:start;align-items:flex-start}.fm.fmr{justify-self:end;align-items:flex-end}
.fh{font-size:.95rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--mu)}
.fd{display:flex;gap:.5rem;padding-bottom:1.3rem}.fx{position:relative;display:inline-flex}.fx small{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:.35rem;font-size:.8rem;color:var(--mu);white-space:nowrap}
.dot{display:inline-flex;align-items:center;justify-content:center;width:1.9rem;height:1.9rem;border-radius:.4rem;font-size:1rem;font-weight:700;color:#fff}.dot.W{background:#1f7a43}.dot.D{background:#a87a14}.dot.L{background:#8a2f2f}
.dot.new{box-shadow:0 0 0 .14rem var(--bg),0 0 0 .27rem var(--tx)}
.upd{text-align:center;font-size:.85rem;color:var(--mu)}
.h2h{flex:none;text-align:center}.hh{display:flex;flex-wrap:wrap;justify-content:center;gap:.3rem 1.8rem;margin-top:.3rem}.hc{font-size:1.15rem;color:var(--mu)}.hc small{margin-right:.6rem;font-size:.9rem}.hc .w{color:var(--tx);font-weight:700}
.h2h{display:flex;flex-direction:column;gap:.45rem}.h2h .fh{text-align:center}
.hsp{display:flex;gap:.2rem;height:2.3rem}.hsp .s{display:flex;align-items:center;justify-content:center;font-size:1.15rem;font-weight:700;border-radius:.4rem;overflow:hidden;white-space:nowrap;min-width:0}.hsp .s.wa{background:var(--ca);color:var(--ka)}.hsp .s.wb{background:var(--cb);color:var(--kb)}.hsp .s.wd{background:#7a6a2a;color:#fff}
.hts{display:flex;gap:.9rem;justify-content:center}.tj{flex:1 1 0;max-width:15rem;min-width:0;border-radius:.6rem;padding:.4rem 1rem .45rem;text-align:center}.tj small{display:block;font-size:.85rem;opacity:.85}.tj b{display:block;font-size:1.9rem;line-height:1.1;white-space:nowrap}.tj em{display:block;font-style:normal;font-size:.85rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-top:.2rem}
.tj.wa{background:var(--ca);color:var(--ka)}.tj.wb{background:var(--cb);color:var(--kb)}.tj.wd{background:#7a6a2a;color:#fff}
@media(min-width:801px) and (min-height:561px){body.hx{gap:.35rem;padding-top:.5rem;padding-bottom:max(.9rem,24px)}body.hx .big{width:6rem;height:6rem;margin-bottom:.3rem}body.hx .big .ini{font-size:2rem}body.hx .nm{font-size:2rem}body.hx .tag{margin-top:.3rem;font-size:1rem;padding:.15rem 1.1rem}body.hx .top .dt{font-size:3.2rem}body.hx .t{height:1.65rem}body.hx .b{font-size:1rem}body.hx .r .c{font-size:1rem}body.hx .hsp{height:1.8rem}body.hx .hsp .s{font-size:1rem}body.hx .tj{padding:.25rem .6rem .3rem}body.hx .tj b{font-size:1.6rem}body.hx .tj small,body.hx .tj em{font-size:.75rem}body.hx .hav{font-size:.95rem}body.hx .fd{padding-bottom:.9rem}}
.hav{text-align:center;color:var(--mu);font-size:1.05rem}.hav b{color:var(--tx)}.hall{display:none}
.note{margin:3rem auto;text-align:center;font-size:1.3rem;color:var(--mu)}
.cupchip{display:inline-block;margin-left:.8rem;font-size:.9rem;letter-spacing:.06em;font-weight:700;text-transform:none;color:#f0c85a;background:rgba(224,182,76,.12);border:1px solid rgba(224,182,76,.5);border-radius:99px;padding:.1rem .8rem;vertical-align:middle}body.light .cupchip{color:#8a5a00;background:rgba(224,182,76,.18)}
.cupnote{text-align:center;color:var(--mu);font-size:1.5rem;line-height:1.5;margin:auto}.cupnote b{display:block;font-size:1.1rem;letter-spacing:.18em;text-transform:uppercase;margin-bottom:.5rem}
a,button{touch-action:manipulation}
@media(max-width:800px),(max-height:560px){html{font-size:15px}
body{height:auto;overflow:visible;gap:.9rem;padding:max(.8rem,env(safe-area-inset-top)) max(1rem,env(safe-area-inset-right)) max(1.2rem,env(safe-area-inset-bottom)) max(1rem,env(safe-area-inset-left))}
.mbar{display:flex;justify-content:space-between;align-items:center}.mbar a,.mbar .tgl{color:var(--tx);text-decoration:none;font:700 14px Arial,Helvetica,sans-serif;background:var(--card);border:1px solid var(--bd);border-radius:99px;padding:8px 14px;cursor:pointer}
.top .k{font-size:1rem}.top .dt{font-size:2rem}.top .vn{font-size:1.1rem;-webkit-line-clamp:3}${MWX_CSS_PHONE}.vn a.dl{color:inherit;text-decoration:none}.vb{margin:.5rem 0 .2rem}.vb a.dbtn{display:inline-block;background:#2f6fd0;color:#fff;text-decoration:none;font-weight:700;font-size:1rem;line-height:1;padding:.7rem 1.3rem;border-radius:99px;box-shadow:0 1px 3px rgba(0,0,0,.25)}.vb a.dbtn{font-size:1.05rem}
.hd{grid-template-columns:1fr 1fr;gap:.8rem}.vs{display:none}
.big{width:6.2rem;height:6.2rem}.big .ini{font-size:1.8rem}.nm{font-size:1.35rem}.tag{font-size:.95rem;padding:.2rem 1.05rem}
.bars{justify-content:flex-start;gap:1rem}.r{flex-wrap:wrap;gap:.35rem .6rem}.r .c{order:-1;flex:0 0 100%}.r .t{flex:1 1 40%}.t{height:2.2rem}.b{font-size:1.05rem}
.fh{font-size:.8rem}
.hts{gap:.5rem}.tj{min-width:0;flex:1 1 0;padding:.35rem .4rem}.tj b{font-size:1.5rem}.tj small,.tj span,.tj em{font-size:.7rem}.tj.x4,.tj.x5{display:none}.hsp{height:2rem}.hsp .s{font-size:.95rem}
.hall{display:block;margin-top:.2rem}.hall summary{cursor:pointer;color:var(--tx);font-weight:700;text-align:center;padding:.5rem;border:1px solid var(--bd);border-radius:99px;background:var(--card);list-style:none}.hall summary::-webkit-details-marker{display:none}
.hsn{font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mu);margin:.7rem 0 .2rem;font-weight:700}.hrw{text-align:left;display:grid;grid-template-columns:1fr auto;gap:.6rem;align-items:center;padding:.3rem 0 .3rem .6rem;margin:.2rem 0;font-size:.95rem;border-left:.3rem solid #7a6a2a}.hrw.wa{border-color:var(--ca)}.hrw.wb{border-color:var(--cb)}.hrw small{display:block;color:var(--mu);font-size:.75rem}}
@media (max-height:560px) and (orientation:landscape){html{font-size:14px}.top .dt{font-size:1.6rem}.big{width:3.8rem;height:3.8rem}.big .ini{font-size:1.3rem}.nm{font-size:1.1rem}.hd{gap:.4rem}.tag{margin-top:.3rem}.t{height:1.8rem}.b{font-size:.95rem}}`;
      const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}"><title>Match Stats</title>
<style>${css}</style></head><body class="${theme}${m && Array.isArray(m.h2hAll) && m.h2hAll.length ? " hx" : ""}">${themeBoot('window.matchMedia("(max-width:800px),(max-height:560px)").matches')}<nav class="mbar"><a href="${e(menuHref)}">&lsaquo; Home</a><button type="button" class="tgl">Light mode</button></nav>
${inner}
${themeToggleScript}${colourScript}${refresh}<script>(function(){var H=document.documentElement,B=document.body,MQ="(min-width:801px) and (min-height:561px)";
// TV / big screen: if everything does not fit the screen height (short browser window, long venue name, extra head-to-head text, weather or crests that arrive a moment after the page), shrink the text a step at a time until it does, with a gap kept between the bar rows. It re-checks whenever the page changes size or content, so it cannot slip back to bunched-up bars.
function fsz(){return parseFloat(getComputedStyle(H).fontSize)||16}
function over(){var bars=document.querySelector(".bars");if(B.scrollHeight>B.clientHeight+1)return true;if(!bars)return false;var sum=0,k=bars.children.length;for(var i=0;i<k;i++)sum+=bars.children[i].getBoundingClientRect().height;
return bars.scrollHeight>bars.clientHeight+1||sum+k*.45*fsz()>bars.clientHeight}
var busy=false;function fit(){if(busy)return;busy=true;try{H.style.fontSize="";if(matchMedia(MQ).matches){var fs=fsz(),n=0;while(over()&&fs>7&&n++<80){fs-=.25;H.style.fontSize=fs+"px"}}}catch(e){}busy=false}
function check(){try{if(matchMedia(MQ).matches&&over())fit()}catch(e){}}
var tm;function later(){clearTimeout(tm);tm=setTimeout(check,120)}
fit();addEventListener("load",function(){fit();setTimeout(check,600)});addEventListener("resize",function(){clearTimeout(tm);tm=setTimeout(fit,150)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
document.addEventListener("load",later,true);
try{new MutationObserver(later).observe(B,{childList:true,subtree:true,characterData:true})}catch(e){}
try{var ro=new ResizeObserver(later);[".top",".hd",".bars",".h2h",".ft"].forEach(function(q){var e=document.querySelector(q);if(e)ro.observe(e)})}catch(e){}
setInterval(check,2000)})();</script></body></html>`;
      return new Response(page, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-cache" } });
    }

    // Fixtures and results: /?view=fixtures&team=..&competition=..&division=..  The whole season for one team.
    if (url.searchParams.get("view") === "fixtures") {
      const season = url.searchParams.get("season") || AUTO.season;
      const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      const competition = AUTO.competition || url.searchParams.get("competition") || "1699";
      const division = AUTO.division || url.searchParams.get("division") || "75791";
      const team = url.searchParams.get("team") || "11039";
      const e = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      const teamName = url.searchParams.get("teamName") || "__none__";
      const friendly = url.searchParams.get("friendlyName") || "";
      let d = null;
      try {
        const q = new URLSearchParams({season, competition, division, team, teamName, friendlyName: friendly, format: "summary", detail: "fixtures"});
        const r = await worker.fetch(new Request(url.origin + "/?" + q.toString()));
        if (!r.ok) throw new Error("HTTP " + r.status);
        d = await r.json();
      } catch (x) { d = null; }
      const games = d && Array.isArray(d.games) ? d.games : [];
      const multiComp = !!(d && d.multi);
      const compTag = g => multiComp ? ` &middot; <span class="ct${g.cup ? "" : " lg"}" title="${e(g.comp)}">${e(shortComp(g.comp))}</span>` : "";
      const done = games.filter(g => g.status === "done" || g.status === "void").sort((a, b) => a.iso < b.iso ? 1 : -1);
      const played = done.filter(g => g.status === "done");
      const nVoid = done.length - played.length;
      const up = games.filter(g => g.status !== "done" && g.status !== "void").sort((a, b) => a.iso < b.iso ? -1 : 1);
      const count = o => played.filter(g => g.outcome === o).length;
      const record = played.length ? `${multiComp ? "All competitions: " : ""}Played ${played.length} · Won ${count("W")} · Drawn ${count("D")} · Lost ${count("L")}${nVoid ? ` · Void ${nVoid}` : ""}` : "";
      const title = friendly || (d && d.team) || "Fixtures";
      const crest = (id, name) => `<span class="crest sm"><span class="ini">${e(initialsOf(name))}</span>${id ? `<img src="/api/crest?id=${encodeURIComponent(id)}" alt="" loading="lazy" onerror="this.remove()">` : ""}</span>`;
      const row = (g, isNext) => {
        const cls = g.status === "void" ? "v" : g.status === "done" ? (g.outcome === "W" ? "w" : g.outcome === "L" ? "l" : "d") : "u";
        const right = g.status === "void" ? `<span class="fs"><b class="vd">Void</b><i class="r v" title="Void: not played, not counted">V</i></span>` : g.status === "done"
          ? `<span class="fs"><b>${g.wo ? "W/O" : e(g.mineScore) + "–" + e(g.oppScore)}</b><i class="r ${cls}">${e(g.outcome)}</i></span>`
          : `<span class="fs"><span class="pend">${g.status === "pending" ? "Result awaited" : ""}</span></span>`;
        return `<div class="fx ${cls}${isNext ? " nx" : ""}"><span class="fd" title="${e(g.dateLabel)} ${e(g.year)}"><b>${e(g.dateLabel)}</b>${isNext ? "<em>Next</em>" : ""}</span>${crest(g.oppId, g.oppName)}<span class="fo"><b>${e(g.oppName)}</b><small>${g.home ? "Home" : "Away"}${compTag(g)}</small></span>${right}</div>`;
      };
      const firstUp = up.find(g => g.status === "upcoming");
      const upHtml = up.length ? up.map(g => row(g, g === firstUp)).join("") : `<div class="none">No upcoming fixtures found</div>`;
      const doneHtml = done.length ? done.map(g => row(g, false)).join("") : `<div class="none">No results yet</div>`;
      const body = d ? `<h2 class="gt">Upcoming</h2><div class="fxl">${upHtml}</div><h2 class="gt">Results</h2><div class="fxl">${doneHtml}</div>`
        : `<div class="none">Fixtures are not available right now. Please try again in a few minutes.</div>`;
      if (url.searchParams.get("layout") === "tv") {
        // TV board: the whole season in date order, split across two columns. Scores appear as games are played.
        const all = games.slice().sort((a, b) => a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0);
        const nextG = all.find(g => g.status === "upcoming");
        const perCol = Math.max(1, Math.ceil(all.length / 2));
        const S = await siteSettings();
        let bn = d && d.banner ? d.banner : null;
        if (bn && S.features.weather === false && bn.wx) bn = Object.assign({}, bn, { wx: null });
        const ar = S.features.around !== false && d && d.around && d.around.games && d.around.games.length ? d.around : null;
        const nt = tvNoticeFor(S, url, isDev === true);
        const rh = Math.min(9.5, (80 - (bn ? 16.5 : 0) - (ar ? 12.5 : 0) - (nt ? 6.6 : 0)) / perCol);
        const bCrest = (id, name) => `<span class="bc"><span>${e(initialsOf(name))}</span>${id ? `<img src="/api/crest?id=${encodeURIComponent(id)}" alt="" onerror="this.remove()">` : ""}</span>`;
        const posTag = bn && bn.opp.position ? `<span>${e(ordinalOf(bn.opp.position))}</span>` : "";
        const bannerHtml = !bn ? "" : bn.mode === "last"
          ? `<div class="ban last ${bn.outcome === "W" ? "w" : bn.outcome === "L" ? "l" : "d"}" style="grid-template-columns:1.3fr 1fr"><div><p class="bl">Last game</p><div class="bt">${bCrest(bn.opp.id, bn.opp.name)}<div style="min-width:0"><div class="bn">${e(bn.opp.name)}</div><div class="tg">${posTag}<span>${e(bn.tag)}</span></div></div></div></div><div><p class="bl">${e(bn.label)}</p><div class="bs">${e(bn.score)}<i class="${bn.outcome === "W" ? "w" : bn.outcome === "L" ? "l" : "d"}">${e(bn.outcome)}</i></div><div class="bd">${e(bn.text)}</div></div></div>`
          : `<div class="ban next" style="grid-template-columns:${bn.wx && bn.wx.status === "ok" ? "1.3fr 1fr 1.1fr" : "1.3fr 1fr"}"><div><p class="bl">Next game</p><div class="bt">${bCrest(bn.opp.id, bn.opp.name)}<div style="min-width:0"><div class="bn">${e(bn.opp.name)}</div><div class="tg">${posTag}<span>${e(bn.tag)}</span></div></div></div></div><div><p class="bl">Game day</p><div class="bw">${e(bn.when)}</div><div class="bd">${e(bn.dateFull)}</div></div>${bn.wx && bn.wx.status === "ok" ? `<div><p class="bl">Forecast for the day</p><div class="bwx"><span class="ic">${bn.wx.icon}</span><div><b>${e(bn.wx.headline)}</b><small>${bn.wx.temp}&deg;C &middot; ${bn.wx.rain}% rain &middot; ${e(bn.wx.windWord)}</small></div></div></div>` : ""}</div>`;
        const tvRow = g => {
          const cls = g.status === "void" ? "v" : g.status === "done" ? (g.outcome === "W" ? "w" : g.outcome === "L" ? "l" : "d") : "u";
          const right = g.status === "void" ? `<span class="fs"><b class="vd">Void</b><i class="r v">V</i></span>` : g.status === "done" ? `<span class="fs"><b>${g.wo ? "W/O" : e(g.mineScore) + "–" + e(g.oppScore)}</b><i class="r ${cls}">${e(g.outcome)}</i></span>` : (g.status === "pending" ? `<span class="fs"><span class="pend">Awaited</span></span>` : `<span class="fs"><span class="pend">To play</span></span>`);
          return `<div class="fx ${cls}${g === nextG ? " nx" : ""}${g.status === "done" || g.status === "void" ? " pd" : ""}"><span class="fd"><b>${e(g.dateLabel)}</b></span>${crest(g.oppId, g.oppName)}<span class="fo"><b>${e(g.oppName)}</b><small>${g.home ? "Home" : "Away"}${compTag(g)}</small></span>${right}</div>`;
        };
        const aShort = n => plainClub(String(n || "")).replace(/\s+(U\s*\d{1,2}'?s?|Under\s*\d{1,2}'?s?|\d+(st|nd|rd|th)\s*XV|XV|1XV|2XV|Women|Ladies|Girls)$/i, "").trim() || String(n || "");
        const clubShort = aShort((d && d.clubName) || clubOf(title)), clubTxt = String(url.searchParams.get("club") || "").trim() || (/rfc|rugby|chiefs|albion|saracens|rfu/i.test(clubShort) ? clubShort : clubShort + " RFC");
        const aCell = g => { const hw = g.wo ? g.win === "home" : g.hs > g.as, aw = g.wo ? g.win === "away" : g.as > g.hs; return `<div class="ag"><span class="ah${g.wo ? (S.features.wocolour === false ? (hw ? " wn" : "") : (hw ? " wow" : " wol")) : hw ? " wn" : ""}">${e(aShort(g.home))}</span><b>${g.wo ? "W/O" : e(g.hs) + "&ndash;" + e(g.as)}</b><span class="aa${g.wo ? (S.features.wocolour === false ? (aw ? " wn" : "") : (aw ? " wow" : " wol")) : aw ? " wn" : ""}">${e(aShort(g.away))}</span></div>`; };
        const aroundHtml = ar ? `<div class="arn"><p class="bl">Around the league today${ar.toCome ? ` &middot; ${e(ar.toCome)} still to come` : ""}</p><div class="agrid">${ar.games.map(aCell).join("")}</div></div>` : "";
        const colA = all.slice(0, perCol).map(tvRow).join(""), colB = all.slice(perCol).map(tvRow).join("");
        const tvBody = d ? (all.length ? `<div class="cols"><div class="col">${colA}</div><div class="col">${colB}</div></div>` : `<div class="none big">No fixtures found</div>`) : `<div class="none big">Fixtures are not available right now</div>`;
        const tv = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)} season fixtures</title>
<style>
${MENU_CSS}
html,body{height:100%}body{overflow:hidden;padding:2.2vh 2.2vw 3.6vh;display:flex;flex-direction:column}
.hd{display:flex;align-items:center;justify-content:space-between;gap:2vw;height:9vh}.hl{display:flex;align-items:center;gap:1.6vw;flex:0 0 auto}.hd h1{margin:0;font-size:4.6vh;line-height:1.05;white-space:nowrap}.tn{display:block;font-size:3vh;line-height:1.2;color:#c5d1ca;white-space:nowrap}body.light .tn{color:#33443a}.hd p{margin:0;font-size:2.1vh;line-height:1.3;color:#91a49a;text-align:right;flex:1;min-width:0}.crest.hdc{width:8vh;height:8vh;flex-basis:8vh}.crest.hdc .ini{font-size:2.6vh}.crest.hdc img{padding:.7vh}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:2.2vw;flex:1;min-height:0;margin-top:1.4vh;align-content:start}.col{display:flex;flex-direction:column;gap:.8vh;min-width:0}
.fx{--rh:${rh};height:calc(var(--rh) * 1vh - .8vh);display:flex;align-items:center;gap:1.2vw;background:#111719;border:1px solid #26312d;border-left:.7vh solid #4a5a52;border-radius:1.2vh;padding:0 1.2vw;font-size:calc(var(--rh) * .36vh)}
.fx.w{border-left-color:#2f9e5b}.fx.l{border-left-color:#d9534f}.fx.d{border-left-color:#e0a82e}.fx.nx{box-shadow:0 0 0 .35vh #7fd89a}
.fd{flex:0 0 6.4em;color:#f5f7f6}.fd b{font-size:1em}
.crest.sm{width:calc(var(--rh) * .66vh);height:calc(var(--rh) * .66vh);flex-basis:calc(var(--rh) * .66vh)}.crest.sm .ini{font-size:calc(var(--rh) * .24vh)}.crest.sm img{padding:.4vh}
.fo{flex:1;min-width:0;line-height:1.15}.fo b{display:block;font-size:1.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fo small .ct{font-size:.86em;letter-spacing:.02em}.fo small{color:#91a49a;font-size:.62em;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:1.6;margin:-.12em 0;display:flex;align-items:center;min-width:0}.fo small .ct:not(.lg){flex:0 1 auto;min-width:0;vertical-align:baseline}.ct{color:#f0c85a;font-weight:700}.ct:not(.lg){background:rgba(224,182,76,.16);border:1px solid rgba(224,182,76,.45);border-radius:99px;padding:.06em .45em;margin-left:.05em;letter-spacing:0;font-size:9.5px;display:inline-block;max-width:100%;box-sizing:border-box;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ct.lg{color:#91a49a;font-weight:400}body.light .ct{color:#7a4f00}body.light .ct:not(.lg){background:#fff3d0;border-color:#c99a2e}body.light .ct.lg{color:#53665a}.fx.v{border-left-color:#7a6a2a}.vd{color:#c9b36a;font-weight:700}.r.v{background:#6b5f33}
.fs{flex:0 0 auto;display:flex;align-items:center;gap:.8vw}.fs b{font-size:1.15em}.pend{font-size:.7em;color:#91a49a}
.r{font-style:normal;font-weight:700;font-size:.7em;width:1.7em;height:1.7em;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;background:#4a5a52}.r.w{background:#2f9e5b}.r.l{background:#d9534f}.r.d{background:#c58f1c}
.none.big{font-size:3vh;color:#91a49a;margin:auto}
body.light .fx{background:#fff;border-color:#cbd8ce}body.light .fd{color:#17211c}body.light .hd p,body.light .fo small,body.light .pend{color:#53665a}body.light .fx.nx{box-shadow:0 0 0 .35vh #1b7f3b}
${BANNER_CSS}
:root{--b1:#3fb865;--b2:#e0b64c;--bg1:#103a25}
body:not(.light){background:radial-gradient(130vh 80vh at 100% 100%,var(--bg1) 0%,#070d0a 60%)!important}
body::before{content:"";position:fixed;left:0;top:0;bottom:0;width:.9vw;background:linear-gradient(180deg,var(--b1),var(--b2));z-index:6}
.ban.next{border-color:var(--b1)}.fx.nx{box-shadow:0 0 0 .35vh var(--b1)}body.light .fx.nx{box-shadow:0 0 0 .35vh var(--b1)}
.rt{text-align:right;line-height:1.1;flex:0 0 auto}.rt b{display:block;font-size:3.4vh;letter-spacing:.14em;text-transform:uppercase;color:var(--b2)}.rt em{display:block;font-style:normal;font-size:3.6vh;font-weight:800;color:#fff;margin-top:.4vh}.rt span{display:block;font-size:2vh;color:#a9c4b2;margin-top:.3vh}
body.light .rt b{color:var(--b1)}body.light .rt em{color:#14301e}body.light .rt span{color:#53665a}
.ftl{position:fixed;left:2.2vw;bottom:.8vh;font-size:1.6vh;color:#5f7769;letter-spacing:.06em;z-index:5}body.light .ftl{color:#63746a}
.arn{flex:none;height:11.3vh;margin-top:1.2vh;background:#111719;border:1px solid #26312d;border-radius:1.6vh;padding:1vh 1.4vw;overflow:hidden}.arn .bl{font-size:1.6vh;letter-spacing:.12em;text-transform:uppercase;color:#91a49a;margin:0 0 .8vh}.agrid{display:grid;grid-template-columns:repeat(4,1fr);gap:.6vh 1.6vw}.ag{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:.7vw;font-size:2.3vh;min-width:0}.ag span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#a9b8af}.ag .ah{text-align:right}.ag span.wn{color:#f5f7f6;font-weight:800}.ag span.wow{color:#5fdc86;font-weight:800}.ag span.wol{color:#ee6b66;font-weight:800}.ag b{font-size:1.05em;background:#1d2b36;border-radius:.8vh;padding:.1em .5em;color:#fff}body.light .arn{background:#fff;border-color:#cbd8ce}body.light .arn .bl,body.light .ag span{color:#53665a}body.light .ag span.wn{color:#14301e}body.light .ag span.wow{color:#1b7f3b}body.light .ag span.wol{color:#c0302b}body.light .ag b{background:#dcebf6;color:#1d3a50}
</style></head><body class="${theme}"><div class="hd"><div class="hl">${crest(team, title).replace("crest sm", "crest hdc")}<div class="tt"><h1>${e(season)} Season Fixtures</h1><span class="tn">${e(title)}</span></div></div><div class="rt"><b>${e(clubTxt)}</b><em id="sbclk"></em><span id="sbdt"></span></div></div>
${nt ? tvNoticeHtml(nt, true) : ""}
${bannerHtml}
${tvBody}
${aroundHtml}
${S.features.checked === false ? "" : `<div class="ftl">Data from the RFU fixtures feed &middot; last checked ${e(londonTime(Number(d && d.updatedAt) || Date.now()))}</div>`}
${TV_BRAND_SCRIPT.replace("__OV__", hexParam(url.searchParams.get("colour"))).replace("__ID__", encodeURIComponent(String(team || "")))}
<script>(function(){var MAX=${liveDataSeconds() * 1000},t0=Date.now();setInterval(function(){if(Date.now()-t0>=MAX&&document.visibilityState==="visible")location.reload()},60000)})();</script>
</body></html>`;
        return new Response(tv, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-cache" } });
      }
      const calPath = "/calendar.ics?" + new URLSearchParams({season, competition, division, team, teamName, friendlyName: friendly}).toString();
      const matchHref = "/?" + new URLSearchParams({view: "match", season, competition, division, team, teamName, friendlyName: friendly, theme}).toString();
      const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}"><title>${e(title)} fixtures and results</title>
<style>
${MENU_CSS}
.cal{display:flex;gap:8px;margin:0 0 4px}
.ph{display:flex;align-items:center;gap:12px;margin:8px 0 6px}.ph h1{margin:0;font-size:21px}.ph .tn{display:block;font-size:16px;color:#c5d1ca;margin-top:2px}body.light .ph .tn{color:#33443a}.crest.hdc{width:52px;height:52px;flex-basis:52px}.crest.hdc .ini{font-size:16px}.crest.hdc img{padding:5px}
.gt{margin-top:22px}.fxl{display:flex;flex-direction:column;gap:8px}
.fx{display:flex;align-items:center;gap:10px;background:#111719;border:1px solid #26312d;border-left:5px solid #4a5a52;border-radius:12px;padding:10px 12px}
.fx.w{border-left-color:#2f9e5b}.fx.l{border-left-color:#d9534f}.fx.d{border-left-color:#e0a82e}.fx.nx{box-shadow:0 0 0 2px #7fd89a}
.fd{flex:0 0 84px;font-size:13px;color:#91a49a}.fd b{display:block;color:#f5f7f6;font-size:14px}.fd em{display:inline-block;margin-top:3px;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7fd89a}
.crest.sm{width:34px;height:34px}.crest.sm .ini{font-size:12px}.crest.sm img{padding:3px}
.fo{flex:1;min-width:0}.fo b{display:block;font-size:15px;overflow-wrap:anywhere}.fo small{color:#91a49a;font-size:12px;text-transform:uppercase;letter-spacing:.06em}.ct:not(.lg){display:inline-block;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}.ct{color:#f0c85a;font-weight:700}.ct:not(.lg){background:rgba(224,182,76,.16);border:1px solid rgba(224,182,76,.45);border-radius:99px;padding:.02em .4em;margin-left:.05em;letter-spacing:0;font-size:9.5px}.ct.lg{color:#91a49a;font-weight:400}body.light .ct{color:#7a4f00}body.light .ct:not(.lg){background:#fff3d0;border-color:#c99a2e}body.light .ct.lg{color:#53665a}.fx.v{border-left-color:#7a6a2a}.vd{color:#c9b36a;font-weight:700}.r.v{background:#6b5f33}
.fs{flex:0 0 auto;display:flex;align-items:center;gap:8px;text-align:right}.fs b{font-size:17px}.pend{font-size:13px;color:#91a49a}
.r{font-style:normal;font-weight:700;font-size:12px;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;background:#4a5a52}.r.w{background:#2f9e5b}.r.l{background:#d9534f}.r.d{background:#c58f1c}
.none{color:#91a49a;font-size:14px;padding:10px 2px}.pl{display:flex;gap:8px}
body.light .fx{background:#fff;border-color:#cbd8ce}body.light .fd b{color:#17211c}body.light .fd,body.light .fo small,body.light .pend,body.light .none{color:#53665a}body.light .fd em{color:#1b7f3b}body.light .fx.nx{box-shadow:0 0 0 2px #1b7f3b}
@media (max-width:420px){.fd{flex-basis:70px}.fx{gap:8px;padding:9px 10px}}
</style></head><body class="${theme}">${themeBoot("true")}<div class="wrap">
<nav class="mbar"><span class="pl"><a class="pill" href="/?theme=${theme}">&lsaquo; Home</a><a class="pill" href="${e(matchHref)}">Next Match Stats</a></span><button type="button" class="pill tgl">Light mode</button></nav>
<div class="ph">${crest(team, title).replace("crest sm", "crest hdc")}<div><h1>${e(season)} Season Fixtures</h1><span class="tn">${e(title)}</span></div></div><p class="sub">${d && d.league ? e(d.league) : ""}${record ? (d && d.league ? "<br>" : "") + e(record) : ""}</p>
<div class="cal"><a class="pill" href="${e(calPath)}">Add to calendar</a></div>
${body}
<p class="ver">${VERSION_LABEL}</p>
</div>
${themeToggleScript}
</body></html>`;
      return new Response(page, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-cache" } });
    }

    // League leaders: /?view=leaders&team=..&competition=..&division=..  Best attack, defence, points difference and bonus points
    // in this team's division, from the live league table, with this team's rank. Add &layout=tv for the full-screen board.
    if (url.searchParams.get("view") === "leaders") {
      const season = url.searchParams.get("season") || AUTO.season;
      const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      const competition = AUTO.competition || url.searchParams.get("competition") || "1699";
      const division = AUTO.division || url.searchParams.get("division") || "75791";
      const team = url.searchParams.get("team") || "11039";
      const e = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      const teamName = url.searchParams.get("teamName") || "__none__";
      const friendly = url.searchParams.get("friendlyName") || "";
      let d = null;
      try {
        const q = new URLSearchParams({season, competition, division, team, teamName, friendlyName: friendly, format: "summary", detail: "leaders"});
        const r = await worker.fetch(new Request(url.origin + "/?" + q.toString()));
        if (!r.ok) throw new Error("HTTP " + r.status);
        d = await r.json();
      } catch (x) { d = null; }
      const L = d && d.leaders && Array.isArray(d.leaders.metrics) ? d.leaders : null;
      const title = friendly || (d && d.team) || "League leaders";
      const leagueName = (d && d.league) || "";
      const trophy = `<span class="crest hdc trophy"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v6a5 5 0 0 1-10 0V3z" fill="#14532d"/><path d="M7 5H3.5v2.2A3.3 3.3 0 0 0 7 10.5V9a1.8 1.8 0 0 1-1.8-1.8V6.5H7zM17 5h3.5v2.2a3.3 3.3 0 0 1-3.5 3.3V9a1.8 1.8 0 0 0 1.8-1.8V6.5H17z" fill="#14532d"/><rect x="10.7" y="13.5" width="2.6" height="4" fill="#14532d"/><rect x="7.5" y="17.5" width="9" height="2.6" rx="1.3" fill="#14532d"/></svg></span>`;
      const crest = (id, name, cls) => `<span class="crest ${cls || "sm"}"><span class="ini">${e(initialsOf(name))}</span>${id ? `<img src="/api/crest?id=${encodeURIComponent(id)}" alt="" loading="lazy" onerror="this.remove()">` : ""}</span>`;
      const youTxt = m => m.you ? `${e(title)}: currently <b>${m.you.joint ? "joint " : ""}${e(ordinalOf(m.you.rank))}</b>, ${e(m.you.phrase || m.you.value)}` : "";
      const card = m => `<div class="lc"><label>${e(m.label)}</label><div class="lt">${m.leaderId ? crest(m.leaderId, m.leaderName) : `<span class="crest sm"><span class="ini">${m.leaderName.split(" ")[0]}</span></span>`}<div class="lnm"><b class="ln">${e(m.leaderName)}</b><small>${e(m.unit)}</small>${m.leaderNames && m.leaderNames.length ? `<small class="lnames">${e(m.leaderNames.join(", "))}</small>` : ""}</div><span class="lval">${e(m.value)}</span></div>${m.you ? `<div class="you">${youTxt(m)}</div>` : ""}</div>`;
      const cards = L ? L.metrics.map(card).join("") : "";
      const note = L && L.early ? "Early in the season some clubs have played only a few games." : "";
      const none = d ? `<div class="none big">No games played yet</div>` : `<div class="none big">League leaders are not available right now. Please try again in a few minutes.</div>`;
      const CARD_CSS = `.lc{background:#111719;border:1px solid #26312d;border-radius:12px;padding:14px 16px}.lc label{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a9b8af;margin-bottom:10px}.lt{display:flex;align-items:center;gap:12px}.lnm{flex:1;min-width:0}.ln{display:block;font-size:17px;overflow-wrap:anywhere}.lnm small{display:block;color:#91a49a;font-size:12px;margin-top:2px}.lnm .lnames{color:#b4c4bb;margin-top:5px;line-height:1.35}body.light .lnm .lnames{color:#33443a}.lval{font-size:26px;font-weight:900;color:#7fd89a}.you{margin-top:10px;padding-top:9px;border-top:1px solid #26312d;font-size:13px;color:#b4c4bb}.you b{color:#f5f7f6}.crest.sm .ini{font-size:12px}body.light .lc{background:#fff;border-color:#cbd8ce}body.light .you{border-top-color:#e0e7e1;color:#53665a}body.light .you b{color:#17211c}body.light .lval{color:#1b7f3b}body.light .lnm small,body.light .lc label{color:#53665a}`;
      if (url.searchParams.get("layout") === "tv") {
        const tv = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>League leaders${leagueName ? " - " + e(leagueName) : ""}</title>
<style>
${MENU_CSS}
html,body{height:100%}body{overflow:hidden;padding:2.2vh 2.2vw 3.6vh;display:flex;flex-direction:column}
.hd{display:flex;align-items:center;justify-content:space-between;gap:2vw;height:9vh}.hl{display:flex;align-items:center;gap:1.6vw;flex:0 0 auto}.hd h1{margin:0;font-size:4.6vh;line-height:1.05;white-space:nowrap}.tn{display:block;font-size:3vh;line-height:1.2;color:#c5d1ca;white-space:nowrap}body.light .tn{color:#33443a}.hd p{margin:0;font-size:2.1vh;line-height:1.3;color:#91a49a;text-align:right;flex:1;min-width:0}.crest.hdc{width:8vh;height:8vh;flex-basis:8vh}.crest.hdc .ini{font-size:2.6vh}.crest.hdc img{padding:.7vh}
.crest.trophy svg{width:62%;height:62%}.lc{background:#111719;border:1px solid #26312d}.lc label{display:block;text-transform:uppercase;letter-spacing:.08em}.lt{display:flex;align-items:center}.lnm{flex:1;min-width:0}.ln{display:block;color:#f5f7f6}body.light .ln{color:#17211c}.lnm small{display:block;color:#91a49a}.lval{font-weight:900;color:#7fd89a}.you{border-top:1px solid #26312d;color:#b4c4bb}.you b{color:#f5f7f6}
.lg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:2.2vh 2.2vw;flex:1;min-height:0;margin-top:1.6vh}
.lc{display:flex;flex-direction:column;justify-content:center;min-width:0;min-height:0;overflow:hidden;border-radius:1.6vh;padding:2vh 2vw}.lc label{font-size:2.3vh;margin-bottom:2vh;color:#b8c8bf}.lt{gap:1.4vw}.crest.sm{width:9vh;height:9vh;flex-basis:9vh}.crest.sm .ini{font-size:3vh}.crest.sm img{padding:.8vh}
.ln{font-size:4vh;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lnm small{font-size:2.2vh;margin-top:.4vh}.lnm .lnames{font-size:2.3vh;margin-top:.8vh;line-height:1.3;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.lval{font-size:8vh;line-height:1}.you{margin-top:2.2vh;padding-top:1.8vh;font-size:2.8vh}
.foot2{position:absolute;left:2.2vw;bottom:1.2vh;font-size:1.8vh;color:#7d8c84}.none.big{font-size:3vh;color:#91a49a;margin:auto}
${CARD_CSS.split("}").filter(x => /body\.light/.test(x)).map(x => x + "}").join("")}
</style></head><body class="${theme}"><div class="hd"><div class="hl">${trophy}<div class="tt"><h1>League Leaders</h1><span class="tn">${e(leagueName)}</span></div></div><p>${note ? e(note) : ""}</p></div>
${L ? `<div class="lg">${cards}</div>` : none}
<script>(function(){var MAX=${REFRESH_SECONDS * 1000},t0=Date.now();setInterval(function(){if(Date.now()-t0>=MAX&&document.visibilityState==="visible")location.reload()},60000)})();</script>
</body></html>`;
        return new Response(tv, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-cache" } });
      }
      const matchHref = "/?" + new URLSearchParams({view: "match", season, competition, division, team, teamName, friendlyName: friendly, theme}).toString();
      const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}"><title>League leaders${leagueName ? " - " + e(leagueName) : ""}</title>
<style>
${MENU_CSS}
.ph{display:flex;align-items:center;gap:12px;margin:8px 0 6px}.ph h1{margin:0;font-size:21px}.ph .tn{display:block;font-size:16px;color:#c5d1ca;margin-top:2px}body.light .ph .tn{color:#33443a}.crest.hdc{width:52px;height:52px;flex-basis:52px}.crest.hdc .ini{font-size:16px}.crest.hdc img{padding:5px}
.crest.trophy svg{width:62%;height:62%}.lcl{display:flex;flex-direction:column;gap:10px;margin-top:14px}.ln{color:#f5f7f6}body.light .ln{color:#17211c}.none{color:#91a49a;font-size:14px;padding:10px 2px}.pl{display:flex;gap:8px}.nt{font-size:12px;color:#7d8c84;margin:12px 2px 0}
${CARD_CSS}
</style></head><body class="${theme}">${themeBoot("true")}<div class="wrap">
<nav class="mbar"><span class="pl"><a class="pill" href="/?theme=${theme}">&lsaquo; Home</a><a class="pill" href="${e(matchHref)}">Next Match Stats</a></span><button type="button" class="pill tgl">Light mode</button></nav>
<div class="ph">${trophy}<div><h1>League Leaders</h1><span class="tn">${e(leagueName)}</span></div></div>
${L ? `<div class="lcl">${cards}</div>${note ? `<p class="nt">${e(note)}</p>` : ""}` : `<div class="none">${d ? "No games played yet" : "League leaders are not available right now. Please try again in a few minutes."}</div>`}
<p class="ver">${VERSION_LABEL}</p>
</div>
${themeToggleScript}
</body></html>`;
      return new Response(page, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-cache" } });
    }

    // Opposition report: /?view=opposition&team=..&competition=..&division=..  The next opponent's record, trend, close games,
    // common opponents, rest and bonus points, from league results. Mobile by default; &layout=wide for a wide-screen grid.
    // Deliberately has no TV layout.
    if (url.searchParams.get("view") === "opposition") {
      const season = url.searchParams.get("season") || AUTO.season;
      const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      const competition = AUTO.competition || url.searchParams.get("competition") || "1699";
      const division = AUTO.division || url.searchParams.get("division") || "75791";
      const team = url.searchParams.get("team") || "11039";
      const wide = url.searchParams.get("layout") === "wide";
      const e = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      const teamName = url.searchParams.get("teamName") || "__none__";
      const friendly = url.searchParams.get("friendlyName") || "";
      let d = null;
      try {
        // v3.8: if the next game (any competition) is a cup game, the report is about that game, read from the cup's own data.
        const cupG = await cupNextGame(worker, url.origin, {season, competition, division, team, teamName, friendlyName: friendly});
        const cupOk = cupG && cupG.competition && cupG.division;
        const cupNoIds = cupG && !cupOk ? cupG : null; // v3.22.1: cup game with no competition/division from the RFU: no report possible
        const q = new URLSearchParams({season, competition: cupOk ? cupG.competition : competition, division: cupOk ? cupG.division : division, team, teamName, friendlyName: friendly, format: "summary", detail: "opposition"});
        let r = cupOk ? await worker._main(new Request(url.origin + "/?" + q.toString()), isDev, { auto: false, season, competition: String(cupG.competition), division: String(cupG.division), banner: "" }) : await worker.fetch(new Request(url.origin + "/?" + q.toString()));
        if (!r.ok) throw new Error("HTTP " + r.status);
        d = await r.json();
        if (cupOk && d && d.status === "ok") d.cupName = cupG.comp;
        else if (cupOk) { // the cup data had no usable next game: fall back to the league game
          const q2 = new URLSearchParams({season, competition, division, team, teamName, friendlyName: friendly, format: "summary", detail: "opposition"});
          r = await worker.fetch(new Request(url.origin + "/?" + q2.toString()));
          if (r.ok) d = await r.json();
        }
        if (cupNoIds) d = { status: "cup", team: d && d.team || "", league: d && d.league || "", cupOpp: cupNoIds.oppName, cupComp: cupNoIds.comp };
      } catch (x) { d = null; }
      const ok = d && d.status === "ok";
      const f1 = x => x === null || x === undefined ? "—" : String(x);
      const wdl = r0 => r0.w + "–" + r0.d + "–" + r0.l;
      const arrow = (a, b) => a === null || b === null ? "" : a - b >= 1 ? "&#9650; " : b - a >= 1 ? "&#9660; " : "";
      let cards = "", waHref = "", groundBtn = "", groundLine = ""; const C = {};
      if (ok) {
        const on = e(d.opp.name), me = e(d.team);
        const v = d.venue, hv = v.oppHome ? "home" : "away";
        C.venue = `<div class="card"><h2>${on} ${v.oppHome ? "at home" : "away from home"} (playing them at ${v.oppHome ? "their" : "your"} ground)</h2>` + (v.n ? `<div class="big"><div><b>${e(wdl(v.record))}</b><span>W &ndash; D &ndash; L</span></div><div><b>${f1(v.scored)}</b><span>Scored / game</span></div><div><b>${f1(v.conceded)}</b><span>Conceded / game</span></div></div><p class="note">Over ${d.games === 1 ? "their only game" : "all " + d.games + " of their games"}, ${on} average <b>${f1(v.allScored)} scored, ${f1(v.allConceded)} conceded</b> per game.${v.n < 3 ? ` Only ${v.n} ${hv} game${v.n === 1 ? "" : "s"} so far, so treat it as a guide.` : ""}</p>` : `<p class="note">No ${hv} games played yet.</p>`) + `</div>`;
        if (d.trend) {
          const t = d.trend;
          const cmp = (now, avgv, word) => { const df = Math.round((now - avgv) * 10) / 10; const same = Math.abs(df) < 2; return { v: same ? "&#9644; About the same" : (df > 0 ? "&#9650; MORE" : "&#9660; LESS") + " than their average", s: same ? "within 2 points of their season average" : (df > 0 ? "+" : "−") + Math.abs(df) + " points per game v their season average" }; };
          const sc2 = cmp(t.scored, t.seasonScored), cc2 = cmp(t.conceded, t.seasonConceded);
          C.trend = `<div class="card"><h2>${on}: last 3 games v their own season average</h2><div class="trend"><div><label>${on} scoring</label><b>${f1(t.scored)} <small class="inl">per game, last 3</small></b><em>${sc2.v}</em><small>${sc2.s}. Season average ${f1(t.seasonScored)}.</small></div><div><label>${on} conceding</label><b>${f1(t.conceded)} <small class="inl">per game, last 3</small></b><em>${cc2.v}</em><small>${cc2.s}. Season average ${f1(t.seasonConceded)}.</small></div></div><p class="note">All figures are ${on}'s, not ${me}'s.</p></div>`;
        }
        const c = d.close;
        C.close = `<div class="card"><h2>${on}: close and heavy games</h2><div class="row"><span>Their games decided by 7 or fewer</span><b>${c.close} of ${d.games}</b></div><div class="row"><span>Their biggest win</span><b>${e(c.bigWin || "—")}</b></div><div class="row"><span>Their heaviest defeat</span><b>${e(c.worstDefeat || "—")}</b></div><div class="row"><span>They scored 30+ / conceded 30+</span><b>${c.scored30} of ${d.games} &middot; ${c.conceded30} of ${d.games}</b></div></div>`;
        if (d.last.length) C.last = `<div class="card"><h2>${on}: last ${d.last.length === 1 ? "result" : d.last.length + " results"}</h2>${d.last.map(g => `<div class="bar"><span class="d">${e(g.dateLabel)}</span><span class="o">v ${e(g.vs)} (${g.home ? "H" : "A"})</span><span class="chip ${g.out === "W" ? "w" : g.out === "L" ? "l" : "d2"}">${g.out} ${e(g.score)}</span></div>${d.multi ? `<div class="cpl">${e(g.comp)}</div>` : ""}`).join("")}<p class="note">W / D / L and the score are from ${on}'s point of view (their score first). H = ${on} at home, A = away.</p></div>`;
        if (d.common.length) C.common = `<div class="card"><h2>Common opponents</h2><table><tr><th>Opponent</th><th>${on}</th><th>${me}</th></tr>${d.common.map(z => { const fm = m => (m > 0 ? "W +" + m : m < 0 ? "L −" + (-m) : "D 0"); const cl = m => m > 0 ? "up" : m < 0 ? "dn" : "am"; return `<tr><td>${e(z.name)}</td><td class="${cl(z.opp)}">${fm(z.opp)}</td><td class="${cl(z.you)}">${fm(z.you)}</td></tr>`; }).join("")}</table><p class="note">Each club's result against the same opponent: W + is won by that many points, L \u2212 is lost by that many. A loose guide only.</p></div>`;
        if (d.rest) C.rest = `<div class="card"><h2>${on}: rest and workload</h2><div class="row"><span>They last played</span><b>${e(d.rest.lastLabel)}</b></div><div class="row"><span>Days between that game and yours</span><b>${d.rest.days} day${d.rest.days === 1 ? "" : "s"}</b></div><div class="row"><span>Their games in the 14 days before yours</span><b>${d.rest.in14}</b></div>${d.rest.nextAfter ? `<div class="row"><span>Their next game after yours</span><b>${e(d.rest.nextAfter)}</b></div>` : ""}</div>`;
        const h = d.halves;
        if (h.topN || h.botN) C.halves = `<div class="card"><h2>${on} v stronger and weaker sides</h2><table class="wdl"><tr><th></th><th>W</th><th>D</th><th>L</th></tr><tr><td>${on} v top half</td>${h.topN ? `<td>${h.top.w}</td><td>${h.top.d}</td><td>${h.top.l}</td>` : `<td colspan="3">—</td>`}</tr><tr><td>${on} v bottom half</td>${h.botN ? `<td>${h.bottom.w}</td><td>${h.bottom.d}</td><td>${h.bottom.l}</td>` : `<td colspan="3">—</td>`}</tr></table><p class="note">Positions as they stand today, not when each game was played.</p></div>`;
        if (d.bonus) C.bonus = `<div class="card"><h2>${on}: bonus points</h2><div class="big"><div><b>${d.bonus.tb}</b><span>Try bonus</span></div><div><b>${d.bonus.lb}</b><span>Losing bonus</span></div><div><b>${d.bonus.bp}</b><span>Total</span></div></div></div>`;
        // ---- v29 cards ----
        const ord = ordinalOf;
        let top = "", extra = "";
        const df = d.difficulty;
        if (df && df.status === "ok") {
          const vr = d.venue.record, vtxt = d.venue.n ? "Won " + vr.w + (vr.d ? ", drawn " + vr.d : "") + ", lost " + vr.l : "No games there yet";
          const chips = df.chips.map(x => `<span class="ch ${x === "W" ? "cw" : x === "L" ? "cl" : "cd"}">${x}</span>`).join("");
          C.diff = `<div class="card"><h2>Game Difficulty: this game only</h2><div class="verdict v-${df.level}">${df.label}</div><div class="dbar d-${df.level}"><i></i><i></i><i></i></div><div class="dlab"><span>Easy</span><span>Medium</span><span>Hard</span></div><div class="row"><span>Table position</span><b>${e(ord(d.opp.position))} of ${d.tableSize}</b></div><div class="row"><span>Recent form (oldest to latest)</span><b class="chips">${chips}</b></div><div class="row"><span>Playing them at ${v.oppHome ? "their" : "your"} ground</span><b>${e(vtxt)}</b></div><p class="note">A guide from ${on}'s table position, last 3 results and record at this venue.</p></div>`;
        } else if (df) {
          C.diff = `<div class="card"><h2>Game Difficulty: this game only</h2><p class="note" style="margin:0">Too early to say. ${on} ${df.games === 1 ? "has" : "have"} played ${df.games} game${df.games === 1 ? "" : "s"}, and the rating needs at least 3.</p></div>`;
        }
        const gr = d.ground;
        if (gr && gr.maps) {
          groundBtn = `<a class="dirbtn" target="_blank" rel="noopener" href="${e(gr.maps.href)}"${gr.maps.kind === "search" ? ' title="A map search for the club, not a confirmed ground address"' : ""}>${gr.maps.kind === "directions" ? "Directions" : e(gr.maps.label)}</a>`;
          groundLine = gr.venue ? `<span class="dt gl">${gr.theirs ? "Their ground" : "Your ground"}: ${e(gr.venue)}</span>` : "";
        }
        const wx = d.wx;
        if (wx && wx.status === "ok") {
          C.wx = `<div class="card"><h2>Forecast</h2><div class="row"><span>${wx.icon} ${e(wx.headline)}</span><b>${wx.temp}&deg;C &middot; rain ${wx.rain}% &middot; wind ${wx.wind} mph</b></div></div>`;
        } else if (wx && wx.status === "later") {
          C.wx = `<div class="card"><h2>Forecast</h2><div class="row"><span>Not available yet</span><b>Shows about two weeks before</b></div></div>`;
        }
        const lk = d.luck;
        if (lk && lk.status === "ok") {
          const pct = r0 => Math.round((r0 - 1) / Math.max(1, lk.N - 1) * 100);
          const sentence = luckText(lk, on, ord);
          const cch = lk.chips.map(x => `<span class="ch ${x === "W" ? "cw" : x === "L" ? "cl" : "cd"}">${x}</span>`).join("");
          C.luck = `<div class="card"><h2>Luck check: ${on}</h2><div class="lk lk-${lk.verdict}"><b>${lk.label}</b></div><p class="note" style="margin:6px 0 10px">${sentence}</p><div class="dumb"><span class="dm-line"></span><i class="dm-dot" style="left:${pct(lk.tableRank)}%"></i><i class="dm-ring" style="left:${pct(lk.pdRank)}%"></i></div><div class="dmk"><span><i class="dm-dot s"></i> League table position (${ord(lk.tableRank)})</span><span><i class="dm-ring s"></i> By points difference (${ord(lk.pdRank)})</span></div><div class="big" style="grid-template-columns:1fr 1fr;margin-top:10px"><div><b>${lk.pdPerGame > 0 ? "+" : lk.pdPerGame < 0 ? "−" : ""}${Math.abs(lk.pdPerGame)}</b><span>Points difference per game (${ord(lk.pdRank)} best)</span></div><div><b>${lk.closeN} of ${lk.gamesN}</b><span>Games decided by 7 or fewer</span></div></div>${cch ? `<div class="row"><span>Close games (oldest to latest)</span><b class="chips">${cch}</b></div>` : ""}<p class="note">Worked out from league scores only: it cannot see injuries, cards or conditions.</p></div>`;
        } else if (lk && lk.status === "early") {
          C.luck = `<div class="card"><h2>Luck check: ${on}</h2><p class="note" style="margin:0">Too early to say. ${on} ${lk.played === 1 ? "has" : "have"} played ${lk.played} game${lk.played === 1 ? "" : "s"}, and the check needs at least 5.</p></div>`;
        }
        const hi = d.history;
        if (hi && hi.series.length === 2 && hi.labels.length >= 2) {
          const W = 360, H = 200, ml = 26, mr = 108, mt = 12, mb = 24, N = hi.N, n = hi.labels.length;
          const X = i => ml + (n === 1 ? 0 : i * (W - ml - mr) / (n - 1)), Y = p => mt + (p - 1) * (H - mt - mb) / Math.max(1, N - 1);
          const step = Math.max(1, Math.ceil(N / 4)); const ticks = []; for (let t = 1; t <= N; t += step) ticks.push(t); if (ticks[ticks.length - 1] !== N) ticks.push(N);
          const grid = ticks.map(t => `<line x1="${ml}" x2="${W - mr}" y1="${Y(t)}" y2="${Y(t)}" class="gl"/><text x="${ml - 6}" y="${Y(t) + 4}" text-anchor="end" class="ax">${t}</text>`).join("");
          const line = (arr, cls) => `<polyline class="${cls}" fill="none" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${arr.map((p, i) => X(i).toFixed(1) + "," + Y(p).toFixed(1)).join(" ")}"/><circle class="${cls}f" cx="${X(n - 1).toFixed(1)}" cy="${Y(arr[n - 1]).toFixed(1)}" r="4"/>`;
          const meP = hi.series[0], opP = hi.series[1], yM = Y(meP[n - 1]), yO = Y(opP[n - 1]);
          let lyM = yM, lyO = yO; if (Math.abs(yM - yO) < 14) { if (yM <= yO) { lyM = yM - 7; lyO = yO + 7; } else { lyM = yM + 7; lyO = yO - 7; } }
          const short = (t, k) => t.length > k ? t.slice(0, k - 1) + "…" : t;
          const lab = (y, name, p, cls) => `<text x="${W - mr + 8}" y="${(y + 4).toFixed(1)}" class="ln ${cls}">${e(short(name, 11))} ${e(ord(p))}</text>`;
          const xl = [0, Math.floor((n - 1) / 2), n - 1].filter((v, i, a) => a.indexOf(v) === i).map(i => `<text x="${X(i).toFixed(1)}" y="${H - 6}" text-anchor="${i === 0 ? "start" : i === n - 1 ? "end" : "middle"}" class="ax">${e(hi.labels[i])}</text>`).join("");
          const gap = Math.abs(meP[n - 1] - opP[n - 1]);
          C.hist = `<div class="card"><h2>${d.cupName ? "Group" : "League"} position over time</h2><div class="big pt"><div><b>${e(ord(meP[n - 1]))}</b><span><i class="lg lg1"></i>${e(short(d.team, 16))}</span></div><div><b>${e(ord(opP[n - 1]))}</b><span><i class="lg lg2"></i>${e(short(d.opp.name, 16))}</span></div><div><b>${gap}</b><span>${gap === 1 ? "place" : "places"} apart</span></div></div><svg viewBox="0 0 ${W} ${H}" class="pch" role="img" aria-label="League position by week for ${e(d.team)} and ${e(d.opp.name)}">${grid}${line(meP, "l1")}${line(opP, "l2")}${lab(lyM, d.ownClub || d.team, meP[n - 1], "t1")}${lab(lyO, d.opp.name, opP[n - 1], "t2")}${xl}</svg><p class="note">Latest position is exact. Earlier rounds assume try bonuses came in each club's highest-scoring games.</p></div>`;
        }
        // v30s: head to head (this season + previous five, league only)
        const voidOpp = (() => { const vs = (d.h2hMeta && d.h2hMeta.voided) || []; if (!vs.length) return ""; const by = {}; for (const x of vs) by[x.season] = (by[x.season] || 0) + 1; return Object.keys(by).sort().reverse().map(k => by[k] + (by[k] === 1 ? " game" : " games") + " void in " + k).join(", "); })();
        const hs0 = d.h2hSum, ha = Array.isArray(d.h2hAll) ? d.h2hAll : [];
        if (hs0 && ha.length) {
          const idM = d.h2hIds ? d.h2hIds.me : "", idO = d.h2hIds ? d.h2hIds.opp : "";
          const wc = g => g.winId === idM ? "wm" : g.winId === idO ? "wo" : "wd";
          const wl = g => g.winId === idM ? "You won" : g.winId === idO ? "They won" : "Draw";
          const wt = g => g.wo ? (g.winId === idM ? "You (walkover)" : "They (walkover)") : wl(g);
          const scr = g => g.wo ? "W/O" : e(g.homeScore) + " &ndash; " + e(g.awayScore);
          const pc = v => (v / hs0.n * 100).toFixed(1);
          const tiles = ha.slice(0, 3).map(g => `<div class="tj ${wc(g)}"><small>${e(g.label)}</small><b>${scr(g)}</b><em>${wt(g)}</em></div>`).join("");
          const seasons = []; for (const g of ha) { let grp = seasons.find(x => x.s === g.season); if (!grp) { grp = { s: g.season, list: [] }; seasons.push(grp); } grp.list.push(g); }
          const all = seasons.map(grp => `<div class="hsn">${e(grp.s)}</div>` + grp.list.map(g => `<div class="hrw ${wc(g)}"><div>${e(g.homeName)} v ${e(g.awayName)}<small>${e(g.full)} &middot; ${wt(g)}${g.comp ? " &middot; " + e(g.comp) : ""}</small></div><b>${scr(g)}</b></div>`).join("")).join("");
          const avg = hs0.avgMe !== null ? `<div class="row"><span>Average score (you &ndash; them)</span><b>${f1(hs0.avgMe)} &ndash; ${f1(hs0.avgOpp)}</b></div>` : "";
          C.h2h = `<div class="card"><h2>Head to head &middot; last 5 seasons</h2><div class="hsp"><div class="s wm" style="width:${pc(hs0.me)}%">${hs0.me ? "You " + hs0.me : ""}</div>${hs0.draw ? `<div class="s wd" style="width:${pc(hs0.draw)}%">${hs0.draw}</div>` : ""}<div class="s wo" style="width:${pc(hs0.opp)}%">${hs0.opp ? "Them " + hs0.opp : ""}</div></div><div class="hts">${tiles}</div>${avg}${voidOpp ? `<p class="note" style="margin:6px 0 0">Not counted: ${e(voidOpp)}.</p>` : ""}${ha.length > 3 ? `<details class="hall"><summary>Show all ${ha.length} meetings</summary>${all}</details>` : ""}</div>`;
        } else if (d.h2hMeta && d.h2hMeta.seasonsOk > 0) {
          C.h2h = `<div class="card"><h2>Head to head</h2><p class="note" style="margin:0">${voidOpp ? "No played league meetings between you and " + on + " in this season or the last five (" + e(voidOpp) + ")." : "No league meetings between you and " + on + " in this season or the last five."}</p></div>`;
        }
        // v30s: group the cards (this game / their form / you v them / their season, folded)
        const grp = (n, title, inner) => inner ? `<section class="gb"><h2 class="gh">${n}. ${title}</h2><div class="gbox">${inner}</div></section>` : "";
        const g1 = grp(1, "This game", (C.diff || "") + (C.rest || "") + (C.wx || ""));
        const g2 = grp(2, "Their form", (C.last || "") + (C.trend || "") + (C.venue || ""));
        const g3 = grp(3, "You v them", (C.h2h || "") + (C.common || "") + (C.hist || ""));
        const sumBits = [];
        if (d.games) sumBits.push(c.close + " of " + d.games + " games close");
        if (h.topN) sumBits.push("v top half " + wdl(h.top));
        if (lk && lk.status === "ok") sumBits.push("Luck: " + String(lk.label).toLowerCase());
        if (d.bonus) sumBits.push(d.bonus.bp + " bonus point" + (d.bonus.bp === 1 ? "" : "s"));
        const g4 = (C.close || C.halves || C.bonus || C.luck) ? `<section class="gb"><details class="gfold"><summary><span class="gh">4. Their season in numbers</span><small>${e(sumBits.join(" · "))}</small></summary><div class="gbox">${(C.close || "") + (C.halves || "") + (C.bonus || "") + (C.luck || "")}</div></details></section>` : "";
        cards = `<div class="gc">${g1}${g2}</div><div class="gc">${g3}${g4}</div>`;
        // WhatsApp share text: only lines that have data.
        const bits = [];
        bits.push("Opposition report: " + d.opp.name);
        bits.push(d.venueTag + " · " + d.fixture.dateLabel);
        if (df && df.status === "ok") bits.push("Game Difficulty: " + df.label + " (" + ord(d.opp.position) + ", " + (df.wins === 3 ? "won their last 3" : df.wins === 0 ? "no wins in their last 3" : "won " + df.wins + " of their last 3") + ")");
        bits.push("");
        if (d.venue.n && d.venue.scored !== null) bits.push("• " + d.opp.name + (v.oppHome ? " at home" : " away") + ": scoring " + d.venue.scored + ", conceding " + d.venue.conceded + " per game");
        if (d.last.length) bits.push("• Last " + d.last.length + ": " + d.last.slice().reverse().map(g => g.out).join(" "));
        if (d.close && d.games) bits.push("• Close games (7 or fewer): " + d.close.close + " of " + d.games);
        if (d.rest) bits.push("• Rest: " + d.rest.days + " day" + (d.rest.days === 1 ? "" : "s") + " since their last game");
        if (wx && wx.status === "ok") bits.push("• Forecast: " + wx.headline.toLowerCase() + ", " + wx.temp + "°C");
        if (gr && gr.maps) bits.push((gr.maps.kind === "directions" ? "Directions: " : "Map search: ") + gr.maps.href);
        const shareLink = pubOrigin + "/?" + new URLSearchParams({ view: "opposition", season, competition, division, team, teamName, friendlyName: friendly, theme }).toString();
        bits.push("", shareLink);
        waHref = "https://wa.me/?text=" + encodeURIComponent(bits.join("\n"));
      }
      const title = friendly || (d && d.team) || "Opposition report";
      const oppTitle = ok ? d.opp.name : "";
      const crestH = ok ? `<span class="crest hdc"><span class="ini">${e(initialsOf(oppTitle))}</span>${d.opp.id ? `<img src="/api/crest?id=${encodeURIComponent(d.opp.id)}" alt="" onerror="this.remove()">` : ""}</span>` : "";
      const head = ok ? `<div class="ph"><div>${crestH}</div><div><h1>Opposition report: ${e(oppTitle)}</h1><p class="sub">${d.opp.position ? `<span class="tag">${e(ordinalOf(d.opp.position))}</span>` : ""}<span class="tag">${e(d.venueTag || (d.fixture.weHome ? "Home fixture" : "Away fixture"))}</span>${d.cupName ? `<span class="tag">${e(d.cupName)}</span>` : ""}<span class="dt">${e(d.fixture.dateLabel)}${d.fixture.time ? " &middot; " + e(d.fixture.time) : ""}</span>${groundLine}</p></div></div>` : `<h1>Opposition report</h1>`;
      const bodyHtml = ok ? `<div class="grid">${cards}</div><p class="foot">${d.multi ? "Form cards (home/away, trend, close games, last results, rest) include " + e(oppTitle) + "'s games in all their competitions: " + d.comps.map(c => e(c.name) + " (" + c.n + ")").join(", ") + ". " + (d.commonAll ? "Common opponents count both teams' games in all competitions; " : "Common opponents, ") + "top/bottom half and bonus points use the league only. " : ""}${d.early ? "Early in the season: only " + d.games + " game" + (d.games === 1 ? "" : "s") + " played by " + e(oppTitle) + ", so read these figures with care. " : ""}Worked out from league scores and the table only. The RFU feed has no tries, penalties, set piece, cards, half-time scores or players, so these are tendencies, not reasons. Use alongside your own video and scouting.</p>`
        : `<div class="none">${d && d.status === "cup" ? "The next game is a " + e(d.cupComp) + " game against " + e(d.cupOpp) + ". The RFU does not publish a table or results for it, so there is no opposition report for this game yet." : d && d.status === "none" ? "No upcoming fixture found for " + e(title) + "." : "The opposition report is not available right now. Please try again in a few minutes."}</div>`;
      const matchHref = "/?" + new URLSearchParams({view: "match", season, competition, division, team, teamName, friendlyName: friendly, theme}).toString();
      const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}"><title>Opposition report${oppTitle ? " - " + e(oppTitle) : ""}</title>
<style>
${MENU_CSS}
.ph{display:flex;align-items:center;gap:12px;margin:8px 0 14px}.ph>div:last-child{min-width:0}.crest.hdc{width:56px;height:56px;flex-basis:56px}.crest.hdc .ini{font-size:17px}.sub .dt{display:block;margin-top:2px}h1{font-size:21px;margin:0 0 4px;line-height:1.15}.sub{color:#93a59b;font-size:14px;margin:0;line-height:1.7}table.wdl td:not(:first-child),table.wdl th:not(:first-child){width:15%;font-weight:700}table.wdl td:not(:first-child){font-size:16px}.pl{display:flex;gap:8px}
.tag{display:inline-block;background:#1d2b36;color:#9ccaf0;border-radius:99px;padding:3px 10px;font-size:12px;font-weight:700;margin:0 6px 6px 0}
.grid{display:flex;flex-direction:column;gap:12px}
.gc{display:flex;flex-direction:column;gap:14px;min-width:0}.gh{font-size:15px;margin:0 0 6px 2px;color:#eef4f0;font-weight:700;letter-spacing:0;text-transform:none}
.gbox{background:#111719;border:1px solid #26312d;border-radius:14px;padding:6px 16px 14px}.gbox .card{background:none;border:0;border-radius:0;border-top:1px solid #26312d;padding:14px 0 0;margin-top:14px}.gbox .card:first-child{border-top:0;margin-top:8px;padding-top:0}
.gfold summary{cursor:pointer;list-style:none;background:#111719;border:1px solid #26312d;border-radius:14px;padding:12px 16px;display:block;position:relative}.gfold summary::-webkit-details-marker{display:none}.gfold summary::after{content:"\\25BE";position:absolute;right:16px;top:12px;color:#93a59b;font-size:18px}.gfold[open] summary::after{content:"\\25B4"}.gfold summary .gh{margin:0;display:block}.gfold summary small{display:block;color:#93a59b;font-size:12px;margin-top:3px;padding-right:22px;line-height:1.4}
.gfold[open] summary{border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom:0}.gfold[open] .gbox{border-top-left-radius:0;border-top-right-radius:0}
.hsp{display:flex;gap:3px;height:26px;margin:2px 0 8px}.hsp .s{display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border-radius:5px;overflow:hidden;white-space:nowrap;min-width:0;color:#08110c}.hsp .s.wm,.tj.wm{background:#3ddc84}.hsp .s.wo,.tj.wo{background:#7db4ff}.hsp .s.wd,.tj.wd{background:#e0b44e}
.hts{display:flex;gap:6px;margin-bottom:6px}.tj{flex:1 1 0;min-width:0;border-radius:9px;padding:7px 4px;text-align:center;color:#08110c}.tj small{display:block;font-size:11px}.tj b{display:block;font-size:19px;line-height:1.15;white-space:nowrap}.tj em{display:block;font-style:normal;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin-top:2px}
.hall summary{cursor:pointer;color:#9ccaf0;font-weight:700;text-align:center;padding:9px;border:1px solid #26312d;border-radius:99px;list-style:none;margin-top:8px;font-size:13px}.hall summary::-webkit-details-marker{display:none}
.hsn{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#93a59b;margin:12px 0 3px;font-weight:700}.hrw{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:4px 0 4px 8px;margin:3px 0;font-size:13px;border-left:4px solid #7a6a2a}.hrw.wm{border-color:#3ddc84}.hrw.wo{border-color:#7db4ff}.hrw small{display:block;color:#93a59b;font-size:11px}
body.light .gh{color:#18221c}body.light .gbox,body.light .gfold summary{background:#fff;border-color:#cbd8ce}body.light .gbox .card{border-top-color:#e0e7e1}body.light .gfold summary small,body.light .hrw small,body.light .hsn{color:#53665a}body.light .hall summary{color:#1d5a85;border-color:#cbd8ce}
${wide ? `.grid{grid-template-columns:1fr 1fr;align-items:start}` : ""}
.card{background:#111719;border:1px solid #26312d;border-radius:14px;padding:14px 16px}.card h2{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#b8c8bf;margin:0 0 10px}
.big{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center}.big div{background:#19221e;border-radius:10px;padding:10px 4px}.big b{display:block;font-size:22px}.big span{font-size:11px;color:#a9b8af;text-transform:uppercase;letter-spacing:.05em}
.note{font-size:13px;color:#b4c4bb;margin:10px 0 0;line-height:1.4}.up{color:#7fd89a}.dn{color:#f09595}.am{color:#e0b44e}
table{width:100%;border-collapse:collapse;font-size:14px}td,th{padding:7px 4px;text-align:center;border-top:1px solid #1f2a26}th{font-size:11px;color:#91a49a;text-transform:uppercase;letter-spacing:.06em;border-top:0}td:first-child,th:first-child{text-align:left}
.bar{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:13px}.bar .d{width:76px;color:#91a49a;flex:0 0 76px}.bar .o{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chip{display:inline-block;min-width:44px;text-align:center;border-radius:6px;padding:3px 6px;font-weight:800;font-size:12px;color:#fff}.chip.w{background:#1d6539}.chip.l{background:#762e31}.chip.d2{background:#80621c}
.row{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-top:1px solid #1f2a26;font-size:14px}.row:first-of-type{border-top:0}.row span{color:#a9b8af}
.trend{display:grid;grid-template-columns:1fr 1fr;gap:8px}.trend div{background:#19221e;border-radius:10px;padding:10px 12px}.trend label{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#a9b8af;margin-bottom:6px}.trend b{font-size:20px}.trend em{display:block;font-style:normal;font-weight:700;font-size:13px;margin-top:6px}.trend small.inl{display:inline;font-size:11px;font-weight:400}.trend small{display:block;color:#91a49a;font-size:12px;margin-top:3px}
.cpl{font-size:11px;color:#7d8c84;margin:-3px 0 4px 84px}.foot{font-size:12px;color:#7d8c84;margin:14px 2px 0;line-height:1.5}.none{color:#91a49a;font-size:14px;padding:10px 2px}
${AROUND_CSS}
.verdict{font-size:20px;font-weight:900;margin:0 0 10px}.v-easy{color:#3fb865}.v-medium{color:#e2a93b}.v-hard{color:#e05a5a}
.dbar{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;height:14px}.dbar i{border-radius:7px;background:#26312d}.d-easy i:nth-child(1){background:#3fb865}.d-medium i:nth-child(-n+2){background:#e2a93b}.d-hard i{background:#e05a5a}
.dlab{display:grid;grid-template-columns:repeat(3,1fr);font-size:12px;margin:5px 0 8px;color:#7d8c84}.dlab span:nth-child(2){text-align:center}.dlab span:nth-child(3){text-align:right}
.chips{display:inline-flex;gap:4px}body.light .row .ch,body.light .chips .ch,body.light .dumb .ch{color:#fff}.ch{display:inline-block;min-width:26px;text-align:center;border-radius:6px;padding:3px 6px;font-weight:800;font-size:12px;color:#fff}.cw{background:#1d6539}.cl{background:#762e31}.cd{background:#80621c}
.ground{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.gnd label{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#a9b8af;margin-bottom:4px}.gnd b{display:block;font-size:14px;line-height:1.35;color:inherit;text-transform:none;letter-spacing:0}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.dirbtn,.wabtn{display:inline-block;text-decoration:none;font-weight:800;font-size:13px;border-radius:99px;padding:8px 14px;text-align:center}.dirbtn{background:#1f6fb5;color:#fff}.wabtn{background:#25d366;color:#07210f}.sub .dt.gl{font-size:13px;color:#93a59b}
.wxh{display:flex;align-items:center;gap:12px;margin-bottom:10px}.wxi{font-size:34px}.wxh b{font-size:18px}.wxt{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center}.wxt div{background:#19221e;border-radius:10px;padding:10px 4px}.wxt b{display:block;font-size:18px}.wxt span{font-size:11px;color:#a9b8af;text-transform:uppercase;letter-spacing:.05em}
.lk b{font-size:18px}.lk-lucky b{color:#e0b44e}.lk-unlucky b{color:#6fb6ea}.lk-right b{color:#b4c4bb}
.dumb{position:relative;height:26px;margin:6px 8px 4px}.dm-line{position:absolute;left:0;right:0;top:12px;height:2px;background:#26312d}.dm-dot,.dm-ring{position:absolute;top:5px;width:16px;height:16px;border-radius:50%;margin-left:-8px;box-sizing:border-box}.dm-dot{background:#4aa3df}.dm-ring{border:3px solid #e0b44e;background:#111719}.dm-dot.s,.dm-ring.s{position:static;display:inline-block;width:10px;height:10px;margin:0 6px 0 0;vertical-align:middle;border-width:2px}.dmk{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#a9b8af;flex-wrap:wrap}
.pch{width:100%;height:auto;display:block;margin-top:8px}.gl{stroke:#26312d;stroke-width:1}.ax{fill:#7d8c84;font-size:10px}.ln{font-size:11px;font-weight:700;fill:#f5f7f6}.l1,.l1f{stroke:var(--c1,#2f9e5b)}.l1f{fill:var(--c1,#2f9e5b)}.l2,.l2f{stroke:var(--c2,#4aa3df)}.l2f{fill:var(--c2,#4aa3df)}.lg{display:inline-block;width:14px;height:3px;border-radius:2px;margin-right:6px;vertical-align:middle}.lg1{background:var(--c1,#2f9e5b)}.lg2{background:var(--c2,#4aa3df)}.pt b{font-size:20px}
body.light .l1,body.light .l1f{stroke:var(--c1d,#1b7f3b)}body.light .l1f{fill:var(--c1d,#1b7f3b)}body.light .l2,body.light .l2f{stroke:var(--c2d,#1d6aa0)}body.light .l2f{fill:var(--c2d,#1d6aa0)}body.light .lg1{background:var(--c1d,#1b7f3b)}body.light .lg2{background:var(--c2d,#1d6aa0)}body.light .gl{stroke:#d5dfd8}body.light .ln{fill:#18221c}body.light .dlab,body.light .ax{fill:#53665a;color:#53665a}body.light .wxt div{background:#edf2ee}body.light .wxt span,body.light .gnd label,body.light .dmk{color:#53665a}body.light .dm-line{background:#d5dfd8}body.light .dm-ring{background:#fff;border-color:#b07a00}body.light .v-easy{color:#1b7f3b}body.light .v-medium{color:#8a5a00}body.light .v-hard{color:#a32d2d}body.light .lk-lucky b{color:#8a5a00}body.light .lk-unlucky b{color:#1d5a85}body.light .dbar i{background:#d5dfd8}body.light .d-easy i:nth-child(1){background:#3fb865}body.light .d-medium i:nth-child(-n+2){background:#e2a93b}body.light .d-hard i{background:#e05a5a}
${wide ? `.wrap{max-width:1100px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}` : ""}
body.light .card{background:#fff;border-color:#cbd8ce}body.light .card h2{color:#40564a}body.light .big div,body.light .trend div{background:#edf2ee}body.light .big span,body.light .trend label,body.light .row span,body.light .trend small,body.light th,body.light .bar .d{color:#53665a}body.light .note,body.light .sub,body.light .foot{color:#53665a}body.light td,body.light .row{border-top-color:#e0e7e1}body.light .tag{background:#dcebf6;color:#1d5a85}body.light .up{color:#1b7f3b}body.light .dn{color:#a32d2d}body.light .am{color:#8a5a00}
</style></head><body class="${theme}">${themeBoot("true")}<div class="wrap">
<nav class="mbar"><span class="pl"><a class="pill" href="/?theme=${theme}">&lsaquo; Home</a><a class="pill" href="${e(matchHref)}">Next Match Stats</a></span><button type="button" class="pill tgl">Light mode</button></nav>
${head}${waHref || groundBtn ? `<div class="acts">${waHref ? `<a class="wabtn" target="_blank" rel="noopener" href="${e(waHref)}">Share on WhatsApp</a>` : ""}${groundBtn}</div>` : ""}
${bodyHtml}
<p class="ver">${VERSION_LABEL}</p>
</div>
${themeToggleScript}
${ok && d.history ? OPP_COLOUR_SCRIPT.replace("__CFG__", JSON.stringify({ ida: team, idb: d.opp.id, a: hexParam(url.searchParams.get("colour")), b: hexParam(url.searchParams.get("oppColour")) })) : ""}
</body></html>`;
      return new Response(page, { headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-cache" } });
    }

    // Links page: /?view=teams (or /teams) lists TV and mobile links per team.
    if (url.searchParams.get("view") === "teams" || url.pathname.replace(/\/+$/, "") === "/teams") {
      const season = url.searchParams.get("season") || AUTO.season;
      const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      const e = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      // Follow (default): links carry no season= and switch by themselves each year. Pin: links carry this season.
      const pinned = url.searchParams.has("season") && !!url.searchParams.get("season");
      const sq = pinned ? { season } : {};
      const link = (t, layout) => {
        const q = new URLSearchParams({
          ...sq, competition: t.competition, division: t.division,
          team: t.team, teamName: t.teamName, friendlyName: t.name, theme
        });
        if (layout) q.set("layout", layout);
        return pubOrigin + "/?" + q.toString();
      };
      const matchLink = t => pubOrigin + "/?" + new URLSearchParams({view: "match", ...sq, competition: t.competition, division: t.division, team: t.team, teamName: t.teamName, friendlyName: t.name, theme}).toString();
      const devParam = (url.searchParams.get("device") || "").toLowerCase();
      const deviceCls = devParam === "mobile" ? " dm" : devParam === "desktop" ? " dd" : devParam === "all" ? " all" : "";
      const stackUrl = pubOrigin + "/?" + new URLSearchParams({view: "stack", ...sq, theme}).toString();
      const builderUrl = "/builder?" + new URLSearchParams({theme}).toString();
      // Add new sections or items here as the dashboard grows. Each link is {label, href, cls}.
      const SECTIONS = [
        { title: "Club screens", note: "Full-screen views for TVs and signage. On a phone the same link scrolls, with Table & Stats links for each team.", items: [
          { name: "Match Centre", detail: "The club's teams (1XV, The Vandals, Women and the Colts) on one screen: last game and next game",
            links: [{ label: "Stacked view", href: stackUrl }] }
        ]},
        { title: "Team dashboards", note: "League table, form, results and next fixture for one team.", items: TEAMS.map(t => ({
          name: t.name, detail: t.league,
          links: [{ label: "Standard / TV view", href: link(t, "tv"), only: "tv" }, { label: "Mobile view", href: link(t, "mobile"), cls: "mob", only: "mob" }, { label: "Match Stats (next match)", href: matchLink(t), cls: "lt" }, { label: "Fixtures and Results (Mobile)", href: matchLink(t).replace("view=match", "view=fixtures"), cls: "mob", only: "mob" }, { label: "Fixtures and Results (TV View)", href: matchLink(t).replace("view=match", "view=fixtures") + "&layout=tv", cls: "lt", only: "tv" }, { label: "League Leaders (Mobile)", href: matchLink(t).replace("view=match", "view=leaders"), cls: "mob", only: "mob" }, { label: "League Leaders (TV View)", href: matchLink(t).replace("view=match", "view=leaders") + "&layout=tv", cls: "lt", only: "tv" }, { label: "Opposition Report (Mobile)", href: matchLink(t).replace("view=match", "view=opposition"), cls: "mob", only: "mob" }, { label: "Opposition Report (Wide Screen)", href: matchLink(t).replace("view=match", "view=opposition") + "&layout=wide", cls: "lt", only: "tv" }]
        }))}
      ];
      const groups = SECTIONS.map(sec => `<section class="grp"><h2 class="gt">${e(sec.title)}</h2>${sec.note ? `<p class="gn">${e(sec.note)}</p>` : ""}${sec.items.map(it => `<div class="card"><h3>${e(it.name)}</h3>${it.detail ? `<p class="lg">${e(it.detail)}</p>` : ""}${it.links.map(l => `<div class="row${l.only ? " only-" + l.only : ""}"><a class="btn ${l.cls || ""}" href="${e(l.href)}">${e(l.label)}</a></div>`).join("")}</div>`).join("")}</section>`).join("");
      const builderCard = `<section class="grp"><h2 class="gt">Other teams</h2><p class="gn">Build links for any team listed on englandrugby.com.</p><div class="card"><h3>Link builder</h3><p class="lg">Search for a team, pick its league and copy its dashboard links.</p><div class="row"><a class="btn" href="${e(builderUrl)}">Open link builder</a></div></div></section>`;
      // Season control (links page only): follow the current season, or pin the links to one.
      const slist = await seasonsFromRfu();
      const cur = AUTO.auto ? AUTO.season : seasonCalc(todayIso(url, isDev === true), slist.list).season;
      const opts = [];
      { const y = +cur.slice(0, 4); if (slist.list.some(x => x.name === seasonName(y + 1))) opts.push(seasonName(y + 1)); opts.push(cur, seasonName(y - 1), seasonName(y - 2)); }
      const optHtml = ['<option value=""' + (pinned ? "" : " selected") + '>Follow the current season (' + e(seasonShort(cur)) + ')</option>']
        .concat(opts.map(n => '<option value="' + e(n) + '"' + (pinned && n === season ? " selected" : "") + '>Pin to ' + e(seasonShort(n)) + '</option>')).join("");
      const seasonCtl = `<label style="display:inline-block;margin-right:6px">Season <select id="seasonSel" style="font:inherit;color:inherit;background:transparent;border:1px solid rgba(128,140,134,.6);border-radius:6px;padding:2px 4px">${optHtml}</select></label><span class="sn">${pinned ? "Links are pinned to " + e(seasonShort(season)) + " and will not change." : "Links have no season in them, so they switch to the new season by themselves."}</span> &bull;`;
      const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}"><title>Club dashboard links</title>
<style>
${MENU_CSS}
</style></head><body class="${theme}${deviceCls}">${themeBoot("true")}<div class="wrap"><div class="top"><h1>Club dashboard links</h1><button type="button" class="pill tgl">Light mode</button></div><p class="sub">${seasonCtl} Showing the links that suit this device. Links open in the theme selected at the top. <a href="#" class="alll" style="color:inherit">Show all links</a></p>${groups}${builderCard}<p class="ver">${VERSION_LABEL} &middot; <a href="/docs" style="color:inherit">Documentation</a> &middot; <a href="/admin" style="color:inherit">Admin</a> &middot; <a href="/club-signout" style="color:inherit">Sign out</a></p></div>
${themeToggleScript}<script>(function(){var ss=document.getElementById("seasonSel");if(ss)ss.addEventListener("change",function(){var u=new URL(location.href);if(ss.value)u.searchParams.set("season",ss.value);else u.searchParams.delete("season");location.href=u.toString()})})();</script><script>(function(){function fix(){var t=document.body.classList.contains("light")?"light":"dark";document.querySelectorAll("a.btn").forEach(function(el){var attr="href",v=el.getAttribute(attr);if(!v)return;try{var u=new URL(v,location.href);if(!u.searchParams.has("theme"))return;u.searchParams.set("theme",t);el.setAttribute(attr,u.toString())}catch(e){}})}fix();document.addEventListener("click",function(ev){if(ev.target.closest(".tgl"))setTimeout(fix,0)})})();document.addEventListener("click",function(ev){var a=ev.target.closest(".alll");if(!a)return;ev.preventDefault();var on=document.body.classList.toggle("all");a.textContent=on?"Show device links only":"Show all links"});</script></body></html>`;
      return new Response(page, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }

    // Link builder API (proxies englandrugby.com so the browser avoids CORS).
    if (url.pathname === "/api/builder/search" || url.pathname === "/api/builder/team") {
      const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json;charset=utf-8", "Cache-Control": "no-store" } });
      const RFU = "https://www.englandrugby.com/api/fixtures-and-result/";
      const getJson = async u => { const r = await cachedText(u, "application/json"); if (!r.ok) throw new Error("englandrugby.com returned HTTP " + r.status); return JSON.parse(r.text); };
      try {
        if (url.pathname === "/api/builder/search") {
          const name = (url.searchParams.get("name") || "").trim();
          if (name.length < 2) return json({ teams: [] });
          if (!url.searchParams.get("webonly")) { try { const ts = await dsSearchTeams(name); if (ts.length) return json({ teams: ts, via: "data-service" }); } catch (_) { /* fall back to the website */ } }
          if ((await siteSettings()).features.webfallback === false) return json({ teams: [], via: "website-off" });
          const d = await getJson(RFU + "search?" + new URLSearchParams({ name }));
          const teams = (d && Array.isArray(d.data) ? d.data : []).filter(x => x.listType === "TeamType" && x._id).map(x => ({ id: String(x._id), name: String(x.name || "") }));
          return json({ teams });
        }
        const team = (url.searchParams.get("team") || "").trim();
        if (!/^\d+$/.test(team)) return json({ error: "Missing team ID" }, 400);
        if (!url.searchParams.get("webonly")) { try { const ds = await dsTeam(url.origin, team, (url.searchParams.get("season") || "").trim()); if (ds) return json(ds); } catch (_) { /* fall back to the website */ } }
        if ((await siteSettings()).features.webfallback === false) return json({ error: "The RFU data service did not answer and the website back-up is turned off in Admin." }, 502);
        const first = await getJson(RFU + "teamSelect?" + new URLSearchParams({ team }));
        const seasons = (first && first.data && first.data.seasonList) || [];
        const season = url.searchParams.get("season") || seasons[0] || "";
        const sel = season && season !== seasons[0] ? await getJson(RFU + "teamSelect?" + new URLSearchParams({ team, season })) : first;
        const sd = (sel && sel.data) || {};
        const comps = sd.compList || [];
        const leagues = [], skipped = [], dbg = [];
        await Promise.all(comps.map(async c => {
          try {
            const cd = await getJson(RFU + "competitionSelect?" + new URLSearchParams({ competition: String(c._id), season, team }));
            const gl = (cd && cd.data && cd.data.groupsList) || [];
            dbg.push({ id: String(c._id), name: String(c.name || ""), groups: gl.length, dataKeys: Object.keys((cd && cd.data) || {}) });
            if (!gl.length) skipped.push({ competition: String(c._id), name: String(c.name || ""), why: "no divisions returned" });
            for (const g of gl) leagues.push({ competition: String(c._id), competitionName: String(c.name || ""), division: String(g._id), divisionName: String(g.name || "") });
          } catch (err) { skipped.push({ competition: String(c._id), name: String(c.name || ""), why: String(err && err.message || err) }); dbg.push({ id: String(c._id), name: String(c.name || ""), error: String(err && err.message || err) }); }
        }));
        // The RFU team page lists some competitions (e.g. PREM Rugby Cup) that the teamSelect API leaves out, so add any
        // competition/division links found on the page for this team and season.
        const extra = [];
        const unent = t => String(t).replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
        try {
          const pu = new URL("https://www.englandrugby.com/fixtures-and-results/search-results");
          pu.searchParams.set("team", team); pu.searchParams.set("season", season);
          const pr = await cachedText(pu, "text/html,application/xhtml+xml");
          if (pr.ok && !pr.blocked) {
            const have = new Set(leagues.map(l => l.division + "|" + l.competition));
            const names = {};
            const dd = (pr.text.match(/data-select-type="Competition"[^>]*data-options="([^"]*)"/) || [])[1] || "";
            try { for (const c of JSON.parse(unent(dd)).data || []) names[String(c.id)] = String(c.name || ""); } catch (_) {}
            for (const m of pr.text.matchAll(/competition=(\d+)&(?:amp;)?division=(\d+)[^>]*>([^<]*)</g)) {
              const key = m[2] + "|" + m[1];
              if (have.has(key)) continue;
              const lt = unent(m[3]).trim();
              have.add(key);
              const good = lt && !/view full table|^view|^table/i.test(lt);
              extra.push({ competition: m[1], competitionName: names[m[1]] || "", division: m[2], divisionName: good ? lt : (names[m[1]] || "Competition " + m[1]) });
            }
          }
        } catch (_) { /* page not readable: keep the API list */ }
        for (const x of extra) leagues.push(x);
        leagues.sort((a, b) => a.divisionName.localeCompare(b.divisionName));
        return json({ team, name: (sd.selectedTeam && sd.selectedTeam.data && sd.selectedTeam.data.name) || "", club: (sd.clubInfo && sd.clubInfo.clubName) || "", season, seasons, leagues, skipped, fromPage: extra, via: "website", ...(url.searchParams.get("debug") ? { debug: { compList: comps.map(c => ({ id: c._id, name: c.name })), perCompetition: dbg } } : {}) });
      } catch (err) {
        return json({ error: String(err && err.message || err) }, 502);
      }
    }

    // Link builder page: /?view=builder (or /builder)
    if (url.searchParams.get("view") === "builder" || url.pathname.replace(/\/+$/, "") === "/builder") {
      const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}"><title>Link builder</title>
<style>
${MENU_CSS}
</style></head><body class="${theme}">${themeBoot("true")}<div class="wrap">
<nav class="mbar"><a class="pill" href="/">&lsaquo; Home</a><button type="button" class="pill tgl">Light mode</button></nav>
<h1>Link builder</h1><p class="sub">Find any team on englandrugby.com and get dashboard links for it.</p>
<div class="card"><label class="f" for="q" style="margin-top:0">Team name</label><form id="sf" class="row" style="margin-top:0" role="search"><input id="q" class="in" type="search" placeholder="For example, Brixham" autocomplete="off" enterkeyhint="search"><button class="btn" style="flex:0 0 auto;padding:12px 16px">Search</button></form><p id="sm" class="msg" aria-live="polite"></p><div id="hits" class="hits"></div></div>
<div class="card" id="cfg" hidden><div class="tid"><span id="tcr"></span><div><h3 id="tn"></h3><p class="lg" id="tc" style="margin:0"></p></div></div>
<label class="f" for="season">Season</label><select id="season" class="in"></select>
<label class="f" style="display:flex;gap:8px;align-items:center;font-weight:normal"><input type="checkbox" id="fol" checked> Follow the current season (links switch to the new season by themselves)</label>
<label class="f" for="lg">League</label><select id="lg" class="in"></select><p id="lm" class="msg" aria-live="polite"></p>
<label class="f" for="fn">Name shown on the dashboard</label><input id="fn" class="in" autocomplete="off">
<label class="f" for="th">Theme</label><select id="th" class="in"><option value="dark">Dark</option><option value="light">Light</option></select>
<div id="links"></div></div>
<p class="ver">${VERSION_LABEL}</p>
</div>
${themeToggleScript}
<script>
(function(){
var $=function(i){return document.getElementById(i)},cur=null;
var SB_BASE=${JSON.stringify(pubOrigin)};
${INITIALS_FN}
function crest(id,name){var w=document.createElement("span");w.className="crest";var i=document.createElement("span");i.className="ini";i.textContent=initialsOf(name);w.appendChild(i);if(id){var m=document.createElement("img");m.alt="";m.src="/api/crest?id="+encodeURIComponent(id);m.onload=function(){i.style.display="none"};m.onerror=function(){m.remove()};w.appendChild(m)}return w}
function api(p,q){return fetch(p+"?"+new URLSearchParams(q)).then(function(r){return r.json()})}
function linkRow(label,href,cls){var d=document.createElement("div");d.className="row";var a=document.createElement("a");a.className="btn "+(cls||"");a.href=href;a.textContent=label;d.appendChild(a);return d}
function sq(t){return $("fol")&&$("fol").checked?{}:{season:t.season}}
function teamLink(t,layout){var q=new URLSearchParams(Object.assign(sq(t),{competition:t.competition,division:t.division,team:t.team,teamName:t.teamName,friendlyName:t.name,theme:$("th").value}));if(layout)q.set("layout",layout);return SB_BASE+"/?"+q.toString()}
function matchLink(t){var q=new URLSearchParams(Object.assign({view:"match"},sq(t),{competition:t.competition,division:t.division,team:t.team,teamName:t.teamName,friendlyName:t.name,theme:$("th").value}));return SB_BASE+"/?"+q.toString()}
function selected(){var o=$("lg").selectedOptions[0];if(!cur||!o)return null;return {name:$("fn").value.trim()||cur.name,teamName:cur.name,competition:o.getAttribute("data-c"),division:o.value,team:cur.team,league:o.textContent,season:$("season").value}}
function render(){var box=$("links");box.innerHTML="";var t=selected();if(!t)return;box.appendChild(linkRow("Standard / TV view",teamLink(t,"")));box.appendChild(linkRow("Mobile view",teamLink(t,"mobile"),"mob"));box.appendChild(linkRow("Auto layout (phone or TV)",teamLink(t,"auto"),"lt"));box.appendChild(linkRow("Match Stats (next match)",matchLink(t),"lt"));box.appendChild(linkRow("Fixtures and Results (Mobile)",matchLink(t).replace("view=match","view=fixtures"),"lt"));box.appendChild(linkRow("Fixtures and Results (TV View)",matchLink(t).replace("view=match","view=fixtures")+"&layout=tv","lt"));box.appendChild(linkRow("League Leaders (Mobile)",matchLink(t).replace("view=match","view=leaders"),"lt"));box.appendChild(linkRow("League Leaders (TV View)",matchLink(t).replace("view=match","view=leaders")+"&layout=tv","lt"));box.appendChild(linkRow("Opposition Report (Mobile)",matchLink(t).replace("view=match","view=opposition"),"lt"));box.appendChild(linkRow("Opposition Report (Wide Screen)",matchLink(t).replace("view=match","view=opposition")+"&layout=wide","lt"));
var title=t.name+" dashboard",text=t.name+" \u2022 "+t.league+" ("+t.season+")\\n\\nStandard / TV view - full-screen layout for TVs and large screens:\\n"+teamLink(t,"")+"\\n\\nMobile view - scrolling layout for phones:\\n"+teamLink(t,"mobile")+"\\n\\nAuto layout - phone layout on small screens, TV layout on larger ones (use this if you are not sure what device it will be opened on):\\n"+teamLink(t,"auto");
var sr=document.createElement("div");sr.className="row";var sb=document.createElement("button");sb.type="button";sb.className="btn share";sb.textContent="Share links";sr.appendChild(sb);box.appendChild(sr);
var alt=document.createElement("div");alt.className="row";alt.hidden=true;
[["Email","mailto:?subject="+encodeURIComponent(title)+"&body="+encodeURIComponent(text)],["WhatsApp","https://wa.me/?text="+encodeURIComponent(text)]].forEach(function(o){var a=document.createElement("a");a.className="btn lt";a.href=o[1];a.textContent=o[0];if(o[0]==="WhatsApp"){a.target="_blank";a.rel="noopener"}alt.appendChild(a)});
var ca=document.createElement("button");ca.type="button";ca.className="copy";ca.setAttribute("data-url",text);ca.textContent="Copy all";alt.appendChild(ca);box.appendChild(alt);
sb.addEventListener("click",function(){if(navigator.share){navigator.share({title:title,text:text}).catch(function(e){if(e&&e.name!=="AbortError")alt.hidden=false})}else{alt.hidden=false;sb.parentNode.hidden=true}})}
function loadTeam(id,season){$("cfg").hidden=false;$("lm").className="msg";$("lm").textContent="Loading leagues\u2026";$("lg").innerHTML="";$("links").innerHTML="";
api("/api/builder/team",season?{team:id,season:season}:{team:id}).then(function(d){if(d.error)throw new Error(d.error);
var keepName=cur&&cur.team===d.team&&$("fn").value;cur={team:d.team,name:d.name};$("tn").textContent=d.name;$("tc").textContent=d.club||"";$("tcr").innerHTML="";$("tcr").appendChild(crest(d.team,d.name));if(!keepName)$("fn").value=d.name;
$("season").innerHTML="";d.seasons.forEach(function(s){var o=document.createElement("option");o.value=s;o.textContent=s;if(s===d.season)o.selected=true;$("season").appendChild(o)});
d.leagues.forEach(function(l){var o=document.createElement("option");o.value=l.division;o.setAttribute("data-c",l.competition);o.textContent=l.divisionName;$("lg").appendChild(o)});
$("lm").textContent=(d.leagues.length?(d.leagues.length>1?"This team plays in more than one competition. Pick one.":""):"No league found for this team in "+d.season+". Try another season.")+((d.skipped&&d.skipped.length)?" Not available (no league table from the RFU): "+d.skipped.map(function(x){return x.name}).join(", ")+".":"");render()}).catch(function(e){$("lm").className="msg err";$("lm").textContent="Couldn\u2019t load this team: "+e.message})}
$("sf").addEventListener("submit",function(ev){ev.preventDefault();var n=$("q").value.trim();if(n.length<2){$("sm").textContent="Type at least two letters.";return}$("sm").className="msg";$("sm").textContent="Searching\u2026";$("hits").innerHTML="";
api("/api/builder/search",{name:n}).then(function(d){var ts=d.teams||[];$("sm").textContent=ts.length?ts.length+" teams found":"No teams match \u201c"+n+"\u201d. Check the spelling or try the club name only.";
ts.forEach(function(t){var b=document.createElement("button");b.type="button";b.className="hit";b.textContent=t.name;b.addEventListener("click",function(){document.querySelectorAll(".hit").forEach(function(x){x.removeAttribute("aria-current")});b.setAttribute("aria-current","true");cur=null;loadTeam(t.id);$("cfg").scrollIntoView({behavior:"smooth",block:"start"})});$("hits").appendChild(b)})}).catch(function(e){$("sm").className="msg err";$("sm").textContent="Search failed: "+e.message})});
$("season").addEventListener("change",function(){if(cur)loadTeam(cur.team,$("season").value)});
["lg","th","fol"].forEach(function(i){$(i).addEventListener("change",render)});$("fn").addEventListener("input",render);
document.addEventListener("click",function(ev){var b=ev.target.closest(".copy");if(!b)return;var u=b.getAttribute("data-url"),done=function(){var o=b.textContent;b.textContent="Copied";setTimeout(function(){b.textContent=o},1500)};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(done,function(){window.prompt("Copy this",u)})}else{window.prompt("Copy this",u)}});
})();
</script></body></html>`;
      return new Response(page, { headers: { "Content-Type": "text/html;charset=utf-8" } });
    }
    // Stacked all-teams view: /?view=stack  (1XV, The Vandals and Women on one screen)
    if (url.searchParams.get("view") === "stack") {
      const season = url.searchParams.get("season") || AUTO.season;
      const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
      // Optional custom team list from the link builder: teams=[[name,teamName,competition,division,team,league,season],...]
      let stackTeams = TEAMS, customTeams = false;
      const teamsParam = url.searchParams.get("teams");
      if (teamsParam) {
        try {
          const arr = JSON.parse(teamsParam);
          const parsed = (Array.isArray(arr) ? arr : []).slice(0, 6).map(a => ({
            name: String(a[0] || "").slice(0, 60), teamName: String(a[1] || ""), competition: String(a[2] || ""),
            division: String(a[3] || ""), team: String(a[4] || ""), league: String(a[5] || ""), season: /^\d{4}-\d{4}$/.test(String(a[6] || "")) ? String(a[6]) : ""
          })).filter(t => /^\d+$/.test(t.competition) && /^\d+$/.test(t.division) && /^\d+$/.test(t.team));
          if (parsed.length) { stackTeams = parsed; customTeams = true; }
        } catch (_) { /* ignore a malformed list and show the club teams */ }
      }
      const clubName = url.searchParams.get("clubName") || (customTeams ? "Match Centre" : "Ivybridge RFC - Match Centre");
      // Phone jump-bar labels: use "short" if set, otherwise drop "The " and any first word shared by several teams.
      const firstWords = stackTeams.map(t => String(t.name).split(/\s+/)[0].toLowerCase());
      const shortOf = t => t.short || String(t.name).replace(/^The\s+/i, "").replace(/^(\S+)\s+(.+)$/, (m, w, rest) => firstWords.filter(x => x === w.toLowerCase()).length > 1 ? rest : m);
      const e = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      // Team colours: each Now and Next row gets its own accent (from TEAMS, else this palette).
      const PALETTE = ["#2f9e5b", "#d9a21b", "#b45fc8", "#3d8fd6", "#d6574f", "#2bb3a3"];
      const accentOf = (t, i) => /^#[0-9a-f]{6}$/i.test(t.accent || "") ? t.accent : PALETTE[i % PALETTE.length];
      const tint = (hex, a) => `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`;
      // Text colour on a solid team colour: dark on light colours (gold), white on dark ones.
      const onColour = hex => { const [r,g,b] = [1,3,5].map(k => parseInt(hex.slice(k,k+2),16)/255); return (0.2126*r + 0.7152*g + 0.0722*b) > 0.5 ? "#1a1400" : "#ffffff"; };
      const acStyle = (t, i) => { const c = accentOf(t, i); return `style="--ac:${c};--at:${tint(c, .16)};--on:${onColour(c)}"`; };
      // Row style for telling teams apart: d coloured side tab (default); a solid panel, b title bar, c framed row via &rows=.
      const rowStyle = ["a","b","c","d"].includes(url.searchParams.get("rows")) ? url.searchParams.get("rows") : "d";
      const sOf = t => t.season || (AUTO.auto ? "" : season);
      const tableHref = t => pubOrigin + "/?" + new URLSearchParams({...(sOf(t) ? {season: sOf(t)} : {}), competition: t.competition, division: t.division, team: t.team, teamName: t.teamName, friendlyName: t.name, theme, layout: "mobile"}).toString();
      const viewHref = (t, v) => pubOrigin + "/?" + new URLSearchParams({view: v, ...(sOf(t) ? {season: sOf(t)} : {}), competition: t.competition, division: t.division, team: t.team, teamName: t.teamName, friendlyName: t.name, theme}).toString();
      const menuHref = pubOrigin + "/?" + new URLSearchParams({theme}).toString();
      const crest = (id, name) => `<span class="cr"><span class="ini">${e(initialsOf(name))}</span>${id ? `<img src="https://images.englandrugby.com/club_images/${encodeURIComponent(id)}.png" alt="" onload="this.parentNode.querySelector('.ini').style.display='none'" onerror="this.remove()">` : ""}</span>`;
      if (AUTO.auto) {
        stackTeams = await Promise.all(stackTeams.map(async t => {
          if (t.season) return t;
          const fx = await leagueFix(worker, url.origin, t.team, season, AUTO.prev || seasonName(+season.slice(0, 4) - 1), t.competition, t.division);
          return fx.changed ? { ...t, competition: fx.competition, division: fx.division } : t;
        }));
      }
      const results = await Promise.all(stackTeams.map(async t => {
        const q = new URLSearchParams({season: t.season || season, competition: t.competition, division: t.division, team: t.team, teamName: t.teamName, friendlyName: t.name, format: "summary"});
        try {
          const r = await worker.fetch(new Request(url.origin + "/?" + q.toString()));
          if (!r.ok) throw new Error("HTTP " + r.status);
          return {t, s: await r.json()};
        } catch (err) { return {t, error: String(err && err.message || err)}; }
      }));
      const cdOf = n => {
        if (!(n && n.iso)) return "";
        const day = d => d.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
        const diff = Math.round((new Date(day(new Date(n.iso)) + "T00:00:00Z") - new Date(day(new Date()) + "T00:00:00Z")) / 864e5);
        const todayD = new Date(day(new Date()) + "T00:00:00Z"), gameD = new Date(day(new Date(n.iso)) + "T00:00:00Z");
        const wk = Math.floor((diff + (todayD.getUTCDay() + 6) % 7) / 7); // 0 = this Mon-Sun week, 1 = next week
        const wdName = gameD.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
        return diff < 0 ? "Result due" : diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : wk === 0 ? "This " + wdName : wk === 1 ? "Next " + wdName : "";
      };
      const ordOf = p => p + ([,"st","nd","rd"][p % 10] && ![11,12,13].includes(p % 100) ? [,"st","nd","rd"][p % 10] : "th");
      // Match Centre layouts for TV screens (v3.21): "next" = a column per team with the next game first, "board" = one row per team.
      // Phones always use the stacked cards above, so these are hidden under 800px (and the cards are hidden above it).
      const lastOf = l => { if (!l) return null; const mine = l.mineHome ? l.homeScore : l.awayScore, theirs = l.mineHome ? l.awayScore : l.homeScore; const res = mine > theirs ? "w" : mine < theirs ? "l" : "d"; return { mine, theirs, res, word: res === "w" ? "Win" : res === "l" ? "Loss" : "Draw", opp: l.mineHome ? l.awayName : l.homeName, oppId: l.mineHome ? l.awayId : l.homeId, where: l.mineHome === null || l.mineHome === undefined ? "" : l.mineHome ? "Home" : "Away" }; };
      // v3.22: "2nd v 3rd · 1 point apart" from the public league table (league games only; a cup game has no opponent position)
      const clashOf = (s, n) => {
        if (!(s && n && s.position && n.oppPos)) return "";
        const gap = (s.points !== null && s.points !== undefined && n.oppPts !== null && n.oppPts !== undefined) ? Math.abs(Number(s.points) - Number(n.oppPts)) : null;
        return ordOf(s.position) + " v " + ordOf(n.oppPos) + (gap === null ? "" : gap === 0 ? " &middot; level on points" : " &middot; " + gap + " point" + (gap === 1 ? "" : "s") + " apart");
      };
      const nextOf = n => n ? { opp: n.mineHome ? n.awayName : n.homeName, oppId: n.mineHome ? n.awayId : n.homeId, where: n.mineHome === null || n.mineHome === undefined ? "" : n.mineHome ? "Home" : "Away", date: n.dateLabel === "Date TBC" ? "Date TBC" : String(n.dateLabel || ""), cd: cdOf(n), venue: String(n.venue || "") } : null;
      const colHtml = ({t, s, error}, idx) => {
        if (error || !s) return `<section class="cw" ${acStyle(t, idx)}><div class="ch"><div class="cx"><div class="cn">${e(t.name)}</div><div class="cl">${e(t.league)}</div></div></div><div class="cnx"><div class="empty" style="color:var(--on)">Couldn't load this team. It will retry on the next refresh.</div></div></section>`;
        const L = lastOf(s.last), N = nextOf(s.next);
        const pos = s.position ? `<b class="ps2">${ordOf(s.position)}</b>` : "";
        const pts = s.points !== null && s.points !== undefined ? `<span class="pt">${s.points} pts</span>` : "";
        const pl = s.played ? `<span class="pd">Played ${s.played}</span>` : "";
        const next = N ? `<div class="k"><b>Next game</b></div>${crest(N.oppId, N.opp)}<div class="on">${e(N.opp)}</div><div class="od">${e(N.date)}</div><div class="oc">${N.where ? `<span>${N.where}</span>` : ""}${N.cd ? `<i>${e(N.cd)}</i>` : ""}</div>${N.venue ? `<div class="og">${e(N.venue)}</div>` : ""}${clashOf(s, s.next) ? `<div class="oq">${clashOf(s, s.next)}</div>` : ""}` : `<div class="k"><b>Next game</b></div><div class="empty" style="color:var(--on)">No upcoming fixture found in this competition</div>`;
        const last = L ? `${crest(L.oppId, L.opp)}<div class="ln"><div class="k"><b>Last result</b></div><div class="rs"><span class="pl ${L.res}">${L.word}</span><span class="rsc">${L.mine}<i class="dsh">&ndash;</i>${L.theirs}</span></div><div class="lo">${e(L.opp)}${L.where ? " &middot; " + L.where : ""}</div></div>` : `<div class="ln"><div class="k"><b>Last result</b></div><div class="empty">No results available yet</div></div>`;
        return `<section class="cw" ${acStyle(t, idx)}><div class="ch">${crest(s.teamId, s.team)}<div class="cx"><div class="cn">${e(s.team)}</div><div class="cl">${e(s.league)}</div></div></div><div class="cnx">${next}</div><div class="clw"><div class="cls">${last}</div><div class="ctb"><span class="k"><b>Table</b></span>${pos}${pts}${pl}</div></div></section>`;
      };
      const rowHtml = ({t, s, error}, idx) => {
        const tsl = `<a class="tsl" href="${e(tableHref(t))}">Table &amp; Stats</a>`;
        const extra = `<div class="stab">${e(shortOf(t))}</div><div class="tbar">${e((s && s.team) || t.name)}<span>${e((s && s.league) || t.league)}</span></div>`;
        if (error || !s) return `<div class="rw" id="t${idx}" ${acStyle(t, idx)}>${extra}<div class="bx tbx"><div class="tn">${e(t.name)}</div><div class="sm">${e(t.league)}</div>${tsl}</div><div class="bx wide"><div class="empty">Couldn't load this team. It will retry on the next refresh.</div></div></div>`;
        const stats = [s.position ? `<span class="pl h">${s.position}${[,"st","nd","rd"][s.position % 10] && ![11,12,13].includes(s.position % 100) ? [,"st","nd","rd"][s.position % 10] : "th"}</span>` : "", s.points !== null && s.points !== undefined ? `<span class="pl h">${s.points} pts</span>` : "", s.played ? `<span class="pl h">Played ${s.played}</span>` : ""].join("");
        const l = s.last, n = s.next;
        const pillOf = h => h === null || h === undefined ? "" : `<span class="pl h">${h ? "Home" : "Away"}</span>`;
        const lastBox = l ? `<div class="bx lastbx"><div class="lb"><span class="k"><b>Last result</b> &middot; ${e(l.dateLabel)}${l.comp ? " &middot; " + e(l.comp) : ""}</span>${pillOf(l.mineHome)}</div>
<div class="sl ${l.homeScore >= l.awayScore ? "lead" : ""}">${crest(l.homeId, l.homeName)}<span class="nm">${e(l.homeName)}</span><b>${l.homeScore}</b></div>
<div class="sl ${l.awayScore >= l.homeScore ? "lead" : ""}">${crest(l.awayId, l.awayName)}<span class="nm">${e(l.awayName)}</span><b>${l.awayScore}</b></div></div>`
          : `<div class="bx lastbx"><div class="lb"><span class="k"><b>Last result</b></span></div><div class="empty">No results available yet</div></div>`;
        // Next game: big weekday and date plus a countdown, teams stacked beside it.
        const countdown = cdOf(n);
        const nParts = n ? String(n.dateLabel || "").split(" ") : [];
        const nBig = n ? (n.dateLabel === "Date TBC" || nParts.length < 2 ? "TBC" : nParts[0].toUpperCase()) : "";
        const nSmall = n ? (nParts.length < 2 ? "" : nParts.slice(1).join(" ")) + (n.time ? (nParts.length < 2 ? "" : " &middot; ") + e(n.time) : "") : "";
        const nextBox = n ? `<div class="bx hero">${pillOf(n.mineHome).replace('class="pl h"', 'class="pl h ha"')}<div class="when"><div class="k"><b>Next game</b>${n.comp ? `<span class="ccomp">${e(n.comp)}</span>` : ""}</div><div class="d">${e(nBig)}</div><div class="d2">${nParts.length < 2 ? "" : e(nParts.slice(1).join(" ")) + (n.time ? " &middot; " + e(n.time) : "")}</div>${countdown ? `<span class="cd">${e(countdown)}</span>` : ""}</div>
<div class="vs"><div class="sl ${n.mineHome ? "lead" : ""}">${crest(n.homeId, n.homeName)}<span class="nm">${e(n.homeName)}</span></div>
<div class="sl ${n.mineHome ? "" : "lead"}">${crest(n.awayId, n.awayName)}<span class="nm">${e(n.awayName)}</span></div>
${n.venue ? `<div class="vn"><a class="dl" target="_blank" rel="noopener" href="${e(mapsLink(n.venue, n.homeName, n.venueElite).href)}">${e(n.venue)}<small> &middot; Tap for directions</small></a></div>` : ""}<div class="nlk"><a href="${e(viewHref(t, "match"))}">Match Stats</a><a href="${e(viewHref(t, "opposition"))}">Opposition Report</a></div></div></div>`
          : `<div class="bx hero"><div class="when"><div class="k"><b>Next game</b></div></div><div class="empty">No upcoming fixture found in this competition</div></div>`;
        return `<div class="rw" id="t${idx}" ${acStyle(t, idx)}>${extra}<div class="bx tbx"><div class="th">${crest(s.teamId, s.team)}<div class="tx"><div class="tn">${e(s.team)}</div><div class="sm">${e(s.league)}</div></div></div><div class="ps">${stats}</div>${s.gap ? `<div class="gapl">${e(s.gap)}</div>` : ""}${tsl}</div>${lastBox}${nextBox}</div>`;
      };
      let ly = url.searchParams.get("ly");
      if (!["classic", "next"].includes(ly)) ly = (await siteSettings()).matchCentre.layout;
      if (ly === "next" && results.length > 4) ly = "classic"; // too many columns for a TV: the classic rows
      const lyHtml = ly === "next" ? `<main class="ly ly-next" data-ly="next" style="--n:${results.length}">${results.map(colHtml).join("")}</main>`
        : "";
      const jump = results.map((r, i) => `<a href="#t${i}" ${acStyle(r.t, i)}>${e(shortOf(r.t))}</a>`).join("");
      const refreshScript = `<script>(function(){var loaded=Date.now(),MAX=${REFRESH_SECONDS * 1000};if(!window.matchMedia("(max-width:800px)").matches){setTimeout(function(){location.reload()},MAX);return}function tryReload(){if(Date.now()-loaded>=MAX&&document.visibilityState==="visible"&&window.scrollY<40)location.reload()}setInterval(tryReload,60000);document.addEventListener("visibilitychange",tryReload)})();</script>`;
      // "Updated" is when the RFU data was last pulled (oldest across the teams), not when the page loaded.
      const dataTimes = results.map(r => r.s && Number(r.s.updatedAt)).filter(Boolean);
      const stamp = londonTime(dataTimes.length ? Math.min(...dataTimes) : Date.now());
      const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><noscript><meta http-equiv="refresh" content="${REFRESH_SECONDS}"></noscript><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><title>${e(clubName)}</title>
<style>
:root{--bg:#080b0d;--card:#111719;--bd:#26312d;--tx:#f2f6f4;--mu:#93a59b;--wb:#163d26;--wt:#7fd89a;--lb:#4a1c1c;--lt:#f09595;--db:#46340f;--dt:#fac775;--hb:#1d2b36;--ht:#9ccaf0;--cb:#1b2a23;--ct:#7fd89a}
body.light{--bg:#eef2ef;--card:#fff;--bd:#cbd8ce;--tx:#18221c;--mu:#53665a;--wb:#d9efdf;--wt:#1d6b3a;--lb:#f8dcdc;--lt:#9b2c2c;--db:#fbecc8;--dt:#7a4d06;--hb:#dcebf6;--ht:#1d5a85;--cb:#e6efe9;--ct:#1d6b3a}
*{box-sizing:border-box}html{font-size:${results.length <= 3 ? "min(1.05vw,1.9vh)" : results.length === 4 ? "min(.85vw,1.4vh)" : results.length === 5 ? "min(.75vw,1.2vh)" : "min(.68vw,1.05vh)"}}
body{margin:0;height:100vh;height:100dvh;overflow:hidden;background:var(--bg);color:var(--tx);font-family:Arial,Helvetica,sans-serif;display:grid;grid-template-rows:auto ${ly === "classic" ? `repeat(${Math.max(results.length, 1)},minmax(0,1fr))` : "minmax(0,1fr)"};gap:.8rem;padding:max(1rem,env(safe-area-inset-top)) max(1.4rem,env(safe-area-inset-right)) max(1.9rem,env(safe-area-inset-bottom)) max(1.4rem,env(safe-area-inset-left))}
.hd{display:flex;justify-content:space-between;align-items:baseline;gap:1rem}.hd b{font-size:1.9rem;font-weight:700;letter-spacing:.01em}.hd span{font-size:.95rem;color:var(--mu)}
.rw{display:grid;grid-template-columns:.7fr 1.05fr 2.1fr;gap:.8rem;min-height:0;position:relative;padding-left:1.1rem}.rw::before{content:"";position:absolute;left:0;top:0;bottom:0;width:.45rem;border-radius:.3rem;background:var(--ac,var(--bd))}.rw>.bx{border-color:var(--at,var(--bd))}.rw>.bx.tbx{border-color:var(--ac,var(--bd));background:linear-gradient(var(--at,transparent),var(--at,transparent)),var(--card)}
.bx{background:var(--card);border:1px solid var(--bd);border-radius:1rem;padding:.7rem 1.1rem;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:.3rem;overflow:hidden}.bx.wide{grid-column:span 2}
.lb{display:flex;justify-content:space-between;align-items:center;font-size:.9rem;color:var(--mu)}.hdg{display:flex;align-items:baseline;gap:.4rem;min-width:0;flex-wrap:wrap}.hl{font-size:1.35rem;font-weight:700;color:var(--tx)}.dt{font-size:1.35rem;font-weight:700;color:var(--mu)}.jump{display:none}
.th{display:flex;align-items:center;gap:.7rem;min-width:0}.tx{min-width:0}.tn{font-size:1.7rem;font-weight:700;line-height:1.1}.sm{font-size:.9rem;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ps{display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.35rem}
.pl{font-size:.9rem;font-weight:700;padding:.12rem .75rem;border-radius:99px;white-space:nowrap}.pl.w{background:var(--wb);color:var(--wt)}.pl.l{background:var(--lb);color:var(--lt)}.pl.d{background:var(--db);color:var(--dt)}.pl.h{background:var(--hb);color:var(--ht)}
.sl{display:flex;align-items:center;gap:.6rem;font-size:1.25rem;color:var(--mu)}.sl.lead{color:var(--tx)}.sl .nm{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sl b{font-size:1.9rem;font-weight:700}
.nd{font-size:1.6rem;font-weight:700}.nt{display:flex;align-items:center;gap:.5rem;font-size:1.1rem;min-width:0}.nt .nm{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nt i{color:var(--mu);font-style:normal;font-size:.95rem}
.cr{position:relative;display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;flex:0 0 2rem;border-radius:50%;background:var(--cb);overflow:hidden}.th .cr{width:4rem;height:4rem;flex-basis:4rem}
.cr .ini{font-size:.7rem;font-weight:700;color:var(--ct)}.th .cr .ini{font-size:1.3rem}.cr img{position:absolute;inset:8%;width:84%;height:84%;object-fit:contain}.ly .cr,.ly .cnx .cr{background:none!important;overflow:visible}.ly .cr img{inset:0;width:100%;height:100%;object-fit:contain;border-radius:8%}.ly .cr .ini{display:flex;width:100%;height:100%;align-items:center;justify-content:center;border-radius:50%;background:var(--cb)}
.empty{color:var(--mu);font-size:1.05rem}
.k{font-size:1rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mu);font-weight:700}.k b{color:var(--tx)}
.lastbx{padding:.8rem 1.1rem;gap:.45rem}.lastbx .cr{width:2.4rem;height:2.4rem;flex-basis:2.4rem}.lastbx .cr .ini{font-size:.8rem}.lastbx .sl{font-size:1.35rem}.lastbx .sl b{font-size:2.3rem}
.rw>.bx.hero{position:relative;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:1.6rem;padding:.8rem 1.4rem;border:2px solid var(--ac,var(--bd));background:linear-gradient(135deg,rgba(255,255,255,.05),transparent 60%),var(--card)}
.hero .when .k{margin-bottom:.2rem}.ccomp{display:block;font-size:.95rem;font-weight:700;letter-spacing:.04em;text-transform:none;color:#f0c85a;margin-top:.15rem}body.light .ccomp{color:#8a5a00}.hero .d{font-size:3.6rem;font-weight:800;line-height:1}.hero .d2{font-size:1.5rem;color:var(--mu);font-weight:700;margin-top:.2rem}.hero .cd{display:inline-block;margin-top:.6rem;font-size:1.15rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:.25rem 1rem;border-radius:99px;background:var(--ac,var(--wb));color:var(--on,#fff)}
.vn a.dl{color:inherit;text-decoration:none}.vn a.dl small{opacity:.7;font-size:.8em;display:inline-block}@media (min-width:900px) and (min-height:561px){.vn a.dl small{display:none}.vn a.dl{pointer-events:none;cursor:default}}.hero .vs{display:flex;flex-direction:column;gap:.6rem;min-width:0}.hero .vs .sl{font-size:2.1rem;color:var(--tx)}.hero .vs .sl .nm{font-weight:700;white-space:normal;line-height:1.1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.hero .cr{width:4.2rem;height:4.2rem;flex-basis:4.2rem}.hero .cr .ini{font-size:1.4rem}.hero .vn{font-size:1.1rem;color:var(--mu)}
.gapl{font-size:1.05rem;color:var(--mu);margin-top:.4rem}
.hero .pl.ha{position:absolute;right:1.2rem;top:.9rem;font-size:1.1rem}
.hero>.empty{grid-column:1/-1}
.mbar,.tsl{display:none}
a,button{touch-action:manipulation}
:focus-visible{outline:3px solid var(--wt);outline-offset:2px}
.nlk{display:none}@media(max-width:800px){.nlk{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.6rem}.nlk a{font:700 .9rem Arial,Helvetica,sans-serif;color:var(--tx);background:var(--card);border:1px solid var(--bd);border-radius:99px;padding:.45rem .9rem;text-decoration:none}.mbar{display:flex;justify-content:space-between;align-items:center;gap:.5rem}.mbar a,.mbar button{font:700 .95rem Arial,Helvetica,sans-serif;color:var(--tx);background:var(--card);border:1px solid var(--bd);border-radius:99px;padding:.5rem .95rem;text-decoration:none;cursor:pointer}
.tsl{display:block;margin-top:.55rem;text-align:center;text-decoration:none;font-weight:700;font-size:.95rem;color:var(--ht);background:var(--hb);border-radius:.7rem;padding:.6rem .8rem}
html{font-size:15px;scroll-behavior:smooth}body{height:auto;overflow:visible;display:flex;flex-direction:column;gap:1.3rem;padding-top:max(.8rem,env(safe-area-inset-top))}
.hd{flex-direction:column;align-items:flex-start;gap:.2rem}.hd b{font-size:1.5rem}
.jump{display:flex;gap:.5rem;position:sticky;top:0;z-index:5;background:var(--bg);padding:.55rem 0;margin:0 -.2rem;border-bottom:1px solid var(--bd)}.jump a{flex:1;text-align:center;text-decoration:none;color:var(--tx);background:linear-gradient(var(--at,transparent),var(--at,transparent)),var(--card);border:1px solid var(--ac,var(--bd));border-radius:99px;padding:.5rem .4rem;font-size:.95rem;font-weight:700}
.rw{display:block;background:var(--card);border:1px solid var(--bd);border-radius:1rem;scroll-margin-top:4.2rem}
.rw>.bx{background:transparent;border:0;border-radius:0;border-top:1px solid var(--bd);padding:.95rem 1.05rem;gap:.45rem}.rw>.bx.wide{grid-column:auto}
.rw{padding-left:0;border-top:.4rem solid var(--ac,var(--bd))}.rw::before{display:none}.rw>.bx{border-color:var(--bd)}.rw>.bx.tbx{border-top:0;background:linear-gradient(var(--at,transparent),var(--at,transparent)),var(--cb);border-radius:.6rem .6rem 0 0}.rw>.bx:last-child{border-radius:0 0 1rem 1rem}
.rw>.bx.hero{display:block;border:0;border-top:1px solid var(--bd);background:transparent}.hero .when{margin-bottom:.6rem}.hero .k{display:inline-block;margin-right:.6rem}.hero .d,.hero .d2{display:inline-block;font-size:1.5rem;margin:0 .45rem 0 0}.hero .d{font-weight:800}.hero .cd{margin:0;font-size:.9rem;padding:.15rem .7rem}.hero .vs .sl{font-size:1.15rem}.hero .cr{width:2.3rem;height:2.3rem;flex-basis:2.3rem}.hero .cr .ini{font-size:.8rem}.hero .pl.ha{top:.95rem;right:1.05rem;font-size:.85rem}.lastbx .sl{font-size:1.1rem}.lastbx .sl b{font-size:1.6rem}.lastbx .cr{width:1.9rem;height:1.9rem;flex-basis:1.9rem}
.tn{font-size:1.4rem}.th .cr{width:2.8rem;height:2.8rem;flex-basis:2.8rem}.sl{font-size:1.1rem}.sl b{font-size:1.6rem}.hl{font-size:1.25rem}.dt{font-size:1.25rem}.cr{width:1.9rem;height:1.9rem;flex-basis:1.9rem}}
.stab,.tbar{display:none}
@media(min-width:801px){body.ly-on .rw{display:none}body.ly-on .ly-next{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:1rem;min-height:0}}
@media(max-width:800px){.ly{display:none!important}}
.cw{display:flex;flex-direction:column;min-height:0;border-radius:1.1rem;overflow:hidden;background:var(--card);border:1px solid var(--bd)}
.ch{display:flex;align-items:center;gap:.8rem;padding:.7rem 1.1rem;border-bottom:.4rem solid var(--ac)}.ch .cr{width:3.6rem;height:3.6rem;flex-basis:3.6rem}.ch .cr .ini{font-size:1.2rem}.cx{min-width:0}.cn{font-size:2.1rem;font-weight:800;line-height:1.45;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cl{font-size:.95rem;line-height:1.5;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cnx{flex:60 1 0;min-height:0;background:var(--ac);color:var(--on);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.7rem;text-align:center;padding:1rem;overflow:hidden}.cnx .k,.cnx .k b{color:var(--on)}.cnx .k{opacity:.95;font-size:1.8rem;letter-spacing:.16em}.cnx .cr{width:8rem;height:8rem;flex-basis:8rem;background:rgba(255,255,255,.92)}.cnx .cr .ini{font-size:2.6rem}.cnx .cr img{inset:14%;width:72%;height:72%}
.cnx .on{font-size:2.9rem;font-weight:800;line-height:1.45;max-width:100%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.cnx .od{font-size:2.1rem;font-weight:800}.cnx .oc{display:flex;gap:.7rem;align-items:center;justify-content:center;flex-wrap:wrap;font-size:1.4rem;font-weight:800}.cnx .oc span{background:var(--on);color:var(--ac);border-radius:.5rem;padding:.15rem .8rem;text-transform:uppercase;letter-spacing:.06em}.cnx .oc i{font-style:normal}.cnx .og,.cnx .oq{max-width:100%;line-height:1.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cnx .og{font-size:1.25rem;font-weight:700}.cnx .oq{font-size:1.3rem;font-weight:800}.bq{color:var(--tx);font-weight:700}
.clw{flex:40 1 0;min-height:0;display:flex;flex-direction:column}.cls{flex:1;min-height:0;display:flex;align-items:center;gap:1.2rem;padding:.8rem 1.1rem;border-bottom:1px solid var(--bd)}.cls .cr{width:5.6rem;height:5.6rem;flex-basis:5.6rem}.cls .cr .ini{font-size:1.1rem}.ln{min-width:0}.rs{display:flex;align-items:center;gap:.6rem}.dsh{font-style:normal;margin:0 .14em}.rsc{font-size:4rem;font-weight:800;line-height:1}.lo{font-size:1.5rem;line-height:1.5;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ctb{flex:none;padding:1rem 1.1rem 1.1rem;display:flex;align-items:baseline;gap:.8rem;flex-wrap:wrap;line-height:1.25}.ps2{font-size:2.4rem;font-weight:800;line-height:1.2}.pt{font-size:1.3rem;font-weight:700}.pd{font-size:1.1rem;color:var(--mu)}
.rs-a .rw,.rs-b .rw,.rs-c .rw,.rs-d .rw{padding-left:0}.rs-a .rw::before,.rs-b .rw::before,.rs-c .rw::before,.rs-d .rw::before{display:none}
.rs-a .rw>.bx,.rs-b .rw>.bx,.rs-c .rw>.bx,.rs-d .rw>.bx{border-color:var(--bd)}
.rs-b .rw>.bx.tbx,.rs-c .rw>.bx.tbx,.rs-d .rw>.bx.tbx{background:var(--card);border-color:var(--bd)}
.rs-a .rw>.bx.tbx{background:var(--ac);border-color:var(--ac)}.rs-a .rw>.bx.tbx .tn,.rs-a .rw>.bx.tbx .sm{color:var(--on)}.rs-a .rw>.bx.tbx .pl.h{background:rgba(0,0,0,.22);color:var(--on)}.rs-a .rw>.bx.tbx .cr{background:rgba(255,255,255,.85)}
.rs-b .rw{grid-template-rows:auto minmax(0,1fr);gap:0 .8rem}.rs-b .tbar{display:flex;align-items:baseline;gap:1rem;grid-column:1/-1;background:var(--ac);color:var(--on);font-size:1.35rem;font-weight:700;padding:.3rem 1rem;border-radius:.8rem .8rem 0 0;margin-bottom:.4rem}.rs-b .tbar span{font-size:.95rem;font-weight:400;opacity:.85}.rs-b .rw>.bx.tbx .tx{display:none}
.rs-c .rw{border:.22rem solid var(--ac);background:var(--at);border-radius:1.1rem;padding:.4rem}
.rs-d .rw{grid-template-columns:3rem 1fr 1.45fr 1.45fr}.rs-d .stab{display:flex;align-items:center;justify-content:center;background:var(--ac);color:var(--on);border-radius:.8rem;writing-mode:vertical-rl;transform:rotate(180deg);font-size:1.5rem;font-weight:700;letter-spacing:.04em;white-space:nowrap;overflow:hidden}
@media(max-width:800px){.rs-a .rw,.rs-b .rw,.rs-c .rw,.rs-d .rw{border-top:1px solid var(--bd);overflow:hidden}
.rs-a .rw>.bx.tbx{border-radius:0}
.rs-b .tbar{display:block;margin:0;border-radius:0;font-size:1.2rem;padding:.6rem 1.05rem}.rs-b .tbar span{display:block;font-size:.85rem}
.rs-c .rw{border:.25rem solid var(--ac);padding:0;background:var(--card)}
.rs-d .stab{display:block;writing-mode:horizontal-tb;transform:none;font-size:1.05rem;padding:.45rem 1.05rem;border-radius:0;text-align:left}}
</style></head><body class="${theme}${rowStyle === "tint" ? "" : " rs-" + rowStyle}${ly === "classic" ? "" : " ly-on"}">${themeBoot('window.matchMedia("(max-width:800px)").matches')}<nav class="mbar"><a href="${e(menuHref)}">&lsaquo; Home</a><button type="button" class="tgl">Light mode</button></nav><div class="hd"><b>${e(clubName)}</b><span>Updated ${e(stamp)} &middot; refreshes every hour</span></div><nav class="jump">${jump}</nav>${lyHtml}${results.map(rowHtml).join("")}${themeToggleScript}${refreshScript}</body></html>`;
      return new Response(page, {headers: {"Content-Type": "text/html;charset=utf-8", "Cache-Control": "public,max-age=300"}});
    }

    const season = url.searchParams.get("season") || AUTO.season;
    const competition = AUTO.competition || url.searchParams.get("competition") || "1699";
    const division = AUTO.division || url.searchParams.get("division") || "75791";
    const teamId = url.searchParams.get("team") || "11039";
    const teamName = url.searchParams.get("teamName") || "Ivybridge";
    // The Ivybridge 2nd XV is "The Vandals" (older links may still say 2nd XV or 2XV).
    let friendlyName = (url.searchParams.get("friendlyName") || "").trim();
    if (/^Ivybridge\s+(2nd\s*XV|2\s*XV)$/i.test(friendlyName)) friendlyName = "The Vandals";
    if (!friendlyName && url.searchParams.has("friendlyName") === false) {
      const known = TEAMS.find(t => t.team === String(teamId) && t.division === String(division));
      if (known) friendlyName = known.name;
    }
    const titleOverride = url.searchParams.get("title") || "";
    const theme = (url.searchParams.get("theme") || "dark").toLowerCase() === "light" ? "light" : "dark";
    // layout: "tv" (default, original single-screen layout), "mobile" (always
    // phone layout) or "auto" (phone layout on screens narrower than 700px).
    const layoutParam = (url.searchParams.get("layout") || "tv").toLowerCase();
    const layout = ["tv","mobile","auto"].includes(layoutParam) ? layoutParam : "tv";

    const api = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
    api.searchParams.set("season", season);
    api.searchParams.set("competitionId", competition);
    api.searchParams.set("groupId", division);

    try {
      const feed = await cachedText(api, "application/json, text/plain, */*");
      const body = feed.text;
      const dataTime = feed.fetchedAt;
      if (!feed.ok) {
        return new Response(`RFU API returned HTTP ${feed.status}\n${body}`, {
          status: 502, headers: {"Content-Type":"text/plain;charset=utf-8"}
        });
      }
      const data = JSON.parse(body);

      // Traverse nested arrays/objects once. RFU's response contains nested
      // fixture structures, so do not assume fixtures/results are flat arrays.
      const allObjects = [];
      const visited = new WeakSet();
      function collect(value) {
        if (!value || typeof value !== "object" || visited.has(value)) return;
        visited.add(value);
        if (Array.isArray(value)) {
          for (const child of value) collect(child);
          return;
        }
        allObjects.push(value);
        for (const [key, child] of Object.entries(value)) {
          if (key !== "html" && key !== "description") collect(child);
        }
      }
      collect(data);

      const num = value => {
        if (value === null || value === undefined || value === "") return null;
        const n = Number(value);
        return Number.isFinite(n) ? n : null;
      };
      // Decode HTML entities repeatedly: RFU text can arrive double-encoded
      // (e.g. "&amp;amp;"), and output is re-escaped by esc() when rendered.
      const decodeEntities = input => {
        let str = String(input ?? "");
        for (let i = 0; i < 4; i++) {
          const next = str
            .replace(/&nbsp;|&#160;/gi, " ")
            .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
            .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
            .replace(/&quot;/gi, '"').replace(/&apos;/gi, "'")
            .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
            .replace(/&amp;/gi, "&");
          if (next === str) break;
          str = next;
        }
        return str;
      };
      const teamIdOf = t => String(t?.commonId ?? t?.id ?? "");
      const teamNameOf = t => decodeEntities(t?.name || t?.displayName || t?.clubName || "");

      // Find all match-like objects, regardless of nesting.
      const resultObjects = [];
      const fixtureObjects = [];
      function findMatches(root) {
        const found = [];
        const seen = new WeakSet();
        function visit(v) {
          if (!v || typeof v !== "object" || seen.has(v)) return;
          seen.add(v);
          if (Array.isArray(v)) {
            for (const x of v) visit(x);
            return;
          }
          if (v.homeTeam && v.awayTeam &&
              typeof v.homeTeam === "object" && typeof v.awayTeam === "object") {
            found.push(v);
          }
          for (const [k, x] of Object.entries(v)) {
            if (k !== "html" && k !== "description") visit(x);
          }
        }
        visit(root);
        return found;
      }
      for (const m of findMatches(data.results)) resultObjects.push(m);
      for (const m of findMatches(data.fixtures)) fixtureObjects.push(m);

      // Fallback: some RFU responses place matches elsewhere.
      if (!resultObjects.length && !fixtureObjects.length) {
        for (const m of findMatches(data)) resultObjects.push(m);
      }

      // Prefer group/division names from RFU payload. Search nested objects
      // instead of only checking the top-level response.
      const groupNames = [];
      const competitionNames = [];
      for (const obj of allObjects) {
        if (obj.group && typeof obj.group === "object") {
          if (obj.group.name) groupNames.push(String(obj.group.name));
          if (obj.group.displayName) groupNames.push(String(obj.group.displayName));
        }
        if (obj.division && typeof obj.division === "object" && obj.division.name) {
          groupNames.push(String(obj.division.name));
        }
        if (obj.competition && typeof obj.competition === "object" && obj.competition.name) {
          competitionNames.push(String(obj.competition.name));
        }
      }
      const unique = arr => [...new Set(arr.filter(Boolean))];
      const leagueTitle = titleOverride ||
        unique(groupNames).find(n => /regional|league|division|tribute|championship|prem/i.test(n)) ||
        unique(groupNames)[0] ||
        unique(competitionNames).find(n => /regional|league|division|tribute|championship|prem/i.test(n)) ||
        unique(competitionNames)[0] ||
        `RFU League Table – ${season}`;

      const tableTeams = new Map();
      function ensure(team) {
        const id = teamIdOf(team);
        const name = teamNameOf(team);
        if (!id && !name) return null;
        const key = id || name.toLowerCase();
        if (!tableTeams.has(key)) {
          tableTeams.set(key, {
            id: id || key, name: name || "Unknown",
            p:0,w:0,d:0,l:0,pf:0,pa:0,bp:0,tb:0,lb:0,pts:0
          });
        } else if (name && tableTeams.get(key).name === "Unknown") {
          tableTeams.get(key).name = name;
        }
        return tableTeams.get(key);
      }

      // Seed the division from BOTH fixtures and results. This ensures clubs
      // with no completed matches yet still appear in the table.
      for (const match of [...fixtureObjects, ...resultObjects]) {
        ensure(match.homeTeam);
        ensure(match.awayTeam);
      }

      // Deduplicate completed results before calculating played statistics.
      const seenResults = new Set();
      let bonusSupplied = 0, bonusEstimated = 0;
      for (const match of resultObjects) {
        const h = match.homeTeam, a = match.awayTeam;
        const hs = num(h?.score), as = num(a?.score);
        if (hs === null || as === null) continue;
        // 0-0 is treated as an unplayed placeholder everywhere else in this file.
        if (hs === 0 && as === 0) continue;

        const resultKey = [
          match.date || "",
          teamIdOf(h) || teamNameOf(h),
          teamIdOf(a) || teamNameOf(a),
          hs, as
        ].join("|");
        if (seenResults.has(resultKey)) continue;
        seenResults.add(resultKey);

        const H = ensure(h), A = ensure(a);
        if (!H || !A) continue;
        H.p++; A.p++;
        H.pf += hs; H.pa += as;
        A.pf += as; A.pa += hs;

        // Bonus points. Prefer the value RFU supplies; otherwise work it out
        // from the score (and tries, if the feed includes them) for BOTH sides
        // so every team is treated the same way.
        const triesOf = t => num(t?.tries ?? t?.triesScored ?? t?.try);
        const bonusFor = (side, own, opp) => {
          const supplied = num(side?.bonusPoints ?? side?.bonus ?? side?.bp);
          if (supplied !== null) { bonusSupplied++; return {tb:supplied, lb:0}; }
          bonusEstimated++;
          const tr = triesOf(side);
          return {
            tb: tr !== null && tr >= 4 ? 1 : 0,                 // 4+ tries bonus
            lb: own < opp && opp - own <= 7 ? 1 : 0            // losing bonus
          };
        };
        const hb = bonusFor(h, hs, as), ab = bonusFor(a, as, hs);
        H.tb += hb.tb; H.lb += hb.lb; H.bp += hb.tb + hb.lb;
        A.tb += ab.tb; A.lb += ab.lb; A.bp += ab.tb + ab.lb;
        if (hs > as) { H.w++; A.l++; H.pts += 4; }
        else if (hs < as) { A.w++; H.l++; A.pts += 4; }
        else { H.d++; A.d++; H.pts += 2; A.pts += 2; }
      }

      const computedTable = [...tableTeams.values()].map(t => {
        t.pd = t.pf - t.pa;
        t.pts += t.bp;
        return t;
      }).sort((a,b) =>
        b.pts-a.pts || b.w-a.w || b.pd-a.pd ||
        b.pf-a.pf || a.name.localeCompare(b.name)
      );

      // League table. Preferred source: the leagueTables section of the RFU feed we already read (played, won, drawn, lost,
      // points for/against, try and loss bonus points, adjustments, position), so no extra request is needed.
      // Fallback 1: the official englandrugby.com table page. Fallback 2: the table calculated from results above.
      const tableFromFeed = () => {
        const lt = data && data.leagueTables;
        const list = lt && Array.isArray(lt.tables) ? lt.tables : [];
        if (!list.length) throw new Error("no leagueTables in the feed");
        const tb = list.find(t => String(t && t.groupId) === String(division)) || (list.length === 1 ? list[0] : null);
        if (!tb || !Array.isArray(tb.teams) || !tb.teams.length) throw new Error("no table for this division in the feed");
        const rows = [];
        for (const x of tb.teams) {
          const f = k => Number(x && x[k]);
          const n = [f("played"), f("won"), f("draw"), f("lost"), f("pointsFor"), f("pointsAgainst"), f("pointsDifference"), f("tryBonusPoints"), f("lossBonusPoints"), f("points")];
          if (!x || x.teamId == null || !x.teamName || n.some(v => !Number.isFinite(v))) throw new Error("table row not understood");
          const [p, w, d, l, pf, pa, pd, tbp, lbp, pts] = n;
          rows.push({ id: String(x.teamId), name: decodeEntities(String(x.teamName).trim()), p, w, d, l, pf, pa, pd, tb: tbp, lb: lbp, bp: tbp + lbp, pts, pos: Number(x.tablePosition) || 0 });
        }
        rows.sort((a, b) => (a.pos || 999) - (b.pos || 999));
        return rows.map(({ pos, ...rest }) => rest);
      };
      const tableFromPage = async () => {
        const pageUrl = new URL("https://www.englandrugby.com/fixtures-and-results/search-results");
        pageUrl.searchParams.set("team", teamId);
        pageUrl.searchParams.set("competition", competition);
        pageUrl.searchParams.set("division", division);
        pageUrl.searchParams.set("season", season);
        const pr = await cachedText(pageUrl, "text/html,application/xhtml+xml");
        if (pr.blocked) throw new Error("blocked by the RFU robot check");
        if (!pr.ok) throw new Error("HTTP " + pr.status);
        const html = pr.text;
        const start = html.indexOf('<table class="league-table');
        if (start < 0) throw new Error("league table not found in page");
        const tbl = html.slice(start, html.indexOf("</table>", start));
        const decode = decodeEntities;
        const rows = [];
        for (const m of tbl.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
          const tr = m[1];
          const idm = tr.match(/team=(\d+)/);
          const nm = tr.match(/class="c074-link">([^<]*)</);
          const cells = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)]
            .map(c => c[1].replace(/<[^>]+>/g,"").trim());
          if (!idm || !nm || cells.length < 12) continue;
          const n = cells.slice(2).map(x => Number(x));
          if (n.some(x => !Number.isFinite(x))) continue;
          const [p,w,d,l,pf,pa,pd,tb,lb,pts] = n;
          rows.push({id:idm[1], name:decode(nm[1].trim()), p,w,d,l,pf,pa,pd,tb,lb,bp:tb+lb,pts});
        }
        if (!rows.length) throw new Error("no table rows parsed");
        return rows;
      };
      const compareTables = url.searchParams.get("debug") === "1" && isDev === true;
      let feedTable = null, feedTableError = null, pageTable = null, pageTableError = null;
      try { feedTable = tableFromFeed(); } catch (err) { feedTableError = String(err && err.message || err); }
      const webOn = (await siteSettings()).features.webfallback !== false;
      if (!feedTable && !webOn) pageTableError = "the website back-up is turned off in Admin";
      if ((!feedTable && webOn) || compareTables) { try { pageTable = await tableFromPage(); } catch (err) { pageTableError = String(err && err.message || err); } }
      const rfuTable = feedTable || pageTable;
      const rfuTableError = rfuTable ? null : [feedTableError, pageTableError].filter(Boolean).join("; ");
      const tableFrom = feedTable ? "RFU feed (leagueTables)" : pageTable ? "englandrugby.com league table" : "calculated from results";
      const table = rfuTable || computedTable;

      if (isDev === true && url.searchParams.get("debug") === "1") {
        return new Response(JSON.stringify({
          resultsFound: resultObjects.length,
          completedCounted: seenResults.size,
          zeroZeroCounted: resultObjects.filter(m => num(m.homeTeam?.score) === 0 && num(m.awayTeam?.score) === 0).length,
          tableSource: tableFrom, rfuTableError, feedTableError, pageTableError,
          tableCompare: feedTable && pageTable ? (() => { const pm = new Map(pageTable.map(x => [x.id, x])); const diffs = []; for (const f of feedTable) { const q = pm.get(f.id); if (!q) { diffs.push({ team: f.name, issue: "not in page table" }); continue; } for (const k of ["p","w","d","l","pf","pa","pd","tb","lb","pts"]) if (f[k] !== q[k]) diffs.push({ team: f.name, field: k, feed: f[k], page: q[k] }); } if (feedTable.length !== pageTable.length) diffs.push({ issue: "different number of teams", feed: feedTable.length, page: pageTable.length }); const order = feedTable.map(x => x.id).join() === pageTable.map(x => x.id).join(); return { same: !diffs.length, sameOrder: order, differences: diffs }; })() : undefined,
          unscored: (() => {
            const seen = new Set(), unscored = [], dupes = [];
            for (const mm of resultObjects) {
              const hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score);
              if (hs === null || as === null) { unscored.push(mm); continue; }
              if (hs === 0 && as === 0) { unscored.push(mm); continue; }
              const k = [mm.date || "", teamIdOf(mm.homeTeam) || teamNameOf(mm.homeTeam), teamIdOf(mm.awayTeam) || teamNameOf(mm.awayTeam), hs, as].join("|");
              if (seen.has(k)) dupes.push(mm); else seen.add(k);
            }
            const now = Date.now();
            const pastFixtures = fixtureObjects.filter(mm => { const d = new Date(mm.date || mm.time || ""); return !Number.isNaN(d.getTime()) && d.getTime() < now - 36 * 3600 * 1000; });
            const calcP = new Map(computedTable.map(t => [String(t.id), t.p]));
            const playedGap = (feedTable || []).filter(t => calcP.has(String(t.id)) && calcP.get(String(t.id)) !== t.p).map(t => ({ team: t.name, tablePlayed: t.p, resultsCounted: calcP.get(String(t.id)) }));
            const slim = mm => ({ id: mm.id, type: mm.type, date: mm.date, time: mm.time, home: { name: mm.homeTeam?.name, id: mm.homeTeam?.commonId, score: mm.homeTeam?.score }, away: { name: mm.awayTeam?.name, id: mm.awayTeam?.commonId, score: mm.awayTeam?.score }, matchKeys: Object.keys(mm), walkover: (() => { const q = walkoverInfo(mm); return q ? (q.homeWins ? "home side awarded the win" : "away side awarded the win") : null; })(), raw: mm });
            return { unscoredCount: unscored.length, unscored: unscored.slice(0, 12).map(slim), duplicateCount: dupes.length, duplicates: dupes.slice(0, 5).map(slim), pastFixturesWithNoResultCount: pastFixtures.length, pastFixturesWithNoResult: pastFixtures.slice(0, 12).map(slim), playedGap };
          })(),
          calculatedTable: computedTable.map(t => ({name:t.name,p:t.p,bp:t.bp,pts:t.pts})),
          bonusSupplied, bonusEstimated,
          sampleMatchKeys: resultObjects[0] ? { match: Object.keys(resultObjects[0]), home: Object.keys(resultObjects[0].homeTeam || {}) } : null,
          bonusLikeFields: (() => {
            const out = {};
            const walk = (v, path, depth) => {
              if (!v || typeof v !== "object" || depth > 6) return;
              if (Array.isArray(v)) { v.slice(0,3).forEach(x => walk(x, path, depth+1)); return; }
              for (const [k, x] of Object.entries(v)) {
                if (/bonus|tries|try|point|pts|deduct|status|walkover|forfeit/i.test(k) && (x === null || typeof x !== "object")) {
                  const key = path + "." + k;
                  if (!out[key]) out[key] = x;
                } else if (k !== "html" && k !== "description") walk(x, path + "." + k, depth+1);
              }
            };
            walk(resultObjects.slice(0, 40), "match", 0);
            return out;
          })(),
          rawSampleMatches: resultObjects.filter(m => Math.abs((num(m.homeTeam?.score)||0) - (num(m.awayTeam?.score)||0)) >= 30).slice(0, 2),
          table: table.map(t => ({name:t.name,p:t.p,w:t.w,d:t.d,l:t.l,bp:t.bp,tb:t.tb,lb:t.lb,pts:t.pts}))
        }, null, 2), { headers: {"Content-Type":"application/json;charset=utf-8"} });
      }

      const selectedName = teamName.trim().toLowerCase();
      const isSelected = t =>
        String(t.id) === String(teamId) ||
        t.name.trim().toLowerCase() === selectedName;
      const selectedTeam = table.find(isSelected) || null;
      const selectedActualName = selectedTeam?.name || teamName;
      const displayTeamName = friendlyName || selectedActualName;
      // v3.9: the club's own name (for "Home at ...", Directions and weather) comes from the team's real name in the RFU data, not the friendly name (which may be just "Colts").
      const ownClubName = (() => { const t = selectedTeam && selectedTeam.name ? selectedTeam.name : (teamName && !/^__none__$/.test(teamName) ? teamName : ""); return t ? clubOf(t) : clubOf(displayTeamName); })();
      const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
      const dateOf = m => {
        const raw = m.date || m.fixtureDate || m.matchDate || m.startDate || m.kickoffDate || m.kickOffDate || "";
        const d = new Date(raw);
        return Number.isNaN(d.getTime()) ? null : d;
      };
      // Keep completed results and scheduled fixtures separate. The RFU
      // fixtures collection can contain historical 0-0 placeholders; merging
      // it into results caused old fixtures to appear as recent draws.
      const belongsToSelectedTeam = m => {
        const h = m.homeTeam, a = m.awayTeam;
        return String(teamIdOf(h)) === String(teamId) || String(teamIdOf(a)) === String(teamId) ||
          teamNameOf(h).trim().toLowerCase() === selectedName || teamNameOf(a).trim().toLowerCase() === selectedName;
      };
      const matchKey = m => [dateOf(m)?.toISOString() || "", teamIdOf(m.homeTeam), teamIdOf(m.awayTeam), num(m.homeTeam?.score), num(m.awayTeam?.score)].join("|");
      const uniqueResults = [...new Map(resultObjects.filter(belongsToSelectedTeam).map(m => [matchKey(m),m])).values()];
      // Only the RFU results collection is authoritative for played matches.
      // A 0-0 score is treated as an unplayed placeholder, not a rugby result.
      const completed = uniqueResults.filter(m => {
        if (walkoverInfo(m)) return true;
        const hs=num(m.homeTeam?.score), as=num(m.awayTeam?.score);
        return hs !== null && as !== null && !(hs === 0 && as === 0);
      }).sort((a,b) => (dateOf(b)?.getTime() || 0) - (dateOf(a)?.getTime() || 0));
      const uniqueFixtures = [...new Map(fixtureObjects.filter(belongsToSelectedTeam).map(m => [matchKey(m),m])).values()];
      const upcoming = uniqueFixtures.filter(m => {
        const hs=num(m.homeTeam?.score), as=num(m.awayTeam?.score);
        return (hs === null || as === null || (hs === 0 && as === 0)) && dateOf(m) && dateOf(m).getTime() >= Date.now() - 86400000;
      }).sort((a,b) => (dateOf(a)?.getTime() || 0) - (dateOf(b)?.getTime() || 0));
      const getSide = m => {
        const home = String(teamIdOf(m.homeTeam)) === String(teamId) || teamNameOf(m.homeTeam).trim().toLowerCase() === selectedName;
        const wi = walkoverInfo(m);
        const mineScore = num((home?m.homeTeam:m.awayTeam)?.score), oppScore = num((home?m.awayTeam:m.homeTeam)?.score);
        const res = wi ? (wi.homeWins === home ? "W" : "L") : (mineScore > oppScore ? "W" : mineScore < oppScore ? "L" : "D");
        return {home, mine:home?m.homeTeam:m.awayTeam, opponent:home?m.awayTeam:m.homeTeam, mineScore, oppScore, wo: !!wi, res};
      };
      // completed is sorted newest-first; preserve that order left-to-right in the form strip.
      const form = completed.slice(0,5).map(m => {
        return getSide(m).res;
      });
      const selectedStats = selectedTeam || {p:0,w:0,d:0,l:0,pf:0,pa:0,pd:0,bp:0,tb:0,lb:0,pts:0};
      const homeMatches = completed.map(m=>({m,x:getSide(m)})).filter(z=>z.x.home);
      const awayMatches = completed.map(m=>({m,x:getSide(m)})).filter(z=>!z.x.home);
      const record = arr => ({p:arr.length,w:arr.filter(z=>z.x.res==="W").length,d:arr.filter(z=>z.x.res==="D").length,l:arr.filter(z=>z.x.res==="L").length});
      const homeRecord=record(homeMatches), awayRecord=record(awayMatches);
      const dateLabel = m => { const d=dateOf(m); return d?d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",timeZone:"Europe/London"}):"Date TBC"; };
      const next = upcoming[0] || null;
      // RFU club crests use a predictable public image path keyed by the fixture's team ID.
      const crestFor = id => id ? `https://images.englandrugby.com/club_images/${encodeURIComponent(id)}.png` : "";
            const nextSide = next ? getSide(next) : null;
      const gap = gapInfo(table, selectedTeam);
      const runIn = runInInfo(table, upcoming.map(m => teamIdOf(getSide(m).opponent)));
      // "This game" difficulty comes from the Opposition report data. It loads after the page shows (phone layouts only), so the team page is not held up.
      let gdQ = "";
      if (layout !== "tv" && next && nextSide) {
        const sp = new URLSearchParams(url.search);
        for (const k of ["layout", "embed", "app", "force", "view", "theme"]) sp.delete(k);
        sp.set("format", "summary"); sp.set("detail", "opposition"); sp.set("frag", "gd"); sp.set("nowx", "1");
        gdQ = sp.toString();
      }
      const hl = highlightsInfo(completed.filter(m => !walkoverInfo(m)).map(m => { const x = getSide(m); return { mine: x.mineScore, opp: x.oppScore }; }));
      const leaders = leadersInfo(table, selectedTeam);
      const dayL = dd => dd.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
      const playedFx = mm => { const hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score); return hs !== null && as !== null && !(hs === 0 && as === 0); };
      const ownAround = selectedTeam ? aroundInfo({ table, myId: teamId, todayStr: dayL(new Date()), day: dayL, fixtures: fixtureObjects.map(mm => ({ d: dateOf(mm), hId: teamIdOf(mm.homeTeam), hName: teamNameOf(mm.homeTeam), aId: teamIdOf(mm.awayTeam), aName: teamNameOf(mm.awayTeam), played: playedFx(mm) })) }) : null;
      const ownLuck = selectedTeam ? luckInfo(table, selectedTeam.id, completed.filter(m => { const x = getSide(m); return !x.wo && Math.abs(x.mineScore - x.oppScore) <= 7; }).slice().reverse().map(m => getSide(m).res), completed.length) : null;
      const lastFive = completed.slice(0,5);
      const formHtml = form.length ? form.map((f,i)=>`<span class="form ${f.toLowerCase()}${i === 0 ? " new" : ""}" title="${i === 0 ? "Most recent: " : ""}${f}">${f}</span>`).join("") : `<span class="muted">No completed matches yet</span>`;
      const resultHtml = lastFive.length ? lastFive.map(m=>{
        const x=getSide(m), cls=x.res==="W"?"win":x.res==="L"?"loss":"draw";
        return `<div class="result ${cls}"><span class="result-date">${esc(dateLabel(m))}</span><span class="result-opponent">${x.home?"HOME":"AWAY"} • ${esc(teamNameOf(x.opponent)||"Opponent")}</span><strong>${x.wo?"W/O":`${x.mineScore}–${x.oppScore}`}</strong><span class="result-outcome">${cls.toUpperCase()}</span></div>`;
      }).join("") : `<div class="empty">No results available yet</div>`;
      const venueLabel = value => {
        if (typeof value === "string") return value.trim();
        if (value && typeof value === "object") {
          const direct = value.name || value.displayName || value.title || value.address || value.label || value.venueName || value.locationName || value.groundName;
          if (typeof direct === "string" && direct.trim()) return direct.trim();
          // RFU sometimes wraps the actual location inside another object.
          for (const key of ["location", "venue", "ground", "facility", "club", "site", "address"]) {
            const nested = venueLabel(value[key]);
            if (nested) return nested;
          }
        }
        return "";
      };
      const findVenueDeep = match => {
        if (!match || typeof match !== "object") return "";
        const preferredKeys = /^((location|venue|ground|facility|stadium|site|address|pitch|playingvenue|matchvenue|matchground|matchlocation)(name|info|details?|label)?)$/i;
        const seen = new WeakSet();
        function walk(value) {
          if (!value || typeof value !== "object" || seen.has(value)) return "";
          seen.add(value);
          if (Array.isArray(value)) {
            for (const item of value) { const found = walk(item); if (found) return found; }
            return "";
          }
          // First look for named location properties at this level.
          for (const [key, child] of Object.entries(value)) {
            if (preferredKeys.test(key)) {
              const label = venueLabel(child);
              if (label) return label;
            }
          }
          // Then search nested fixture/team metadata for those properties.
          for (const [key, child] of Object.entries(value)) {
            if (key !== "html" && key !== "description") {
              const found = walk(child);
              if (found) return found;
            }
          }
          return "";
        }
        return walk(match);
      };
      const vt = [];
      let nextVenue = next ? (venueLabel(next.stadium) || venueLabel(next.location) || venueLabel(next.venue) || venueLabel(next.ground) || venueLabel(next.facility) || findVenueDeep(next)) : "";

      const venueLike = (o, path = "", depth = 0, out = {}) => {
        if (!o || typeof o !== "object" || depth > 3) return out;
        for (const [k, v] of Object.entries(o)) {
          const here = path ? path + "." + k : k;
          if (v && typeof v === "object") venueLike(v, here, depth + 1, out);
          else if (/venue|stadium|ground|location|facility|pitch|address/i.test(k)) out[here] = v;
        }
        return out;
      };
      vt.push({step:"feed", venueLikeFields: next ? venueLike(next) : null, venue: nextVenue || null, stadiumRaw: next ? (next.stadium === undefined ? "(absent)" : next.stadium) : null, next: next ? {id: next.id, type: next.type, elite: next.elite, source: next.source, date: next.date, home: next.homeTeam && next.homeTeam.name, away: next.awayTeam && next.awayTeam.name, keys: Object.keys(next)} : null});
      // The RFU match-centre page contains the published Location even when
      // the full-matches JSON omits it. Read the same page used by the RFU site.
      // v3.16: ask the RFU data service first (one small call, with the map position); the website page below is only the fallback.
      if (next && !nextVenue && next.id && !(isDev === true && url.searchParams.get("venueweb") === "1")) {
        const gv = await gmsVenue(next.id);
        vt.push({step:"rfu-match-record", ok: !!gv, venue: gv ? gv.venue : null, postcode: gv ? gv.postcode : null, coordinates: !!(gv && gv.geo)});
        if (gv) { nextVenue = gv.venue; rememberVenue(gv); }
      }
      if (next && !nextVenue && next.id && webOn) {
        try {
          const wv = await websiteVenue({ competition, division, season, teamId }, next.id, vt);
          if (wv) nextVenue = wv;
        } catch (_) { /* Venue remains optional if the RFU match page is unavailable. */ }
      }
      if (isDev === true && url.searchParams.get("debug") === "venue") {
        return new Response(JSON.stringify({venue: nextVenue || null, trace: vt}, null, 2), {headers: {"content-type": "application/json; charset=utf-8", "cache-control": "no-store"}});
      }
      nextVenue = decodeEntities(nextVenue).replace(/\s+/g, " ").trim();
      const nextHomeName = nextSide ? (nextSide.home ? displayTeamName : (teamNameOf(next.homeTeam) || "Home team")) : "";
      const nextAwayName = nextSide ? (!nextSide.home ? displayTeamName : (teamNameOf(next.awayTeam) || "Away team")) : "";
      const nextHomeId = nextSide ? teamIdOf(next.homeTeam) : "";
      const nextAwayId = nextSide ? teamIdOf(next.awayTeam) : "";
      const nextTeamCrest = (id, name) => {
        const url = crestFor(id);
        return `<div class="next-crest-frame">${url ? `<img class="next-crest" src="${esc(url)}" alt="${esc(name)} crest" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">` : ""}<div class="next-crest-fallback" style="display:${url ? "none" : "grid"}">${esc(initialsOf(name))}</div></div>`;
      };
      const nextLinkQ = { season, competition, division, team: teamId, teamName, friendlyName: friendlyName || "", theme };
      const nextLinkMatch = "/?" + new URLSearchParams({ view: "match", ...nextLinkQ }).toString();
      const nextLinkOpp = "/?" + new URLSearchParams({ view: "opposition", ...nextLinkQ }).toString();
      // v3.7.1: the Next fixture panel follows the team's next game of ANY competition. If that game is a cup game, the panel shows it
      // (with the cup name) instead of the next league game. Skipped for data requests (format=...) so it cannot loop.
      let cupNext = null;
      if (!url.searchParams.get("format") && teamId) {
        try {
          const qf = new URLSearchParams({season, competition, division, team: String(teamId), teamName, friendlyName: friendlyName || "", format: "summary", detail: "fixtures"});
          const fr = await worker.fetch(new Request(url.origin + "/?" + qf.toString()));
          if (fr.ok) { const fj = await fr.json(); const ng = (fj.games || []).find(g => g.status === "upcoming"); if (ng && ng.cup) cupNext = ng; }
        } catch (_) { cupNext = null; }
      }
      const cupNextHtml = cupNext ? `<div class="next-date">${esc(cupNext.dateLabel)}${cupNext.time ? " &middot; " + esc(cupNext.time) : ""}</div><div class="next-opponent">${esc(String(cupNext.comp).toUpperCase())} &middot; ${cupNext.home ? "HOME FIXTURE" : "AWAY FIXTURE"}</div><div class="next-teams"><div class="next-team">${nextTeamCrest(cupNext.home ? teamId : cupNext.oppId, cupNext.home ? displayTeamName : cupNext.oppName)}<strong>${esc(cupNext.home ? displayTeamName : cupNext.oppName)}</strong></div><span class="next-vs">VS</span><div class="next-team">${nextTeamCrest(cupNext.home ? cupNext.oppId : teamId, cupNext.home ? cupNext.oppName : displayTeamName)}<strong>${esc(cupNext.home ? cupNext.oppName : displayTeamName)}</strong></div></div>${cupNext.venue ? `<div class="next-venue">${esc(cupNext.venue)}</div>` : ""}` : "";
      const nextHtml = next && nextSide ? `<div class="next-date">${esc(dateLabel(next))}</div><div class="next-opponent">${nextSide.home?"HOME FIXTURE":"AWAY FIXTURE"}</div>${runIn ? `<div class="fdiff mobonly fd-${runIn.level}"><div class="fdt"><span>Next ${runIn.n} opponents</span><b>${runIn.label}</b></div><div class="fdbar"><i></i><i></i><i></i></div><div class="fdl"><span>Easy</span><span>Medium</span><span>Hard</span></div><div class="fdn">On average ${ordinalOf(runIn.avg)} of ${runIn.size} in the table.</div></div>` : ""}${gdQ ? `<div class="gdlazy" data-q="${esc(gdQ)}" data-sep="${runIn ? "1" : ""}">${runIn ? `<div class="fdsep mobonly"></div>` : ""}<div class="fdiff mobonly"><div class="fdt"><span>This game</span><b>Checking…</b></div></div></div><script>(function(){var e=document.querySelector(".gdlazy");if(!e)return;function gone(){e.parentNode&&e.parentNode.removeChild(e)}fetch("/?"+e.getAttribute("data-q")).then(function(r){return r.ok?r.text():""}).then(function(h){if(!h)return gone();e.innerHTML=(e.getAttribute("data-sep")?'<div class="fdsep mobonly"></div>':"")+h}).catch(gone)})();</script>` : ""}<div class="next-teams"><div class="next-team">${nextTeamCrest(nextHomeId,nextHomeName)}<strong>${esc(nextHomeName)}</strong></div><span class="next-vs">VS</span><div class="next-team">${nextTeamCrest(nextAwayId,nextAwayName)}<strong>${esc(nextAwayName)}</strong></div></div>${nextVenue ? `<div class="next-venue">${esc(nextVenue)}</div>` : ""}` : `<div class="empty">No upcoming fixture found in this competition</div>`;
      const position = selectedTeam ? table.indexOf(selectedTeam)+1 : null;
      const gapToTop = selectedTeam && table.length ? table[0].pts-selectedTeam.pts : null;

      const crestUrl = crestFor(selectedTeam?.id || teamId);
      const crest = crestUrl ? `<img class="crest" src="${esc(crestUrl)}" alt="${esc(displayTeamName)} crest" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">` : "";
      const crestFallback = `<div class="crest-fallback" ${crestUrl?'style="display:none"':''}>${esc(initialsOf(displayTeamName))}</div>`;

      // In the phone layouts, tapping another club in the table opens the same
      // dashboard for that club (same season/competition/division/theme/layout).
      const teamHref = t => {
        const q = new URLSearchParams(url.search);
        q.set("team", String(t.id));
        q.set("teamName", t.name);
        q.delete("friendlyName");
        q.delete("debug");
        return "?" + q.toString();
      };
      const clubLabel = t => (layout !== "tv" && !isSelected(t))
        ? `<a class="club-link" href="${esc(teamHref(t))}">${esc(t.name)}</a>`
        : esc(isSelected(t) ? displayTeamName : t.name);
      const rows = table.map((t,i) => `
        <tr class="${isSelected(t) ? "selected" : ""}">
          <td>${i+1}</td><td class="club-cell"><span class="club-content"><img class="table-crest" src="${esc(crestFor(t.id) || badgeUri(t.name))}" data-fb="${esc(badgeUri(t.name))}" alt="" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.fb"><span>${clubLabel(t)}</span></span></td>
          <td>${t.p}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td>
          <td class="c-pf">${t.pf}</td><td class="c-pa">${t.pa}</td><td class="c-pd">${t.pd > 0 ? "+" : ""}${t.pd}</td>
          <td>${t.tb}</td><td>${t.lb}</td><td class="points">${t.pts}</td>
        </tr>`).join("");
      const tableContent = table.length ? rows : `<tr><td colspan="12" class="notice">No teams were found in the RFU response.</td></tr>`;
      const stat = (label,value,sub="") => `<div class="stat"><span>${label}</span><strong>${value}</strong>${sub?`<small>${sub}</small>`:""}</div>`;
      const mobileRules = p => `
html.${p}{height:auto;min-height:100%;overflow-x:hidden;overflow-y:auto;-webkit-text-size-adjust:100%;text-size-adjust:100%}
html.${p} body{display:flex;flex-direction:column;gap:10px;height:auto;min-height:100vh;min-height:100dvh;overflow:visible;padding:max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left))}
html.${p} .mbar{display:flex;justify-content:space-between;align-items:center;gap:8px}
html.${p} .topline{font-size:10px;letter-spacing:.08em;margin-bottom:0;gap:8px;flex-wrap:wrap}
html.${p} .clubhead{flex-wrap:wrap;gap:12px}
html.${p} .crest-wrap{width:56px;height:56px;flex:0 0 56px;padding:8px;border-radius:14px}
html.${p} .crest-fallback{font-size:24px}
html.${p} .club-title{font-size:26px;margin:0 0 4px}
html.${p} .league{font-size:14px}
html.${p} .head-right{margin-left:0!important;width:100%;text-align:left;display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}
html.${p} .season{font-size:14px}
html.${p} .updated{font-size:11px;margin-top:0}
html.${p} .stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0}
html.${p} .stat{min-height:62px;padding:8px 10px}
html.${p} .stat span{font-size:11px}
html.${p} .stat strong{font-size:24px}
html.${p} .stat small{font-size:11px}
html.${p} .wdl-stat span{font-size:10px;letter-spacing:.04em}
html.${p} .wdl-stat strong{font-size:22px}
html.${p} .table-panel{display:block;margin-top:0;padding:6px 8px;overflow-x:auto;-webkit-overflow-scrolling:touch}
html.${p} table{height:auto;font-size:13px}
html.${p} th{font-size:12px;font-weight:900;letter-spacing:.04em;padding:7px 3px}
html.${p} td{padding:7px 3px}
html.${p} th.c-pf,html.${p} td.c-pf,html.${p} th.c-pa,html.${p} td.c-pa,html.${p} th.c-pd,html.${p} td.c-pd{display:none}
html.${p} tbody tr{min-height:0}
html.${p} .club{gap:6px}
html.${p} .club-link{color:inherit;text-decoration:underline;text-decoration-color:#4f6f5b;text-underline-offset:3px;-webkit-tap-highlight-color:rgba(114,210,142,.25)}
html.${p} td.club-cell{padding-top:9px;padding-bottom:9px}
html.${p} .club-content{gap:6px}
html.${p} .club-content>span{font-size:13px;line-height:1.15;overflow-wrap:anywhere}
html.${p} .table-crest{width:18px;height:18px;flex:0 0 18px;padding:1px}
html.${p} .main{display:flex;flex-direction:column;gap:10px;margin:0;min-height:0}
html.${p} .mobonly{display:block}
html.${p} .hl{grid-template-columns:repeat(2,1fr)!important}
html.${p} .hl strong{font-size:16px}
html.${p} .panel{padding:14px}
html.${p} .panel h2{font-size:13px;margin-bottom:10px}
html.${p} .formrow{margin-bottom:14px}
html.${p} .form{width:34px;height:34px;font-size:15px}
html.${p} .result{grid-template-columns:62px minmax(0,1fr) auto 42px;gap:6px;font-size:14px;padding:8px 0}
html.${p} .result-date{font-size:12px}
html.${p} .result strong{font-size:17px}
html.${p} .next-date{font-size:20px;margin:6px 0}
html.${p} .next-teams{gap:8px;margin:12px 0}
html.${p} .next-team{font-size:14px}
html.${p} .next-crest-frame{width:56px;height:56px;padding:6px;border-radius:10px}
html.${p} .next-venue{font-size:15px}
html.${p} .split{gap:8px}
html.${p} .snapshot strong{font-size:22px}
html.${p} .foot{flex-direction:column;gap:4px;font-size:10px;margin-top:0}
`;
      const mobileCss = layout === "mobile" ? mobileRules("layout-mobile")
        : layout === "auto" ? `@media(max-width:700px){${mobileRules("layout-auto")}}` : "";
      const refreshMeta = layout === "tv" ? `<meta http-equiv="refresh" content="${REFRESH_SECONDS}">` : "";
      const appleMeta = layout === "tv" ? "" : `<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="${theme === "light" ? "default" : "black-translucent"}"><meta name="apple-mobile-web-app-title" content="${esc(displayTeamName)}"><meta name="theme-color" content="${theme === "light" ? "#eef2ef" : "#080b0d"}">`;
      // On phones, reload only when the page is visible and scrolled to the top,
      // so a refresh never throws the reader back to the top mid-scroll.
      const refreshScript = layout === "tv" ? "" : `<script>(function(){var loaded=Date.now(),MAX=${REFRESH_SECONDS * 1000};var phone=${layout === "mobile" ? "true" : 'window.matchMedia("(max-width:700px)").matches'};if(!phone){setTimeout(function(){location.reload()},MAX);return}function due(){return Date.now()-loaded>=MAX}function tryReload(){if(due()&&document.visibilityState==="visible"&&window.scrollY<40)location.reload()}setInterval(tryReload,60000);document.addEventListener("visibilitychange",tryReload)})();</script>`;
      const timeOf = m => {
        const d = dateOf(m);
        if (!d) return "";
        const tm = d.toLocaleTimeString("en-GB", {hour:"2-digit", minute:"2-digit", timeZone:"Europe/London"});
        return tm === "00:00" ? "" : tm;
      };
      if (url.searchParams.get("format") === "summary") {
        const last = completed.find(m => !walkoverInfo(m)) || null;
        const lastX = last ? getSide(last) : null;
        let nextWx = null;
        if (url.searchParams.get("detail") === "match" && next && nextSide && nextVenue && dateOf(next)) { try { nextWx = await weatherFor(nextVenue, dateOf(next), nextSide.home ? ownClubName : clubOf(nextHomeName)); } catch (_) {} }
        const summary = {
          team: displayTeamName, clubName: ownClubName, teamId, league: leagueTitle,
          position: selectedTeam ? table.indexOf(selectedTeam) + 1 : null,
          gap: gap ? gap.text : "",
          points: selectedTeam ? selectedStats.pts : null,
          played: selectedTeam ? selectedStats.p : null,
          form,
          last: last ? {
            dateLabel: dateLabel(last),
            outcome: lastX.mineScore > lastX.oppScore ? "W" : lastX.mineScore < lastX.oppScore ? "L" : "D",
            mineHome: lastX.home,
            homeName: lastX.home ? displayTeamName : teamNameOf(last.homeTeam), awayName: lastX.home ? teamNameOf(last.awayTeam) : displayTeamName,
            homeId: teamIdOf(last.homeTeam), awayId: teamIdOf(last.awayTeam),
            homeScore: num(last.homeTeam?.score), awayScore: num(last.awayTeam?.score)
          } : null,
          updatedAt: dataTime,
          next: next && nextSide ? {
            dateLabel: dateLabel(next), iso: dateOf(next) ? dateOf(next).toISOString() : "", time: timeOf(next), mineHome: nextSide.home,
            homeName: nextHomeName, awayName: nextAwayName, homeId: nextHomeId, awayId: nextAwayId,
            venue: nextVenue || "", venueElite: !!next.elite, wx: nextWx,
            ...(() => { // v3.22: where the opponent sits in this league table (public table facts, used for the "2nd v 3rd" line on the Match Centre)
              const oid = String(nextSide.home ? nextAwayId : nextHomeId), onm = String(nextSide.home ? nextAwayName : nextHomeName).trim().toLowerCase();
              const orow = table.find(t => String(t.id) === oid) || table.find(t => String(t.name || "").trim().toLowerCase() === onm) || null;
              return { oppPos: orow ? table.indexOf(orow) + 1 : null, oppPts: orow && orow.pts !== undefined ? orow.pts : null };
            })()
          } : null
        };
        // v3.8: the plain summary (used by the Match Centre screens) reports the next game and the last result of ANY competition, tagged with the cup name.
        if (!url.searchParams.get("detail") && teamId) {
          try {
            const qf = new URLSearchParams({season, competition, division, team: String(teamId), teamName, friendlyName: friendlyName || "", format: "summary", detail: "fixtures"});
            const fr = await worker.fetch(new Request(url.origin + "/?" + qf.toString()));
            if (fr.ok) {
              const gs = (await fr.json()).games || [];
              const sideOf = g => ({ mineHome: g.home, homeName: g.home ? displayTeamName : g.oppName, awayName: g.home ? g.oppName : displayTeamName, homeId: g.home ? String(teamId) : String(g.oppId), awayId: g.home ? String(g.oppId) : String(teamId) });
              const ng = gs.find(g => g.status === "upcoming");
              if (ng && ng.cup) {
                let cv = ng.venue || "";
                if (!cv && ng.id) { // same lookup as the league game: RFU match record first, website page as the fallback
                  const gv = await gmsVenue(ng.id);
                  if (gv) { cv = gv.venue; rememberVenue(gv); }
                  else if ((await siteSettings()).features.webfallback !== false) cv = await websiteVenue({ competition: ng.competition || competition, division: ng.division || division, season, teamId }, ng.id, null);
                }
                summary.next = { dateLabel: ng.dateLabel, iso: ng.iso, time: ng.time || "", ...sideOf(ng), venue: cv, venueElite: false, wx: null, comp: ng.comp };
              }
              const dn = gs.filter(g => g.status === "done" && !g.wo).pop();
              if (dn && dn.cup) summary.last = { dateLabel: dn.dateLabel, outcome: dn.outcome, ...sideOf(dn), homeScore: dn.home ? dn.mineScore : dn.oppScore, awayScore: dn.home ? dn.oppScore : dn.mineScore, comp: dn.comp };
            }
          } catch (_) { /* league only */ }
        }
        if (url.searchParams.get("detail") === "leaders") {
          return new Response(JSON.stringify({ team: displayTeamName, teamId, league: leagueTitle, updatedAt: dataTime, leaders: leaders || null }), {headers: {"Content-Type":"application/json;charset=utf-8"}});
        }
        if (url.searchParams.get("detail") === "fixtures") {
          // Whole season for this team: every completed result plus every fixture not yet played.
          const realScore = mm => { const hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score); return hs !== null && as !== null && !(hs === 0 && as === 0); };
          const dayKey = mm => (dateOf(mm) ? dateOf(mm).toISOString().slice(0, 10) : "") + "|" + teamIdOf(mm.homeTeam) + "|" + teamIdOf(mm.awayTeam);
          const doneKeys = new Set(completed.map(dayKey));
          const extra = uniqueFixtures.filter(mm => dateOf(mm) && !doneKeys.has(dayKey(mm)));
          // v31a: the division feed is the league only. Also read everything the team plays this season (cups, plates,
          // friendlies) from the team's own season feed, and add whatever the league feed does not already have.
          const compOf = mm => {
            const gn = String((mm.group && mm.group.name) || ""), cn = String((mm.competition && mm.competition.name) || "");
            if (!NOT_LEAGUE_RE.test(gn + " " + cn)) return { comp: "League", cup: false };
            const nm = (cn || gn).replace(/\b(pool|group|round|quarter|semi|final|stage|leg)\b.*$/i, "").replace(/\s+/g, " ").trim();
            return { comp: nm || "Cup", cup: true };
          };
          const isVoidG = mm => String(mm.time || "").trim().toUpperCase() === "V" && !walkoverInfo(mm) && !realScore(mm);
          let teamFeedOk = false;
          const extraT = [];
          const fxDbg = { version: VERSION, season, teamId: String(teamId), leagueFeedResults: completed.length, leagueFeedFixtures: uniqueFixtures.length, teamFeed: null };
          try {
            const ut = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
            ut.searchParams.set("season", season); ut.searchParams.set("teamId", String(teamId));
            const fr = await cachedText(ut, "application/json, text/plain, */*");
            if (fr.ok) {
              const dd = JSON.parse(fr.text);
              const known = new Set([...doneKeys, ...extra.map(dayKey)]);
              const seenT = new Set();
              const all = [...findMatches(dd.results), ...findMatches(dd.fixtures)];
              const tf = { url: ut.toString(), topKeys: Object.keys(dd).slice(0, 8), matchesFound: all.length, belongToTeam: 0, noDate: 0, alreadyInLeagueFeed: 0, added: 0, competitions: {} };
              for (const mm of all) {
                if (!belongsToSelectedTeam(mm)) continue;
                tf.belongToTeam++;
                const cn = ((mm.group && mm.group.name) || "") + " | " + ((mm.competition && mm.competition.name) || "");
                tf.competitions[cn] = (tf.competitions[cn] || 0) + 1;
                if (!dateOf(mm)) { tf.noDate++; continue; }
                const k = dayKey(mm);
                if (known.has(k) || seenT.has(k)) { tf.alreadyInLeagueFeed++; continue; }
                seenT.add(k); extraT.push(mm); tf.added++;
              }
              fxDbg.teamFeed = tf;
              teamFeedOk = true;
            }
            else fxDbg.teamFeed = { url: ut.toString(), ok: false, status: fr.status, blocked: !!fr.blocked };
          } catch (err) { teamFeedOk = false; fxDbg.teamFeed = { error: String(err && err.message || err) }; }
          // v31b diagnosis: the RFU team season feed lists the team's games but carries no competition names, and cups can
          // sit in their own competition/division. So read every competition/division the team is entered in this season
          // (the same list the link builder uses) and label each game by the one it came from.
          const labelFor = (cName, dName) => {
            if (!NOT_LEAGUE_RE.test(cName + " " + dName)) return { comp: "League", cup: false };
            const nm = String(cName || dName || "").replace(/\b(pool|group|round|quarter|semi|final|stage|leg)\b.*$/i, "").replace(/\s+/g, " ").trim();
            return { comp: nm || "Cup", cup: true };
          };
          const keyLabel = new Map();
          let mainLabel = null;
          try {
            const br = await worker.fetch(new Request(url.origin + "/api/builder/team?" + new URLSearchParams({ team: String(teamId), season })));
            const bj = await br.json();
            const lgs = (bj && Array.isArray(bj.leagues)) ? bj.leagues : [];
            fxDbg.leagues = lgs.map(l => ({ competition: l.competition, division: l.division, competitionName: l.competitionName, divisionName: l.divisionName, main: l.competition === String(competition) && l.division === String(division) }));
            const known = new Set([...doneKeys, ...extra.map(dayKey), ...extraT.map(dayKey)]);
            await Promise.all(lgs.slice(0, 10).map(async l => {
              const lab = { ...labelFor(l.competitionName, l.divisionName), competition: l.competition, division: l.division };
              if (l.competition === String(competition) && l.division === String(division)) { mainLabel = lab; return; }
              try {
                const ud = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
                ud.searchParams.set("season", season); ud.searchParams.set("competitionId", l.competition); ud.searchParams.set("groupId", l.division);
                const fd = await cachedText(ud, "application/json, text/plain, */*");
                const row = { competition: l.competition, division: l.division, ok: !!fd.ok, mine: 0, added: 0 };
                if (fd.ok) {
                  const dj = JSON.parse(fd.text);
                  for (const mm of [...findMatches(dj.results), ...findMatches(dj.fixtures)]) {
                    if (!belongsToSelectedTeam(mm) || !dateOf(mm)) continue;
                    row.mine++;
                    const k = dayKey(mm);
                    if (!keyLabel.has(k)) keyLabel.set(k, lab);
                    if (known.has(k)) continue;
                    known.add(k); extraT.push(mm); row.added++;
                  }
                }
                (fxDbg.otherDivisions = fxDbg.otherDivisions || []).push(row);
              } catch (err) { (fxDbg.otherDivisions = fxDbg.otherDivisions || []).push({ competition: l.competition, division: l.division, error: String(err && err.message || err) }); }
            }));
          } catch (err) { fxDbg.leaguesError = String(err && err.message || err); }
          const eliteTeam = [...completed, ...extra, ...extraT].some(mm => mm && mm.elite === true);
          const blankName = mm => eliteTeam && mm && !mm.elite && !String((mm.group && mm.group.name) || "").trim() && !String((mm.competition && mm.competition.name) || "").trim();
          // v3.22.4: the team feed gives these club-entered cup games no name, but the RFU match record does (e.g. "Prem Rugby Cup" / "Pool A").
          const gmsCupName = new Map();
          try {
            const cands = [...extra, ...extraT].filter(mm => blankName(mm) && /^\d{1,10}$/.test(String(mm.id || ""))).sort((a, b) => Math.abs((dateOf(a)?.getTime() || 0) - Date.now()) - Math.abs((dateOf(b)?.getTime() || 0) - Date.now())).slice(0, 6);
            await Promise.all(cands.map(async mm => {
              try {
                const r = await cachedText("https://cluster.england-rfu.com/gms/matches/" + mm.id, "application/json");
                if (!r.ok) return;
                const j = JSON.parse(r.text) || {}, cl = x => String(x == null ? "" : x).replace(/\s+/g, " ").trim();
                const nm = (cl(j.competitionName) || cl(j.groupName)).replace(/\b(pool|group|round|quarter|semi|final|stage|leg)\b.*$/i, "").replace(/\s+/g, " ").trim();
                if (nm) gmsCupName.set(String(mm.id), nm);
              } catch (_) { /* name stays "Cup" */ }
            }));
          } catch (_) { /* name stays "Cup" */ }
          const labelOfGame = mm => {
            const k = dayKey(mm);
            if (keyLabel.has(k)) return keyLabel.get(k);
            if (mainLabel && (doneKeys.has(k) || extra.some(e2 => dayKey(e2) === k))) return mainLabel;
            const c = compOf(mm);
            // v3.22.1: an elite side's club-entered games (no Opta flag, blank competition and group names) that sit in no
            // competition we know are cup games (e.g. a Premiership Cup tie), never league games.
            if (!c.cup && blankName(mm)) return { comp: gmsCupName.get(String(mm.id)) || (gmsCupName.size === 1 ? [...gmsCupName.values()][0] : [...new Set(gmsCupName.values())].length === 1 ? [...gmsCupName.values()][0] : "Cup"), cup: true };
            return c;
          };
          const mk = (mm, status) => {
            const x = getSide(mm), dt = dateOf(mm), played = status === "done";
            return { iso: dt.toISOString(), dateLabel: dateLabel(mm), year: dt.getFullYear(), time: played ? "" : timeOf(mm), home: x.home,
              id: mm.id, oppName: teamNameOf(x.opponent) || "Opponent", oppId: teamIdOf(x.opponent), venue: venueLabel(mm.stadium) || venueLabel(mm.location) || venueLabel(mm.venue) || "",
              mineScore: played ? x.mineScore : null, oppScore: played ? x.oppScore : null,
              outcome: played ? x.res : "", wo: played && x.wo ? true : undefined, status, comp: labelOfGame(mm).comp, cup: labelOfGame(mm).cup, competition: labelOfGame(mm).competition, division: labelOfGame(mm).division };
          };
          const games = [
            ...completed.filter(mm => dateOf(mm)).map(mm => mk(mm, "done")),
            ...extra.map(mm => isVoidG(mm) ? mk(mm, "void") : realScore(mm) ? mk(mm, "done") : mk(mm, dateOf(mm).getTime() >= Date.now() - 86400000 ? "upcoming" : "pending")),
            ...extraT.map(mm => isVoidG(mm) ? mk(mm, "void") : (realScore(mm) || walkoverInfo(mm)) ? mk(mm, "done") : mk(mm, dateOf(mm).getTime() >= Date.now() - 86400000 ? "upcoming" : "pending"))
          ].sort((a, b) => a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0);
          // The feed can list one fixture twice (for example once with a kick-off time and once without).
          // Keep one entry per opponent, per London day, per home/away, preferring a played or timed one.
          const seenG = new Map();
          for (const g of games) {
            const key = new Date(g.iso).toLocaleDateString("en-CA", { timeZone: "Europe/London" }) + "|" + (g.oppId || g.oppName) + "|" + g.home;
            const prev = seenG.get(key);
            if (!prev || (g.status === "done" && prev.status !== "done") || (!prev.time && g.time && prev.status !== "done")) seenG.set(key, g);
          }
          const dedup = [...seenG.values()].sort((a, b) => a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0);
          const dayB = dd => dd.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
          // v31f: other results in this division today (match days only): finished games, plus how many are still to come.
          const dLon = dd => dd.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
          const todayS = dLon(new Date());
          const seenA = new Map();
          for (const mm of [...resultObjects, ...fixtureObjects]) {
            if (belongsToSelectedTeam(mm) || !dateOf(mm) || dLon(dateOf(mm)) !== todayS || isVoidG(mm)) continue;
            const k = teamIdOf(mm.homeTeam) + "|" + teamIdOf(mm.awayTeam), done = realScore(mm) || !!walkoverInfo(mm), pv = seenA.get(k);
            if (!pv || (done && !pv.done)) seenA.set(k, { done, mm });
          }
          const aList = [...seenA.values()];
          const around = aList.some(x => x.done) ? {
            games: aList.filter(x => x.done).slice(0, 8).map(({ mm }) => {
              const wo = !realScore(mm), hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score);
              return { home: teamNameOf(mm.homeTeam), away: teamNameOf(mm.awayTeam), hs: wo ? null : hs, as: wo ? null : as, wo: wo || undefined, win: wo ? (walkoverInfo(mm).homeWins ? "home" : "away") : undefined };
            }),
            toCome: aList.filter(x => !x.done).length
          } : null;
          let banner = bannerInfo({ todayStr: dayB(new Date()), day: dayB, games: dedup.filter(g => g.status !== "void"), table, ownClub: ownClubName });
          if (banner && banner.mode === "next") {
            const sameNext = next && dateOf(next) && dateOf(next).toISOString() === banner.date.toISOString();
            { const w = await weatherFor(banner.venue || (sameNext ? nextVenue : ""), banner.date, banner.home ? ownClubName : banner.opp.name); if (w && w.status === "ok") banner.wx = w; } // home or away; left out when no forecast is available
            delete banner.date; delete banner.venue;
          }
          const compNames = [...new Set(dedup.map(g => g.comp))];
          return new Response(JSON.stringify({ team: displayTeamName, clubName: ownClubName, league: leagueTitle, updatedAt: dataTime, games: dedup, banner, around, comps: compNames, multi: compNames.length > 1 || dedup.some(g => g.cup), teamFeedOk, ...(url.searchParams.get("debug") === "fixtures" ? { debug: { ...fxDbg, gamesByCompetition: dedup.reduce((o, g) => (o[g.comp] = (o[g.comp] || 0) + 1, o), {}), statuses: dedup.reduce((o, g) => (o[g.status] = (o[g.status] || 0) + 1, o), {}) } } : {}) }), {headers: {"Content-Type":"application/json;charset=utf-8"}});
        }
        // v30r/v30s: every league meeting between two sides: this season plus the previous five (league games only). Used by Match Stats and the Opposition report.
        const h2hFor = async (idMe, idOpp, meLabel, oppLabel, nextFx) => {
          const playedOk = mm => { const hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score); return hs !== null && as !== null && !(hs === 0 && as === 0); };
          const league = [...new Map(resultObjects.filter(mm => playedOk(mm) || walkoverInfo(mm)).map(mm => [matchKey(mm), mm])).values()];
          const displayTeamName = meLabel;
          const NOT_LEAGUE = /\b(cup|plate|vase|trophy|shield|bowl|friendly|friendlies|festival|sevens|7s|tens|10s)\b/i;
          const meetings = new Map(); const h2hMeta = { seasonsAsked: 0, seasonsOk: 0, seasonsFailed: 0, skippedNotLeague: 0, skippedNames: [], matchedByName: 0, skippedUnplayed: 0, skippedNoDate: 0, voided: [], perSeason: [], candidates: [] };
          const dbgH2h = url.searchParams.get("debug") === "h2h";
          const normN = t => String(t || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
          const oppN = normN(oppLabel);
          // Cup meetings count only when the next game is in that same cup (e.g. Premiership Rugby Cup). Pool, round and stage words are ignored when comparing.
          const namesOf = o => [(o && o.group && o.group.name) || "", (o && o.competition && o.competition.name) || ""].join(" ");
          const cupKey = o => normN((o && o.competition && o.competition.name) || (o && o.group && o.group.name) || "").replace(/\b(pool|group|round|quarter|semi|final|stage|leg)\b.*$/, "").trim();
          const nextKey = nextFx && NOT_LEAGUE.test(namesOf(nextFx)) ? cupKey(nextFx) : "";
          const isMe = t => String(teamIdOf(t)) === idMe;
          const isOpp = t => String(teamIdOf(t)) === idOpp;
          const isOppByName = t => !!oppN && normN(teamNameOf(t)) === oppN;
          const addMeeting = (mm, seasonLabel) => {
            const hm = isMe(mm.homeTeam), am = isMe(mm.awayTeam);
            const byId = (hm && isOpp(mm.awayTeam)) || (am && isOpp(mm.homeTeam));
            const byName = !byId && ((hm && isOppByName(mm.awayTeam)) || (am && isOppByName(mm.homeTeam)));
            if (!byId && !byName) return;
            const a = hm ? idMe : idOpp, b = am ? idMe : idOpp;
            const wi = walkoverInfo(mm);
            const compName = String((mm.group && mm.group.name) || (mm.competition && mm.competition.name) || "");
            const isCupGame = NOT_LEAGUE.test(namesOf(mm));
            const sameCup = isCupGame && !!nextKey && cupKey(mm) === nextKey;
            const cand = (why) => { if (dbgH2h && h2hMeta.candidates.length < 30) h2hMeta.candidates.push({ season: seasonLabel, type: mm.type, date: mm.date, time: mm.time, home: teamNameOf(mm.homeTeam), away: teamNameOf(mm.awayTeam), hs: mm.homeTeam && mm.homeTeam.score, as: mm.awayTeam && mm.awayTeam.score, notSetup: mm.matchNotSetup, group: compName, result: why }); };
            const isVoid = !wi && String(mm.time || "").trim().toUpperCase() === "V" && !playedOk(mm);
            if (isVoid && (!isCupGame || sameCup)) { const vd = new Date(mm.date || ""); const vk = matchKey(mm); if (!h2hMeta.voided.some(x => x.k === vk)) h2hMeta.voided.push({ k: vk, season: seasonLabel, date: Number.isNaN(vd.getTime()) ? "" : vd.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" }) }); cand("skipped: void game (kick-off code V)"); return; }
            if (!wi && !playedOk(mm)) { h2hMeta.skippedUnplayed++; cand("skipped: no usable score"); return; }
            const d0 = new Date(mm.date || mm.time || ""); if (Number.isNaN(d0.getTime())) { h2hMeta.skippedNoDate++; cand("skipped: no date"); return; }
            if (isCupGame && !sameCup) { h2hMeta.skippedNotLeague++; if (h2hMeta.skippedNames.length < 6) h2hMeta.skippedNames.push(compName); cand("skipped: not a league game"); return; }
            const hs = wi ? null : num(mm.homeTeam?.score), as = wi ? null : num(mm.awayTeam?.score);
            const winId = wi ? (wi.homeWins ? a : b) : hs > as ? a : as > hs ? b : "";
            const k = matchKey(mm);
            if (meetings.has(k)) return;
            if (byName) h2hMeta.matchedByName++;
            cand(sameCup ? "added (same cup as the next game)" : "added");
            if (sameCup) h2hMeta.sameCup = (h2hMeta.sameCup || 0) + 1;
            meetings.set(k, { ts: d0.getTime(), season: seasonLabel, label: d0.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "Europe/London" }), full: d0.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" }), homeId: a, awayId: b, homeName: String(a) === idMe ? displayTeamName : teamNameOf(mm.homeTeam), awayName: String(b) === idMe ? displayTeamName : teamNameOf(mm.awayTeam), homeScore: hs, awayScore: as, wo: !!wi, winId, comp: compName });
          };
          for (const mm of league) addMeeting(mm, season);
          const mS = /^(\d{4})-(\d{4})$/.exec(String(season));
          if (mS) {
            const past = []; for (let i = 1; i <= 5; i++) past.push((Number(mS[1]) - i) + "-" + (Number(mS[2]) - i));
            h2hMeta.seasonsAsked = past.length;
            await Promise.all(past.map(async sl => {
              try {
                const u4 = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
                u4.searchParams.set("season", sl); u4.searchParams.set("teamId", idMe);
                const fr = await cachedText(u4, "application/json, text/plain, */*");
                if (!fr.ok) { h2hMeta.seasonsFailed++; return; }
                const dd = JSON.parse(fr.text);
                const ms = findMatches(dd.results);
                const mine = ms.filter(mm => isMe(mm.homeTeam) || isMe(mm.awayTeam));
                const row = { season: sl, topKeys: Object.keys(dd).slice(0, 8), matches: ms.length, involvingTeam: mine.length };
                if (dbgH2h) row.opponents = [...new Set(mine.map(mm => teamNameOf(isMe(mm.homeTeam) ? mm.awayTeam : mm.homeTeam) + " [" + teamIdOf(isMe(mm.homeTeam) ? mm.awayTeam : mm.homeTeam) + "]" + ((mm.group && mm.group.name) ? " " + mm.group.name : "")))].slice(0, 40);
                h2hMeta.perSeason.push(row);
                for (const mm of ms) addMeeting(mm, sl);
                h2hMeta.seasonsOk++;
              } catch (_) { h2hMeta.seasonsFailed++; }
            }));
          }
          const h2hAll = [...meetings.values()].sort((x, y) => y.ts - x.ts);
          const h2hSum = (() => {
            let me = 0, opp = 0, dr = 0, fm = 0, fo = 0, ns = 0;
            for (const g of h2hAll) {
              if (g.winId === idMe) me++; else if (g.winId === idOpp) opp++; else dr++;
              if (!g.wo) { ns++; fm += g.homeId === idMe ? g.homeScore : g.awayScore; fo += g.homeId === idMe ? g.awayScore : g.homeScore; }
            }
            return { n: h2hAll.length, me, opp, draw: dr, avgMe: ns ? Math.round(fm / ns * 10) / 10 : null, avgOpp: ns ? Math.round(fo / ns * 10) / 10 : null };
          })();
          h2hMeta.voided = h2hMeta.voided.map(x => ({ season: x.season, date: x.date }));
          return { h2hAll, h2hSum, h2hMeta };
        };
        if (url.searchParams.get("detail") === "opposition") {
          const jsonOut = o => url.searchParams.get("frag") === "gd"
            ? new Response(o && o.status === "ok" && o.difficulty && o.opp ? gdBlockHtml({ df: o.difficulty, opp: o.opp, venue: o.venue }) : "", {headers: {"Content-Type":"text/html;charset=utf-8"}})
            : new Response(JSON.stringify(o), {headers: {"Content-Type":"application/json;charset=utf-8"}});
          const playedOk = mm => { const hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score); return hs !== null && as !== null && !(hs === 0 && as === 0); };
          const league = [...new Map(resultObjects.filter(playedOk).map(mm => [matchKey(mm), mm])).values()]
            .sort((a, b) => (dateOf(b)?.getTime() || 0) - (dateOf(a)?.getTime() || 0));
          // Same list plus walkovers (they count as played games but have no score).
          const leagueW = [...new Map(resultObjects.filter(mm => playedOk(mm) || walkoverInfo(mm)).map(mm => [matchKey(mm), mm])).values()]
            .sort((a, b) => (dateOf(b)?.getTime() || 0) - (dateOf(a)?.getTime() || 0));
          const londonDay = dd => dd.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
          const dayDiff = (a, b) => Math.round((new Date(londonDay(b) + "T00:00:00Z") - new Date(londonDay(a) + "T00:00:00Z")) / 864e5);
          const todayStr = londonDay(new Date());
          const base = { team: displayTeamName, league: leagueTitle, updatedAt: dataTime };
          const nx = upcoming.find(mm => dateOf(mm) && londonDay(dateOf(mm)) >= todayStr);
          if (!nx) return jsonOut({ ...base, status: "none" });
          const sx = getSide(nx), oppId = String(teamIdOf(sx.opponent)), oppName = teamNameOf(sx.opponent) || "Opponent";
          const oppRow = table.find(t => String(t.id) === oppId) || table.find(t => t.name.trim().toLowerCase() === oppName.trim().toLowerCase()) || null;
          const fxDate = dateOf(nx), myId = String(teamId);
          const posOf = id => { const i = table.findIndex(t => String(t.id) === String(id)); return i < 0 ? null : i + 1; };
          const half = Math.ceil(table.length / 2);
          const mapG = (list, comp) => list.filter(mm => String(teamIdOf(mm.homeTeam)) === oppId || String(teamIdOf(mm.awayTeam)) === oppId).map(mm => {
            const home = String(teamIdOf(mm.homeTeam)) === oppId, o = home ? mm.homeTeam : mm.awayTeam, t = home ? mm.awayTeam : mm.homeTeam;
            const f = num(o.score), a = num(t.score), wi = walkoverInfo(mm);
            return { d: dateOf(mm), dateLabel: dateLabel(mm), home, vsId: String(teamIdOf(t)), vsName: teamNameOf(t) || "Opponent", f, a, m: wi ? null : f - a, comp, wo: !!wi, res: wi ? (wi.homeWins === home ? "W" : "L") : undefined };
          }).filter(g => g.d && (g.wo || (g.f !== null && g.a !== null)));
          // The opponent may also play in other competitions (cups, Europe). Find them and add those games to the form cards.
          let curComp = leagueTitle, otherFx = [], otherRes = [];
          try {
            const br = await worker.fetch(new Request(url.origin + "/api/builder/team?" + new URLSearchParams({ team: oppId, season })));
            const bj = br.ok ? await br.json() : null;
            const all = (bj && bj.leagues) || [];
            const here = all.find(l => String(l.competition) === String(competition));
            if (here && here.competitionName) curComp = here.competitionName;
            const others = all.filter(l => !(String(l.competition) === String(competition) && String(l.division) === String(division))).slice(0, 6);
            await Promise.all(others.map(async l => {
              try {
                const u2 = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
                u2.searchParams.set("season", season); u2.searchParams.set("competitionId", l.competition); u2.searchParams.set("groupId", l.division);
                const fr = await cachedText(u2, "application/json, text/plain, */*");
                if (!fr.ok) return;
                const dd = JSON.parse(fr.text), cname = l.competitionName || l.divisionName;
                for (const mm of findMatches(dd.results)) otherRes.push({ mm, comp: cname });
                for (const mm of findMatches(dd.fixtures)) otherFx.push(mm);
              } catch (_) { /* skip a competition that cannot be read */ }
            }));
          } catch (_) { /* league games only */ }
          const ogLeague = mapG(leagueW, curComp);
          const seenK = new Set(leagueW.map(matchKey));
          const ogOther = [];
          for (const x of otherRes) { if ((!playedOk(x.mm) && !walkoverInfo(x.mm)) || seenK.has(matchKey(x.mm))) continue; seenK.add(matchKey(x.mm)); ogOther.push(...mapG([x.mm], x.comp)); }
          const og = [...ogLeague, ...ogOther].sort((x, y) => y.d.getTime() - x.d.getTime());
          const compCount = {}; for (const g of og) compCount[g.comp] = (compCount[g.comp] || 0) + 1;
          // Elite sides: if our own team also plays in several competitions, include our other competitions in common opponents.
          let myOther = [], bothMulti = false;
          if (Object.keys(compCount).length > 1) {
            try {
              const br2 = await worker.fetch(new Request(url.origin + "/api/builder/team?" + new URLSearchParams({ team: myId, season })));
              const bj2 = br2.ok ? await br2.json() : null;
              const all2 = (bj2 && bj2.leagues) || [];
              const others2 = all2.filter(l => !(String(l.competition) === String(competition) && String(l.division) === String(division))).slice(0, 6);
              await Promise.all(others2.map(async l => {
                try {
                  const u3 = new URL("https://cluster.england-rfu.com/fixtures-and-results/full-matches");
                  u3.searchParams.set("season", season); u3.searchParams.set("competitionId", l.competition); u3.searchParams.set("groupId", l.division);
                  const fr = await cachedText(u3, "application/json, text/plain, */*");
                  if (!fr.ok) return;
                  for (const mm of findMatches(JSON.parse(fr.text).results)) {
                    if (!playedOk(mm)) continue;
                    const hm = String(teamIdOf(mm.homeTeam)) === myId, am = String(teamIdOf(mm.awayTeam)) === myId;
                    if (!hm && !am) continue;
                    const mine2 = hm ? mm.homeTeam : mm.awayTeam, their = hm ? mm.awayTeam : mm.homeTeam;
                    myOther.push({ id: String(teamIdOf(their)), m: num(mine2.score) - num(their.score), d: dateOf(mm) });
                  }
                } catch (_) { /* skip */ }
              }));
              bothMulti = others2.length > 0;
            } catch (_) { /* league only */ }
          }
          const resOf = g => g.wo ? g.res : g.m > 0 ? "W" : g.m < 0 ? "L" : "D";
          const avg = (arr0, k) => { const arr = arr0.filter(g => !g.wo); return arr.length ? Math.round(arr.reduce((sum, g) => sum + g[k], 0) / arr.length * 10) / 10 : null; };
          const rec = arr => ({ w: arr.filter(g => resOf(g) === "W").length, d: arr.filter(g => resOf(g) === "D").length, l: arr.filter(g => resOf(g) === "L").length });
          const sc = g => g.wo ? "W/O" : g.f + "–" + g.a;
          const venueGames = og.filter(g => g.home === !sx.home);
          const wins = og.filter(g => g.m > 0).sort((a, b) => b.m - a.m), losses = og.filter(g => g.m < 0).sort((a, b) => a.m - b.m);
          const mine = completed.filter(mm => !walkoverInfo(mm)).map(mm => { const x = getSide(mm); return { id: String(teamIdOf(x.opponent)), m: x.mineScore - x.oppScore }; });
          if (bothMulti) { myOther.sort((x, y) => (y.d ? y.d.getTime() : 0) - (x.d ? x.d.getTime() : 0)); mine.push(...myOther); }
          const seen = new Set(), common = [];
          for (const g of (bothMulti ? og : ogLeague)) {
            if (g.vsId === myId || seen.has(g.vsId) || g.wo) continue;
            const ours = mine.find(z => z.id === g.vsId);
            if (!ours) continue;
            seen.add(g.vsId); common.push({ name: g.vsName, opp: g.m, you: ours.m });
            if (common.length >= 6) break;
          }
          const nextAfter = [...fixtureObjects, ...otherFx].filter(mm => dateOf(mm) && londonDay(dateOf(mm)) > londonDay(fxDate) && (String(teamIdOf(mm.homeTeam)) === oppId || String(teamIdOf(mm.awayTeam)) === oppId))
            .sort((a, b) => dateOf(a).getTime() - dateOf(b).getTime())[0];
          const tops = ogLeague.filter(g => { const q = posOf(g.vsId); return q && q <= half; }), bots = ogLeague.filter(g => { const q = posOf(g.vsId); return q && q > half; });
          const ownClub = ownClubName;
          const venueStr = (next && matchKey(next) === matchKey(nx)) ? (nextVenue || "") : "";
          const groundClub = sx.home ? ownClub : oppName;
          const outOf = resOf;
          const oppPos = oppRow ? table.indexOf(oppRow) + 1 : null;
          const difficulty = difficultyInfo({ size: table.length, pos: oppPos, games: og.length, lastOuts: og.slice(0, 3).map(outOf), venueN: venueGames.length, venueW: venueGames.filter(g => resOf(g) === "W").length });
          const luck = luckInfo(table, oppId, ogLeague.filter(g => !g.wo && Math.abs(g.m) <= 7).slice().reverse().map(outOf), ogLeague.length);
          const wxTrace = [];
          const wx = url.searchParams.get("nowx") ? null : await weatherFor(venueStr, fxDate, groundClub, wxTrace);
          const around = aroundInfo({ table, myId, todayStr, day: londonDay, fixtures: fixtureObjects.map(mm => ({ d: dateOf(mm), hId: teamIdOf(mm.homeTeam), hName: teamNameOf(mm.homeTeam), aId: teamIdOf(mm.awayTeam), aName: teamNameOf(mm.awayTeam), played: playedOk(mm) })) });
          const history = positionHistory(table, league.map(mm => ({ d: dateOf(mm), hId: teamIdOf(mm.homeTeam), aId: teamIdOf(mm.awayTeam), hs: num(mm.homeTeam.score), as: num(mm.awayTeam.score) })), [myId, oppId], londonDay);
          const hh = await h2hFor(myId, oppId, displayTeamName, oppName, nx);
          return jsonOut({ ...base, status: "ok", h2hAll: hh.h2hAll, h2hSum: hh.h2hSum, h2hMeta: hh.h2hMeta, h2hIds: { me: String(myId), opp: String(oppId) },
            ownClub, venueTag: sx.home ? "Home at " + ownClub : "Away at " + oppName, ground: { venue: venueStr, clubName: groundClub, maps: mapsLink(venueStr, groundClub, !!(venueStr && next && next.elite)), theirs: !sx.home },
            difficulty, luck, wx, wxDebug: url.searchParams.get("debug") === "weather" ? { venue: venueStr, trace: wxTrace } : undefined, around, history, myPos: posOf(myId), tableSize: table.length,
            opp: { id: oppId, name: oppName, position: oppRow ? table.indexOf(oppRow) + 1 : null, played: oppRow ? oppRow.p : og.length, points: oppRow ? oppRow.pts : null },
            fixture: { dateLabel: dateLabel(nx), time: timeOf(nx), weHome: sx.home },
            games: og.length, early: og.length < 3, comps: Object.entries(compCount).map(([name, n]) => ({ name, n })), multi: Object.keys(compCount).length > 1, leagueGames: ogLeague.length,
            venue: { oppHome: !sx.home, n: venueGames.length, record: rec(venueGames), scored: avg(venueGames, "f"), conceded: avg(venueGames, "a"), allScored: avg(og, "f"), allConceded: avg(og, "a") },
            trend: og.length >= 4 ? { scored: avg(og.slice(0, 3), "f"), conceded: avg(og.slice(0, 3), "a"), seasonScored: avg(og, "f"), seasonConceded: avg(og, "a") } : null,
            close: { close: og.filter(g => !g.wo && Math.abs(g.m) <= 7).length, bigWin: wins[0] ? sc(wins[0]) : "", worstDefeat: losses[0] ? sc(losses[0]) : "", scored30: og.filter(g => g.f >= 30).length, conceded30: og.filter(g => g.a >= 30).length },
            last: og.slice(0, 3).map(g => ({ comp: g.comp, dateLabel: g.dateLabel, vs: g.vsName, home: g.home, score: sc(g), out: resOf(g), wo: g.wo || undefined })),
            common, commonAll: bothMulti,
            rest: og.length ? { lastLabel: og[0].dateLabel, days: dayDiff(og[0].d, fxDate), in14: og.filter(g => { const dd = dayDiff(g.d, fxDate); return dd > 0 && dd <= 14; }).length, nextAfter: nextAfter ? dateLabel(nextAfter) : "" } : null,
            halves: { top: rec(tops), topN: tops.length, bottom: rec(bots), botN: bots.length },
            bonus: oppRow ? { tb: oppRow.tb, lb: oppRow.lb, bp: oppRow.bp } : null });
        }
        if (url.searchParams.get("detail") === "match" && next && nextSide) {
          const playedOk = mm => { const hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score); return hs !== null && as !== null && !(hs === 0 && as === 0); };
          const league = [...new Map(resultObjects.filter(mm => playedOk(mm) || walkoverInfo(mm)).map(mm => [matchKey(mm), mm])).values()]
            .sort((a, b) => (dateOf(b)?.getTime() || 0) - (dateOf(a)?.getTime() || 0));
          const profile = (id, row, label) => {
            let hw = 0, aw = 0; const f = [];
            for (const mm of league) {
              const isHome = String(teamIdOf(mm.homeTeam)) === String(id), isAway = String(teamIdOf(mm.awayTeam)) === String(id);
              if (!isHome && !isAway) continue;
              const ms = num((isHome ? mm.homeTeam : mm.awayTeam).score), os = num((isHome ? mm.awayTeam : mm.homeTeam).score);
              const wi = walkoverInfo(mm);
              const res = wi ? (wi.homeWins === isHome ? "W" : "L") : ms > os ? "W" : ms < os ? "L" : "D";
              if (f.length < 5) f.push(res);
              if (res === "W") { if (isHome) hw++; else aw++; }
            }
            return { id: String(id), name: label || (row && row.name) || "", position: row ? table.indexOf(row) + 1 : null, points: row ? row.pts : null, played: row ? row.p : null, wins: row ? row.w : null, pf: row ? row.pf : null, pa: row ? row.pa : null, homeWins: hw, awayWins: aw, form: f };
          };
          const oppId = teamIdOf(nextSide.opponent);
          const oppRow = table.find(t => String(t.id) === String(oppId)) || table.find(t => t.name.trim().toLowerCase() === teamNameOf(nextSide.opponent).trim().toLowerCase()) || null;
          const idMe = String(teamId), idOpp = String(oppId);
          const h2h = league.filter(mm => { if (walkoverInfo(mm)) return false; const a = String(teamIdOf(mm.homeTeam)), b = String(teamIdOf(mm.awayTeam)); return (a === idMe && b === idOpp) || (a === idOpp && b === idMe); })
            .sort((a, b) => (dateOf(a)?.getTime() || 0) - (dateOf(b)?.getTime() || 0))
            .map(mm => { const x = getSide(mm); const oppName = teamNameOf(x.opponent) || "Opponent"; return { dateLabel: dateLabel(mm), homeName: x.home ? displayTeamName : oppName, awayName: x.home ? oppName : displayTeamName, homeScore: num(mm.homeTeam?.score), awayScore: num(mm.awayTeam?.score) }; });
          const { h2hAll, h2hSum, h2hMeta } = await h2hFor(idMe, idOpp, displayTeamName, teamNameOf(nextSide.opponent), next);
          const hwBy = {}, awBy = {};
          for (const mm of league) {
            const wi = walkoverInfo(mm);
            if (wi) { const k = String(teamIdOf(wi.homeWins ? mm.homeTeam : mm.awayTeam)); if (wi.homeWins) hwBy[k] = (hwBy[k] || 0) + 1; else awBy[k] = (awBy[k] || 0) + 1; continue; }
            const hs = num(mm.homeTeam?.score), as = num(mm.awayTeam?.score);
            if (hs > as) { const k = String(teamIdOf(mm.homeTeam)); hwBy[k] = (hwBy[k] || 0) + 1; }
            else if (as > hs) { const k = String(teamIdOf(mm.awayTeam)); awBy[k] = (awBy[k] || 0) + 1; }
          }
          const mx = arr => arr.length ? Math.max(...arr) : 0, mn = arr => arr.length ? Math.min(...arr) : 0;
          const divMax = { played: mx(table.map(t => t.p)), points: mx(table.map(t => t.pts)), wins: mx(table.map(t => t.w)), pf: mx(table.map(t => t.pf)), paMin: mn(table.map(t => t.pa)), paMax: mx(table.map(t => t.pa)), homeWins: mx(Object.values(hwBy)), awayWins: mx(Object.values(awBy)) };
          summary.match = { h2h, h2hAll, h2hSum, h2hMeta, divMax, divisionSize: table.length, me: profile(teamId, selectedTeam, displayTeamName), opp: profile(oppId, oppRow, teamNameOf(nextSide.opponent)) };
        }
        return new Response(JSON.stringify(summary), {headers: {"Content-Type":"application/json;charset=utf-8"}});
      }
      const html = `<!doctype html>
<html lang="en" class="layout-${layout}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1${layout === "tv" ? "" : ",viewport-fit=cover"}">
${refreshMeta}${appleMeta}
<title>${esc(displayTeamName)} | ${esc(leagueTitle)}</title>
<style>
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#080b0d;color:#f5f7f6;font-family:Arial,Helvetica,sans-serif;overflow:hidden}
body{padding:clamp(10px,1.1vh,18px) clamp(12px,1.65vw,32px);background:radial-gradient(ellipse at 12% 0%,#183526 0%,#0b1110 43%,#080b0d 78%);display:grid;grid-template-rows:auto auto auto minmax(0,1.15fr) minmax(0,.85fr) auto;gap:0;min-height:0;height:100vh;height:100dvh}
.topline{display:flex;justify-content:space-between;align-items:center;color:#91a49a;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}
.clubhead{display:flex;align-items:center;gap:25px;min-width:0}.crest-wrap{width:88px;height:88px;flex:0 0 88px;display:grid;place-items:center;background:#f5f7f6;border-radius:20px;padding:12px;box-shadow:0 10px 36px #0008}.crest{max-width:100%;max-height:100%;object-fit:contain}.crest-fallback{width:100%;height:100%;display:grid;place-items:center;border-radius:12px;background:#14532d;color:white;font-weight:900;font-size:42px;letter-spacing:-.04em}
.club-title{font-size:clamp(32px,3.2vw,52px);font-weight:900;line-height:1;margin:0 0 10px;letter-spacing:-.035em}.league{font-size:19px;color:#b4c4bb}.head-right{text-align:right}.season{font-size:21px;font-weight:700}.updated{font-size:13px;color:#8b9a92;margin-top:7px}
.stats{display:grid;grid-template-columns:repeat(6,1fr);gap:9px;margin:12px 0 10px}.stat{background:#17211c;border:1px solid #294333;border-radius:13px;padding:9px 13px;min-height:67px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}.stat span{font-size:13px;letter-spacing:.09em;color:#a7b8ad;text-transform:uppercase;text-align:center}.stat strong{font-size:29px;line-height:1.05;margin-top:5px;font-weight:900;text-align:center}.stat small{font-size:12px;color:#91a49a;margin-top:3px;text-align:center}.stat.wdl-stat{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;align-items:center}.wdl-stat>div{text-align:center;min-width:0}.wdl-stat span{display:block;font-size:11px;letter-spacing:.07em;color:#a7b8ad;text-transform:uppercase}.wdl-stat strong{display:block;font-size:27px;line-height:1.05;margin-top:5px;font-weight:900}
.main{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:12px;flex:initial;height:auto;min-height:0;margin:9px 0 0}.panel{background:#111719;border:1px solid #26312d;border-radius:16px;padding:16px 18px;min-width:0;overflow:hidden}.panel h2{font-size:17px;text-transform:uppercase;letter-spacing:.1em;color:#b8c8bf;margin:0 0 15px}.formrow{display:flex;flex-direction:row;direction:ltr;gap:8px;align-items:center;margin-bottom:18px}.form{width:38px;height:38px;display:grid;place-items:center;border-radius:8px;font-weight:900;font-size:17px;color:#fff}.form.w{background:#1d6539}.form.l{background:#762e31}.form.d{background:#80621c}.form.new{box-shadow:0 0 0 3px #111719,0 0 0 5px #f5f7f6}body.light .form.new{box-shadow:0 0 0 3px #fff,0 0 0 5px #18221c}.muted,.empty{color:#87958d;font-size:15px}.result{display:grid;grid-template-columns:84px 1fr auto 47px;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid #27312d;font-size:15px}.result-date{color:#92a198;font-size:13px}.result-opponent{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.result strong{font-size:19px}.result-outcome{text-align:right;font-size:11px;font-weight:900;letter-spacing:.07em}.result.win .result-outcome{color:#65d68b}.result.loss .result-outcome{color:#f07b7b}.result.draw .result-outcome{color:#e8c46b}body.light .result.win .result-outcome{color:#1b7f3b}body.light .result.loss .result-outcome{color:#b3261e}body.light .result.draw .result-outcome{color:#8a5a00}
.next-fixture-panel{text-align:center}.next-fixture-panel .next-date,.next-fixture-panel .next-opponent,.next-fixture-panel .next-venue,.next-fixture-panel .empty{text-align:center}.next-date{font-size:25px;font-weight:900;color:#72d28e;margin:10px 0 8px}.next-opponent{font-size:13px;color:#9eafa5;letter-spacing:.12em}.next-teams{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:start;gap:10px;margin:15px 0 16px;text-align:center}.next-team{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:8px;min-width:0;font-size:clamp(14px,1.25vw,20px);line-height:1.2}.next-team strong{display:block;max-width:100%;overflow-wrap:anywhere}.next-crest-frame{width:clamp(58px,6.2vw,94px);height:clamp(58px,6.2vw,94px);display:grid;place-items:center;background:#f5f7f6;border-radius:13px;padding:8px;box-shadow:0 5px 18px #0005}.next-crest{width:100%;height:100%;object-fit:contain}.next-crest-fallback{width:100%;height:100%;place-items:center;border-radius:8px;background:#14532d;color:white;font-weight:900;font-size:clamp(18px,2vw,30px)}.next-vs{align-self:center;color:#9eafa5;font-size:clamp(13px,1.2vw,18px);font-weight:900;letter-spacing:.08em;padding:0 2px}.next-venue{font-size:21px;color:#9eafa5;overflow-wrap:anywhere}@media(max-width:900px){.next-date{font-size:clamp(18px,2.5vw,25px)}.next-teams{gap:6px;margin:12px 0}.next-crest-frame{width:clamp(48px,7vw,68px);height:clamp(48px,7vw,68px);padding:6px;border-radius:10px}.next-team{font-size:clamp(12px,1.7vw,16px)}.next-vs{font-size:12px}.next-venue{font-size:18px}}
.split{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}.season-records{margin-top:10px}.season-records>div{text-align:center}.split.season-records>div>label{text-align:center!important;width:100%}.season-records>div{min-width:0;padding:10px}.season-records .record-grid{gap:4px}.season-records .record-grid strong{font-size:22px}.snapshot{gap:10px}.snapshot>div{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12.6px}.snapshot>div:nth-child(3){grid-column:1 / -1}.snapshot label{text-align:center;width:100%}.snapshot strong{display:block;font-size:26px;line-height:1.05;font-weight:900;text-align:center;width:100%}.split>div{background:#19221e;border-radius:10px;padding:14px}.split label{display:block;font-size:13px;color:#a9b8af;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}.record-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center}.record-grid span{display:block;color:#92a198;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}.record-grid strong{display:block;font-size:25px}.split small{display:block;color:#92a198;margin-top:8px;font-size:13px;text-align:center}.season-records>div{padding:12.6px}.season-records label{font-size:11.7px;margin-bottom:9px}.season-records .record-grid{gap:7px}.season-records .record-grid span{font-size:10px;margin-bottom:3px}.season-records .record-grid strong{font-size:22.5px}.season-records small{font-size:11.7px;margin-top:7px}.main>.panel:nth-child(3) h2{margin-bottom:8px}.snapshot{gap:8px}.snapshot>div{padding:12px;min-height:0}.snapshot label{font-size:12px;letter-spacing:.06em;margin-bottom:5px}.snapshot strong{font-size:25px;line-height:1.05}.snapshot small{font-size:11px;line-height:1.15;margin-top:4px}.season-records{margin-top:8px;gap:8px}.season-records>div{padding:11px}.season-records label{font-size:11px;letter-spacing:.05em;margin-bottom:7px}.season-records .record-grid{gap:5px}.season-records .record-grid span{font-size:10px;margin-bottom:3px}.season-records .record-grid strong{font-size:21px;line-height:1.05}.season-records small{font-size:11px;margin-top:6px;line-height:1.1}.table-panel{flex:initial;min-height:0;margin-top:9px;background:#111719;border:1px solid #26312d;border-radius:15px;padding:7px 13px 5px;overflow:hidden;display:flex;align-items:stretch}.table-crest{width:24px;height:24px;object-fit:contain;background:#f5f7f6;border-radius:5px;padding:2px;flex:0 0 24px}.club{display:flex;align-items:center;gap:8px}.table-panel{order:0}tbody tr{height:auto;min-height:34px}table{height:100%}table{width:100%;border-collapse:collapse;font-size:15px}th{font-size:15px;font-weight:900;letter-spacing:.06em;color:#f5f7f6;text-transform:uppercase;padding:7px 6px;background:#1b2a22;border-bottom:3px solid #3fb865}thead th:first-child{border-top-left-radius:8px}thead th:last-child{border-top-right-radius:8px}td{text-align:center;padding:3px 6px;border-top:1px solid #202a25;color:#dce4df}th:nth-child(2),td:nth-child(2){text-align:left}td.club-cell{font-weight:700;text-align:left}.club-content{display:flex;align-items:center;gap:8px;min-width:0}.club-content>span{font-size:15px;line-height:1.15}td.points{font-weight:900}tr.selected td{background:#18512f;color:#fff;font-weight:900}.foot{display:flex;justify-content:space-between;color:#66766d;font-size:9px;margin-top:5px;flex:0 0 auto}.notice{text-align:center;padding:16px}
@media(max-height:850px){body{padding:8px 18px;grid-template-rows:auto auto auto minmax(0,1.05fr) minmax(0,.95fr) auto}.crest-wrap{width:72px;height:72px;flex-basis:72px}.stats{margin:8px 0}.stat{min-height:57px;padding:7px 10px}.stat strong{font-size:24px}.snapshot strong{font-size:23px}.main{min-height:220px}.panel{padding:13px 15px}.result{padding:7px 0}.table-panel{flex:initial;min-height:0}td{padding:1px 5px}th{padding:4px 5px;font-size:13px}}

body.light{background:#eef2ef;color:#18221c}
body.light .topline,body.light .updated,body.light .foot{color:#63746a}
body.light .league,body.light .panel h2{color:#40564a}
body.light .stat{background:#fff;border-color:#cbd8ce;color:#18221c}
body.light .stat span{color:#53665a}
body.light .stat small{color:#63746a}
body.light .table-panel,body.light .panel{background:#fff;border-color:#cbd8ce}
body.light th{color:#14301e;background:#dcebdf;border-bottom-color:#1b7f3b}
body.light td{color:#24342a;border-top-color:#e0e7e1}
body.light tr.selected td{background:#cfe8d3;color:#153d22}
body.light .result{border-bottom-color:#e0e7e1}
body.light .result-date,body.light .muted,body.light .empty,body.light .next-opponent,body.light .next-venue{color:#63746a}
body.light .split>div{background:#edf2ee}
body.light .split label{color:#53665a}
body.light .record-grid span,body.light .split small{color:#63746a}
body.light .next-date{color:#20743b}
.mobonly{display:none}.gp{font-style:normal}.gp-chase{color:#f09595}.gp-lead{color:#7fd89a}.gp-level{color:#e0b44e}.stat small .gp{white-space:nowrap}body.light .gp-chase{color:#a32d2d}body.light .gp-lead{color:#1b7f3b}body.light .gp-level{color:#8a5a00}
.fdn{font-size:12px;line-height:1.35;color:#91a49a;margin-top:6px;text-align:left}.fdt{display:flex;justify-content:space-between;align-items:baseline}.fdt b{font-size:13px;letter-spacing:0;text-transform:none;color:#f2f6f4}body.light .fdt b{color:#14301e}.fdsep{height:1px;background:#26312d;margin:10px 0}body.light .fdsep{background:#c9dccd}.fdiff{text-align:left}.fdiff{margin:6px 0 4px}.fdt{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#91a49a;margin-bottom:5px}.fdbar{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;height:12px}.fdbar i{border-radius:6px;background:#26312d}body.light .fdbar i{background:#d5dfd8}.fd-easy .fdbar i:nth-child(1){background:#3fb865}.fd-medium .fdbar i:nth-child(-n+2){background:#e2a93b}.fd-hard .fdbar i,body.light .fd-hard .fdbar i{background:#e05a5a}.fdl{display:grid;grid-template-columns:repeat(3,1fr);font-size:12px;margin-top:4px;color:#7d8c84}.fdl span:nth-child(2){text-align:center}.fdl span:nth-child(3){text-align:right}.fd-easy .fdl span:nth-child(1){font-weight:800;color:#3fb865}.fd-medium .fdl span:nth-child(2){font-weight:800;color:#e2a93b}.fd-hard .fdl span:nth-child(3){font-weight:800;color:#e05a5a}.runin{margin-top:2px}.hl{display:grid;grid-template-columns:repeat(4,1fr)!important;gap:8px;margin-top:8px}.hl>div{text-align:center;padding:9px 6px!important}.hl label{font-size:11px!important;margin-bottom:5px!important;letter-spacing:.05em!important}.hl strong{font-size:17px;font-weight:900;display:block}
${AROUND_CSS}${LUCK_CSS}
.nlinks{text-align:center;margin-top:12px}.nlinks a{display:inline-block;margin:4px;text-decoration:none;font:700 14px Arial,Helvetica,sans-serif;color:#f5f7f6;background:#17211c;border:1px solid #294333;border-radius:99px;padding:9px 16px}body.light .nlinks a{background:#fff;color:#18221c;border-color:#cbd8ce}
.mix .mrow{display:grid;grid-template-columns:26px 1fr 38px 78px;align-items:center;gap:6px;padding:8px 6px;border-top:1px solid #1f2a26;font-size:14px}.mix .mrow:first-of-type{border-top:0}.mix .mrow.me{background:#14532d;border-radius:8px;font-weight:800}.mix .mp{text-align:center;color:#a7b8ad}.mix .mn{display:flex;align-items:center;gap:8px;min-width:0}.mix .mpt{text-align:right;font-weight:900}.mix .g{text-align:right;font-size:12px;font-weight:700}
.lead .lrow{padding:10px 0;border-top:1px solid #1f2a26}.lead .lrow:first-of-type{border-top:0}.lead label{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#a9b8af;margin-bottom:5px}.lead .lv{display:flex;justify-content:space-between;align-items:baseline;gap:10px}.lead .lv b{font-size:15px}.lead .lv span{font-size:20px;font-weight:900;color:#7fd89a}.lead .ly{font-size:12px;color:#91a49a;margin-top:3px}.lead .lnl{font-size:12px;color:#b4c4bb;margin-top:3px;line-height:1.35}body.light .lead .lnl{color:#33443a}.lead .lnote{font-size:11px;color:#7d8c84;margin:8px 0 0}
body.light .mix .mrow{border-top-color:#e0e7e1}body.light .mix .mrow.me{background:#cfe8d3;color:#153d22}body.light .lead .lrow{border-top-color:#e0e7e1}body.light .lead .lv span{color:#1b7f3b}
a,button{touch-action:manipulation}
.mbar{display:none}.mbar a,.mbar button{font:700 14px Arial,Helvetica,sans-serif;color:#f5f7f6;background:#17211c;border:1px solid #294333;border-radius:99px;padding:8px 14px;text-decoration:none;cursor:pointer}
body.light .mbar a,body.light .mbar button{background:#fff;color:#18221c;border-color:#cbd8ce}
html:has(body.light){background:#eef2ef}
.mbar :focus-visible,.club-link:focus-visible{outline:3px solid #7fd89a;outline-offset:2px}
${mobileCss}
</style></head><body class="${theme}">
${layout === "tv" ? "" : themeBoot(layout === "mobile" ? "true" : 'window.matchMedia("(max-width:700px)").matches')}
${layout === "tv" ? "" : `<nav class="mbar"><a href="${esc(pubOrigin + "/?" + new URLSearchParams({theme}).toString())}">&lsaquo; Home</a><button type="button" class="tgl">Light mode</button></nav>`}
<div class="topline"><span>Club season dashboard</span><span>England Rugby • Live league data</span></div>
<header class="clubhead"><div class="crest-wrap">${crest}${crestFallback}</div><div style="min-width:0"><h1 class="club-title">${esc(displayTeamName)}</h1><div class="league">${esc(leagueTitle)}</div></div><div class="head-right" style="margin-left:auto"><div class="season">${esc(season)}</div><div class="updated">Updated ${esc(londonTime(dataTime))} &middot; refreshes every hour</div></div></header>
<section class="stats">
${stat("League position",position?`#${position}`:"—",`${table.length} clubs in division`)}
${stat("League points",selectedStats.pts,gap ? gap.html : `${gapToTop===0?"Top of the table":`${gapToTop} points off top`}`)}
${stat("Played",selectedStats.p)}
<div class="stat wdl-stat"><div><span>Wins</span><strong>${selectedStats.w}</strong></div><div><span>Draws</span><strong>${selectedStats.d}</strong></div><div><span>Losses</span><strong>${selectedStats.l}</strong></div></div>
${stat("Points difference",`${selectedStats.pd>0?"+":""}${selectedStats.pd}`)}
${stat("Points for",selectedStats.pf,`Against ${selectedStats.pa}`)}
</section>
${(() => {
  const i = selectedTeam ? table.indexOf(selectedTeam) : -1;
  if (i < 0) return "";
  const lo = Math.max(0, i - 2), hi = Math.min(table.length, i + 3);
  const rowsM = table.slice(lo, hi).map((t, k) => { const idx = lo + k, me = t === selectedTeam, d = t.pts - selectedTeam.pts;
    const g = me ? "" : d > 0 ? `<span class="g gp-chase">${d} ahead</span>` : d < 0 ? `<span class="g gp-lead">${-d} behind</span>` : `<span class="g gp-level">level</span>`;
    return `<div class="mrow${me ? " me" : ""}"><span class="mp">${idx + 1}</span><span class="mn"><img class="table-crest" src="${esc(crestFor(t.id) || badgeUri(t.name))}" data-fb="${esc(badgeUri(t.name))}" alt="" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.fb">${esc(me ? displayTeamName : t.name)}</span><span class="mpt">${t.pts}</span>${g}</div>`; }).join("");
  return `<section class="panel mobonly mix"><h2>In the mix</h2>${rowsM}</section>`;
})()}
${ownAround ? `<section class="panel mobonly arnd"><h2>Around you this weekend</h2>${aroundHtml(ownAround, esc, ordinalOf, displayTeamName)}<p class="lnote" style="margin:8px 0 0">Clubs within 3 places of ${esc(displayTeamName)}.</p></section>` : ""}
<section class="table-panel"><table><thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th class="c-pf">PF</th><th class="c-pa">PA</th><th class="c-pd">PD</th><th title="Try bonus points">TB</th><th title="Lost bonus points">LB</th><th>Pts</th></tr></thead><tbody>${tableContent}</tbody></table></section>
<section class="main">
<div class="panel"><h2>Recent form • last five</h2><div class="formrow">${formHtml}</div><h2>Latest results</h2>${resultHtml}</div>
<div class="panel next-fixture-panel"><h2>Next fixture</h2>${cupNext ? cupNextHtml : nextHtml}${cupNext ? `<div class="nlinks mobonly"><a href="${esc(nextLinkMatch)}">Match Stats</a><a href="${esc(nextLinkOpp)}">Opposition Report</a></div>` : next && nextSide ? `<div class="nlinks mobonly"><a href="${esc(nextLinkMatch)}">Match Stats</a><a href="${esc(nextLinkOpp)}">Opposition Report</a></div>` : ""}</div>
<div class="panel"><h2>Season snapshot</h2><div class="split snapshot"><div><label>Average scored</label><strong>${selectedStats.p?(selectedStats.pf/selectedStats.p).toFixed(1):"—"}</strong><small>points per match</small></div><div><label>Average conceded</label><strong>${selectedStats.p?(selectedStats.pa/selectedStats.p).toFixed(1):"—"}</strong><small>points per match</small></div><div><label>Win rate</label><strong>${selectedStats.p?Math.round(selectedStats.w/selectedStats.p*100)+"%":"—"}</strong><small>of matches played</small></div></div><div class="split season-records"><div><label>Home record</label><div class="record-grid"><div><span>Wins</span><strong>${homeRecord.w}</strong></div><div><span>Draws</span><strong>${homeRecord.d}</strong></div><div><span>Losses</span><strong>${homeRecord.l}</strong></div></div><small>${homeRecord.p} played</small></div><div><label>Away record</label><div class="record-grid"><div><span>Wins</span><strong>${awayRecord.w}</strong></div><div><span>Draws</span><strong>${awayRecord.d}</strong></div><div><span>Losses</span><strong>${awayRecord.l}</strong></div></div><small>${awayRecord.p} played</small></div></div><div class="split hl"><div><label>Current run</label><strong>${esc(hl.run)}</strong></div><div><label>Bonus points</label><strong>${selectedStats.bp}</strong></div><div><label>Biggest win</label><strong>${esc(hl.biggestWin)}</strong></div><div><label>Worst defeat</label><strong>${esc(hl.worstDefeat)}</strong></div></div></div>
</section>
${ownLuck ? `<section class="panel mobonly lkp"><h2>Luck check</h2>${ownLuck.status === "ok" ? `<div class="lkv lk-${ownLuck.verdict}">${esc(ownLuck.label)}</div><p>${esc(luckText(ownLuck, displayTeamName, ordinalOf))}</p><div class="lkt"><div><b>${ownLuck.pdPerGame > 0 ? "+" : ownLuck.pdPerGame < 0 ? "\u2212" : ""}${Math.abs(ownLuck.pdPerGame)}</b><span>Points difference per game</span></div><div><b>${ownLuck.closeN} of ${ownLuck.gamesN}</b><span>Games decided by 7 or fewer</span></div></div>` : `<p style="margin:0">Too early to say. ${esc(displayTeamName)} ${ownLuck.played === 1 ? "has" : "have"} played ${ownLuck.played} game${ownLuck.played === 1 ? "" : "s"}, and the check needs at least 5.</p>`}</section>` : ""}
${leaders ? `<section class="panel mobonly lead"><h2>League leaders</h2>${leaders.metrics.map(m => `<div class="lrow"><label>${esc(m.label)}</label><div class="lv"><b>${esc(m.leaderName)}</b><span>${esc(m.value)}</span></div>${m.leaderNames && m.leaderNames.length ? `<div class="lnl">${esc(m.leaderNames.join(", "))}</div>` : ""}${m.you ? `<div class="ly">${esc(displayTeamName)}: currently ${m.you.joint ? "joint " : ""}${ordinalOf(m.you.rank)}, ${esc(m.you.phrase || m.you.value)}</div>` : ""}</div>`).join("")}${leaders.early ? `<p class="lnote">Early in the season: some clubs have played only a few games.</p>` : ""}</section>` : ""}
<div class="foot"><span>${table.length} clubs • ${seenResults.size} completed league matches • ${fixtureObjects.length} fixtures scanned</span><span>${rfuTable ? "League table from " + (feedTable ? "the RFU feed" : "englandrugby.com") + "; other statistics calculated from RFU match results" : "Statistics calculated from RFU match results; bonus points are estimated"}</span></div>
${layout === "tv" ? "" : themeToggleScript}${refreshScript}</body></html>`;

      return new Response(html, {
        headers: {"Content-Type":"text/html;charset=utf-8","Cache-Control":"public,max-age=300"}
      });
    } catch (error) {
      const message = String(error).replace(/</g,"&lt;").replace(/>/g,"&gt;");
      return new Response(`<h1>RFU table error</h1><pre>${message}</pre>`, {
        status:502, headers:{"Content-Type":"text/html;charset=utf-8"}
      });
    }
  }
};

// DEV PIN gate. On the dev site (ENV_LABEL set) every page needs the PIN from the DEV_PIN
// variable. A correct PIN sets a 30-minute cookie holding a hash of the PIN, so changing DEV_PIN
// locks everyone out again. Production is never affected.

// Sign-in tokens and PIN lockout (v3.19).
// A sign-in cookie is no longer a fixed hash of the PIN. It is a random, expiring, signed token ("v2.<expiry>.<random>.<signature>").
// The signature uses a secret that is not the PIN (the SESSION_SECRET variable if set, otherwise a random secret kept in the
// settings store), so a captured cookie reveals nothing about the PIN and cannot be made or extended without the secret. The
// signature also covers a fingerprint of the current PIN, so changing the PIN signs everyone out at once.
// Wrong PINs are counted per visitor address: 5 wrong in 15 minutes pauses that address for 15 minutes, then 1 hour, then 4 hours.
// A pause is never permanent and never affects other addresses.
const SESSION_SECRET_KEY = "club:" + CLUB_ID + ":secret";
let SESSION_SECRET_CACHE = "";
const sbHexOf = u8 => Array.from(u8).map(b => b.toString(16).padStart(2, "0")).join("");
const sbRand = n => sbHexOf(crypto.getRandomValues(new Uint8Array(n)));
async function sbSha(text) { return sbHexOf(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))); }
async function sbHmac(key, msg) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return sbHexOf(new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(msg))));
}
async function sessionSecret() {
  const e = SITE_ENV && typeof SITE_ENV.SESSION_SECRET === "string" ? SITE_ENV.SESSION_SECRET.trim() : "";
  if (e.length >= 16) return e;
  if (SESSION_SECRET_CACHE) return SESSION_SECRET_CACHE;
  const kv = kvOf();
  if (kv) {
    try { let v = await kv.get(SESSION_SECRET_KEY); if (!v || v.length < 32) { v = sbRand(32); await kv.put(SESSION_SECRET_KEY, v); } SESSION_SECRET_CACHE = v; return v; } catch (_) { /* fall through */ }
  }
  return ""; // no secret available: the fallback below is only as strong as the old cookie was
}
async function makeSession(kind, pin, ttlS) {
  const secret = (await sessionSecret()) || "pin|" + pin, exp = Math.floor(Date.now() / 1000) + ttlS, nonce = sbRand(12);
  const fp = (await sbHmac(secret, "pin|" + pin)).slice(0, 16);
  return "v2." + exp + "." + nonce + "." + await sbHmac(secret, [kind, exp, nonce, fp].join("|"));
}
async function checkSession(kind, pin, token) {
  const m = /^v2\.(\d{9,11})\.([0-9a-f]{24})\.([0-9a-f]{64})$/.exec(token || ""); if (!m) return false;
  if (Number(m[1]) < Math.floor(Date.now() / 1000)) return false;
  const secret = (await sessionSecret()) || "pin|" + pin, fp = (await sbHmac(secret, "pin|" + pin)).slice(0, 16);
  return safeEq(await sbHmac(secret, [kind, m[1], m[2], fp].join("|")), m[3]);
}
const LOCK_MAX = 5, LOCK_WINDOW_MS = 15 * 60 * 1000, LOCK_STEPS_S = [900, 3600, 14400];
const LOCK_MEM = new Map();
async function lockKey(request, which) {
  const salt = String(SITE_ENV.USAGE_SALT || SITE_ENV.CLUB_PIN || "sb");
  return "lock:" + which + ":" + (await sbSha(["lock", which, request.headers.get("CF-Connecting-IP") || "", salt].join("|"))).slice(0, 24);
}
async function lockLoad(key) {
  let st = LOCK_MEM.get(key);
  if (!st) { const kv = kvOf(); if (kv) { try { st = await kv.get(key, { type: "json" }); } catch (_) { st = null; } } }
  return st && typeof st === "object" ? { n: Number(st.n) || 0, t: Number(st.t) || 0, s: Number(st.s) || 0, u: Number(st.u) || 0 } : { n: 0, t: 0, s: 0, u: 0 };
}
async function lockSave(key, st) {
  LOCK_MEM.set(key, st); if (LOCK_MEM.size > 500) LOCK_MEM.delete(LOCK_MEM.keys().next().value);
  const kv = kvOf(); if (kv) { try { await kv.put(key, JSON.stringify(st), { expirationTtl: 86400 }); } catch (_) { /* memory copy still applies */ } }
}
async function lockSecs(request, which) { const st = await lockLoad(await lockKey(request, which)), left = Math.ceil((st.u - Date.now()) / 1000); return left > 0 ? left : 0; }
async function lockFail(request, which) {
  const key = await lockKey(request, which), st = await lockLoad(key), now = Date.now();
  if (st.u > now) return { locked: true, secs: Math.ceil((st.u - now) / 1000) };
  if (now - st.t > LOCK_WINDOW_MS) { st.n = 0; st.t = now; }
  st.n++;
  if (st.n >= LOCK_MAX) {
    st.s = Math.min(st.s + 1, LOCK_STEPS_S.length); const secs = LOCK_STEPS_S[st.s - 1];
    st.u = now + secs * 1000; st.n = 0; st.t = 0; await lockSave(key, st);
    await usagePinFail(request, which + "-pause");
    return { locked: true, secs };
  }
  await lockSave(key, st); return { locked: false };
}
async function lockClear(request, which) {
  const key = await lockKey(request, which), st = await lockLoad(key);
  if (st.n || st.s || st.u) { LOCK_MEM.delete(key); const kv = kvOf(); if (kv && typeof kv.delete === "function") { try { await kv.delete(key); } catch (_) { /* expires on its own */ } } }
}
function lockMsg(secs) {
  const h = Math.ceil(secs / 3600), m = Math.max(1, Math.ceil(secs / 60));
  return "Too many wrong PINs. Please wait " + (secs >= 3600 ? h + (h === 1 ? " hour" : " hours") : m + (m === 1 ? " minute" : " minutes")) + " and try again.";
}
const pinDelay = () => new Promise(r => setTimeout(r, SITE_ENV && /^\d{1,4}$/.test(String(SITE_ENV.PIN_DELAY_MS || "")) ? Number(SITE_ENV.PIN_DELAY_MS) : 1200)); // slows down guessing
const pinOk = async (given, pin) => !!given && safeEq(await clubToken(given), await clubToken(pin));
function lockedPage(label, secs, action, heading) { const r = pinPage(label, lockMsg(secs), null, 429, action, heading); r.headers.set("Retry-After", String(secs)); return r; }

const PIN_COOKIE = "rfuDev";
async function pinToken(pin) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("rfu-dev-v1|" + pin));
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function safeEq(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
function cookieOf(request, name) {
  const m = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return m ? m[1] : "";
}
function pinPage(label, message, next, status, action, heading) {
  action = action || "/unlock";
  const esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const form = next === null ? "" : `<form method="post" action="${action}"><input type="hidden" name="next" value="${esc(next)}"><label for="p">PIN</label><input id="p" name="pin" type="password" inputmode="numeric" autocomplete="current-password" autofocus required><button type="submit">Unlock</button></form>`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${label ? "[" + esc(label) + "] " : ""}Enter PIN</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;font-family:Arial,Helvetica,sans-serif;background:#080b0d;color:#f5f7f6}.c{width:100%;max-width:340px;background:#111719;border:1px solid #26312d;border-radius:16px;padding:22px}h1{font-size:20px;margin:0 0 6px}p{margin:0 0 14px;color:#91a49a;font-size:14px}p.e{color:#f09595}label{display:block;font-size:13px;font-weight:700;color:#9eafa5;margin-bottom:6px}input[type=password]{width:100%;font-size:18px;letter-spacing:.2em;color:#f5f7f6;background:#0b1110;border:1px solid #2c3a34;border-radius:10px;padding:11px 12px}button{width:100%;margin-top:12px;font:700 16px Arial,Helvetica,sans-serif;color:#fff;background:#18512f;border:0;border-radius:10px;padding:12px;cursor:pointer}</style></head><body><div class="c"><div style="margin-bottom:14px">${sbWordmark(false)}</div><h1>${esc(heading || label + " environment")}</h1><p${message && status !== 200 ? ' class="e"' : ""}>${esc(message)}</p>${form}</div>${VERSION_STAMP}</body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "X-Stats-Board-Version": VERSION } });
}
const isIconPath = p => p === "/favicon.ico" || p === "/og-image.jpg" || /^\/(icon-192|icon-512|apple-touch-icon)\.png$/.test(p);
async function devGate(request, env, label) {
  const pin = env && typeof env.DEV_PIN === "string" ? env.DEV_PIN.trim() : "";
  const url = new URL(request.url);
  if (isIconPath(url.pathname)) return null; // the tab icon is not secret and the PIN page itself needs it
  if (!pin) return pinPage(label, "This environment is locked until a DEV_PIN variable is set in the Cloudflare Pages project settings.", null, 503);
  const cleanNext = n => (typeof n === "string" && n.startsWith("/") && !n.startsWith("//") && !n.startsWith("/\\") ? n : "/");
  if (url.pathname === "/unlock") {
    { const lk = await lockSecs(request, "dev"); if (lk > 0) { if (request.method === "POST") await usagePinFail(request, "dev-lock"); return lockedPage(label, lk); } }
    if (request.method === "POST") {
      let given = "", next = "/";
      try { const f = await request.formData(); given = String(f.get("pin") || "").trim(); next = cleanNext(String(f.get("next") || "/")); } catch (_) { /* bad form */ }
      if (given && safeEq(await pinToken(given), await pinToken(pin))) {
        await lockClear(request, "dev");
        return new Response(null, { status: 303, headers: { "Location": next, "Cache-Control": "no-store", "Set-Cookie": `${PIN_COOKIE}=${await makeSession("dev", pin, 1800)}; Path=/; Max-Age=1800; HttpOnly; Secure; SameSite=Lax` } });
      }
      await usagePinFail(request, "dev");
      const f = await lockFail(request, "dev");
      await pinDelay();
      if (f.locked) return lockedPage(label, f.secs);
      return pinPage(label, "That PIN was not right. Try again.", next, 401);
    }
    return pinPage(label, "Enter the PIN to continue.", cleanNext(url.searchParams.get("next") || "/"), 200);
  }
  if (await checkSession("dev", pin, cookieOf(request, PIN_COOKIE))) return null; // unlocked
  if (request.method === "GET" && !url.pathname.startsWith("/api/")) {
    return new Response(null, { status: 303, headers: { "Location": "/unlock?next=" + encodeURIComponent(url.pathname + url.search), "Cache-Control": "no-store" } });
  }
  return new Response("PIN required", { status: 401, headers: { "Cache-Control": "no-store" } });
}

// CLUB PIN gate. Only the links page (/?view=teams or /teams) needs the CLUB_PIN variable; every
// screen (team pages, Now and Next, match stats, builder, welcome) stays open to anyone with the address.
// A correct PIN sets a 30-day cookie (rfuClub) holding a hash of the PIN, so changing CLUB_PIN locks it again.
// PROD with no CLUB_PIN is locked. DEV (already behind DEV_PIN) only enforces it when CLUB_PIN is set.
const CLUB_COOKIE = "rfuClub";
async function clubToken(pin) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("rfu-club-v1|" + pin));
  return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function clubGate(request, env, label) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const pin = env && typeof env.CLUB_PIN === "string" ? env.CLUB_PIN.trim() : "";
  const H = "Club access";
  const notSet = "Club access is not set up yet. Add a CLUB_PIN variable in the Cloudflare Pages project settings.";
  const cleanNext = n => (typeof n === "string" && n.startsWith("/") && !n.startsWith("//") && !n.startsWith("/\\") ? n : "/?view=teams");
  if (path === "/club-signout") {
    return new Response(null, { status: 303, headers: { "Location": "/club-unlock", "Cache-Control": "no-store", "Set-Cookie": `${CLUB_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
  }
  if (path === "/club-unlock") {
    if (!pin) return pinPage(label, notSet, null, 503, "/club-unlock", H);
    { const lk = await lockSecs(request, "club"); if (lk > 0) { if (request.method === "POST") await usagePinFail(request, "club-lock"); return lockedPage(label, lk, "/club-unlock", H); } }
    if (request.method === "POST") {
      let given = "", next = "/?view=teams";
      try { const f = await request.formData(); given = String(f.get("pin") || "").trim(); next = cleanNext(String(f.get("next") || "")); } catch (_) { /* bad form */ }
      if (await pinOk(given, pin)) {
        await lockClear(request, "club");
        const ttl = (await siteSettings()).signin.days * 86400;
        return new Response(null, { status: 303, headers: { "Location": next, "Cache-Control": "no-store", "Set-Cookie": `${CLUB_COOKIE}=${await makeSession("club", pin, ttl)}; Path=/; Max-Age=${ttl}; HttpOnly; Secure; SameSite=Lax` } });
      }
      await usagePinFail(request, "club");
      const f = await lockFail(request, "club");
      await pinDelay();
      if (f.locked) return lockedPage(label, f.secs, "/club-unlock", H);
      return pinPage(label, "That PIN was not right. Try again.", next, 401, "/club-unlock", H);
    }
    return pinPage(label, "Enter the club PIN to see the dashboard links.", cleanNext(url.searchParams.get("next") || ""), 200, "/club-unlock", H);
  }
  const isLinks = url.searchParams.get("view") === "teams" || path === "/teams" || path === "/docs" || path === "/admin" || path === "/api/admin" || path === "/matchsheet" || path === "/maintenance-preview" || path === "/usage" || path === "/api/usage";
  if (!isLinks) return null;
  if (!pin) {
    if (label) return null; // DEV is already behind DEV_PIN
    return pinPage(label, notSet, null, 503, "/club-unlock", H);
  }
  if (await checkSession("club", pin, cookieOf(request, CLUB_COOKIE))) return null;
  if (request.method === "GET") {
    return new Response(null, { status: 303, headers: { "Location": "/club-unlock?next=" + encodeURIComponent(url.pathname + url.search), "Cache-Control": "no-store" } });
  }
  return new Response("PIN required", { status: 401, headers: { "Cache-Control": "no-store" } });
}


// Address checks (v3.20). The team, competition, division and season in a link go straight to the RFU, and made-up values miss the
// stored copies, so a robot trying thousands of them could get the site blocked by the RFU. Values must look right, and one visitor
// may ask for only so many different teams in a minute. Counting is per running copy of the site, so it is a brake, not an exact meter.
const ADDR_RULES = {
  team: v => /^\d{1,8}$/.test(v), competition: v => /^\d{1,8}$/.test(v), division: v => /^\d{1,8}$/.test(v),
  season: v => { const m = /^(20\d\d)-(20\d\d)$/.exec(v); return !!m && Number(m[2]) === Number(m[1]) + 1; }
};
const LOOKUP_LIMIT = 30, SEARCH_LIMIT = 60, LOOKUP_WINDOW_MS = 60000;
const LOOKUP_MEM = new Map();
function lookupCount(request, kind, key) {
  const ip = request.headers.get("CF-Connecting-IP") || "", now = Date.now(), k = kind + "|" + ip;
  let e = LOOKUP_MEM.get(k);
  if (!e || now - e.t > LOOKUP_WINDOW_MS) { e = { t: now, set: new Set(), n: 0 }; if (LOOKUP_MEM.size > 3000) LOOKUP_MEM.clear(); LOOKUP_MEM.set(k, e); }
  if (kind === "lookup") e.set.add(key); else e.n++;
  return kind === "lookup" ? e.set.size : e.n;
}
async function addressGate(request) {
  const url = new URL(request.url), q = url.searchParams, plain = (status, text, extra) => new Response(text, { status, headers: { "Content-Type": "text/plain;charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...(extra || {}) } });
  if (url.search.length > 4000) { await usageSec(request, "badreq", "length"); return plain(414, "That link is too long."); }
  for (const name of Object.keys(ADDR_RULES)) {
    const v = q.get(name); if (v === null || v === "") continue;
    if (!ADDR_RULES[name](v)) { await usageSec(request, "badreq", name); return plain(400, "That link does not look right: the " + name + " value is not valid."); }
  }
  if (url.pathname.startsWith("/api/")) { const id = q.get("id"); if (id !== null && id !== "" && !/^\d{1,9}$/.test(id)) { await usageSec(request, "badreq", "id"); return plain(400, "That link does not look right: the id value is not valid."); } }
  const p = url.pathname.replace(/\/+$/, "") || "/";
  if (p === "/api/builder/search") {
    if (lookupCount(request, "search", "") > SEARCH_LIMIT) { await usageSec(request, "slow", "search"); return plain(429, "Please slow down and try again in a minute.", { "Retry-After": "60" }); }
    return null;
  }
  const key = [q.get("team") || q.get("id") || "", q.get("competition") || "", q.get("division") || "", q.get("season") || ""].join("|");
  if (key !== "|||" && (p === "/" || p === "/calendar.ics" || p === "/api/builder/team")) {
    if (lookupCount(request, "lookup", key) > LOOKUP_LIMIT) { await usageSec(request, "slow", "lookups"); return plain(429, "Please slow down and try again in a minute.", { "Retry-After": "60" }); }
  }
  return null;
}

// Page-store key (v3.20.1). The short-term page store used to be keyed by the whole address, so adding any made-up setting
// (&anything=1) made a new key and forced a fresh build every time. Now only settings the site actually reads count, in a fixed
// order, so unknown extras (tracking tags, guesses) share the stored page. Keep this list in step with the settings the code reads
// (a test fails if a setting read by the code is missing here).
const KNOWN_PARAMS = ["app", "choose", "club", "clubName", "colour", "competition", "days", "debug", "detail", "device", "division", "embed", "ep", "extra", "format", "frag", "friendlyName", "id", "l", "layout", "ly", "n", "name", "next", "nowx", "oppColour", "pun", "rows", "s", "scale", "screen", "season", "t", "team", "teamName", "teams", "theme", "title", "today", "venueweb", "view", "webonly"];
function pageKeySearch(sp) {
  const out = [];
  for (const k of KNOWN_PARAMS) if (k !== "screen") for (const v of sp.getAll(k)) out.push(k + "=" + encodeURIComponent(v));
  return out.length ? "?" + out.join("&") : "";
}

// How long the live site keeps a finished page at the edge (seconds). Match Stats is the busiest and heaviest page and its
// facts change slowly: 2 hours Monday to Friday (no games), 5 minutes at weekends (UK days). Everything else stays at 2 minutes.
function pageTtlFor(view, now) {
  if (view !== "match") return 120;
  const wd = now.toLocaleDateString("en-GB", { weekday: "short", timeZone: "Europe/London" });
  return wd === "Sat" || wd === "Sun" ? 300 : 7200;
}
// ---- Team search and a team's competition list from the RFU data service (cluster.england-rfu.com) ----
// The data service answers in tens of milliseconds and is rarely refused, unlike the englandrugby.com website. Its
// upcoming-games call carries the competition and group (with ids) of every game still to be played, which gives the
// competition list. Friendlies are labelled "Manual Fixture" and are not competitions. A competition seen once is
// remembered for 30 days so a cup the team has finished playing does not drop off the list. Anything missing here
// (past seasons, a team with nothing left to play, data service down) falls back to the website lookups.
const isManualFixture = n => /^manual fixture/i.test(String(n || ""));
const tidyCompName = n => String(n || "").replace(/\s+20\d\d[-\/]\d{2,4}$/, "").trim();
async function dsJson(path, params) {
  const u = new URL("https://cluster.england-rfu.com" + path);
  for (const [k, v] of Object.entries(params || {})) u.searchParams.set(k, String(v));
  const r = await cachedText(u, "application/json");
  if (!r.ok) throw new Error("RFU data service returned HTTP " + r.status);
  return JSON.parse(r.text);
}
// The season the RFU list marks as current can lag, so use dates: the latest season that has started, or starts within 45 days.
function currentSeasonOf(list, now = Date.now()) {
  const ok = (Array.isArray(list) ? list : []).filter(x => x && /^\d{4}-\d{4}$/.test(x.name || "") && Date.parse(x.startDate) <= now + 45 * 864e5).sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
  return ok.length ? ok[ok.length - 1].name : "";
}
function seasonNamesUpTo(list, cur, n = 8) {
  const all = (Array.isArray(list) ? list : []).filter(x => x && /^\d{4}-\d{4}$/.test(x.name || "")).sort((a, b) => Date.parse(b.startDate) - Date.parse(a.startDate));
  const i = all.findIndex(x => x.name === cur);
  return (i < 0 ? all : all.slice(i)).slice(0, n).map(x => x.name);
}
async function dsSearchTeams(name) {
  const cur = currentSeasonOf(await dsJson("/fixtures-and-results/seasons"));
  const d = await dsJson("/fixtures-and-results/search", { name, type: "team", ...(cur ? { season: cur } : {}) });
  return (Array.isArray(d) ? d : []).filter(x => x && x.listType === "TeamType" && x._id).map(x => ({ id: String(x._id), name: String(x.name || "") }));
}
const compMemory = new Map();
async function mergeRemembered(origin, team, season, fresh) {
  const key = origin + "/__comp-memory?team=" + team + "&season=" + season;
  let old = compMemory.get(key) || [];
  let cache = null;
  try { cache = typeof caches !== "undefined" && caches.default ? caches.default : null; } catch (_) { cache = null; }
  if (!old.length && cache) { try { const h = await cache.match(key); if (h) old = JSON.parse(await h.text()); } catch (_) { old = []; } }
  const same = (a, b) => a.competition === b.competition && a.division === b.division;
  const out = fresh.slice();
  for (const o of old) if (!out.some(l => same(l, o))) out.push(o);
  const changed = out.length !== old.length || out.some(l => !old.some(o => same(o, l) && o.competitionName === l.competitionName && o.divisionName === l.divisionName));
  if (compMemory.size > 300) compMemory.clear();
  compMemory.set(key, out);
  if (changed && cache) { try { await cache.put(key, new Response(JSON.stringify(out), { headers: { "Cache-Control": "public, max-age=" + 30 * 86400 } })); } catch (_) { /* in-memory copy still used */ } }
  return out;
}
// Returns the same shape as the website path, or null when the data service cannot answer (the caller then uses the website).
async function dsTeam(origin, team, seasonParam) {
  const seasonsList = await dsJson("/fixtures-and-results/seasons");
  const cur = currentSeasonOf(seasonsList);
  if (!cur || (seasonParam && seasonParam !== cur)) return null; // past or other seasons: the website knows more
  const games = await dsJson("/fixtures-and-results/nextmatch", { teamId: team, count: 60 });
  const fresh = []; let nameFromGame = "";
  for (const g of (Array.isArray(games) ? games : [])) {
    const c = (g && g.competition) || {}, gr = (g && g.group) || {};
    for (const m of ((g && g.matches) || [])) for (const side of [m.homeTeam, m.awayTeam]) if (side && String(side.commonId) === team && side.name && !nameFromGame) nameFromGame = String(side.name);
    const cid = c.commonId || c.id, did = gr.commonId || gr.id;
    if (!cid || !did || isManualFixture(c.name)) continue;
    if (!fresh.some(l => l.competition === String(cid) && l.division === String(did))) fresh.push({ competition: String(cid), competitionName: tidyCompName(c.name), division: String(did), divisionName: String(gr.name || "") });
  }
  if (!fresh.length) return null; // nothing left to play (or only friendlies): the website has the full picture
  const leagues = await mergeRemembered(origin, team, cur, fresh);
  leagues.sort((a, b) => a.divisionName.localeCompare(b.divisionName));
  let name = "";
  try { const t = await dsJson("/teams/" + team); name = String((t && t.data && t.data.name) || ""); } catch (_) { /* use the name from a game */ }
  name = name || nameFromGame;
  if (!name) return null;
  return { team, name, club: "", season: cur, seasons: seasonNamesUpTo(seasonsList, cur), leagues, skipped: [], fromPage: [], via: "data-service" };
}
// Shorter competition names for the small tags on fixture rows ("National Under 18 Cup" becomes "National U18 Cup").
const shortComp = n => String(n || "").replace(/\bUnder[\s-]*(\d{2})s?\b/gi, "U$1");
// Version stamp for pages with no footer of their own (full-screen TV views, phone pages, dashboards).
const VERSION_STAMP = `<div id="sbv" style="position:fixed;left:50%;transform:translateX(-50%);white-space:nowrap;bottom:max(2px,env(safe-area-inset-bottom));z-index:2147483645;pointer-events:none;font:11px/1 Arial,Helvetica,sans-serif;color:rgba(128,140,134,.85);letter-spacing:.02em">${VERSION_LABEL}</div><script>(function(){var e=document.getElementById("sbv");if(!e)return;function f(){e.style.cssText="position:fixed;left:50%;transform:translateX(-50%);white-space:nowrap;bottom:max(2px,env(safe-area-inset-bottom));z-index:2147483645;pointer-events:none;font:11px/1 Arial,Helvetica,sans-serif;color:rgba(128,140,134,.85);letter-spacing:.02em";if(document.documentElement.scrollHeight>window.innerHeight+2||document.body.scrollHeight>window.innerHeight+2){e.style.cssText="position:static;transform:none;text-align:center;padding:14px 0 max(18px,env(safe-area-inset-bottom));font:11px/1 Arial,Helvetica,sans-serif;color:rgba(128,140,134,.85);letter-spacing:.02em;flex:0 0 auto"}}f();window.addEventListener("load",f);window.addEventListener("resize",f)})();</script>`;
// Home-screen support: every page gets the manifest and icon links (so "Add to Home Screen" opens that same page),
// and team pages on phones get an Install / Add to Home Screen button in the top bar.
function pwaInject(html, url) {
  if (url.searchParams.get("view") === "teams" || url.pathname.replace(/\/+$/, "") === "/teams" || url.pathname === "/release-notes" || url.pathname === "/admin" || url.pathname === "/matchsheet" || url.pathname === "/usage") return html;
  const name = (url.searchParams.get("friendlyName") || "").replace(/[<>"&]/g, "").slice(0, 45);
  const start = url.pathname + url.search;
  let tags = `<link rel="manifest" href="/manifest.webmanifest?s=${encodeURIComponent(start).replace(/'/g, "%27")}&amp;n=${encodeURIComponent(name)}" crossorigin="use-credentials"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png"><link rel="shortcut icon" href="/favicon.ico">`;
  if (!html.includes("apple-mobile-web-app-capable")) tags += `<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">`;
  if (!html.includes("apple-mobile-web-app-title")) tags += `<meta name="apple-mobile-web-app-title" content="${name || "Stats Board"}">`;
  let out = html.replace(/<\/head>/i, tags + "</head>");
  if (url.searchParams.has("team") && /class="mbar"/.test(out)) out = out.replace(/<\/body>/i, PWA_SCRIPT + "</body>");
  return out;
}
// Auto-fit for full-screen (TV / tablet) pages. Runs in the browser on three pages:
//  - standard team dashboard: measures every section at its natural height, scales the page down just enough to fit
//    the screen (never below 50%), then shares any spare height between the league table and the lower panels so the
//    page fills the screen exactly. Nothing is cut off.
//  - Match Centre and Fixtures TV: shrink the text a step at a time until no team name is cut short.
// Phone/scrolling layouts are left alone. Re-runs on resize, rotation and when images finish loading.
const FIT_SCRIPT = `<script>(function(){var d=document,h=d.documentElement,b=d.body;
function std(){var tp=b.querySelector(".table-panel"),mn=b.querySelector(".main");if(!tp||!mn||!b.querySelector(".clubhead"))return false;
if(getComputedStyle(b).overflowY!=="hidden")return true;
var sb=d.getElementById("sbv");function stamp(z){if(sb)sb.style.cssText="position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;bottom:"+(2/z)+"px;pointer-events:none;font:"+(11/z)+"px/1 Arial,Helvetica,sans-serif;color:rgba(128,140,134,.85)"}stamp(1);
var vw=innerWidth,vh=innerHeight,kids=[].slice.call(b.children).filter(function(k){return k.tagName!=="SCRIPT"&&k.id!=="sbv"&&getComputedStyle(k).position!=="fixed"&&getComputedStyle(k).display!=="none"});
function put(z){b.style.paddingBottom=(24/z)+"px";stamp(z);b.style.position="absolute";b.style.left="0";b.style.top="0";b.style.width=(vw/z)+"px";b.style.transformOrigin="0 0";b.style.transform=z<1?"scale("+z+")":"none"}
function nat(){b.style.height="auto";b.style.gridTemplateRows="auto";b.style.alignContent="start";return b.offsetHeight}
var z=1,hn=0;for(;z>=0.5;z=Math.round((z-0.02)*100)/100){put(z);hn=nat();if(hn<=vh/z)break}
if(z<0.5){z=0.5;put(z);hn=nat()}
function mg(e){var c=getComputedStyle(e);return e.offsetHeight+(parseFloat(c.marginTop)||0)+(parseFloat(c.marginBottom)||0)}
var tn=mg(tp),mh=mg(mn),H=vh/z,sp=Math.max(0,H-hn);
b.style.height=H+"px";b.style.alignContent="stretch";
var cs=kids.map(function(k){return k===tp?(tn+sp*0.6)+"px":k===mn?(mh+sp*0.4)+"px":"auto"});
b.style.gridTemplateRows=cs.join(" ");return true}
function txt(){var sel=b.querySelector(".hero")?".hero .nm,.lastbx .nm":b.querySelector(".fx")?".fx .fo b":b.querySelector(".lc")?".lc .ln":"";if(!sel)return false;
var els=[].slice.call(b.querySelectorAll(sel)),sz=1.05;h.style.fontSize="";var base=parseFloat(getComputedStyle(h).fontSize);
function bad(){var fxp=!!b.querySelector(".fx,.lc");return els.some(function(e){return e.scrollWidth>e.clientWidth+1||(!fxp&&e.scrollHeight>e.clientHeight+2)})}
var fx=!!b.querySelector(".fx,.lc"),bs=fx?els.map(function(e){e.style.fontSize="";return parseFloat(getComputedStyle(e).fontSize)}):[];
if(fx){els.forEach(function(e,i){var f=1;while(e.scrollWidth>e.clientWidth+1&&f>0.65){f-=0.03;e.style.fontSize=(bs[i]*f)+"px"}});return true}
var f=1;while(bad()&&f>0.6){f-=0.04;h.style.fontSize=(base*f)+"px"}return true}
function go(){try{std()||txt()}catch(e){}}
var hid=false;try{hid=getComputedStyle(b).overflowY==="hidden"&&innerWidth>800}catch(e){}
function show(){if(!hid)return;hid=false;b.style.transition="opacity .2s";b.style.opacity="1"}
if(hid){b.style.opacity="0"}
go();addEventListener("resize",go);addEventListener("orientationchange",function(){setTimeout(go,200)});addEventListener("load",function(){go();setTimeout(function(){go();show()},400)});setTimeout(function(){go();show()},2500);
})();</script>`;
function withStamp(html, powered) {
  const stampHtml = powered === false ? VERSION_STAMP : VERSION_STAMP.replace(`>${VERSION_LABEL}</div>`, `>${sbLogo(11).replace('style="', 'style="margin-right:4px;vertical-align:-2px;')}Powered by ${VERSION_LABEL}</div>`);
  const stamped = html.includes('class="ver"') ? html : html.replace(/<\/body>/i, stampHtml + "</body>");
  return /class="clubhead"|class="rw|class="fx|class="lc/.test(stamped) && !stamped.includes("rfu-fit") ? stamped.replace(/<\/body>/i, FIT_SCRIPT.replace("<script>", "<script>/*rfu-fit*/") + "</body>") : stamped;
}

// Environment banner. Set a variable called ENV_LABEL (for example "TEST") in
// the test Pages project's Settings > Variables. When it is set, every page
// gets a label badge (bottom-right) and the tab title is prefixed.
// Production has no ENV_LABEL, so nothing changes there. The badge floats over
// the page, so no layout (TV or phone) is moved.
export default {
  async fetch(request, env, ctx) {
    SITE_ENV = env || {}; SITE_CTX = ctx || null;
    const t0 = Date.now();
    const label = env && typeof env.ENV_LABEL === "string" ? env.ENV_LABEL.trim().slice(0, 30) : "";
    if (label) { const blocked = await devGate(request, env, label); if (blocked) return blocked; }
    { const cb = await clubGate(request, env, label); if (cb) return cb; }
    { const mg = await maintenanceGate(request); if (mg) return mg; }
    { const ag = await addressGate(request); if (ag) return ag; }
    const serve = async () => {
    // PROD only: finished team, Match Centre, fixtures and match pages are kept at the edge for 2 minutes, so a burst
    // of screens and phones shares one build. Never used on DEV (changes show at once), the links page or any PIN page.
    let pageKey = null, pageCache = null, pageTtl = 120;
    if (!label && request.method === "GET") {
      const u0 = new URL(request.url), v0 = u0.searchParams.get("view") || "";
      if (u0.pathname === "/" && (["stack", "fixtures", "match"].includes(v0) || (!v0 && u0.searchParams.has("team")))) {
        try { pageCache = typeof caches !== "undefined" && caches.default ? caches.default : null; } catch (_) { pageCache = null; }
        if (pageCache) {
          // Match Stats is the busiest and heaviest page and its facts change slowly: keep it 30 minutes Monday to Friday, 5 at weekends.
          pageTtl = pageTtlFor(v0, new Date());
          const ks = pageKeySearch(u0.searchParams); pageKey = new Request(u0.origin + u0.pathname + ks + (ks ? "&" : "?") + "_pg=" + VERSION, { method: "GET" });
          try { const hit = await pageCache.match(pageKey); if (hit) { const hh = new Headers(hit.headers); hh.set("X-Page-Cache", "HIT"); return new Response(hit.body, { status: hit.status, headers: hh }); } } catch (_) { /* miss */ }
        }
      }
    }
    const response = await worker.fetch(request, !!label);
    if (!(response.headers.get("Content-Type") || "").includes("text/html")) return response;
    let page = await response.text();
    if (response.status === 200) page = await noticeInject(page, new URL(request.url), !!label);
    page = pwaInject(page, new URL(request.url));
    page = appInject(page, new URL(request.url));
    page = brandInject(page, new URL(request.url));
    const powered = (await siteSettings()).features.powered;
    if (!label) { page = withStamp(page, powered); const ph = new Headers(response.headers); ph.set("X-Stats-Board-Version", VERSION);
      const out = new Response(page, { status: response.status, statusText: response.statusText, headers: ph });
      if (pageKey && pageCache && response.status === 200 && !/RFU table error|Couldn.t load the match data|not available right now/.test(page)) {
        const ch = new Headers(ph); ch.set("Cache-Control", "public, max-age=" + pageTtl);
        const store = pageCache.put(pageKey, new Response(page, { status: 200, headers: ch })).catch(() => {});
        if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(store);
      }
      return out; }
    const safe = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const banner = `<div role="note" style="position:fixed;right:max(10px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom));z-index:2147483647;pointer-events:none;background:#f0a020;color:#1a1200;font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:6px 10px;border-radius:99px;box-shadow:0 2px 8px rgba(0,0,0,.35)">${safe} environment</div>`;
    page = page.replace(/(<p class="ver">)([^<]*)(<\/p>)/, '$1$2 \u00b7 <a href="/release-notes" style="color:inherit">Release notes</a>$3');
    let html = withStamp(page, powered);
    html = html.replace(/<title>/i, `<title>[${safe}] `).replace(/<body([^>]*)>/i, m => m + banner);
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex");
    headers.set("X-Stats-Board-Version", VERSION);
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
    };
    const resp = await serve();
    const ms = Date.now() - t0;
    { const cp = usageRecord(request, new URL(request.url), ms, resp.status, resp.headers.get("X-Page-Cache") === "HIT").catch(() => {}); if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(cp); else await cp; }
    try { const sh = new Headers(resp.headers); { const u1 = new URL(request.url), v1 = u1.searchParams.get("view") || ""; if (u1.pathname === "/" && (["stack", "fixtures", "match", "opposition", "leaders", "centre"].includes(v1) || (!v1 && u1.searchParams.has("team")))) sh.set("X-Robots-Tag", "noindex"); } sh.set("Server-Timing", "total;dur=" + ms); return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: sh }); } catch (_) { return resp; }
  }
};
