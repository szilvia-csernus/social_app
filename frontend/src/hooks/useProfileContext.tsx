import { useContext } from "react";
import { ProfileDataContext, SetProfileDataContext } from "../contexts/ProfileDataContext";

export const useProfileData = () => {
    const profileData = useContext(ProfileDataContext);
    return profileData
}

export const useSetProfileData = () => {
    const { setProfileData } = useContext(SetProfileDataContext);
    return setProfileData
}

export const useHandleFollow = () => {
    const { handleFollow } = useContext(SetProfileDataContext);
    return handleFollow
}

export const useHandleUnfollow = () => {
    const { handleUnfollow } = useContext(SetProfileDataContext);
    return handleUnfollow
}