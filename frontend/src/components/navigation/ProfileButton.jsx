import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink } from 'react-router-dom';
import './ProfileButton.css'



function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef(null)
    
    const toggleMenu = (e) => {
      e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
      setShowMenu(!showMenu);
    };

    const handleUploadClick = (e) => {
      e.preventDefault();

    }
    
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = (e) => {
        if (!dropdownRef?.current?.contains(e.target)) {
          setShowMenu(false);
        }
      };
  
      window.addEventListener('click', closeMenu);
    
      return () => window.removeEventListener('click', closeMenu);
    }, [showMenu]);
  
    const logout = (e) => {
      
      e.preventDefault();
      dispatch(sessionActions.logout());
    };
  
    return (
      <div className='profile-menu'>
        <div className='nav-link profile'>
          <button className="dropbtn" onClick={toggleMenu}>
            <i className="fa-solid fa-user-circle" />
          </button>
        {showMenu && (
        <div className='profile-dropdown-container'>
          <ul className="profile-dropdown" ref={dropdownRef}>
            <NavLink className="nav-link profile" to={`/${user.username}`} replace={true}>{user.username}</NavLink>
            <li>
              <NavLink className="nav-link upload" to='/upload'>Upload Tracks</NavLink>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        </div>
        )}
        </div>
      </div>
    );
  }
  
export default ProfileButton;