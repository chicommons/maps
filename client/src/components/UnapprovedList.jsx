import React from 'react'
import RenderCoopList from "./RenderCoopList";

const UnapprovedList = () => {
    let sampleData = [
        {
          "id": 94,
          "name": "Blackstone Bicycle Works",
          "addresses": [
            {
              "id": 92,
              "street_number": "6100",
              "route": "Ave.",
              "raw": "6100 S. Blackstone Ave.",
              "formatted": "6100 S. Blackstone Ave.",
              "latitude": 41.78388065,
              "longitude": -87.59038586,
              "locality": {
                "id": 4,
                "name": "Chicago",
                "postal_code": "60637",
                "state": {
                  "id": 19313,
                  "code": "IL",
                  "name": "Illinois",
                  "country": {
                    "id": 484,
                    "name": "United States",
                    "code": "US"
                  }
                }
              }
            }
          ]
        },
        {
          "id": 750,
          "name": "The Recyclery Collective",
          "addresses": [
            {
              "id": 712,
              "street_number": "7628",
              "route": "St",
              "raw": "7628 N Paulina St",
              "formatted": "7628 N Paulina St",
              "latitude": 42.01990194,
              "longitude": -87.67318087,
              "locality": {
                "id": 35,
                "name": "Chicago",
                "postal_code": "60626",
                "state": {
                  "id": 19313,
                  "code": "IL",
                  "name": "Illinois",
                  "country": {
                    "id": 484,
                    "name": "United States",
                    "code": "US"
                  }
                }
              }
            }
          ]
        },
        {
          "id": 817,
          "name": "West Town Bikes",
          "addresses": [
            {
              "id": 776,
              "street_number": "2459",
              "route": "Street",
              "raw": "2459 West Division Street",
              "formatted": "2459 West Division Street",
              "latitude": 41.90291137,
              "longitude": -87.68847062,
              "locality": {
                "id": 45,
                "name": "Chicago",
                "postal_code": "60622",
                "state": {
                  "id": 19313,
                  "code": "IL",
                  "name": "Illinois",
                  "country": {
                    "id": 484,
                    "name": "United States",
                    "code": "US"
                  }
                }
              }
            }
          ]
        },
        {
          "id": 841,
          "name": "Working Bikes Cooperative",
          "addresses": [
            {
              "id": 796,
              "street_number": "2434",
              "route": "Ave",
              "raw": "2434 S Western Ave",
              "formatted": "2434 S Western Ave",
              "latitude": 41.8470678,
              "longitude": -87.68559226,
              "locality": {
                "id": 98,
                "name": "Chicago",
                "postal_code": "60608",
                "state": {
                  "id": 19313,
                  "code": "IL",
                  "name": "Illinois",
                  "country": {
                    "id": 484,
                    "name": "United States",
                    "code": "US"
                  }
                }
              }
            }
          ]
        }
      ];

    return (
        <>
            <RenderCoopList link={"/approve-coop/"} searchResults={sampleData}  columnOneText={"Unapproved Entities"} columnTwoText={"Review"} />
        </>
    )
}

export default UnapprovedList;
