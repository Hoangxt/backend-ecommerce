const catchAsync = require('../helpers/catch.async');
// status response
const { OK } = require('../core/success.response');
const {
  createRole,
  roleList,
  createResource,
  resourceList,
} = require('../services/rbac.service');

/**
 * @description create new role
 * @param {string} name
 * @param {string} res
 * @param {string} next
 */
class RbacController {
  // admin
  newRole = catchAsync(async (req, res) => {
    // const { name, res } = req.body;
    OK(res, 'Create new role success', await createRole(req.body));
  });
  newResource = catchAsync(async (req, res) => {
    OK(res, 'Create new resource success', await createResource(req.body));
  });
  listRoles = catchAsync(async (req, res) => {
    OK(res, 'Get list roles success', await roleList(req.query));
  });
  listResources = catchAsync(async (req, res) => {
    OK(res, 'Get list roles success', await resourceList(req.query));
  });
}

module.exports = new RbacController();
