import KeyboardEvents from './keyboard-events';
import TextEditor from '../text-editor';
import Selection from '../selection/selection';
import MultiSelect from '../selection/multi-select';
import ViewportInteraction from '../viewport-interaction/viewport-interaction';
import ToolOperation from '../tool-operation';
import type { ArrowType } from '../selection/selection-arrow-next';

interface KeyboardOptions {
  toolOperation: ToolOperation;
  textEditor: TextEditor;
  selection: Selection;
  multiSelect: MultiSelect;
  viewportInteraction: ViewportInteraction;
}

class Keyboard {
  private readonly keyboardEvents: KeyboardEvents;
  public constructor(options: KeyboardOptions) {
    this.keyboardEvents = new KeyboardEvents();

    this.keyboardEvents.on('keydown', (event: KeyboardEvent) => {
      this.handleKeydown(event, options);
    });

    this.keyboardEvents.on('keyup', (event: KeyboardEvent) => {
      this.handleKeyup(event, options);
    });
  }

  private handleKeydown = (event: KeyboardEvent, {
    toolOperation,
    textEditor,
    selection,
    multiSelect,
    viewportInteraction,
  }: KeyboardOptions): void => {
    const { key, ctrlKey, shiftKey, metaKey } = event;

    console.log('key', key);
    if (textEditor.isShowing()) {
      switch (key) {
        case 'Escape': {
          textEditor.hide();
          break;
        }
        case 'Tab':
        case 'Enter': {
          textEditor.finishEdit();
          break;
        }
      }
      return;
    }

    if (metaKey && shiftKey) {
      switch (key) {
        // ctrl + shift + z
        case 'z': {
          toolOperation.redo();
          break;
        }
      }
    } else if (metaKey && !shiftKey) {
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
    } else if (!metaKey && !shiftKey && !ctrlKey) {
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
        case 'ArrowUp':
        case 'ArrowRight':
        case 'ArrowDown':
        case 'ArrowLeft': {
          selection.selectArrowNext(key as ArrowType);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private handleKeyup = (event: KeyboardEvent, {
    selection,
    multiSelect,
    viewportInteraction,
  }: KeyboardOptions): void => {
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
  }

  public clear() {
    this.keyboardEvents.clear();
  }
}

export default Keyboard;
