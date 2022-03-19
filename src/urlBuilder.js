const qs = require("qs");
const encodeurl = require("encodeurl");

class UrlBuilder {
  constructor(encryption, routes) {
    this.encryption = encryption;
    this.routes = routes;
    /**
     * A custom query string to append to the URL
     */
    this.queryString = {};
  }
  /**
   * Processes the pattern against the params
   */
  processPattern(pattern) {
    let url = [];
    const isParamsAnArray = Array.isArray(this.routeParams);
    /*
     * Split pattern when route has dynamic segments
     */
    const tokens = pattern.split('/');
    let paramsIndex = 0;
    for (const token of tokens) {

      /**
       * Token is a static value
       */
      if (!token.startsWith(':')) {
        url.push(token);
      }
      else {
        const isOptional = token.endsWith('?');
        const paramName = token.replace(/^:/, '').replace(/\?$/, '');
        const param = isParamsAnArray ? this.routeParams[paramsIndex] : this.routeParams[paramName];
        paramsIndex++;
        /*
         * A required param is always required to make the complete URL
         */
        if (!param && !isOptional) {
          throw new Error('the routes needs params, set the params first');
        }
        url.push(param);
      }
    }
    return url.join('/');
  }
  /**
   * Finds the route inside the list of registered routes and
   * raises exception when unable to
   */
  findRouteOrFail(identifier) {
    const route = this.routes.find(({ name, pattern, handler }) => {
      return name === identifier || pattern === identifier || handler === identifier;
    });
    if (!route) {
      throw new Error('there is no route registered');
    }
    return route;
  }
  /**
   * Suffix the query string to the URL
   */
  suffixQueryString(url) {
    if (this.queryString) {
      const encoded = qs.stringify(this.queryString);
      url = encoded ? `${url}?${encodeurl(encoded)}` : url;
    }
    return url;
  }
  /**
   * Prefix a custom url to the final URI
   */
  prefixUrl(url) {
    this.baseUrl = url;
    return this;
  }
  /**
   * Append query string to the final URI
   */
  qs(queryString) {
    if (!queryString) {
      return this;
    }
    this.queryString = queryString;
    return this;
  }
  /**
   * Define required params to resolve the route
   */
  params(params) {
    if (!params) {
      return this;
    }
    this.routeParams = params;
    return this;
  }
  /**
   * Generate url for the given route identifier
   */
  make(identifier) {
    const route = this.findRouteOrFail(identifier);
    const url = this.processPattern(route.pattern);
    return this.suffixQueryString(this.baseUrl ? `${this.baseUrl}${url}` : url);
  }
}


module.exports = UrlBuilder;
