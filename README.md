# Sudhanshu Yadav — Portfolio

A responsive one-page portfolio built with HTML, CSS, JavaScript, Three.js, and GSAP ScrollTrigger. The hero's 3D neural sphere can be dragged with the mouse to rotate it; scrolling the wheel over the sphere adjusts its spin speed and direction. Sections use gentle scroll snapping and scroll-linked reveals.

## Run locally

Serve this folder over a local web server so JavaScript modules work. From this folder run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Resume

The `View resume` link opens a browser preview of `assets/Sudhanshu_Yadav_SDE_Resume.pdf`. Visitors can read it in the page, open the PDF in another tab, or download it. A downloaded PDF can be viewed offline.

## Publish with GitHub Pages

Create a repository named `sudhanshu2049.github.io`, upload the contents of this folder to its root, then enable GitHub Pages in the repository settings using the `main` branch.

## Before publishing

- Check that every project description matches the current repository and that the dashboard data attribution is correct.
- The 3D scene and scroll reveals respect the visitor's reduced-motion preference; portfolio content remains available without animations.
