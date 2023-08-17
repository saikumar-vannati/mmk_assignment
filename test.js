const assert = require('assert')
const test = require('node:test')
const fetch = require("node-fetch")

test("Inbound SMS API: Should be a successful response", async (t) => {

        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from("azr1" + ":" + "20S0KPNOIM").toString('base64'));
        headers.set('Content-Type', 'application/json')

        const body = {
            from: "61361220301",
            to: "4924195509194",
            text: "Hello..."
        }

        const response = await fetch("http://localhost:8000/inbound/sms", {
            method:'POST',
            headers: headers,
            body: JSON.stringify(body)
        })

        const responseBody = await response.json()
        assert.strictEqual(responseBody.message, "inbound sms ok")
})


test("Inbound SMS API: Error Case: Parameter is missing", async (t) => {

        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from("azr1" + ":" + "20S0KPNOIM").toString('base64'));
        headers.set('Content-Type', 'application/json')

        const body = {
            to: "4924195509194",
            text: "Hello..."
        }

        const response = await fetch("http://localhost:8000/inbound/sms", {
            method:'POST',
            headers: headers,
            body: JSON.stringify(body)
        })

        const responseBody = await response.json()
        assert.strictEqual(responseBody.error, "from is missing")
})

test("Inbound SMS API: Error Case: Parameter is Invalid", async (t) => {

        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from("azr1" + ":" + "20S0KPNOIM").toString('base64'));
        headers.set('Content-Type', 'application/json')

        const body = {
            from: "123",
            to: "4924195509194",
            text: "Hello..."
        }

        const response = await fetch("http://localhost:8000/inbound/sms", {
            method:'POST',
            headers: headers,
            body: JSON.stringify(body)
        })

        const responseBody = await response.json()
        assert.strictEqual(responseBody.error, "from is invalid")
})

test("Inbound SMS API: Authentication failure", async (t) => {

        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from("azr1" + ":" + "20").toString('base64'));
        headers.set('Content-Type', 'application/json')

        const body = {
            from: "61361220301",
            to: "4924195509194",
            text: "Hello..."
        }

        const response = await fetch("http://localhost:8000/inbound/sms", {
            method:'POST',
            headers: headers,
            body: JSON.stringify(body)
        })

        const responseBody = await response.json()
        assert.strictEqual(response.status, 403)
        assert.strictEqual(responseBody.error, "Invalid Authorization Header")
})


test("Outbound SMS API: Should be a successful response", async (t) => {

    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + Buffer.from("azr5" + ":" + "6DLH8A25XZ").toString('base64'));
    headers.set('Content-Type', 'application/json')

    const body = {
        from: "61361220301",
        to: "4924195509194",
        text: "Hello..."
    }

    const response = await fetch("http://localhost:8000/outbound/sms", {
        method:'POST',
        headers: headers,
        body: JSON.stringify(body)
    })

    const responseBody = await response.json()
    assert.strictEqual(responseBody.message, "outbound sms ok")
})

test("Outbound SMS API: Should be blocked after STOP message is sent in Inbound SMS", async (t) => {

    // Inbound API to cache the blocked from and TO pair
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + Buffer.from("azr1" + ":" + "20S0KPNOIM").toString('base64'));
    headers.set('Content-Type', 'application/json')

    const body = {
        from: "61361220301",
        to: "4924195509194",
        text: "STOP"
    }

    const response = await fetch("http://localhost:8000/inbound/sms", {
        method:'POST',
        headers: headers,
        body: JSON.stringify(body)
    })

    const responseBody = await response.json()
    assert.strictEqual(responseBody.message, "inbound sms ok")

    // Outbound API should get blocked response
    let newHeaders = new Headers();
    newHeaders.set('Authorization', 'Basic ' + Buffer.from("azr5" + ":" + "6DLH8A25XZ").toString('base64'));
    newHeaders.set('Content-Type', 'application/json')

    const newBody = {
        from: "61361220301",
        to: "4924195509194",
        text: "Hello..."
    }

    const newResponse = await fetch("http://localhost:8000/outbound/sms", {
        method:'POST',
        headers: newHeaders,
        body: JSON.stringify(newBody)
    })

    const newresponseBody = await newResponse.json()
    assert.strictEqual(newresponseBody.error, "sms from 61361220301 to 4924195509194 blocked by STOP request")

})