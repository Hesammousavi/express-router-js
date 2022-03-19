const Route = require('./route');
const RouteGroup = require('./routeGroup');
const UrlBuilder = require('./urlBuilder')
const { normalizeMakeUrlOptions } = require('./helpers');


class Router {
  
  /**
   * all routes that user define push into routes property
   * @type {[ Route , RouteGroup ]}
   */
  routes = []

  /**
   * A boolean to tell the router that a group is in
   * open state right now
   */
  openedGroups = []

  /**
   * app an instance of expressjs app
   * @param app
   */
  constructor (app) {
    this.app = app
  }

  /**
  * set a Get Route
  * @param {string} uri
  * @param {function} action
   * @return Route
  * route.get(uri : string , action : function) : void
  */
  get (uri, action) {
    return this.setRoute({
      uri,
      action,
      method: 'get'
    })
  }

  /**
   * set a Post Route
   * @param {string} uri
   * @param {function} action
   * @return Route
   * route.get(uri : string , action : function) : void
   */
  post (uri, action) {
    return this.setRoute({
      uri,
      action,
      method: 'post'
    })
  }

  /**
   * set a Put Route
   * @param {string} uri
   * @param {function} action
   * @return Route
   * route.get(uri : string , action : function) : Route
   */
  put (uri, action) {
    return this.setRoute({
      uri,
      action,
      method: 'put'
    })
  }

  /**
   * set a Patch Route
   * @param {string} uri
   * @param {function} action
   * @return Route
   * route.get(uri : string , action : function) : Route
   */
  patch (uri, action) {
    return this.setRoute({
      uri,
      action,
      method: 'patch'
    })
  }

  /**
   * set a Delete Route
   * @param {string} uri
   * @param {function} action
   * @return Route
   * route.get(uri : string , action : function) : Route
   */
  delete (uri, action) {
    return this.setRoute({
      uri,
      action,
      method: 'delete'
    })
  }


  getRecentGroup () {
    return this.openedGroups[this.openedGroups.length - 1]
  }

  /*
  * @param {string} uri
  * @param {function} action
  * @param {string} method
  */
  setRoute ({
    uri,
    action,
    method
  }) {

    const route = new Route(uri, method, action, {})
    const openedGroup = this.getRecentGroup()

    if (openedGroup) {
      openedGroup.routes.push(route)
    } else {
      this.routes.push(route)
    }

    return route
  }

  group (callback) {
    /*
    * Create a new group with empty set of routes
    */
    const group = new RouteGroup([])
    /*
        * See if there is any opened existing route groups. If yes, then we
        * push this new group to the old group, otherwise we push it to
        * the list of routes.
        */
    const openedGroup = this.getRecentGroup()
    if (openedGroup) {
      openedGroup.routes.push(group)
    } else {
      this.routes.push(group)
    }
    /*
        * Track the group, so that the upcoming calls inside the callback
        * can use this group
        */
    this.openedGroups.push(group)
    /*
        * Execute the callback. Now all registered routes will be
        * collected seperately from the `routes` array
        */
    callback(this)
    /*
        * Now the callback is over, get rid of the opened group
        */
    this.openedGroups.pop()

    return group
  }

  serve () {
    let routes = this.toRoutesJSON(this.routes)

    // add route helpers for route handlers
    this.app.use(this.appendSomeRouteHelpersToRequest)

    for (const route of routes) {
      this.handleRoute(route)
    }
  }

  /**
   * Returns a flat list of routes JSON
   */
  toRoutesJSON (routes) {
    return routes.reduce((list, route) => {
      
      if (route instanceof RouteGroup) {
        list = list.concat(this.toRoutesJSON(route.routes))
        return list
      }

      list.push(route.toJSON())

      return list
    }, [])
  }

  handleRoute (route) {
    this.app[route.method](
      route.pattern,
      route.middleware,
      route.handler
    )
  }

  static createRouter (app) {
    return new Router(app)
  }


  /**
   * Makes url to a registered route by looking it up with the route pattern,
   * name or the controller.method
   */
  makeUrl(routeIdentifier, params, options) {
    const builder = new UrlBuilder({},  this.toRoutesJSON(this.routes) );
    const normalizedOptions = normalizeMakeUrlOptions(params, options);

    normalizedOptions.params && builder.params(normalizedOptions.params);
    normalizedOptions.qs && builder.qs(normalizedOptions.qs);
    normalizedOptions.prefixUrl && builder.prefixUrl(normalizedOptions.prefixUrl);

    return builder.make(routeIdentifier);
  }

  appendSomeRouteHelpersToRequest (req , res , next) {
    req.to_route = this.makeUrl.bind(this);
    next();
  }

}

module.exports = Router
