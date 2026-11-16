THE STATS BOARD - RELEASE NOTES
================================
How releases are controlled
- Every change gets a version. The same version and a one-line summary go in three places: the header at the top of _worker.js (VERSION, BUILD_DATE and the changelog), this file, and the zip file name.
- To check what is live, open /version on the site (JSON: version, build date, PROD or DEV) or read the version on any page: a footer on the welcome, links and link builder pages, and a small stamp on every other page. Every page also sends an X-Stats-Board-Version header.
- Version numbers (from v3.4) are major.minor.patch. A new feature or visible change raises the minor number (v3.4 to v3.5). A fix, wording change or tidy-up with no new feature raises the patch number (v3.4.1). A big change to how the site works, or a break with earlier behaviour (for example becoming a multi-club service), raises the major number (v4.0). Earlier versions keep their old names; v33 counts as v3.3.
- Dates are always UK format, DD-MMM-YYYY (for example 03-Nov-2026).
- Keep the previous zip. To roll back, redeploy it and check /version shows the old number.
- Test on DEV first (PIN protected), compare /version on both sites, then deploy the same zip to PROD.

Parked ideas (not built; move a line to the release table when it ships)
- Win probability on the next game (idea 14-Nov-2026; v3.30 built Match Stats, the team page and the check page; built on the Match Centre in v3.30.1 and renamed Win Predictor; not on the Fixtures board by owner decision; original notes follow): a % chance of a home win, draw or away win for the next fixture, shown on Match Stats and the Next game views. Inputs the site already has: both teams' league position, points and points difference per game, recent form, the home and away split and the head-to-head from the Opposition report. Options to weigh: (a) a simple rating from points difference per game plus a home advantage, turned into a percentage; (b) a rating that updates game by game across the whole division (Elo style); (c) a plain banded wording (Favourites, Even, Underdogs) with no number. Decisions so far (14-Nov-2026, mock-ups in a published page): the two chances add up to 100% (a draw is split evenly); it is shown wherever the next game is shown, as a split bar with written percentages: option A on Match Stats and the phone Next game view, C on TV screens (not on the Fixtures board, owner decision 14-Nov-2026), D on Match Centre cards; no "rough guide" wording; a "How is this worked out?" line on phones only, and also written up in the Documentation; history is this season at full weight, last season about half and the season before about a quarter, with a team new to a division starting at the division average; hidden for cups and walkovers, and for fewer than about 4 games; an Admin switch under Screens, off until the DEV check of past games has been read. Still to settle: which side is on the left (the rest of the site puts the home side on the left) and bar colours. To build: the rating and percentage, a DEV-only page that predicts every finished game from the games before it and reports how often the favourite won, then the bar on each page.
- Shorter links (idea 14-Nov-2026, follows v3.29 Our teams; nothing built): now that Admin holds each team's number, league and name, a link could be just /?team=11039&view=fixtures&layout=tv, with the competition, division, team name and friendly name looked up from the Our teams list. The long links keep working. A later step could stop honouring friendlyName in a link at all, so names are only ever set in Admin and every link stays short.
- Club-name addresses for several clubs (idea 14-Nov-2026, the eventual address the owner wants; nothing built): thestatsboard.co.uk/<name> (for example /ivybridge) opens that club's own site, with its own Our teams list, colours, PIN and settings. v3.29 stores the team list inside the club's own settings record, and every page reads it through one lookup, so this can be added without reworking the pages. To settle later: whether the name in the address is the club or a team, how a club signs up, one PIN and settings record per club, and what the bare address shows.
- Around the league, all of today's games (idea 14-Nov-2026, parked until the current behaviour has been watched for a few weekends; nothing built): today the Fixtures board strip only shows finished results in the same division, once the first one is in the feed. Idea: from a set time on a game day (default 12:00, set in Admin) show all of the division's games that day, with scores filling in as results arrive. Admin choice: Off, Results only (today), All games from [time]. No kick-off times (decided earlier). Nearest to the club in the table first, up to 8 rows then +N more, table positions on each row. The RFU feed has no live scores, so a game in progress looks like one still to come. Needs a layout decision with the TV table review and the rotating screen because the Fixtures board is already tight.
- Rotating screen, one link for all content (idea 14-Nov-2026, to explore with mock-ups first, nothing built): a single TV link that rotates through pages on a schedule, so a screen needs only one address. A page per team (its table, then its fixtures, as the screens rotate today). The site owner can switch each page of the rotation on or off and put them in order, in Admin, with a time for each page. To explore at the same time: the TV league table view is getting cramped and shows too much (user feedback), so decide what a TV table should show and mock up a simpler layout before it goes into the rotation.
- TV quick setup (idea 14-Nov-2026, the next one to explore; mock-ups first, nothing built): on a TV, visit thestatsboard.co.uk/setup and get a branded page with a QR code. An admin scans it with a phone camera, picks the screen link on the builder page (/builder) and the link appears on the TV. For TV screens only: on-screen keyboards need a remote control, so the aim is to type as little as possible on the TV. To explore: how the TV and phone pair (short code or QR), how the chosen link reaches the TV (the TV polls for it), the admin sign-in on the phone, how long a code lasts and how pairing is secured, and what the TV shows before and after pairing. Mock up both the TV page and the phone steps.
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
- Ivybridge-specific items to revisit one by one before any resale (audit 07-Nov-2026): (a) several pages fall back to the Ivybridge 1XV (team 11039, competition 1699, division 75791) when a link has no team= (about eight places; another club should get the team picker); (b) DONE in v3.29: the team list (names, colours, leagues, IDs) is now edited in Admin under Our teams, and the list in the code is only the starting default; (c) names: the "Ivybridge RFC - Match Centre" heading, the "Ivybridge 2nd XV" to "The Vandals" rule, the default team name "Ivybridge"; (d) the PROD and DEV site addresses and the single CLUB_PIN; (e) the welcome page wording ("a personal project, free of charge") and the calendar file ID suffix @thestatsboard; (f) the TV club-name guess (team name trimmed, RFC added), which suits most clubs but not all (override with &club=).
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
v3.37.7 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.7_tv_fresh_pages.zip               | v3.37.6
v3.37.6 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.6_tv_loading_logo.zip              | v3.37.5
v3.37.5 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.5_tv_no_repeats.zip                | v3.37.4
v3.37.4 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.4_tv_rotation_phone_preview.zip     | v3.37.3
v3.37.3 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.3_tv_rotation_one_line.zip           | v3.37.2
v3.37.2 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.2_tv_rotation_phone_spacing.zip     | v3.37.1
v3.37.1 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.1_tv_rotation_name.zip              | v3.37.0
v3.37.0 | 16-Nov-2026 | RFU_Club_Dashboard_v3.37.0_tv_screen.zip                     | v3.36.3
v3.36.3 | 16-Nov-2026 | RFU_Club_Dashboard_v3.36.3_fixtures_header_size.zip          | v3.36.2
v3.36.2 | 16-Nov-2026 | RFU_Club_Dashboard_v3.36.2_fixtures_header.zip               | v3.36.1
v3.36.1 | 16-Nov-2026 | RFU_Club_Dashboard_v3.36.1_message_us_footer.zip             | v3.36.0
v3.36.0 | 16-Nov-2026 | RFU_Club_Dashboard_v3.36.0_welcome_cache.zip                 | v3.35.2
v3.35.2 | 15-Nov-2026 | RFU_Club_Dashboard_v3.35.2_win_predictor_heading.zip         | v3.35.1
v3.35.1 | 15-Nov-2026 | RFU_Club_Dashboard_v3.35.1_win_predictor_align.zip          | v3.35.0
v3.35.0 | 15-Nov-2026 | RFU_Club_Dashboard_v3.35.0_underdog_lines_admin.zip         | v3.34.2
v3.34.2 | 15-Nov-2026 | RFU_Club_Dashboard_v3.34.2_tv_only_notes.zip                | v3.34.1
v3.34.1 | 15-Nov-2026 | RFU_Club_Dashboard_v3.34.1_underdog_lines.zip               | v3.34.0
v3.34.0 | 15-Nov-2026 | RFU_Club_Dashboard_v3.34.0_win_predictor_early.zip          | v3.33.1
v3.33.1 | 15-Nov-2026 | RFU_Club_Dashboard_v3.33.1_form_key.zip                     | v3.33.0
v3.33.0 | 15-Nov-2026 | RFU_Club_Dashboard_v3.33.0_opposition_redesign.zip         | v3.32.2
v3.32.2 | 15-Nov-2026 | RFU_Club_Dashboard_v3.32.2_inbox_list.zip                   | v3.32.1
v3.32.1 | 15-Nov-2026 | RFU_Club_Dashboard_v3.32.1_messages_polish.zip              | v3.32.0
v3.32.0 | 15-Nov-2026 | RFU_Club_Dashboard_v3.32.0_messages.zip                     | v3.31.2
v3.31.2 | 15-Nov-2026 | RFU_Club_Dashboard_v3.31.2_mc_clipping.zip                  | v3.31.1
v3.31.1 | 15-Nov-2026 | RFU_Club_Dashboard_v3.31.1_hide_team.zip                    | v3.31.0
v3.31.0 | 15-Nov-2026 | RFU_Club_Dashboard_v3.31.0_team_batching.zip                | v3.30.20
v3.30.20 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.20_request_budget.zip              | v3.30.19
v3.30.19 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.19_feed_retry.zip                  | v3.30.18
v3.30.18 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.18_app_links.zip                   | v3.30.17
v3.30.17 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.17_dev_pin_return.zip              | v3.30.16
v3.30.16 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.16_rows_five_six.zip               | v3.30.15
v3.30.15 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.15_links_follow_admin.zip          | v3.30.14
v3.30.14 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.14_teams_max_six.zip              | v3.30.13
v3.30.13 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.13_opposition_win_predictor.zip   | v3.30.12
v3.30.12 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.12_feed_log.zip                   | v3.30.11
v3.30.11 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.11_hold_missing_game.zip          | v3.30.10
v3.30.10 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.10_match_centre_align.zip         | v3.30.9
v3.30.9 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.9_group_names.zip                  | v3.30.8
v3.30.8 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.8_unlabelled_games.zip              | v3.30.7
v3.30.7 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.7_partial_fix.zip                 | v3.30.6
v3.30.6 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.6_page_cache.zip                  | v3.30.5
v3.30.5 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.5_cpu_savings.zip                 | v3.30.4
v3.30.4 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.4_win_predictor_speed.zip         | v3.30.3
v3.30.3 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.3_data_cache.zip                  | v3.30.2
v3.30.2 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.2_win_predictor_cache.zip        | v3.30.1
v3.30.1 | 14-Nov-2026 | RFU_Club_Dashboard_v3.30.1_win_predictor.zip              | v3.30
v3.30   | 14-Nov-2026 | RFU_Club_Dashboard_v3.30_win_chance.zip                   | v3.29.2
v3.29.2 | 14-Nov-2026 | RFU_Club_Dashboard_v3.29.2_no_short_label.zip             | v3.29.1
v3.29.1 | 14-Nov-2026 | RFU_Club_Dashboard_v3.29.1_name_refresh.zip               | v3.29
v3.29   | 14-Nov-2026 | RFU_Club_Dashboard_v3.29_our_teams.zip                    | v3.28.4
v3.28.4 | 14-Nov-2026 | RFU_Club_Dashboard_v3.28.4_usage_chart.zip                | v3.28.3
v3.28.3 | 14-Nov-2026 | RFU_Club_Dashboard_v3.28.3_usage_merge.zip                | v3.28.2
v3.28.2 | 14-Nov-2026 | RFU_Club_Dashboard_v3.28.2_usage_teams.zip                | v3.28.1
v3.28.1 | 14-Nov-2026 | RFU_Club_Dashboard_v3.28.1_stats_fit_fix.zip            | v3.28
v3.28   | 14-Nov-2026 | RFU_Club_Dashboard_v3.28_crossfade_refresh.zip          | v3.27.7
v3.27.7 | 14-Nov-2026 | RFU_Club_Dashboard_v3.27.7_stats_settle.zip             | v3.27.6
v3.27.6 | 14-Nov-2026 | RFU_Club_Dashboard_v3.27.6_stats_flicker.zip            | v3.27.5
v3.27.5 | 14-Nov-2026 | RFU_Club_Dashboard_v3.27.5_club_access.zip              | v3.27.4
v3.27.4 | 14-Nov-2026 | RFU_Club_Dashboard_v3.27.4_overview_tidy.zip            | v3.27.3
v3.27.3 | 14-Nov-2026 | RFU_Club_Dashboard_v3.27.3_date_boxes.zip              | v3.27.2
v3.27.2 | 14-Nov-2026 | RFU_Club_Dashboard_v3.27.2_admin_tabs.zip               | v3.27.1
v3.27.1 | 14-Nov-2026 | RFU_Club_Dashboard_v3.27.1_docs_update.zip             | v3.27
v3.27   | 14-Nov-2026 | RFU_Club_Dashboard_v3.27_admin_sections.zip         | v3.26.1
v3.26.1 | 14-Nov-2026 | RFU_Club_Dashboard_v3.26.1_builder_screen.zip       | v3.26
v3.26   | 14-Nov-2026 | RFU_Club_Dashboard_v3.26_modern_classic.zip         | v3.25.1
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

v3.37.7 - TV rotation: always load the current release
- Owner report (16-Nov-2026): Preview on a phone still showed the previous League table layout after v3.37.6 was deployed.
- Changed: every page address the TV rotation loads now ends with the release number (_v=...), so a phone or TV browser that kept an older copy of a page asks for a fresh one after each release. Nothing else changes, and it adds no outside calls.
- Tests: x_tv_rotate checks each page address in the TV plan carries the release number.
- Docs: TV rotation (one rotating link), What's new

v3.37.6 - TV screen: loading message shows the logo
- Owner request (16-Nov-2026): the loading message should show the Stats Board logo so it is obvious what is loading.
- Also changed: the TV League table page now fills the whole screen. The header sits at the top, the Season snapshot is a single line across the bottom (win rate, current run, home and away record, biggest win, worst defeat) and the table takes the full width and all the spare height. When the league has 20 clubs or fewer, rows get taller and club names, numbers, crests, the next-match pill and the snapshot line get bigger. Leagues with more clubs keep the fit-to-screen sizing.
- Changed: while the TV screen link is starting up (and on the "nothing is switched on" message) it now shows the Stats Board logo and name above the word Loading. The logo is the app icon the site already serves, so there are no extra outside calls.
- Tests: x_tv_rotate checks the loading screen has the logo and name.
- Docs: TV rotation (one rotating link), What's new

v3.37.5 - TV League table: no repeated information
- Owner request (16-Nov-2026): the TV pages should not repeat each other now that they rotate.
- Changed: on the TV layout only, the League table page drops the top tiles, Recent form, Latest results and Next fixture panels (these live on Next game, League Leaders and the Fixtures board). The table takes the room, with a Season snapshot at the side (win rate, current run, home and away record, biggest win, worst defeat). The header shows a NEXT MATCH pill (opponent, Home/Away, This Thursday / Next Sunday wording) and the opponent's row in the table is shaded light grey with a NEXT MATCH tag. Fixtures board, Next game, League Leaders and the phone and desktop layouts are unchanged.
- No extra outside calls: the page makes the same requests as before (13 in the test feed for TV, 4 for phone), and the rotator still makes none.
- Tests: new x_nm_check covers the TV page (no tiles, pill, one tagged row, snapshot only, no scrolling) and that the phone layout keeps everything.
- Docs: TV rotation (one rotating link), What's new

v3.37.4 - TV rotation: phone preview shows the TV layout
- Owner request (16-Nov-2026): Preview on a phone showed the phone layouts, which do not suit TV pages.
- Changed: when the TV link is opened in a window narrower than 1280 pixels (a phone or small tablet), every page is drawn at a full 1920 x 1080 TV size and the whole stage is shrunk to fit and centred, so the pages use their TV layouts. Real TVs and desktop windows 1280 wide or more are untouched. A short note under TV rotation explains the shrunk-down preview.
- Tests: x_tv_rotate now also checks that a 390-wide phone gives the pages a 1920-wide window, scales the stage to fit, and that a TV-size window is not scaled.
- Docs: TV rotation (one rotating link), What's new

v3.37.3 - TV rotation: one line per page on phones
- Owner feedback (16-Nov-2026): each page could be on one line on a phone.
- Changed: on phones each page row is one line: on/off switch, name, order arrows (stacked), seconds stepper and a cross to remove. Desktop is unchanged.
- Tests: TV admin check (now clicks the team switch directly so the fixed save bar cannot cover it).
- Docs: What's new

v3.37.2 - TV rotation: phone spacing
- Owner feedback (16-Nov-2026): spacing was out on mobile in the TV rotation list (the Show switch dropped under its label, page controls wrapped untidily).
- Changed: on phones each team header shows its name, then one line with the up/down arrows and the Show switch together; each page is two tidy lines (switch and name, then order arrows, seconds and Remove). Desktop is unchanged.
- Tests: TV admin check.
- Docs: What's new

v3.37.1 - TV rotation: clearer name, Dark/Light fix
- Owner feedback (16-Nov-2026): "Screens" and "TV screen" side by side in the Admin menu were confusing, and Dark/Light stacked oddly on a phone.
- Changed: the Admin section is now called TV rotation (menu, heading, Documentation). The Dark/Light choice stays on one line on phones.
- Tests: Admin check, TV admin check.
- Docs: TV rotation (one rotating link), What's new

v3.37.0 - TV screen: one rotating link
- Owner request (16-Nov-2026): one short link for a clubhouse TV that rotates the existing pages, controlled from Admin.
- Added: /<club>/tv (and /tv) plays the Fixtures board, Match Centre, Next game, League table and League Leaders in turn with a crossfade. Admin has a new TV rotation section: pages grouped by team, per-team Show switch, per-page switch, order, seconds (5 to 120), Remove, add one or add all, whole-team order, theme, optional page name/dots/progress strip, and an off-by-default switch to add new teams automatically. Settings are kept per club.
- 50-call rule: the rotating page makes no outside calls; every page is its own request and budget, starts 4 s after the last, and shows only when ready. A page that fails or does not settle in 30 s is skipped and retried. Each page refreshes about every 5 minutes. The route skips the seasons lookup.
- Not built: a "skip a page with nothing to show" switch (only failed loads are skipped). Preview in Admin needs the changes saved first.
- Tests: t_v3370 (route, club check, settings clean-up, hidden/off teams, auto-add, escaping, zero outside calls, maintenance); x_tv_admin_ui (add, remove, move, save); x_tv_rotate (stagger, never shows an unready page, one frame at a time).
- Docs: TV rotation (one rotating link), What's new

v3.36.3 - Fixtures board header: team name larger than the heading
- Owner request (16-Nov-2026): after v3.36.2 the team name should be larger than the season heading.
- Changed: on the season Fixtures TV board the team name is now the larger line (bold, white, 4.8% of the screen height) and "2026-2027 Season Fixtures" sits under it, smaller (3.2%). The two lines together are still shorter than the crest, so the header height and the rows below do not move. Only this board changes; League Leaders and other headers are untouched.
- Tests: header check now also requires the team name line to be larger than the heading; clipping and alignment checks pass at all six TV sizes.
- Docs: What's new
v3.36.2 - Fixtures board header: team above the heading, no club name
- Owner request (16-Nov-2026): on the season Fixtures TV board the team name reads better above the "2026-2027 Season Fixtures" heading, and the club name on the right is not needed.
- Changed: the team name now sits above the heading (same size and colour as before), and the club name is removed from the top right. The clock and date stay where they were. The header keeps the same height, so the rows below do not move. Branding option D otherwise unchanged (edge stripe, crest, last checked line).
- The club= link setting is still accepted and still used elsewhere; it just no longer prints on this board.
- Tests: new check that the team comes before the heading and the header has no club name; clipping and alignment checks pass at all six TV sizes.
- Docs: What's new
v3.36.1 - Message us link moved into the page footer
- Owner request (16-Nov-2026): on phone pages the small Message us link floated at the bottom right and overlapped the content.
- Fixed: the link is now part of the page's own footer, centred under the version line, so it scrolls with the page and never sits over a game, table or button. Where it shows is unchanged: phone and tablet team pages only, never TV screens, the Links page or the app shell, and only while the Message form switch is on.
- Tests: new phone check at four widths that the link covers no content and the page does not scroll sideways (it fails on the old floating link); the existing link-presence tests still pass.
- Docs: What's new
- Parked idea closed: the picture-card WhatsApp share is not wanted (owner, 16-Nov-2026); the text message stays as it is.
v3.36.0 - Welcome page kept ready-made
- Owner question (16-Nov-2026): why the Welcome page was slow on the Usage page (about 280 ms typical, 0% ready made) when the other pages take about 7 ms.
- Cause: the Welcome page was the only page not kept at the edge, so it was rebuilt, and the saved settings read, on every visit. Recent teams are held in each browser (localStorage), so the page itself is the same for everyone.
- Changed: the bare address is now kept like the other pages, for the rest of the UK day on weekdays (30 minutes at weekends). The key holds the version, theme, other link settings and the time Admin was last saved, so a release or any Admin change (including a Home notice) shows at once. Light and dark are kept separately.
- Unchanged: Maintenance mode is checked before any stored page, so the Back soon page always wins, and the Welcome page returns as soon as it is switched off. The maintenance page itself is never stored.
- Tests: second visit is a stored copy, light and dark kept apart, no recents in the page, Admin notice added and removed at once, next UK day rebuilt, team links unaffected, maintenance on and off with a stored copy.
- Docs: What's new
v3.35.2 - Win Predictor heading now reads Win Predictor / Game Difficulty
- Owner request (15-Nov-2026): soften how blunt the bar can look when a team is clearly the underdog.
- Changed: the small heading above every Win Predictor bar (Match Centre and Competition table) now reads WIN PREDICTOR / GAME DIFFICULTY. The switches (whole site and per team) are unchanged and still cover the bar.
- Tests: the heading text is checked on Modern and Classic, and the fit and alignment checks still pass with the longer heading.
- Docs: What's new
v3.35.1 - Underdog lines removed, Win Predictor bars line up
- Owner request (15-Nov-2026): remove the motivational messages everywhere and from Admin, because with text below the bar the Win Predictor did not line up across the Match Centre panels.
- Removed: the underdog lines, the Underdog line switch and the Underdog lines list in Admin (Screens). Anything saved for them is ignored. The Opposition report and WhatsApp message are unchanged (they never carried them from v3.34.2).
- Kept: the Win Predictor switch under Screens (whole site) and the per-team Win Predictor switch under Our teams. Kept: the 80/20 and 85/15 limits and the Early season note on TV screens.
- Alignment fix: the Early season note now keeps its row on every Match Centre panel (empty when a team has eight or more games), so the bars sit at the same height on every panel whether or not a note shows.
- Kept from v3.35.0: the fix for Admin, Site status, Manage lines, where adding a new pun line replaced every letter "s" with a space.
- Tests: no underdog code or settings left, Admin has no underdog switch or list, the note slot is present on every compact bar, the Match Centre fit check now mixes panels with and without the note, and the switches still work.
- Docs: What's new
v3.35.0 - Underdog lines editable in Admin
- Owner request (15-Nov-2026): see and amend the Win Predictor motivational messages.
- Admin, Screens: a new Underdog lines list under the Underdog line switch. Edit any line, delete it, add new ones (up to 20, 100 characters each) or restore the default eight. Press Save changes to keep edits. With no lines left, nothing is shown. Duplicates and angle brackets are dropped.
- Each fixture still gets the same line every time (picked from the fixture), so adding or removing lines can change which line a fixture shows.
- Fix found on the way: in Admin, Site status, Manage lines, adding a new pun line replaced every letter "s" in it with a space (the Add button read the text through a broken pattern). It now keeps the text as typed. The new Underdog lines list uses the correct pattern.
- Edits show straight away on the Match Centre: its 15-minute saved copy of each team's summary now changes when the lines or the switch change.
- Tests: Admin shows the default lines, saves and returns edited lines, caps at 20 and 100 characters, removes duplicates and angle brackets, keeps an empty list as empty, and defaults for settings saved before this release; a real underdog fixture uses the saved lines and shows none when the list is empty.
- Docs: Admin guide, Win Predictor
v3.34.2 - Early season note and underdog line on TV screens only
- Owner request (15-Nov-2026): show the note and the motivational line on TV views only.
- The "Early season: based on N games each" note and the underdog line now show only on wide screens (900 pixels and up, the same cut-off as the other TV-only items) and are only slightly larger there, kept small so they never push anything out of the panel. Phones, the Opposition report on a phone and its WhatsApp message no longer carry them, and the phone "How is this worked out?" text no longer mentions the early-season limit. The 80/20 and 85/15 limits themselves are unchanged and apply on every screen.
- Tests: a Win Predictor bar with both the note and the line is now part of the Match Centre fit check at 2576x858, 2576x923, 1920x1080, 1366x768, 1280x720 and 1024x600 (the earlier check had no bar in it). Also checked: hidden below 900px, shown from 900px, not in the WhatsApp message.
- Docs: What's new
v3.34.1 - Underdog lines reworded
- Owner feedback (15-Nov-2026): the underdog lines sounded too American.
- The eight lines now have a drier club-rugby voice, for example "Odds are for bookmakers. Get stuck in." and "Nobody has told the ball who is favourite." Nothing else changes: same 35% rule, same switch under Screens, still no team names in the lines.
- Tests: the same checks (short, plain, no names, picked from the fixture) run on the new lines.
- Docs: What's new
v3.34.0 - Win Predictor: gentler early season, and a switch per team
- Owner request (15-Nov-2026): the Women have moved up a league and are playing teams they have not met, so early percentages are rough, and a very low chance could demotivate the team.
- The most lopsided chance shown used to be 97% to 3%. It is now 80% to 20% while the thinner side has played fewer than eight league games, and 85% to 15% from eight (the model itself is unchanged; the same limits are used by the check page). The ordering and the size of the gap are unchanged.
- An "Early season: based on N games each" note sits under the bar until both sides have eight league games, and the How is this worked out? text says so.
- Admin, Our teams: each team has a new Win Predictor switch. Off stops the win chance showing for that team only (Match Stats, team page, Match Centre, Opposition report and its WhatsApp message). It only matters while Win Predictor is on under Screens.
- Owner request (15-Nov-2026): when your own team is the underdog (35% or less) a short rallying line shows under the bar, such as "Odds are for bookmakers. Get stuck in." Eight lines, picked from the fixture so it is the same on every screen and reload. It also shows in the Opposition report and its WhatsApp message. New Underdog line switch under Screens (on by default).
- Cached win chances from before the release are ignored (new cache key), so the new limits show straight away.
- Tests: limits at 4, 7, 8 and 20 games, the old 97/3 limit for callers without a game count, early flag and note, how-it-works text, per-team switch saved, kept and honoured, Admin shows the switch.
- Docs: Win Predictor, Admin guide
v3.33.1 - Opposition report: form chips explained
- Owner question (15-Nov-2026, DEV): the W / L chips looked like the wrong colours. They were right under the one colour rule (green good for your team), but a plain "W" for the opponent showing red was confusing.
- The rows are now labelled with the opponent's name ("North Petherton's last 3 results") and a short key sits under the chips: green is good for your team (they lost), red is bad for your team (they won). Same for the close games row in the Luck check. Colours unchanged.
- Tests: the labels and the key are present.
- Docs: What's new
v3.33.0 - Opposition report redesign and a fuller WhatsApp message
- Owner request (15-Nov-2026): the report needed to be clearer, better organised and aligned, and the WhatsApp share needed to read properly offline. Presentation only: the data behind the report is unchanged.
- New "At a glance" card at the top: win chance, difficulty, their form, head to head and their rest, each with a coloured dot (green good for your team, amber neutral, red bad) and a key. Tap a row to jump to that section. Jump links sit under it (This game, Their form, You v them, Season).
- One colour rule throughout: green is good for your team. Their losses now show green and are labelled "Their loss" / "Their win"; the common opponents table and the form chips follow the same rule.
- Each of the four sections has a numbered badge and a one-line takeaway at the bottom of its box. On a wide screen (&layout=wide) the four sections sit in an even two-by-two grid with equal-height rows, and the season section is open. On a phone it stays folded.
- WhatsApp message rewritten: a title block (opponent, table position, date and time, venue and ground), then Verdict, Their form, Head to head, Common opponents and Match day, each with its own emoji heading. Scores are shown from your team's side. Directions to the ground where the game is played are always included (the exact ground when known, a map search when not, or "ground to be confirmed"), with the ground name written out so it still reads with no signal. Lines with no data are left out.
- Tests: glance card rows and dots, jump links, colour rule, takeaways, wide grid markup, and the WhatsApp text (headings, scores from your side, directions in every case).
- Docs: What's new
v3.32.2 - Inbox list shows details and newest first
- Owner report (15-Nov-2026, DEV): every message in the Inbox list just said Other, with no text, date or time, and the order was not newest first.
- The list is normally filled from details stored with each message. It now checks each entry has them and, if one does not, reads the message itself (up to 30 per refresh, inside the 50-request limit) and fills in the reason, date and time, device and the start of the text. The list is then sorted newest first, on the server and again in the page.
- Could not be reproduced with the test storage, so the cause on DEV is not confirmed; this makes the list correct whatever the storage returns. If a row still says Other with no text after this, the message itself is unreadable.
- Tests: a list with no details stored still shows reason, text, date and device, and is newest first; messages stored out of order list newest first.
- Docs: What's new
v3.32.1 - Messages polish
- Owner feedback (15-Nov-2026) after trying v3.32.0 on DEV.
- The message form and the thank-you now carry the welcome page branding (wordmark and tagline). The thank-you reads: "Thank you for your message." then a short paragraph about reading every message and resolving what we can, and that a requested feature may appear in the next release.
- Inbox: a Refresh button, and it refreshes by itself every three minutes while the page is open and visible (one KV read each time). The list shows the day, date and time each message was received. A coloured tag (Fault, Team request, Idea, Other) sits beside the subject.
- Device type: the form now records a short device description worked out from the browser (for example "Phone - iOS - Safari" or "Computer - Windows - Chrome"; a Mac with a touch screen is an iPad, a smart TV is a TV). The raw browser string is not kept, and the form says the device type is noted.
- Reading view: opens like an email, with the subject (first line of the message), a tag, From, Received (full date and time), Device, Page and Status, then the message, with the actions along the top.
- Filters: chips for All and each reason with counts, plus Hide done.
- Docs: Admin guide, What's new
v3.32.0 - Message the Stats Board (visitor messages and an Inbox)
- Owner request (15-Nov-2026; mock-up Stats Board Messages canvas): a contact form for visitors, readable only by the owner for now, with a discreet envelope in Admin when a new message is waiting.
- Decisions (15-Nov-2026): the page the visitor came from is attached; the visitor's email is optional; old messages clear out automatically but a message can be kept; spam protection yes; no email notification yet (to add later as an Admin option); reading messages should later become a role permission for a signed-in user.
- Visitor side: /contact (public) with four reasons, a message of up to 1,000 characters and an optional email. Linked from the welcome page and as a small Message us link on phone team pages (not TV screens, Match Centre, Links or Admin pages). Admin switch "Message form for visitors" (on by default) turns the form and the links off.
- Storage: one KV record per message (key msg:...) with a 90-day expiry, so clearing out needs no job. Keep removes the expiry; Stop keeping restores 90 days. The list is read from key metadata in one KV read.
- Spam: a hidden field (robots are told it worked, nothing is stored), a three-second minimum fill time, five messages an hour per visitor (hashed, never stored) and ten an hour in total. Counters live in KV with an hour expiry.
- Admin side: an envelope with a count at the top of Admin and an Inbox link under Tools; /inbox and /api/inbox sit behind the club PIN. Messages can be marked done, kept, deleted (press twice) and the page opened. The existing Admin section called Messages (the homepage and TV notices) is unchanged; the new one is called Inbox.
- Request limits: a visit to the form costs at most five KV operations; the Inbox list is one KV read plus two for opening or changing a message; the envelope count is one KV read on opening Admin. No RFU or external requests are involved.
- Docs: Admin guide, What's new
v3.31.2 - Match Centre: the Next game panel no longer clips
- Owner report (15-Nov-2026, two screenshots): on a wide, short screen the coloured Next game panel was cut off at the bottom (the Home/Away tag, the Win Predictor bar, the "1st v 4th" line, and on the four-team screen the Table row too).
- Cause: the panel was given a fixed 60% of each column and the last result 40%, but the last result needs far less than that, so the panel ran out of room first.
- Fix: the panel now gets 72% and the last result 28%, and a fit step shrinks the whole screen's text a little at a time until nothing in a column is cut off (it only runs on the TV Match Centre columns, not phones or other screens).
- Unchanged: phones, the classic rows, and every other screen.
- Tests: a four-column page with a Win Predictor, ground and clash line is checked at 2576x858, 2576x923, 1920x1080, 1366x768, 1280x720 and 1024x600 for any cut-off panel or hidden table row (x_clip_check).
- Docs: none - behind the scenes
v3.31.1 - Our teams: hide a team without deleting it
- Owner request (15-Nov-2026): a slider on the Our teams page to hide a team without deleting it.
- Each team has a "Show on screens" switch. Off hides the team everywhere (Links page, Match Centre, phone team bar, TV banners, calendar and page titles, because the site's team list leaves it out). Its friendly name, colour, league and RFU numbers stay saved, so switching it on restores it as it was. A hidden team is dimmed in the list.
- Limits: up to six teams show at once (as in v3.30.14), up to twelve are kept in the list, and at least one must stay on (switching off the last one, or removing it, is refused, and the server shows the first team if a list ever arrived with everything hidden). Search to add a team is switched off at six showing, with a note to hide or remove one. Saving more than six showing keeps them all but hides the extras after the sixth.
- Unchanged: nothing else changes for a club that does not use the switch; a team link or a Match Centre &teams= list still works for a team that is hidden.
- Tests: hidden flag saved and kept, Admin shows the switch, Match Centre and the teams list leave out a hidden team, all-hidden keeps the first, eight visible gives six showing and two hidden, thirteen keeps twelve, switching back on keeps colour and league.
- Docs: Admin guide, What's new
v3.31.0 - Match Centre prepares each team in its own request
- Owner report (14-Nov-2026, Feed log, 23:08): Colts "Missing: competition 1608 (request limit reached for this visit)". The held answer kept the right game on screen, but the cup feed could not be read.
- Cause: the free Cloudflare plan allows 50 requests per visit, and Cloudflare counts cache lookups as well as outside fetches. A cold Match Centre built every team in one visit, so the later teams and competitions ran out of budget.
- Change: the page is built from what is already kept (one lookup per team). A team that is not ready shows its last complete answer, or "Updating this team", and the page asks the browser to prepare each such team with its own request (the address with &warm=N). Each of those requests has a fresh budget of 50. When they finish, the page refreshes by the usual crossfade (or a reload on a phone). One team missing is prepared in the same visit. A team that is ready costs one lookup, so asking again is cheap.
- Pages that left teams to be prepared are not kept at the edge, and an older kept copy is dropped, so the next visit builds a page that prepares them. The browser tries once every two minutes at most, so a feed that keeps failing cannot cause a loop.
- Unchanged: the held answer for a vanished game, the Feed log, the 15-minute shared copy of each team, the request budget from v3.30.20.
- Tests: a cold four-team page stays well inside the limit and asks for all four teams; each team request succeeds within 50; afterwards the page is complete with almost no outside requests; an unknown team number is refused; a team that is ready costs no outside request.
- Docs: none - behind the scenes
v3.30.20 - Request budget: stop a busy Match Centre running out of outside requests
- Owner report (14-Nov-2026, DEV, Feed log): Colts 22:04 "Missing: competition 1608 (error: Too many subrequests by single Worker invocation)". The wrong next game came back again.
- Cause: the free Cloudflare plan allows 50 outside requests per visit. A cold Match Centre with six teams made 83 (6 competition feeds, 36 team feeds, 16 + 12 website lookups, 6 match records, 6 venue pages). Past 50, Cloudflare refused the rest, and the cup competition feed was one of them. The retry added in v3.30.19 could not help.
- Fix: each visit now keeps a count. Essential feeds (results, fixtures, other competitions) may use 40; extras (venue and match records, website lookups, earlier seasons and cached predictions for the Win Predictor) stop at 8, so they can never starve a feed that decides the next game. Skipped extras fill in on later visits as the cache warms. Cache lookups are counted too (Cloudflare counts them against the same 50; the first version of this fix missed that and the Colts failed again at 22:14). A cold six-team load now stays within 50 in total, down from 156.
- Feed log: a refused-for-budget feed shows as "request limit reached for this visit".
- Tests: cold six-team Match Centre stays within 50 requests plus cache lookups and all six competition feeds are fetched.
- Docs: none - behind the scenes
v3.30.19 - Feed log findings: ask a failed feed once more, and say why it failed
- Owner report (14-Nov-2026, DEV, from the new Feed log): Colts 21:24 "Incomplete answer, nothing earlier to keep: Missing: competition 1608, unlabelled games: 2. Showing: Sat 28 Nov v Kingsbridge Colts" and Brixham 21:29 "Missing: team feed. Showing: Sat 21 Nov v St Austell".
- What it shows: the Colts' cup games come from competition 1608; its feed failed once, so the two cup games had no competition name and the next game came out as the league game. There was nothing earlier to keep because it was the first Match Centre load after the deploy (the last complete answer is only kept from then on). Only one Colts row, not a run of them, so the failure was occasional, not constant. Brixham's own team feed failed once the same way.
- Fix 1: a feed that fails for a quick reason (server error, too many requests, dropped connection) is now asked once more after a short pause, for the team feed and for each other competition a team is entered in. A timeout is not retried (it would double the wait), and a refusal or missing page is not either.
- Fix 2: the reason is now kept and shown in the Feed log, for example "competition 1608 (HTTP 503, asked twice)", "team feed (error: ...)" or "refused (robot check)". In the summary address it is "partialDetail".
- Not known yet: why 1608 failed (it could be the RFU server, or many feeds asked at the same moment right after a deploy). The reason in the log will say.
- Tests: one error is retried and the answer is complete; two in a row are partial with the reason; a timeout is not retried.
- Docs: none - behind the scenes

v3.30.18 - Phone app Links sheet follows Admin names
- Owner report (14-Nov-2026): on a team's mobile view the Links button (top right) still produces links with friendlyName. My v3.30.15 and v3.30.17 fixes did not touch it, because that sheet is built in the browser by the phone app, not by the server.
- Cause: the app keeps a team record that includes the Admin name (and a team picked from the recent or club lists always gets it), and one function that builds every link in the app copied it into the address.
- Fix: that function now leaves friendlyName out when it is just the Admin name or the RFU name; a different name typed into the address is kept. This covers every row of the sheet (This page, Match Stats, Opposition report, Fixtures, Leaders and the clubhouse TV links) and the app's own page and frame addresses.
- Tested in a browser by pressing every Share button in the sheet: with a plain address, with an address that carries the Admin name, and with recent teams remembered, no link has friendlyName; with &friendlyName=Seniors typed in, every link keeps it. The check fails on v3.30.17 for the address carrying the Admin name.
- Docs: none - links only

v3.30.17 - friendlyName back after the DEV PIN page
- Owner report (14-Nov-2026, DEV): a page address still ended with &friendlyName=Ivybridge+1XV after v3.30.15 (competition, division, team, teamName, theme, force, app, then friendlyName).
- Cause: the Admin name is filled into each request first thing, and the DEV PIN page then remembers where to send you back to from that filled-in request, so after typing the PIN you land on an address that carries the name. It was at the end because the filler appends it last. Reproduced in a test (the return address contained friendlyName) and fixed. The DEV PIN page is DEV only, so the live site did not do this; the club PIN page (Links, Admin) has the same shape but those addresses carry no team, so nothing was added.
- Fix: the Admin name is now filled in after the PIN, maintenance and address checks, so those pages see the address as typed. A name typed into a link still survives the PIN page.
- If a page address still shows friendlyName after this, tell me what you tapped to get there: the in-app team switcher and the links made by the pages were also checked and do not add it.
- Docs: none - behind the scenes

v3.30.16 - Match Centre rows with five or six teams
- Owner report (14-Nov-2026, iPad photo): with more than four teams the row view is cramped; the "Next game" box was cut off at the bottom (the Next Saturday tag and the Win Predictor bar).
- Reproduced with five and six teams and the Win Predictor on: every Next game box overflowed by 8 to 17 pixels at 1920x1080, 1366x768, 1280x800, 1180x700 and 1149x640 (1024x768 and 1180x820 fitted with five teams).
- Fix: with five or six teams the rows use a more compact Next game box (smaller day, date and tag, team lines, crests and padding). Rows with four or fewer teams are unchanged, and so are the Modern layout and the phone cards.
- Checked in a browser: with five and six teams and the bar on, nothing is cut off in any box at seven screen sizes from 1024x768 to 1920x1080 (new test in the build).
- Docs: none - layout only

v3.30.15 - Links from team pages follow Admin names
- Owner report (14-Nov-2026): links made from a team's mobile page still carried the friendly name, which is not needed now that names are set in Admin.
- Cause: when a link has no name the server fills in the Admin name so the page shows it, and the page then built its own links (Match Stats, Opposition Report, Fixtures, Share, Add to home screen, WhatsApp text) from that filled-in request, so the name came back out in every one. Measured before the fix: the mobile page had four such links, the TV page three, the opposition page three, fixtures three.
- Fix: when a page is built, any friendlyName that is just the Admin name of one of the club's teams is taken out of its links (plain, escaped and the double-encoded form inside the home-screen and WhatsApp links). A different name typed into a link is kept, and a longer name that begins with an Admin name (for example Admin "Ivybridge" and a link saying "Ivybridge Women") is left alone.
- The calendar file link now also follows Admin when it has no name, since it no longer carries one.
- Cost: one pattern replace when a page is built (about 0.02 ms on a large page); nothing on a cached page.
- Docs: none - links only

v3.30.14 - Our teams: six at most, and a tidier add
- Owner request (14-Nov-2026): limit the club to six teams for now (checked first: a Match Centre of 10 or more rows is cut off on a 1080p TV, 8 fits at 1080p but not at 1366x768, 5 and 6 fit at both).
- Admin > Our teams now holds up to six teams (it was 24). Search is switched off at six with a note to remove one first, and the server also keeps only the first six if a longer list is ever saved. A Match Centre link built with &teams= was already limited to six.
- Fix: when adding a team, the list of search results stayed on screen after you picked one, with the leagues added underneath. Picking a team now clears the results, so only that team's leagues are shown. If the team plays in just one league it is added straight away without asking; with more than one you choose. Change league behaves as before.
- A club that already saved more than six teams would be cut to six the next time it saves; none of the club's own lists are that long.
- Docs: none - admin wording only

v3.30.13 - Win Predictor on the Opposition Report
- Owner request (14-Nov-2026): put the Win Predictor on the Opposition Report.
- It is the first card in "1. This game": the same bar as elsewhere (home side on the left, your team in its accent colour) with the "How is this worked out?" text shown open, because coaches will want to see the ratings gap (for example "Ivybridge 1XV are rated about 18 points better than Okehampton on results; playing at home adds about 5 points").
- Follows the existing Admin > Screens switch (off by default) and the same hiding rules: not for cup games, not when the two sides are in different divisions or have fewer than four league games. Only shown when the opponent in the report is the one the chance was worked out for.
- The report's data (&format=summary&detail=opposition) now carries "win" when on. The team page's lazy "This game" block is unchanged.
- Docs: none - follows the existing Win Predictor switch

v3.30.12 - Feed log
- Owner request (14-Nov-2026): a wrong next game corrects itself on refresh, so it cannot be caught with the debug address; asked for automatic logging.
- New page /feedlog (club PIN, under Tools in Admin as "Feed log"). Whenever the Match Centre finds a game missing from the feed (earlier game kept for a round, or new next game accepted after 15 minutes), an incomplete answer (what was missing; what was kept and what the incomplete answer would have shown) or a team that would not load, it adds a row with the time, team and details. Newest first, last 80 kept; the same event repeated within 10 minutes is one row.
- Stored in the settings store (one small key, "feedlog"), written only when something goes wrong, so a normal day writes nothing. Public pages never show it.
- To use: when a team shows the wrong game, note the time and read /feedlog; the row around that time says what the feed left out.
- Docs: none - admin tool

v3.30.11 - Match Centre fit fix, and a missing game is held
- Owner report (14-Nov-2026, iPad, DEV): alignment was worse after v3.30.10 (the ground line cut off at the bottom of the coloured blocks), and the wrong next game for the Colts came back once, then corrected itself on refresh.
- Fit: the gap reserved for two-line names pushed the lower lines out of the block on 16:9 and wide screens (my earlier check missed it). When any name in the row wraps to two lines, all names in that row are a little smaller (2.5 instead of 2.9) and reserve 7.25 lines of text instead of 8.4; the block gaps and padding are slightly smaller. (Tighter line spacing was tried first and clipped descenders, which the existing layout test caught.) A new test checks that nothing overflows the block at nine screen sizes (1024x600 up to 2560x1440); it overflowed by 5 to 12 pixels at six of them before and by none now.
- Wrong game, third cause (from the code, not seen live): the feed can answer without error yet leave out a game (tomorrow's cup game), and that looks complete, so v3.30.7 and v3.30.8 cannot catch it. Now, if the game shown last time is still to be played and has gone from the latest answer (the next game is later), the Match Centre keeps showing the earlier game for one 15-minute round. If the next build agrees it has gone (postponed or removed) the new next game is accepted. A game that has been played is never held.
- The held answer carries "held" in the summary address, so it can be seen in &format=summary.
- Not verified on live data: whether the RFU feed really drops the game; this protects against it either way.
- Docs: none - behind the scenes and layout

v3.30.10 - Match Centre columns line up
- Owner report (14-Nov-2026, photo of the live Match Centre): where a team had no Win Predictor (and no "2nd v 3rd" line) its NEXT GAME heading, crest and text sat lower than the other columns, because the coloured block centred whatever it held.
- Fix (Modern layout): the block now starts at the top (heading, crest, opponent name, date, Home or Away) so those line up in every column, and the Win Predictor, ground and "2nd v 3rd" lines sit at the bottom in slots that keep their height in every column when any team has one (an empty slot is left blank). A two-line opponent name (15 letters or more) reserves two lines in every column, so the date stays level; a one-line name is centred in that space.
- Checked in a browser at 1920x1080 and 1366x768: heading, crest, date, Home or Away and ground line within 1 pixel across columns with a bar missing from one, a "2nd v 3rd" line missing from another and a shorter name in a third; nothing cut off at the bottom.
- A team with no next game is unchanged (its message stays centred). The Classic layout and the phone cards were not affected.
- Docs: none - layout only

v3.30.9 - Group names with their competition
- Owner question (14-Nov-2026): the Colts show as "Group 1"; is there a competition name to use instead?
- The league title was taken from the group name in the RFU feed (the group is the division: "Group 1" for the Colts), with the competition name used only if there was no group. Now, when the group name is only "Group", "Pool" or "Section" plus a number or letter, the competition name (without a trailing season) goes in front: "Devon RFU Colts Group 1" if the feed's competition is "Devon RFU Colts". Names like "Regional 2 South West" are unchanged.
- The Match Centre (Modern, Classic and phone) also falls back to the league text saved for the team in Admin (Our teams) if the feed gives only "Group 1" with no competition name.
- Not verified on live data: the exact competition name the RFU sends for the Colts. The summary address shows it ("league").
- Docs: none - wording on screen only

v3.30.8 - Fix: next game flipping, second cause
- Owner check (14-Nov-2026, Colts, DEV): the plain summary showed the cup game (Sun 15 Nov at Paignton) with no "partial" flag, yet the Match Centre had just shown the wrong game again. So an incomplete answer can pass the v3.30.7 check.
- Likely second cause (from the code): the cup game also comes from the team's own season feed, which carries no competition name. It is only recognised as a cup game if the team's competition list (which comes from the upcoming-games call and a 30-day memory) includes the cup. If that list lacks it for a moment, the game is added with no name, treated as a league game, and the next game falls back to the league one. No request fails, so v3.30.7 did not notice.
- Fix: a game that is only in the team feed, has no competition or group name, and is in none of the competitions we read now counts as "partial" ("unlabelled games: N"), so it is not stored and the last complete answer is shown instead.
- To check: &format=summary&detail=fixtures&debug=fixtures now shows "unlabelled" under debug when this happens.
- Docs: none - behind the scenes

v3.30.7 - Fix: next game flipping between competitions
- Owner report (14-Nov-2026): the Colts, who play in more than one competition, sometimes show a game tomorrow and sometimes one next weekend on the Match Centre.
- Likely cause (from the code; not reproduced on live data): the next game across every competition is built from several RFU requests (the team's season feed, the team's competition list and each other competition). If one of them is refused or slow, the answer silently falls back to the league alone, so a cup game tomorrow disappears and next weekend's league game shows. The 15-minute summary copy (v3.30.5) and the stored page (v3.30.6) could then keep the wrong answer for a while.
- Fix: the fixtures answer now says "partial" (and which feed: team feed, competition list, or the competition number) when any request fails. A partial summary is not stored, a page built while a feed was missing is not stored, and the Match Centre shows the last complete answer for that team (kept up to 7 days, ignored if its game has already passed) instead of the league-only one.
- To see it happen: open the summary address for the team with &format=summary&detail=fixtures (the answer now carries "partial" and "partialWhy"), or the plain summary ("partial" appears when a feed was missing).
- Not changed: when a feed is down and there is no earlier complete answer, the league-only answer is still shown.
- Docs: none - behind the scenes

v3.30.6 - Page cache rebuilt (stored pages kept longer, old copy shown while a new one builds)
- Owner decision (14-Nov-2026): there are no games Monday to Friday, so nothing changes; the aim is fewer page rebuilds on the free plan (10 ms per request). Applies to the team page, Match Centre, Fixtures board and Match Stats (the pages that were already stored for 2 minutes, or Match Stats for 5 minutes / 2 hours).
- Monday to Friday: a stored page is fresh for the rest of the UK day. Saturday and Sunday: fresh for 30 minutes; after that the older copy (up to 6 hours old, same UK day only) is shown at once and a new one is built in the background, so nobody waits for a rebuild.
- A copy from an earlier UK day is never shown (Today, Tomorrow and This Saturday would be wrong), so the first visit after midnight rebuilds the page.
- The stored copy's key now includes the time Admin was last saved (as well as the version and team list), so any Admin change, and any deploy, shows at once.
- The browser is told to keep a page for 60 seconds only, as before the change, so a TV or phone reload picks up a rebuilt page quickly.
- Now used on DEV as well as PROD (it was PROD only). A deploy shows at once because the version is in the key; data changes on DEV follow the same timing as PROD.
- If a background rebuild fails (for example over the working-time limit) nothing is shown to the visitor and the next visit tries again; the older copy is not shown past its limits.
- Match Stats no longer has its own timings (it was 5 minutes at weekends, 2 hours Monday to Friday); it follows the rules above. The old timing function is left in the code unused.
- Not done (owner decision): an uptime pinger to warm pages after midnight.
- Docs: none - speed only, nothing a visitor sees

v3.30.5 - Working-time savings (free Cloudflare plan)
- Confirmed from Cloudflare's Metrics (14-Nov-2026): 16 "Exceeded CPU Time Limits", none for memory. The site is on the free plan (10 ms of working time per request) and the owner prefers not to pay, so the aim is to make pages cheaper.
- Measured with a profiler (test rig, a 14-team division, which is larger than the real ones): the largest single cost was date formatting, because every toLocaleDateString, toLocaleTimeString and toLocaleString call built a brand new formatter (about 20% of a page). Now one formatter per set of options is kept and reused; the output is identical (checked on 75 combinations including clock changes and invalid dates). Names with no HTML codes skip the decoding loop, and the "Updated" stamp reuses its formatter.
- Each team's Match Centre summary is kept in Cloudflare's shared cache for 15 minutes (and refreshed on a change of settings, team names or the Win Predictor switch), so one Match Centre load no longer redoes the page work for every team.
- Result in the rig (warm, per request): team page TV 35 to about 11 ms, phone 26 to about 14 ms, Match Stats 31 to about 16 ms, Match Centre 92 to about 30 ms. Still over 10 ms on a cold server instance, so some risk remains; the page-level cache at the edge is what serves most visits.
- Next ideas if 1102 still appears: skip building the page HTML when only the summary data is asked for, trim the JSON walks, cache more of the shared pages at the edge.
- Docs: none - speed only, nothing a visitor sees

v3.30.4 - Fix: Error 1102 with Win Predictor on
- Seen on DEV (14-Nov-2026) after the Win Predictor was switched on: Cloudflare Error 1102 ("Worker exceeded resource limits"), which then cleared by itself.
- Cause (measured in the test rig, not confirmed from Cloudflare's own logs): each Win Predictor figure takes about 6 to 10 ms of working time to solve, and the check page about 85 ms per team. The result was only remembered inside one running server instance, so after every deploy or restart each new instance redid the sums for every team on every Match Centre load (four teams and more at once) on top of an already heavy page. Peaks of busy screens and phones starting together went over the limit, then calmed down once each instance had its figures.
- Fix: the solving stops at a thousandth of a point (was a ten-millionth): about three times quicker, same percentages. Predictions are now also stored in Cloudflare's shared cache (24 hours; the check page result 6 hours), so one instance does the work and the others reuse it. The in-memory copy stays as the first stop.
- To confirm: Cloudflare dashboard > the Pages project > Metrics or the real-time logs show the exception type (CPU time or memory). If 1102 returns, look there first.
- Docs: none - speed fix only, nothing a visitor sees

v3.30.3 - This season's data kept longer
- Owner decision (14-Nov-2026): the site is for looking at stats after a game, not during it. This season's results, fixtures and tables from the RFU are now kept for 30 minutes on Saturdays and Sundays and 24 hours Monday to Friday (was 10 minutes and 1 hour). This is the setting behind the "Updated" time on every screen.
- Effect: a result the RFU enters on a weekday can take up to a day to appear; at weekends, up to 30 minutes. If a copy is older than its time, the first visit still shows it at once and refreshes it in the background, as before.
- Open pages still reload themselves every 10 minutes at weekends and every hour otherwise, so dates and countdowns stay right; they simply find the same stored data.
- The Match Stats page kept at the edge for 30 minutes on weekdays (v3.14.2) is unchanged.
- Docs: none - cache timing only, nothing a visitor sees

v3.30.2 - Win Predictor kept for a day
- Owner decision (14-Nov-2026): the numbers are for after a game, not during it, so there is no need to recalculate often. The Win Predictor result is now kept for 24 hours (was 30 minutes). The key includes the number of results in the division, so a new result gives a new key and the figures change as soon as the RFU data does; a changed fixture (different opponent) is also a new key.
- Earlier seasons' matches for a team (used by the Win Predictor and by the Match Stats league meetings) are kept for 24 hours (was 10 minutes on weekends, 1 hour otherwise), because a finished season does not change. The current season's data is unchanged (10 minutes on weekends, 1 hour otherwise) as the rest of the site uses it.
- The memory kept for predictions is emptied if it ever holds more than 300 entries.
- Docs: Win Predictor, What's new

v3.30.1 - Win Predictor on the Match Centre
- Renamed: the win chance is now called Win Predictor in Admin (Screens switch and Tools link), the check page, the Documentation and on every bar, which carries a small-capitals "WIN PREDICTOR" heading.
- New on the Match Centre: a slim bar with the percentage and the team name inside each side, so it is clear whose is whose (the name is left out of a side under 28%, which is then just the percentage). Modern (TV): in the coloured Next game block, our side in the block's reversed colour and the opponent faded. Classic (TV) and the phone cards: in the Next game box under the two teams, our side in the team colour and the opponent slate. The home side is on the left. The phone cards also have the "How is this worked out?" line. A team with no prediction shows no bar and leaves no gap.
- Not on the Fixtures board (owner decision, 14-Nov-2026).
- Still off until switched on in Admin under Screens. Not seen on a real TV yet.
- Docs: Win Predictor, What's new

v3.30 - Win chance on the next game
- A percentage chance for each side, always adding to 100%, as a split bar: the home side on the left, the colours following the teams. It is on Match Stats (the side colours from the crests) and in the Next fixture panel of the team page (the team's own colour against a neutral one; on phones a "How is this worked out?" line opens a one-sentence reason). It is off until switched on in Admin under Screens ("Win chance on the next game").
- The maths: a strength in points for every team from this season's division results (every game says home strength minus away strength plus home advantage equals the margin, solved for all teams together, with teams that have few games pulled towards the middle). Home advantage is measured from the league's own results (shrunk towards 4 points). Last season counts half and the season before a quarter, using only games between teams in this season's division; a team new to the division starts in the middle. The expected margin over how widely results in the league vary gives the chance; a draw is shared evenly; never shown beyond 97 to 3.
- Hidden when either side has played fewer than four league games, for cup and other non-league games, when the other side is not in this league's table, and while the switch is off. The result is kept for 30 minutes so pages agree.
- New Win chance check page (/winchance, club PIN, listed under Tools in Admin): for every finished game this season it works out the chance from the games before it and compares with what happened (how often the favourite won, Brier score against 0.25 for 50/50, points out, and whether a 70% chance happened about 70% of the time), for each club team and overall. Read it on the test site before switching the bars on.
- Tests: the maths on simulated seasons (calibrated, better than 50/50), the switch, the summary data, the bars on the pages (in a browser at TV and phone size) and the check page. Not yet on: Match Centre cards, which need a layout review on a real screen. It is deliberately not going on the Fixtures board.
- Not verified on real data: the container cannot reach the RFU, so the numbers on the live feed are first seen on the test site's check page.
- Docs: Win chance, Admin guide, What's new

v3.29.2 - Our teams: no Short label box
- The Short label was not needed: the phone jump bar and Match sheet tabs now work the label out from the friendly name (a leading "The" and a first word shared by several teams are dropped, so "Ivybridge Women" shows as "Women"). It also fixes a flaw: a short label typed or filled in once did not follow a later rename. Saved lists lose any stored short label on the next save.
- Docs: Admin guide, What's new

v3.29.1 - Renamed teams show sooner
- After renaming a team in Admin, the team table and Match Centre pages still showed the old name when reloaded, because the browser was told to keep those two pages for 5 minutes. It is now 1 minute. Allow up to about two minutes in all after pressing Save (settings are read about every 30 to 60 seconds, then the page).
- Docs: none - behaviour of one setting, no new feature

v3.29 - Our teams: friendly names set once in Admin
- New Our teams section in Admin (second in the menu). It holds the club's list of teams: friendly name, short label, colour, league and order. Add a team by searching the RFU and choosing its league; Change league moves a team to a new division; Move up, Move down and Remove set the order. It replaces the TEAMS list that was written into the code, which is now only the starting default for a club that has not saved a list.
- The friendly name is used wherever that team appears: Links page, Match Centre, phone team bar, TV banners, page titles and the Usage page. A name typed into a link (friendlyName) still wins, so TVs and bookmarks set up earlier keep what they show. A link that repeats the RFU's own name as its friendlyName counts as having none.
- Links made from the Links page and the link builder no longer carry friendlyName for a team on the list, so they are shorter and follow Admin. The phone app and the welcome-page redirect also follow Admin for club teams, so a renamed team does not keep an old name from "Recent".
- The Match Centre link on the Links page no longer lists team names in its description.
- A saved list is cleaned on save: duplicates, bad numbers and markup are dropped, colours are checked, and a list with no valid team falls back to the default. The page store is keyed by the list, so a rename shows straight away.
- Not changed: opposition teams keep the RFU's name; the old "Ivybridge 2nd XV is The Vandals" rule on names in links is still there (Ivybridge-specific, on the audit list).
- Docs: Team settings, Admin guide, What's new

v3.28.4 - Usage: Outside calls chart lines up
- In a bar with website calls, the gold count read "4 web" and wrapped onto two lines on a phone, which made that column taller and lifted its bar and hour label above its neighbours. The gold count is now just the number (the gold colour and the note under the heading say what it is), every label row has a fixed height, and none of them wrap.
- Hour labels are two digits (09, 10, 11) instead of 09:00, so they stop running together on a phone. They are still UTC hours.
- Docs: none - cosmetic fix on a report page

v3.28.3 - Usage: one row per team
- "Teams people look up" showed Ivybridge twice (29 as ours, 8 not ours). Records were grouped by name, league and the "ours" flag, so one team with two spellings of its name, or recorded before and after joining the list, got two rows. Rows are now merged by team number: counts add up, "ours" shows if any record says so, and the team number is shown next to the name. If two rows still appear, they have different team numbers and are different teams with the same name.
- Docs: none - small fix to a report, no change to how anything works

v3.28.2 - Usage: Teams people look up
- The Usage card "Teams that are not in our list" is now "Teams people look up". It lists every team opened by people (phone, tablet or computer) or picked in the link builder, whether or not it is in our list. Our own teams carry an "ours" mark. TV screens are no longer counted in it, so they cannot swamp the list.
- Counting is unchanged: only the team, league ids and county are kept, and typed search text is never stored. The card shows up to 30 teams.
- Docs: Admin guide, What's new

v3.28.1 - Match Stats size jump fixed (real cause found)
- Two scripts were fitting the Match Stats page: its own, and the shared TV one added to every page that has a form strip. The shared one reset the text size 0.4 and 2.5 seconds after load, so the page jumped larger and back about a tenth of a second later. That is the "readjusts after a few seconds" you saw. The page now carries a marker so only its own script runs.
- The page also waits for crests to finish loading (up to 6 seconds) as well as being still for 0.7 seconds before it fades in.
- Found by recording the page's text size every 50 ms in a real browser with slow crests. A test now guards it.
- Docs: none - cosmetic fix, no change to how anything works

v3.28 - Crossfade refresh on big screens
- Every TV and tablet page that reloads itself (Match Stats, Match Centre, Fixtures board, the TV layouts and the stacked views) now refreshes by crossfade. The new page loads in a hidden frame the size of the screen, fits itself, and when it has stopped changing it fades in over the old page for about a second. The old page is removed once the fade ends.
- If the new page fails or takes more than 20 seconds, the old page stays up and the next refresh tries again. A refresh never blanks the screen.
- Phones and small windows (800 wide or less) keep the ordinary reload. The first load of a page is unchanged.
- Refresh timing is unchanged (hourly on weekdays, every 10 minutes at weekends where it was). The hidden copy is a normal page load, so it counts as a screen load on the Usage page, as the reload did.
- Docs: Setting up a clubhouse screen, What's new

v3.27.7 - Match Stats waits until the page is still
- v3.27.6 faded the page in after a fixed half second, but crests and fonts arriving later made it resize again, once while fading in and once about a second after. The page now stays hidden until nothing has changed for 0.7 seconds (up to 3.5 seconds at most, 4.5 as a last-resort timer), so it appears once, fitted.
- Docs: none - cosmetic fix, no change to how anything works

v3.27.6 - Match Stats page flicker on big screens
- The Match Stats page (view=match) shrinks its text to fit the screen. It showed at full size first, then shrank in steps as crests, fonts and weather arrived, which looked like flicker. It is now hidden until fitted (about half a second) and fades in once. A 2.5 second safety timer shows it anyway. Phones and small windows are unchanged.
- Docs: none - cosmetic fix, no change to how anything works

v3.27.5 - One club entry point: Club access opens Admin
- The public welcome-page footer shows only the version and Club access. Release notes and Documentation links are gone from it (both need the PIN anyway).
- Club access signs in and opens Admin. Links, Usage, Match sheet, Documentation and Release notes have an "Admin" link at the top to return.
- Admin Tools order: Team links, Usage, Match sheet, Documentation, then Release notes (test site only; the live site has no Release notes page).
- Docs: Admin guide, What's new

v3.27.4 - Admin Overview tidy-up
- The Settings tiles on the Overview repeated the menu (left menu on wide screens, tabs on a phone), so they are removed. The Overview shows the status cards and any live notices only.
- Docs: Admin guide, What's new

v3.27.3 - Admin date boxes fit on an iPhone
- The two "Hide automatically after" date boxes had a fixed iPhone style that made them wider than their card and left them empty and tall. They are now width-limited, left-aligned and the same height as the other boxes.
- Docs: none - cosmetic fix, no change to how anything works

v3.27.2 - Admin on a phone: tabs instead of a full-screen menu
- A swipeable row of section tabs sits across the top on a phone (the side menu stays on wide screens). The Overview opens first; there is no separate list screen and no Back link.
- Sections are in a new order: Overview, Messages, Screens, Match day, Site status, Data sources, Privacy and counts, Access, then Tools.
- The Save bar is only shown once something has been changed (with Discard), and it hides a few seconds after a successful save. The page no longer jumps to the top when you switch section.
- Docs: Admin guide, What's new

v3.27.1 - Documentation brought up to date, and a release check for it
- Admin guide rewritten around the new Admin sections (menu, Overview, Save bar, phone layout, deep links).
- Added to the Documentation: Modern and Classic Match Centre layouts (ly), screen names (screen) and the Screen name box on the Link builder, the England Rugby website back-up switch, the Match sheet, Powered by line, maintenance mode steps, and cup games with no name.
- New release rule: every release's README entry must carry a line "- Docs: <sections updated>" naming existing Documentation sections, or "- Docs: none - <reason>" for changes nobody sees. check_release.py stops the build otherwise.
- Docs: Which page is which, Setting up a clubhouse screen, Admin guide, How the data works, What's new

v3.27 - Admin organised into sections
- Admin now has a menu: Overview, Messages, Screens, Match day, Data sources, Privacy and counts, Access and Site status. Every setting moved into one of them; nothing was removed. The Overview shows site status, visitors and screens today, the website back-up state and any live notices.
- Tools (Usage, Documentation, Release notes, Match sheet, Team links, and Probe on DEV) are in the same menu.
- One Save bar stays at the bottom. It shows "Unsaved changes" with a Discard button until you save, and the browser warns before you leave with unsaved changes.
- On a phone the menu is a list; each section opens with a Back link. Addresses like /admin#screens open a section directly.

v3.26.1 - Screen name on the Link builder page only
- The Screen name box is on the Link builder page (/builder), as intended. I had put it on the find-your-team page by mistake; it is removed from there.

v3.26 - Modern and Classic, screen name in the link builder
- The Match Centre layouts are now called Modern (was Next game first) and Classic (was Classic rows) in Admin. The settings and &ly=next / &ly=classic links are unchanged.
- The Link builder page (/builder) has a Screen name box. Whatever you type is added to every link as &screen=, so the screen shows by name on the Usage page.

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
- Documentation rule (from v3.27.1): every release updates the Documentation or says why not. The README entry for the version needs a line "- Docs: <section titles, comma separated>" (each must be a real Documentation section) or "- Docs: none - <reason>". check_release.py fails the build without it.
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
