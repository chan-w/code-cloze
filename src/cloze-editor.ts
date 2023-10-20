import { EditorState } from '@codemirror/state';
import { basicSetup } from "codemirror";
import { Decoration, EditorView, ViewUpdate, ViewPlugin, DecorationSet, WidgetType } from "@codemirror/view"

class ClozeWidget extends WidgetType {
  constructor(readonly start: number, readonly end: number) { super() }

  eq(other: ClozeWidget) { return other.start === this.start && other.end === this.end }

  toDOM() {
      let wrap = document.createElement("span")
      wrap.setAttribute("aria-hidden", "true")
      wrap.className = "cm-boolean-toggle"
      let cloze = wrap.appendChild(document.createElement("p"))
      cloze.innerText = `[${this.start} ... ${this.end}]`
      return wrap
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

  for (const { from, to } of clozePositions) {
    let deco = Decoration.replace({
      widget: new ClozeWidget(from, to),
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
    if (update.docChanged || update.viewportChanged)
      this.decorations = getClozeDecorations(update.view.state)
  }
}, {
  decorations: v => v.decorations
})

const view = new EditorView({
    doc: `Sample text with a {{cloze deletion}}.\nAnother {{cloze}} deletion`,
    extensions: [basicSetup, clozePlugin],
    parent: document.body
  });