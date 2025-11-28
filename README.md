# Digital Menu Management System

A full-stack digital menu management platform built with the T3 Stack, allowing restaurant owners to manage their menus and customers to view them digitally through QR codes or shared links.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma ORM)
- **API**: tRPC
- **UI Components**: shadcn/ui
- **Authentication**: Custom email-based auth with verification codes
- **Email Service**: Resend
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
- Resend account for email service
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

   # Email Service (Resend)
   RESEND_API_KEY="re_your_api_key_here"
   EMAIL_FROM="noreply@yourdomain.com"

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
   - `RESEND_API_KEY`
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
2. **Email Service**: Requires Resend API key
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

**Note**: Make sure to configure all environment variables before running the application. The app requires a PostgreSQL database and Resend API key to function properly.
