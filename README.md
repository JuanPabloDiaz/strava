# The Fitness Matrix 🏃‍♂️💪

> Transform your fitness data into a Matrix-inspired visual experience.

The Fitness Matrix is a cutting-edge web application that revolutionizes how you visualize and analyze your fitness data. By seamlessly integrating Strava and Hevy APIs, it delivers an immersive, Matrix-themed interface that makes tracking your physical performance both engaging and insightful.

<div align="center">

**Because I am a fitness enthusiasts and data lover**

_Transform your fitness journey into a visual masterpiece_

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://fit.jpdiaz.dev)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/JuanPabloDiaz/fit)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

</div>

## 🔍 About

The Fitness Matrix transforms your fitness journey into a visual masterpiece. This innovative platform combines the power of Strava's activity tracking with Hevy's strength training data, presenting everything through a captivating Matrix-inspired interface that makes data analysis both intuitive and visually stunning.

**Key Features:**

- **Real-time Activity Monitoring**: Track running, cycling, swimming, and walking activities with intelligent status indicators (EXCELLENT, WARNING, CRITICAL)
- **365-Day Neural Mapping**: Interactive heatmap visualization showing your annual activity patterns and consistency
- **Strength Training Integration**: Comprehensive workout tracking through Hevy API integration
- **Matrix Aesthetic**: Immersive terminal-style interface with authentic Matrix visual elements
- **Performance Analytics**: Advanced metrics and trend analysis for informed fitness decisions

## 🎯 Features

### 1. **Activity Status Matrix**

- **Smart Status Indicators**: Visual feedback system showing days since last activity
- **Activity Tracking**: Comprehensive monitoring of cardio activities (running, cycling, swimming, walking)
- **Motivational Alerts**: Encouraging messages when it's time to get back to training
- **Last Activity Data**: Detailed information about your most recent workout sessions

### 2. **365-Day Neural Mapping**

- **Interactive Heatmap**: Year-long visualization of daily activities with intensity levels
- **Pattern Recognition**: Identify training consistency and seasonal trends
- **Data Range Visualization**: Min/Max activity tracking with detailed daily breakdowns
- **Temporal Analysis**: Weekly and monthly activity distribution patterns

### 3. **Hevy Workout Matrix**

- **Strength Training Analytics**: Complete integration with Hevy's weightlifting database
- **Workout Counter**: Total workout tracking with binary matrix visualization
- **Real-time Sync**: Live API connection ensuring up-to-date workout data
- **Progress Visualization**: Track your strength training journey over time

### 4. **Matrix-Inspired Interface**

- **Terminal Aesthetics**: Authentic command-line interface styling
- **Green Matrix Theme**: Classic Matrix color scheme with modern UX principles
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Immersive Experience**: Full-screen dashboard for distraction-free analysis

## 🚀 Technologies

This project leverages modern web technologies for optimal performance and user experience:

- **[Astro](https://astro.build/)** - Modern static site generator for fast, optimized builds
- **[Bun](https://bun.sh/)** - Ultra-fast JavaScript runtime and package manager
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better code quality
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid styling
- **[Strava API](https://developers.strava.com/)** - Access to running, cycling, and swimming data
- **[Hevy API](https://github.com/jovanhuang/hevy-api)** - Strength training and workout data integration
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework

## 📊 Data Integration

### Strava Integration

- **Activities Supported**: Running, Cycling, Swimming, Walking
- **Data Points**: Distance, Duration, Pace, Heart Rate, Elevation
- **Real-time Sync**: Automatic updates from your Strava account
- **Historical Data**: Access to your complete activity history

### Hevy Integration

- **Workout Tracking**: Complete strength training sessions
- **Exercise Database**: Comprehensive exercise library
- **Progress Metrics**: Weight, reps, sets, and volume tracking
- **Training Analytics**: Workout frequency and intensity analysis

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js** 18.17.1 or higher
- **Bun** runtime installed
- **Strava Developer Account** with API access
- **Hevy API Key** for workout data

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/JuanPabloDiaz/fit.git
   cd fit
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.sample .env
   ```

   Fill in your API credentials:

   ```env
   STRAVA_CLIENT_ID=your_strava_client_id
   STRAVA_CLIENT_SECRET=your_strava_client_secret
   STRAVA_REFRESH_TOKEN=your_strava_refresh_token
   HEVY_API_KEY=your_hevy_api_key
   ```

4. **Start development server**

   ```bash
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4321` to see your fitness matrix!

## 📦 Available Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `bun dev`           | Start development server                |
| `bun build`         | Build production version                |
| `bun preview`       | Preview production build locally        |
| `bun format`        | Format code with Prettier               |
| `bun clean`         | Remove build artifacts and dependencies |
| `bun lint`          | Lint code with ESLint                   |
| `bun test`          | Run tests with Vitest                   |
| `bun strava-script` | Execute Strava-specific scripts         |

## 📚 Documentation

### API Configuration

- **[Strava API Setup Guide](DOCS-STRAVA.md)** - Complete guide to obtaining Strava API tokens and configuring proper scopes
- **Hevy API Configuration** - Instructions for connecting your Hevy account

### Development

- **Local Development** - Hot reload and development tools
- **Testing** - Unit tests and integration testing setup
- **Deployment** - Production build and deployment instructions

## 🌐 Live Demo & Links

- **🌍 Live Application**: [fit.jpdiaz.dev](https://fit.jpdiaz.dev)
- **💻 Source Code**: [github.com/JuanPabloDiaz/fit](https://github.com/JuanPabloDiaz/fit)
- **📖 Strava API**: [developers.strava.com](https://developers.strava.com/)
- **🏋️ Hevy API**: [Hevy GitHub](https://github.com/jovanhuang/hevy-api)
- **⚡ Astro Docs**: [docs.astro.build](https://docs.astro.build)

## 🤝 Contributing

We welcome contributions to make Fit even better! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting any changes.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to:

- **Strava API** team for comprehensive fitness data access
- **Hevy Community** for strength training data integration
- **Matrix Movie** for the iconic visual inspiration
- **Open Source Community** for the amazing tools and frameworks

## 📞 Contact

**Juan Pablo Diaz**

- **Website**: [jpdiaz.dev](https://jpdiaz.dev)
- **GitHub**: [@JuanPabloDiaz](https://github.com/JuanPabloDiaz)
- **Project**: [fit.jpdiaz.dev](https://fit.jpdiaz.dev)
