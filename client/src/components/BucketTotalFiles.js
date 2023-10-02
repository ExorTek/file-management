import React, {useEffect, useState} from 'react';
import {Column} from "@ant-design/charts";
import {getBucketTotalFilesFromApi} from "../services";
import {Loading} from "../toolbox";
import {toast} from "react-toastify";

function BucketTotalFiles() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const getTotalFiles = () => {
        setLoading(true);
        getBucketTotalFilesFromApi().then(({data}) => {
            setData(data);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            toast.error(err?.response?.data?.message || 'get bucket total files error')
        });
    }
    useEffect(() => {
        getTotalFiles();
        return () => {
            setData([]);
        }
    }, []);
    const config = {
        data,
        xField: 'time',
        yField: 'value',
        seriesField: '',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.8,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        }
    };
    if(loading) return <Loading/>
    return (
        <div className={'bg-slate-900 p-4 rounded-xl w-full'}>
            <Column {...config}/>
        </div>
    );
}

export default BucketTotalFiles;
