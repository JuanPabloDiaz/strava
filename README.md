# Fit

Matrix look and feel UI for your fitness data.

## Setup

1.  **Install Node.js**: Ensure you have Node.js version `18.17.1` or later. Using `nvm` is recommended: `nvm use`.
2.  **Install Dependencies**: Use Bun to install project dependencies:
    ```bash
    bun install
    ```
3.  **Set up Environment Variables**:
    Copy the `.env.sample` file to a new file named `.env`:
    ```bash
    cp .env.sample .env
    ```
    Then, edit `.env` and fill in the required API keys:
    - `STRAVA_CLIENT_ID`: Your Strava application's Client ID.
    - `STRAVA_CLIENT_SECRET`: Your Strava application's Client Secret.
    - `STRAVA_REFRESH_TOKEN`: Your Strava refresh token. See [Strava API Documentation](./DOCS-STRAVA.md) for details on obtaining this.
    - `HEVY_API_KEY`: Your API key for the Hevy app. You can get this from your Hevy profile under Settings -> API Key. This is required to display recent Hevy workout data.

## Development

- **Start Development Server**:

  ```bash
  bun dev
  ```

  This starts the local development server at `http://localhost:4321`.

- **Preview Production Build**:

  ```bash
  bun preview
  ```

  This builds your production site to `./dist/` and previews it locally before deploying.

- **Astro CLI Commands**:
  ```bash
  bun astro --help
  ```
  Run various Astro CLI commands.

## Documentation

- [Strava API Setup](./DOCS-STRAVA.md): Detailed instructions on how to get Strava API tokens and change scopes.

## Available Scripts

- `bun dev`: Starts the development server.
- `bun build`: Builds the application for production (includes type checking).
- `bun preview`: Previews the production build locally.
- `bun format`: Formats code using Prettier.
- `bun clean`: Removes build artifacts and installed dependencies.
- `bun lint`: Lints code using ESLint.
- `bun test`: Runs tests using Vitest.
- `bun strava-script`: Runs a specific Strava-related script.

## Resources

- [Hevy GitHub](https://github.com/dmzoneill/hevyapp-api): Hevy API documentation.
- [Strava API Documentation](https://developers.strava.com/docs/reference/): Official Strava API documentation.
- [Astro Documentation](https://docs.astro.build): Official Astro documentation for more details on building and deploying Astro sites.
