# QuickFeedback

QuickFeedback is a modern, user-friendly widget for collecting website feedback. It provides a simple way for website owners to gather insights from their visitors through an embeddable widget.

## Features

- **Embeddable Widget**: Easy to integrate into any website with a single script tag
- **Customizable Form**: Configure the appearance and position of the feedback form
- **Real-time Analytics**: View and analyze feedback in a clean dashboard
- **Email Notifications**: Receive alerts when new feedback is submitted
- **Supabase Integration**: Secure and scalable backend for data storage

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Supabase for authentication, database, and storage
- **Deployment**: Vercel
- **Payments**: Stripe (for premium plans)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works for development)
- (Optional) Stripe account for payment processing

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/quickfeedback.git
cd quickfeedback
```

2. Install dependencies:

```bash
npm install
```

3. Create a Supabase project:
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and API keys

4. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

5. Test the Supabase connection:

```bash
# This will verify your Supabase environment variables and connection
node scripts/test-connection.js
```

6. Set up the database:

```bash
# This will check for table existence and provide SQL setup instructions
node scripts/setup-database.js
```

Alternatively, to set up the database directly:

1. Go to the Supabase SQL Editor in your project dashboard
2. Copy the entire contents of `scripts/quickfeedback-schema.sql`
3. Paste it into the SQL Editor and run the query

The schema will create:
- Three tables: `profiles`, `sites`, and `feedback`
- Row Level Security (RLS) policies for each table
- A trigger to automatically create user profiles on signup
- Functions for analytics

7. Run the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Widget Installation

To add the feedback widget to your website, add the following script to your HTML:

```html
<script 
  src="https://your-quickfeedback-domain.com/widget.js" 
  data-site-id="your-site-id" 
  data-position="bottom-right" 
  data-color="#2563eb">
</script>
```

### Configuration Options

- `data-site-id`: Required. Your unique site identifier from the dashboard
- `data-position`: Optional. Position of the widget (bottom-right, bottom-left, top-right, top-left)
- `data-color`: Optional. Primary color for the widget (hex code)
- `data-company`: Optional. Your company name to display in the widget

## Database Schema

The project uses Supabase with the following tables:

### Profiles Table
- `id`: UUID (references auth.users)
- `email`: TEXT (unique)
- `name`: TEXT
- `company_name`: TEXT
- `website`: TEXT
- `plan`: TEXT (free, pro, business)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### Sites Table
- `id`: UUID
- `user_id`: UUID (references profiles)
- `name`: TEXT
- `url`: TEXT
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### Feedback Table
- `id`: UUID
- `site_id`: UUID (references sites)
- `rating`: INTEGER (1-5)
- `comment`: TEXT
- `url`: TEXT
- `browser`: TEXT
- `device`: TEXT
- `created_at`: TIMESTAMPTZ

## API Routes

### Feedback API
- `POST /api/feedback`: Submit feedback
- `GET /api/feedback?siteId={siteId}`: Get feedback for a site

### Sites API
- `GET /api/sites?userId={userId}`: Get all sites for a user
- `GET /api/sites?siteId={siteId}`: Get a specific site
- `POST /api/sites`: Create a new site
- `PUT /api/sites`: Update a site
- `DELETE /api/sites?siteId={siteId}`: Delete a site

### Profiles API
- `GET /api/profiles?userId={userId}`: Get user profile
- `PUT /api/profiles`: Update user profile

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
