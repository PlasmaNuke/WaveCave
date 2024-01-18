
import { tracks } from '../../data/tracks'
import { useEffect, useRef, useState } from "react";
import TrackDisplay from "./TrackDisplay";
import AudioControls from './AudioControls';
import AudioPlayer from './AudioPlayer';

export default function AudioPlayerContainer() {

    const [trackIndex, setTrackIndex] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex]);
    
    const [timeProgress, setTimeProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(currentTrack);
    const progressBarRef = useRef();

    useEffect(() => {
        setCurrentTrack(tracks[trackIndex]);
        setDuration(currentTrack.duration);
        setTimeProgress(0);
    }, [trackIndex, currentTrack.duration])

    const handleNext = () => {
        if(trackIndex >= tracks.length - 1) {
            setTrackIndex(0);
        } else {
            setTrackIndex(trackIndex + 1);
        }
    }

    const handlePrev = () => {
    }

    const audioPlayer = <AudioPlayer {...{
        currentTrack,
        audioRef,
        progressBarRef
    }}/>

    return (
        <div className="audio-player">
            <div className="inner">
                <TrackDisplay {...{
                    trackIndex,
                    timeProgress,
                    currentTrack,
                    handleNext,
                    audioRef,
                    progressBarRef
                }}/>
                <AudioControls {...{
                    trackIndex,
                    timeProgress,
                    currentTrack,
                    handleNext,
                    audioRef,
                    progressBarRef
                }}/>
                {audioPlayer}
            </div>
        </div>
    )
}