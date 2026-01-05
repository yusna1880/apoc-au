# 아포AU - 2026

## Overview
A choice-based storytelling game set in a post-apocalyptic world. The game features an immersive start screen with interactive visual effects.

## Current State
MVP complete with the following features:
- **Start Screen**: Full-featured game start menu with apocalyptic SF theme
- **Visual Effects**: Mouse movement parallax, dust particle effects, click sparkles
- **Audio**: Background music plays on start screen only
- **Video**: Fullscreen intro video plays when starting the game

## Tech Stack
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **UI Components**: Shadcn/ui component library
- **Backend**: Express.js
- **Routing**: Wouter for client-side routing

## Project Structure
```
client/
  src/
    pages/
      home.tsx          # Main start screen with all effects
    components/ui/      # Shadcn UI components
attached_assets/
  *.jfif              # Background image
  *.mp4               # Intro video
  *.mp3               # Background music
server/
  index.ts            # Express server entry
  routes.ts           # API routes
```

## Design System
- **Primary Color**: Red (#DC2626) for title, subtitle, and start button
- **Theme**: Dark, post-apocalyptic SF aesthetic
- **Font**: Oxanium for titles, Open Sans for body text
- **Effects**: Parallax screen shake, floating dust particles, click sparkles

## Running the App
The workflow "Start application" runs `npm run dev` which starts the Express server with Vite dev server on port 5000.

## Future Development
- Story content and branching narrative system
- Player choice tracking and save/load functionality
- Additional game screens and gameplay mechanics
