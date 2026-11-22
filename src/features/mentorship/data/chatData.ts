export type Message = {
  id: string;
  sender: 'mentor' | 'student';
  text: string;
  time: string;
  read?: boolean;
};

export type Conversation = {
  id: string;
  mentorName: string;
  mentorRole: string;
  mentorTrack: string;
  avatarUrl: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  tags: string[];
  unreadCount?: number;
  upcomingSession?: {
    date: string;
    time: string;
  };
  messages: Message[];
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'alex-rivera',
    mentorName: 'Alex Rivera',
    mentorRole: 'Senior Product Designer',
    mentorTrack: 'Frontend Development',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastMessage: 'Sure — send me the section you want to review.',
    lastMessageTime: '2:14 PM',
    tags: ['Frontend Dev', 'Upcoming Wed'],
    upcomingSession: {
      date: 'Wednesday, Oct 25',
      time: '4:30 PM – 5:15 PM',
    },
    messages: [
      {
        id: '1',
        sender: 'mentor',
        text: 'Hi Maya! What would you like to work on before our next session?',
        time: '10:14 AM',
      },
      {
        id: '2',
        sender: 'student',
        text: "I'm struggling with the state management in my React project.",
        time: '10:15 AM',
        read: true,
      },
      {
        id: '3',
        sender: 'mentor',
        text: "Send me the part that's causing trouble and we can go through it together.",
        time: '10:17 AM',
      },
    ],
  },
  {
    id: 'tariq-al-mansoor',
    mentorName: 'Tariq Al-Mansoor',
    mentorRole: 'Lead Software Architect',
    mentorTrack: 'Full Stack Architecture',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastMessage: 'Great work on resolving the component state...',
    lastMessageTime: 'Yesterday',
    tags: ['React Arch'],
    upcomingSession: {
      date: 'Monday, Oct 30',
      time: '2:00 PM – 2:45 PM',
    },
    messages: [
      {
        id: '1',
        sender: 'mentor',
        text: 'Great work on resolving the component state issues in the PR!',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'dr-aisha-patel',
    mentorName: 'Dr. Aisha Patel',
    mentorRole: 'Lead Advisor & Principal',
    mentorTrack: 'Data & Systems Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isOnline: true,
    lastMessage: 'Review the system checklist before our next...',
    lastMessageTime: 'Oct 18',
    tags: ['Lead Advisor'],
    upcomingSession: {
      date: 'Thursday, Nov 2',
      time: '11:00 AM – 11:45 AM',
    },
    messages: [
      {
        id: '1',
        sender: 'mentor',
        text: 'Review the system checklist before our next review session.',
        time: 'Oct 18',
      },
    ],
  },
];
