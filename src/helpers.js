/**
 * orderd splashes
 * @param {string} input 
 * @returns string
 */
function dropSlash(input) {
  if (input === '/') {
    return '/';
  }
  return `/${input.replace(/^\//, '').replace(/\/$/, '')}`;
}


function normalizeMakeUrlOptions(params, options) {
  /**
   * Params used to be options earlier. So we are checking a few properties of it
   */
  params = params || {};
  options = options || {};
  const normalizedParams = params['params'] ? params['params'] : params;
  const qs = options.qs || params['qs'];
  const domain = options.domain;
  const prefixUrl = options.prefixUrl;

  return { params: normalizedParams, qs, domain, prefixUrl };
}

module.exports = {
  dropSlash,
  normalizeMakeUrlOptions
}
