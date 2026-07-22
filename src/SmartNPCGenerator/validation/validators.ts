import type { Alignment } from '../types/enums';
import type { Occupation, Relationships } from '../types/sections';
import type { ValidationResult, Validator } from './types';

const VALIDATION_PENDING: ValidationResult = {
  status: 'pending',
  issues: [],
};

/** Placeholder validators expose stable contracts without applying rules yet. */
export const validateAge: Validator<number> = () => VALIDATION_PENDING;
export const validateRace: Validator<string> = () => VALIDATION_PENDING;
export const validateAlignment: Validator<Alignment> = () => VALIDATION_PENDING;
export const validateRelationships: Validator<Relationships> = () => VALIDATION_PENDING;
export const validateOccupation: Validator<Occupation> = () => VALIDATION_PENDING;
