export interface FlowConnection {
  // ID of the block the connection starts from
  startBlockId: string;

  // The pin number of the input/output that this connection starts from
  startPin: number;

  // ID of the block the connection ends at
  endBlockId: string;

  // The pin number of the input/output that this connection ends at
  endPin: number;

  // True if currently selected
  selected: boolean;
}
