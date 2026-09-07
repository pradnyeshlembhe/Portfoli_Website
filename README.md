# Pradnyesh Lembhe - Portfolio

This is a responsive, mobile-first personal portfolio website built with HTML, Tailwind CSS, and vanilla JavaScript.

## Features
- Fully responsive design using Tailwind CSS
- Dynamic project loading from `projects.json`
- Smooth scrolling and scroll animations
- Accessible semantic HTML

## How to Run Locally

Since this project fetches data from a local `projects.json` file, it needs to be served via a local web server to avoid CORS issues in the browser (you cannot simply open `index.html` from the file system).

### Using Python
If you have Python installed, you can quickly spin up a server:
1. Open your terminal in this directory.
2. Run:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Using Node.js
If you prefer Node.js and have `npx` installed:
```bash
npx serve .
```

## Customization
- **Projects**: Edit `projects.json` to add or modify projects.
- **Styling**: Tailored with Tailwind CSS via CDN for quick customization. Custom colors are defined in the `<script>` block in `index.html`.
- **Scripts**: Logic for dynamic content and interactions is in `script.js`.
