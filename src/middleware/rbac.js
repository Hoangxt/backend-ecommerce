/**
 *
 * @param {string} action // read, write, delete, update
 * @param {*} resource  // profile, product, order, ...
 */

const { roleList } = require('../services/rbac.service');
const rbac = require('./role.middleware');
const { Api401Error } = require('../core/error.response');

const granAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(
        await roleList({
          userId: 9999,
        })
      );
      const rol_name = req.query.role;
      const permission = rbac.can(rol_name)[action](resource);
      if (!permission.granAccess) {
        throw new Api401Error(
          'You do not have permission to access this resource'
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = granAccess;
