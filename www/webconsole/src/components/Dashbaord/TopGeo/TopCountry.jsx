import React, { useCallback, useEffect, useState } from 'react';
import { GeosGetTopByDeviceByInterval } from '../../../services/geos';


import Chart from "react-apexcharts";
import { Card, CardContent, Typography } from '@material-ui/core';

import humanFormat from 'human-format'



const controller = new AbortController()
const signal = controller.signal


const TopCountryWidget = (
    {
        handleParentBusyState = () => { return },
        handleParentRefreshState = () => { return },
        interval = '15m',
        refresh = false,

        deviceId = 1,
        direction = 'src',
        top = 15,

        busy = false,
    }
) => {

    const [result, setResult] = useState([])
    const [selfBusy, setSelfBusy] = useState(false)


    const [chartData, setChartData] = useState({})

    // eslint-disable-next-line
    const [fetchError, setFetchError] = useState(false)

    const getTopPortsCallback = useCallback(() => {

        handleParentBusyState(true)
        handleParentRefreshState(false)

        setSelfBusy(true)


        controller.abort()
        GeosGetTopByDeviceByInterval({ top, deviceId, direction, interval, signal }).then(async (json) => {
            if (json.error) {
                setFetchError(true)
            } else {
                const resp = await json.response.then((result) => result);
                if (resp !== null) {
                    setResult(resp)
                } else {
                    setResult([])
                }
            }
            setSelfBusy(false)

            handleParentBusyState(false)
        })


        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        if (refresh) {
            getTopPortsCallback()
        }
    }, [refresh, getTopPortsCallback])

    useEffect(() => {
        getTopPortsCallback()
    }, [interval, getTopPortsCallback])




    useEffect(() => {
        const newChartData = {
            theme: {
                mode: 'dark',
            },
            chartOptions: {
                labels: result.map((r) => r.country_long)
            },
            legend: {
                position: 'bottom',
                formatter: function (seriesName, opts) {
                    return seriesName
                }
            },
            tooltip: {
                enabled: true,
                shared: true,
                y: {
                    formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                        return humanFormat(value, { unit: 'B' })
                    },
                }
            },
            noData: {
                text: 'NO DATA',
                align: 'center',
                verticalAlign: 'middle',
            },
            chart: {
                toolbar: {
                    show: true
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, { seriesIndex }) {
                    // let sum = 0
                    // result.forEach((r) => sum += r.total_bytes)
                    // console.log(val, sum);
                    const v = result[seriesIndex].total_bytes
                    const l = result[seriesIndex].country_long
                    return l + '(' + humanFormat(v, { unit: 'B' }) + ')'
                }
            },
            labels: result.map((r) => r.country_long),
            series: result.map((r) => r.total_bytes),
        }
        setChartData(newChartData)
    }, [result])



    return (
        <div>
            <Card variant="outlined">
                <CardContent>
                    <Typography>
                        TOP {top} {direction === 'src' ? 'Source' : 'Destination'} Country
                    </Typography>

                    {
                        !selfBusy
                            ?
                            <Chart
                                options={chartData}
                                series={chartData.series || []}
                                type="donut"
                                height="500"
                            />
                            :
                            '...'
                    }

                </CardContent>
            </Card>
        </div>
    );
}

export default TopCountryWidget;