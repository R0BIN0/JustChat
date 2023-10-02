export type IFormSubmitButton = {
  label: string;
  isLoading: boolean;
  formIsValid: boolean;
  keyboardSubmit: {
    isAvailable: boolean;
    key?: string;
  };
};
