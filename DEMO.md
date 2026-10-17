# Aperture AI · Demo flow

## Start

Run `npm start` and open the Local URL it prints. The light sign-in screen opens first. If Supabase is configured, test email/password or email-link sign-in; otherwise choose **Enter the local demo** to explore the learner experience. The preview shortcut does not authenticate.

## Show the class loop

1. Open **Classes** and search or filter the sample session. Open its details; the meeting link stays hidden until enrollment.
2. Choose **Join class**. Open **My Classes**, then the **Calendar**. The same class record now appears in the joined list and calendar, with the time shown in the selected timezone.
3. Use **Switch demo portal → Continue as mentor**. Open **Mentor Classes** to see the participant count, edit the schedule, or cancel it. A cancellation remains visible with its status.
4. Select **Create class** to review the class fields and validation. Times are converted from the selected IANA timezone and saved as UTC timestamps in this browser.

## Show the core product

Open **Video to Form** to demonstrate consent-based Gemini video analysis. The model drafts an activity description, evidence-backed skill suggestions, strengths, and specific improvement/practice ideas. Review or correct the generated text before adding it to the Skill Passport. Then decode the sample opportunity or prepare a bilingual mentor conversation.

## Explore the added platform areas

- **Skill Analytics:** review the profile evidence map; it never displays a generated score or fabricated trend.
- **Mentors:** search three example profiles by expertise and follow them in this browser. These are demo fixtures, not verified accounts.
- **Communities:** join example topics, publish a local text discussion, and toggle its upvote. Posts are not shared with other users.

## Be clear about the prototype

Role switching, class data, enrollment, capacity checks, and meeting-link visibility are local demo behavior. They do not replace Supabase Auth, server-side authorization, database transactions, RLS, Supabase Realtime, or persistent storage. Use fictional meeting links and sample people only. Video analysis sends the selected video to Google Gemini only after consent and may incur charges.
