import {useEffect, useState} from 'react';

function useTheme() {
    const [theme, setTheme] = useState('dark' || localStorage.getItem('theme'));
    const colorTheme = theme === "dark" ? "light" : "dark";
    const changeTheme = () => {
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }
    useEffect(() => {
        changeTheme();
    }, [theme, colorTheme]);
    return [colorTheme, setTheme]
    /* How to use this hook:
    const [colorTheme, setTheme] = useTheme();
    const changeTheme = () => setTheme(colorTheme);
     */
}

export default useTheme;
