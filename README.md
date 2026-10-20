# HandC APP

Move. Reset. Repeat.

A wellness booking and studio operations prototype, developed from [SYNC-APP](https://github.com/ikigaiwif606-acc/SYNC-APP) with an original HandC identity inspired by functional transparency, minimalist industrial design and analog instruments.

## Design

Warm paper backgrounds, charcoal displays, aluminium neutrals and restrained red indicators. The local dot-matrix wordmark and CSS instrument illustrations need no external image or font service.

- A clear next-visit ticket and pass ledger on the member home screen.
- A timetable with explicit session availability and status.
- A booking receipt showing the selected package, balance after booking, expiry and cancellation deadline. Bookings inside the cancellation window are labelled explicitly.
- Ticket-style pass wallets and a ten-visit membership punch card.
- Consistent forms, dialogs, reports and workspaces for reception, instructors and administrators.
- Responsive navigation, keyboard focus, reduced-motion support, English and Traditional Chinese.

The shared design system is in `src/styles/theme.css`; feature files contain their layouts. The previous forest, glass and floating-card skins have been retired.

## Features

Book Yoga and Contrast Therapy, manage passes and bookings, redeem rewards, inspect points history and display a member check-in QR code. Staff can manage schedules and people, assist with bookings, scan arrivals and inspect attendance reports. Admin can assign instructors, issue passes and adjust points. Instructors have scoped schedules, preparation and attendance tools.

## Run locally

No build or package installation is needed to run the application:

```sh
git clone https://github.com/ikigaiwif606-acc/HandC-APP.git
cd HandC-APP
python3 -m http.server 4184 --bind 127.0.0.1
```

Open <http://127.0.0.1:4184/>.

## Demo accounts

Choose **Try a demo account** on the sign-in page. All sample accounts use `HandCDemo2026!`.

| Role | Email |
| --- | --- |
| Member | `jamie@handc.demo` |
| Admin | `admin@handc.demo` |
| Front desk | `frontdesk@handc.demo` |
| Instructor, both services | `instructor@handc.demo` |
| Yoga instructor | `yoga@handc.demo` |
| Contrast Therapy instructor | `contrast@handc.demo` |

## Verification

Node.js 20 or later is required for the development-only integration tests:

```sh
npm ci
npm test
```

The suite exercises account routing and permissions, member and staff pages, booking previews, pass debits, cancellation refunds, branding, isolated storage and Traditional Chinese.

## Deployment

The application is static HTML, CSS and JavaScript. Vercel uses the project root as the output directory with no install or build step; `vercel.json` defines this explicitly. Development tests and internal review notes are excluded from deployment.

## Prototype scope

Data is stored in the current browser under HandC-specific keys. Accounts and records are not shared across devices. Authentication, purchases and email flows are simulated; no real payments or emails are sent. Use sample details when exploring.

Taipei location, NT$ pricing, services and provisional membership rules are inherited demonstration settings. HandC contact channels have not been supplied, so the app does not link visitors to SYNC's external accounts. A production service needs shared storage, server-side authentication and confirmed studio policies and contact details.

## Source and bundled libraries

The Git history retains the SYNC-APP baseline. Local QR libraries retain their licenses: [jsQR](vendor/jsQR-LICENSE.txt) and [QRCode.js](vendor/qrcode-LICENSE.txt). Historical planning and review documents under `docs/` describe the source prototype and are not current HandC QA reports.
