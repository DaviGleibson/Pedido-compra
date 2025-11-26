# Pedido de Compra - Purchase Order Management System

## 🔐 CREDENCIAIS DE TESTE

**Email:** `teste@exemplo.com`  
**Senha:** `Senha123!`

## Overview
A modern, full-featured purchase order management system built with Next.js 14, TypeScript, and Tailwind CSS.

## Features Implemented

### 1. Landing Page (`/`)
- Beautiful hero section with gradient accents
- Feature cards showcasing key capabilities
- Call-to-action buttons for sign-in
- Responsive design with backdrop blur effects

### 2. Authentication (`/login`)
- Clean login interface matching the design system
- Form validation
- Smooth navigation to dashboard after login
- Mock authentication (ready for real backend integration)

### 3. Dashboard (`/dashboard`)
- **Order Overview**: Grid/card view of all purchase orders
- **Statistics**: Real-time counts for total, pending, approved, and completed orders
- **Search & Filter**: Search by order number, supplier, or buyer; filter by status
- **Actions**: View, edit, and delete orders with confirmation dialogs
- **Responsive Design**: Works seamlessly on mobile and desktop

### 4. Order Management Components

#### Status Badge
- Color-coded status indicators (Draft, Pending, Approved, Completed)
- Consistent styling across the application

#### Order Card
- Displays key order information
- Quick action buttons (View, Edit, Delete)
- Formatted currency and dates
- Hover effects and smooth transitions

#### Order Detail Modal
- Comprehensive view of order details
- Company and supplier information
- Buyer details and creator info
- Payment terms and type
- Product line items table
- Calculated totals (subtotal, tax, total)
- Timestamps for creation and updates

#### New Order Form (Multi-Step)
- **Step 1**: Select issuing company
- **Step 2**: Select supplier/vendor
- **Step 3**: Enter buyer information
- **Step 4**: Display logged user (read-only)
- **Step 5**: Set payment terms and type
- **Step 6**: Add product line items with auto-calculation

#### Product Line Items
- Dynamic table with add/remove functionality
- Inline editing for product name, quantity, and unit price
- Auto-calculating totals per item
- Responsive design (table on desktop, cards on mobile)
- Real-time subtotal and total calculations

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Management**: React Hook Form ready
- **Icons**: Lucide React
- **State Management**: React useState (ready for Zustand/Context)

## Design System

### Colors
- Primary: Indigo (600-700)
- Secondary: Blue (600-700)
- Success: Emerald
- Warning: Amber
- Danger: Red
- Neutral: Slate

### Components
- Gradient accents on buttons and headings
- Backdrop blur effects on cards and headers
- Smooth transitions and hover effects
- Consistent spacing and typography
- Responsive breakpoints

## Data Structure

### Types
- `PurchaseOrder`: Complete order with all details
- `Company`: Issuing company information
- `Supplier`: Vendor/supplier details
- `Buyer`: Buyer information
- `ProductLineItem`: Individual product entries
- `OrderStatus`: Draft, Pending, Approved, Completed
- `PaymentTerms`: Net 30/60/90, Due on Receipt, Prepaid
- `PaymentType`: Credit Card, Bank Transfer, Check, Cash

### Mock Data
- 3 sample companies
- 4 sample suppliers
- 4 sample purchase orders with various statuses

## User Flow

1. **Landing** → User sees hero section and features
2. **Login** → User authenticates (mock)
3. **Dashboard** → User views all orders with stats
4. **Search/Filter** → User finds specific orders
5. **View Order** → User sees complete order details
6. **New Order** → User creates order through 6-step form
7. **Edit Order** → User modifies existing order
8. **Delete Order** → User removes order with confirmation

## Next Steps for Production

1. **Backend Integration**
   - Connect to real authentication service
   - Implement API routes for CRUD operations
   - Add database (Supabase/PostgreSQL recommended)

2. **Enhanced Features**
   - Order approval workflow
   - Email notifications
   - PDF export for orders
   - Order history and audit trail
   - Advanced filtering and sorting
   - Bulk operations

3. **Optimizations**
   - Server-side rendering for orders list
   - Optimistic UI updates
   - Loading skeletons
   - Error boundaries
   - Form validation with Zod

4. **Security**
   - Role-based access control
   - API authentication
   - Input sanitization
   - CSRF protection

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login page
│   ├── dashboard/page.tsx    # Dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── orders/
│   │   ├── order-card.tsx
│   │   ├── order-detail-modal.tsx
│   │   ├── new-order-form.tsx
│   │   ├── product-line-items.tsx
│   │   └── status-badge.tsx
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── mock-data.ts          # Sample data
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript types
```

## Running the Application

```bash
npm install
npm run dev
```

Navigate to:
- `/` - Landing page
- `/login` - Login page
- `/dashboard` - Purchase orders dashboard

## Notes

- All components have default props for standalone rendering
- Responsive design tested on mobile, tablet, and desktop
- TypeScript strict mode enabled with no errors
- Follows Next.js 14 App Router best practices
- Ready for Framer Motion animations (can be added)
- Form validation ready for React Hook Form integration