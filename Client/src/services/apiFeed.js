
/*
/batch/:batchSize/offset/:offsetLength --> POST
/right-swipe --> POST
/left-swipe --> POST
*/

const serverUrl = import.meta.env.VITE_SERVER_URL;
const FEED_BASE_URL= `${serverUrl}/api/feed`;

export async function getFeedService({batchSize, offsetLength, preference}) {
    try {

        const response = await fetch(`${FEED_BASE_URL}/batch/${batchSize}/offset/${offsetLength}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({preference})
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

export async function rightSwipeService({currentUserID}) {
    try {
        const response = await fetch(`${FEED_BASE_URL}/right-swipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({currentUserID})
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

export async function leftSwipeService({currentUserID}) {
    try {
        const response = await fetch(`${FEED_BASE_URL}/left-swipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // equivalent to withCredentials: true in Axios
            body: JSON.stringify({currentUserID})
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