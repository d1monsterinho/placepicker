const GET_ALL_CARDPLACES_URL = 'http://localhost:3000/places';
const GET_USER_CARDPLACES_URL = 'http://localhost:3000/user-places';
const UPDATE_USER_CARDPLACES_URL = 'http://localhost:3000/user-places';

export async function fetchAllCardplaces() {
    const response = await fetch(GET_ALL_CARDPLACES_URL);

    if (!response.ok) {
        throw new Error(`Error Occurred Related to Data Fetching: ${GET_ALL_CARDPLACES_URL}`);
    }

    const body = await response.json();

    return body.places;
}

export async function fetchUserCardplaces() {
    const response = await fetch(GET_USER_CARDPLACES_URL);
    console.log('calling api');

    if (!response.ok) {
        throw new Error(`Error Occurred Related to Data Fetching: ${GET_USER_CARDPLACES_URL}`);
    }

    const body = await response.json();

    return body.places;
}

export async function updateUserCardplaces(places) {
    const response = await fetch(UPDATE_USER_CARDPLACES_URL, {
        method: 'PUT',
        body: JSON.stringify({places}),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error Occured Related to Updating User Cardplaces: ${UPDATE_USER_CARDPLACES_URL}`)
    }

    const body = await response.json();

    return body.message;
}