# Developer brief · Delivery app: the last 100 m

> For developers. Read this with the Project brief. It covers what you build, what you don't, the data you get, and what "done" means for your handoff.
> Version 1.1 · 2026-11-10 (timing updated, marketer added)

## 1. The situation in one minute

The delivery app **Lieferoo** now shows its screens in English. Orders from foreign residents went up, but so did failed and late deliveries. The screens are translated, but **the address and delivery notes reach Korean-speaking riders and shops exactly as the customer typed them.**

Your team is a task force: a PM, a designer, you, and in some teams a marketer. You make one flow work end to end: **a foreign customer enters an address and delivery notes in English → the rider sees what they need, in Korean, on one screen.**

## 2. What you build (mobile web)

| Screen | Language | What it must do |
| --- | --- | --- |
| Customer screen(s) | English | Register a delivery address and leave delivery notes |
| Rider screen | Korean | Show that order's address and notes for the rider |

- What the customer enters must **actually show up** on the rider screen. This is the core of the evaluation.
- If your team has a marketer, the marketer's launch assets (banner, push, social post, rider notice) tell users what your feature does. In final QA, the PM checks each of these promises on your live link. **Anything promised must actually work there.**
- 2–3 screens are enough.
- Build it as a mobile web app. Check it on a phone-sized screen.

## 3. What you don't build (not evaluated)

Sign-up and identity checks, payment, choosing a shop or menu, real map or address API integration, dispatching riders, Lieferoo branding, the rest of the app.

You can make it work with the provided data only. Adding AI translation is allowed but not required, and real API integration is not evaluated.

## 4. What you get

Look in **Resources**:

- **Sample address data** (`sample_addresses.json`) and **sample order data** (`sample_orders.json`). Field definitions are in **Data Guide**.
- **Current app screens** and **User Current Flow** — how the app works today. They are your starting point. A result that only restyles them is not evaluated.
- **README_template** — start your README from this.
- **QA handoff note template** — what to hand to the PM.
- **Deploy guide** — how to get a live https:// link.

If you add or change data, write it in the README's Data section.

## 5. Your task and timing

| | |
| --- | --- |
| Example task | V1 · Build both screens and connect the sample data |
| You receive from | Designer (screens + specs, both languages) |
| You hand off to | PM, who runs QA and is your reviewer |
| Estimated work | About 6 hours |
| Recommended due | T0+40h (your PM sets the actual due time) |

- You can start before the design is approved: set up the repository, the data loading and a first deploy.
- **Deploy early.** A rough version on a live link by the middle of the project saves you from a broken deploy at the deadline.
- T0 is when your PM starts. Team members start at T0+3h. The project's final deadline is **T0+49h**, and no one can move it.
- Your PM can change your task's due time during the project (always before T0+49h). You get a notification when it changes.
- Due times don't stop during your offline hours. On time = the approved version was **submitted** by the due time.

## 6. Done means

Your handoff can be submitted only when all of these are true:

1. **Working web link** — a public https:// link where the core flow runs. Keep it live after the project ends.
2. **GitHub repository** — public, not empty, with `README.md` at the root.
3. **README** — every section of README_template filled in (the submit screen shows which are missing).
4. **Task List** — every item checked:
   - Core scenario works end to end
   - Empty and error states handled
   - Connected to the sample data
   - Checked on a mobile screen
   - Built and excluded scope
   - Known bugs

When you submit, the workboard checks that the link opens, the repository is public and the README is there, and shows which README sections are missing.

## 7. How the result is judged

| | Meets expectations | Exceeds expectations |
| --- | --- | --- |
| Completion | The customer's input shows up on the rider screen | Plus the reasons for chosen and dropped clues are clear in the summary |
| Quality | The core flow runs end to end | Plus empty fields, "no search results" and wrong addresses are handled |
| Change handling | A mid-project change is reflected, or the summary says why not | Reflected by the due time, with the scope change recorded |

Speed always counts together with first-time approval. A fast handoff that gets rejected is not a good record.

## 8. What you keep for your portfolio

- A live demo link and a public repository with a full README
- Your role and contribution, written in the README and recorded on the workboard
- The PM's review and your teammates' peer reviews in your Growth Report
