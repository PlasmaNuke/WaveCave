import { useEffect, useState } from "react"
import TrackIndexItem from "./TrackIndexItem";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as trackActions from '../../store/track'

export default function TrackIndex() {
    const [loaded, setLoaded] = useState(false);
    const tracks = useSelector(state => state.tracks, shallowEqual)
    const dispatch = useDispatch();

    useEffect(() => {
        if(Object.keys(tracks)) {
            
        }
        fetch('/api/tracks').then(async val => {
            const tracksData = await val.json();
            dispatch(trackActions.receiveTracks(tracksData.tracks))
            setLoaded(true);
        })
    }, [])

    
    return (
        <ul
            className="track-index">
            {loaded && Object.values(tracks).map(track => <li key={`track ${track.title}`}><TrackIndexItem track={track} /></li>)}
        </ul>
    )
}