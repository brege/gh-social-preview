---
cli_help: >
  Plugin: gh-social-preview

  Description: GitHub social preview card generator displaying my name
  in a centered monospace font.

  Features:
    - Generates a 1200x630px social preview card.
    - Displays my name "wyatt brege" centered in a monospace font.

  Example Usage:
    oshea convert gh-social-preview-example.md --plugin gh-social-preview
---

# GitHub Social Preview Plugin (`gh-social-preview`)

This plugin generates a clean social preview card displaying "wyatt brege"
centered on a ribbon background in a monospace font. The ribbon background
is generated from aperiodic tiling following the
[silver ratio](https://en.wikipedia.org/wiki/Silver_ratio)
in the blue-green spectrum of the
[gruvbox](https://github.com/morhetz/gruvbox)
color palette.

## Features

- Standard OpenGraph preview dimensions (1200x630px)
- Centered, monospace typography
- Minimal styling
- Grub

## Configuration

**Location:** `gh-social-preview/`

The plugin automatically renders "wyatt brege" regardless of markdown input content. Edit in the frontmatter to change.

## Installation

```bash
git clone https://github.com/brege/gh-social-preview.git
```

## Usage

### Generate the main card

```bash
oshea convert gh-social-preview/gh-social-preview-example.md --filename card.pdf -o .
```

This generates a PDF card with dimensions 1200x630px using the blue and green color palette.

<img src="img/card.png" width="100%" height="100%">

### Generate the GitHub profile banner

After generating the card, convert it to PNG and extract the center 30%:

```bash
magick card.pdf -gravity center -crop 100%x30%+0+0 +repage banner.png
```
This is the banner image in [brege/brege/README.md](https://github.com/brege/brege/blob/main/README.md).

<img src="img/banner.png" width="100%" height="100%">

## Requirements

- [**oshea**](https://github.com/brege/oshea): Markdown to PDF converter
- **ImageMagick**: Required *if* also generating the GitHub profile banner
