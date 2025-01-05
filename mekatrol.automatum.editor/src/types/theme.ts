export interface ElementStyles {
  color: string;
  fill: string;
  fillOpacity: string;
  stroke: string;
  strokeWidth: string;
  strokeWidthSelected: string;
  radius: number;
}

export interface IconBackgroundStyle {
  fill: string;
  opacity: string;
}

export interface IconSvgStyle {
  fill: string;
  opacity: string;
  stroke: string;
  strokeWidth: string;
}

export interface IconStyle {
  background: IconBackgroundStyle;
  svg: IconSvgStyle;
}

export type ThemeDefinition = {
  blockStyles: ElementStyles;
  blockIconStyles: IconStyle;
  blockFunctionLabelStyles: ElementStyles;
  blockLabelStyles: ElementStyles;
  blockIoStyles: ElementStyles;
  connectionStyles: ElementStyles;
};

export const defaultTheme: ThemeDefinition = {
  blockStyles: {
    color: '#eee',
    fill: '#333',
    fillOpacity: '100%',
    stroke: '#a0a0a0',
    strokeWidth: '2px',
    strokeWidthSelected: '4px',
    radius: 3
  },
  blockIconStyles: {
    background: {
      fill: '#3333ff',
      opacity: '70%'
    },

    svg: {
      fill: '#fff',
      opacity: '100%',
      stroke: '#ddd',
      strokeWidth: '10px'
    }
  },
  blockFunctionLabelStyles: {
    color: '#eee',
    fill: '#333',
    fillOpacity: '100%',
    stroke: '#aa1010',
    strokeWidth: '3px',
    strokeWidthSelected: '4px',
    radius: 3
  },
  blockLabelStyles: {
    color: '#eee',
    fill: '#333',
    fillOpacity: '100%',
    stroke: '#aa1010',
    strokeWidth: '3px',
    strokeWidthSelected: '4px',
    radius: 3
  },
  blockIoStyles: {
    color: '#eee',
    fill: '#333',
    fillOpacity: '100%',
    stroke: '#fff',
    strokeWidth: '1px',
    strokeWidthSelected: '4px',
    radius: 3
  },
  connectionStyles: {
    color: '#eee',
    fill: 'none',
    fillOpacity: '100%',
    stroke: '#eeeeee',
    strokeWidth: '3px',
    strokeWidthSelected: '4px',
    radius: 1
  }
};

export const getBlockTheme = (functionType: string): ThemeDefinition => {
  switch (functionType) {
    case 'And':
      return defaultTheme;
    case 'Average':
      return defaultTheme;
    case 'Calculator':
      return defaultTheme;
    case 'Calendar':
      return defaultTheme;
    case 'Clamp':
      return defaultTheme;
    case 'Comparator':
      return defaultTheme;
    case 'Delay':
      return defaultTheme;
    case 'If':
      return defaultTheme;
    case 'Invert':
      return defaultTheme;
    case 'Max':
      return defaultTheme;
    case 'Min':
      return defaultTheme;
    case 'Or':
      return defaultTheme;
    case 'Override':
      return defaultTheme;
    case 'Pid':
      return defaultTheme;
    case 'Pulse':
      return defaultTheme;
    case 'Schedule':
      return defaultTheme;
    case 'Selector':
      return defaultTheme;
    case 'Sequence':
      return defaultTheme;
    case 'Span':
      return defaultTheme;
    case 'Split':
      return defaultTheme;
    case 'Timer':
      return defaultTheme;
    case 'Xnor':
      return defaultTheme;
    case 'Xor':
      return defaultTheme;
    default:
      return defaultTheme;
  }
};
