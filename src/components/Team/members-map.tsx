"use client";

import SectionTitle from "../Common/SectionTitle";
import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const stateAbbreviations: { [key: string]: string } = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};

const memberStates: { [key: string]: boolean } = {
  NC: true,
  IL: true,
  IN: true,
  NJ: true,
  PA: true,
  MO: true,
};

const statesWithMembers = Object.keys(memberStates)
  .filter((abbr) => memberStates[abbr])
  .map((abbr) => stateAbbreviations[abbr]);

const MembersMap: React.FC = () => {
  return (
    <section className="container py-16 md:py-20 lg:py-28">
      <SectionTitle
        title="Our Reach"
        paragraph="Our team members are located across the United States. Currently, we
        have members in 7 states."
        mb="2.5rem"
      />
      <div className="p-8">
        <ComposableMap projection="geoAlbersUsa" width={800} height={500}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.name;
                const hasMember = statesWithMembers.includes(stateName);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hasMember ? "#3652c3" : "#DDD"}
                    stroke="#FFF"
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </section>
  );
};

export default MembersMap;
