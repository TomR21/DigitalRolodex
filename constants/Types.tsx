// Interface to store all data to put in the SQL database
export interface QueryInput {
  name: string,
  tag_id: number,
  birthday: string | null,
  address: string | null,
  location: string | null,
  celnumber: string | null, 
  email: string | null,
  job: string | null,
  employer: string | null,
  knowFrom: string | null,
  knowFromDate: string | null,
  lastMetDate: string | null,
  hobbies: string | null,
  goals: string | null,
  wishes: string | null,
  recentEvents: string | null,
  notes: string | null
}

// Interface to store all data retrieved from a row of the SQL database
export interface QueryOutput {
  id: number,
  name: string,
  tag_id: number,
  birthday: string | null,
  address: string | null,
  location: string | null, 
  celnumber: string | null, 
  email: string | null,
  job: string | null, 
  employer: string | null,
  know_from: string | null,
  know_from_date: string | null,
  last_met_date: string | null,
  hobbies: string | null, 
  goals: string | null, 
  wishes: string | null, 
  recent_events: string | null,
  notes: string | null
}

export interface Card {
    id: number,
    name: string
}

export interface Tag {
  id: number,
  tag_name: string
}

export interface BirthdayInfo {
  id: string,
  name: string,
  birthday: string // null not allowed because only entered birthday entries are considered
}

export interface RecentEventsData {
  id: string,
  name: string,
  recent_events: string  // null not allowed because only entered birthday entries are considered
}

export interface EventData {
  name: string, 
  event: string | undefined,  // allow undefined values if regex string does not match any characters
  daysLeft: number
}

export interface LastMetData {
  id: string,
  name: string,
  last_met_date: string,  // null not allowed because only entered birthday entries are considered
  daysDiff?: number,
  notify_recently_met: boolean,
  notify_number_days: number
}