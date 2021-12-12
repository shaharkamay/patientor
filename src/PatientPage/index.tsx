import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Patient, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";
import HealthRatingBar from "../components/HealthRatingBar";
import { useStateValue } from "../state";
import { Button, Icon, Table } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";
import { Entry } from "../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const [{ diagnoses }] = useStateValue();
  const [{ entries }] = useStateValue();
  const fetchStatus = useRef({ shouldFetch: true, hasFetched: false });

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id || '0'}/entries`,
        values
      );
      dispatch({ type: "ADD_ENTRY", payload: newEntry });
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };


  let patient: Patient | undefined;
  if(typeof id === 'string') {
    patient = patients[id];
  

    useEffect(() => {
      const fetchPatient = async () => {
        console.log('Fetching');
        fetchStatus.current = { ...fetchStatus.current, shouldFetch: false };
        try {
          const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
          dispatch({
            type: "UPDATE_PATIENT", payload: patientFromApi
          }); 
          fetchStatus.current = { ...fetchStatus.current, hasFetched: true };
          patient = patientFromApi;

          fetchStatus.current = { ...fetchStatus.current, shouldFetch: false };
          const diagnosesFromApi = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses/`);
          dispatch({
            type: "SET_DIAGNOSES", payload: diagnosesFromApi.data
          });
          fetchStatus.current = { ...fetchStatus.current, hasFetched: true };
          
          fetchStatus.current = { ...fetchStatus.current, shouldFetch: false };
          const patientEntries = patient.entries;
          dispatch({
            type: "SET_ENTRIES", payload: patientEntries
          });
          fetchStatus.current = { ...fetchStatus.current, hasFetched: true };

        } catch (e) {
          console.error(e);
        }
      };

      if (fetchStatus.current.shouldFetch) {
        void fetchPatient();
      }
    }, []);
  } 
  else patient = undefined; 

  if(patient) {
    return (
      <div>
          <h3>Patient page</h3>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Gender</Table.HeaderCell>
              <Table.HeaderCell>Occupation</Table.HeaderCell>
              <Table.HeaderCell>Health Rating</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              <Table.Row key={patient.id}>
                <Table.Cell>{patient.name}</Table.Cell>
                <Table.Cell>{patient.gender === 'male' ?  <Icon name="mars"/> : patient.gender === 'female' ?  <Icon name="venus"/> : <Icon name="venus mars" />}</Table.Cell>
                <Table.Cell>{patient.occupation}</Table.Cell>
                <Table.Cell>
                  <HealthRatingBar showText={false} rating={1} />
                </Table.Cell>
              </Table.Row>
          </Table.Body>
        </Table>
        <h3>Entries</h3>
        {Object.values(entries).map((entry, i) => {
          return (
            <div key={`entry${i}`}>
              <h4 key={`title${i}`}>entry {i + 1}:</h4>
              <div key={`date${i}`}>date: {entry.date}</div>
              <div key={`description${i}`}>description: {entry.description}</div>
              <div key={`specialist${i}`}>specialist: {entry.specialist}</div>
              <br />
              <div key={`diagnosisCodes${i}`}>
                {entry.diagnosisCodes && entry.diagnosisCodes.map((code, i) => {
                  return (
                    <div key={`code${i}`}>
                      <h5 key={`code-title${i}`}>diagnoses:</h5> 
                      <div key={`diagnose-name${i}`}>name: {diagnoses &&  Object.values(diagnoses).find(diagnose => diagnose.code === code)?.name}</div>
                      <div key={`diagnose-latin${i}`}>latin: {diagnoses &&  Object.values(diagnoses).find(diagnose => diagnose.code === code)?.latin}</div>
                      <br />
                    </div>
                  );
                })}
              </div>
              <br />
            </div>
          );
        })}
        <AddEntryModal 
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Entry</Button>

      </div>
    );
  }
  return null;
};

export default PatientPage;
