/*
 Copyright 2024 CVS Health and/or one of its affiliates

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { format } from "date-fns"
import * as Constants from "../constants"

// Capitalize
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
  // Format price
  export function formatPrice(number) {
    const fnumber = parseFloat(number)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(fnumber)
  }

  // Concat name 
  export function personName (p) {
    let name = ""
    if(p && p.firstName)
      name = name.concat(p.firstName)
    if (p && p.lastName)
      name = name.concat(" ", p.lastName)  
    return name;
  }

  // Change the case to Proper Case 
  export function toProperCase (str) {
    if (str == null) {
        return '';
    }
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

  export function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  export function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  
  export function updateAudit(uid, obj) {
    if(!obj)
      return

    if(!obj.createdBy){
     obj["createdBy"] = uid;
     obj["createdDate"] = new Date();
    }
    obj["updatedBy"] = uid;
    obj["updatedDate"] = new Date();
}

export function formatDate(dt) {
  return format(dt.toDate(), Constants.DATE_FORMAT, { awareOfUnicodeTokens: true });
}

export function formatDateTime(dt) {
  return format(dt.toDate(), Constants.DATETIME_FORMAT, { awareOfUnicodeTokens: true });
}

// export function calculateSubscriptionEnd (dt, years) {
//     const start = new Date(dt.toDate())
//     const end = addYears(start, years);
//     console.log ('end: ' + end)
//     return end;
// }

// Removes null and empty values in a JSON object
export const removeEmptyJsonValues = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== "" && value !== undefined) {
          if (typeof value === "object") {
              const nestedObj = removeEmptyJsonValues(value);
              if (Object.keys(nestedObj).length !== 0) {
                  acc[key] = nestedObj;
              }
          } else {
              acc[key] = value;
          }
      }
      return acc;
  }, {});
};

// Remove a set of attributes from a JSON Object
export const removeJsonAttributes = (obj, attributes) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
      if (!attributes.includes(key)) {
          if (value !== null && value !== "" && value !== undefined && typeof value === "object") {
              const nestedObj = removeJsonAttributes(value, attributes);
              if (Object.keys(nestedObj).length !== 0) {
                  acc[key] = nestedObj;
              }
          } else {
              acc[key] = value;
          }
      }
      return acc;
  }, {});
};

// Include only the set of attributes from a JSON Object
export const includeJsonAttributes = (obj, attributes) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
      if (attributes.includes(key)) {
          if (typeof value === "object") {
              const nestedObj = includeJsonAttributes(value, attributes);
              if (Object.keys(nestedObj).length !== 0) {
                  acc[key] = nestedObj;
              }
          } else {
              acc[key] = value;
          }
      }
      return acc;
  }, {});
};

// Get only the "id" and "name" attributes from a JSON Object
export const getIdName = (obj) => {
  return includeJsonAttributes(obj, ["id", "name"]);
};

// Generate a random integer
export const generateRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// check if an id exists in a list of objects. Each object is assumed to have an attribute called 'id'
export const checkIdExists = (array, idToCheck) => {
  return array?.some((item) => item.id === idToCheck);
};

// Get an object with id in a list of objects. Each object is assumed to have an attribute called 'id'
export const getObjectById = (array, idToFind) => {
  return array.find((item) => item.id === idToFind);
};

// Get the index of object with id in a list of objects. Each object is assumed to have an attribute called 'id'
export const getIndexById = (array, idToFind) => {
  return array.findIndex((item) => item.id === idToFind);
};

// Delete an object with id in a list of objects. Each object is assumed to have an attribute called 'id'
export const deleteObjectById = (array, idToDelete) => {
  return array.filter((item) => item.id !== idToDelete);
};

// Sort objects in a list with the attribute named "asc". Add parameter to order in ascending or descending order
export const sortObjectsByOrder = (array, asc) => {
  return array.sort((a, b) => (a.order > b.order ? asc : -asc));
};

export const getDefaultCode = (array) => {
  return array.find((item) => item.default === true) ?? 1;
};

export const getAttributeCSV = (array, attribute) => {
  return array.map((item) => item[attribute]).join(", ");
};

export const getAttributeList = (array, attribute) => {
  return array.map((item) => item[attribute]);
};

