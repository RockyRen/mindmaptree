import * as Y from 'yjs';
import { NodeData } from '../types';

class UndoHandler {
  private readonly undoManager: Y.UndoManager;

  public constructor(nodeDataMap: Y.Map<NodeData>) {
    this.undoManager = new Y.UndoManager(nodeDataMap);
  }

  public undo(): void {
    this.undoManager.undo();
  }

  public redo(): void {
    this.undoManager.redo();
  }

  public canUndo(): boolean {
    return this.undoManager.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.undoManager.redoStack.length > 0;
  }
}

export default UndoHandler;
