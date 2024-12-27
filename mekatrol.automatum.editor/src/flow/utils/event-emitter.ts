import mitt, { type Emitter } from 'mitt';
import { type FlowController } from '../types/FlowController';
import {
  BLOCK_IO_POINTER_DOWN,
  BLOCK_IO_POINTER_ENTER,
  BLOCK_IO_POINTER_LEAVE,
  BLOCK_IO_POINTER_MOVE,
  BLOCK_IO_POINTER_OVER,
  BLOCK_IO_POINTER_UP,
  BLOCK_POINTER_DOWN,
  BLOCK_POINTER_ENTER,
  BLOCK_POINTER_LEAVE,
  BLOCK_POINTER_MOVE,
  BLOCK_POINTER_OVER,
  BLOCK_POINTER_UP,
  CONNECTING_POINTER_DOWN,
  CONNECTING_POINTER_ENTER,
  CONNECTING_POINTER_LEAVE,
  CONNECTING_POINTER_MOVE,
  CONNECTING_POINTER_OVER,
  CONNECTING_POINTER_UP,
  CONNECTION_POINTER_DOWN,
  CONNECTION_POINTER_ENTER,
  CONNECTION_POINTER_LEAVE,
  CONNECTION_POINTER_MOVE,
  CONNECTION_POINTER_OVER,
  CONNECTION_POINTER_UP
} from '../constants';
import type { FlowBlock, InputOutput, FlowConnection } from '@/services/api-generated';
import type { FlowConnecting } from '../types/FlowConnecting';

export interface FlowPointerEvent<T> {
  data: T;
  pointerEvent: PointerEvent;
}

// An event from a flow block
export interface FlowBlockPointerEvent extends FlowPointerEvent<FlowBlock> {}

// A pointer event from a flow block io (includes the block that the io is attached to)
export interface FlowBlockIOPointerEvent extends FlowBlockPointerEvent {
  inputOutput: InputOutput;
}

// A pointer event from a flow connection
export interface FlowConnectionPointerEvent extends FlowPointerEvent<FlowConnection> {}

// A pointer event from a flow connecting
export interface FlowConnectingPointerEvent extends FlowPointerEvent<FlowConnecting> {}

export type FlowEvents = {
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
  blockIOPointerMove: FlowBlockIOPointerEvent;
  blockIOPointerOver: FlowBlockIOPointerEvent;
  blockIOPointerEnter: FlowBlockIOPointerEvent;
  blockIOPointerLeave: FlowBlockIOPointerEvent;
  blockIOPointerDown: FlowBlockIOPointerEvent;
  blockIOPointerUp: FlowBlockIOPointerEvent;

  /*
   * Connecting pointer events
   */
  connectingPointerMove: FlowConnectingPointerEvent;
  connectingPointerOver: FlowConnectingPointerEvent;
  connectingPointerEnter: FlowConnectingPointerEvent;
  connectingPointerLeave: FlowConnectingPointerEvent;
  connectingPointerDown: FlowConnectingPointerEvent;
  connectingPointerUp: FlowConnectingPointerEvent;

  /*
   * Connection pointer events
   */
  connectionPointerMove: FlowConnectionPointerEvent;
  connectionPointerOver: FlowConnectionPointerEvent;
  connectionPointerEnter: FlowConnectionPointerEvent;
  connectionPointerLeave: FlowConnectionPointerEvent;
  connectionPointerDown: FlowConnectionPointerEvent;
  connectionPointerUp: FlowConnectionPointerEvent;
};

// We want a single instance for all use (singleton pattern)
const emitter: Emitter<FlowEvents> = mitt<FlowEvents>();

export const configureFlowPointerEvents = (flowController: FlowController): void => {
  const emitter = useEmitter();

  emitter.on(BLOCK_POINTER_ENTER, (_e: FlowBlockPointerEvent) => {
    // console.log(`block pointer enter: ${e.data.id}`, e);
  });

  emitter.on(BLOCK_POINTER_LEAVE, (_e: FlowBlockPointerEvent) => {
    // console.log(`block pointer leave: ${e.data.id}`, e);
  });

  emitter.on(BLOCK_POINTER_DOWN, (e: FlowBlockPointerEvent) => {
    flowController.blockPointerDown(e);
  });

  emitter.on(BLOCK_POINTER_UP, (e: FlowBlockPointerEvent) => {
    flowController.blockPointerUp(e);
  });

  emitter.on(BLOCK_POINTER_MOVE, (e: FlowBlockPointerEvent) => {
    flowController.dragBlockMove(e.pointerEvent);
  });

  emitter.on(BLOCK_POINTER_OVER, (_e) => {});

  emitter.on(BLOCK_IO_POINTER_MOVE, (_e) => {
    // console.log(`BLOCK_IO_POINTER_MOVE: ${e.data.id}`, e);
  });

  emitter.on(BLOCK_IO_POINTER_OVER, (_e) => {
    // console.log(`BLOCK_IO_POINTER_OVER: ${e.data.id}`, e);
  });

  emitter.on(BLOCK_IO_POINTER_ENTER, (_e) => {
    // console.log(`BLOCK_IO_POINTER_ENTER: ${e.data.id}`, e);
  });

  emitter.on(BLOCK_IO_POINTER_LEAVE, (_e) => {
    // console.log(`BLOCK_IO_POINTER_LEAVE: ${e.data.id}`, e);
  });

  emitter.on(BLOCK_IO_POINTER_UP, (_e) => {
    flowController.drawingConnection.value = undefined;
  });

  emitter.on(BLOCK_IO_POINTER_DOWN, (e) => {
    flowController.blockIOPointerDown(e);
  });

  emitter.on(CONNECTING_POINTER_MOVE, (_e) => {
    // console.log(`CONNECTING_POINTER_MOVE: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTING_POINTER_OVER, (_e) => {
    // console.log(`CONNECTING_POINTER_OVER: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTING_POINTER_ENTER, (_e) => {
    // console.log(`CONNECTING_POINTER_ENTER: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTING_POINTER_LEAVE, (_e) => {
    // console.log(`CONNECTING_POINTER_LEAVE: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTING_POINTER_UP, (_e) => {
    // console.log(`CONNECTING_POINTER_UP: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTING_POINTER_DOWN, (e) => {
    // console.log(`CONNECTING_POINTER_DOWN: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTION_POINTER_MOVE, (_e) => {
    // console.log(`CONNECTION_POINTER_MOVE: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTION_POINTER_OVER, (_e) => {
    // console.log(`CONNECTION_POINTER_OVER: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTION_POINTER_ENTER, (_e) => {
    // console.log(`CONNECTION_POINTER_ENTER: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTION_POINTER_LEAVE, (_e) => {
    // console.log(`CONNECTION_POINTER_LEAVE: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTION_POINTER_UP, (_e) => {
    // console.log(`CONNECTION_POINTER_UP: ${_e.data.id}`, _e);
  });

  emitter.on(CONNECTION_POINTER_DOWN, (e) => {
    flowController.clearSelectedItems();
    flowController.drawingConnection.value = undefined;
    flowController.selectedConnection = e.data;
  });
};

export const useEmitter = (): Emitter<FlowEvents> => {
  return emitter;
};
