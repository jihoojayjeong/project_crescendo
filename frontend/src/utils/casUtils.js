import axios from 'axios';

export const handleLogout = async () => {
    const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {}, {
            withCredentials: true
        });

        window.open(casLogoutUrl, '_blank', 'width=500,height=500');

        window.location.href = 'https://crescendo.cs.vt.edu';
    } catch (error) {
        console.error('Error logging out:', error);
    }
};
