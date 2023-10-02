import React from 'react';
import {toast} from "react-toastify";
import {RxDotFilled} from "react-icons/rx";
import {MdContentCopy} from "react-icons/md";

function UserDrawerContent({keys, value, index}) {
    return (
        <div key={index}
             onClick={() => navigator.clipboard.writeText(value).then(() => toast.success(`${keys} kopyalandı!`))}
             className={'flex flex-row gap-2 border p-2 rounded-xl cursor-pointer items-center'}>
            {keys === "status" ? <p className={'flex items-center font-bold'}>{keys.toUpperCase()}: {value} <RxDotFilled
                    className={`text-4xl ${value === 'active' ? 'text-green-600' : 'text-red-500'}`}/></p> :
                <>
                    <p className={'font-bold'}>{keys.toUpperCase()}:</p>
                    <p>{value}</p>
                </>
            }
            <MdContentCopy/>
        </div>
    );
}

export default UserDrawerContent;
