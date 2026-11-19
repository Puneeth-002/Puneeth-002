# Puneeth s gowda — Film Journal & Cinematic Portfolio

An expressive, cinematic portfolio website for freelance video editor **Puneeth s gowda**, styled with the visual identity of an **independent filmmaker’s journal & contact sheet**.

---

## 🎬 Design Concept & Highlights

- **◈ Cinematic Timeline Rebuild (Post-Production Crew)**:
  - Adapted from [Dhvanil Patel's Swarm Cursors](https://github.com/DhvanilPatel/swarm-cursors) (inspired by [Joel Califa's Swarm](https://joelcalifa.com)).
  - Click **Rebuild Timeline** in the navigation, click the Hero CTA button, or press **`Alt+Shift+S`** anywhere on the page.
  - The entire page dissolves into a blank canvas while an elite post-production crew (`LEAD EDITOR`, `DIRECTOR`, `COLORIST`, `DOP`, `SOUND DES.`, `VFX ARTIST`) with razor-sharp camera viewfinder crosshairs reconstructs Puneeth's portfolio live in front of you.
  - Features real-time layout box generation, kinetic text typing, pen-tool lines, and snap-to ruler guides in a clean, silent, film-grade presentation (all disruptive music removed).
  - Includes toolbar controls: speed adjustment (1× / 2× / 3×), Tour mode (auto-scroll), toolbar toggle (`H`), and clean exit (`Esc` or **Go Live**).
  - Also supports auto-start on load via URL parameter `index.html?swarm=1` or hash `#swarm`.
- **Paused Film Frame Hero**: The opening features Puneeth's actual editorial portrait framed like a paused director's monitor frame with corner crop marks (`⌜ ⌝ ⌞ ⌟`), `REC ●` blinking telemetry, 2.39:1 Cinemascope indicators, and the personal tagline: *“You bring the footage. Let’s find the story in it.”*
- **Persistent Editing Playhead (Timeline Scrubber)**: A slim timeline scrubber at the top of the browser that tracks your scroll position in real time with a moving playhead marker and a live timecode readout (`00:00:00:00` to `00:05:00:00`).
- **Cinematic Contact Sheet for Selected Work**:
  - Filterable project grid (`All Cuts`, `Short-Form & Reels`, `Vlogs & YouTube`, `Events & Highlights`).
  - Styled like darkroom contact sheet frames (`FRAME #01` through `FRAME #06`).
  - Includes dedicated **Production Notes** for each cut (e.g. Cut Focus, NLE, Audio design).
  - Built-in accessible modal lightbox for previewing YouTube, Vimeo, or direct `.mp4` video files.
- **Production Slate / "First Collaborations" Offer**:
  - A special section styled like an authentic cinema clapperboard / production slate.
  - Tagline: *“Looking for a fresh edit? Let’s make something worth watching.”*
  - Transparent terms explaining introductory rates, clear scope and turnaround agreements, and optional portfolio display permissions.
- **Film Journal About Section**:
  - Authentic narrative: *“I’m building my craft one thoughtful cut at a time.”*
  - Software suite badges (Premiere Pro, DaVinci Resolve, CapCut, After Effects).
  - 3-step collaborative assembly workflow.
- **Contact & Call Sheet**:
  - Heading: *“Every great video starts with a story. What’s yours?”*
  - One-click **Copy Email** button with instant visual feedback.
  - Social media pills for YouTube, Instagram, GitHub, LinkedIn, and X.
  - Fully interactive project inquiry form.

---

## 📁 File Structure

```text
project1/
├── index.html                   # Main semantic portfolio with editable sections
├── README.md                    # Customization & deployment documentation
├── .gitignore                   # Standard OS & editor exclusions
├── css/
│   └── style.css                # Cinematic film journal styles & CSS tokens
├── js/
│   ├── swarm.js                 # Swarm Cursors snapshotter, flocking physics & sound engine
│   └── main.js                  # Timeline scrubber, timecode, modal, filters, copy button, swarm triggers
├── swarm-rebuild/               # Full Chrome Extension (Manifest V3)
│   ├── manifest.json            # Extension configuration
│   ├── background.js            # Service worker & toolbar injection
│   ├── swarm.js                 # Extension content script
│   ├── autoplay.js              # Optional auto-play script
│   ├── options.html & .js       # Extension options
│   └── icons/                   # Chrome extension icons
├── demo/
│   └── index.html               # Swarm Cursors edge-case test page
├── media/                       # Swarm Cursors video demos & graphics
└── assets/
    ├── portrait.jpg             # Puneeth's editorial portrait photo (used in Hero)
    ├── favicon.svg              # Custom film reel favicon
    ├── placeholder-reel.svg     # Showreel preview thumbnail
    ├── placeholder-social.svg   # 9:16 vertical hook thumbnail
    ├── placeholder-travel.svg   # Speed ramp montage thumbnail
    ├── placeholder-vlog.svg     # YouTube vlog storytelling thumbnail
    ├── placeholder-event.svg    # Event recap montage thumbnail
    └── placeholder-talking-head.svg # Talking head / tutorial clean-up thumbnail
```

---

## ⚡ Using Swarm Cursors as a Chrome Extension

In addition to being embedded directly on Puneeth's portfolio website, the complete Chrome extension is included in the `swarm-rebuild/` directory:

1. Open Chrome and navigate to `chrome://extensions`.
2. Turn on **Developer mode** (top right toggle).
3. Click **Load unpacked** and select the `swarm-rebuild/` folder inside this project.
4. Pin the extension to your toolbar.
5. Press **`Alt+Shift+S`** or click the extension icon on any website to watch the cursors rebuild that site!

---

## 🛠️ Step-by-Step Customization Guide

### 1. Replacing or Updating Your Portrait
- Your photo is saved at:
  ```text
  assets/portrait.jpg
  ```
- To update it in the future, simply drop your new photo into `assets/` andn ame it `portrait.jpg` (or update the `src` attribute in `index.html` under `<div class="portrait-media-wrap">`).

### 2. Replacing Project Videos with Real Footage
In `index.html`, locate `<section id="selected-work">`. Each project card has data attributes:

```html
<article class="project-card" 
         data-category="social"
         data-id="card-1"
         data-title="Your Custom Video Title"
         data-category-label="Short-Form"
         data-notes="Cut notes, pacing, sound effects"
         data-video-url="https://www.youtube.com/embed/YOUR_VIDEO_ID">
```

- **YouTube**: Use the embed format `https://www.youtube.com/embed/VIDEO_ID`
- **Vimeo**: Use `https://player.vimeo.com/video/VIDEO_ID`
- **Direct MP4**: Use `videos/my-video.mp4`

### 3. Updating Social Links & Email
In `index.html` under `<section id="contact">`:
- Email is set to `puneethsgowda17@gmail.com`.
- Update the social links for YouTube, Instagram, LinkedIn, and X with your usernames.

### 4. Customizing the "First Collaborations" Offer
In `index.html` under `<section id="first-collaborations">`, you can adjust the introductory rate notes, delivery turnaround expectations, or specific project terms anytime.

### 5. Hover Video Previews on Project Cards
Each project card now supports optional live video previews when hovered or focused:
- You can add `data-preview-video="path/to/preview.mp4"` to any `<article class="project-card">`, or insert a source inside the card's `<video class="card-hover-video">`.
- Videos play strictly **muted** and stop / rewind automatically when the mouse or focus leaves.
- On touchscreens (mobile/tablet), cards remain tap-friendly without hover conflicts.

---

## 🎞️ Built-in Animations & Motion Details

1. **Hero Entrance**: Non-blocking staged entrance under 1.0s. Reveals the hero portrait frame first, followed by the director title and bio, then CTA buttons.
2. **Scroll Reveals**: Sections, headers, and project cards fade in and float up smoothly via `IntersectionObserver`. Content remains 100% visible if JavaScript is disabled.
3. **Portrait Motion**: Gentle GPU-accelerated slow zoom (1.000 to 1.055) and vertical parallax inside an `overflow: hidden` frame to prevent layout shift.
4. **Project Card Hover**: Cards elevate by 8px, thumbnail photos scale and brighten (`brightness: 1.12`), and play discs expand.
5. **Editing Playhead**: A thin NLE timeline ribbon above the Selected Work contact sheet that tracks scroll progress with a moving needle, progress fill, and live `00:MM:SS:FF` timecode.
6. **Scroll Cue**: Subtle floating loop animation with an interactive click handler that smoothly scrolls into the work section.
7. **Accessibility (`prefers-reduced-motion`)**: Fully respects reduced motion by disabling parallax, looping animations, and scroll offsets while displaying all content immediately.

---

## 🚀 Local Preview

Double-click `index.html` to open it in Chrome, Edge, Safari, or any web browser.

---

## 🌐 Deploy to GitHub Pages

1. Open **GitHub Desktop** (or terminal) pointing to this folder.
2. Commit the redesign changes:
   ```bash
   git add .
   git commit -m "feat: redesign into creative cinematic film-journal portfolio"
   git push origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages**
   - Source: **Deploy from a branch**
   - Branch: **`main`** / Folder: **`/ (root)`**
   - Click **Save**
4. Your site will be live at:
   `https://puneeth-002.github.io/project1/`
