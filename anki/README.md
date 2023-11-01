# Anki Integration: Code Cloze Deletion 
This integration provides cloze deletion functionality for formatted code in Anki flashcards using CodeMirror 6. The current implementation supports syntax highlighting for Python and can be extended to other languages using CodeMirror 6 [language extensions](https://codemirror.net/#languages).

## Anki Supported Version 
These templates are compatible with Anki Version 2.1.66. Please note that we rely on JavaScript, which [isn't officially supported](https://docs.ankiweb.net/templates/styling.html#javascript) by Anki. This may cause challenges in compatibility with future Anki releases.

## How it Works
We use the Vite.js production build and additional helper functions to display the front and back of the Anki flashcards. 

- `anki-front.html`: Front template of the card; the helper functions remove any HTML encoding present. 
- `anki-back.html`: Back template of the card; the helper functions are used to remove both HTML encoding and cloze syntax. 

## Usage
### Note Type Setup
1. Clone the Basic note type.

2. Navigate to the "Card Types" for the new note type. Use `anki-front.html` as the Front Template and `anki-back.html` as the Back Template.

    - In the Styling section, remove all CSS except for the desired background color:

```
.card {
 background-color: white;
}
```

3. Go to "Fields" and remove the Back field.

### Creating Cards
1. Create a card with new note type from [Note Type Setup](#note-type-setup)
2. In the Front field, enter a program with at least 1 cloze
   - Cloze deletions are created as `{{group_id::hidden_text}}`, where group_id is a string.
   - When the user reveals a cloze, all clozes with the same group_id are revealed.
3. Try reiewing the card 


## Limitations
Currently, syntax highlighting for each language requires a distinct note type that uses a distinct Vite.js build. The build used in `anki-front.html` and `anki-back.html` only supports syntax highlighting for Python.
