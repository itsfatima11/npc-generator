export type ValidationField =
  | 'age'
  | 'race'
  | 'alignment'
  | 'relationships'
  | 'occupation';

export interface ValidationIssue {
  readonly field: ValidationField;
  readonly code: string;
  readonly message: string;
}

export type ValidationResult =
  | { readonly status: 'pending'; readonly issues: readonly [] }
  | { readonly status: 'valid'; readonly issues: readonly [] }
  | { readonly status: 'invalid'; readonly issues: readonly ValidationIssue[] };

export type Validator<Value> = (value: Value) => ValidationResult;
