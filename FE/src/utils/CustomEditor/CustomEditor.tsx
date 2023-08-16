import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import EditorStyle from "./css/Editor.module.css";

const CustomEditor = ({editorRef, content} : {editorRef : React.RefObject<HTMLInputElement>, content?: string}) => {

	// EditorState.createEmpty() 로 초기값 설정
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())

  useEffect(() => {
    const blocksFromHtml = convertFromHTML(content ? content : "");
    if (blocksFromHtml && blocksFromHtml.contentBlocks.length > 0) {
        const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap);
        const editorState = EditorState.createWithContent(contentState);
        onEditorStateChange(editorState);
    }
}, [])

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
          placeholder="스터디 설명을 작성해주세요"
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