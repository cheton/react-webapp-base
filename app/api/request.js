import ensureArray from 'ensure-array';
import superagent from 'superagent';
import use from 'superagent-use';
import log from 'app/lib/log';

const HTTP_STATUS_401_NOT_AUTHORIZED = 401;

// Modify request headers and query parameters to prevent caching
const noCache = (request) => {
    // const now = Date.now();
    request.set('Cache-Control', 'no-cache');
    request.set('X-Requested-With', 'XMLHttpRequest');

    if (request.method === 'GET' || request.method === 'HEAD') {
        // Force requested pages not to be cached by the browser by appending "_={timestamp}" to the GET parameters, this will work correctly with HEAD and GET requests. The parameter is not needed for other types of requests, except in IE8 when a POST is made to a URL that has already been requested by a GET.
        request._query = ensureArray(request._query);
        // request._query.push(`_=${now}`);
    }
};

const request = use(superagent);
request
    .use(noCache);

const Request = request.Request;
const end = Request.prototype.end;
Request.prototype.end = function(next) {
    return end.call(this, function(err, res) { // eslint-disable-line
        if (res && res.status === HTTP_STATUS_401_NOT_AUTHORIZED) {
            log.warn(`Unauthorized access: status=${res.status}`);
            next(new Error(`Unauthorized access: status=${res.status}`));
            return;
        }

        if (typeof next !== 'function') {
            return;
        }

        next(err, res);
    });
};

export default request;
