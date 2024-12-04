export interface DraggableNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number;
  onChange?: (value: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  modifierKeys?: {
    default?: {
      multiplier: number;
      sensitivity: number;
    };
    shiftKey?: {
      multiplier: number;
      sensitivity: number;
    };
    ctrlKey?: {
      multiplier: number;
      sensitivity: number;
    };
    altKey?: {
      multiplier: number;
      sensitivity: number;
    };
    metaKey?: {
      multiplier: number;
      sensitivity: number;
    };
  };
  disablePointerLock?: boolean;
}
