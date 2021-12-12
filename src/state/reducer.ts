import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: 'UPDATE_PATIENT';
      payload: Patient;
    }
  | {
      type: "SET_ENTRIES";
      payload: Entry[];
    }
  | {
      type: 'ADD_ENTRY';
      payload: Entry;
    }
  | {
      type: 'SET_DIAGNOSES';
      payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
      case "UPDATE_PATIENT":
        return {
          ...state,
          patients: {
            ...state.patients,
            [action.payload.id]: {
              ...state.patients[action.payload.id],
              ...action.payload,
            },
          }
        };
      case "ADD_ENTRY":
        return {
          ...state,
          entries: {
            ...state.entries,
            [action.payload.id]: action.payload
          }
        };
      case "SET_DIAGNOSES":
        return {
          ...state,
          diagnoses: {
            ...action.payload.reduce(
              (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
              {}
            ),
            ...state.diagnoses
          }
        };
      case "SET_ENTRIES":
        return {
          ...state,
          entries: {
            ...action.payload.reduce(
              (memo, entry) => ({ ...memo, [entry.id]: entry }),
              {}
            ),
            ...state.entries
          }
        };
    default:
      return state;
  }
};
