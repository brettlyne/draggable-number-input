export interface DraggableLabelNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLLabelElement>, "onChange"> {
  className?: string;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  value: number;
  onChange?: (value: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  children?: React.ReactNode;
  disablePointerLock?: boolean;
  noInput?: boolean;
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
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
