import mitt, { type Emitter, type Handler } from 'mitt';
import type { FlowBlock, InputOutput, FlowConnection } from '@/services/api-generated';
import type { FlowConnecting } from '@/types/flow-connecting';

const BLOCK_POINTER_MOVE = 'blockPointerMove';
const BLOCK_POINTER_OVER = 'blockPointerOver';
const BLOCK_POINTER_ENTER = 'blockPointerEnter';
const BLOCK_POINTER_LEAVE = 'blockPointerLeave';
const BLOCK_POINTER_DOWN = 'blockPointerDown';
const BLOCK_POINTER_UP = 'blockPointerUp';
const BLOCK_IO_POINTER_MOVE = 'blockIoPointerMove';
const BLOCK_IO_POINTER_OVER = 'blockIoPointerOver';
const BLOCK_IO_POINTER_ENTER = 'blockIoPointerEnter';
const BLOCK_IO_POINTER_LEAVE = 'blockIoPointerLeave';
const BLOCK_IO_POINTER_DOWN = 'blockIoPointerDown';
const BLOCK_IO_POINTER_UP = 'blockIoPointerUp';
const CONNECTION_POINTER_MOVE = 'connectionPointerMove';
const CONNECTION_POINTER_OVER = 'connectionPointerOver';
const CONNECTION_POINTER_ENTER = 'connectionPointerEnter';
const CONNECTION_POINTER_LEAVE = 'connectionPointerLeave';
const CONNECTION_POINTER_DOWN = 'connectionPointerDown';
const CONNECTION_POINTER_UP = 'connectionPointerUp';

// Fired when a new connection is starting
export const CONNECTING_START = 'connectingStart';

// Fired a new connection is finished
export const CONNECTING_END = 'connectingEnd';

// Fired when the mouse is moving for a new connection
export const CONNECTING_UPDATE = 'connectingUpdate';

// Fired when dragging block has starting
export const DRAGGING_BLOCK_START = 'draggingBlockStart';

// Fired dragging block has finished
export const DRAGGING_BLOCK_END = 'draggingBlockEnd';

// Fired when dragging block moved
export const DRAGGING_BLOCK_MOVE = 'draggingBlockMove';

export interface FlowEventData<T> {
  data: T;
}

export interface FlowPointerEvent<T> extends FlowEventData<T> {
  pointerEvent: PointerEvent;
}

// An event from a flow block
export interface FlowBlockPointerEvent extends FlowPointerEvent<FlowBlock> {}

// A pointer event from a flow block io (includes the block that the io is attached to)
export interface FlowBlockIoPointerEvent extends FlowBlockPointerEvent {
  inputOutput: InputOutput;
}

// A pointer event from a flow connection
export interface FlowConnectionPointerEvent extends FlowPointerEvent<FlowConnection> {}

// A pointer event from a flow connecting
export interface FlowConnectingPointerEvent extends FlowPointerEvent<FlowConnecting> {}

export interface FlowConnectingEvent extends FlowEventData<FlowConnecting | undefined> {}

export interface FlowBlockDraggingEvent extends FlowEventData<FlowBlock | undefined> {}

export type FlowEventType = {
  /*
   * Block pointer events
   */
  blockPointerMove: FlowBlockPointerEvent;
  blockPointerOver: FlowBlockPointerEvent;
  blockPointerEnter: FlowBlockPointerEvent;
  blockPointerLeave: FlowBlockPointerEvent;
  blockPointerDown: FlowBlockPointerEvent;
  blockPointerUp: FlowBlockPointerEvent;

  /*
   * Block input/output pointer events
   */
  blockIoPointerMove: FlowBlockIoPointerEvent;
  blockIoPointerOver: FlowBlockIoPointerEvent;
  blockIoPointerEnter: FlowBlockIoPointerEvent;
  blockIoPointerLeave: FlowBlockIoPointerEvent;
  blockIoPointerDown: FlowBlockIoPointerEvent;
  blockIoPointerUp: FlowBlockIoPointerEvent;

  /*
   * Connection pointer events
   */
  connectionPointerMove: FlowConnectionPointerEvent;
  connectionPointerOver: FlowConnectionPointerEvent;
  connectionPointerEnter: FlowConnectionPointerEvent;
  connectionPointerLeave: FlowConnectionPointerEvent;
  connectionPointerDown: FlowConnectionPointerEvent;
  connectionPointerUp: FlowConnectionPointerEvent;

  /*
   * Connecting events
   */
  connectingStart: FlowConnectingEvent;
  connectingEnd: FlowConnectingEvent;
  connectingUpdate: FlowConnectingEvent;

  /*
   * Block dragging events
   */
  draggingBlockStart: FlowBlockDraggingEvent;
  draggingBlockEnd: FlowBlockDraggingEvent;
  draggingBlockMove: FlowBlockDraggingEvent;
};

// We need a flow emitter per flow (use ID as key)
const emitters: Record<string, FlowEventEmitter> = {};

export const getFlowEmitter = (flowId: string): FlowEventEmitter => {
  if (flowId in emitters) {
    return emitters[flowId];
  }

  const emitter = new FlowEventEmitter(flowId);

  emitters[flowId] = emitter;

  return emitter;
};

export const removeFlowEmitter = (flowId: string): void => {
  delete emitters[flowId];
};

export class FlowEventEmitter {
  public _flowId: string;
  public _emitter: Emitter<FlowEventType>;

  constructor(flowId: string) {
    this._flowId = flowId;
    this._emitter = mitt<FlowEventType>();
  }

  /*
   * Block pointer events
   */

  public emitBlockPointerMove(e: PointerEvent, block: FlowBlock) {
    this.emitBlockPointerEvent(BLOCK_POINTER_MOVE, e, block);
  }

  public onBlockPointerMove(handler: Handler<FlowBlockPointerEvent>) {
    this._emitter.on(BLOCK_POINTER_MOVE, (e) => {
      handler(e);
    });
  }

  public emitBlockPointerOver(e: PointerEvent, block: FlowBlock) {
    this.emitBlockPointerEvent(BLOCK_POINTER_OVER, e, block);
  }

  public emitBlockPointerEnter(e: PointerEvent, block: FlowBlock) {
    this.emitBlockPointerEvent(BLOCK_POINTER_ENTER, e, block);
  }

  public emitBlockPointerLeave(e: PointerEvent, block: FlowBlock) {
    this.emitBlockPointerEvent(BLOCK_POINTER_LEAVE, e, block);
  }

  public emitBlockPointerDown(e: PointerEvent, block: FlowBlock) {
    this.emitBlockPointerEvent(BLOCK_POINTER_DOWN, e, block);
  }

  public onBlockPointerDown(handler: Handler<FlowBlockPointerEvent>) {
    this._emitter.on(BLOCK_POINTER_DOWN, (e) => {
      handler(e);
    });
  }

  public emitBlockPointerUp(e: PointerEvent, block: FlowBlock) {
    this.emitBlockPointerEvent(BLOCK_POINTER_UP, e, block);
  }

  public onBlockPointerUp(handler: Handler<FlowBlockPointerEvent>) {
    this._emitter.on(BLOCK_POINTER_UP, (e) => {
      handler(e);
    });
  }

  public emitBlockPointerEvent = (event: keyof FlowEventType, e: PointerEvent, block: FlowBlock): boolean => {
    this._emitter.emit(event, {
      data: block,
      pointerEvent: e
    });

    // Stop pointer event from propagating
    e.preventDefault();
    return false;
  };

  /*
   * Block drag events
   */

  public emitBlockDragStart(dragBlock: FlowBlock) {
    this.emitDraggingBlockEvent(DRAGGING_BLOCK_START, dragBlock);
  }

  public onBlockDragStart(handler: Handler<FlowBlockDraggingEvent>) {
    this._emitter.on(DRAGGING_BLOCK_START, (e) => {
      handler(e);
    });
  }

  public emitBlockDragEnd() {
    this.emitDraggingBlockEvent(DRAGGING_BLOCK_END, undefined);
  }

  public onBlockDragEnd(handler: Handler<FlowBlockDraggingEvent>) {
    this._emitter.on(DRAGGING_BLOCK_END, (e) => {
      handler(e);
    });
  }

  public emitBlockDragMove(dragBlock: FlowBlock): void {
    this.emitDraggingBlockEvent(DRAGGING_BLOCK_MOVE, dragBlock);
  }

  public onBlockDragMove(handler: Handler<FlowBlockDraggingEvent>) {
    this._emitter.on(DRAGGING_BLOCK_MOVE, (e) => {
      handler(e);
    });
  }

  public emitDraggingBlockEvent = (event: keyof FlowEventType, connecting: FlowBlock | undefined): boolean => {
    this._emitter.emit(event, {
      data: connecting
    });

    return false;
  };

  /*
   * InputOutput pointer events
   */

  public emitBlockIoPointerMove(e: PointerEvent, inputOutput: InputOutput, block: FlowBlock) {
    this.emitIoEvent(BLOCK_IO_POINTER_MOVE, e, inputOutput, block);
  }

  public emitBlockIoPointerOver(e: PointerEvent, inputOutput: InputOutput, block: FlowBlock) {
    this.emitIoEvent(BLOCK_IO_POINTER_OVER, e, inputOutput, block);
  }

  public emitBlockIoPointerEnter(e: PointerEvent, inputOutput: InputOutput, block: FlowBlock) {
    this.emitIoEvent(BLOCK_IO_POINTER_ENTER, e, inputOutput, block);
  }

  public emitBlockIoPointerLeave(e: PointerEvent, inputOutput: InputOutput, block: FlowBlock) {
    this.emitIoEvent(BLOCK_IO_POINTER_LEAVE, e, inputOutput, block);
  }

  public emitBlockIoPointerDown(e: PointerEvent, inputOutput: InputOutput, block: FlowBlock) {
    this.emitIoEvent(BLOCK_IO_POINTER_DOWN, e, inputOutput, block);
  }

  public onBlockIoPointerDown(handler: Handler<FlowBlockIoPointerEvent>) {
    this._emitter.on(BLOCK_IO_POINTER_DOWN, (e) => {
      handler(e);
    });
  }

  public emitBlockIoPointerUp(e: PointerEvent, inputOutput: InputOutput, block: FlowBlock) {
    this.emitIoEvent(BLOCK_IO_POINTER_UP, e, inputOutput, block);
  }

  public onBlockIoPointerUp(handler: Handler<FlowBlockIoPointerEvent>) {
    this._emitter.on(BLOCK_IO_POINTER_UP, (e) => {
      handler(e);
    });
  }

  public emitIoEvent = (event: keyof FlowEventType, e: PointerEvent, io: InputOutput, block: FlowBlock): boolean => {
    this._emitter.emit(event, {
      inputOutput: io,
      data: block,
      pointerEvent: e
    });

    // Stop pointer event from propagating
    e.preventDefault();
    return false;
  };

  /*
   * Connecting events
   */

  public emitConnectingStart(connecting: FlowConnecting): void {
    this.emitConnectingEvent(CONNECTING_START, connecting);
  }

  public onConnectingStart(handler: Handler<FlowConnectingEvent>) {
    this._emitter.on(CONNECTING_START, (e) => {
      handler(e);
    });
  }

  public emitConnectingEnd(connection: FlowConnection | undefined): void {
    this.emitConnectingEvent(CONNECTING_END, connection);
  }

  public onConnectingEnd(handler: Handler<FlowConnectingEvent>) {
    this._emitter.on(CONNECTING_END, (e) => {
      handler(e);
    });
  }

  public emitConnectingUpdate(connecting: FlowConnecting): void {
    this.emitConnectingEvent(CONNECTING_UPDATE, connecting);
  }

  public onConnectingUpdate(handler: Handler<FlowConnectingEvent>) {
    this._emitter.on(CONNECTING_UPDATE, (e) => {
      handler(e);
    });
  }

  public emitConnectingEvent = (event: keyof FlowEventType, connecting: FlowConnecting | FlowConnection | undefined): boolean => {
    this._emitter.emit(event, {
      data: connecting
    } as FlowConnectingEvent);

    return false;
  };

  /*
   * Connecting pointer events
   */

  public emitConnectingPointerMove(e: PointerEvent, connecting: FlowConnecting): void {
    this.emitConnectingPointerEvent(CONNECTION_POINTER_MOVE, e, connecting);
  }

  public emitConnectingPointerOver(e: PointerEvent, connecting: FlowConnecting): void {
    this.emitConnectingPointerEvent(CONNECTION_POINTER_OVER, e, connecting);
  }

  public emitConnectingPointerEnter(e: PointerEvent, connecting: FlowConnecting): void {
    this.emitConnectingPointerEvent(CONNECTION_POINTER_ENTER, e, connecting);
  }

  public emitConnectingPointerLeave(e: PointerEvent, connecting: FlowConnecting): void {
    this.emitConnectingPointerEvent(CONNECTION_POINTER_LEAVE, e, connecting);
  }

  public emitConnectingPointerDown(e: PointerEvent, connecting: FlowConnecting): void {
    this.emitConnectingPointerEvent(CONNECTION_POINTER_DOWN, e, connecting);
  }

  public emitConnectingPointerUp(e: PointerEvent, connecting: FlowConnecting): void {
    this.emitConnectingPointerEvent(CONNECTION_POINTER_UP, e, connecting);
  }

  public emitConnectingPointerEvent(event: keyof FlowEventType, e: PointerEvent, connecting: FlowConnecting): boolean {
    this._emitter.emit(event, {
      data: connecting,
      pointerEvent: e
    });

    // Stop pointer event from propagating
    e.preventDefault();
    return false;
  }

  /*
   * Connection pointer events
   */

  public emitConnectionPointerMove(e: PointerEvent, connection: FlowConnection): void {
    this.emitConnectionPointerEvent(CONNECTION_POINTER_MOVE, e, connection);
  }

  public emitConnectionPointerOver(e: PointerEvent, connection: FlowConnection): void {
    this.emitConnectionPointerEvent(CONNECTION_POINTER_OVER, e, connection);
  }

  public emitConnectionPointerEnter(e: PointerEvent, connection: FlowConnection): void {
    this.emitConnectionPointerEvent(CONNECTION_POINTER_ENTER, e, connection);
  }

  public emitConnectionPointerLeave(e: PointerEvent, connection: FlowConnection): void {
    this.emitConnectionPointerEvent(CONNECTION_POINTER_LEAVE, e, connection);
  }

  public emitConnectionPointerDown(e: PointerEvent, connection: FlowConnection): void {
    this.emitConnectionPointerEvent(CONNECTION_POINTER_DOWN, e, connection);
  }

  public onConnectionPointerDown(handler: Handler<FlowConnectionPointerEvent>) {
    this._emitter.on(CONNECTION_POINTER_DOWN, (e) => {
      handler(e);
    });
  }

  public emitConnectionPointerUp(e: PointerEvent, connection: FlowConnection): void {
    this.emitConnectionPointerEvent(CONNECTION_POINTER_UP, e, connection);
  }

  public emitConnectionPointerEvent(event: keyof FlowEventType, e: PointerEvent, connection: FlowConnection): boolean {
    this._emitter.emit(event, {
      data: connection,
      pointerEvent: e
    });

    // Stop pointer event from propagating
    e.preventDefault();
    return false;
  }
}
