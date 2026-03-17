import { Match, School, StatData, Student, Team, Tournament, User, UserRole, Sport, PointsTableEntry } from '../types';

export const MOCK_GALLERY = [
  { _id: 'g1', title: 'Championship Finals 2023', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80', description: 'The winning moment of the state basketball finals.' },
  { _id: 'g2', title: 'Inter-School Cricket', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80', description: 'Springfield High vs Riverside Academy.' },
  { _id: 'g3', title: 'Annual Sports Day', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80', description: 'Track and field events at the city stadium.' },
  { _id: 'g4', title: 'Badminton Open', imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80', description: 'Regional badminton tournament highlights.' }
];

export const MOCK_QUERIES = [
  { _id: 'q1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', message: 'I would like to know how to register my school for the upcoming tournament.', status: 'PENDING', createdAt: '2023-10-25T10:00:00Z' },
  { _id: 'q2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', message: 'Is there a limit to the number of teams a school can register?', status: 'RESOLVED', createdAt: '2023-10-24T14:30:00Z' }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Admin User',
  email: 'admin@sportsbuzz.com',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/200'
};

export const MOCK_SCHOOLS: School[] = [
  { 
    id: 's1', 
    name: 'Springfield High', 
    address: '123 Main St, Springfield', 
    contactEmail: 'info@springfield.edu', 
    phone: '(555) 123-4567',
    description: 'Home of the Spartans. Dedicated to academic and athletic excellence since 1952.',
    logo: 'https://picsum.photos/100', 
    isSubscribed: true, 
    studentCount: 1200, 
    cityRank: 1,
    facilities: [
      { id: 'f1', name: 'Main Gymnasium', type: 'Indoor', status: 'Available' },
      { id: 'f2', name: 'North Cricket Ground', type: 'Field', status: 'Booked' },
      { id: 'f3', name: 'Badminton Court A', type: 'Indoor', status: 'Available' },
    ]
  },
  { id: 's2', name: 'Riverside Academy', address: '45 River Rd', contactEmail: 'sports@riverside.edu', logo: 'https://picsum.photos/101', isSubscribed: true, studentCount: 850, cityRank: 3 },
  { id: 's3', name: 'Lincoln Tech', address: '88 Tech Blvd', contactEmail: 'admin@lincoln.edu', logo: 'https://picsum.photos/102', isSubscribed: false, studentCount: 600, cityRank: 12 },
];

export const MOCK_SPORTS: Sport[] = [
  { id: 'sp1', name: 'Cricket', type: 'Outdoor', icon: '🏏' },
  { id: 'sp2', name: 'Badminton', type: 'Indoor', icon: '🏸' },
  { id: 'sp3', name: 'Basketball', type: 'Indoor', icon: '🏀' },
];

// Generate more students for full rosters
const generateStudents = (): Student[] => {
  const baseStudents: Student[] = [
    { id: 'st1', name: 'Jordan Mike', studentId: 'SP-2023-001', grade: '12th', dob: '2005-04-12', gender: 'Male', schoolId: 's1', sports: ['Cricket', 'Basketball'], status: 'Active', avatar: 'https://picsum.photos/seed/st1/150', badges: ['Man of the Match', 'Best Batsman'] },
    { id: 'st2', name: 'Sarah Connor', studentId: 'SP-2023-042', grade: '11th', dob: '2006-08-23', gender: 'Female', schoolId: 's1', sports: ['Badminton', 'Basketball'], status: 'Active', avatar: 'https://picsum.photos/seed/st2/150', badges: ['Fair Play Award'] },
    { id: 'st3', name: 'Tom Holland', studentId: 'SP-2024-101', grade: '10th', dob: '2007-06-01', gender: 'Male', schoolId: 's1', sports: ['Cricket'], status: 'Active', avatar: 'https://picsum.photos/seed/st3/150' },
    { id: 'st4', name: 'Emily Blunt', studentId: 'SP-2023-005', grade: '12th', dob: '2005-02-14', gender: 'Female', schoolId: 's1', sports: ['Badminton'], status: 'Injured', avatar: 'https://picsum.photos/seed/st4/150' },
    { id: 'st5', name: 'Chris Evans', studentId: 'SP-2024-055', grade: '9th', dob: '2008-01-15', gender: 'Male', schoolId: 's1', sports: ['Basketball'], status: 'Active', avatar: 'https://picsum.photos/seed/st5/150' },
  ];

  for (let i = 6; i <= 30; i++) {
    baseStudents.push({
      id: `st${i}`,
      name: `Player ${i}`,
      studentId: `SP-2024-${100+i}`,
      grade: '10th',
      dob: '2007-01-01',
      gender: 'Male',
      schoolId: 's1',
      sports: ['Cricket'],
      status: 'Active',
      avatar: `https://picsum.photos/seed/st${i}/150`,
      badges: []
    });
  }
  return baseStudents;
};

export const MOCK_STUDENTS: Student[] = generateStudents();

export const MOCK_TEAMS: Team[] = [
  { 
    id: 'team1', 
    name: 'Springfield High', 
    sport: 'Cricket', 
    schoolId: 's1', 
    coach: 'Coach Shastri', 
    playerIds: ['st1', 'st3', 'st6', 'st7', 'st8', 'st9', 'st10', 'st11', 'st12', 'st13', 'st14', 'st15', 'st16', 'st17', 'st18'], 
    season: 'Summer 2023',
    stats: { played: 10, won: 8, lost: 2, draw: 0 }
  },
  { 
    id: 'team2', 
    name: 'Riverside Academy', 
    sport: 'Cricket', 
    schoolId: 's2', 
    coach: 'Coach Ponting', 
    playerIds: ['st19', 'st20', 'st21', 'st22', 'st23', 'st24', 'st25', 'st26', 'st27', 'st28', 'st29'], 
    season: 'Summer 2023',
    stats: { played: 10, won: 6, lost: 4, draw: 0 }
  },
  { 
    id: 'team3', 
    name: 'Hoop Masters', 
    sport: 'Basketball', 
    schoolId: 's1', 
    coach: 'Coach Carter', 
    playerIds: ['st1', 'st5', 'st2'], 
    season: 'Winter 2023',
    stats: { played: 15, won: 10, lost: 5, draw: 0 }
  },
  { 
    id: 'team4', 
    name: 'Shuttle Smashers', 
    sport: 'Badminton', 
    schoolId: 's1', 
    coach: 'Coach Gopichand', 
    playerIds: ['st2', 'st4'], 
    season: 'Spring 2023',
    stats: { played: 8, won: 6, lost: 2, draw: 0 }
  }
];

// Generate extra matches for pagination
const generateMatches = (): Match[] => {
  const baseMatches: Match[] = [
    { id: 'm1', tournamentId: 't1', sport: 'Cricket', date: '2023-10-15 09:00', teamA: 'Springfield High', teamB: 'Riverside Academy', scoreA: 180, scoreB: 150, status: 'VERIFIED', refereeId: 'r1', location: 'City Oval', manOfTheMatchId: 'st1' },
    { id: 'm2', tournamentId: 't1', sport: 'Cricket', date: '2023-10-22 09:00', teamA: 'Lincoln Tech', teamB: 'Springfield High', scoreA: 140, scoreB: 142, status: 'VERIFIED', refereeId: 'r1', location: 'Tech Ground', manOfTheMatchId: 'st3' },
    { id: 'm3', tournamentId: 't1', sport: 'Cricket', date: '2023-11-05 09:00', teamA: 'Springfield High', teamB: 'St. Marys', scoreA: null, scoreB: null, status: 'SCHEDULED', refereeId: 'r1', location: 'City Oval' },
    { id: 'm4', tournamentId: 't2', sport: 'Basketball', date: '2023-11-15 16:00', teamA: 'Springfield High', teamB: 'Riverside Academy', scoreA: 88, scoreB: 85, status: 'VERIFIED', refereeId: 'r2', location: 'Indoor Arena', manOfTheMatchId: 'st5' },
    { id: 'm5', tournamentId: 't2', sport: 'Basketball', date: '2023-11-20 16:00', teamA: 'Springfield High', teamB: 'Lincoln Tech', scoreA: 72, scoreB: 80, status: 'VERIFIED', refereeId: 'r2', location: 'Indoor Arena' },
    { id: 'm6', tournamentId: 't2', sport: 'Basketball', date: '2023-11-25 17:00', teamA: 'West High', teamB: 'Springfield High', scoreA: null, scoreB: null, status: 'SCHEDULED', refereeId: 'r2', location: 'West Gym' },
    { id: 'm7', tournamentId: 't3', sport: 'Badminton', date: '2023-09-10 10:00', teamA: 'Springfield High', teamB: 'Riverside Academy', scoreA: 3, scoreB: 1, status: 'VERIFIED', refereeId: 'r2', location: 'Sports Complex', manOfTheMatchId: 'st2' },
  ];

  // Add 12 more mock matches
  for(let i = 8; i < 20; i++) {
    const isUpcoming = i % 2 === 0;
    const isCricket = i % 3 === 0;
    baseMatches.push({
      id: `m${i}`,
      tournamentId: isCricket ? 't1' : 't2',
      sport: isCricket ? 'Cricket' : 'Basketball',
      date: isUpcoming ? '2023-12-10 10:00' : '2023-08-15 10:00',
      teamA: 'Springfield High',
      teamB: `Opponent ${i}`,
      scoreA: isUpcoming ? null : 80 + i,
      scoreB: isUpcoming ? null : 70 + i,
      status: isUpcoming ? 'SCHEDULED' : 'VERIFIED',
      refereeId: 'r1',
      location: isUpcoming ? 'Home Ground' : 'Away Stadium'
    });
  }
  return baseMatches;
};

export const MOCK_MATCHES: Match[] = generateMatches();

export const MOCK_TOURNAMENTS: Tournament[] = [
  { 
    id: 't1', 
    name: 'City T20 Blast', 
    status: 'ONGOING', 
    startDate: '2023-10-01', 
    endDate: '2023-11-30', 
    sport: 'Cricket', 
    teams: 12,
    description: 'The premier T20 cricket tournament for city schools. Winner qualifies for state level selection. All matches played with standard white ball regulations.',
    location: 'City Sports Complex',
    participatingSchoolIds: ['s1', 's2'],
    prizePool: '$5,000 Equipment Grant',
    organizer: 'City Cricket Association'
  },
  { 
    id: 't2', 
    name: 'Winter Hoops League', 
    status: 'UPCOMING', 
    startDate: '2023-12-01', 
    endDate: '2024-02-28', 
    sport: 'Basketball', 
    teams: 16,
    description: 'Winter season basketball league. Open to U-16 and U-18 teams. Round robin format followed by knockout playoffs.',
    location: 'Indoor Arena',
    participatingSchoolIds: ['s1'],
    prizePool: '$3,000 + Trophy',
    organizer: 'National Basketball Fed'
  },
  { 
    id: 't3', 
    name: 'Badminton Open', 
    status: 'COMPLETED', 
    startDate: '2023-08-01', 
    endDate: '2023-09-15', 
    sport: 'Badminton', 
    teams: 8,
    description: 'Annual inter-school badminton championship.',
    location: 'School Gymnasiums',
    participatingSchoolIds: ['s1', 's2', 's3'],
    prizePool: 'Medals & Certificates',
    organizer: 'Schools Union'
  },
  {
    id: 't4',
    name: 'Spring Soccer Fest',
    status: 'UPCOMING',
    startDate: '2024-03-10',
    endDate: '2024-04-20',
    sport: 'Football',
    teams: 10,
    description: '7-a-side football tournament for junior teams.',
    location: 'Central Park Fields',
    participatingSchoolIds: [],
    prizePool: 'Trophy + New Kit Sponsor',
    organizer: 'City Sports Council'
  }
];

export const MOCK_POINTS_TABLE: PointsTableEntry[] = [
  { rank: 1, tournamentId: 't1', team: 'Springfield High', played: 10, won: 8, lost: 2, draw: 0, points: 16, nrr: '+1.245', sport: 'Cricket' },
  { rank: 2, tournamentId: 't1', team: 'Riverside Academy', played: 10, won: 7, lost: 3, draw: 0, points: 14, nrr: '+0.890', sport: 'Cricket' },
  { rank: 3, tournamentId: 't1', team: 'Lincoln Tech', played: 10, won: 5, lost: 5, draw: 0, points: 10, nrr: '-0.120', sport: 'Cricket' },
  { rank: 4, tournamentId: 't1', team: 'St. Marys', played: 10, won: 4, lost: 6, draw: 0, points: 8, nrr: '-0.550', sport: 'Cricket' },
  
  { rank: 1, tournamentId: 't2', team: 'Springfield High', played: 15, won: 12, lost: 3, draw: 0, points: 24, diff: 120, sport: 'Basketball' },
  { rank: 2, tournamentId: 't2', team: 'West High', played: 15, won: 11, lost: 4, draw: 0, points: 22, diff: 95, sport: 'Basketball' },
  { rank: 3, tournamentId: 't2', team: 'Riverside Academy', played: 15, won: 9, lost: 6, draw: 0, points: 18, diff: 45, sport: 'Basketball' },
  
  { rank: 1, tournamentId: 't3', team: 'Riverside Academy', played: 8, won: 8, lost: 0, draw: 0, points: 16, diff: 24, sport: 'Badminton' },
  { rank: 2, tournamentId: 't3', team: 'Springfield High', played: 8, won: 6, lost: 2, draw: 0, points: 12, diff: 14, sport: 'Badminton' },
];

export const MOCK_STATS_PARTICIPATION: StatData[] = [
  { name: 'Cricket', value: 450 },
  { name: 'Basketball', value: 300 },
  { name: 'Badminton', value: 200 },
];

export const MOCK_STATS_REVENUE: StatData[] = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

export const MOCK_REFEREES: User[] = [
  { id: 'r1', name: 'Coach Whistle', email: 'ref1@sportsbuzz.com', role: UserRole.REFEREE, avatar: 'https://picsum.photos/seed/ref1/200', rating: 4, certifications: [{ name: 'Level 2 Umpire', status: 'Verified' }, { name: 'BWF Basic', status: 'Pending' }] },
  { id: 'r2', name: 'Jane Official', email: 'ref2@sportsbuzz.com', role: UserRole.REFEREE, avatar: 'https://picsum.photos/seed/ref2/200', rating: 5, certifications: [{ name: 'FIBA Referee', status: 'Verified' }] },
];