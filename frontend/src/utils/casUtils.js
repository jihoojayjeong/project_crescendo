export const handleLogout = () => {
    const casLogoutUrl = 'https://login.vt.edu/profile/cas/logout';
    window.open(casLogoutUrl, '_blank', 'width=500,height=500');
    window.location.href = 'https://crescendo.cs.vt.edu';
};