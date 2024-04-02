export default function localStorageAvailable() {
    try {
        const key ='__some_random_key';
        window.localStorage.setItem(key, key);
        window.localStorage.removeItem(key);
        return true;
    } catch (err) {
        return false;
    }
}