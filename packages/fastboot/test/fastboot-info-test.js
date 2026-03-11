var expect = require('chai').expect;
var FastBootInfo = require('./../src/fastboot-info.js');
var FastBootResponse = require('./../src/fastboot-response.js');
var FastBootRequest = require('./../src/fastboot-request.js');
var FastBootUserdata = require('./../src/fastboot-userdata.js');

function delayFor(ms) {
  let promise = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

  return promise;
}

describe('FastBootInfo', function() {
  var response;
  var request;
  var fastbootInfo;
  var metadata = {
    foo: 'bar',
    baz: 'apple',
  };

  beforeEach(function() {
    response = {};
    request = {
      cookie: '',
      protocol: 'http',
      headers: {},
      get: function() {
        return this.cookie;
      },
    };

    fastbootInfo = new FastBootInfo(request, response, { metadata });
  });

  it('has a FastBootRequest', function() {
    expect(fastbootInfo.request).to.be.an.instanceOf(FastBootRequest);
  });

  it('has a FastBootResponse', function() {
    expect(fastbootInfo.response).to.be.an.instanceOf(FastBootResponse);
  });

  it('has metadata', function() {
    expect(fastbootInfo.metadata).to.deep.equal(metadata);
  });

  it('exposes userdata on the request as a FastBootUserdata instance', function() {
    var userdata = { secretName: 'mySecret' };
    var info = new FastBootInfo(request, response, { metadata, userdata });

    expect(info.request.userdata).to.be.an.instanceOf(FastBootUserdata);
    expect(info.request.userdata.get('secretName')).to.equal('mySecret');
  });

  it('request.userdata returns undefined for missing keys when userdata is provided', function() {
    var userdata = { secretName: 'mySecret' };
    var info = new FastBootInfo(request, response, { metadata, userdata });

    expect(info.request.userdata.get('missingKey')).to.be.undefined;
  });

  it('request.userdata works when no userdata option is provided', function() {
    var info = new FastBootInfo(request, response, { metadata });

    expect(info.request.userdata).to.be.an.instanceOf(FastBootUserdata);
    expect(info.request.userdata.get('anyKey')).to.be.undefined;
  });

  it('can use deferRendering', async function() {
    let steps = [];

    steps.push('deferRendering called');

    fastbootInfo.deferRendering(delayFor(10).then(() => steps.push('first delay completed')));
    fastbootInfo.deferRendering(delayFor(10).then(() => steps.push('second delay completed')));
    fastbootInfo.deferRendering(delayFor(20).then(() => steps.push('third delay completed')));
    fastbootInfo.deferRendering(delayFor(15).then(() => steps.push('fourth delay completed')));

    await fastbootInfo.deferredPromise;

    expect(steps).to.deep.equal([
      'deferRendering called',
      'first delay completed',
      'second delay completed',
      'fourth delay completed',
      'third delay completed',
    ]);
  });
});
