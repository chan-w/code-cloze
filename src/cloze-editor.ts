import { EditorState } from '@codemirror/state';
import { minimalSetup, basicSetup } from "codemirror";
import { Decoration, EditorView, ViewUpdate, ViewPlugin, DecorationSet, WidgetType } from "@codemirror/view"
import { javascript } from '@codemirror/lang-javascript';

class ClozeWidget extends WidgetType {
  private revealed: boolean;
  private clozeContent: string;
  
  constructor(readonly start: number, readonly end: number, content: string) {
    super(); 
    this.revealed = false;
    this.clozeContent = content
  }

  eq(other: ClozeWidget) { return other.start === this.start && other.end === this.end }

  toDOM() {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cb";
    wrap.style.display = "inline-flex";
    wrap.style.alignItems = "center";
  
    const clozeP = `[...]`;
    let cloze = wrap.appendChild(document.createElement("p"));
    cloze.innerText = this.revealed ? this.clozeContent : clozeP;
    cloze.style.margin = "0";
    cloze.style.display = "inline";
  
    let toggleButton = wrap.appendChild(document.createElement("button"));
    toggleButton.innerText = this.revealed ? "Hide Answer" : "Show Answer";
    toggleButton.style.marginLeft = "5px";
    toggleButton.addEventListener("click", () => {
      this.revealed = !this.revealed;
      cloze.innerText = this.revealed ? this.clozeContent : clozeP;
      toggleButton.innerText = this.revealed ? "Hide Answer" : "Show Answer";
    });
  
    return wrap;
  }

  ignoreEvent() { return false }
}

const getClozePositions = (content: string): Array<{ from: number, to: number }> => {
  const regex = /\{\{[^}]+\}\}/g;
  let match;
  const clozePositions = [];

  while ((match = regex.exec(content)) !== null) {
    clozePositions.push({ from: match.index, to: match.index + match[0].length });
  }

  return clozePositions;
};

const getClozeDecorations = (state: EditorState): any => {
  const widgets: any[] = [];
  const clozePositions = getClozePositions(state.doc.toString());
  const docContent = state.doc.toString();

  for (const { from, to } of clozePositions) {
    let deco = Decoration.replace({
        widget: new ClozeWidget(from, to, docContent.slice(from, to)),
        side: 1
    })
    widgets.push(deco.range(from, to))
  }

  return Decoration.set(widgets);
};


const clozePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = getClozeDecorations(view.state)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet)
      this.decorations = getClozeDecorations(update.view.state)
  }
}, {
  decorations: v => v.decorations
})

const noEdit = EditorView.editable.of(false)

const view_1 = new EditorView({
  doc: `const y = {{true}} // comment \nconst x = {{true}}\nconst z = x && y // z true`,
  extensions: [basicSetup, clozePlugin, javascript(), noEdit, EditorView.lineWrapping],
  parent: document.getElementById("js-demo-1")
});