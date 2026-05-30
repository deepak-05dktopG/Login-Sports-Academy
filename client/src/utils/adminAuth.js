/**
 * What it is: Admin login helper (stores/reads admin token in the browser).
 * Non-tech note: This keeps the admin logged in on this device.
 */

export const ADMIN_TOKEN_STORAGE_KEY = 'adminToken'

// Reads the stored JWT admin token from localStorage
export const getAdminToken = () => {
    try {
		return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
	} catch {
		return null
	}
};

// Returns true if an admin JWT token exists in localStorage
export const isAdminAuthenticated = () => {
    return Boolean(getAdminToken());
};

// Saves the admin JWT token to localStorage after successful login
export const setAdminToken = token => {
    try {
		localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, String(token))
		// Backward-compat with old access-code-based flow
		localStorage.setItem('isAdmin', 'true')
	} catch {
		// ignore
	}
};

// Removes the admin JWT token from localStorage (logs the admin out)
export const clearAdminToken = () => {
    try {
		localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
		localStorage.removeItem('isAdmin')
	} catch {
		// ignore
	}
};

// Builds a request headers object with the admin Bearer token included
export const getAdminAuthHeaders = (baseHeaders = {}) => {
    const token = getAdminToken()
    if (!token) return { ...(baseHeaders || {}) }
    return { ...(baseHeaders || {}), Authorization: `Bearer ${token}` }
};

// Wraps the native fetch() with admin auth headers automatically attached
export const adminFetch = (url, options = {}) => {
    const headers = getAdminAuthHeaders(options.headers || {})
    return fetch(url, { ...options, headers })
};

// Decodes the JWT admin token and returns the payload (e.g. { role, adminDbId, email })
// Returns null if no token or token is malformed
export const getLoggedInAdmin = () => {
    try {
        const token = getAdminToken();
        if (!token) return null;
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

// Returns true if the logged-in admin has the 'superadmin' role
export const isSuperAdmin = () => {
    const admin = getLoggedInAdmin();
    return admin?.role === 'superadmin';
};

