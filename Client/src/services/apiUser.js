

/*
/register -> POST
/login -> POST
/logout -> GET
/update-info -> PATCH
/update-password -> PATCH
/deactivate-account -> PATCH

/forgot-password -> POST
/reset-password -> PATCH
*/

import { getCandidateService } from "./apiCandidate";
import { getRecruiterService } from "./apiRecruiter";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const USER_BASE_URL= `${serverUrl}/api/user`;

export async function registerService({role, username, email, age, password, confirmPassword}) {
    try {
        const response = await fetch(`${USER_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({ role, username, email, age, password, confirmPassword })
        });

        const data = await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        return data;

    } catch (err) {
        throw new Error(err.message);
    }
}

export async function loginService({email, password}) {
    try {
        const response = await fetch(`${USER_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        let finalData={};
        finalData.loginInfo= data.data;

        if(data.data.user.role === 'candidate') {
            const candidate = await getCandidateService();
            finalData.roleInfo = candidate.data.finalCandidate;
        }
        else if(data.data.user.role === 'recruiter') {
            const candidate = await getRecruiterService();
            finalData.roleInfo = candidate.data.finalRecruiter;
        }

        return finalData;

    } catch (err) {
        throw new Error(err.message);
    }
}

export async function logoutService() {
    
    try {
        const response = await fetch(`${USER_BASE_URL}/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        const data = await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        return data;

    } catch (err) {
        throw new Error(err.message);
    }
}

export async function disableAccService({role}){
    try{
        const response= await fetch(`${USER_BASE_URL}/deactivate-account`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ role })
        });

        if (response.status === 204) {
            // If the response status is 204, return a success message or null
            return null; // or return any success message you want
        }

        else if(data.ok !== true){
            throw new Error("Error deactivating user. Please try again or refresh...");
        }

    } catch(err){
        throw new Error(err.message);
    }
}

export async function updateInfoService(formData) {
    try {
        const response = await fetch(`${USER_BASE_URL}/update-info`, {
            method: 'PATCH',
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: formData
        });

        const data = await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        return data;

    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updatePasswordService({currentPassword, newPassword, newConfirmPassword}) {
    try {
        const response = await fetch(`${USER_BASE_URL}/update-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({ currentPassword, newPassword, newConfirmPassword })
        });

        const data = await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        return data;

    } catch (err) {
        throw new Error(err.message);
    }
}

