import KeyboardEvents from './keyboard-events';
import TextEditor from '../text-editor';
import Selection from '../selection/selection';
import MultiSelect from '../selection/multi-select';
import ViewportInteraction from '../viewport-interaction/viewport-interaction';
import ToolOperation from '../tool-operation';
import { ArrowType } from '../selection/selection-arrow-next';

// todo 肯定要重构
class Keyboard {
  private readonly keyboardEvents: KeyboardEvents;
  public constructor({
    toolOperation,
    textEditor,
    selection,
    multiSelect,
    viewportInteraction,
  }: {
    toolOperation: ToolOperation;
    textEditor: TextEditor;
    selection: Selection;
    multiSelect: MultiSelect;
    viewportInteraction: ViewportInteraction;
  }) {
    this.keyboardEvents = new KeyboardEvents();

    this.keyboardEvents.on('keydown', (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, metaKey } = event;

      if (textEditor.isShowing()) {
        switch (key) {
          case 'Tab':
          case 'Enter': {
            textEditor.finishEdit();
            break;
          }
        }
        return;
      }

      // todo 区分window和mac的ctrl和meta
      if (metaKey) {
        if (shiftKey) {
          switch (key) {
            // ctrl + shift + z
            case 'z': {
              toolOperation.redo();
              break;
            }
          }
        } else {
          switch (key) {
            // ctrl + z
            case 'z': {
              toolOperation.undo();
              break;
            }
            case '=': {
              event.preventDefault();
              viewportInteraction.zoomIn();
              break;
            }
            case '-': {
              event.preventDefault();
              viewportInteraction.zoomOut();
              break;
            }
            case 'Meta': {
              selection.setIsMultiClickMode(true);
              multiSelect.disable();
              viewportInteraction.enableBackgroundDrag();
              viewportInteraction.enableMoveScale();
              break;
            }
            default: {
              break
            }
          }
        }

      } else {

        switch (key) {
          case 'Enter': {
            toolOperation.addBrotherNode();
            break;
          }
          case 'Tab': {
            const selectNodes = selection.getSelectNodes();
            if (selectNodes.length > 0) {
              event.preventDefault();
            }
            toolOperation.addChildNode();
            break;
          }
          case 'Backspace': {
            toolOperation.removeNode();
            break;
          }
          // todo 考虑textEditor问题
          case 'ArrowUp':
          case 'ArrowRight':
          case 'ArrowDown':
          case 'ArrowLeft': {
            selection.selectArrowNext(key as ArrowType);
            break;
          }
          default: {
            break
          }
        }
      }
    });

    this.keyboardEvents.on('keyup', (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Meta': {
          selection.setIsMultiClickMode(false);
          multiSelect.enable();
          viewportInteraction.disableBackgroundDrag();
          viewportInteraction.disableMoveScale();
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  public clear() {
    this.keyboardEvents.clear();
  }
}

export default Keyboard;
