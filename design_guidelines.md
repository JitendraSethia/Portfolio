# Design Guidelines: Jitendra Sethia Portfolio

## Design Approach
**System-Based Approach**: Tailwind CSS with dark-mode-first design principles, optimized for professional portfolio presentation with clean, technical aesthetics.

## Color Palette

**Dark Mode (Primary)**
- Background: 240 23% 9% (slate-900/#0F172A)
- Text Primary: 210 40% 96% (slate-100)
- Text Secondary: 214 32% 71% (slate-300)
- Accent Primary: 192 91% 54% (teal-400) OR 238 83% 63% (indigo-500)
- Card Backgrounds: 217 33% 17% (slate-800)
- Borders: 215 28% 25% (slate-700)

## Typography

**Font Stack**: System sans-serif (font-sans)
- Headlines (H1): text-4xl md:text-5xl lg:text-6xl, font-bold
- Section Titles (H2): text-3xl md:text-4xl, font-semibold
- Subheadings (H3): text-xl md:text-2xl, font-medium
- Body Text: text-base md:text-lg, leading-relaxed
- Navigation: text-sm md:text-base, font-medium

## Layout System

**Spacing Units**: Tailwind scale focusing on 4, 8, 12, 16, 20, 24, 32
- Section padding: py-16 md:py-24 lg:py-32
- Container max-width: max-w-6xl mx-auto px-4 md:px-8
- Component gaps: gap-4, gap-6, gap-8

## Component Library

### Navigation
- Fixed top navigation (sticky top-0 z-50)
- Glass-morphism effect: backdrop-blur-md bg-slate-900/80
- Mobile hamburger menu (hidden md:flex for desktop nav)
- Smooth scroll behavior for anchor links
- Hover state: text-teal-400 transition

### Hero Section
- Full viewport height (min-h-screen)
- Centered content with flex layout
- Large headline with gradient text effect using accent colors
- Prominent CTA button: bg-teal-400 hover:bg-teal-500 px-8 py-3 rounded-lg
- Subtle background pattern or gradient overlay
- Professional avatar placeholder (rounded-full, size 32-40)

### About Section
- Two-column layout on desktop (md:grid-cols-2): left side for image/visual, right for text
- Three-paragraph structure with clear typography hierarchy
- Generous paragraph spacing (space-y-4)
- Background: slight contrast from main (bg-slate-800/50)

### Skills Section
- Grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Skill cards: rounded-lg bg-slate-800 p-4 border border-slate-700
- Hover effect: border-teal-400 transform scale-105 transition
- Icon or initial letter for each skill
- Clean, tag-like appearance

### Projects Section
- Card-based grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Project cards: rounded-xl bg-slate-800 overflow-hidden shadow-xl
- Featured project (first): Larger card or span-2 on desktop
- Card structure: Image placeholder → Title → Description → CTA button
- "Coming Soon" cards: opacity-60 with distinct visual treatment
- Live project link: External link icon with arrow

### Contact Section
- Centered layout with clear headline
- Social icons: Large, hoverable (size-8 md:size-10)
- LinkedIn icon with brand color on hover (#0077B5)
- Email with icon, styled as clickable element
- Footer: border-t border-slate-700, py-8, copyright text-sm text-slate-400

## Images

**Hero Section**: Professional headshot or abstract tech-themed background (gradient mesh, code patterns, or geometric shapes). Position: Background with overlay or side-by-side with content.

**About Section**: Casual professional photo or workspace image showing personality.

**Projects Section**: Each project card includes a representative screenshot or placeholder graphic (16:9 aspect ratio).

## Interaction Patterns

- Smooth scroll: scroll-behavior: smooth
- Navigation highlights active section
- Hover states: scale transforms, color shifts to accent
- Mobile menu: Slide-in or fade transition
- No distracting animations—focus on clean transitions

## Responsive Strategy

**Breakpoints**:
- Mobile-first base styles
- md: 768px (tablet)
- lg: 1024px (desktop)
- Navigation: Hamburger menu below md, full horizontal above
- Grid systems: Single column mobile → multi-column desktop
- Typography: Scale up 1-2 sizes at each breakpoint
- Hero height: Maintain proper proportions across devices

## Accessibility

- Semantic HTML5 structure
- Proper heading hierarchy
- Focus states on all interactive elements
- Alt text for images
- Color contrast ratio > 4.5:1
- Keyboard navigation support