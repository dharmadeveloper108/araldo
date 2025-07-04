# 🗣️ Araldo

A monitoring tool that checks for content changes on web pages you want to keep an eye on. It fetches and hashes HTML content, compares against stored versions, and sends an email notification when a change is detected.

## ✨ Features

- Periodically checks each URL based on a `period` (expressed in CRON format)
- Fetches URLs from a Supabase table
- Uses Puppeteer to fetch HTML content
- Compares current HTML via content hash
- Sends email alerts via Resend when pages update

## 🧱 Tech Stack

- Node.js + TypeScript
- Express
- Supabase (PostgreSQL)
- Puppeteer
- Resend (email delivery)
- Cron (job scheduler)
- Dotenv for env config

## 🛠 Setup

### 1. Clone the repo

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```
SUPABASE_DATABASE_URL=your_supabase_url
SUPABASE_DATABASE_KEY=your_supabase_anon_or_service_key
RESEND_API_KEY=your_resend_key
DEV_EMAIL=your@email.com
```

### 4. Set up the Supabase table

> ⚠️ **Important**  
> This MVP version does **not** include authentication, and therefore also lacks POST endpoints.  
> If you want to try the app, you’ll need to:
>
> - Create a Supabase project
> - Add a table called `UrlCheck` manually
> - Insert your own test records directly via the Supabase dashboard or SQL editor
>
> **Basic schema:**
>
> | id  | url  | hash | period | lastCheckedAt | urlName |
> | --- | ---- | ---- | ------ | ------------- | ------- |
> | int | text | text | int    | timestamp     | text    |
