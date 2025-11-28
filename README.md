# Digital Menu Management System

A full-stack digital menu management platform built with the T3 Stack, allowing restaurant owners to manage their menus and customers to view them digitally through QR codes or shared links.

## 🌐 Live Application

**Deployed URL**: https://digital-menu-management.vercel.app/

## 📖 Assignment Submission Details

### Approach to Solving the Problem

I approached this assignment by breaking it down into logical phases:

1. **Setup & Architecture**: Started with T3 Stack initialization, configured Prisma with PostgreSQL schema, and set up the basic project structure.

2. **Authentication System**: Implemented custom email-based authentication (avoiding NextAuth as required) with:
   - Email verification code generation and storage
   - Code expiration handling (10 minutes)
   - Session management using JWT and HTTP-only cookies
   - Country name validation using a comprehensive list

3. **Core Features Development**:
   - **Restaurant Management**: CRUD operations with ownership validation
   - **Category System**: Implemented hierarchical categories (main categories with subcategories) using self-referential Prisma relations
   - **Dish Management**: Multi-category assignment using junction table (DishCategory)
   - **Menu Display**: Public-facing menu with category navigation and filtering

4. **UI/UX Implementation**: 
   - Matched reference images for menu display
   - Implemented fixed category header that updates dynamically while scrolling
   - Added floating menu button for quick category navigation
   - Made all components responsive (mobile, tablet, desktop)
   - Added skeleton loaders for better loading experience

5. **Performance Optimization**:
   - Replaced `refetch()` with `invalidate()` for faster updates
   - Added loading states and skeleton loaders across all pages
   - Optimized queries to reduce unnecessary refetches

6. **Edge Cases & Error Handling**:
   - Empty state handling (no restaurants, categories, dishes)
   - Form validation (empty inputs, invalid data)
   - Image upload fallback (base64 when Vercel Blob not configured)
   - Category filtering (hide categories with no items)
   - Scroll-based category header updates

### IDE Used

- **Cursor** (VS Code-based IDE with AI integration)

### AI Tools and Models Used

- **Cursor AI** (Claude Sonnet 4.5 / GPT-4)
- Used for:
  - Code generation and refactoring
  - Debugging and error fixing
  - UI/UX implementation guidance
  - Performance optimization suggestions
  - Code review and best practices

### Key Prompts Used with AI Tools

1. **Initial Setup**: "Review my project and help me understand the structure"
2. **Authentication**: "Implement email-based authentication without NextAuth using verification codes"
3. **Database Schema**: "Design Prisma schema for restaurants, categories, and dishes with multi-category support"
4. **UI Implementation**: "Match the menu display to these reference images" (with image references)
5. **Performance**: "Optimize the app - it's slow when navigating and saving. Add skeleton loaders"
6. **Feature Implementation**: "Implement fixed category name at top that updates while scrolling"
7. **Edge Cases**: "Add validation to prevent empty category names and handle edge cases"

### AI Tool Effectiveness

**How Helpful**: The AI tool was extremely helpful for:
- ✅ Rapid prototyping and initial implementation
- ✅ Understanding T3 Stack patterns and best practices
- ✅ Debugging complex issues (Intersection Observer, form handling)
- ✅ UI/UX refinement to match reference designs
- ✅ Performance optimization suggestions
- ✅ Code structure and organization

**Mistakes Identified and Corrected**:
1. **Select Component Empty Values**: AI initially used `value=""` which caused React errors. Fixed by using `value="__none__"` and converting in handlers.
2. **Image Upload Configuration**: AI suggested complex solutions, but we needed a simple base64 fallback for development.
3. **Category Header Logic**: Initial implementation showed all category headers, but requirement was to hide the current one shown in sticky header.
4. **Loading States**: AI initially used `refetch()` everywhere, but `invalidate()` is more performant.
5. **Intersection Observer Setup**: Initial implementation had dependency issues causing re-renders. Fixed by proper cleanup and ref management.
6. **Form Validation**: AI didn't initially add client-side validation for empty inputs. Added proper validation.

### Edge Cases and Error Scenarios Handled

**Beyond Requirements**:

1. **Empty States**:
   - No restaurants: Shows helpful message with "Create Restaurant" button
   - No categories: Shows message prompting category creation
   - No dishes: Shows empty state message
   - Categories with no items: Hidden from category modal

2. **Form Validation**:
   - Empty category names: Disabled submit buttons
   - Empty dish names: Required field validation
   - Invalid email formats: Zod validation
   - Invalid country names: Comprehensive country list validation
   - Invalid image URLs: URL validation before submission

3. **Data Integrity**:
   - Restaurant ownership verification: Users can only manage their own restaurants
   - Category ownership: Categories must belong to the restaurant being edited
   - Dish ownership: Dishes must belong to the restaurant being edited
   - Cascade deletes: Proper cleanup when deleting restaurants/categories/dishes

4. **Image Handling**:
   - Missing images: Graceful fallback (no broken images)
   - Large file uploads: 5MB size limit with validation
   - Invalid file types: Only images allowed (JPEG, PNG, WebP, GIF)
   - Vercel Blob not configured: Falls back to base64 data URLs

5. **Navigation & UX**:
   - Breadcrumb navigation: Added to all dashboard pages
   - Back buttons: Easy navigation between pages
   - Loading states: Skeleton loaders prevent blank screens
   - Button states: Disabled during mutations to prevent duplicate submissions

6. **Category Hierarchy**:
   - Subcategory display: Properly nested under parent categories
   - Category filtering: Only shows categories with items
   - Main category aggregation: Shows all dishes from subcategories when viewing main category

7. **Scroll Behavior**:
   - Fixed header: Category name updates dynamically
   - Header hiding: Current category header hidden in list to avoid duplication
   - Reverse scrolling: Works correctly when scrolling back up

8. **Responsive Design**:
   - Mobile breakpoints: Proper layout adjustments
   - Touch interactions: Proper button sizes for mobile
   - Text sizing: Responsive font sizes across devices

### Edge Cases Identified But Not Fully Handled

**Due to Time Constraints**:

1. **Rate Limiting**:
   - **Issue**: Email verification codes can be spammed (no rate limiting)
   - **Solution**: Implement rate limiting middleware (e.g., using `@upstash/ratelimit`) to limit:
     - 3 codes per email per hour
     - 10 codes per IP per hour
   - **Impact**: Low (development/testing phase)

2. **Email Delivery Failures**:
   - **Issue**: If email service fails, user sees generic error
   - **Solution**: Better error messaging, retry logic, and fallback email service
   - **Impact**: Medium (affects user registration/login)

3. **Concurrent Edits**:
   - **Issue**: Multiple users editing same restaurant could cause conflicts
   - **Solution**: Implement optimistic locking or real-time updates
   - **Impact**: Low (single-user per restaurant in current design)

4. **Large Menu Performance**:
   - **Issue**: Menus with 100+ dishes might be slow to render
   - **Solution**: Implement virtual scrolling or pagination
   - **Impact**: Low (most restaurants won't have 100+ items)

5. **Image Optimization**:
   - **Issue**: Large images not optimized before upload
   - **Solution**: Client-side image compression before upload
   - **Impact**: Medium (affects load times and storage)

6. **Offline Support**:
   - **Issue**: No offline functionality
   - **Solution**: Service workers and local storage caching
   - **Impact**: Low (web app, not PWA requirement)

7. **Accessibility (A11y)**:
   - **Issue**: Some components may not be fully accessible
   - **Solution**: Add ARIA labels, keyboard navigation, screen reader support
   - **Impact**: Medium (important for production)

8. **Error Boundaries**:
   - **Issue**: React errors could crash entire app
   - **Solution**: Implement error boundaries at route level
   - **Impact**: Medium (better error recovery)

**Priority for Production**:
1. Rate limiting (high priority)
2. Better error handling (high priority)
3. Image optimization (medium priority)
4. Accessibility improvements (medium priority)

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma ORM)
- **API**: tRPC
- **UI Components**: shadcn/ui
- **Authentication**: Custom email-based auth with verification codes
- **Email Service**: Gmail SMTP (via nodemailer)
- **Image Storage**: Vercel Blob (optional)
- **QR Code Generation**: qrcode library
- **Deployment**: Vercel

## 📋 Features

### User Management
- Email-based registration and login
- Email verification code system
- User profiles with full name and country validation

### Restaurant Management
- Create and manage multiple restaurants
- Restaurant details: name and location
- QR code generation for each restaurant menu
- Shareable menu links

### Menu Management
- Hierarchical category system (categories with subcategories)
- Multi-category dish assignment
- Dish features:
  - Name, image, description
  - Optional spice level (0-3)
  - Dietary type (vegetarian/non-vegetarian)
  - Optional price
  - Image upload support

### Customer View
- Beautiful, responsive menu interface
- Category navigation with tabs
- Fixed category header while scrolling
- Floating menu button for quick category access
- Category modal with item counts
- Dietary indicators (red/green circles)
- Spice level visualization (chili icons)
- Price display with graceful handling of missing data

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (recommended: Neon.com)
- Gmail account with App Password for email service
- (Optional) Vercel account for image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/dbname"

   # Authentication
   JWT_SECRET="your-secret-key-minimum-32-characters"

   # Email Service (Gmail SMTP)
   GMAIL_USER="your-email@gmail.com"
   GMAIL_APP_PASSWORD="your-app-password"

   # App URL (for QR codes and shared links)
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Image Storage (Optional - Vercel Blob)
   BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
assignment/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # Admin dashboard
│   │   │   └── restaurants/
│   │   ├── menu/              # Public menu view
│   │   │   └── [restaurantId]/
│   │   └── api/               # API routes
│   │       ├── trpc/
│   │       ├── upload/        # Image upload
│   │       └── qr/            # QR code generation
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── image-upload.tsx   # Image upload component
│   ├── server/
│   │   ├── api/
│   │   │   └── routers/       # tRPC routers
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── email.ts           # Email service
│   │   └── utils/
│   │       └── countries.ts   # Country validation
│   └── trpc/                  # tRPC client setup
└── public/                     # Static assets
```

## 🎯 Key Features Implementation

### Authentication Flow
1. User enters email
2. System sends 6-digit verification code via email
3. User enters code to verify
4. For registration: user provides full name and country
5. Session is created and stored in HTTP-only cookie

### Menu Display Logic
- **Category Hierarchy**: Main categories can have subcategories
- **Dish Aggregation**: When viewing a main category, dishes from all subcategories are shown
- **Fixed Header**: Category name stays visible while scrolling
- **Navigation**: Tabs for main categories, modal for all categories with counts

### Image Upload
- Supports direct URL input or file upload
- File upload uses Vercel Blob (if configured) or falls back to URL
- Validates file type (images only) and size (max 5MB)

## 🧪 Testing

Testing setup is planned but not yet implemented. The following test types are recommended:

- **Unit Tests**: tRPC procedures using Vitest
- **Integration Tests**: Complete user flows
- **E2E Tests**: Critical paths using Playwright
- **Component Tests**: UI components using React Testing Library

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Import your GitHub repository in Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Database Setup**
   - Create PostgreSQL database on Neon.com
   - Add `DATABASE_URL` to Vercel environment variables
   - Run migrations: `npm run db:push` (or use Vercel's build command)

4. **Environment Variables in Vercel**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `EMAIL_FROM`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
   - `BLOB_READ_WRITE_TOKEN` (optional)

## 📝 API Documentation

### tRPC Routers

#### Auth Router (`auth`)
- `sendCode`: Send verification code to email
- `verifyCode`: Verify code (for registration/login)
- `register`: Register new user
- `login`: Login existing user
- `logout`: Logout current user
- `me`: Get current user

#### Restaurant Router (`restaurant`)
- `create`: Create new restaurant
- `getAll`: Get all user's restaurants
- `getById`: Get restaurant by ID
- `update`: Update restaurant
- `delete`: Delete restaurant

#### Category Router (`category`)
- `create`: Create category (with optional parent)
- `getByRestaurant`: Get all categories for restaurant
- `update`: Update category
- `delete`: Delete category

#### Dish Router (`dish`)
- `create`: Create dish with categories
- `getByRestaurant`: Get all dishes for restaurant
- `getById`: Get dish by ID
- `update`: Update dish
- `delete`: Delete dish

#### Menu Router (`menu`) - Public
- `getByRestaurantId`: Get public menu data for restaurant

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dietary Indicators**: Red (non-veg) and green (veg) circles
- **Spice Levels**: 0-3 chili icons
- **Price Display**: ₹ format with "---" for missing prices
- **Image Layout**: Images on right side of menu items
- **Category Navigation**: Tabs and modal for easy navigation
- **Fixed Headers**: Category name stays visible while scrolling

## 🔒 Security Features

- HTTP-only cookies for session management
- JWT-based authentication
- Input validation with Zod
- Country name validation
- File upload validation (type and size)
- SQL injection protection via Prisma
- XSS protection via React

## 🐛 Known Issues & Limitations

1. **Image Upload**: Requires Vercel Blob token or manual URL entry
2. **Email Service**: Requires Gmail account with App Password
3. **Testing**: Test suite not yet implemented
4. **Error Handling**: Some edge cases may need additional handling
5. **Rate Limiting**: Email sending not rate-limited (should be added for production)

## 🔮 Future Improvements

- [ ] Add rate limiting for email verification
- [ ] Implement comprehensive test suite
- [ ] Add analytics for menu views
- [ ] Support multiple languages
- [ ] Add menu customization options (themes, colors)
- [ ] Implement menu search functionality
- [ ] Add favorites/bookmarks for customers
- [ ] Support for menu item variants (sizes, add-ons)
- [ ] Admin analytics dashboard
- [ ] Bulk import/export functionality

## 📄 License

This project is created as an assignment submission.

## 👤 Author

Created as part of a software engineering assessment.

## 🤝 Contributing

This is an assignment project. For questions or feedback, please contact the repository owner.

---

**Note**: Make sure to configure all environment variables before running the application. The app requires a PostgreSQL database and Gmail SMTP credentials to function properly.
