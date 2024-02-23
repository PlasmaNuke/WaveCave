import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as userActions from '../../store/user'
import { Outlet, useLoaderData } from "react-router-dom";
import * as trackActions from '../../store/track'
import TrackIndexItem from "../tracks/TrackIndexItem";

export default function UserView() {
    const user = useLoaderData();
    const dispatch = useDispatch();
    const tracks = useSelector(state => state.tracks, shallowEqual);
    const [trackIndexItems, setTrackIndexItems] = useState([]);

    const currentUser = useSelector(state => state.session.user);

    useEffect(() => {
        user.tracks ? dispatch(trackActions.loadTracks(Object.keys(user.tracks))) : null
    }, [])

    useEffect(() => {
        dispatch(userActions.viewUser({ username: user.username }));
    }, [dispatch, user.username])

    useEffect(() => {
        if(!!user.tracks) setTrackIndexItems(Object.values(user.tracks))
    }, [tracks])
    
    
    return (
        <>
            {
                window.location.href.match(new RegExp('[^/]+(?=/$|$)'))[0] === user.username ?
                
                <div id="user-view page">
                    <h1>{ user.username }</h1>
                    {
                        trackIndexItems.map(track => <><TrackIndexItem track={track}/></>)
                    }
                </div>
                :
                <></>
            }
            <Outlet />
        </>
    )
}