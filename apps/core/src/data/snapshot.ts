const limit = 100;

class Snapshot<T> {
  private past: Array<string> = [];
  private future: Array<string> = [];

  public constructor() { }

  public add(data: T): void {
    if (this.past.length >= limit) {
      this.past.shift();
    }

    this.past.push(JSON.stringify(data));
    this.future = [];
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  public undo(data: T): T | null {
    if (this.canUndo()) {
      this.future.unshift(JSON.stringify(data));
      const present = JSON.parse(this.past.pop()!) as T;
      return present;
    }
    return null;
  }

  public redo(data: T): T | null {
    if (this.canRedo()) {
      this.past.push(JSON.stringify(data));
      const present = JSON.parse(this.future.shift()!) as T;
      return present;
    }
    return null;
  }
}

export default Snapshot;
