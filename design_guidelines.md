# Design Guidelines: 아포AU - Post-Apocalyptic Story Game

## Design Approach
**Reference-Based**: Post-apocalyptic SF aesthetic inspired by The Last of Us, with sophisticated game UI patterns. Dark, gritty atmosphere with strategic use of red accent color.

## Core Design Elements

### Typography
- **Title Font**: Bold, industrial sans-serif (e.g., Rajdhani Bold, Orbitron) for '아포AU'
- **Subtitle Font**: Same family, medium weight for '2026'
- **Button Text**: Clean sans-serif, medium weight
- **Colors**: Bold red (#DC2626 or similar) for title, subtitle, and start button only

### Layout System
- **Spacing**: Tailwind units of 4, 8, 12, 16 for consistent rhythm
- **Grid**: Asymmetric split - left-aligned title content, right-aligned action buttons
- **Background**: Full-screen background image (provided post-apocalyptic scene) with dark overlay for text readability

### Component Structure

**Start Screen Layout**:
- Full viewport height (100vh)
- Background image fills entire screen with subtle vignette overlay
- Left side (w-1/2): Title '아포AU' and subtitle '2026' vertically centered, pl-16
- Right side (w-1/2): Vertical button stack (Start, Options, Credits) vertically centered, pr-16
- All buttons except "Start" use transparent dark background with white text
- Start button: Solid red background (#DC2626), white text, larger size (prominent CTA)

**Interactive Effects**:
- **Mouse Movement**: Parallax screen shake effect (subtle transform translate)
- **Dust Particles**: Animated floating particles across screen (canvas or CSS particles)
- **Click Sparkles**: Particle burst effect follows cursor on click
- **Audio**: Background music (third audio file) loops on start screen
- **Video Transition**: Fullscreen video playback on start button click

### Animation Guidelines
- Screen shake: 2-3px maximum displacement, smooth easing
- Dust particles: Slow drift animation, varied opacity (0.3-0.7)
- Sparkles: Quick burst with fade-out (500ms duration)
- Button hover: Subtle scale (1.05) for non-start buttons
- Video transition: Immediate fullscreen takeover, no fade

### Images
- **Hero Background**: Provided post-apocalyptic cityscape - full bleed, fixed position, slight blur or darkening for text contrast
- No additional images needed for start screen

### Accessibility
- Ensure red text meets WCAG contrast standards against dark background
- Provide audio controls (mute toggle) for background music
- Keyboard navigation for all interactive elements