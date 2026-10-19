# Invite to SYNC — referral program

**Status:** Future consideration. Not scheduled or approved for implementation.

**Recorded:** 19 October 2026

This note preserves the proposed referral framework for later planning. No referral functionality has been added to the app. Reward amounts, eligibility rules and staff incentives need business review before implementation.

## Purpose

Give **Admin, Frontdesk, Instructor and Member** accounts their own referral link, code and QR code. Track the new customer's journey and issue rewards after a qualifying first paid visit.

Use one program with role-based permissions and incentives. Keep referral attribution separate from the staff member who makes a booking or teaches the class.

## Customer flow

1. A referrer shares their personal link or QR code.
2. A friend opens an invitation showing the offer and eligibility rules.
3. The friend creates an account or enters a referral code before their first purchase.
4. The friend buys an eligible pass, books a class and attends.
5. The first qualifying paid session is completed and payment checks pass.
6. Rewards enter the appropriate points, Wallet or staff incentive ledger.
7. Both sides can see their own referral progress and reward status.

Example link format, for illustration only:

```text
https://sync-wellness.vercel.app/?ref=SYNC-A7K9Q2
```

Codes should be random and belong to a stable account ID. Do not include an email, member number or role in the public URL. A role change should not change the account's referral link.

## Proposed pilot rewards

These are starting suggestions, not agreed benefits or current app settings.

| Recipient | Proposed benefit | Qualification |
| --- | --- | --- |
| New customer | 1,000 welcome points | First eligible paid visit completed |
| Member referrer | 1,000 points | Referred customer qualifies |
| Frontdesk or Instructor referrer | Configurable staff referral bonus | Customer qualifies; Admin manages settlement |
| Admin or Owner referrer | Acquisition tracking by default | Customer qualifies; personal incentives require a separate decision |

- Member points should use the existing points balance and activity history.
- If a campaign awards a class pass instead, add the credit to **Wallet** for booking a future class. Do not automatically book a session.
- Keep staff incentives separate from member points and pass credits.
- Referral rewards should not directly advance membership tiers; tiers remain based on completed visits.
- Confirm reward cost, service capacity, limits and the release delay before selecting an offer.

## Role access and app placement

| Role | Placement | Access |
| --- | --- | --- |
| Member | Rewards → Invite friends; Account shortcut | Own link, referral progress and rewards |
| Instructor | Dashboard → My referrals | Own link, conversions and incentive history |
| Frontdesk | Workspace → My referrals | Own link and results; enter a customer's referral code during registration |
| Admin | Referrals section, including My referral link | Own link plus program settings, all referrals, campaigns, incentives, exceptions and audit history |

Frontdesk assistance must preserve the customer's chosen referrer. Attribution changes should require Admin access, a reason and an audit entry.

## Personal referral panel

- Personal link, referral code and QR code.
- **Copy link**, **Share on LINE** and **Show QR** actions.
- Registered customers, successful referrals, pending rewards and earned rewards.
- A compact progress list showing first name or masked identity, status, deadline and reward.
- A clear explanation of the offer, eligibility and qualification deadline.

Referrers should not receive the customer's email, phone number or purchase history. A share-button tap is not proof that an invitation was delivered; report link visits, registrations and qualified referrals separately.

Suggested member invitation copy, subject to the final offer:

> Come try Yoga or Contrast Therapy at SYNC. Complete your first paid visit through my invitation and we'll each receive 1,000 points.

Staff invitation copy must match their campaign's actual customer offer. LINE sharing should open a prefilled message for the user to choose recipients and send; do not send automatically. Reference: [LINE text-sharing URL scheme](https://developers.line.biz/en/docs/messaging-api/using-line-url-scheme/#sending-text-messages).

## Proposed eligibility and safeguards

1. **New paying customers:** Allow an existing unpaid account to add a referral before its first eligible purchase.
2. **One direct referrer:** Show the chosen referrer before confirmation. No multi-level referral structure is proposed.
3. **Attribution lock:** Lock the referrer at the first eligible payment. Admin corrections require a recorded reason.
4. **Qualifying attendance:** Count a paid, attended and completed session. Exclude free sessions, reward-pass visits, cancellations and no-shows.
5. **Qualification window:** Consider 30 days; confirm the starting event, timezone and expiry wording before launch.
6. **Award once:** Repeated payment or attendance events must not issue duplicate rewards.
7. **Self-referral checks:** Block self-referrals and flag suspicious duplicate identities for review.
8. **Refund handling:** Reverse unused rewards when appropriate. Send already-spent rewards for Admin review rather than silently cancelling future bookings.
9. **Preserved offers:** Store the accepted campaign version so later rule changes do not rewrite an existing customer's offer.
10. **Controlled exposure:** Restrict personal data by role and configure reward limits, budgets and any refund-related release delay.

## Admin dashboard and settings

- **Overview:** Registrations, qualified referrals, conversion rate, attributed sales and reward cost.
- **Campaigns:** Enable or pause a campaign; configure eligible services, reward types and amounts, qualification window, release delay, limits and budget.
- **Referral records:** Filter by customer, referrer, role, date and status.
- **Staff incentives:** Pending, earned, settled and payment history.
- **Exceptions:** Duplicate flags, attribution corrections, disqualifications, refunds and reversals.
- **Audit history:** Who changed a record, when and why.

Suggested progress stages:

**Registered → Purchased → Booked → Attended → Reward pending → Reward issued**

Also support **Expired**, **Disqualified** and **Reversed**, each with a clear reason. Keep underlying payment, booking and attendance events so progress remains accurate after cancellations or rebooking.

## Technical foundation for a future implementation

The current app stores demo data in the browser. A real referral program needs authenticated accounts, a shared server database and authoritative payment and attendance events to work across devices.

| Record | Purpose |
| --- | --- |
| Referral codes | Stable account ownership and shareable codes |
| Referrals | Referrer, referred customer, accepted campaign version, qualifying order/session, timestamps and status |
| Campaign versions | The accepted offer and qualification rules |
| Reward ledger | Beneficiary, reward type and amount, issue status, duplicate-prevention key, points/Wallet transaction, reversals and credit expiry |
| Staff incentive ledger | Bonuses and settlement history |
| Audit events | Administrative changes and exception reasons |

Qualification and reward issuance must be checked server-side and committed atomically. Replayed events must be safe. Reward issuance should connect to the existing points and Wallet model.

**Demo identity consideration:** Staff demo accounts currently share Jamie's member reference. Use the authenticated **account ID**, not the active member ID, to identify a referrer. Consider retaining a role snapshot for historical reports when roles change.

## Decisions to revisit before starting

- Final customer offer, member reward and staff incentive structure.
- Eligible purchases and services, qualification timing and refund policy.
- Reward release timing, expiry, campaign limits and budget.
- Attribution rules for existing unpaid accounts and assisted registration.
- Staff incentive approval and settlement process.
- Backend, account identity and payment/attendance event integration.

## Possible rollout

1. Establish server-backed identities, attribution and payment/attendance events.
2. Introduce personal links for all roles, registration attribution, member rewards, staff referral tracking and Admin reporting.
3. Add staff payouts and milestone bonuses after the core program is reliable.

No implementation date or priority has been agreed. Revisit this note when referral development is requested.
