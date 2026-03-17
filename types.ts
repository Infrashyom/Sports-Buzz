export enum UserRole {
  ADMIN = 'ADMIN',
  SCHOOL = 'SCHOOL',
  STUDENT = 'STUDENT',
  REFEREE = 'REFEREE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  mobile?: string;
  // Referee Specific
  rating?: number; // 0-5
  experience?: string;
  certifications?: { name: string; status: 'Pending' | 'Verified' }[];
  availability?: boolean;
  status?: 'Active' | 'Pending' | 'Inactive';
}

export interface Facility {
  id: string;
  name: string;
  type: 'Indoor' | 'Outdoor' | 'Pool' | 'Gym' | 'Field';
  status: 'Available' | 'Maintenance' | 'Booked';
}

export interface School {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  logo: string;
  isSubscribed: boolean;
  paymentStatus?: 'Paid' | 'Pending' | 'Overdue';
  studentCount: number;
  participatedStudents?: number;
  cityRank: number;
  facilities?: Facility[];
  description?: string;
  phone?: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string; // Internal School ID
  grade: string; // e.g. "10th", "11th"
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  schoolId: string;
  sports: string[]; // List of sports they play
  status: 'Active' | 'Injured' | 'Alumni';
  avatar?: string;
  badges?: string[]; // List of badges/awards
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  schoolId: string;
  coach: string;
  playerIds: string[]; // IDs of Students
  season: string;
  stats: {
    played: number;
    won: number;
    lost: number;
    draw: number;
  };
}

export interface Sport {
  id: string;
  name: string;
  type: 'Indoor' | 'Outdoor';
  icon: string;
  rules?: string[]; // List of rules
}

export interface Match {
  id: string;
  tournamentId?: string; // Link to tournament
  sport: string;
  date: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  // Detailed scoring for specific sports
  details?: {
    overs?: string;
    wicketsA?: number;
    wicketsB?: number;
    setsA?: number;
    setsB?: number;
    quarters?: string;
  };
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'VERIFIED';
  refereeId: string;
  location: string;
  manOfTheMatchId?: string; // ID of the player
}

export interface StatData {
  name: string;
  value: number;
}

export interface Tournament {
  id?: string;
  _id?: string;
  name: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  startDate: string;
  endDate: string;
  sport: string;
  teams: number;
  // Extended details
  description?: string;
  location?: string;
  participatingSchoolIds?: string[];
  prizePool?: string;
  organizer?: string;
  pointsTable?: PointsTableEntry[];
  refereeEditedPointsTable?: boolean;
}

export interface PointsTableEntry {
  rank: number;
  tournamentId?: string; // Link to tournament
  team: string;
  played: number;
  won: number;
  lost: number;
  draw: number;
  points: number;
  nrr?: string; // For Cricket
  diff?: number; // For others
  sport: string;
}