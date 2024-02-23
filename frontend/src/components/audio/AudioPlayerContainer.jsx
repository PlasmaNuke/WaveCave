
import './AudioPlayerContainer.css'
import { useEffect, useRef, useState } from "react";
import TrackDisplay from "./TrackDisplay";
import AudioControls from './AudioControls';
import AudioPlayer from './AudioPlayer';
import { useDispatch, useSelector } from 'react-redux';
import * as audioPlayerActions from '../../store/audioPlayer';
import ProgressBar from './ProgressBar';

export default function AudioPlayerContainer() {
    const dispatch = useDispatch();
    // const isPlaying = useSelector(state => state.audio.isPlaying)
    // const originalQueue = useSelector(state => state.audio.queue.original);
    // const shuffledQueue = useSelector(state => state.audio.queue.shuffled);

    // const [trackIndex, setTrackIndex] = useState(0);
    // const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex]);
    
    // const [timeProgress, setTimeProgress] = useState(0);
    // const [duration, setDuration] = useState(0);

    const audioRef = useRef();
    const progressBarRef = useRef();

    // useEffect(() => {
    //     setCurrentTrack(tracks[trackIndex]);
    //     setDuration(currentTrack.duration);
    //     setTimeProgress(0);
    // }, [trackIndex, currentTrack.duration])

    const handleNext = (e) => {
        e.preventDefault();
        dispatch(audioPlayerActions.playNext());
    }

    const handlePrev = (e) => {
        e.preventDefault();

        if(audioRef.current.currentTime <= 3) {
            dispatch(audioPlayerActions.playPrev());
        } else {
            audioRef.current.currentTime = 0
        }
    }

    return (
        <div className="audio-player">
            <div className="inner">
                <AudioControls {...{
                    handleNext,
                    handlePrev,
                }}/>
                <ProgressBar {...{
                    audioRef,
                    progressBarRef,
                }}/>
                 <AudioPlayer {...{
                    audioRef,
                    progressBarRef,
                    handleNext
                }}/>
                <TrackDisplay />
            </div>
        </div>
    )
}