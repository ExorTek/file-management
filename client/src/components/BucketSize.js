import React, {useEffect, useState} from 'react';
import {Line} from "@ant-design/charts";
import {getBucketTotalSizeFromApi} from "../services";
import {toast} from "react-toastify";
import {Loading} from "../toolbox";

function BucketSize() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const getBucketSize = () => {
        setLoading(true);
        getBucketTotalSizeFromApi().then(({data}) => {
            setData(data);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            toast.error(err?.response?.data?.message || 'get bucket size error')
        });
    }

    useEffect(() => {
        getBucketSize();
        return () => {
            setData([]);
        }
    }, []);

    const config = {
        data,
        xField: 'time',
        yField: 'value',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.9,
            },
        },
        lineStyle: ({value}) => {
            return {
                stroke: '#eab308',
                lineWidth: 10,
            };
        },
        point: {
            size: 5,
            shape: '',
            style: {
                fill: '#7c3aed',
                stroke: '#7c3aed',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: false,
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            }
        },
    };
    if(loading) return <Loading/>
    return (
        <div className={'bg-slate-900 p-4 rounded-xl w-full'}>
            <Line {...config}/>
        </div>
    );
}

export default BucketSize;
