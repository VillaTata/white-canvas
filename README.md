# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Project checks

Use Node.js 22 or 24+ for development and builds. Tailwind CSS 4 targets
Safari 16.4+, Chrome 111+, and Firefox 128+.

Run the automated tests, TypeScript check, lint, and production build locally with:

```sh
npm audit
npm test
npm run typecheck
npm run lint
npm run build
```

The GitHub Pages workflow runs tests, type checking, and lint before building and
deploying the site.

## Gallery images

Place original images in their category folders under `src/assets/galeria/`. Then
run `npm run gallery:optimize` and include the generated files under
`src/assets/galeria-optimizada/` in the commit. The script creates 640 px
thumbnails and 1600 px images in WebP format for the gallery and lightbox.
Run `npm run og-image:generate` to create the social preview image from the
site background photo.

## Airbnb reviews

The GitHub Pages workflow refreshes `public/reviews.json` with the
`STAYAPI_API_KEY` repository secret and keeps the last valid copy in the Actions
cache. If StayAPI is unavailable, the build uses that copy and logs a warning;
if no valid copy exists, the build fails rather than publishing empty reviews.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
