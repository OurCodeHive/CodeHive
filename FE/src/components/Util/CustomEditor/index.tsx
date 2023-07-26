import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { useState } from "react";
import { EditorState } from 'draft-js'

const CustomEditor = () => {
	// EditorState.createEmpty() 로 초기값 설정
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty())

  const onEditorStateChange = (editorState: EditorState) => {
      setEditorState(editorState)
  }
    
	return (
		<Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
          toolbarClassName="toolbar-class"
          editorClassName="editor-class"
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
    )
}

export default CustomEditor;