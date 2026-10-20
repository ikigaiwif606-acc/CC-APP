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

The app includes responsive layouts, accessible dialogs and forms, reduced-motion support, and English / Traditional Chinese. There are no classes or instructor workflows. The previous runtime has been retired; original source remains in Git history.

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

Tests exercise the catalogue, Malaysian time boundaries, duration expiry, single and unlimited admission, founding stock/idempotency, role permissions, occupancy, group enquiries, public/member/staff routes, purchasing, QR entry, registration and Traditional Chinese.

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
