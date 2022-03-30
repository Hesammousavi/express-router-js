class RouteGroup {
  constructor (routes) {
    // super();
    this.routes = routes
    /**
     * Array of middleware registered on the group
     */
    this.groupMiddleware = []

    /**
     * Array of middleware not must registered on the group
     */
     this.withoutGroupMiddleware = []

    /**
     * We register the group middleware only once with the route
     * and then mutate the internal stack. This ensures that
     * group own middleware are pushed to the last, but the
     * entire group of middleware is added to the front
     * in the routes
     */
    this.registeredMiddlewareWithRoute = false
  }

  /**
   * Invokes a given method with params on the route instance or route
   * resource instance
   */
  invoke (route, method, params) {
    // if (route instanceof Resource_1.RouteResource) {
    //     route.routes.forEach((child) => this.invoke(child, method, params));
    //     return;
    // }
    if (route instanceof RouteGroup) {
      route.routes.forEach((child) => this.invoke(child, method, params))
      return
    }
    // if (route instanceof BriskRoute_1.BriskRoute) {
    //     /* istanbul ignore else */
    //     if (route.route) {
    //         /*
    //          * Raise error when trying to prefix route name but route doesn't have
    //          * a name
    //          */
    //         if (method === 'as' && !route.route.name) {
    //             throw RouterException_1.RouterException.cannotDefineGroupName();
    //         }
    //         route.route[method](...params);
    //     }
    //     return;
    // }
    /*
     * Raise error when trying to prefix route name but route doesn't have
     * a name
     */
    // if (method === 'as' && !route.name) {
    //     throw RouterException_1.RouterException.cannotDefineGroupName();
    // }
    route[method](...params)
  }

  /**
   * Define Regex matchers for a given param for all the routes.
   *
   * @example
   * ```ts
   * Route.group(() => {
   * }).where('id', /^[0-9]+/)
   * ```
   */
  where (param, matcher) {
    this.routes.forEach((route) => this.invoke(route, 'where', [param, matcher]))
    return this
  }

  /**
   * Define prefix all the routes in the group.
   *
   * @example
   * ```ts
   * Route.group(() => {
   * }).prefix('v1')
   * ```
   */
  prefix (prefix) {
    this.routes.forEach((route) => this.invoke(route, 'prefix', [prefix]))
    return this
  }

  /**
   * Define domain for all the routes.
   *
   * @example
   * ```ts
   * Route.group(() => {
   * }).domain('')
   * ```
   */
  domain (domain) {
    this.routes.forEach((route) => this.invoke(route, 'domain', [domain]))
    return this
  }

  /**
   * Prepend name to the routes name.
   *
   * @example
   * ```ts
   * Route.group(() => {
   * }).as('version1')
   * ```
   */
  as (name) {
    this.routes.forEach((route) => this.invoke(route, 'as', [name, true]))
    return this
  }

  /**
   * Prepend an array of middleware to all routes middleware.
   *
   * @example
   * ```ts
   * Route.group(() => {
   * }).middleware(['auth'])
   * ```
   */
  middleware (middleware, prepend = false) {
    middleware = Array.isArray(middleware) ? middleware : [middleware]
    if (prepend) {
      middleware.forEach((one) => this.groupMiddleware.unshift(one))
    } else {
      middleware.forEach((one) => this.groupMiddleware.push(one))
    }
    if (!this.registeredMiddlewareWithRoute) {
      this.registeredMiddlewareWithRoute = true
      this.routes.forEach((route) => this.invoke(route, 'middleware', [this.groupMiddleware, true]))
    }
    return this
  }

  withoutMiddleware(middleware) {
    middleware = Array.isArray(middleware) ? middleware : [middleware]
    middleware.forEach((one) => this.withoutGroupMiddleware.push(one))

    this.routes.forEach((route) => this.invoke(route, 'withoutMiddleware', [this.withoutGroupMiddleware]))

    return this
  }


  /**
   * Define namespace for all the routes inside the group.
   *
   * @example
   * ```ts
   * Route.group(() => {
   * }).namespace('App/Admin/Controllers')
   * ```
   */
  namespace (namespace) {
    this.routes.forEach((route) => this.invoke(route, 'namespace', [namespace]))
    return this
  }
}

module.exports = RouteGroup;
