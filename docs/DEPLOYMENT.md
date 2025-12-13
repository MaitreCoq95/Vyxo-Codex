# Deployment Guide - Vyxo Codex 2.0

Complete guide for deploying Vyxo Codex 2.0 to production.

## Prerequisites

- Node.js 20+ installed
- Supabase project created
- Vercel account (or alternative hosting)
- Domain name (optional but recommended)

## 1. Environment Setup

### 1.1 Clone and Install

```bash
git clone https://github.com/your-org/vyxo-codex.git
cd vyxo-codex
npm install
```

### 1.2 Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 2. Database Setup

### 2.1 Run Migrations

Apply all database migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 2.2 Verify Tables

Check that all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

Expected tables:
- profiles
- companies
- teams
- modules
- user_modules
- challenges
- user_challenges
- badges
- user_badges
- notifications
- quiz_questions

### 2.3 Enable Row Level Security

Verify RLS is enabled on all tables:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All should show `rowsecurity = true`.

## 3. Email Configuration (Resend)

### 3.1 Setup Resend

1. Create account at https://resend.com
2. Add and verify your domain
3. Create API key
4. Add to `.env.local`:

```env
RESEND_API_KEY=re_your-key
RESEND_FROM_EMAIL=noreply@your-domain.com
```

### 3.2 Test Email Sending

```bash
npm run test:email
```

## 4. AI Service Setup (OpenAI)

### 4.1 Get API Key

1. Create account at https://platform.openai.com
2. Navigate to API Keys
3. Create new key
4. Add to `.env.local`:

```env
OPENAI_API_KEY=sk-your-key
```

### 4.2 Test AI Generation

```bash
npm run test:ai
```

## 5. Build and Test Locally

### 5.1 Run Tests

```bash
npm run test
```

### 5.2 Build Application

```bash
npm run build
```

### 5.3 Start Production Server

```bash
npm start
```

Visit http://localhost:3000 and verify:
- Login works
- Registration works
- Modules load
- Quiz questions work
- Notifications work

## 6. Deploy to Vercel

### 6.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 6.2 Login to Vercel

```bash
vercel login
```

### 6.3 Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 6.4 Configure Environment Variables

In Vercel dashboard:

1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`
3. Set for Production, Preview, and Development

### 6.5 Configure Domains

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records

## 7. Post-Deployment Verification

### 7.1 Health Checks

```bash
# Check API health
curl https://your-domain.com/api/health

# Check authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test"}'
```

### 7.2 Monitor Logs

```bash
# View deployment logs
vercel logs

# View runtime logs
vercel logs --follow
```

### 7.3 Performance Testing

Use Lighthouse to verify:
- Performance > 90
- Accessibility > 90
- Best Practices > 90
- SEO > 90

## 8. Monitoring Setup (Optional)

### 8.1 Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to `.env.local`:

```env
NEXT_PUBLIC_SENTRY_DSN=your-dsn
```

### 8.2 Vercel Analytics

Already included with Vercel deployment.

### 8.3 PostHog (Product Analytics)

```bash
npm install posthog-js
```

Add to `.env.local`:

```env
NEXT_PUBLIC_POSTHOG_KEY=your-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 9. CI/CD Setup

GitHub Actions workflows are already configured in `.github/workflows/`:

- `ci.yml` - Runs on every PR
- `deploy.yml` - Deploys to production on main push
- `pr-checks.yml` - PR validation

### 9.1 Configure GitHub Secrets

Add these secrets in GitHub repository settings:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
RESEND_API_KEY
CODECOV_TOKEN (optional)
SNYK_TOKEN (optional)
```

## 10. Backup and Recovery

### 10.1 Database Backups

Supabase automatically backs up your database daily. To create manual backup:

```bash
supabase db dump -f backup.sql
```

### 10.2 Restore from Backup

```bash
supabase db reset
psql $DATABASE_URL < backup.sql
```

## 11. Scaling Considerations

### 11.1 Database Connection Pooling

Supabase includes connection pooling by default. For additional optimization:

```typescript
// Use transaction mode for better performance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + '/pool/transaction';
```

### 11.2 Caching Strategy

- Use Vercel Edge Config for feature flags
- Implement Redis for rate limiting (optional)
- Use Next.js ISR for static content

### 11.3 CDN Configuration

Vercel automatically serves static assets via CDN.

## 12. Security Checklist

- [ ] All environment variables are secure
- [ ] RLS policies are enabled on all tables
- [ ] CORS is properly configured
- [ ] Rate limiting is active
- [ ] HTTPS is enforced
- [ ] Security headers are set
- [ ] API keys are rotated regularly
- [ ] Database backups are automated
- [ ] Error messages don't expose sensitive data
- [ ] Authentication tokens expire appropriately

## 13. Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database connection errors:**
- Verify Supabase project is active
- Check connection string
- Verify RLS policies allow access

**API errors:**
- Check environment variables
- Verify API keys are valid
- Check rate limits

## 14. Maintenance

### Regular Tasks

- **Weekly:** Check error logs, review analytics
- **Monthly:** Update dependencies, rotate API keys
- **Quarterly:** Review and optimize database queries
- **Annually:** Security audit, dependency audit

### Update Process

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Test
npm run test

# Deploy
vercel --prod
```

## Support

For deployment issues:
- Documentation: https://docs.vyxo-codex.com
- Email: support@vyxo-codex.com
- GitHub Issues: https://github.com/vyxo/vyxo-codex/issues
