import axios from "axios";
import Configuration from './config';

const conf = Configuration.getConfiguration();


const ServerConection = (() => {
    const auth = {
        login: (credentials) => {
            return axios.post(`${conf.API_AUTH}/public/login`, credentials);
        },
    };

    return{ auth }
})();

export default ServerConection;