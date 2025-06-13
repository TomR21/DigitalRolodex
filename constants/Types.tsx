// Interface to store all data to put in the SQL database
export interface QueryInput {
  name: string,
  birthday: string | null,
  address: string | null,
  location: string | null,
  celnumber: string | null, 
  email: string | null,
  job: string | null,
  employer: string | null,
  knowFrom: string | null,
  knowFromDate: string | null,
  hobbies: string | null,
  goals: string | null,
  wishes: string | null,
  recentEvents: string | null,
  notes: string | null
}

// Interface to store all data retrieved from a row of the SQL database
export interface data_row {
  id: number,
  name: string,
  birthday: string | null,
  address: string | null,
  location: string | null, 
  celnumber: string | null, 
  email: string | null,
  job: string | null, 
  employer: string | null,
  know_from: string | null,
  know_from_date: string | null,
  hobbies: string | null, 
  goals: string | null, 
  wishes: string | null, 
  recent_events: string | null,
  notes: string | null
}

export interface Card {
    id: string,
    name: string
}

export interface BirthdayInfo {
  id: string,
  name: string,
  birthday: string // null not allowed because only entered birthday entries are considered
}