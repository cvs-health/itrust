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

import axiosInstance from "./AxiosInstance";

// Save an identity 
export const saveIdentity = async (data) => {
    try {
        const response = await axiosInstance.post("/mock/api/v1/identities", JSON.stringify(data));
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};


// Create a mock identity and save it 
export const createExternalIdentities = async (criteria) => {
    try {
        const response = await axiosInstance.post("/mock/api/v1/identity", JSON.stringify(criteria));
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Create a mock identity and save it 
export const createMockPerson = async (criteria) => {
    try {
        const response = await axiosInstance.post("/mock/api/v1/person", JSON.stringify(criteria));
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find external identities
export const findExternalIdentities = async (criteria) => {
    try {
        const response = await axiosInstance.post("/mock/api/v1/identities/search", JSON.stringify(criteria));
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

export const findExternalIdentityById = async (id) => {
    try {
        const response = await axiosInstance.get(`/mock/api/v1/identities/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export const findUniqueCompanies = async () => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/codelist/companies");
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export const findUniqueIdentityTypes = async () => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/codelist/identity_types");
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export const findUniqueIdentityProviders = async () => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/codelist/identity_providers");
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export const findUniqueApplicationNames = async () => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/codelist/application_names");
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Update Identity 
export const updateIdentity = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/mock/api/v1/identities/${id}`, data);
        // if(response.status !== 200) {
        //     throw new Error("Network response was not ok");
        // }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find work credentials 
export const findWorkCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/work?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find patient identity credentials
export const findPatientIdentityCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/patient_identity?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find professional license credentials 
export const findProfessionalLicenseCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/professional_license?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find education credentials 
export const findEducationCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/education?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find Allergy Credentials 
export const findAllergyCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/allergy?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find immunization credentials 
export const findImmunizationCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/immunization?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find medical condition credentials 
export const findMedicalConditionCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/medical_condition?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find medication credentials
export const findMedicationCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/medication?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find medical insurance credentials 
export const findMedicalInsuranceCredentials = async (count) => {
    try {
        const response = await axiosInstance.get("/mock/api/v1/credentials/medical_insurance?count="+count);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Delete DAS
export const deleteExternalIdentity = async (id) => {
    try {
        const response = await axiosInstance.delete(`/mock/api/v1/identities/${id}`);
        // console.log("Delete External Identity response: ", response);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};


// Create a interview schedules
export const createMockInterviewSchedules = async (criteria) => {
    try {
        const response = await axiosInstance.post("/mock/api/v1/interviews", JSON.stringify(criteria));
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Create mock trainings 
export const createMockTrainings = async (criteria) => {
    try {
        const response = await axiosInstance.post("/mock/api/v1/trainings", JSON.stringify(criteria));
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};