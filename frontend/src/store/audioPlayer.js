import { tracks } from "../data/tracks";
import * as trackActions from './track';

export const PLAY_TRACK = 'audioPlayer/PLAY_TRACK';
export const PAUSE_TRACK = 'audioPlayer/PAUSE_TRACK';
export const PLAY_NEXT = 'audioPlayer/PLAY_NEXT';
export const PLAY_PREV = 'audioPlayer/PLAY_PREV';
export const REPLAY_TRACK = 'audioPlayer/REPLAY_TRACK';
export const SET_SHUFFLE_ON = 'audioPlayer/SHUFFLE_ON';
export const SET_SHUFFLE_OFF = 'audioPlayer/SHUFFLE_OFF';
export const SET_REPEAT_OFF = 'audioPlayer/REPEAT_OFF';
export const SET_REPEAT_ONCE = 'audioPlayer/REPEAT_ONCE';
export const SET_REPEAT_ALWAYS = 'audioPlayer/REPEAT_ALWAYS';
export const LOAD_TRACKS = 'audioPlayer/LOAD_TRACKS';
export const LOAD_TRACK = 'audioPlayer/LOAD_TRACK';
export const SET_VOLUME = 'audioPlayer/SET_VOLUME';
export const UNLOAD_TRACKS = 'audioPlayer/UNLOAD_TRACKS';
export const RECEIVE_TRACK = 'audioPlayer/RECEIVE_TRACK';
export const RECEIVE_TRACKS = 'audioPlayer/RECEIVE_TRACKS';
const UNLOAD_TRACK = 'audioPlayer/UNLOAD_TRACK'

const initialState = { 
    queue: {
        original: [],
        shuffled: []
    },
    currentIndex: 0,
    currentTrackId: null,
    isPlaying: false,
    isShuffled: false,
    isRepeating: 'false',
    hasRepeated: false,
    volume: 60,
}

export const playTrack = () => {
    return {
        type: PLAY_TRACK
    }
}

export const pauseTrack = () => {
    return {
        type: PAUSE_TRACK
    }
}

export const playNext = () => {
    return {
        type: PLAY_NEXT
    }
}

export const playPrev = () => {
    return {
        type: PLAY_PREV
    }
}

export const loadTrack = trackId => {
    return {
        type: LOAD_TRACK,
        trackId
    }
}

export const loadTracks = trackIds => {
    return {
        type: LOAD_TRACKS,
        trackIds
    }
}

export const unloadTrack = trackId => {
    return {
        type: UNLOAD_TRACK,
        trackId
    }
}

export const setShuffleOn = () => {
    return {
        type: SET_SHUFFLE_ON,
    }
}

export const setShuffleOff = () => {
    return {
        type: SET_SHUFFLE_OFF
    }
}

export const setRepeatOnce = () => {
    return {
        type: SET_REPEAT_ONCE
    }
}

export const setRepeatAlways = () => {
    return {
        type: SET_REPEAT_ALWAYS
    }
}

export const setRepeatFalse = () => {
    return {
        type: SET_REPEAT_OFF
    }
}

export const loadTrackThunk = trackId => async (dispatch, getState) => {
    const state = getState();

    if (!!state.tracks[trackId]) return /* state.tracks[trackId] */
    dispatch(loadTrack(trackId))
}

export const loadTracksThunk = trackIds => async (dispatch, getState) => {
    debugger
    const state = getState();
    let tracks = {}
    for(const trackId of trackIds) { 
        if (!!state.tracks[trackId]) {
            tracks[trackId] = state.tracks[trackId]
            if(!state.audio.queue.original[trackId]) dispatch(loadTrack(trackId))
        }
        else {
            await dispatch(trackActions.loadTrack(trackId)); 
            dispatch(loadTrack(trackId));
        }
    }
    return tracks
}

const shuffle = (queue, currentTrackId = queue[0]) => {
    
    const indexOfId = queue.indexOf(currentTrackId);
    const newQueue = queue.filter(ele => ele !== currentTrackId)
    let idx = newQueue.length - 1, randIdx;
    if(newQueue.length <= 1) return queue;
    
    while (idx >= 0) {
        randIdx = Math.floor(Math.random() * idx + 1);
        [newQueue[idx], newQueue[randIdx]] = [newQueue[randIdx], newQueue[idx]]
        
        idx--;
    }
    let j = 0

    const completedQueue = queue.map((ele, i)=> {
        if(i === indexOfId) {
            return ele
        }
        j++;
        return newQueue[j - 1]
    })
    return completedQueue
}

export const audioPlayerReducer = (state = initialState, action) => {
    Object.freeze(state);

    let queue, shuffledQueue, newIndex, repeated;

    switch(action.type) {
        case PLAY_TRACK:
            return { ...state, 
                isPlaying: true,
            }
        case PAUSE_TRACK:
            return { ...state, isPlaying: false }
        case PLAY_NEXT:
            if(!state.queue.original.length) return state

            repeated = state.hasRepeated
            newIndex = state.currentIndex

            if(state.queue.original.length - 1 === state.currentIndex) {
                switch(state.isRepeating) {
                    case 'once':
                        
                        if(!state.hasRepeated) newIndex = 0
                        repeated = true
                        break;
                    case 'always':
                        newIndex = 0
                        repeated = true
                        break;
                    default:
                        newIndex = state.currentIndex
                }
            } else newIndex = state.currentIndex + 1
            return { ...state, 
                currentIndex: newIndex,
                isPlaying: true,
                hasRepeated: repeated
            };
        case PLAY_PREV:
            return { ...state,
                currentIndex: (state.currentIndex === 0 ? state.queue.original.length - 1 : state.currentIndex - 1),
                isPlaying: true
            };
        case LOAD_TRACK:
            return {...state,
                queue: {
                    original: [action.trackId],
                    shuffled: [action.trackId]
                }
            }
        case LOAD_TRACKS:
            queue = state.isShuffled ? state.queue.shuffled : state.queue.original
            shuffledQueue = shuffle([...action.trackIds], queue[state.currentIndex])
            return { ...state,
                queue: {
                    original: action.trackIds,
                    shuffled: shuffledQueue
                },
                hasRepeated: false
            };
        case SET_SHUFFLE_ON:
            queue = state.isShuffled ? state.queue.shuffled : state.queue.original
            shuffledQueue = shuffle(state.queue.original, queue[state.currentIndex])
            return { ...state,
                isShuffled: true,
                queue: {
                    original: state.queue.original,
                    shuffled: shuffledQueue
                }
            }
        case SET_SHUFFLE_OFF:
            newIndex = state.queue.original.indexOf(state.queue.shuffled[state.currentIndex])
            return { ...state, 
                isShuffled: false,
                currentIndex: newIndex
            }
        case SET_REPEAT_OFF:
            return { ...state,
                isRepeating: 'false'
            }
        case SET_REPEAT_ONCE:
            return { ...state,
                isRepeating: 'once'
            }
        case SET_REPEAT_ALWAYS:
            return { ...state, 
                isRepeating: 'always'
            }
        case UNLOAD_TRACK:
            var oldTrackId = state.isShuffled ? state.queue.shuffled[state.currentIndex] : state.queue.original[state.currentIndex]
            newIndex = (state.currentIndex === state.queue.original.length - 1 || !!state.queue.original.length) ? 0 : state.currentIndex + 1
            return { ...state,
                currentIndex: newIndex,
                queue: {
                    original: state.queue.original.filter(id => id !== oldTrackId),
                    queue: state.queue.shuffled.filter(id => id !== oldTrackId)
                }
            }
        default:
            return state;
    }
}