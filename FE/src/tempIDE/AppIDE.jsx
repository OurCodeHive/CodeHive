import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import * as Y from "yjs";
import { WebsocketProvider } from 'y-websocket'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { useEffect, useRef } from 'react';
import './Editor.css';
import { tags as t } from '@lezer/highlight';
import { useParams } from 'react-router-dom';

function getRandomColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
const ivory = '#abb2bf',
      white = "#ffffff",
      darkBackground = '#1e1f27',
      highlightBackground = 'rgba(0, 0, 0, 0.3)',
      background = '#222326',
      tooltipBackground = '#353a42',
      selection = 'rgba(128, 203, 196, 0.2)',
      cursor = '#ffcc00';

const materialPalenightTheme = EditorView.theme(
  {
    '&': {
      height: "100%",
      color: white,
      backgroundColor: background
    },
    '.cm-content': { caretColor: cursor },
    '&.cm-focused .cm-cursor': { borderLeftColor: cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: selection },
    '.cm-panels': { backgroundColor: darkBackground, color: white },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff'
    },
    '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: '#6199ff2f'},
    '.cm-activeLine': { backgroundColor: highlightBackground },
    '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b'
    },
    '.cm-ySelectionInfo': {
      paddingLeft: '3px',
      paddingRight: '3px',
      position: "absolute",
      top: "-1.25em",
      left: "-1px",
      fontSize: ".675em",
      fontFamily: "Pretendard",
      fontStyle: "normal",
      fontWeight: "bold",
      lineHeight: "normal",
      userSelect: "none",
      color: "white",
      zIndex: "99999999999999 !important",
      transition: "opacity .3s ease-in-out",
      backgroundColor: "inherit",
      borderRadius: "4px",
      opacity: "1",
      transitionDelay: "0s",
    },
    '.cm-gutters': {
      background: background,
      color: '#676e95',
      border: 'none'
    },
    '.cm-activeLineGutter': { backgroundColor: highlightBackground },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltipBackground
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: ivory
      }
    },
  },
  { dark: true }
);
const materialPalenightHighlightStyle = HighlightStyle.define([
  { tag: t.name, color: '#f3f3f3' },
  { tag: t.comment, color: '#6272a4' },
  { tag: t.string, color: '#f1fa8c' },
  { tag: t.atom, color: '#bd93f9' },
  { tag: t.meta, color: '#f8f8f2' },
  { tag: [t.keyword, t.operator, t.tagName], color: '#ff79c6' },
  { tag: [t.function(t.propertyName), t.propertyName], color: '#66d9ef' },
  { tag: [t.definition(t.variableName), t.function(t.variableName), t.className, t.attributeName], color: '#50fa7b' },
  { tag: t.atom, color: '#bd93f9' },
]);


function Code() {
  
  const editorRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider("ws://13.124.222.148:5000/", id, doc);
    const ytext = doc.getText('codemirror');
    provider.awareness.setLocalStateField('user', {
      name: sessionStorage.getItem("loginUser"),
      color: getRandomColor(),
      colorLight: "#8acb8833",
    });
    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        keymap.of([...yUndoManagerKeymap]),
        basicSetup,
        python(),
        materialPalenightTheme,
        keymap.of([indentWithTab]),
        syntaxHighlighting(materialPalenightHighlightStyle),
        yCollab(ytext, provider.awareness),
      ],
    });
    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    return () => {
      view.destroy();
    }

  }, [])
  return(
    <>
      <textarea className='doc-editor'></textarea>
      <div className="code-editor" ref={editorRef}>
      </div>
    </>
  )
}

export default Code;