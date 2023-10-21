# code-cloze
A prototype for practicing coding using [cloze deletion](https://en.wikipedia.org/wiki/Cloze_test) on both mobile and desktop platforms.

Experience it yourself here: [Code Cloze Demo](https://chan-w.github.io/code-cloze-demo-gh-pages/)

## Creating Clozes
- Cloze deletions are created as `{{group_id::hidden_text}}`, where group_id is a string.
    - Please limit the length of a single cloze deletion to 1 line. Instead of multiline cloze deletions, create a cloze deletion on each line with the same `group_id`. 
- Hidden clozes are displayed to the user as `[... group_id ...]`. 
- When the user reveals a cloze, all clozes with the same group_id are revealed.
- For examples, see https://github.com/chan-w/code-cloze/blob/85c2afd482bb5b6c621a9eb7b3695dcc2492d310/src/binary-search-examples.ts#L6


## Development
This project uses CodeMirror 6, Vite.js, and TypeScript.

### Overview
- `src/cloze-editor.ts`: Implementation of CodeMirror plugin for cloze functionality
- `src/binary-search-examples.ts`: Example usages of CodeMirror plugin
    - https://github.com/chan-w/code-cloze/blob/85c2afd482bb5b6c621a9eb7b3695dcc2492d310/src/binary-search-examples.ts#L6
- `src/large-file-example.ts`: Example with a larger file

### Prerequisites
Make sure you have npm installed on your system. If not, refer to this [guide.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Project Setup and Running
Follow these steps to setup the project on your local system:

1. Install project dependencies:
    ```
    npm install
    ```

2. Start the Development Server: 
    ```
    npm run dev
    ```

3. Build for Production: 
    ```
    npm run build
    npm run preview
    ```
