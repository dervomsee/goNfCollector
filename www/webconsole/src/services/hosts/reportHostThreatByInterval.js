import { UtlHttpRequest } from '../utils';


export const ReportHostThreatByInterval = ({
    host = 'uknown',
    top = 15,
    direction = 'src',
    interval = '24m',

    signal
}) => {
    // AIP URL
    const url = `${process.env.REACT_APP_HTTP}/host/report/${host}/top/${top}/interval/${interval}`;

    // send request to server
    return UtlHttpRequest(
        url,
        'GET',
        false,
        false,
        false,
        signal
    );
};