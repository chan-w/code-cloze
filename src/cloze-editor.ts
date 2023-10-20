import { StateField, EditorState, StateEffect } from "@codemirror/state";
import { Decoration, EditorView, DecorationSet, WidgetType } from "@codemirror/view"

const toggleClozeEffect = StateEffect.define<{ groupId: string, revealed: boolean }>()

interface DecorationSetMap extends DecorationSet {
  clozeStateMap: Map<string, boolean>;
}
export const revealedClozeGroups = StateField.define<DecorationSetMap>({
  create: (state) => {
    const parseResults = getClozeDecorationsState(state)
    const decSet = parseResults.clozeDecorationSet
    const map = new Map<string, boolean>(parseResults.clozePositions.map((x: { groupId: any; }) => [x.groupId, false]))
    decSet.clozeStateMap = map
    return decSet
  },
  update(value, tr) {
    value = (value.map(tr.changes)) as DecorationSetMap;
    // Update cloze state map
    if (tr.effects.length > 0) {
      let clozeStateMap = value.clozeStateMap;
      for (let e of tr.effects) if (e.is(toggleClozeEffect)) {
        const toggledGroupId = e.value.groupId;
        const toggleRevealed = e.value.revealed;
        clozeStateMap = clozeStateMap.set(toggledGroupId, clozeStateMap.has(toggledGroupId) ? !clozeStateMap.get(toggledGroupId) : toggleRevealed)
      }
      // Redraw all widgets
      const nextDecSet = (updateDecorationsState(tr.state, clozeStateMap)) as DecorationSetMap
      nextDecSet.clozeStateMap = clozeStateMap
      return nextDecSet;
    }
    return value;
  },
  provide: f => EditorView.decorations.from(f)
})

export const clozePlugin = revealedClozeGroups

class ClozeWidget extends WidgetType {
  private revealed: boolean;
  private clozeContent: string;
  public groupId: string;
  public clozeP;

  constructor(readonly start: number, readonly end: number, content: string, groupId: string, revealed: boolean) {
    super();
    this.clozeContent = content;
    this.groupId = groupId;
    this.revealed = revealed;
    this.clozeP = `[... ${this.groupId} ...]`
  }

  toDOM(view: EditorView) {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cb";
    wrap.style.display = "inline-flex";
    wrap.style.alignItems = "center";
    wrap.style.border = "1px solid #ccc";
    wrap.style.padding = "5px";
    wrap.style.borderRadius = "5px";
    // wrap.style.minWidth = "48px"; // Minimum width for mobile hit target
    // wrap.style.minHeight = "48px"; // Minimum height for mobile hit target
    wrap.setAttribute("tabindex", "0");
    wrap.setAttribute("role", "button");

    let cloze = wrap.appendChild(document.createElement("p"));
    cloze.innerText = this.revealed ? this.clozeContent : this.clozeP;
    cloze.style.margin = "0";
    cloze.style.display = "inline";
    // cloze.style.overflow = "auto"; // If text is too long, a scrollbar is generated 

    wrap.addEventListener("click", () => {
      // Trigger toggleClozeEffect
      view.dispatch({
        effects: toggleClozeEffect.of({ groupId: this.groupId, revealed: !this.revealed })
      });
    });

    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

// groupId required
const getClozePositions = (content: string): Array<{ from: number, to: number, groupId: string, content: string }> => {
  const regex = /\{\{(.*?)::([^}]+)\}\}/g;
  let match;
  const clozePositions = [];

  while ((match = regex.exec(content)) !== null) {
    let [, groupId, clozeContent] = match;
    clozePositions.push({ from: match.index, to: match.index + match[0].length, groupId: groupId, content: clozeContent });
  }

  return clozePositions;
};

const getClozeDecorationsState = (state: EditorState,): any => {
  const widgets: any[] = [];
  const clozePositions = getClozePositions(state.doc.toString());
  const docContent = state.doc.toString();

  for (const { from, to, groupId, } of clozePositions) {
    let deco = Decoration.replace({
      widget: new ClozeWidget(from, to, docContent.slice(from + 2 + groupId.length + 4, to - 2), groupId, false),
      side: 1
    });
    widgets.push(deco.range(from, to));
  }
  return { clozeDecorationSet: Decoration.set(widgets), clozePositions: clozePositions }
};

const updateDecorationsState = (state: EditorState, clozeStateMap: Map<string, boolean>,): DecorationSet => {
  const widgets: any[] = [];
  const clozePositions = getClozePositions(state.doc.toString());
  const docContent = state.doc.toString();

  for (const { from, to, groupId, } of clozePositions) {
    let deco = Decoration.replace({
      widget: new ClozeWidget(from, to, docContent.slice(from + 2 + groupId.length + 2, to - 2), groupId, clozeStateMap.has(groupId) ? (clozeStateMap.get(groupId) === true) : false), // equality check with true to fix ts2345
      side: 1
    });
    widgets.push(deco.range(from, to));
  }

  return Decoration.set(widgets)
}

// new EditorView({
//   doc: `const y = {{b::true}} // comment
// const x = {{b::Array(5).fill('e').every(e => e === 'e')}}
// const z = x {{c::&&}} y // z true`,
//   extensions: [basicSetup, javascript(), revealedClozeGroups, EditorView.editable.of(false)],
//   parent: document.getElementById("js-demo-1")!
// });
