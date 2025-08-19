export const Consultants = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description:
      'Experienced financial advisor with 12 years of expertise in investment planning, retirement strategies, and wealth management. Specializes in helping individuals and families build long-term financial security through personalized investment portfolios and comprehensive financial planning.',
    timeZone: 'UTC-4',
    meetings: [
      {
        id: 'm1',
        day: 'Monday',
        date: '2025-08-18',
        start: '2025-08-18T13:00:00',
        end: '2025-08-18T13:30:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC-4',
      },
      {
        id: 'm2',
        day: 'Monday',
        date: '2025-08-18',
        start: '2025-08-18T14:00:00',
        end: '2025-08-18T15:00:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC-4',
      },
    ],
  },
  {
    id: 2,
    name: 'Michael Chen',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description:
      'Senior business consultant with over 15 years of experience in strategic planning, operational efficiency, and digital transformation. Helps small to medium enterprises optimize their processes, implement new technologies, and achieve sustainable growth in competitive markets.',
    timeZone: 'UTC-7',
    meetings: [
      {
        id: 'm3',
        day: 'Tuesday',
        date: '2025-08-19',
        start: '2025-08-19T15:00:00',
        end: '2025-08-19T16:00:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC-7',
      },
      {
        id: 'm4',
        day: 'Thursday',
        date: '2025-08-21',
        start: '2025-08-21T16:30:00',
        end: '2025-08-21T17:30:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC-7',
      },
    ],
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description:
      'Licensed clinical psychologist and career counselor with 8 years of experience in personal development, career transitions, and mental health support. Provides guidance for professionals seeking career changes, work-life balance, and personal growth strategies.',
    timeZone: 'UTC+0',
    meetings: [
      {
        id: 'm5',
        day: 'Wednesday',
        date: '2025-08-20',
        start: '2025-08-20T11:00:00',
        end: '2025-08-20T11:30:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC+0',
      },
    ],
  },
  {
    id: 4,
    name: 'James Patterson',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description:
      'Marketing strategist and brand consultant with 10 years of expertise in digital marketing, brand development, and customer acquisition. Specializes in helping startups and established businesses create compelling brand identities and effective marketing campaigns.',
    timeZone: 'UTC-4',
    meetings: [
      {
        id: 'm6',
        day: 'Thursday',
        date: '2025-08-21',
        start: '2025-08-21T18:00:00',
        end: '2025-08-21T19:30:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC-4',
      },
    ],
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    description:
      'Technology consultant and software architect with 14 years of experience in system design, cloud migration, and IT strategy. Helps organizations modernize their technology infrastructure, implement best practices, and navigate digital transformation initiatives successfully.',
    timeZone: 'UTC+9',
    meetings: [
      {
        id: 'm7',
        start: '2025-08-22T00:00:00',
        end: '2025-08-22T01:00:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC+9',
      },
      {
        id: 'm8',
        start: '2025-08-22T01:30:00',
        end: '2025-08-22T02:30:00',
        status: 'available',
        clientName: null,
        timeZone: 'UTC+9',
      },
    ],
  },
];

export default Consultants;

// export const Consultants = [
//   {
//     id: 1,
//     name: 'Dr. Sarah Johnson',
//     image:
//       'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//     description:
//       'Experienced financial advisor with 12 years of expertise in investment planning, retirement strategies, and wealth management.',
//     meetings: [
//       {
//         id: 'm1',
//         start: '2025-08-18T09:00:00',
//         end: '2025-08-18T09:30:00',
//         status: 'available', // available | booked
//         clientName: null,
//       },
//       {
//         id: 'm2',
//         start: '2025-08-18T10:00:00',
//         end: '2025-08-18T11:00:00',
//         status: 'available',
//         clientName: null,
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Michael Chen',
//     image:
//       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//     description:
//       'Senior business consultant with over 15 years of experience in strategic planning, operational efficiency, and digital transformation.',
//     meetings: [
//       {
//         id: 'm3',
//         start: '2025-08-19T08:00:00',
//         end: '2025-08-19T09:00:00',
//         status: 'available',
//         clientName: null,
//       },
//       {
//         id: 'm4',
//         start: '2025-08-19T09:30:00',
//         end: '2025-08-19T10:30:00',
//         status: 'available',
//         clientName: null,
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: 'Dr. Emily Rodriguez',
//     image:
//       'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//     description:
//       'Licensed clinical psychologist and career counselor with 8 years of experience in personal development, career transitions, and mental health support.',
//     meetings: [
//       {
//         id: 'm5',
//         start: '2025-08-20T11:00:00',
//         end: '2025-08-20T11:30:00',
//         status: 'available',
//         clientName: null,
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: 'James Patterson',
//     image:
//       'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//     description:
//       'Marketing strategist and brand consultant with 10 years of expertise in digital marketing, brand development, and customer acquisition.',
//     meetings: [
//       {
//         id: 'm6',
//         start: '2025-08-21T14:00:00',
//         end: '2025-08-21T15:30:00',
//         status: 'available',
//         clientName: null,
//       },
//     ],
//   },
//   {
//     id: 5,
//     name: 'Dr. Lisa Thompson',
//     image:
//       'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
//     description:
//       'Technology consultant and software architect with 14 years of experience in system design, cloud migration, and IT strategy.',
//     meetings: [
//       {
//         id: 'm7',
//         start: '2025-08-22T09:00:00',
//         end: '2025-08-22T10:00:00',
//         status: 'available',
//         clientName: null,
//       },
//       {
//         id: 'm8',
//         start: '2025-08-22T10:30:00',
//         end: '2025-08-22T11:30:00',
//         status: 'available',
//         clientName: null,
//       },
//     ],
//   },
// ];

// export default Consultants;
