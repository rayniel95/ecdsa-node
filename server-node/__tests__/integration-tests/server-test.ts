import request from "supertest";
import { app } from "../../index";
import * as crypto from "../../utils";
//TODO - add more tests
//TODO - clean the database before each test
xdescribe("get server endpoint tests", () => {
    let nonce = 1
    //TODO - beforeeach clean de database
    test("get default address balance", async () => {
        const res = await request(app).get(
            "/balance/0x8b2ff5c6bb4685e48707fc69a3729ee9b53162d7"
        );
        expect(res.body).toEqual({ balance: 100 });
    });
    //TODO - fix async test using async expect jest options
    test("get new address balance", async () => {
        const address = Math.random().toString(36).slice(2, 41)
        const res = await request(app).get(
            `/balance/0x${address}`
        );
        expect(res.body).toEqual({ balance: 0 });
    });
});

describe("post server endpoint tests", () => {
    let nonce = 6
    //TODO - beforeeach clean de database
    test("test send balance from default account to default account", async () => {
        const payload = {
            "timestamp": Date.now(),
            nonce,
            "fromAddress": "0x8b2ff5c6bb4685e48707fc69a3729ee9b53162d7",
            "toAddress": "0x456cfd7ef7554290a1931cdd9f1d28623723872e",
            "amount": 10,
        }
        const [signature, recoverBit] = await crypto.getSignature(
            JSON.stringify(payload),
            "pera"
        )
        nonce++
        const res = await request(app).post("/send")
            .send(payload).set("signature", signature.toString())
            .set("recoverBit", recoverBit.toString())

        expect(res.body).toEqual({ balance: 0 });
    });
});