export interface DraggableLabelNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLLabelElement>, "onChange"> {
  className?: string;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
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
