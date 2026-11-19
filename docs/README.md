# Documentation index

Start here. Each document says who it is for.

| Document | For | Read it to… |
|---|---|---|
| [PRODUCT_OVERVIEW.md](PRODUCT_OVERVIEW.md) | **PM**, designer, marketer | Understand what the product does, each screen, what is built / not built, and which customer complaint each feature answers |
| [ARCHITECTURE.md](ARCHITECTURE.md) | **Developers** | See how the code is organised, the module rules, and how to add a feature |
| [DATA_MODEL.md](DATA_MODEL.md) | Developers, PM | Know every data field we use, what we added, and where data is stored |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Developers | Run, test, build, deploy; coding conventions; definition of done |
| [PROGRESS.md](PROGRESS.md) | Everyone | See what is done, what is next, and what is blocked (updated at every step) |
| [TEAM_DISCUSSION.md](TEAM_DISCUSSION.md) | Team meeting | Requirements, open questions, and the decisions to make (data structure, approach) |
| [ONE_PAGE_SUMMARY_INPUT.md](ONE_PAGE_SUMMARY_INPUT.md) | PM | Draft input for the final 4-question summary (C3) |
| [../HANDOFF.md](../HANDOFF.md) | PM (QA) | Step-by-step test script for the live link |
| [../README.md](../README.md) | Everyone | Portfolio README in the template format |

Each feature folder also has its own `README.md` (`src/features/<name>/README.md`).

## Provided resources (`resources/`)
Files we received. Treat them as read-only references.

| File | What it is |
|---|---|
| `Developer_brief.md` | The task, scope, timing, and what "done" means |
| `B3_data_spec.md` | Field definitions of the sample data (the source of truth for field names) |
| `A5_customer_feedback_samples.md` | 10 customer / rider / shop inquiries: the evidence for the problem |
| `C3_one_page_summary_guide.md` | How the PM writes the final summary |
| `current_app_screens/` | The 5 as-is screens (search, details, checkout, rider, home) |
| `problem-statement/` | The two problem-statement images |
| `Lieferoo_Design_Guide_lite.png`, `Delivery_App_UI_Kit.fig`, `image.png` | Design guide, UI kit, as-is user flow |
| `templates/` | README and QA-handoff templates |

The sample data itself lives in `public/data/` (it is loaded by the app) and the design tokens in `src/shared/styles/tokens.css`.
