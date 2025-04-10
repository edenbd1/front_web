import { getJSON, postJSON, putJSON, deleteJSON } from '../api-client/api-client';

export interface Contact {
  _id: string;
  name: string;
  surname: string;
  nickname: string;
  phone: string;
  email: string;
  company: string;
  education: string;
  dateOfBirth: string | null;
  address: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export async function getContacts(token: string): Promise<Contact[]> {
  return getJSON('/api/contacts', token);
}

export async function createContact(
  name: string, 
  surname: string, 
  nickname: string,
  phone: string,
  email: string,
  company: string,
  education: string,
  dateOfBirth: string | null, 
  address: string, 
  token: string
): Promise<Contact> {
  return postJSON('/api/contacts', { 
    name, 
    surname, 
    nickname, 
    phone, 
    email, 
    company, 
    education, 
    dateOfBirth, 
    address 
  }, token);
}

export async function updateContact(id: string, data: Partial<Contact>, token: string): Promise<Contact> {
  return putJSON(`/api/contacts/${id}`, data, token);
}

export async function deleteContact(id: string, token: string): Promise<void> {
  await deleteJSON(`/api/contacts/${id}`, token);
} 