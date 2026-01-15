## One-page MVP PRD (3 Key Functions)

### Product name

**Warehouse Receiving MVP (Standalone Inventory)**

### Purpose

Build a small, standalone system that helps a warehouse **receive vendor shipments faster and more accurately**, and **update internal inventory** without using QuickBooks.

### Target users

* **Receiver (warehouse staff):** scans and counts items while unpacking
* **Manager/Owner:** reviews discrepancies and finalizes receiving

### MVP scope (focus on 3 key functions)

## Key Function 1: Product Setup (SKU + Barcode)

**Goal:** Ensure every scanned barcode maps to the correct product.

**User flow**

1. Manager creates products (iPhone accessories) with:

   * Product name
   * SKU / model number (unique)
   * Barcode (one or more)
2. Receiver scans barcode → system identifies the product instantly.

**Requirements**

* Add/edit product
* Add/edit barcode mapping
* Search product by SKU/name/barcode
* If barcode not found: show “Unknown barcode” (MVP can simply block scan and show error; advanced handling can come later)

**Success criteria**

* 95%+ of scans match a known SKU during receiving.

---

## Key Function 2: Receive Shipment (Expected vs Received)

**Goal:** Quickly verify a shipment by comparing invoice quantities vs actual counts.

**User flow**

1. Create a receiving session:

   * Vendor name
   * Invoice number
   * Date
2. Enter expected items (from invoice):

   * SKU + expected quantity (manual entry)
3. Unpack and scan items:

   * Each scan increments received quantity
4. System continuously shows:

   * Expected qty
   * Received qty
   * Delta (missing/extra)

**Requirements**

* Create receiving session (Draft → In Progress)
* Add invoice lines (expected qty)
* Scan-to-count (received qty auto-increments)
* Manual adjust (+/-) per SKU (manager only or both roles)
* Discrepancy view (missing/extra)

**Success criteria**

* Receiver can process a shipment with minimal typing (mostly scanning).
* Discrepancies are visible without manual calculation.

---

## Key Function 3: Finalize Receiving (Update Inventory)

**Goal:** Once counts are approved, update internal inventory and lock the record.

**User flow**

1. Manager reviews discrepancy list
2. Manager clicks **Finalize**
3. System updates inventory on-hand quantities and locks the session

**Requirements**

* Finalize receiving session (Manager only)
* On finalize:

  * Add received quantities to inventory on-hand
  * Save a transaction record (audit)
  * Lock session (read-only)
* Inventory view:

  * SKU, product name, on-hand qty, last updated

**Success criteria**

* Inventory reflects received stock immediately after finalize.
* Every inventory increase can be traced back to a receiving session.

---

### Out of scope (explicitly NOT in MVP)

* Customer orders / outbound deduction
* Accounting (billing, payments, profit reports)
* Bin/location tracking
* Multi-warehouse
* Advanced unknown-barcode workflow (can be Phase 1B)

---

### Minimal screens (MVP)

1. Login
2. Product Setup (SKU + barcode)
3. Receiving Sessions List
4. Create Receiving Session
5. Invoice Entry (expected items)
6. Scan & Count
7. Discrepancy Review + Finalize
8. Inventory List

---

### Data to store (minimum)

* Product (SKU, name)
* Barcode mapping
* Receiving session (vendor, invoice #, status, timestamps)
* Receiving lines (expected qty, received qty)
* Inventory balance (on-hand qty)
* Inventory transaction log (receive qty + session reference)

---

### Tech (implementation note)

* Frontend: React
* Backend: Node.js
* DB: PostgreSQL (AWS RDS)

---

### MVP definition of “Done”

* Manager can set up products/barcodes
* Receiver can create a receiving session, enter expected quantities, scan to count received
* Manager can finalize and inventory updates correctly
* History exists (at least: list of receiving sessions + inventory changes)
