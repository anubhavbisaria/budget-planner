# /mockup — Frontend Design Mockup Generator

When the user invokes `/mockup [feature description]`, generate **3 static HTML mockup variants** for the described UI feature, then ask the user to pick one before any real code is written.

## Your job

1. **Understand the feature** from the argument (or ask one clarifying question if the description is too vague).

2. **Generate 3 self-contained HTML files** — each a complete, openable-in-browser mockup with hardcoded sample data and basic interactivity (tab switching, hover states, etc.). No backend required.

3. **Name the files** `mockup-[variant].html` inside a `mockups/` folder at the project root.  
   Use these three design directions every time:

   | File | Direction | Character |
   |------|-----------|-----------|
   | `mockup-tabular.html` | **Tabular / spreadsheet** | Dense, data-first, power-user feel. Tables, tight rows, monospace amounts, column sorting UI. |
   | `mockup-modern.html` | **Modern / minimal** | Generous whitespace, card-based layout, clean sans-serif, subtle shadows, pastel accent colors. Think Linear or Notion. |
   | `mockup-fintech.html` | **Fintech dashboard** | Inspired by Monarch Money / EveryDollar. Category icons or color dots, progress bars toward budget limits, donut-chart placeholder (CSS-only), bold surplus/deficit numbers. |

4. **Commit all three files** to the current branch with message `"Add /mockup variants for [feature]"`.

5. **Ask the user to pick one** using `AskUserQuestion` with the three options. Include a short description of each trade-off.

6. **Do not write any real application code** until the user has approved a mockup.

## Quality bar for each mockup

- Real sample data (not "Lorem ipsum") drawn from the project domain.
- Sidebar/nav if the app has one — show it.
- The main interaction state (e.g., scenario detail view, comparison table) must be visible without clicking.
- Surplus/deficit bar must be present if this is a budget view.
- Color palette: neutral grays for layout, `#2e7d32` green for surplus, `#c62828` red for deficit (unless the mockup direction overrides).
- Inline-editable fields should have a `:focus` style so the user can see how editing will feel.
- Mobile is out of scope — desktop only.

## After the user picks

- Note which variant was chosen.
- Delete or move the two rejected files to `mockups/archive/` (do not commit deletions unless the user says so).
- Proceed to implement the real feature using the chosen design as the reference.
