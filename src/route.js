const { dropSlash } = require('./helpers');

class Route {
  
  constructor (pattern, method, handler, globalMatchers) {
    this.pattern = pattern
    this.method = method
    this.handler = handler
    this.globalMatchers = globalMatchers

    /**
     * By default the route is part of `root` domain. Root
     * domain is used when no domain is defined
     */
    this.routeDomain = 'root'

    /**
     * An object of matchers to be forwarded to the
     * store. The matchers list is populated by
     * calling `where` method
     */
    this.matchers = {}

    /**
     * Custom prefixes. Usually added to a group of routes. We keep an array of them
     * since nested groups will want all of them ot concat.
     */
    this.prefixes = []

    /**
     * An array of middleware. Added using `middleware` function
     */
    this.routeMiddleware = []

    /**
     * An array of middleware. Added dont using `middleware` function
     */
    this.routeWithoutMiddleware = []
  }

  /**
   * Returns an object of param matchers by merging global and local
   * matchers. The local copy is given preference over the global
   * one's
   */
  getMatchers () {
    return Object.assign({}, this.globalMatchers, this.matchers)
  }

  /**
   * Returns a normalized pattern string by prefixing the `prefix` (if defined).
   */
  getPattern () {
    const pattern = dropSlash(this.pattern)
    const prefix = this.prefixes
      .slice()
      .reverse()
      .map((one) => dropSlash(one))
      .join('')

    return prefix ? `${prefix}${pattern === '/' ? '' : pattern}` : pattern
  }

  getHandler () {
    let handler = this.handler;

    if (typeof handler == 'string' || handler instanceof String) {

      /**
       * the string must be this format 'ModuleController@method'
       * [0] => ModuleController
       * [1] => method
       * @type {string[]}
       */
      let action = handler.split('@');

      if(action.length !== 2) {
        throw new Error('handler must be this format destinationController@method')
      }

      // TODO -> define not modular @controller
      let pathOfModule = this.routeNamespace + '/' + action[0];
      const controller = require(pathOfModule);

      handler = controller[action[1]];
    }

    return handler;
  }

  getMiddlewares() {
    let withoutMiddlewares= this.routeWithoutMiddleware.flat()
    let middlewares = this.routeMiddleware.flat().filter(middleware => ! withoutMiddlewares.includes(middleware))
    return middlewares;
  }

  /**
   * Define Regex matcher for a given param. If a matcher exists, then we do not
   * override that, since the routes inside a group will set matchers before
   * the group, so they should have priority over the route matchers.
   *
   * ```
   * Route.group(() => {
   *   Route.get('/:id', 'handler').where('id', /^[0-9]$/)
   * }).where('id', /[^a-z$]/)
   * ```
   *
   * The `/^[0-9]$/` should win over the matcher defined by the group
   */
  where (param, matcher) {
    if (this.matchers[param]) {
      return this
    }
    if (typeof matcher === 'string') {
      this.matchers[param] = { match: new RegExp(matcher) }
    } else if (helpers_1.types.isRegexp(matcher)) {
      this.matchers[param] = { match: matcher }
    } else {
      this.matchers[param] = matcher
    }
    return this
  }

  /**
   * Define prefix for the route. Prefixes will be concated
   * This method is mainly exposed for the [[RouteGroup]]
   */
  prefix (prefix) {
    this.prefixes.push(prefix)
    return this
  }

  /**
   * Define a custom domain for the route. Again we do not overwrite the domain
   * unless `overwrite` flag is set to true.
   *
   * This is again done to make route.domain win over route.group.domain
   */
  domain (domain, overwrite = false) {
    if (this.routeDomain === 'root' || overwrite) {
      this.routeDomain = domain
    }
    return this
  }

  /**
   * Define an array of middleware to be executed on the route. If `prepend`
   * is true, then middleware will be added to start of the existing
   * middleware. The option is exposed for [[RouteGroup]]
   */
  middleware (middleware, prepend = false) {
    middleware = Array.isArray(middleware) ? middleware : [middleware]
    if (prepend) {
      this.routeMiddleware.unshift(middleware)
    } else {
      this.routeMiddleware.push(middleware)
    }

    return this
  }

  withoutMiddleware(middleware) {
    middleware = Array.isArray(middleware) ? middleware : [middleware]
    this.routeWithoutMiddleware.push(middleware)
    return this
  }

  /**
   * Give memorizable name to the route. This is helpful, when you
   * want to lookup route defination by it's name.
   *
   * If `prepend` is true, then it will keep on prepending to the existing
   * name. This option is exposed for [[RouteGroup]]
   */
  as (name, prepend = false) {
    this.name = prepend ? `${name}.${this.name}` : name
    return this
  }

  /**
   * Define controller namespace for a given route
   */
  namespace (namespace, overwrite = false) {
    if (!this.routeNamespace || overwrite) {
      this.routeNamespace = namespace
    }
    return this
  }

  /**
   * Returns [[RouteDefinition]] that can be passed to the [[Store]] for
   * registering the route
   */
  toJSON () {
    return {
      domain: this.routeDomain,
      pattern: this.getPattern(),
      matchers: this.getMatchers(),
      meta: {
        namespace: this.routeNamespace,
      },
      name: this.name,
      handler: this.getHandler(),
      method: this.method,
      middleware: this.getMiddlewares(),
    }
  }
}

module.exports = Route
