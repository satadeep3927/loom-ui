# LOOM Monitor - Workflow Orchestration Dashboard

A beautiful, modern web UI for monitoring and managing your LOOM workflow orchestration system. Built with React, TypeScript, shadcn/ui, and Tailwind CSS.

## ✨ Features

- **📊 Real-time Dashboard** - Monitor system metrics, active workflows, and recent activity
- **🔄 Workflow Management** - View, filter, and inspect workflow executions
- **📝 Task Monitoring** - Track task execution, queue status, and retry policies
- **📡 Event Sourcing** - Audit trail with comprehensive event history
- **📋 Log Aggregation** - System-wide log monitoring with filtering
- **📈 Statistics** - Detailed metrics and performance analytics
- **🎨 Dark Theme** - Beautiful dark mode UI by default
- **⚡ Fast & Responsive** - Built with modern React and optimized performance

## 🚀 Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **TanStack Query (React Query)** - Data fetching and caching
- **Axios** - HTTP client
- **Zod** - Schema validation
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## 📦 Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── layout.tsx      # Main layout wrapper
│   ├── sidebar.tsx     # Navigation sidebar
│   └── status-badge.tsx # Status indicators
├── lib/                # Core utilities
│   ├── api.ts          # API client functions
│   ├── api-client.ts   # Axios instance
│   ├── queries.ts      # React Query hooks
│   ├── types.ts        # TypeScript types & Zod schemas
│   ├── format.ts       # Date/time formatting
│   └── utils.ts        # Helper utilities
├── pages/              # Page components
│   ├── dashboard.tsx   # Main dashboard
│   ├── workflows.tsx   # Workflows list
│   ├── workflow-detail.tsx # Workflow details
│   ├── tasks.tsx       # Tasks list
│   ├── events.tsx      # Events list
│   ├── logs.tsx        # Logs viewer
│   └── stats.tsx       # Statistics page
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

The dashboard connects to the LOOM API backend. Make sure your LOOM server is running on the configured API URL (default: `http://localhost:8000`).

The API client automatically handles:

- Request/response formatting
- Error handling
- Type validation with Zod schemas
- Query caching and invalidation

## 🎨 Customization

### Theme

The app uses dark mode by default. The theme is defined in `src/index.css` using CSS custom properties. You can customize colors by modifying the `.dark` class variables.

### API URL

Update the `VITE_API_URL` environment variable to point to your LOOM API server.

### Components

All UI components are built with shadcn/ui. To add more components:

```bash
npx shadcn@latest add <component-name>
```

## 📊 Features Overview

### Dashboard

- System overview with key metrics
- Recent workflows and logs
- Quick access to critical information

### Workflows

- List all workflows with filtering
- Sort by status, date, or name
- View detailed workflow information
- Event timeline and logs
- Input/output data inspection

### Tasks

- Monitor task execution
- Filter by status and workflow
- Track retry attempts
- View task details

### Events

- Event sourcing audit trail
- Filter by event type
- View event payloads
- Real-time event monitoring

### Logs

- System-wide log aggregation
- Filter by log level
- Search and pagination
- Error tracking

### Statistics

- Workflow success rates
- Task queue metrics
- System health indicators
- Visual progress bars

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by LOOM Workflow Engine
