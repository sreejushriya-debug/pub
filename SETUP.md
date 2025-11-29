# Quick Setup Guide

## Step 1: Install Dependencies

Open your terminal in this folder and run:

```bash
npm install
```

## Step 2: Start the Development Server

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser!

## Step 3: Add Your PDF Resources

1. Go to https://www.projectbrightbeginnings.org/resources
2. Download all the PDF worksheets and resources
3. Place them in the `/public/resources/` folder
4. Update the download URLs in `/app/resources/page.tsx` to match your file names

Example:
```
/public/resources/kwl-worksheet.pdf
/public/resources/budgeting-lesson.pdf
```

## Troubleshooting

If `npm` is not found, install Node.js first:
- Download from https://nodejs.org (LTS version recommended)
- Or use Homebrew: `brew install node`

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com and import your repo
3. It will auto-deploy!

