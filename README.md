# code-cloze
A prototype of [cloze deletion](https://en.wikipedia.org/wiki/Cloze_test) for code on mobile and desktop.

Try it here: https://chan-w.github.io/code-cloze-demo-gh-pages/

## Development
We use <!--[-->CodeMirror 6<!--](https://codemirror.net/)--> and <!--[-->Vite.js<!--](https://vitejs.dev/)--> with TypeScript.

### Notes
- Cloze functionality implemented in `src/cloze-editor.ts`
- Examples in:
  - `src/binary-search-examples.ts`
    - https://github.com/chan-w/code-cloze/blob/48e25a3db9e7c03bc0e738bcc9a7a5ea642dcfe6/src/binary-search-examples.ts#L6
  - `src/large-file-example.ts`

### Setup
1. Install dependencies
   
```
npm i
```

2. Dev Server
   
```
npm run dev
```

3. Production Build
   
```
npm run build
npm run preview
```
