# Special Offers System - Setup & Usage Guide

This document explains the dynamic special offers system that has been implemented for your Joyalure application.

## 🚀 Overview

The special offers system allows you to create, manage, and display promotional offers dynamically through the admin dashboard. The system includes:

- **Database Table**: `special_offers` table in Supabase
- **Storage Bucket**: `special-offer-images` for offer images
- **API Endpoint**: `/api/special-offers` to fetch active offers
- **Admin Interface**: `/admin/special-offers` to manage offers
- **Frontend Component**: Updated `special-offers.tsx` component

---

## 📋 Setup Instructions

### Step 1: Run the SQL Schema

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the contents of `/database/special-offers-schema.sql`
4. Paste and execute the SQL script

This will create:
- ✅ `special_offers` table with all necessary columns
- ✅ `special-offer-images` storage bucket
- ✅ Row Level Security (RLS) policies
- ✅ Storage policies for image uploads
- ✅ Sample data (2 offers)

### Step 2: Verify the Setup

Run these queries in the Supabase SQL Editor to verify:

```sql
-- Check table was created
SELECT * FROM special_offers;

-- Check bucket was created
SELECT * FROM storage.buckets WHERE id = 'special-offer-images';
```

### Step 3: Access the Admin Dashboard

Navigate to: `/admin/special-offers`

You should see the admin interface for managing special offers.

---

## 🎯 Features

### Database Schema

**Table: `special_offers`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `title` | VARCHAR(255) | Offer title (e.g., "Summer Sale") |
| `description` | TEXT | Optional description |
| `discount_percentage` | INTEGER | Discount amount (0-100) |
| `image_url` | TEXT | URL to the offer image |
| `link_url` | VARCHAR(500) | Where users go when clicking "Shop Now" |
| `end_date` | TIMESTAMPTZ | When the offer expires (optional) |
| `is_active` | BOOLEAN | Whether offer is visible (default: true) |
| `display_order` | INTEGER | Order in which offers appear (default: 0) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### Storage Bucket

**Bucket: `special-offer-images`**
- Public read access
- Authenticated users can upload/update/delete
- Used for storing offer banner images

---

## 🛠️ Admin Dashboard Usage

### Creating a New Offer

1. Navigate to `/admin/special-offers`
2. Click the **"New Offer"** button
3. Fill in the form:
   - **Title**: Name of the offer (required)
   - **Discount %**: Percentage discount (0-100, required)
   - **Description**: Optional description text
   - **Link URL**: Where users go (e.g., `/products?offer=20`)
   - **End Date**: When the offer expires (optional)
   - **Display Order**: Order of appearance (0 = first)
   - **Active**: Toggle to show/hide the offer
   - **Image**: Upload an offer banner image
4. Click **"Create Offer"**

### Editing an Offer

1. Find the offer card
2. Click the **"Edit"** button (blue)
3. Modify the fields
4. Click **"Update Offer"**

### Deactivating an Offer

1. Click the eye icon button (yellow/green)
2. This toggles the offer between active and inactive
3. Inactive offers won't appear on the frontend

### Deleting an Offer

1. Click the **trash** icon (red)
2. Confirm the deletion
3. The offer will be permanently removed

---

## 🔌 API Endpoint

**Endpoint**: `GET /api/special-offers`

**Response**:
```json
{
  "offers": [
    {
      "id": "uuid",
      "title": "Summer Sale",
      "description": "Save big on skincare",
      "discount_percentage": 20,
      "image_url": "https://...",
      "link_url": "/products?offer=20",
      "end_date": "2026-12-31T23:59:59Z",
      "is_active": true,
      "display_order": 1
    }
  ]
}
```

**Features**:
- Only returns active offers (`is_active = true`)
- Filters out expired offers automatically
- Orders by `display_order` (ascending)

---

## 🎨 Frontend Component

The `special-offers.tsx` component:
- Fetches offers from the API on page load
- Displays offers in a responsive grid
- Shows countdown timer if `end_date` is set
- Hides the entire section if no offers are active
- Supports hover animations and transitions

---

## 🔐 Security

### Row Level Security (RLS)

- **Public**: Can view active offers only
- **Authenticated Users**: Can manage all offers

### Storage Policies

- **Public**: Can read/view images
- **Authenticated**: Can upload, update, and delete images

---

## 📦 File Structure

```
app/
├── admin/
│   └── special-offers/
│       └── page.tsx           # Admin dashboard UI
├── api/
│   └── special-offers/
│       └── route.ts           # API endpoint
components/
└── special-offers.tsx         # Frontend component
lib/
└── supabase/
    └── special-offers-upload.ts  # Image upload utilities
database/
└── special-offers-schema.sql  # SQL schema and setup
```

---

## 🎯 Usage Examples

### Example 1: Create a Flash Sale

```
Title: Flash Sale - 24 Hours Only!
Discount: 30%
Description: Limited time offer on all products
Link URL: /products
End Date: Tomorrow at midnight
Active: Yes
Display Order: 0
```

### Example 2: Category-Specific Offer

```
Title: Shea Butter Special
Discount: 15%
Description: Get 15% off all shea butter products
Link URL: /products?category=shea-butter
End Date: End of month
Active: Yes
Display Order: 1
```

---

## ✅ Testing

### 1. Create a Test Offer
- Go to `/admin/special-offers`
- Create a new offer with all fields
- Upload an image

### 2. View on Frontend
- Navigate to the homepage or offers page
- Verify the offer appears correctly
- Check the countdown timer (if end_date is set)
- Click "Shop Now" to verify the link works

### 3. Test Deactivation
- Deactivate the offer in admin
- Refresh the frontend
- Verify the offer no longer appears

---

## 🔧 Troubleshooting

### Offers not appearing on frontend?

1. Check if offers are marked as `is_active = true`
2. Verify the `end_date` hasn't passed
3. Check browser console for API errors
4. Verify RLS policies are set correctly

### Can't upload images?

1. Verify you're authenticated
2. Check the storage bucket exists: `special-offer-images`
3. Verify storage policies are set correctly
4. Check file size (Supabase has upload limits)

### API returns empty array?

1. Run this query to check:
   ```sql
   SELECT * FROM special_offers WHERE is_active = true;
   ```
2. Verify at least one offer exists and is active

---

## 📝 Notes

- Sample data is included in the SQL schema for testing
- You can customize the RLS policies for stricter access control
- Consider adding role-based access (e.g., only admins can manage offers)
- The countdown timer updates in real-time every second
- Images are served from Supabase Storage CDN for optimal performance

---

## 🎉 Summary

You now have a fully functional dynamic special offers system! The admin dashboard allows you to:

✅ Create unlimited special offers
✅ Upload custom images for each offer
✅ Set expiration dates with countdown timers
✅ Control which offers are active/inactive
✅ Order offers for display priority
✅ Link to specific product pages or categories

All changes made in the admin dashboard are immediately reflected on the frontend!
