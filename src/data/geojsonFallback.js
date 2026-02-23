export const indiaFallback = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { st_nm: "Karnataka", state_code: "KA" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [74.5, 15.8],
            [78.5, 15.8],
            [78.5, 12.3],
            [74.5, 12.3],
            [74.5, 15.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { st_nm: "Maharashtra", state_code: "MH" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.5, 22.1],
            [79.0, 22.1],
            [79.0, 16.5],
            [72.5, 16.5],
            [72.5, 22.1],
          ],
        ],
      },
    },
  ],
};

export const stateFallback = {
  Karnataka: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { dist_nm: "Bengaluru Urban" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [77.3, 13.3],
              [77.9, 13.3],
              [77.9, 12.8],
              [77.3, 12.8],
              [77.3, 13.3],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { dist_nm: "Mysuru" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [76.3, 12.6],
              [76.9, 12.6],
              [76.9, 12.0],
              [76.3, 12.0],
              [76.3, 12.6],
            ],
          ],
        },
      },
    ],
  },
  Maharashtra: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { dist_nm: "Mumbai" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [72.7, 19.3],
              [73.1, 19.3],
              [73.1, 18.9],
              [72.7, 18.9],
              [72.7, 19.3],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { dist_nm: "Pune" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [73.6, 18.6],
              [74.2, 18.6],
              [74.2, 18.1],
              [73.6, 18.1],
              [73.6, 18.6],
            ],
          ],
        },
      },
    ],
  },
};
