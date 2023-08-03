import EditorStyle from "./css/Editor.module.css";

const CustomEditorResult = ({param} : {param: string}) => {
	return (
    <div className={`col-12 ${EditorStyle.editor_result}`} dangerouslySetInnerHTML={{__html : param}} />
  )
};

export default CustomEditorResult;