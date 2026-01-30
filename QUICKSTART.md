# Quick Start Guide - LOOM Monitor

## 🚀 Getting Started

Your LOOM monitoring dashboard is now ready! Here's what has been set up:

### ✅ What's Included

1. **Modern UI Stack**
   - React 19 with TypeScript
   - shadcn/ui components with dark theme
   - Tailwind CSS for styling
   - React Router for navigation
   - TanStack Query for data fetching
   - Axios for API calls
   - Zod for schema validation

2. **Pages Created**
   - **Dashboard** (`/`) - System overview with key metrics
   - **Workflows** (`/workflows`) - List and manage workflows
   - **Workflow Details** (`/workflows/:id`) - Detailed workflow view
   - **Tasks** (`/tasks`) - Task monitoring and queue status
   - **Events** (`/events`) - Event sourcing audit trail
   - **Logs** (`/logs`) - System-wide log aggregation
   - **Statistics** (`/stats`) - Metrics and analytics

3. **Features**
   - Dark theme by default
   - Real-time data fetching with auto-refresh
   - Pagination and filtering
   - Type-safe API client
   - Responsive design
   - Status badges and indicators

### 🔧 Configuration

The dashboard is configured to connect to:
```
API: http://localhost:8000
```

To change this, edit the `.env` file:
```env
VITE_API_URL=http://your-api-url
```

### 📦 Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

### 🎨 Customization

#### Adding More Components
```bash
npx shadcn@latest add [component-name]
```

#### Theme Colors
Edit `src/index.css` to customize colors. The theme uses CSS custom properties.

#### API Integration
All API calls are in `src/lib/api.ts`. React Query hooks are in `src/lib/queries.ts`.

### 🌐 Development Server

The dev server is currently running at:
**http://localhost:5173**

### 📝 Next Steps

1. **Start your LOOM backend** on `http://localhost:8000`
2. **Open the dashboard** at `http://localhost:5173`
3. **Explore the features**:
   - View system statistics
   - Monitor workflows
   - Check task queues
   - Review events and logs

### 🎯 Key Features to Try

1. **Dashboard** - See real-time metrics updated every 5 seconds
2. **Workflows** - Click any workflow to see detailed information
3. **Filters** - Use dropdown filters to narrow down results
4. **Pagination** - Navigate through large datasets
5. **Dark Theme** - Optimized for extended monitoring sessions

### 📚 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn components
│   ├── layout.tsx   # Main layout
│   ├── sidebar.tsx  # Navigation
│   └── status-badge.tsx
├── lib/             # Core utilities
│   ├── api.ts       # API functions
│   ├── queries.ts   # React Query hooks
│   ├── types.ts     # TypeScript types
│   └── format.ts    # Formatters
├── pages/           # Route pages
└── App.tsx          # Main app
```

### 🐛 Troubleshooting

**API Connection Issues?**
- Check that LOOM backend is running
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors

**Build Errors?**
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if needed

### 💡 Tips

- The dashboard auto-refreshes stats every 5 seconds
- Use filters to focus on specific workflow states
- Click workflow IDs to see detailed timeline
- Check the Events tab for detailed execution flow
- Monitor Logs for debugging information

### 🎉 You're All Set!

Your LOOM monitoring dashboard is ready to use. Start monitoring your workflows!

For more information, see `LOOM_README.md`
