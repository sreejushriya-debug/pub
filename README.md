# Project Bright Beginnings

A modern, animated Next.js website for Project Bright Beginnings - a nonprofit organization dedicated to making financial literacy education accessible to all students.

## 🌟 Features

- **Modern Design**: Clean, professional UI with smooth animations using Framer Motion
- **Responsive**: Fully responsive design that works beautifully on all devices
- **Accessible**: Built with accessibility best practices in mind
- **Fast**: Optimized for performance with Next.js 14
- **SEO Friendly**: Proper meta tags and structured content

## 🎨 Design System

### Colors
- **Forest Green**: Primary brand color (`#2d5a27`)
- **Sage Green**: Secondary accent (`#8fbc8f`)
- **Warm Brown**: Accent color (`#8b6914`)
- **Cream**: Background (`#FAF8F5`)

### Typography
- **Display Font**: Playfair Display (serif)
- **Body Font**: Inter (sans-serif)

## 📁 Project Structure

```
pbb/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── resources/         # Resource library
│   ├── impact/            # Our Impact page
│   ├── course/            # Financial Foundations Course
│   ├── bootcamp/          # Finance BootCamp
│   └── contact/           # Contact page
├── components/            # Reusable React components
├── public/               # Static assets
│   └── resources/        # Downloadable PDF resources
└── ...config files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pbb
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

Or deploy manually:
```bash
npm run build
npm run start
```

## 🔧 Environment Variables

No environment variables are required for basic functionality. For form submissions, you may want to add:
- Email service integration
- Analytics tracking

## 📄 Adding Resources

To add downloadable resources:
1. Place PDF files in `/public/resources/`
2. Update the resources array in `/app/resources/page.tsx`

## 🎯 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with hero, stats, offerings |
| About | `/about` | Mission, values, and journey |
| Resources | `/resources` | Downloadable worksheets and lesson plans |
| Our Impact | `/impact` | Statistics and outcomes |
| Course | `/course` | Financial Foundations Course signup |
| BootCamp | `/bootcamp` | Finance BootCamp registration |
| Contact | `/contact` | Contact form and FAQ |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is for Project Bright Beginnings nonprofit organization.

## 📧 Contact

- Email: projectbrightbeginnings@gmail.com
- Phone: 945-216-0206
- Address: 5707 Moriss Road, Flower Mound, TX 75028

