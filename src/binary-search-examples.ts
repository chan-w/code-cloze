import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view"
import { python } from '@codemirror/lang-python';
import clozePlugin  from './cloze-editor';

new EditorView({
    doc: `def search_any(arr, target):
    """search_any([1, 2, 2, 2, 3], 2) => 2"""
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if target == arr[mid]:
            {{result = mid}}
            {{break}}
        elif target < arr[mid]:
            {{right = mid - 1}}
        else:
            {{left = mid + 1}}
    return result
    `,
    extensions: [basicSetup, clozePlugin, python(), EditorView.editable.of(false), EditorView.lineWrapping],
    parent: document.getElementById("bsearch-any")!
  });

  new EditorView({
    doc:  `def search_first(arr, target):
    """search_first([1, 2, 2, 2, 3], 2) => 1"""
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if target == arr[mid]:
            {{result = mid}}
            {{right = mid - 1}}
        elif target < arr[mid]:
            {{right = mid - 1}}
        else:
            {{left = mid + 1}}
    return result
    `,
    extensions: [basicSetup, clozePlugin, python(), EditorView.editable.of(false), EditorView.lineWrapping],
    parent: document.getElementById("bsearch-first")!
  });

new EditorView({
    doc:  `def search_last(arr, target):
    """search_last([1, 2, 2, 2, 3], 2) => 3"""
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if target == arr[mid]:
            {{result = mid}}
            {{left = mid + 1}}
        elif target < arr[mid]:
            {{right = mid - 1}}
        else:
            {{left = mid + 1}}
    return result
    `,
    extensions: [basicSetup, clozePlugin, python(), EditorView.editable.of(false), EditorView.lineWrapping],
    parent: document.getElementById("bsearch-last")!
  });