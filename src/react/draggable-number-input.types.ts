export interface DraggableNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange?: (value: number) => void;
  disablePointerLock?: boolean;
} 