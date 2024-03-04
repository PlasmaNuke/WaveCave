import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as userActions from '../../store/user'
import { Outlet, useLoaderData } from "react-router-dom";
import * as trackActions from '../../store/track'
import TrackIndexItem from "../tracks/TrackIndexItem";

export default function UserView() {
    const user = useLoaderData();
    debugger
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (user.tracks) dispatch(trackActions.loadTracks(Object.keys(user.tracks)))
    }, [])

    // useEffect(() => {
    //     dispatch(userActions.viewUser({ username: user.username }));
    // }, [dispatch, user.username])
    
    
    return (
        <>
            {
                window.location.href.match(new RegExp('[^/]+(?=/$|$)'))[0] === encodeURIComponent(user.username) ?
                
                <div id="user-view page">
                    <h1>{ user.username }</h1>
                    <ul className="track-index">
                        {
                            user.tracks && Object.values(user.tracks).map(track => <li key={track.id}><TrackIndexItem track={track}/></li>)
                        }
                    </ul>
                </div>
                :
                <></>
            }
            <Outlet />
        </>
    )
}