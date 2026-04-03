# v0 IRL Miami: Prompt to Production

*Landing page for the v0 IRL Miami event, built entirely with v0 and the Figma MCP*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/personal-d39c1b49/v0-website-ui-recreation)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0-black?style=for-the-badge)](https://v0.app/chat/jobAK7LAX0D)
[![Design in Figma](https://img.shields.io/badge/Design-Figma-black?style=for-the-badge&logo=figma)](https://www.figma.com/design/KbhsO6jvrESL0pQ45Mh9Og/V0-Prompt-to-Production)

## About the Event

**Prompt to Production** is a v0 IRL community event happening in Miami on **February 7, 2026**. v0 is launching its biggest product update yet, and they're celebrating with IRL events around the world—Miami is one of them.

This is a hands-on build day where developers:
- Build real apps with v0 using curated prompts
- Showcase their projects in a global gallery
- Vote for favorites and win local prizes
- Network with the Miami tech community

Sponsored by **Vercel**, **Klero**, **UKG**, and **The Lab Miami**.

## About This Project

This landing page was built as a demonstration of the **Figma-to-v0 workflow**—designing in Figma and using the Figma MCP (Model Context Protocol) to generate production-ready code with v0.

### Links

| Resource | Link |
|----------|------|
| **Figma Design** | [View Design](https://www.figma.com/design/KbhsO6jvrESL0pQ45Mh9Og/V0-Prompt-to-Production?node-id=1-2&t=QrTpYCx5ttic8DuS-1) |
| **v0 Chat & Code** | [View on v0](https://v0.app/chat/jobAK7LAX0D) |
| **GitHub Repository** | [View Repo](https://github.com/agnelnieves/v0-prompt-to-production) |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Custom scroll-triggered animations with Intersection Observer
- **Shaders**: [@paper-design/shaders-react](https://www.npmjs.com/package/@paper-design/shaders-react) for the dithering hero effect
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Modifying the Site

### Project Structure

```
app/
├── page.tsx        # Main landing page (all sections)
├── layout.tsx      # Root layout with metadata
├── globals.css     # Global styles
└── opengraph-image.png

components/
└── theme-provider.tsx

public/
└── (static assets)
```

### Key Sections in `page.tsx`

The landing page is built as a single-page app with these sections:

| Section | Description |
|---------|-------------|
| **Header** | Fixed navigation with logo and Sign Up button |
| **Hero** | Dithering shader background, event title, date/location |
| **Description** | Event overview text |
| **Agenda** | Timeline of the day's schedule |
| **Experience** | Grid of event highlights |
| **Sponsors** | Sponsor logos grid |
| **CTA Footer** | Final call-to-action |

### Customizing Content

**Update event details** — Edit the hero section in `page.tsx`:
```tsx
// Date
<p className="font-mono text-[16px]...">FEBRUARY 7, 2026</p>

// Location (currently TBD)
<p className="font-mono text-[16px]...">TBD</p>
```

**Update agenda items** — Modify the `AgendaItem` components:
```tsx
<AgendaItem number="01" title="Doors open, networking" description="12:30 PM" />
```

**Update sponsors** — Add or replace logos in the `SponsorCard` components. Logos are currently pulled from Figma API assets.

### Working with the Shader

The hero background uses the `Dithering` component from `@paper-design/shaders-react`:

```tsx
<Dithering
  colorBack="#000000"
  colorFront="#99999921"
  shape="warp"
  type="4x4"
  size={2.5}
  speed={0.45}
/>
```

Adjust `speed`, `size`, `colorFront`, or `shape` to change the effect.

### Animations

Scroll-triggered animations use a custom `useInView` hook with Intersection Observer. Each section has its own ref:

```tsx
const agendaSection = useInView(0.2) // triggers at 20% visibility

// In JSX
<section ref={agendaSection.ref} className={`... ${agendaSection.isInView ? 'opacity-100' : 'opacity-0'}`}>
```

### Using v0 to Make Changes

You can continue building on this project with v0:

1. Open the [v0 chat](https://v0.app/chat/jobAK7LAX0D)
2. Describe your changes in natural language
3. v0 will generate updated code
4. Copy the changes or deploy directly

### Using the Figma MCP

If you have access to the [Figma design](https://www.figma.com/design/KbhsO6jvrESL0pQ45Mh9Og/V0-Prompt-to-Production), you can use the Figma MCP in Cursor or v0 to:

- Pull updated design tokens (colors, spacing, typography)
- Extract new assets or components
- Keep code in sync with design changes

## License

MIT
