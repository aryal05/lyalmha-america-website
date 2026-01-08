# Cloudinary Setup for Railway Backend

## ⚠️ CRITICAL: Why Cloudinary is Required

**Railway (and most cloud platforms) use ephemeral storage** - any files uploaded to the server are **deleted when the container restarts**. This is why your images disappear!

## Solution: Cloudinary Cloud Storage ☁️

Cloudinary stores images permanently in the cloud and provides CDN delivery.

---

## Step 1: Create Free Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up (Free tier includes 25GB storage & 25GB bandwidth/month)
3. Verify your email

---

## Step 2: Get Your Cloudinary Credentials

After logging in, you'll see your dashboard:

```
Cloud name: YOUR_CLOUD_NAME
API Key: YOUR_API_KEY
API Secret: YOUR_API_SECRET
```

---

## Step 3: Add Environment Variables to Railway

1. Open your Railway project dashboard
2. Click on your backend service
3. Go to **Variables** tab
4. Add these 3 environment variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ **Important:** Click "Add" after each variable, then click "Deploy" at the top!

---

## Step 4: Verify Deployment

1. Railway will automatically redeploy with new environment variables
2. Wait ~2-3 minutes for deployment to complete
3. Check deployment logs for any errors
4. Test by uploading an image in your admin panel

---

## Step 5: Test Image Upload

1. Go to your Vercel site admin panel
2. Upload a blog image, news image, or gallery image
3. The image should now be stored on Cloudinary
4. Check Cloudinary dashboard → Media Library to see uploaded images

---

## What Changed in the Code?

✅ All image uploads now go to Cloudinary instead of local disk:
- Blog images → `lyalmha/blogs/` folder
- News images → `lyalmha/news/` folder  
- Gallery images → `lyalmha/gallery/` folder

✅ Images are returned as full URLs (e.g., `https://res.cloudinary.com/...`)

✅ No more "Route not found" errors on image paths!

---

## Troubleshooting

### Images still not showing?
- Check Railway logs for "Must supply api_key" error
- Verify environment variables are set correctly (no typos!)
- Make sure Railway redeployed after adding variables

### Upload fails with 401 error?
- Double-check your API credentials
- Make sure API Secret doesn't have extra spaces

### Images upload but don't display?
- Check browser console for CORS errors
- Verify image URLs in database start with `https://res.cloudinary.com/`

---

## Cost Considerations

**Free Tier Limits:**
- 25 GB storage
- 25 GB bandwidth/month
- 10,000 transformations/month

**For your traffic, free tier should be sufficient!**

If you exceed limits, Cloudinary has affordable paid plans starting at $99/month.

---

## ✅ Next Steps

1. **Set up Cloudinary credentials on Railway** (Step 3 above)
2. **Wait for Railway to redeploy** (~2-3 minutes)
3. **Test image uploads** in admin panel
4. **All images will now persist forever!** 🎉
