// @ts-nocheck
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'

Quill.register('modules/cursors', QuillCursors)

// 初始化编辑器
const quill = new Quill(document.querySelector('#container'), {
  modules: {
    cursors: true,
    toolbar: [
      // adding some basic Quill content features
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ],
    history: {
      // Local undo shouldn't undo changes
      // from remote users
      userOnly: true
    }
  },
  placeholder: 'Start collaborating...',
  theme: 'snow' // 'bubble' is also great
})

// yjs的共享document
// A Yjs document holds the shared data
const ydoc = new Y.Doc()

// 共享网络provider，webrtc是点对点，初始化一个房间名
const provider = new WebrtcProvider('quill-demo-room', ydoc)

// 共享的text type
// Define a shared text type on the document
const ytext = ydoc.getText('quill')

// 参数：shared Types Data、编辑器、provider
// "Bind" the quill editor to a Yjs text type.
const binding = new QuillBinding(ytext, quill, provider.awareness)

// Remove the selection when the iframe is blurred
window.addEventListener('blur', () => { quill.blur() })
