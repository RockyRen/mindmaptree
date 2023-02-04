
type KeyboardEventName = 'keydown' | 'keyup' | 'keypress';

type KeyboardCallback = (event: KeyboardEvent) => void;

class KeyboardEvents {
  private readonly allKeydownCallback: KeyboardCallback;

  private readonly allKeyupCallback: KeyboardCallback;

  private readonly allKeypressCallback: KeyboardCallback;
  private readonly keydownCallbacks: KeyboardCallback[] = [];
  private readonly keyupCallbacks: KeyboardCallback[] = [];
  private readonly keypressCallbacks: KeyboardCallback[] = [];
  public constructor() {
    this.allKeydownCallback = (event: KeyboardEvent) => {
      this.keydownCallbacks.forEach((callback) => callback(event));
    };
    document.addEventListener('keydown', this.allKeydownCallback);

    this.allKeyupCallback = (event: KeyboardEvent) => {
      this.keyupCallbacks.forEach((callback) => callback(event));
    };
    document.addEventListener('keyup', this.allKeyupCallback);

    this.allKeypressCallback = (event: KeyboardEvent) => {
      this.keypressCallbacks.forEach((callback) => callback(event));
    };
    document.addEventListener('keypress', this.allKeypressCallback);
  }

  public on(eventName: KeyboardEventName, callback: KeyboardCallback): void {
    if (eventName === 'keydown') {
      this.keydownCallbacks.push(callback);
    } else if (eventName === 'keyup') {
      this.keyupCallbacks.push(callback);
    } else if (eventName === 'keypress') {
      this.keypressCallbacks.push(callback);
    }
  }

  public off(eventName: KeyboardEventName, callback: KeyboardCallback): void {
    if (eventName === 'keydown') {
      this.removeCallback(this.keydownCallbacks, callback);
    } else if (eventName === 'keyup') {
      this.removeCallback(this.keyupCallbacks, callback);
    } else if (eventName === 'keypress') {
      this.removeCallback(this.keypressCallbacks, callback);
    }
  }

  public clear(): void {
    document.removeEventListener('keydown', this.allKeydownCallback);
    document.removeEventListener('keyup', this.allKeyupCallback);
    document.removeEventListener('keypress', this.allKeypressCallback);
  }

  private removeCallback(callbacks: KeyboardCallback[], callback: KeyboardCallback): void {
    const index = callbacks.findIndex((aCallback) => aCallback === callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}

export default KeyboardEvents;
