# Anki Integration
We include a basic implementation of an Anki integration.

## Limitations
- JavaScript is not supported officially supported by Anki and [may break](https://docs.ankiweb.net/templates/styling.html#javascript) in a future Anki version
    - We use Anki Version 2.1.66
- A new type of note is needed for syntax highlighting for each language in this implementation. The current version only highlights Python files.

## Overview
- We use the output of the production build and add helper functions to modify the display of the front and back of the card
- `anki-front.html`: A template for the front of a card. Helper functions remove HTML encoding.
- `anki-back.html`: A template for the back of a card. Helper functions remove HTML encoding and cloze syntax.

## Usage
1. Create a new note type as a clone of Basic
2. In "Card Types" for your new type of note, use `anki-front.html` as the Front Template and `anki-back.html` as the Back Template.
- In Styling, remove any CSS except for background color

```
.card {
 background-color: white;
}
```

3. In "Fields", remove the Back field