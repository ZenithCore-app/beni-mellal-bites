
# Functional Order & Delivery System

## Phase 1: Database Schema
Create tables via migrations:
- **profiles** — linked to auth.users, stores name, phone, role (customer/courier)
- **user_roles** — separate roles table (admin, customer, courier)
- **orders** — id, customer_id, restaurant_name, items (jsonb), status, total, delivery_address, scheduled_for, is_subscription, courier_id, created_at
- **order_items** — order_id, menu_item_id, name, price, quantity, added_by
- **group_sessions** — id, host_id, host_name, session_code, is_open, created_at
- **group_session_participants** — session_id, user_name, items (jsonb)

RLS policies for all tables.

## Phase 2: Authentication
- Login/Signup page (email + password)
- Role selection on signup (Customer or Delivery Agent)
- Auth context provider
- Protected routes

## Phase 3: Order System
- Update checkout to save orders to DB
- Order status page reads from DB
- Customer order history page

## Phase 4: Delivery Agent Portal
- `/courier` dashboard (protected, courier role only)
- View available orders (status = "ready")
- Accept/claim an order
- Update status buttons: Picked Up → Arrived → Delivered
- Past deliveries history tab

## Phase 5: Group Order (DB-backed)
- Create group session saves to DB
- Share link with session code
- Join session page — add items to shared cart
- Host can finalize and place order

## Pages to create/update:
- `/auth` — Login/Signup
- `/checkout` — Save to DB
- `/order-status/:id` — Real-time status from DB
- `/my-orders` — Customer order history
- `/courier` — Delivery agent dashboard
- `/group-order` — DB-backed group sessions
