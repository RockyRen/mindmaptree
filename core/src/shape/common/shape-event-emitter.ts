import { RaphaelSet, RaphaelElement, RaphaelBaseElement } from 'raphael';

export type EventNames = 'mousedown' | 'click' | 'dblclick' | 'drag' | 'hover' | 'touchstart';
export type EventArgs<EventName extends EventNames> = Parameters<RaphaelBaseElement[EventName]>;

type EventArgsMap = Partial<{
  [EventName in EventNames]: EventArgs<EventName>[];
}>;

class ShapeEventEmitter {
  private readonly eventArgs: EventArgsMap = {};
  public constructor(private readonly shape: RaphaelElement | RaphaelSet) { }

  public on<T extends EventNames>(eventName: T, ...args: EventArgs<T>): void {
    if (!eventName) return;

    if (this.eventArgs[eventName] === undefined) {
      this.eventArgs[eventName] = [];
    }

    this.eventArgs[eventName]!.push(args);

    // @ts-ignore
    this.shape[eventName](...args);
  }

  public removeAllListeners(): void {
    const eventNames: EventNames[] = Object.keys(this.eventArgs) as EventNames[];
    eventNames.forEach((eventName: EventNames) => {
      const events = this.eventArgs[eventName];

      events?.forEach((args) => {
        // @ts-ignore
        this.shape[`un${eventName}`](...args);
      });
    })
  }
}

export default ShapeEventEmitter;
