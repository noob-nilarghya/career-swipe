
/*
/get-list-of-matched-user --> GET
/get-list-of-conversation --> GET
/role-info --> POST
/first-send-message/:recieverID --> POST
/send/:recieverID --> POST
/get/:otherUserID --> GET
/block-user --> POST
/isBlocked/:otherUserID --> GET
*/

const serverUrl = import.meta.env.VITE_SERVER_URL;
const MESSAGE_BASE_URL= `${serverUrl}/api/message`;

export async function getMatchedUserService() { // GET
    try {

        const response = await fetch(`${MESSAGE_BASE_URL}/get-list-of-matched-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
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

export async function getMessageUserService() { // GET
    try {

        const response = await fetch(`${MESSAGE_BASE_URL}/get-list-of-conversation`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
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

export async function getRoleInfoService({otherUserID, role}) { // POST
    try {
        const response = await fetch(`${MESSAGE_BASE_URL}/role-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({ otherUserID, role })
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

export async function sendFirstMessageService({message, recieverID}) {  // POST
    try {
        const response = await fetch(`${MESSAGE_BASE_URL}/first-send-message/${recieverID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({ message })
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

export async function sendMessageService({message, recieverID}) { // POST
    try {
        const response = await fetch(`${MESSAGE_BASE_URL}/send/${recieverID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({ message })
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

export async function getMessageService({otherUserID}) { // GET
    try {
        const response = await fetch(`${MESSAGE_BASE_URL}/get/${otherUserID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
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

export async function blockUserService({toBeBlockedID}) { // POST
    try {
        const response = await fetch(`${MESSAGE_BASE_URL}/block-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({toBeBlockedID})
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

export async function isBlockedService({otherUserID}) { // GET
    try {
        const response = await fetch(`${MESSAGE_BASE_URL}/isBlocked/${otherUserID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
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