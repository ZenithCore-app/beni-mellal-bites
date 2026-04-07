

# Fix: Orders Not Visible to Couriers

## Problem
Orders start at status `"placed"`. The courier dashboard filters for `status = 'ready'` with `courier_id IS NULL`. There is no restaurant owner interface to advance orders from `placed → preparing → ready`, so orders are stuck and invisible to couriers.

## Solution
Two changes needed:

### 1. Add a Restaurant Owner Dashboard (`/restaurant-dashboard`)
A simple page where restaurant owners can see incoming orders and update their status:
- View orders for their restaurant(s) with status `placed` or `preparing`
- Button to mark `placed → preparing`
- Button to mark `preparing → ready` (this makes it visible to couriers)

This requires:
- A new RLS policy on `orders` allowing restaurant-role users to SELECT and UPDATE orders for their restaurant
- A new `restaurant` value added to the `app_role` enum
- A new page component and route

### 2. Simpler Alternative — Auto-advance orders (recommended for now)
Since there are no real restaurant owners yet, automatically set new orders to `"ready"` status so couriers can immediately see and claim them. This unblocks the entire delivery flow for testing.

Later, when a restaurant dashboard is built, the default can revert to `"placed"`.

**Implementation:**
- In `Checkout.tsx`, change the order insert to set `status: 'ready'` instead of the default `'placed'`
- This is a one-line change that immediately makes the courier flow functional

### 3. Add a simple admin/status control (bonus)
Add a temporary "Simulate Restaurant" section on the order status page that lets the customer manually advance their order to `ready` — useful for demo/testing purposes.

## Recommended Approach
Implement **option 2** (set status to `ready` on insert) as an immediate fix, plus **option 3** (a small simulate button on the order status page) so users can test the full flow. This is minimal code and unblocks everything.

## Files to Change
- `src/pages/Checkout.tsx` — add `status: 'ready'` to the order insert
- `src/pages/OrderStatus.tsx` — add a "Simulate: mark as ready" button for testing
- Database migration — update the existing order from `placed` to `ready` so it appears for couriers now

