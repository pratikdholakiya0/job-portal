import React, { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

const ProfileProvider = ({Children}) => {
    const { token, profile } = useAuth();

    const [profileData, setProfileData] = useState();
    const BASE_URL = 'http://localhost:8080/api/v1';

    const fetchProfileData = async () =>{
      if(profileData){
        return profileData;
      }
      try {
            const response = await fetch(`${BASE_URL}/user/get-profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const profile = await response.json();
                setProfileData(profile);

                return profile;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch profile: ${response.status}`);
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
            setStatus({ message: error.message || "Could not connect to API to fetch profile.", type: 'error' });
        }
    }
  return (
    <ProfileContext.Provider value={{profileData, fetchProfileData}}>
        {Children}
    </ProfileContext.Provider>
  )
}

export default ProfileProvider

export const useProfile = () => useContext(ProfileContext);