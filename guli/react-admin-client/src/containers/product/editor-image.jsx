import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function EditorImage (props) {
  EditorImage.prototype = {
    detail: PropTypes.string,
  }

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    const { detail } = props
    if (detail) {
      const contentBlock = htmlToDraft(detail)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }

  }, [props])

  const uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve({ data: { link: response.data.url } });
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }
  EditorImage.prototype.getDetail = () => {
    // 返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  return <Editor
    editorState={editorState}
    wrapperClassName="demo-wrapper"
    editorClassName="demo-editor"
    editorStyle={{ minHeight: '300px', padding: 10, border: '1px solid black' }}
    onEditorStateChange={onEditorStateChange}
    toolbar={{
      inline: { inDropdown: true },
      list: { inDropdown: true },
      textAlign: { inDropdown: true },
      link: { inDropdown: true },
      history: { inDropdown: true },
      image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
    }}
  />
}
