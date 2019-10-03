const axios = require('axios');
const https = require('https')

const defaultURL = 'https://localhost:10443/api'

var CimiAPI = (baseurl, auth) => {

    // TODO: pass auth if not undefined to headers
    const baseURL = baseurl || defaultURL;
    const cimi = axios.create({ 
        baseURL: baseURL,
        httpsAgent: new https.Agent({  
            rejectUnauthorized: false
        }),
        headers: {
            'slipstream-authn-info': 'super  ADMIN'
        }
    });

    async function cloudEntryPoint() {
        let response = await cimi.get('cloud-entry-point');
        return response.data;
    }

    async function violations(query = "") {
        let data = await get(path('sla-violation', query));
        return data.slaViolations;
    }

    async function agreements(query = "") {
        let data = await get(path('agreement', query));
        return data.agreements;
    }

    async function get(path) {
        let response = await cimi.get(`${path}`);
        if (response.status >= 400) {
            let request = response.request;
            throw new Error(`${response.status} ${response.statusText}: ${request.method} ${request.path}`)
        }
        return response.data;
    }

    function path(name, query = "") {
        return `${name}?${query}`;
    }

    return {
        baseURL,
        get,
        cloudEntryPoint,
        violations,
        agreements,
    }
}

export {
    CimiAPI
}