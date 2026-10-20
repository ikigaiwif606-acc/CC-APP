# HandC APP

Cold. Heat. A moment to reset.

A thermal wellness pass and studio operations prototype for Raja Uda, Butterworth, Penang. The app was developed from [SYNC-APP](https://github.com/ikigaiwif606-acc/SYNC-APP); the current interface and access model are specific to HandC.

## Passes and access

Every pass includes the communal sauna and both cold-plunge pools.

| Pass | Price | Access | Allowance / validity |
| --- | --- | --- | --- |
| Full Day | RM70 | 9am–9pm | One entry on the chosen date |
| Sunrise | RM30 | 9am–12pm | One entry; leave by noon |
| Sunset | RM30 | 6pm–9pm | One entry; leave by 9pm |
| Weekly | RM200 | 9am–9pm | Unlimited entries for 7 days from purchase |
| Monthly | RM500 | 9am–9pm | Unlimited entries for 30 days from purchase |
| Founding Member | RM3,000 | 9am–9pm | Unlimited entries for one year from purchase; 200 passes total |

All times use `Asia/Kuala_Lumpur`. Duration validity begins at the exact purchase timestamp and runs continuously, including outside access hours. Annual expiry is the calendar anniversary, with 29 February clamped to 28 February in a non-leap year. Single-entry tickets offer a visit date within 90 days; an ended window cannot be bought for that date.

Reception confirms entry and departure. Showing a QR code never consumes a pass. A single-entry pass is used only after staff confirm admission. Duration passes support repeat admission after recorded departure. An eligible duration pass is used before a finite day ticket. A visit's departure deadline is the earlier of pass expiry and its access window's end. Overdue visits remain visible until staff record departure.

The founding counter is calculated from saved demo purchases, capped at 200, and guarded against duplicate confirmation. This is a local allocation, not shared inventory.

## Design and workflows

The day and night palettes follow the [HandC business concept](https://handc-business-summary.vercel.app/): pale concrete, brushed steel, dark industrial surfaces, warm timber, dot-matrix identity, thin grids and small red indicators. Optimized concept images from that brief are bundled under `assets/studio/`. Temperatures of 4°C and 8°C are labelled as targets, not live readings.

Visitors can browse the studio and six passes before signing in. Members can purchase demo passes, see exact validity, display their entry QR, inspect visits and purchase history, and update their profile. Reception and admin can sell passes, review member records and process group enquiries. All staff can confirm entry/departure, pause admissions and change manual facility status. Only admin can configure an approved operating occupancy limit; no limit is inferred from pool or sauna design capacities.

The homepage moves from the thermal halo into the studio experience. Its pass links lead to the dedicated collection, where visitors can review all six passes and choose a visit date before authentication. Continuing saves the selection in session storage; sign-in and registration show the selected pass, price, access hours and date, with an edit action. The date survives authentication and registration, and a separate confirmation is still required to issue a demo pass. A date that expires while the visitor signs in is shown for correction rather than silently replaced. The original pending-product key is accepted during the transition.

Time-sensitive views refresh at access-window and expiry boundaries without replacing the page, resetting forms, closing dialogs or restarting the halo. The dashboard distinguishes closed hours, paused admissions, full capacity and open admissions using the same rule as entry validation. Closing time takes precedence over paused/full status; existing visits remain available for departure. An open entry confirmation is withdrawn when entry becomes invalid, while purchase dates receive an inline warning. Visible pages check boundaries once per second and refresh on return from a hidden tab. Mobile departure tables use cards, and staff navigation exposes all destinations without horizontal scrolling.

The app includes responsive layouts, accessible dialogs and forms, reduced-motion support, and English / Traditional Chinese. There are no classes or instructor workflows. The previous runtime has been retired; original source remains in Git history.

## Sound, motion and night mode

New visitors start in night mode. An early theme check preserves an explicit day preference before the first paint. Later theme choices are remembered.

The front page opens with the **thermal halo**: a breathing, slowly rotating dot-matrix ring in silver and amber, with a red orbiting point. It breathes over four bars of the 104 BPM track; a Web Audio analyser adds a restrained response to the actual music's bass. Muted or blocked audio leaves the gentle breathing motion without simulated beat pulses. The canvas caps drawing at 30fps, reduces the dot count on mobile, and stops its animation loop while offscreen or hidden. Route changes dispose the old canvas and its observers. Day mode uses darker dots for contrast.

Below the halo, **Cold → Heat → Reset** unfolds through a natural scrolling sequence of the pools, sauna and reception. It includes a dot-matrix logo reveal, large animated typography, slow image movement, water light and warm highlights. The three scene selectors also work without scrolling. The hero has no play/pause button. Visual motion can still be paused in sound settings; device reduced-motion preferences take priority, display a static halo and remove the extended scrolling sequence. Lower sections reveal once as they enter view. Offscreen scenes and hidden tabs pause their continuous animation.

The header's waveform button opens independent **Music** and **Button effects** controls, separate volume sliders and **Mute all sound**. Music defaults to on and fades in where browser autoplay is permitted. If the browser requires activation, it starts with the first ordinary click, tap or keyboard activation, without opening the sound controls. A pending autoplay attempt never blocks the interface or claims that music is already playing. Music mute/off and volume choices persist; effects remain off until selected. The loop is downloaded only when playback can start. Playback continues across the app's routes and suspends when the page is hidden. Failed loading or browser audio permissions leave the application usable and offer a retry.

The bundled **Thermal / 104** is an original 104 BPM, 16-bar ambient dub techno composition, approximately 37 seconds long. Rounded percussion, minor and suspended chords, stereo echoes and synthesized water texture form a loop. It uses no commercial recordings or external samples. Its source is [scripts/render-ambience.mjs](scripts/render-ambience.mjs); the AAC asset is about 530 KB. Recreate it with Node.js and FFmpeg:

```sh
node scripts/render-ambience.mjs /tmp/handc-thermal.wav
ffmpeg -i /tmp/handc-thermal.wav -c:a aac -b:a 112k -movflags +faststart assets/audio/thermal-104.m4a
```

Every enabled app button, navigation link and disclosure receives a quiet click while effects are enabled. Toggles use a small electronic response; confirmed purchases, admissions and saved changes receive a two-note confirmation, while errors use a low double tap. Disabled controls stay silent. These sounds are synthesized locally with Web Audio and have short envelopes and bounded voices.

## Run and verify

No build or package installation is needed to serve the static application:

```sh
python3 -m http.server 4184 --bind 127.0.0.1
```

Open <http://127.0.0.1:4184/>. For the development tests, use Node.js 20 or later:

```sh
npm ci
npm test
```

Tests exercise the catalogue, Malaysian time boundaries, duration expiry, single and unlimited admission, founding stock/idempotency, role permissions, occupancy, group enquiries, public/member/staff routes, purchasing, QR entry, registration, Traditional Chinese, default theme and saved preferences, automatic audio, blocked-autoplay fallback, remembered mute, looping, cancelled playback and reduced motion. Clock-controlled checks cover noon expiry, opening/closing, overdue departures, open dialogs and unfinished forms. Guest checkout checks cover review before authentication, retained dates, editing with typed credentials and registration. Browser checks verify actual audio decoding and responsive layouts separately from the mocked regression tests.

## Demo accounts

Choose **Try a demo account** on the sign-in page. The shared sample password is `HandCDemo2026!`.

| Role | Email |
| --- | --- |
| Member | `jamie@handc.demo` |
| Admin | `admin@handc.demo` |
| Reception | `reception@handc.demo` |
| Studio attendant | `attendant@handc.demo` |

Registered demo passwords are salted and hashed with PBKDF2. This browser-only account system is not production authentication. Use sample details and a throwaway password.

## Deployment and scope

[Live app](https://handc-app.vercel.app) · [GitHub](https://github.com/ikigaiwif606-acc/HandC-APP)

Vercel serves the project root without an install/build step, as defined in `vercel.json`. Development tests and historical notes are excluded from deployment.

Data uses the fresh `handc-thermal-v2` namespace. Earlier demonstration records are not migrated into thermal passes. Purchases, stock, admissions, sales and enquiries are simulated in the current browser and are not shared across devices. No real payments or messages are sent. Live operation requires shared persistence, server-side authentication and authorization, payment confirmation and verified entry credentials.

The final address, contact channels, drink menu/prices, refund terms and approved operating capacity have not been supplied. Group enquiries do not reserve places or confirm private access. Historical documents under `docs/planning`, `docs/reviews` and `docs/diagrams` describe the previous source prototype.

Bundled QR libraries retain their licenses: [jsQR](vendor/jsQR-LICENSE.txt) and [QRCode.js](vendor/qrcode-LICENSE.txt).
