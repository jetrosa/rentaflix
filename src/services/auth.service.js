class AuthService {

    login(profileData) {
        localStorage.setItem("user", JSON.stringify(profileData));
    }

    /**
     * Removes user from browser local storage
     */
    logout() {
        localStorage.removeItem("user");
    }

    /**
     * Returns the current user from browser local storage
     * @returns {any}
     */
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();