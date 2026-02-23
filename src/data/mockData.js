export const mockStates = [
  {
    id: "Karnataka",
    name: "Karnataka",
    totalIncidents: 128,
    verifiedLocations: 74,
    videosUploaded: 41,
    policeActionsTaken: 19,
    lastUpdated: "2026-02-10",
  },
  {
    id: "Maharashtra",
    name: "Maharashtra",
    totalIncidents: 192,
    verifiedLocations: 103,
    videosUploaded: 62,
    policeActionsTaken: 27,
    lastUpdated: "2026-02-11",
  },
];

export const mockDistricts = {
  Karnataka: [
    "Bengaluru Urban",
    "Mysuru",
    "Dakshina Kannada",
    "Belagavi",
    "Shivamogga",
  ],
  Maharashtra: ["Mumbai", "Pune", "Nashik", "Nagpur", "Thane"],
};

export const mockDistrictStats = {
  "Bengaluru Urban": {
    totalReports: 42,
    verifiedCases: 21,
    pendingVerification: 9,
    policeActions: 5,
    lastActivityDate: "2026-02-10",
  },
  Mysuru: {
    totalReports: 18,
    verifiedCases: 7,
    pendingVerification: 6,
    policeActions: 2,
    lastActivityDate: "2026-02-09",
  },
  "Dakshina Kannada": {
    totalReports: 11,
    verifiedCases: 5,
    pendingVerification: 3,
    policeActions: 1,
    lastActivityDate: "2026-02-08",
  },
  Belagavi: {
    totalReports: 9,
    verifiedCases: 4,
    pendingVerification: 2,
    policeActions: 1,
    lastActivityDate: "2026-02-07",
  },
  Shivamogga: {
    totalReports: 6,
    verifiedCases: 2,
    pendingVerification: 1,
    policeActions: 0,
    lastActivityDate: "2026-02-06",
  },
  Mumbai: {
    totalReports: 55,
    verifiedCases: 30,
    pendingVerification: 12,
    policeActions: 8,
    lastActivityDate: "2026-02-11",
  },
  Pune: {
    totalReports: 28,
    verifiedCases: 16,
    pendingVerification: 6,
    policeActions: 4,
    lastActivityDate: "2026-02-10",
  },
  Nashik: {
    totalReports: 17,
    verifiedCases: 9,
    pendingVerification: 4,
    policeActions: 2,
    lastActivityDate: "2026-02-09",
  },
  Nagpur: {
    totalReports: 14,
    verifiedCases: 7,
    pendingVerification: 3,
    policeActions: 1,
    lastActivityDate: "2026-02-08",
  },
  Thane: {
    totalReports: 12,
    verifiedCases: 6,
    pendingVerification: 3,
    policeActions: 2,
    lastActivityDate: "2026-02-07",
  },
};

export const mockDistrictRecords = {
  "Bengaluru Urban": [
    {
      id: "KA-BLR-01",
      location: "Mahadevapura",
      imageUrl:
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=400",
      videoUrl: "https://example.com/video/blr-01",
      state: "Karnataka",
      district: "Bengaluru Urban",
      policeAction: true,
    },
    {
      id: "KA-BLR-02",
      location: "Yelahanka",
      imageUrl:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      videoUrl: "https://example.com/video/blr-02",
      state: "Karnataka",
      district: "Bengaluru Urban",
      policeAction: false,
    },
  ],
  Mysuru: [
    {
      id: "KA-MYS-01",
      location: "Kuvempunagar",
      imageUrl:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
      videoUrl: "https://example.com/video/mys-01",
      state: "Karnataka",
      district: "Mysuru",
      policeAction: false,
    },
  ],
  Mumbai: [
    {
      id: "MH-MUM-01",
      location: "Andheri",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400",
      videoUrl: "https://example.com/video/mum-01",
      state: "Maharashtra",
      district: "Mumbai",
      policeAction: true,
    },
    {
      id: "MH-MUM-02",
      location: "Bandra",
      imageUrl:
        "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=400",
      videoUrl: "https://example.com/video/mum-02",
      state: "Maharashtra",
      district: "Mumbai",
      policeAction: true,
    },
  ],
  Pune: [
    {
      id: "MH-PUN-01",
      location: "Hinjawadi",
      imageUrl:
        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400",
      videoUrl: "https://example.com/video/pun-01",
      state: "Maharashtra",
      district: "Pune",
      policeAction: false,
    },
  ],
};
