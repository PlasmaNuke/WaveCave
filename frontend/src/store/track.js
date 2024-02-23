import csrfFetch from "./csrf"

const RECEIVE_TRACK = 'tracks/RECEIVE_TRACK'
const RECEIVE_TRACKS = 'tracks/RECEIVE_TRACKS'
const REMOVE_TRACK = 'tracks/REMOVE_TRACK'
const REMOVE_TRACKS = 'tracks/REMOVE_TRACKS'

export async function deleteTrack (trackId) {
    const response = await csrfFetch(`/api/tracks/${trackId}`, {
        method: 'DELETE'
    })
    

    if(response.ok) {
        const data = await response.json();
        return data
    }
}

const initialState = {}

export const receiveTrack = track => {
    return {
        type: RECEIVE_TRACK,
        track
    }
}

export const receiveTracks = tracks => {
    return {
        type: RECEIVE_TRACKS,
        tracks
    }
}

export const removeTrack = trackId => {
    return {
        type: REMOVE_TRACK,
        trackId
    }
}

export const removeTracks = trackIds => {
    return {
        type: REMOVE_TRACKS,
        trackIds
    }
}

export const loadTrack = trackId => async (dispatch, getState) => {
    debugger
    const state = getState();

    if (!!state.tracks[trackId]) return state.tracks[trackId]
    const response = await fetch(`/api/tracks/${trackId}`);

    if(response.ok) {
        let data = await response.json();
        dispatch(receiveTrack(data.track));
        return data.track;
    }
}

export const loadTracks = trackIds => async (dispatch, getState) => {
    debugger
    const state = getState();
    let tracks = {}
    let i = 0;
    for(const trackId of trackIds) { 
  
        if(!!state.tracks[trackId]) {
            tracks[trackId] = state.tracks[trackId]
        }
        else {
            const response = await fetch(`/api/tracks/${trackId}`);

            if (response.ok) {
                let data = await response.json();
                dispatch(receiveTrack(data.track));
                tracks[trackId] = data.track
            }
        }
    }
    return tracks
}

export async function createTrack (trackData, audioFile, imageFile) {
    const { title, description, genre, duration, fileType } = trackData;
    
    const formData = new FormData();
    formData.append('track[title]', title);
    formData.append('track[description]', description);
    formData.append('track[genre]', genre);
    formData.append('track[duration]', duration);
    formData.append('track[file_type]', fileType);
    if (audioFile) formData.append('track[source]', audioFile);
    if (imageFile) formData.append('track[photo]', imageFile)
    const response = await csrfFetch(`api/tracks`, {
        method: 'POST',
        body: formData
    })
    
    let data = await response.json();
    
    return data
}

export async function updateTrack (trackData, audioFile, imageFile) {
    const { id, title, description, genre, duration, fileType } = trackData;
    
    const formData = new FormData();
    if(!!title) formData.append('track[title]', title);
    if(!!description) formData.append('track[description]', description);
    if(!!genre) formData.append('track[genre]', genre);
    if(!!duration) formData.append('track[duration]', duration);
    if(!!fileType) formData.append('track[fileType]', fileType);
    if(!!audioFile) formData.append('track[source]', audioFile);
    if(!!imageFile) formData.append('track[photo]', imageFile)

    const response = await csrfFetch(`/api/tracks/${id}`, {
        method: 'PUT',
        body: formData
    })
    
    let data = await response.json();
    
    return data
}

const trackReducer = (state = initialState, action) => {
    Object.freeze(state)

    switch(action.type) {
        case RECEIVE_TRACK:
            return { ...state, ...action.track }
        case RECEIVE_TRACKS:
            return { ...state, ...action.tracks }
        case REMOVE_TRACK:
            return Object.fromEntries(Object.keys(state).filter((key) => action.trackId !== key).map((key) => [key, state[key]]))
        case REMOVE_TRACKS:
            return Object.fromEntries(Object.keys(state).filter((key) => !action.trackIds.includes(key)).map((key) => [key, state[key]]))
        default:
            return state;
    }
}

export default trackReducer;