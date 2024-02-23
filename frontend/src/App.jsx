import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from 'react-router-dom';
import LoginForm from './components/session/LoginForm';
import SignUpForm from './components/session/SignUpForm';
import Navigation from './components/navigation/Navigation';
import * as sessionActions from './store/session';
import UserView from './components/users/UserView';
import AudioPlayerContainer from './components/audio/AudioPlayerContainer';
import TrackView from './components/tracks/TrackView';
import TrackUploadForm from './components/tracks/TrackUploadForm';
import Splash from './Splash';
import TrackUpdateForm from './components/tracks/TrackUpdateForm';
import HomePage from './HomePage';
import TrackIndex from './components/tracks/TrackIndex';




function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreSession()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation />
      {isLoaded && <Outlet />}
      <LoginForm />
      <AudioPlayerContainer />
    </>
  );
}


const userLoader = async ({request, params}) => {
  const response = await fetch(`/api/users/${params.username}`);
  if(response.ok) {
    const data = await response.json();
    if(data.user) {
      
      return data.user
    } else throw { message: `User ${params.username} does not exist`, status: 404 };
  } 
}

const trackLoader = async ({request, params}) => {
  const response = await fetch(`/api/users/${params.username}/tracks/${params.title}`).catch((reasons) => { throw reasons})
  
  if(response.ok) {
    const data = await response.json();
    if(data.track) {
      
      return data.track
    }
  }
  throw { message: 'track not found' }
}

const loginLoader = async ({request, params}) => {
  const response = await fetch('/api/session');

  return !!response.user
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '',
        loader: loginLoader,
        element: <HomePage />
      },
      {
        path: '/feed',
        element: <TrackIndex />
      },
      {
        path: "/login",
        element: <LoginForm />
      },
      {
        path: "/signup",
        element: <SignUpForm />
      },
      {
        path: '/upload',
        element: <TrackUploadForm />
      },
      {
        path: '/:username',
        loader: userLoader,
        element: <UserView />,
        // errorElement: <ErrorPage />,
        children: [
          {
            path: ':title',
            loader: trackLoader,
            element: <TrackView />,
            // errorElement: <ErrorPage />,
            children: [
              {
                path: 'update',
                element: <TrackUpdateForm />,
                // errorElement: <ErrorPage />
              }
            ]
          }
        ]
      },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
