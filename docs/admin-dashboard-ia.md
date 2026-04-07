# Admin Dashboard IA Spec

This note is the written, Figma-ready source of truth for the admin workspace. It defines section order, route meaning, and shared UI patterns so the dashboard can be recreated later without guessing.

## Route Map

- `/admin`
  Dashboard overview and action-first summary.
- `/admin/sections`
  Manage storefront category structure.
- `/admin/products`
  Manage stock, pricing, and media.
- `/admin/orders`
  Review verified live and demo checkouts.
- `/admin/security`
  Change the admin password and review access rules.
- Unknown `/admin/*`
  Redirect to `/admin` instead of the public storefront.

## Dashboard Section Order

1. Overview strip
   Saved Orders, Revenue, Live Products, Out of Stock.
2. Needs Attention
   Out-of-stock count, low-stock count, missing image count, missing video count, plus highest-risk products.
3. Quick Actions
   Create a section, create/update a product, review orders.
4. Catalog Health
   Section count, sellable products, full-media coverage, image coverage.
5. Orders Snapshot
   Recent verified orders with payment mode and totals.
6. Workspace Status
   Signed-in admin, session state, environment, checkout mix, and a short reading guide.

## Panel Hierarchy

- Shell metadata bar
  Breadcrumb-style path cue, current route name, one-line route purpose, environment chips, and session state.
- Page header
  Human-readable title, a short explanation of what the page is for, and one or two obvious next actions.
- Action-oriented panels
  Each panel answers one question only and should avoid mixing overview and editing in the same block.
- Row/list patterns
  Dense operational rows with chips, short notes, and one obvious next action.

## Page Patterns

- Login
  Auth-first layout with compact trust cues, a generic local-mode note, and clear field/error hierarchy.
- Sections
  Split layout: editor on the left, live section list on the right. Every row shows product count so deletion risk is obvious.
- Products
  Split layout: product editor on the left, searchable inventory list on the right. Stock state and media gaps must be visible without opening edit mode.
- Orders
  Dense review list with customer identity, payment mode, references, totals, and line items grouped together.
- Security
  Focused password change page with explicit validation rules and post-update sign-in guidance.

## Guardrails

- Section deletion is blocked when the section still has products.
- Product deletion is blocked when the product already exists in saved orders.
- Conflict messages must be readable to a non-technical admin and should surface directly in the admin UI instead of leaking database-style failures.

## Shared Component Patterns

- Use the same admin shell, route metadata bar, page header, panel styling, and empty/loading/error treatments across all admin pages.
- Use explicit buttons and links for actions; do not wrap action buttons inside navigation links.
- Keep copy operational and plain:
  - what happened
  - what needs action
  - where to go next
- Keep section titles English and short so an admin understands the page quickly.
- Prefer enterprise-premium styling over dramatic hero treatment:
  - lower visual noise
  - tighter spacing rhythm
  - calmer gradients
  - clearer action emphasis
