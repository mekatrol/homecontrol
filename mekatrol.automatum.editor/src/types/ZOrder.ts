import type { FlowBlock } from '@/services/api-generated';

export class ZOrder {
  public _blocks: FlowBlock[];

  constructor(blocks: FlowBlock[]) {
    this._blocks = blocks;
  }

  public sequenceZOrder = (): void => {
    let nextZOrder = 1;
    this._blocks.forEach((block) => {
      block.zOrder = nextZOrder;
      nextZOrder += 1;
    });
  };

  public sort = (): void => {
    this._blocks.sort((a: FlowBlock, b: FlowBlock) => a.z + a.zBoost - (b.z + b.zBoost));
    this.sequenceZOrder();
  };

  public moveToFront = (selected: FlowBlock): void => {
    if (!selected || !this._blocks) {
      return;
    }

    let maxZ = 0;
    this._blocks.forEach((block) => {
      if (block.z > maxZ) {
        maxZ = block.z;
      }
    });

    selected.zOrder = maxZ + 1;

    this.sort();
  };

  public moveForward = (selected: FlowBlock): void => {
    if (!selected || !this._blocks || !this._blocks) {
      return;
    }

    // Make sure z-order sequential
    this.sort();

    const swapWith = this._blocks.find((block) => block.z == selected.z + 1);
    if (swapWith) {
      swapWith.zOrder--;
      selected.zOrder++;
    }
  };

  public moveBackward = (selected: FlowBlock): void => {
    if (!selected || !this._blocks || !this._blocks) {
      return;
    }

    // Make sure z-order sequential
    this.sort();

    const swapWith = this._blocks.find((block) => block.z == selected.z - 1);
    if (swapWith) {
      swapWith.zOrder++;
      selected.zOrder--;
    }
  };

  public moveToBack = (selected: FlowBlock): void => {
    if (!selected || !this._blocks || !this._blocks) {
      return;
    }

    let minZ = 0;
    this._blocks.forEach((block) => {
      if (block.z < minZ) {
        minZ = block.z;
      }
    });

    selected.zOrder = minZ - 1;

    this.sort();
  };

  public moveBlockZOrder = (action: string, selected: FlowBlock): void => {
    switch (action) {
      case 'moveToFront':
        this.moveToFront(selected);
        break;

      case 'moveForward':
        this.moveForward(selected);
        break;

      case 'moveBackward':
        this.moveBackward(selected);
        break;

      case 'moveToBack':
        this.moveToBack(selected);
        break;

      default:
        return;
    }
  };
}
