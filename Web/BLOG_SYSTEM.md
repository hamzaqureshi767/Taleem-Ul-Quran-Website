# Complete Blog/Articles System

## Overview

A fully functional blog system with Supabase integration, search, filtering, pagination, and beautiful responsive design.

## Features

### ✅ Articles Listing Page (`/pages/articles.html`)

- **Search Functionality**: Real-time search through article titles, excerpts, and categories
- **Category Filters**: Filter articles by category (All, Kids Learning, Hifz, Tajweed, Parenting)
- **Pagination**: Navigate through articles with page numbers (9 articles per page)
- **Responsive Grid Layout**: Beautiful card-based layout that adapts to all screen sizes
- **Loading States**: Shows loading spinner while fetching articles
- **Error Handling**: Graceful error messages if articles fail to load
- **Empty States**: Helpful messages when no articles match filters

### ✅ Article Detail Page (`/pages/article.html`)

- **Full Article View**: Complete article with formatted content
- **Breadcrumb Navigation**: Easy navigation back to articles list
- **Meta Tags**: SEO-friendly meta descriptions
- **Share Functionality**: Native share API or clipboard fallback
- **Related Articles**: Shows 3 related articles at the bottom
- **Beautiful Typography**: Proper heading hierarchy and readable content
- **Responsive Images**: Optimized images with lazy loading

### ✅ Supabase Integration

- **Dynamic Content**: Articles loaded from Supabase database
- **Fallback Support**: Works with static content if Supabase is not configured
- **Real-time Updates**: Changes in Supabase reflect immediately
- **Published/Draft Control**: Only published articles are shown to public

### ✅ JavaScript Modules

- **`assets/js/articles.js`**: Handles articles listing, search, filtering, pagination
- **`assets/js/article-detail.js`**: Handles individual article display and related articles

## Database Schema

The system uses the existing `articles` table in Supabase:

```sql
- id (uuid)
- title (text)
- category (text)
- author (text)
- excerpt (text)
- content (text)
- image_url (text)
- tags (text[])
- published_at (timestamptz)
- is_published (boolean)
- created_by (uuid)
- created_at (timestamptz)
- updated_at (timestamptz)
```

## How to Use

### 1. For End Users

- Visit `/pages/articles.html` to browse all articles
- Use the search box to find specific articles
- Click category filters to narrow down results
- Click "Read More" on any article card to view full article
- Use pagination to browse through multiple pages

### 2. For Admins (Adding Articles)

**Option 1: Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to Table Editor → `articles`
3. Click "Insert" → "Insert row"
4. Fill in:
   - Title
   - Category
   - Author
   - Excerpt
   - Content (full article text)
   - Image URL (optional)
   - Tags (array of strings, optional)
   - Set `is_published` to `true`
5. Click "Save"

**Option 2: SQL**
```sql
INSERT INTO public.articles (title, category, author, excerpt, content, image_url, tags, is_published)
VALUES (
  'Your Article Title',
  'Kids Quran Learning',
  'Author Name',
  'Short description...',
  'Full article content here...',
  'https://example.com/image.jpg',
  ARRAY['tag1', 'tag2'],
  true
);
```

## Styling

All blog-related styles are in `assets/css/style.css`:
- `.blog-controls`: Search and filter container
- `.articles-grid`: Grid layout for article cards
- `.article-card`: Individual article card styling
- `.single-article`: Single article page layout
- `.pagination`: Pagination controls
- Responsive breakpoints for mobile devices

## Content Formatting

Articles support:
- **Paragraphs**: Separated by double line breaks
- **Headings**: Use `#`, `##`, `###` for h1, h2, h3
- **Lists**: Use `-` or `*` for bullet points
- **Links**: Standard markdown or HTML links

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS, Android)
- Graceful degradation for older browsers

## Future Enhancements (Optional)

- [ ] Comments system
- [ ] Reading time estimation
- [ ] Social media preview cards
- [ ] Article drafts (admin-only view)
- [ ] RSS feed
- [ ] Email newsletter integration
- [ ] Article categories management UI

## Notes

- The system works with or without Supabase configured
- Static content in `assets/data/content.js` is used as fallback
- Articles are automatically sorted by publish date (newest first)
- Search is case-insensitive
- Pagination shows up to 7 page numbers with ellipsis for large page counts

