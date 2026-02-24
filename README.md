# Malaria Guardian AI

Autonomous Malaria Risk Prioritization System for pregnant women in Uganda at Mukono Health Centre III.

## Project Overview

Malaria Guardian AI is a comprehensive digital health system designed to identify and prioritize malaria risk among pregnant women in rural Uganda. The system leverages AI-driven analytics to provide healthcare workers with real-time risk assessments and intervention recommendations.

## Key Features

- **Risk Assessment**: AI-powered malaria risk evaluation for pregnant women
- **Priority Triage**: Automatic patient prioritization based on risk factors
- **Multi-Role Support**: Dedicated interfaces for VHTs, Healthcare workers, and patients
- **Offline Capability**: PWA-enabled for areas with limited connectivity
- **Multi-Language Support**: Localized interface for Ugandan healthcare context

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **PWA**: Progressive Web App capabilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/malaria-guardian-ai.git

# Navigate to the project directory
cd malaria-guardian-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts (language, theme)
├── pages/         # Main application pages
├── hooks/         # Custom React hooks
├── data/          # Mock data and types
└── lib/           # Utility functions
```

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

Create a `.env.production` file for production settings:

```env
VITE_API_URL=https://your-api-endpoint.com
VITE_ENVIRONMENT=production
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact the Mukono Health Centre III digital health team.
