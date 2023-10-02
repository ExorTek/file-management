import {useEffect, useState} from "react";

function useKeyPress() {
    const [key, setKey] = useState(null);
    const downHandler = ({key}) => {
        setKey(key);
    }
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
        }
    }, []);
    return key;
}

export default useKeyPress;
