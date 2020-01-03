import should = require("should");

import {createAppTester, HaltedError} from 'zapier-platform-core';

import App from "../index";
import nock = require('nock');
const appTester = createAppTester(App);

describe("My Test", () => {
  it("should test the auth succeeds", async () => {
    const bundle = {
      authData: {
        username: "user",
        password: "secret"
      }
    };

    const response = await appTester(App.authentication.test, bundle);
    should(response.status).eql(200);
    response.request.headers!.Authorization.should.eql(
      "Basic dXNlcjpzZWNyZXQ="
    );
  });

  it("should test the auth fails", async () => {
    const bundle = {
      authData: {
        username: "user",
        password: "boom"
      }
    };

    try {
      const response = await appTester(App.authentication.test, bundle);
    } catch (e) {
      e.message.should.containEql(
        "The username and/or password you supplied is incorrect"
      );
    }
  });

it.only("should throw HaltedError on insufficient funds", async () => {
    const bundle = {
        authData: {
            username: "user",
            password: "boom"
        }
    };

    // Mock HTTP request.
    nock('https://auth-json-server.zapier-staging.com')
        .get('/me')
        .reply(402, {});

    try {
        const response = await appTester(App.authentication.test, bundle);
    } catch (e) {
        e.message.should.containEql(
            "It seems that your account has insufficient funds to perform your request. Please recharge."
        );
        // This should be true if HaltedError export worked.
        e.should.be.an.instanceof(HaltedError);
    }
});
});
