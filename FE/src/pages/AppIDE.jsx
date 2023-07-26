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

import VoiceComp from '@/components/voiceCall/VoiceCallComp';
// import JoinUserList from '@/components/voiceCall/JoinUserListComp';
import IDEHeader from '@/components/IDE/IDEHeader';
import IDETerminal from '@/components/IDE/IDETerminal';
import { useState } from "react";
import ChatComp from '@/components/chat/ChatFrameComp';

import style from "./AppIDE.module.css";

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
      fontSize:"13px",
      height: "100%",
      color: white,
      backgroundColor: background
    },

    '.cm-content': { 
      
      caretColor: cursor 
    },

    '.cm-content::-webkit-scrollbar': {
      width: "10px",
    },

    '.cm-content::-webkit-scrollbar-thumb': {
      backgroundColor: "#2f3542",
      borderRadius: "10px",
      backgroundClip: "padding-box",
      border: "2px solid transparent"
    },
    
    '.cm-content::-webkit-scrollbar-track': {
      backgroundColor: "grey",
      borderRadius: "10px",
      boxShadow: "inset 0px 0px 5px white",
    },
    
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

function Code() {
  
  const editorRef = useRef();
  let { id } = useParams();
  const codeId = id + "code";
  const docxId = id + "docx";
  let CodeDoc = new Y.Doc();
  const url = import.meta.env.VITE_YJS;

  let reactQuillRef = null;
  const docxDoc = new Y.Doc();
  Quill.register("modules/cursors", QuillCursors);

  let [language, setLanguage] = useState("Python");
  let [codeHeight, setCodeHeight] = useState("93.3vh");
  let [code, setCode] = useState("");
  let [showChat, setShowChat] = useState("hidden");

  useEffect(() => {
    const provider = new WebsocketProvider(url, codeId, CodeDoc);
    const ytext = CodeDoc.getText('codemirror');
    setCode(ytext);
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
  
  function saveCode() {
    let name = window.prompt("저장할 이름을 입력해 주세요");
    if (name === ""){
      return
    }
    if (name === null){
      return
    }
    let extension = ".py"
    if (language === "Java") {
      extension = ".java"
    }
    let fileName = presentTime() + name + extension;
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

  function toggleChat() {
    console.log(showChat);
    if (showChat === "hidden") {
      setShowChat("visible");
    } else {
      setShowChat("hidden");
    }
  }

  function consoleUp() {
    setCodeHeight("80vh");
  }

  function consoleDown() {
    setCodeHeight("93.3vh");
  }

  return(
    <div style={{
      backgroundColor:"#222326",
      height: "100vh",
    }}>
      <IDEHeader saveCode={saveCode} id={id}/>
      {/* <VoiceComp mySessionId={codeId} myUserName={"민성" + getRandomColor()} /> */}
      <div style={{ display:"flex" }}>
        <MouseBox 

          style={{
            width: "25%",
            height: "93.8vh",
            color: "#A18DC6",
            backgroundColor: "#222326",
            paddingBottom:"5px",
          }}
        >
          <ReactQuill
            className={style.container}
            style={{
              height: "87vh",
              paddingBottom:"5px",
            }}
            ref={(el) => { reactQuillRef = el; }}
            modules={modulesRef}
            theme={"snow"}
          />
        </MouseBox>
        <div
          style={{
            // position: "absolute",
            width: "60%",
            // top: "3.3vh",
            // left: "25%",
            height: codeHeight,
            paddingBottom:"70px",
          }}
        ref={editorRef}>
        <button
          style={{
            color:"wheat",
            backgroundColor:"#222326",
            border:"none"
          }}
          onClick={() => {
            if (language == "Python") {
              setLanguage("Java")
            } else {
              setLanguage("Python")
            }
          }}
        >{language}🔄</button>
        </div>
        <div style={{
          width:"15%",
          color:"GrayText",
          flexDiretion:"column",
          backgroundColor:"#222326"
        }}>
        {/* <JoinUserList/> */}
        </div>
      </div>
      <IDETerminal code={code} up={consoleUp} down={consoleDown} id={id}/>
      <img src='https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/chat.png'
        onClick={() => {
          toggleChat();
        }}
        style={{
          position: "absolute",
          zIndex:"2",
          right:"5vh",
          bottom:"4vh",
          width:"50px",
        }}
      >
      </img>
        <div style={{
          // display:showChat,
          visibility:showChat,
        }}>
          <ChatComp id={id}/>
        </div>
      
    </div>
  )
}

export default Code;