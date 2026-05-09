# SkillsBallpit Component - Integration Guide

## Overview
`SkillsBallpit` is a React component that renders an interactive 3D ball pit visualization of your technical skills. Each ball represents a skill and can be hovered to reveal the skill name.

## Installation

### 1. Install Dependencies
```bash
npm install three gsap
# or
yarn add three gsap
```

### 2. Copy Component File
Copy `SkillsBallpit.tsx` to your project's components directory:
```
src/components/SkillsBallpit.tsx
```

### 3. Verify TypeScript Configuration
Ensure your `tsconfig.json` includes three.js types:
```json
{
  "compilerOptions": {
    "types": ["three"]
  }
}
```

## Basic Usage

### Simple Integration
```tsx
import SkillsBallpit from '@/components/SkillsBallpit';

export default function Portfolio() {
  return (
    <div className="w-full h-screen">
      <SkillsBallpit />
    </div>
  );
}
```

### With Custom Height
```tsx
<div className="w-full h-[500px]">
  <SkillsBallpit className="rounded-lg" />
</div>
```

### With Full Configuration
```tsx
<SkillsBallpit 
  className="rounded-lg shadow-2xl"
  followCursor={true}
  maxBalls={11}
  gravity={0.5}
  friction={0.9975}
  wallBounce={0.95}
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | '' | CSS classes applied to the container |
| `followCursor` | boolean | true | Enable/disable cursor-following behavior |
| `maxBalls` | number | 11 | Limit the number of skill balls (max 11) |
| `gravity` | number | 0.5 | Gravity strength (0 = no gravity, 1 = strong) |
| `friction` | number | 0.9975 | Friction coefficient (higher = more sliding) |
| `wallBounce` | number | 0.95 | Bounce coefficient on walls (0-1) |

## Skills Included

The component comes with 11 pre-configured skills:

1. **Next.js** (Black #000000)
2. **Redux** (Purple #764abc)
3. **Tailwindcss** (Cyan #06b6d4)
4. **Python** (Blue #3776ab)
5. **three.js** (Sky Blue #049ef4)
6. **Shaders** (Pink #ff6b9d)
7. **Git & GitHub** (Red #f1502f)
8. **SEO** (Google Blue #4285f4)
9. **GSAP** (Lime #88ce02)
10. **TypeScript** (Blue #3178c6)
11. **Frappe** (Black #000000)

### Customizing Skills

To modify the skills list, edit the `SKILLS` array at the top of `SkillsBallpit.tsx`:

```tsx
const SKILLS = [
  { name: 'Your Skill', color: 0xFF0000, emoji: '✨' },
  // ... more skills
];
```

**Color Values:**
- Use hex color codes without the '#' prefix
- Example: `0xFF0000` for red

## Advanced Usage

### Controlling Physics

```tsx
// Very sluggy, gravity-heavy
<SkillsBallpit 
  gravity={1.0}
  friction={0.95}
  wallBounce={0.8}
/>

// Bouncy, frictionless
<SkillsBallpit 
  gravity={0.2}
  friction={0.999}
  wallBounce={0.98}
/>

// Slow-motion effect
<SkillsBallpit 
  gravity={0.1}
  friction={0.999}
  wallBounce={0.99}
/>
```

### Limiting Ball Count

```tsx
// Show only first 5 skills
<SkillsBallpit maxBalls={5} />

// Show all skills (default)
<SkillsBallpit maxBalls={11} />
```

### Static Presentation

```tsx
// Disable cursor interaction
<SkillsBallpit followCursor={false} />
```

## Styling & Layout

### Full-Screen Ballpit
```tsx
<div className="w-full h-screen">
  <SkillsBallpit />
</div>
```

### Bounded Container
```tsx
<div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
  <SkillsBallpit className="rounded-lg" />
</div>
```

### Dark Theme (Tailwind)
```tsx
<div className="w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden">
  <SkillsBallpit />
</div>
```

### With Border
```tsx
<div className="w-full h-[500px] border-2 border-cyan-500 rounded-lg overflow-hidden">
  <SkillsBallpit />
</div>
```

## Hover Behavior

The component automatically displays a tooltip showing the skill name when you hover over a ball:

- **Tooltip Style:** Dark background with white text
- **Position:** Above the hovered ball with slight offset
- **Animation:** Smooth fade-in effect
- **Responsive:** Works on desktop and touch devices

## Performance Considerations

- **Optimized Rendering:** Uses Three.js InstancedMesh for efficient rendering
- **Active Only:** Animation pauses when component is out of view
- **Memory:** Single canvas per instance, automatic cleanup on unmount
- **Mobile:** Touch events supported with full physics simulation

### Performance Tips

1. Limit `maxBalls` to reduce geometry processing
2. Lower `gravity` and `wallBounce` for simpler physics
3. Increase `friction` to reduce ball velocity changes
4. Consider disabling `followCursor` on mobile devices

## Troubleshooting

### Canvas Not Rendering
- Ensure the parent container has a defined height
- Check that Three.js is properly installed
- Verify WebGL is supported in the browser

### Balls Not Moving
- Check `gravity` is not 0
- Verify `followCursor` is enabled or balls need initial velocity
- Ensure `friction` is not too high (< 1.0)

### Poor Performance
- Reduce `maxBalls` to lower count
- Increase `friction` to stabilize balls
- Disable `followCursor` for static presentation
- Check browser console for WebGL errors

### Tooltip Not Appearing
- Ensure `z-index: 50` is not blocked by parent elements
- Verify CSS is imported correctly
- Check browser DevTools for tooltip element visibility

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers with WebGL support

## Integration Examples

### In a Portfolio Page

```tsx
import SkillsBallpit from '@/components/SkillsBallpit';

export default function Portfolio() {
  return (
    <main className="bg-black text-white">
      <section className="py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">My Skills</h1>
        <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-2xl">
          <SkillsBallpit followCursor={true} />
        </div>
      </section>
    </main>
  );
}
```

### In a Resume/CV

```tsx
import SkillsBallpit from '@/components/SkillsBallpit';

export default function CVSection() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Technical Expertise</h2>
      <div className="w-full h-[400px] rounded-lg border border-gray-300 overflow-hidden">
        <SkillsBallpit maxBalls={8} followCursor={true} />
      </div>
    </div>
  );
}
```

### In a Contact/About Page

```tsx
<section className="w-full py-16 bg-gradient-to-b from-gray-900 to-black">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-white mb-4">Expertise</h2>
    <p className="text-gray-400 mb-8">Interactive visualization of my technical skills</p>
    <div className="w-full h-[500px]">
      <SkillsBallpit 
        className="rounded-xl"
        gravity={0.6}
        friction={0.997}
        wallBounce={0.92}
      />
    </div>
  </div>
</section>
```

## License & Attribution

This component is based on the Ballpit component from React Bits, inspired by Kevin Levron's work.

Original: https://x.com/soju22/status/1858925191671271801

## Support & Customization

For additional customization or modifications, refer to the Three.js and GSAP documentation:
- Three.js: https://threejs.org/docs/
- GSAP: https://gsap.com/docs/
