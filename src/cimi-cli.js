const cimi = require("./cimi");

var api = cimi.CimiAPI("https://localhost:10443/api");

// These three are requested in parallel

// get('1', ()=> api.agreements('$filter=(name="compss-hello-world")') );

// get('2', () => api.get('sla-template/981f8bd2-f76b-4ca3-80a1-37bb83bcaf05') )

// api.get('sla-template')
// .then( response => {
//     console.log('3: ' + JSON.stringify(response));
// }).catch( err => {
//     console.log(err);
// });

getViolationsPerAgreement()
.then( violations => {
    console.log(violations);
}).catch( err => {
    console.log(err);
});

async function get(id, f) {
    try {
        let response = await f();
        o = {}
        o[id] = response
        console.log(JSON.stringify(o))
    } catch (err) {
        console.log(err)
    }
}

async function getViolationsPerAgreement() {
    let agreements = await api.agreements();
    let violations = await Promise.all(
        agreements.map(async a => {
            return await api.violations(`$filter=(agreement_id/href="${a.id}")`)
        })
    );
    return violations;
}

get('instances', () => api.get('service-instance'))