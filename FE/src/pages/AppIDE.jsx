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
import { tags as t } from '@lezer/highlight';
import { useParams } from 'react-router-dom';

import { QuillBinding } from "y-quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import styled from "styled-components";
import Quill from "quill";
import QuillCursors from "quill-cursors";

import saveButton from "@/components/IDE/downlode";

import VoiceComp from '@/components/voiceCall/VoiceCallComp';

function getRandomColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function presentTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = "0" + (date.getMonth()+1);
  var day = "0" + date.getDate();
  var hour = "0" + date.getHours();
  var minute = "0" + date.getMinutes();
  return String(year).substr(-2) + "-" + month.substr(-2) + "-" + day.substr(-2) + " ";
}

export let quillRef = null;

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

const MouseBox = styled.div`
  .ql-picker-label {
    color:#A18DC6;
  }
  .ql-toolbar.ql-snow {
    border-radius: 5px 5px 0px 0px;
    border: 0px;
  }
  .ql-container.ql-snow {
    border-radius: 0 0 5px 5px;
    border: 0px;
  }
  .ql-editor strong {
    font-weight: bold;
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
  }
`;

function Code() {
  
  const editorRef = useRef();
  let { id } = useParams();
  const codeId = id + "code";
  const docxId = id + "docx";
  const CodeDoc = new Y.Doc();
  const url = import.meta.env.VITE_YJS;

  let reactQuillRef = null;
  const docxDoc = new Y.Doc();
  Quill.register("modules/cursors", QuillCursors);


  useEffect(() => {
    const provider = new WebsocketProvider(url, codeId, CodeDoc);
    const ytext = CodeDoc.getText('codemirror');
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

  useEffect(() => {
    attachQuillRefs();
    const provider = new WebsocketProvider(url, docxId, docxDoc);
    const ytext = docxDoc.getText("quill");
    
    provider.awareness.on('change', changes => {
      Array.from(provider.awareness.getStates().values());
    });

    provider.awareness.setLocalStateField("user", {
      name: "민성",
      color: getRandomColor(),
    });

    const binding = new QuillBinding(ytext, quillRef, provider.awareness);
    
  }, []);

  const attachQuillRefs = () => {
    if (typeof reactQuillRef.getEditor !== "function") return;
    quillRef = reactQuillRef.getEditor();
  };

  const modulesRef = {
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
      transformOnTextChange: true,
    },
    history: {
      userOnly: true,
    },
  };

  function saveMemo() {
    let ns = new XMLSerializer();
    let korean = `<meta charset="utf-8" />`;
    let targetString = ns.serializeToString(
      document.querySelector(".ql-editor")
    );
    // console.log(targetString);
    return korean + targetString;
  }
  function saveCode() {
    let name = window.prompt("저장할 이름을 입력해 주세요");
    // 현재 취소해도 다운받아짐;;
    let fileName = presentTime() + name + '.py';
    let output = CodeDoc.getText('codemirror');
    const element = document.createElement('a');
    const file = new Blob([output], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // FireFox
    element.click();
  }



  return(
    <>
      <button
        onClick={() => {
          saveButton(saveMemo(), "코드");
        }}
      >다운로드</button>
      <div>
        <VoiceComp mySessionId={codeId} myUserName={"민성"} />
      </div>
      <MouseBox
        style={{
          width: "25%",
          height: "93.2vh",
          color: "#A18DC6",
          backgroundColor: "#222326",
        }}
      >
        <ReactQuill
          style={{
            height: "85vh",
            backgroundColor: "#222326",
          }}
          ref={(el) => {
            reactQuillRef = el;
          }}
          modules={modulesRef}
          theme={"snow"}
        />
      </MouseBox>
      <div
        style={{
          height:"96.7vh",
          position: "absolute",
          width: "60%",
          top: "0px",
          left: "25%",
          height: "96vh",
        }}
      className="code-editor" ref={editorRef}>
      <button
        onClick={() => {
          saveCode()
        }}
      >소스 코드저장</button>
      </div>
    </>
  )
}

export default Code;