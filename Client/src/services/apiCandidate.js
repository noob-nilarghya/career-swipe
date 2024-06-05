
/*
/ --> GET
/add --> POST
/edit --> PATCH
/remove --> PATCH
*/

const serverUrl = import.meta.env.VITE_SERVER_URL;
const CANDIDATE_BASE_URL= `${serverUrl}/api/candidate`;

export async function getCandidateService() {
    try {
        const response = await fetch(`${CANDIDATE_BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include' // equivalent to withCredentials: true in Axios
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

export async function addCandidateService(candidateObj) {
    try{
        const response = await fetch(`${CANDIDATE_BASE_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(candidateObj)
        });

        const data= await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function editCandidateService(candidateObj){
    try{
        const response = await fetch(`${CANDIDATE_BASE_URL}/edit`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(candidateObj)
        });

        const data= await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function removeCandidateService(candidateObj){
    try{
        const response = await fetch(`${CANDIDATE_BASE_URL}/remove`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(candidateObj)
        });

        const data= await response.json();

        if(data.status === 'fail'){
            throw new Error(data.message);
        }

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}