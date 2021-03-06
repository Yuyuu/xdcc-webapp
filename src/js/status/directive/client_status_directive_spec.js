"use strict";

var expect = require("chai").use(require("sinon-chai")).expect;
var sinon = require("sinon");

describe("xdccClientState", function () {
  var scope, element, socket, ClientStatusService, directive;

  beforeEach(function () {
    scope = {
      events: {},
      $on: function (eventName, callback) {
        scope.events[eventName] = callback;
      },
      trigger: function (eventName, arg) {
        scope.events[eventName].call(null, arg);
      }
    };
    element = { css: sinon.spy() };
    socket = {
      events: {},
      on: function (eventName, callback) {
        socket.events[eventName] = callback;
      },
      removeListener: function (eventName) {
        delete socket.events[eventName];
      },
      emit: function (eventName, arg) {
        socket.events[eventName].call(null, arg);
      },
      isListening: function (eventName) {
        return socket.events[eventName] !== undefined;
      }
    };
    ClientStatusService = { currentStatus: "" };
    var XdccClientState = require("./client_status_directive");
    directive = new XdccClientState(socket, ClientStatusService);
    directive.link(scope, element);
  });

  it("waits for the client to connect", function () {
    socket.emit("xdcc:clientConnected");
    expect(element.css).to.have.been.calledWith("color");
    expect(ClientStatusService.currentStatus).to.equal("ready");
  });

  it("must inform the user when something is wrong with the client", function () {
    socket.emit("xdcc:clientError");
    expect(element.css).to.have.been.calledWith("color");
    expect(ClientStatusService.currentStatus).to.equal("error");
  });

  it("clears the handlers when the scope is destroyed", function () {
    scope.trigger("$destroy");
    expect(socket.isListening("xdcc:clientConnected")).to.be.false;
    expect(socket.isListening("xdcc:clientError")).to.be.false;
  });
});