// /utils/auth.js
const setToken = (token) => localStorage.setItem('token', token);
const getToken = () => localStorage.getItem('token');
const removeToken = () => localStorage.removeItem('token');

const auth = { setToken, getToken, removeToken };

export default auth;
