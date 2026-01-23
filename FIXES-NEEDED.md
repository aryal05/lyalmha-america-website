# Issues to Fix

## 1. Events Not Showing Images in Frontend
**Problem**: Event images from admin panel not displaying
**Fix**: Update EventsSidebar to use correct image field

## 2. Only 2 Upcoming Events Showing
**Problem**: Limit on upcoming events display
**Fix**: Remove slice limit or increase it

## 3. "View All Events" Button Not Working
**Problem**: Button has no navigation
**Fix**: Add Link to events page

## 4. Latest Stories Section Not Dynamic
**Problem**: Hardcoded stories in Home page
**Fix**: Fetch from blogs API

## 5. Blog Detail Page UI Issues
**Problem**: Poor formatting and layout
**Fix**: Already has good UI in BlogDetail.jsx

## Quick Fixes:

### Fix 1: EventsSidebar - Show All Upcoming Events
Line 172: Change from limiting to 2 events to showing all

### Fix 2: EventsSidebar - Fix "View All Events" Button  
Line 290: Add proper Link navigation

### Fix 3: EventsSidebar - Fix Event Images
Line 413: Image URL handling is correct, check if events have images in database

### Fix 4: Home Page - Make Latest Stories Dynamic
Need to check Home.jsx and make it fetch from blogs API

### Fix 5: Blog Detail Page
Already has good UI, just needs to ensure content renders properly

## Database Check:
Run these queries to verify data:
```sql
SELECT * FROM events;
SELECT * FROM blogs WHERE status = 'published' ORDER BY date DESC LIMIT 3;
```
