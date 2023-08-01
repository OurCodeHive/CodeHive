import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import React, { useState, } from "react";
import { EditorState, convertToRaw } from 'draft-js';
import EditorStyle from "@/res/css/module/util/Editor.module.css";

const CustomEditor = ({editorRef} : {editorRef : React.RefObject<HTMLInputElement>}) => {
	// EditorState.createEmpty() 로 초기값 설정
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())

  const onEditorStateChange = (editorState: EditorState) => {
      setEditorState(editorState);
      if(editorRef.current != null){editorRef.current.value = draftToHtml(convertToRaw(editorState.getCurrentContent())) ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : "";}      
  }
    
	return (
    <div className="col-12">
      <input type="hidden" ref={editorRef} />
      <Editor
          editorState={editorState}
          wrapperClassName={`${EditorStyle.editor_wrapper}`}
          toolbarClassName={`${EditorStyle.editor_toolbar_con}`}
          editorClassName={`${EditorStyle.editor_con}`}
          onEditorStateChange={onEditorStateChange}
          placeholder="글을 쓰시오."
          toolbar={{
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false }
          }}
          localization={{
            locale: 'ko',
          }}
      />
    </div>
    )
};

export default CustomEditor;