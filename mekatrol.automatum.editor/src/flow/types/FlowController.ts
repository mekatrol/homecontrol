import { type Ref, ref } from 'vue';
import { ZOrder } from './ZOrder';
import { configureFlowPointerEvents, type FlowBlockIOPointerEvent, type FlowBlockPointerEvent } from '../utils/event-emitter';
import type { FlowBlock, InputOutput, FlowConnection } from '@/services/api-generated';
import type { FlowConnecting } from './FlowConnecting';
import { MARKER_SIZE } from '../constants';
import { useAppStore } from '../stores/app-store';
import { useFlowStore } from '../stores/flow-store';
import type { Flow, Offset, BlockSide, Size } from '@/services/api-generated';
import { v4 as uuidv4 } from 'uuid';

export class FlowController {
  public _key: string;
  public _flow: Flow;
  public _zOrder: ZOrder;
  public _blockPaletteWidth: number;
  public _drawingConnection = ref<FlowConnecting | undefined>(undefined);
  public _drawingConnectionEndBlock = ref<FlowBlock | undefined>(undefined);
  public _drawingConnectionEndPin = ref<number | undefined>(undefined);
  public _selectedConnection = ref<FlowConnection | undefined>(undefined);
  public _selectedBlock = ref<FlowBlock | undefined>(undefined);
  public _dragBlock = ref<FlowBlock | undefined>(undefined);
  public _dragBlockOffset = ref<Offset>({ x: 0, y: 0 });
  public _dragBlockOriginalPosition = ref<Offset>({ x: 0, y: 0 });

  constructor(key: string, flow: Flow) {
    this._key = key;
    this._flow = flow;
    this._zOrder = new ZOrder(flow.blocks);
    this._blockPaletteWidth = useAppStore().blockPaletteWidth;
  }

  public get key() {
    return this._key;
  }

  public get flow(): Flow {
    return this._flow;
  }

  public get dragBlock(): Ref<FlowBlock | undefined> {
    return this._dragBlock;
  }

  public get dragBlockOriginalPosition(): Ref<Offset> {
    return this._dragBlockOriginalPosition;
  }

  public get dragBlockOffset(): Ref<Offset> {
    return this._dragBlockOffset;
  }

  public get drawingConnection(): Ref<FlowConnecting | undefined> {
    return this._drawingConnection;
  }

  public get selectedBlock(): FlowBlock | undefined {
    return this._selectedBlock.value;
  }

  public set selectedBlock(block: FlowBlock | undefined) {
    // Clear any existing selections
    this.clearSelectedBlock();

    if (!block) {
      return;
    }

    block.selected = true;
    this._selectedBlock.value = block;
  }

  public get selectedConnection(): FlowConnection | undefined {
    return this._selectedConnection.value;
  }

  public set selectedConnection(connection: FlowConnection | undefined) {
    // Clear any existing selections
    this.clearSelectedConnection();

    if (!connection) {
      return;
    }

    connection.selected = true;
    this._selectedConnection.value = connection;
  }

  public clearSelectedItems(): void {
    // We just try and clear everything so that selections
    // are reset to a known state

    // Clear selected node
    this.clearSelectedBlock();

    // Clear selected connection
    this.clearSelectedConnection();

    // Clear drawing connection
    this.drawingConnection.value = undefined;
    this._drawingConnectionEndBlock.value = undefined;
    this._drawingConnectionEndPin.value = undefined;
  }

  public clearSelectedConnection = (): void => {
    // Clear selected node
    this._selectedConnection.value = undefined;

    if (!this._flow.connections) {
      return;
    }

    // Make sure all are deselected
    this._flow.connections.forEach((c) => (c.selected = false));
  };

  public clearSelectedBlock = (): void => {
    // Clear selected node
    this._selectedBlock.value = undefined;

    if (!this._flow.blocks) {
      return;
    }

    // Make sure all are deselected
    this._flow.blocks.forEach((b) => (b.selected = false));
  };

  public moveBlockZOrder = (action: string): void => {
    if (!this.selectedBlock || !this._flow || !this._flow.blocks) {
      return;
    }

    this._zOrder.moveBlockZOrder(action, this.selectedBlock);
  };

  public blockLocationIsInvalid(block: FlowBlock): boolean {
    // Must be at least MARKER_SIZE from left and top
    return block.offset.x < MARKER_SIZE || block.offset.y < MARKER_SIZE;
  }

  public blockPointerDown(e: FlowBlockPointerEvent) {
    (e.pointerEvent.target as SVGElement).setPointerCapture(e.pointerEvent.pointerId);

    this.clearSelectedItems();
    this.selectedBlock = e.data;
    this.dragBlock.value = e.data;
    this.dragBlock.value.zBoost = 0;
    this.dragBlock.value.z = this.dragBlock.value.zOrder;
    this.dragBlockOffset.value = { x: e.pointerEvent.offsetX - e.data.offset.x, y: e.pointerEvent.offsetY - e.data.offset.y };
    this.dragBlockOriginalPosition.value = { x: e.data.offset.x, y: e.data.offset.y };
  }

  public blockPointerUp(e: FlowBlockPointerEvent) {
    (e.pointerEvent.target as SVGElement).releasePointerCapture(e.pointerEvent.pointerId);

    // Restore drag block boost if a block is being dragged
    if (this.dragBlock.value) {
      this.dragBlock.value.zBoost = 0;
      this.dragBlock.value.z = this.dragBlock.value.zOrder;

      // Is this a new block?
      if (this.dragBlock.value.draggingAsNew && !this.blockLocationIsInvalid(this.dragBlock.value)) {
        this._flow.blocks.push(this.dragBlock.value);
        this.dragBlock.value.draggingAsNew = false;
      }
    }

    // Clear drag block
    this.dragBlock.value = undefined;

    // Clear drawing connection
    this.drawingConnection.value = undefined;
  }

  public blockIOPointerDown(e: FlowBlockIOPointerEvent) {
    this.clearSelectedItems();

    const connecting = {
      startBlock: e.data as FlowBlock,
      startPin: e.inputOutput.pin,
      endLocation: { x: e.pointerEvent.offsetX - this._blockPaletteWidth, y: e.pointerEvent.offsetY },
      cssClasses: ''
    } as FlowConnecting;

    this.drawingConnection.value = connecting;
  }

  public dragBlockMove = (e: PointerEvent): void => {
    if (!this._dragBlock.value) return;

    // Just for code readability
    const block = this._dragBlock.value;

    // Calculate new offset
    const x = e.offsetX - this._dragBlockOffset.value.x;
    const y = e.offsetY - this._dragBlockOffset.value.y;

    // X can be less than MARKER_SIZE unless it is a new block that has not yet been at a valid offset
    if (block.draggingAsNew && !block.dragLocationHasBeenValid) {
      block.offset.x = x;
    } else {
      block.offset.x = x < MARKER_SIZE ? MARKER_SIZE : x;
    }

    // Y can be less than MARKER_SIZE
    block.offset.y = y < MARKER_SIZE ? MARKER_SIZE : y;

    // Update the drag offset invalid flag. Used to style block when at an invalid offset
    block.dragLocationInvalid = this.blockLocationIsInvalid(block);

    // Once a block has a valid offset then we can't go back to an invalid offset
    // this is only relevant to new blocks being dragged onto the editor area
    if (!block.dragLocationInvalid) {
      block.dragLocationHasBeenValid = true;
    }
  };

  public dragConnectionMove = (e: PointerEvent): void => {
    if (!this.drawingConnection.value) return;

    // Get starting io
    const startBlock = this.drawingConnection.value.startBlock;
    const startInputOutput = startBlock.io.find((io) => io.pin === this.drawingConnection.value!.startPin)!;

    // Is there an element at the pointer position (that is not the drawing connection)
    const hitInputOutputs = this.getHitInputOutputs(e).filter(
      ([block, io]) =>
        // Don't hit test the starting io
        block != startBlock && io != startInputOutput
    );

    // We only use the first entry
    const [block, inputOutput] = hitInputOutputs.length > 0 ? hitInputOutputs[0] : [];

    // Set values (may be undefined)
    this._drawingConnectionEndBlock.value = block;
    this._drawingConnectionEndPin.value = inputOutput?.pin;

    // Update end offset to pointer offset
    this.drawingConnection.value.endLocation = { x: e.offsetX - this._blockPaletteWidth, y: e.offsetY };

    if (!block || !inputOutput) {
      // Clear any existing styles / hit info
      this.drawingConnection.value.cssClasses = '';

      return;
    }

    // Set css extra if is hovering over valid io (connection is compatible for io types)
    this.drawingConnection.value.cssClasses = inputOutput && this.canConnect(inputOutput, startInputOutput) ? 'valid-end-point' : '';
  };

  public dragConnectionCreateConnection = (): void => {
    if (!this._drawingConnection.value || !this._drawingConnectionEndPin.value) {
      return;
    }

    const startBlock = this._drawingConnection.value.startBlock;
    const startBlockPin = this._drawingConnection.value?.startPin;
    const endBlock = this._drawingConnectionEndBlock.value!;
    const endBlockPin = this._drawingConnectionEndPin.value;

    const connection = {
      id: uuidv4(),
      startBlockId: startBlock.id,
      startPin: startBlockPin,
      endBlockId: endBlock.id,
      endPin: endBlockPin
    } as FlowConnection;

    this._flow.connections.push(connection);
  };

  public canConnect = (from: InputOutput, to: InputOutput): boolean => {
    // Connection must be between io is opposite direction
    if (from.direction === to.direction) {
      return false;
    }

    // Connectors must have logic type match (eg, analogue / digital compatibility)
    if (from.type != to.type) {
      return false;
    }

    // Connectors cannot already be connected
    if (this.isConnectorConnected(from) || this.isConnectorConnected(from)) {
      return false;
    }

    return true;
  };

  public getConnectionStartInputOutput(connection: FlowConnection): InputOutput {
    const startBlock = this._flow.blocks.find((b) => b.id === connection.startBlockId)!;

    if (!startBlock) {
      throw new Error(`Start block with ID '${connection.startBlockId}' not found.`);
    }

    return startBlock.io.find((io) => io.pin === connection.startPin)!;
  }

  public getConnectionStartOffset(connection: FlowConnection): Offset {
    const startBlock = this._flow.blocks.find((b) => b.id === connection.startBlockId);

    if (!startBlock) {
      throw new Error(`Start block with ID '${connection.startBlockId}' not found.`);
    }

    const startInputOutput = startBlock.io.find((io) => io.pin == connection.startPin);

    if (!startInputOutput) {
      throw new Error(`Start IO with pin '${connection.startPin}' not found on block with ID '${connection.startBlockId}'.`);
    }

    return {
      x: startBlock.offset.x + startInputOutput.offset.x,
      y: startBlock.offset.y + startInputOutput.offset.y + startInputOutput.size.height / 2
    };
  }

  public getConnectionEndInputOutput(connection: FlowConnection): InputOutput {
    const endBlock = this._flow.blocks.find((b) => b.id === connection.endBlockId);

    if (!endBlock) {
      throw new Error(`End block with ID '${connection.endBlockId}' not found.`);
    }

    return endBlock.io.find((io) => io.pin === connection.endPin)!;
  }

  public getConnectionEndOffset(connection: FlowConnection): Offset {
    const endBlock = this._flow.blocks.find((b) => b.id === connection.endBlockId);

    if (!endBlock) {
      throw new Error(`End block with ID '${connection.endBlockId}' not found.`);
    }

    const endInputOutput = endBlock.io.find((io) => io.pin == connection.endPin);

    if (!endInputOutput) {
      throw new Error(`End IO with pin '${connection.startPin}' not found on block with ID '${connection.endBlockId}'.`);
    }

    return {
      x: endBlock.offset.x + endInputOutput.offset.x,
      y: endBlock.offset.y + endInputOutput.offset.y + endInputOutput.size.height / 2
    };
  }

  public isConnectorConnected = (inputOutput: InputOutput): boolean => {
    let isConnected = false;
    this._flow.connections.forEach((c) => {
      if (this.getConnectionStartInputOutput(c) === inputOutput || this.getConnectionEndInputOutput(c) === inputOutput) {
        isConnected = true;
        return;
      }
    });

    return isConnected;
  };

  public getBoundingBox(offset: Offset, size: Size): { left: number; top: number; right: number; bottom: number } {
    return {
      left: offset.x, // left
      top: offset.y, // top
      right: offset.x + size.width, // right
      bottom: offset.y + size.height // bottom
    };
  }

  public boundingBoxContainsOffset(boundingBox: { left: number; top: number; right: number; bottom: number }, offset: Offset): boolean {
    // Check if offset within bounds (including boundary itself)
    return offset.x >= boundingBox.left && offset.x <= boundingBox.right && offset.y >= boundingBox.top && offset.y <= boundingBox.bottom;
  }

  public getHitInputOutputs = (e: PointerEvent): [FlowBlock, InputOutput][] => {
    const hitInputOutputs: [FlowBlock, InputOutput][] = [];

    this._flow.blocks.forEach((block) => {
      // Convert pointer offset to offset relative to block offset for block input/output hit testing
      const blockRelativeOffset: Offset = { x: e.offsetX - block.offset.x - this._blockPaletteWidth, y: e.offsetY - block.offset.y };

      // Are any input/output hit?
      (block as FlowBlock).io.forEach((io) => {
        const boundingBox = this.getBoundingBox(io.offset, io.size);
        if (this.boundingBoxContainsOffset(boundingBox, blockRelativeOffset)) {
          hitInputOutputs.push([block, io]);
        }
      });
    });

    return hitInputOutputs;
  };

  // Whenever pointer is clicked anywhere in the editor
  // allows clearing any currently selected node when clicking
  // on editor background (ie not on a node)
  public pointerDown = (e: PointerEvent): void => {
    if (e.target instanceof SVGElement || e.target instanceof HTMLElement) {
      const element = e.target as HTMLElement | SVGElement;

      // Focus the element (which will focus the parent SVG element)
      element.focus({
        preventScroll: true
      });

      // If the actual SVG element was clicked on then clear any selected items
      if (element.tagName === 'svg') {
        this.clearSelectedItems();
      }
    }
  };

  public pointerUp = (e: PointerEvent): void => {
    this._dragBlock.value = undefined;

    if (this.drawingConnection.value && this._drawingConnectionEndPin.value) {
      this.dragConnectionCreateConnection();
    }

    if (e.target instanceof Element) {
      const element = e.target as Element;
      if (element.tagName === 'svg') {
        this.clearSelectedBlock();
      }
    }

    // Clear drawing connection
    this.drawingConnection.value = undefined;
  };

  public pointerMove = (e: PointerEvent): void => {
    // Is there a connection being drawn
    if (this.drawingConnection.value) {
      this.dragConnectionMove(e);
      return;
    }
    this.dragBlockMove(e);
  };

  public pointerLeave = (_: PointerEvent): void => {
    this.dragBlock.value = undefined;
    this.drawingConnection.value = undefined;
  };

  public keyPress = (_e: KeyboardEvent): void => {
    // console.log('keyPress', _e);
  };

  public keyDown = (_e: KeyboardEvent): void => {
    // console.log('keyDown', _e);
  };

  public keyUp = (e: KeyboardEvent): void => {
    if (e.key === 'Delete') {
      if (this._selectedBlock.value) {
        this.deleteSelectedBlock();
      } else if (this._selectedConnection.value) {
        this.deleteSelectedConnection();
      }
    }
  };

  public deleteSelectedBlock = (): void => {
    // Can only delete the selected node if a node is actually selected
    if (!this._selectedBlock.value) {
      return;
    }

    // Delete any connections to this block
    const connections = this._flow.connections.filter(
      (c) => c.startBlockId === this._selectedBlock.value!.id || c.endBlockId === this._selectedBlock.value!.id
    );

    connections.forEach((c) => {
      this.deleteConnection(c);
    });

    // Delete selected block
    this.deleteBlock(this._selectedBlock.value);

    // Clear any selections
    this.clearSelectedItems();
  };

  public deleteSelectedConnection = (): void => {
    // Can only delete the selected connection if a connection is actually selected
    if (!this._selectedConnection.value) {
      return;
    }

    // Delete selected connection
    this.deleteConnection(this._selectedConnection.value);

    // Clear any selections
    this.clearSelectedItems();
  };

  public deleteBlock = (block: FlowBlock): void => {
    // We must also delete any connections that connect to the node
    const connections = this._flow.connections.filter((c) => c.startBlockId === block.id || c.endBlockId === block.id);
    connections.forEach((c) => this.deleteConnection(c));

    // Filter nodes to the set without the node
    this._flow.blocks = this._flow.blocks.filter((b) => b != block);
  };

  public deleteConnection = (connection: FlowConnection): void => {
    // Filter connections to the set without the connection
    this._flow.connections = this._flow.connections.filter((c) => c != connection);
  };
}

// The instantiated flow controllers
const flowControllers: Record<string, FlowController> = {};

// Initialise a new instance of a controller
export const initFlowController = (key: string, flow: Flow): FlowController => {
  // Does a controller with the specified key already exist?
  if (key in flowControllers) {
    throw new Error(`A controller with the key '${key}' has already been initialised. Did you mean to call useFlowController?`);
  }

  // Create instance and add to dictionary
  const flowController = new FlowController(key, flow);
  flowControllers[key] = flowController;

  // Pointer events
  configureFlowPointerEvents(flowController);

  // Return flow controller instance
  return flowController;
};

// Get an instance of a flow controller by key
export const useFlowController = (key: string): FlowController => {
  if (!key) {
    throw new Error(`Cannot use flow controller for invalid key '${key}'`);
  }

  // Does a controller with the specified key already exist?
  if (!(key in flowControllers)) {
    const { getFlow } = useFlowStore();

    // Create a new empty flow
    const flow = getFlow(key);

    if (!flow) {
      throw new Error(`No flow found with key '${key}'`);
    }

    // Create an return new instance
    return initFlowController(key, flow);
  }

  // Return existing instance
  return flowControllers[key];
};

// Clean up a flow controller instance
export const deleteFlowController = (key: string): void => {
  // Does a controller with the specified key already exist?
  if (!(key in flowControllers)) {
    // Doesn't exist so nothing to do
    return;
  }

  // Remove the instance
  delete flowControllers[key];
};
