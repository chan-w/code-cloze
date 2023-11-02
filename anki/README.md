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

   - Tools > Manage Note Types > Add > Clone: Basic > Ok
     
      - ![anki_clone_basic_note_type](https://github.com/chan-w/code-cloze/assets/40780153/e3f4dd44-5ede-432e-a720-bd9b2ad29b4c)

   - Name the new note type
     
      - ![anki_name_note_type](https://github.com/chan-w/code-cloze/assets/40780153/a0cd0f0b-28f3-499f-b727-379e0d943ffa)


2. In the "Front Template" section of the new note type, use `anki-front.html`. In the "Back Template" section of the new note type use `anki-back.html`.

   - Tools > Manage Note Types > (New Note Type from 1) > Cards
     - ![anki_note_type_cards](https://github.com/chan-w/code-cloze/assets/40780153/b117fded-babe-42af-8cf9-432ee88515fc)

 


3. In the "Styling" section of the new note type, remove all CSS except for the background color:

```
.card {
 background-color: white;
}
```

   - "Front Template", "Back Template", and "Styling" sections of completed card
      - Front Template
         - ![anki_note_type_front](https://github.com/chan-w/code-cloze/assets/40780153/ac2fd753-14e3-4cda-ac4d-fc9c21e090fb)
      - Back Template
         - ![anki_note_type_back](https://github.com/chan-w/code-cloze/assets/40780153/f2de6323-3640-4cb9-922d-35aa80271b72)
      - Styling
         - ![anki_note_type_styling](https://github.com/chan-w/code-cloze/assets/40780153/78ba5091-e7b7-4142-a55e-53b12c8372ff)


4. Go to "Fields" and remove the Back field.

### Creating Cards
1. Create a new note with the note type from [Note Type Setup](#note-type-setup)
2. In the Front field, enter a program with at least 1 cloze
   - Cloze deletions are created as `{{group_id::hidden_text}}`, where group_id is a string.
   - When the user reveals a cloze, all clozes with the same group_id are revealed.
   - For example, this program contains 3 cloze groups:
     
```python
def search_first(arr, target):
    """search_first([1, 2, 2, 2, 3], 2) => 1"""
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if target == arr[mid]:
            {{a1::result = mid}}
            {{a1::right = mid - 1}}
        elif target < arr[mid]:
            {{a2::right = mid - 1}}
        else:
            {{a3::left = mid + 1}}
    return result
```

3. Try reiewing the card 


## Limitations
Currently, syntax highlighting for each language requires a distinct note type that uses a distinct Vite.js build. The build used in `anki-front.html` and `anki-back.html` only supports syntax highlighting for Python.
