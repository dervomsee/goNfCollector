import React, { useCallback, useEffect, useState } from 'react';


import Chart from "react-apexcharts";
import { Card, CardContent, Typography } from '@material-ui/core';

import humanFormat from 'human-format'
import { HostsAsSrcOrDstReportByInterval } from '../../services/hosts';

const controller = new AbortController()
const signal = controller.signal


const TopHostWhenSrcOrDst = (
    {
        handleParentBusyState = () => { return },
        handleParentRefreshState = () => { return },
        interval = '15m',
        refresh = false,

        host = 'uknown',
        direction = 'src',
        top = 15,

        busy = false,

        widgetTitle = ''
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
        HostsAsSrcOrDstReportByInterval({ host, top, direction, interval, signal }).then(async (json) => {
            if (json.error) {
                setFetchError(true)
            } else {
                const resp = await json.response.then((result) => result);
                console.log(resp);
                if (resp !== null) {
                    if (resp.hosts.list === null) {
                        setResult([])
                    } else {
                        setResult(resp.hosts.list)
                    }
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
                labels: result.map((r) => r.host)
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
            dataLabels: {
                enabled: true,
                formatter: function (val, { seriesIndex }) {
                    // let sum = 0
                    // result.forEach((r) => sum += r.total_bytes)
                    // console.log(val, sum);
                    const v = result[seriesIndex].total_bytes
                    const l = result[seriesIndex].host
                    return l + '(' + humanFormat(v, { unit: 'B' }) + ')'
                }
            },
            labels: result.map((r) => r.host),
            series: result.map((r) => r.total_bytes),
        }
        setChartData(newChartData)
    }, [result])



    return (
        <div>
            <Card variant="outlined">
                <CardContent>


                    <Typography>
                        {widgetTitle}
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

export default TopHostWhenSrcOrDst;