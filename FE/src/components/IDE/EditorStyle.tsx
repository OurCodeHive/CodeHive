import { EditorView } from 'codemirror';
import { HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import styled from "styled-components";

export const codeEditTheme = EditorView.theme(
  {
    '&': {
      fontSize:"13px",
      height: "100%",
      color: "#ffffff",
      backgroundColor: '#222326'
    },

    '.cm-content': { 
      caretColor: '#ffcc00'
    },

    '.cm-scroller::-webkit-scrollbar': {
      width: "10px",
    },
    '.cm-scroller::-webkit-scrollbar-thumb': {
      backgroundColor: "#2f3542",
      borderRadius: "10px",
      backgroundClip: "padding-box",
      border: "2px solid transparent"
    },
    
    '.cm-scroller::-webkit-scrollbar-track': {
      backgroundColor: "grey",
      borderRadius: "10px",
      boxShadow: "inset 0px 0px 5px white",
    },
    
    '&.cm-focused .cm-cursor': { borderLeftColor: '#ffcc00' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: 'rgba(128, 203, 196, 0.2)' },
    '.cm-panels': { backgroundColor: '#1e1f27', color:"#ffffff" },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff'
    },
    '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: '#6199ff2f'},
    '.cm-activeLine': { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
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
      background: '#222326',
      color: '#676e95',
      border: 'none'
    },
    '.cm-activeLineGutter': { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: '#353a42'
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: '#353a42',
      borderBottomColor: '#353a42'
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: '#abb2bf'
      }
    },
  },
  { dark: true }
);


export const highlightStyle = HighlightStyle.define([
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


export const QuillBox = styled.div`

.ql-picker-label {
  color:#A18DC6;
}

.ql-editor::-webkit-scrollbar {
  width: 10px;
}
.ql-editor::-webkit-scrollbar-thumb {
  background-color: #2f3542;
  border-radius: 10px;
  background-clip: padding-box;
  border: 2px solid transparent;
}
.ql-editor::-webkit-scrollbar-track {
  background-color: grey;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}

.ql-toolbar.ql-snow {
  border-radius: 5px 5px 0px 0px;
  border: 0px;
}
.ql-container.ql-snow {
  border-radius: 0 0 5px 5px;
  border: 0px;
  color:#A18DC6;
}
.ql-editor strong {
  font-weight: bold;
  color:#A18DC6;
}
.q1-cursor {
  opacity: 1 !important;
  visibility: visible !important;
}
.ql-cursor-flag {
  visibility: visible !important;
  opacity: 1 !important;
}
.show-flag {
}
.ql-editor {
  height: 95vh;
  font-size:15px;
  color:#A18DC6;
}
h1{
  color:#A18DC6;
}
`;



export const modulesRef = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
    ],
    ["link", "image"],
  ],
  cursors: {
    transformOnTextChange: true,
    hide: false,
    selectionChangeSource: null,
  },
  history: {
    userOnly: true,
  },
};