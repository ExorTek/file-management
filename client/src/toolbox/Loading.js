import React from 'react';
import {PacmanLoader} from "react-spinners";

function Loading() {
    return <div className={'flex flex-col items-center w-full justify-center full-height'}>
        <PacmanLoader color={'#7c3aed'} loading={true} className={'mx-auto'}/>
        <span
            className={'text-white font-bold mt-10 '}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Yükleniyor...</span>
    </div>
}

export default Loading;
