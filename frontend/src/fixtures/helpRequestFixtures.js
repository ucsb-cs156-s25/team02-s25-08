const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "joegaucho@ucsb.edu",
    teamId: "s25-6pm-1",
    tableOrBreakoutRoom: "1",
    requestTime: "2022-01-02T12:00:00",
    explanation: "Repo starter code failing",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "joegaucho@ucsb.edu",
      teamId: "s25-6pm-1",
      tableOrBreakoutRoom: "1",
      requestTime: "2025-01-02T12:00:00",
      explanation: "Repo starter code not working",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "janegaucho@ucsb.edu",
      teamId: "s25-6pm-5",
      tableOrBreakoutRoom: "12",
      requestTime: "2025-04-03T12:00:00",
      explanation: "Unusual error code when making new file",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "ndalexander@ucsb.edu",
      teamId: "s25-5pm-8",
      tableOrBreakoutRoom: "8",
      requestTime: "2025-04-29T17:10:00",
      explanation: "Github workflow failing on startup",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };
