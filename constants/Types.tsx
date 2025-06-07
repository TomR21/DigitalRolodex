// Interface to store all data to put in the SQL database
export interface QueryInput {
  name: string,
  birthday: string | null,
  address: string | null,
  location: string | null,
  celnumber: string | null, 
  job: string | null,
  employer: string | null,
  hobbies: string | null,
  goals: string | null,
  wishes: string | null,
  recentEvents: string | null
}

// Interface to store all data retrieved from a row of the SQL database
export interface data_row {
  id: number,
  name: string,
  birthday: string | null,
  address: string | null,
  location: string | null, 
  celnumber: string | null, 
  job: string | null, 
  employer: string | null,
  hobbies: string | null, 
  goals: string | null, 
  wishes: string | null, 
  recentEvents: string | null
}

export interface Card {
    id: string,
    name: string
}