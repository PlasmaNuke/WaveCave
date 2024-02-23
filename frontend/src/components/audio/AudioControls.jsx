import { useEffect, useState } from "react"
import * as audioPlayerActions from '../../store/audioPlayer';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import './AudioControls.css';

export default function AudioControls({ handleNext, handlePrev }) {
    const dispatch = useDispatch();

    const isPlaying = useSelector(state => state.audio.isPlaying);

    const isShuffled = useSelector(state => state.audio.isShuffled, shallowEqual);
    const isRepeating = useSelector(state => state.audio.isRepeating, shallowEqual);
    const [shuffleColor, setShuffleColor] = useState('Black');
    const [repeatColor, setRepeatColor] = useState('Black');

    

    const togglePlay = (e) => {
        e.stopPropagation();
        if(isPlaying)  {
            dispatch(audioPlayerActions.pauseTrack())
        } else {
            dispatch(audioPlayerActions.playTrack())
        }
    }

    const toggleShuffle = (e) => {
        e.preventDefault();
        if(isShuffled) {
            dispatch(audioPlayerActions.setShuffleOff());
        } else {
            dispatch(audioPlayerActions.setShuffleOn());
        }
    }

    const toggleRepeat = (e) => {
        switch(isRepeating) {
            case 'false':
                dispatch(audioPlayerActions.setRepeatOnce());
                break;
            case 'once':
                dispatch(audioPlayerActions.setRepeatAlways());
                break;
            case 'always':
                dispatch(audioPlayerActions.setRepeatFalse());
                break;
            default:
                console.log('lol react strict mode shit')
        }
    }
    
    

    useEffect(() => {
        isShuffled ? setShuffleColor('#f50') : setShuffleColor('Black')
    }, [isShuffled])

    useEffect(() => {
        isRepeating === 'false' ? setRepeatColor('Black') : setRepeatColor('#f50')
    }, [isRepeating])



    return (
        <div className="audio-controls container">
            <div className="track-controls container">
                <div className="previous button">
                    <i className="fa fa-step-backward" onClick={handlePrev}/>     
                </div>
                <div className="play-pause button">
                {isPlaying ? 
                    <i className='fa fa-pause' onClick={togglePlay} />
                    :
                    <i className='fa fa-play' onClick={togglePlay} />
                }
                </div>
                <div className="next button">
                    <i className="fa fa-step-forward" onClick={handleNext}></i>
                </div>
            </div>
            <div className="queue-controls container">
                <span style={{color: shuffleColor}}>
                    <div id="shuffle-button" className="shuffle button">
                        <i 
                            className="fa fa-random" 
                            onClick={toggleShuffle}
                        ></i>
                    </div>
                </span>
                <span style={{color: repeatColor}}>
                    <div className="repeat button">
                        <i 
                            className={
                                isRepeating === 'once' ? "wc-icon-cycle-1" : "wc-icon-cycle"
                            }
                            onClick={toggleRepeat}
                        ></i>
                    </div>
                </span>
            </div>
        </div>
    )
}