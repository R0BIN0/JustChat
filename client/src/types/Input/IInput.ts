export type IInput = {
  type: {
    originalValue?: string;
    condition?: boolean;
    otherValue: string;
  };
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
};
