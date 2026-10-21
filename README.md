# CC-APP

**Cold. Heat. A moment to reset.**

A web app prototype for **Mekansm**, a thermal wellness studio concept in Raja Uda, Butterworth, Penang. Explore sauna and cold-plunge passes, manage memberships, and try the daily workflows of a studio reception team.

[Open the live app](https://cc-app-my.vercel.app) · [Studio concept](https://handc-business-summary.vercel.app/)

## The experience

| Workspace | What you can do |
| --- | --- |
| Visitors | Explore the studio, compare passes, choose a visit date, and continue to sign-in or registration. |
| Members | Purchase demo passes, view validity and entry codes, review visits and purchases, and update a profile. |
| Reception | Find members, sell passes, review access, confirm entry and departure, and manage group enquiries. |
| Studio attendants | Confirm entry and departure, monitor current visits, and update facility availability. |
| Admin | Access reception and studio tools, pause admissions, and configure an operating occupancy limit. |

The interface includes English and Traditional Chinese, day and night themes, responsive layouts, keyboard-accessible dialogs, and reduced-motion support. A dot-matrix identity, animated thermal halo, studio imagery, and an original ambient soundtrack carry the experience from the homepage into the app. Music and button sounds have separate controls.

## Passes

Every pass includes the communal sauna and both cold-plunge pools. Prices below are the current demo catalogue, in Malaysian ringgit.

| Pass | Price | Access hours | Validity |
| --- | --- | --- | --- |
| Full Day | RM70 | 9am–9pm | One entry on the selected date |
| Sunrise | RM30 | 9am–12pm | One entry on the selected date; departure by noon |
| Sunset | RM30 | 6pm–9pm | One entry on the selected date |
| Weekly | RM200 | 9am–9pm | Unlimited entries for 7 days |
| Monthly | RM500 | 9am–9pm | Unlimited entries for 30 days |
| Founding Member | RM3,000 | 9am–9pm | Unlimited entries for one year; allocation of 200 passes |

All access rules use Malaysia time (`Asia/Kuala_Lumpur`). Weekly, monthly, and annual validity starts when the purchase is confirmed and runs continuously. Single-entry passes use the chosen visit date.

Members show an entry QR code at reception. Staff scan the code or look up the member number, review the available pass, and confirm admission. A single-entry pass is consumed only when entry is confirmed. Departure is recorded separately, and repeat visits on an unlimited pass require the previous visit to be closed.

## Try the demo

Open the [live app](https://cc-app-my.vercel.app), go to sign-in, and select **Try a demo account**.

| Role | Email |
| --- | --- |
| Member | `jamie@handc.demo` |
| Admin | `admin@handc.demo` |
| Reception | `reception@handc.demo` |
| Studio attendant | `attendant@handc.demo` |

Shared demo password: `HandCDemo2026!`

Purchases, member records, visit history, and enquiries are saved in the current browser. Data is not shared across devices, payments are simulated, and group enquiries do not send messages or reserve places. Use sample details when exploring registration.

## Run locally

The app uses plain HTML, CSS, and JavaScript. Python 3 is enough to serve it; no build step or package installation is required.

```sh
git clone https://github.com/ikigaiwif606-acc/CC-APP.git
cd CC-APP
python3 -m http.server 4184 --bind 127.0.0.1
```

Open [localhost:4184](http://127.0.0.1:4184/).

To run the automated checks, use Node.js 20 or later:

```sh
npm ci
npm test
```

The tests cover pass validity, Malaysian time boundaries, purchases, admissions, role permissions, occupancy, member journeys, translations, audio preferences, and reduced motion.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | App shell and asset loading |
| `src/core/business.js` | Pass catalogue, access rules, purchases, visits, and studio state |
| `src/thermal/` | Interface, translations, styles, animation, and audio behaviour |
| `assets/` | Logos, studio concept images, and the ambient soundtrack |
| `vendor/` | QR generation and scanning libraries |
| `tests/app.test.mjs` | Automated business-rule and interface checks |
| `scripts/render-ambience.mjs` | Source for the original ambient audio |
| `vercel.json` | Static deployment configuration |

## Deployment and scope

Vercel serves the project root with no install or build step. The GitHub repository is connected to the `cc-app` project, with production available at **[cc-app-my.vercel.app](https://cc-app-my.vercel.app)**.

This is a browser-based prototype. Live operation would require a shared backend, server-side authentication and authorization, payment processing, and verified entry credentials. Studio images are concept visuals; displayed pool temperatures are targets. The final address, contact details, refund terms, and operating capacity remain to be confirmed.

Bundled QR libraries retain their licenses: [jsQR](vendor/jsQR-LICENSE.txt) and [QRCode.js](vendor/qrcode-LICENSE.txt).
