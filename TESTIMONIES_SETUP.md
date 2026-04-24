# Customer Testimonies System - Setup & Usage Guide

This document explains the dynamic customer testimonies system with screenshot uploads for your Joyalure application.

## 🚀 Overview

The customer testimonies system allows you to upload and showcase real customer feedback screenshots through the admin dashboard. The system includes:

- **Database Table**: `customer_testimonies` table in Supabase
- **Storage Bucket**: `testimony-screenshots` for customer testimony images
- **API Endpoint**: `/api/testimonies` to fetch active testimonies
- **Admin Interface**: `/admin/testimonies` to manage testimonies
- **Public Page**: `/testimonies` with animated gallery
- **Homepage Integration**: "See More Testimonies" link added to homepage carousel

---

## 📋 Setup Instructions

### Step 1: Run the SQL Schema

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the contents of `/database/customer-testimonies-schema.sql`
4. Paste and execute the SQL script

This will create:
- ✅ `customer_testimonies` table with all necessary columns
- ✅ `testimony-screenshots` storage bucket
- ✅ Row Level Security (RLS) policies
- ✅ Storage policies for image uploads
- ✅ Sample data (3 testimonies)

### Step 2: Verify the Setup

Run these queries in the Supabase SQL Editor to verify:

```sql
-- Check table was created
SELECT * FROM customer_testimonies;

-- Check bucket was created
SELECT * FROM storage.buckets WHERE id = 'testimony-screenshots';
```

### Step 3: Access the Admin Dashboard

Navigate to: `/admin/testimonies`

You should see the admin interface for managing customer testimonies.

---

## 🎯 Features

### Database Schema

**Table: `customer_testimonies`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `customer_name` | VARCHAR(255) | Customer's name (required) |
| `customer_location` | VARCHAR(255) | Customer's location/country |
| `testimony_text` | TEXT | Testimony text (optional if screenshot has text) |
| `screenshot_url` | TEXT | URL to the testimony screenshot (required) |
| `rating` | INTEGER | Star rating (1-5) |
| `platform` | VARCHAR(100) | Source platform (Instagram, Facebook, Email, etc.) |
| `verified_purchase` | BOOLEAN | Whether it's a verified purchase |
| `testimony_date` | DATE | Date of the testimony |
| `is_featured` | BOOLEAN | Featured on homepage/highlighted |
| `is_active` | BOOLEAN | Whether testimony is visible (default: true) |
| `display_order` | INTEGER | Order in which testimonies appear (default: 0) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### Storage Bucket

**Bucket: `testimony-screenshots`**
- Public read access
- Authenticated users can upload/update/delete
- Used for storing customer testimony screenshots from social media, emails, etc.

---

## 🛠️ Admin Dashboard Usage

### Uploading a New Testimony

1. Navigate to `/admin/testimonies`
2. Click the **"New Testimony"** button
3. Fill in the form:
   - **Customer Name**: Name of the customer (required)
   - **Location**: Where they're from (optional)
   - **Testimony Text**: Extract text from screenshot (optional)
   - **Rating**: Star rating (1-5 stars)
   - **Platform**: Where the testimony came from (Instagram, Facebook, etc.)
   - **Testimony Date**: When they posted it
   - **Display Order**: Order of appearance (0 = first)
   - **Verified Purchase**: Check if it's a verified buyer
   - **Featured**: Check to highlight this testimony
   - **Active**: Toggle to show/hide the testimony
   - **Screenshot**: Upload the screenshot image (required)
4. Click **"Create Testimony"**

### Editing a Testimony

1. Find the testimony card
2. Click the **"Edit"** button (blue)
3. Modify the fields as needed
4. Click **"Update Testimony"**

### Managing Testimonies

- **⭐ Star Icon**: Toggle featured status (featured testimonies appear first)
- **👁️ Eye Icon**: Toggle active/inactive status
- **🗑️ Trash Icon**: Permanently delete the testimony

---

## 🎨 Public Testimonies Page

The public testimonies page at `/testimonies` features:

### Animated Gallery
- Smooth fade-in animations on scroll
- Hover effects on testimony cards
- Responsive grid layout (1, 2, or 3 columns)

### Filter Options
- **All Testimonies**: Show everything
- **Featured**: Only featured testimonies
- **5 Star Only**: Only 5-star reviews

### Testimony Cards Display
- Customer screenshot
- Customer name and location
- Star rating
- Testimony text
- Platform badge (Instagram, Facebook, etc.)
- Verified purchase badge
- Testimony date

### Homepage Integration
- Original carousel on homepage remains unchanged
- "See More Testimonies" link added below carousel
- Clicking it takes users to the full testimonies page

---

## 🔌 API Endpoint

**Endpoint**: `GET /api/testimonies`

**Query Parameters**:
- `featured=true` - Get only featured testimonies

**Response**:
```json
{
  "testimonies": [
    {
      "id": "uuid",
      "customer_name": "Abena Ako",
      "customer_location": "United States",
      "testimony_text": "Joy Allure Shea Butter is a game-changer!",
      "screenshot_url": "https://...",
      "rating": 5,
      "platform": "Instagram",
      "verified_purchase": true,
      "testimony_date": "2026-03-27",
      "is_featured": true,
      "is_active": true,
      "display_order": 1
    }
  ]
}
```

**Features**:
- Returns only active testimonies (`is_active = true`)
- Orders by rating (descending) then display_order (ascending)
- Optional featured filter

---

## 🔐 Security

### Row Level Security (RLS)

- **Public**: Can view active testimonies only
- **Authenticated Users**: Can manage all testimonies

### Storage Policies

- **Public**: Can read/view images
- **Authenticated**: Can upload, update, and delete images

---

## 📦 File Structure

```
app/
├── (site)/
│   └── testimonies/
│       └── page.tsx           # Public testimonies gallery
├── admin/
│   └── testimonies/
│       └── page.tsx           # Admin dashboard UI
├── api/
│   └── testimonies/
│       └── route.ts           # API endpoint
components/
└── testimonials.tsx           # Homepage carousel (updated with "See More" link)
lib/
└── supabase/
    └── testimony-upload.ts    # Screenshot upload utilities
database/
└── customer-testimonies-schema.sql  # SQL schema and setup
```

---

## 🎯 Workflow Examples

### Example 1: Upload Instagram Testimony

1. Customer posts review on Instagram
2. Take a screenshot of the post
3. Go to `/admin/testimonies`
4. Click "New Testimony"
5. Fill in:
   - Name: Customer's Instagram handle
   - Location: Their location from bio
   - Platform: "Instagram"
   - Rating: Based on their feedback
   - Upload the screenshot
6. Mark as "Verified Purchase" if applicable
7. Save

### Example 2: Feature Best Testimonies

1. Review all testimonies in admin
2. Click the star icon on your best testimonies
3. These will appear in the "Featured" filter
4. Featured testimonies get a special badge

### Example 3: Organize by Date

1. Enter testimony dates when uploading
2. Newer testimonies can be given lower display_order numbers
3. They'll appear first in the gallery

---

## ✅ Testing

### 1. Upload a Test Testimony
- Go to `/admin/testimonies`
- Upload a screenshot with all fields
- Verify it appears in the list

### 2. View on Public Page
- Navigate to `/testimonies`
- Verify the testimony appears in the gallery
- Test the filter buttons

### 3. Test Homepage Link
- Go to homepage
- Scroll to testimonials section
- Click "See More Testimonies"
- Verify it navigates to `/testimonies`

### 4. Test Animations
- Refresh the `/testimonies` page
- Scroll down to see fade-in animations
- Hover over cards to see hover effects

---

## 🔧 Troubleshooting

### Testimonies not appearing on public page?

1. Check if testimonies are marked as `is_active = true`
2. Verify RLS policies are set correctly
3. Check browser console for API errors

### Can't upload screenshots?

1. Verify you're authenticated
2. Check the storage bucket exists: `testimony-screenshots`
3. Verify storage policies are set correctly
4. Check file size (Supabase has upload limits)

### Filters not working?

1. Clear browser cache
2. Check if testimonies have the correct `rating` and `is_featured` values
3. Verify the API is returning data

---

## 📱 Best Practices

### Screenshot Quality
- Use high-resolution screenshots
- Crop to remove unnecessary elements
- Ensure text is readable
- Keep file sizes reasonable (< 2MB)

### Testimony Management
- Regularly review and approve new testimonies
- Feature your best testimonies
- Keep testimony dates accurate
- Remove outdated or irrelevant testimonies

### Organization
- Use display_order for chronological sorting
- Group similar testimonies by platform
- Highlight verified purchases
- Balance featured vs. non-featured testimonies

---

## 🎉 Summary

You now have a fully functional customer testimonies system! The admin dashboard allows you to:

✅ Upload customer testimony screenshots
✅ Add customer details and ratings
✅ Mark testimonies as featured or verified
✅ Control visibility (active/inactive)
✅ Organize display order
✅ Showcase on a beautiful animated public page

The public page at `/testimonies` provides:

✅ Animated gallery with filters
✅ Responsive design
✅ Social proof badges (verified, platform)
✅ Search by rating and featured status
✅ Professional presentation of customer feedback

All changes made in the admin dashboard are immediately reflected on the public page!
