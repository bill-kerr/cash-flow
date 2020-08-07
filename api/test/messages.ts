export const emptyMessage = (field: string) => `The ${field} field is required and should not be empty.`;
export const badTypeMessage = (field: string, fieldType: string) => `The ${field} field must contain ${fieldType}.`;
export const shouldNotBeEmptyMessage = (field: string, frequency: string) =>
  `The ${field} field should not be empty if frequency is set to ${frequency}.`;
