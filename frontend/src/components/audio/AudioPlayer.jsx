import { useEffect } from "react";
import { useSelector } from "react-redux"; // useDispatch
import './AudioPlayerContainer.css'
// import * as audioPlayerActions from "../../store/audioPlayer";

export default function AudioPlayer({ audioRef, progressBarRef, handleNext }) {
    // const dispatch = useDispatch();
    const currentTrack = useSelector(state => {
        if(state.audio.isShuffled) {
            return state.tracks[state.audio.queue.shuffled[state.audio.currentIndex]]
        }
        return state.tracks[state.audio.queue.original[state.audio.currentIndex]]
    })
    const isPlaying = useSelector(state => state.audio.isPlaying);
    
    const audio = <audio 
            className={`audio-track ${currentTrack?.title || ''}`}
            ref={audioRef}
            onEnded={handleNext}
        />


    useEffect(() => {
        if(isPlaying) {
            
            if(audioRef.current.loaded) {
                audioRef.current.play();
            } else {
                audioRef.current.onloadeddata = (e) => {
                    e.preventDefault();
                    
                    e.target.play();
                }
            }
        } else {
            audioRef.current.pause();
        }
    })

    useEffect(() => {
        if(currentTrack !== undefined) {
            document.getElementsByClassName('audio-track')[0].src = currentTrack.sourceUrl
        }
    }, [currentTrack])



    return (
        <>
            {audio}
        </>
    )
}