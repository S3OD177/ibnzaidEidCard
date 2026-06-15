# Fonts Used in ibnzaidEidCard Project

This document provides a comprehensive list of all fonts used in the ibnzaidEidCard project.

## Primary Font

### Almarai
- **Source:** Google Fonts
- **Link:** `https://fonts.googleapis.com/css2?family=Almarai&display=swap`
- **Type:** Arabic sans-serif font
- **Usage:**
  - Main body font family across all pages
  - Used in CSS files (`style.css`, `EE/style.css`)
  - Used in canvas text rendering (`canvas.js`, `EE/canvas.js`)

#### Almarai Usage Locations:

1. **Main Page (index.html)**
   - Loaded via Google Fonts link in `<head>` (line 11)
   - Applied to body via `style.css` (line 4): `font-family: 'Almarai', sans-serif;`
   - Used in canvas rendering at `canvas.js` (line 32): `context.font = '115px Almarai';`

2. **EE Page (EE/index.html)**
   - Loaded via Google Fonts link in `<head>` (line 22)
   - Applied to body via inline styles (line 37): `font-family: 'Almarai'`
   - Used in canvas rendering at `EE/canvas.js` (line 72): `ctx.font = '35px Almarai';`

## Secondary Font

### AlTarikh
- **Type:** Custom Arabic font (used via imgix service)
- **Usage:**
  - Used for text rendering on card images via imgix API parameters
  - Specified in `js/ee.js` (line 158): `'txt-font': 'AlTarikh'`
  - This font is applied when generating greeting card images through the imgix service

## Font Loading Method

The project uses the following method to load fonts:

1. **Google Fonts:** Almarai is loaded directly from Google Fonts CDN
2. **Web Font Loader:** The EE page includes Google's Web Font Loader library (line 265 in `EE/index.html`)
   - `https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js`

## Additional Font Assets

### MaterialDesign Icons Webfont
- **Source:** CDN
- **Link:** `https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/4.9.95/css/materialdesignicons.css`
- **Usage:** Icon font for social media icons and UI elements
- **Location:** EE/index.html (line 189)

## Summary

- **Primary Font:** **Almarai** (Arabic sans-serif from Google Fonts)
- **Secondary Font:** **AlTarikh** (Arabic font via imgix service)
- **Icon Font:** **MaterialDesign Icons Webfont**

The Almarai font is the main font used throughout the application for all UI elements, text inputs, and canvas-based text rendering. AlTarikh is used specifically for greeting card text overlays when generating downloadable images.
