# Notifications System - Setup & Usage Guide

## 🚀 Setup Instructions

### 1. Create the Notifications Table in Supabase

Run the SQL schema file in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/notifications-schema.sql`
4. Click **Run** to execute the SQL

This will create:
- `notifications` table with proper columns
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for auto-updating timestamps
- Helper function for creating notifications

### 2. Verify the Table

After running the SQL, verify in your Supabase dashboard:
- Go to **Table Editor**
- You should see the `notifications` table
- Check that RLS is enabled

## 📋 Database Schema

```typescript
interface Notification {
  id: string (UUID)
  user_id: string (UUID) - References auth.users
  type: string - "order" | "alert" | "info" | "message" | "wishlist" | "promo"
  title: string
  message: string
  read: boolean (default: false)
  data: JSONB (optional - for storing additional metadata)
  created_at: timestamp
  updated_at: timestamp
}
```

## 🔧 How to Use

### Creating Notifications

**Option 1: Using the Client-Side Function (Recommended)**

```typescript
import { createNotification } from "@/lib/supabase/notifications"

// This function calls the server-side API route
await createNotification(
  userId,
  "order",
  "Order Shipped",
  "Your order #12345 has been shipped",
  { orderId: "12345", trackingNumber: "ABC123XYZ" }
)
```

**Option 2: Direct API Route Call (Server-Side)**

```typescript
// In a Server Action or API Route
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const { data, error } = await supabaseAdmin
  .from("notifications")
  .insert({
    user_id: userId,
    type: "order",
    title: "Order Shipped",
    message: "Your order #12345 has been shipped",
    data: { orderId: "12345" },
    read: false
  })
```

### Common Notification Types

#### Admin Dashboard:
- `order` - New orders, order updates
- `alert` - Low stock, system alerts
- `info` - Sales milestones, analytics
- `message` - Customer messages, inquiries

#### Client Dashboard:
- `order` - Order updates, shipping info
- `wishlist` - Price drops on wishlist items
- `promo` - Promotional offers, discounts
- `message` - Support replies, responses

### Example: Creating Notifications on Order Events

```typescript
// In your order creation API/action
import { createNotification } from "@/lib/supabase/notifications"

export async function createOrder(orderData) {
  // ... create order logic
  
  // Notify customer
  await createNotification(
    customerId,
    "order",
    "Order Confirmed",
    `Your order #${orderId} has been confirmed`,
    { orderId, total: orderData.total }
  )
  
  // Notify admin
  const adminUsers = await getAdminUsers()
  for (const admin of adminUsers) {
    await createNotification(
      admin.id,
      "order",
      "New Order Received",
      `Order #${orderId} placed by ${customerName}`,
      { orderId, customerId, total: orderData.total }
    )
  }
}
```

### Example: Low Stock Alert

```typescript
// In your inventory management
export async function checkLowStock() {
  const lowStockProducts = await getLowStockProducts()
  
  if (lowStockProducts.length > 0) {
    const admins = await getAdminUsers()
    for (const admin of admins) {
      await createNotification(
        admin.id,
        "alert",
        "Low Stock Alert",
        `${lowStockProducts.length} products are running low on inventory`,
        { products: lowStockProducts }
      )
    }
  }
}
```

## ✨ Features

### Real-time Updates
Notifications automatically appear without page refresh using Supabase real-time subscriptions.

### Mark as Read
Users can mark individual notifications or all notifications as read.

### Delete Notifications
Users can remove notifications they don't want to see.

### Relative Time Display
Notifications show friendly time formats:
- "Just now"
- "5 min ago"
- "2 hours ago"
- "3 days ago"

### Loading States
Shows loading spinner while fetching notifications.

### Unread Count Badge
Displays the number of unread notifications on the bell icon.

## 🔐 Security

Row Level Security (RLS) ensures:
- Users can only see their own notifications
- Only service role can create notifications for any user
- Users can update/delete only their own notifications

## 📱 Testing

### Manual Testing

1. **Insert a test notification** via Supabase SQL Editor:
```sql
SELECT create_notification(
  'YOUR_USER_ID_HERE',
  'info',
  'Test Notification',
  'This is a test notification message',
  '{"test": true}'::jsonb
);
```

2. **Check the UI** - The notification should appear instantly in the dropdown

### Bulk Insert for Testing

```sql
-- Get your user ID first
SELECT id FROM auth.users LIMIT 1;

-- Insert multiple test notifications
INSERT INTO notifications (user_id, type, title, message, read)
VALUES
  ('YOUR_USER_ID', 'order', 'Order Shipped', 'Your order #12345 has been shipped', false),
  ('YOUR_USER_ID', 'promo', 'Special Offer', 'Get 20% off this weekend!', false),
  ('YOUR_USER_ID', 'info', 'Welcome', 'Welcome to Joyalure!', true);
```

## 🎯 Next Steps

1. Run the SQL schema in Supabase
2. Test with manual notifications
3. Integrate notification creation into your app logic:
   - Order events
   - Inventory alerts
   - User actions
   - System events

## 🐛 Troubleshooting

### Notifications not appearing?
- Check browser console for errors
- Verify Supabase connection
- Ensure RLS policies are enabled
- Check that user is authenticated

### Real-time not working?
- Verify Supabase real-time is enabled for the notifications table
- Check browser console for subscription errors
- Ensure user ID is correct

### Permission errors?
- Verify RLS policies are correctly set
- Check that user is authenticated
- Ensure service role key is used for admin operations
