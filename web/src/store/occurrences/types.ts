export interface Occurrence {
  object: 'occurrence';
  date: string;
  amount: number;
  description: string;
  schedule: string;
  originalDate: string;
}

export interface OccurrenceState {
  occurrences: Occurrence[];
}

export const FETCH_OCCURRENCES_START = 'Occurrences:FetchStart';
export const FETCH_OCCURRENCES_COMPLETE = 'Occurrences:FetchComplete';
export const FETCH_OCCURRENCES_ERROR = 'Occurrences:FetchError';

export interface IFetchOccurrencesCompleteAction {
  type: typeof FETCH_OCCURRENCES_COMPLETE;
  occurrences: Occurrence[];
}

export interface IFetchOccurrencesStartAction {
  type: typeof FETCH_OCCURRENCES_START;
}

export interface IFetchOccurrencesErrorAction {
  type: typeof FETCH_OCCURRENCES_ERROR;
  error: string;
}

export type OccurrenceActionTypes =
  | IFetchOccurrencesCompleteAction
  | IFetchOccurrencesStartAction
  | IFetchOccurrencesErrorAction;
