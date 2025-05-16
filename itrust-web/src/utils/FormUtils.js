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

// Validation utils

export const handleFormChange = (setFormData, e) => {
    const { name, value, type, checked } = e.target;
    // console.log('name: ', name, 'value: ', value, 'type: ', type, 'checked: ', checked)
    // For checkboxes
    if (type === "checkbox") {
        setFormData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    } else if (name.includes(".")) {
        const [parentKey, childKey] = name.split(".");
        setFormData((prevState) => ({
            ...prevState,
            [parentKey]: {
                ...prevState[parentKey],
                [childKey]: value,
            },
        }));
    } else {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
};

// compare two objects to see if they are equal
export const  deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
      return true;
    }
  
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      return false;
    }
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
  }

  // format two json objects in the same order
  export const stringifyWithSortedProperties = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return JSON.stringify(obj);
    }
  
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};
    for (const key of sortedKeys) {
      sortedObj[key] = stringifyWithSortedProperties(obj[key]);
    }
    return JSON.stringify(sortedObj);
  }
  