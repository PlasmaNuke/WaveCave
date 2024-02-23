import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux"; // useDispatch
import './AudioPlayerContainer.css'
// import * as audioPlayerActions from "../../store/audioPlayer";

export default function AudioPlayer({ audioRef, handleNext }) {
    // const dispatch = useDispatch();
    const currentTrack = useSelector(state => {
        if(state.audio.isShuffled) {
            return state.tracks[state.audio.queue.shuffled[state.audio.currentIndex]]
        }
        return state.tracks[state.audio.queue.original[state.audio.currentIndex]]
    }, (a, b) => {
        debugger
        if (!a || !b) return true
        const filteredkeys = Object.keys(a).filter(k => !['photoUrl', 'sourceUrl'].includes(k));
        const aObj = new Object();
        const bObj = new Object();
        filteredkeys.forEach(e => {
            aObj[e] = a[e]
            bObj[e] = b[e]
        });

        return shallowEqual(aObj, bObj)
    })

    const isPlaying = useSelector(state => state.audio.isPlaying, shallowEqual);
    const vol = useSelector(state => state.audio.volume, shallowEqual);
    

    useEffect(() => {
        if (isPlaying && !audioRef.current.classList.contains('loaded')) {
        audioRef.current.onloadeddata = (e) => {
            e.preventDefault();
            e.target.classList.add('loaded')
            e.target.play();
        }
        } else if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause()
        }
    }), [isPlaying]

    useEffect(() => {
        if(currentTrack !== undefined) {
            document.getElementsByClassName('audio-track')[0].src = currentTrack.sourceUrl
        }
    }, [currentTrack])

    return (
        <audio 
            className={`audio-track ${currentTrack?.title || ''}`}
            ref={audioRef}
            onEnded={handleNext}
            volume={vol * .01}
        />
    )
}