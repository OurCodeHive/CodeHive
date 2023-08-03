import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import * as Y from "yjs";
import { WebsocketProvider } from 'y-websocket'
import { syntaxHighlighting } from '@codemirror/language';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QuillBinding } from "y-quill";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import VoiceComp from '@/components/voiceCall/VoiceCallComp';
import IDEHeader from '@/components/IDE/IDEHeader';
import IDETerminal from '@/components/IDE/IDETerminal';
import { useState } from "react";
import ChatComp from '@/components/chat/ChatFrameComp';
import style from "@/res/css/module/AppIDE.module.css";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { codeEditTheme, highlightStyle, QuillBox, modulesRef } from './EditorStyle';


function getRandomColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

let quillRef = null;

function Code() {

  let loginUser = useRecoilValue(userState);
  
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
      name: loginUser.nickname,
      color: getRandomColor(),
      colorLight: "#8acb8833",
    });
    
    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        keymap.of([...yUndoManagerKeymap]),
        basicSetup,
        python(),
        codeEditTheme,
        keymap.of([indentWithTab]),
        syntaxHighlighting(highlightStyle),
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
      name: loginUser.nickname,
      color: getRandomColor(),
    });

    new QuillBinding(ytext, quillRef, provider.awareness);
    
  }, []);

  const attachQuillRefs = () => {
    if (typeof reactQuillRef.getEditor !== "function") return;
    quillRef = reactQuillRef.getEditor();
  };

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

  function toggleLanguage() {
    if (language == "Python") {
      setLanguage("Java")
    } else {
      setLanguage("Python")
    }
  }

  return(
    <div className={style.idePage}>
      <IDEHeader code={code} id={id} language={language}/>
      <IDETerminal code={code} id={id} language={language} up={consoleUp} down={consoleDown}/>
      <VoiceComp mySessionId={codeId} myUserName={loginUser.nickname} />
      <div className={style.ideContainer}>
        <QuillBox className={style.quillBox}>
          <ReactQuill
            className={style.container}
            ref={(el) => { reactQuillRef = el; }}
            modules={modulesRef}
          />
        </QuillBox>
        <div className={style.codeEditer}
          style={{ height: codeHeight }}
          ref={editorRef}>
          <button
            className={style.languageBtn}
            onClick={() => { toggleLanguage() }}
          >{language}🔄</button>
        </div>
        <div className={style.leftSpace}>
        </div>
      </div>
      <img src='https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/chat.png'
        onClick={() => { toggleChat() }}
        className={style.chatIcon}>
      </img>
        <div style={{ visibility:showChat }}>
          <ChatComp id={id}/>
        </div>
    </div>
  )
}

export default Code;
