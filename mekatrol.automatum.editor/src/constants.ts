export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

export const BLOCK_HEIGHT = 40;
export const BLOCK_WIDTH = 150;
export const BLOCK_IO_OFFSET = 2;
export const BLOCK_BORDER_RADIUS = 2;
export const BLOCK_IO_SIZE = 10;
export const MARKER_SIZE = 15;
export const MARKER_OFFSET_X = 5;
export const MARKER_OFFSET_Y = -8;
export const PALETTE_GAP = 8;
export const SCROLLBAR_SIZE = 25;
export const BLOCK_PALETTE_WIDTH = BLOCK_WIDTH + 2 * PALETTE_GAP + SCROLLBAR_SIZE;

/*
 * The various events that a flow and its elements will generate
 */

export const ELEMENT_CHANGED = 'elementChanged';

export const BLOCK_POINTER_MOVE = 'blockPointerMove';
export const BLOCK_POINTER_OVER = 'blockPointerOver';
export const BLOCK_POINTER_ENTER = 'blockPointerEnter';
export const BLOCK_POINTER_LEAVE = 'blockPointerLeave';
export const BLOCK_POINTER_DOWN = 'blockPointerDown';
export const BLOCK_POINTER_UP = 'blockPointerUp';

export const BLOCK_IO_POINTER_MOVE = 'blockIOPointerMove';
export const BLOCK_IO_POINTER_OVER = 'blockIOPointerOver';
export const BLOCK_IO_POINTER_ENTER = 'blockIOPointerEnter';
export const BLOCK_IO_POINTER_LEAVE = 'blockIOPointerLeave';
export const BLOCK_IO_POINTER_DOWN = 'blockIOPointerDown';
export const BLOCK_IO_POINTER_UP = 'blockIOPointerUp';

export const CONNECTING_POINTER_MOVE = 'connectingPointerMove';
export const CONNECTING_POINTER_OVER = 'connectingPointerOver';
export const CONNECTING_POINTER_ENTER = 'connectingPointerEnter';
export const CONNECTING_POINTER_LEAVE = 'connectingPointerLeave';
export const CONNECTING_POINTER_DOWN = 'connectingPointerDown';
export const CONNECTING_POINTER_UP = 'connectingPointerUp';

export const CONNECTION_POINTER_MOVE = 'connectionPointerMove';
export const CONNECTION_POINTER_OVER = 'connectionPointerOver';
export const CONNECTION_POINTER_ENTER = 'connectionPointerEnter';
export const CONNECTION_POINTER_LEAVE = 'connectionPointerLeave';
export const CONNECTION_POINTER_DOWN = 'connectionPointerDown';
export const CONNECTION_POINTER_UP = 'connectionPointerUp';

// Fired when a new connection is starting
export const CONNECTING_START = 'connectingStart';

// Fired a new connection is finished
export const CONNECTING_END = 'connectingEnd';

// Fired when the mouse is moving for a new connection
export const CONNECTING_END_LOCATION_CHANGE = 'connectingEndLocationChange';

/* Field sizing */
export const FIELD_FLOW_LABEL_MIN_LENGTH = 5;
export const FIELD_FLOW_LABEL_MAX_LENGTH = 100;

export const FIELD_FLOW_DESCRIPTION_MIN_LENGTH = 0;
export const FIELD_FLOW_DESCRIPTION_MAX_LENGTH = 500;
