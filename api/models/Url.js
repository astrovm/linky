/**
 * Url.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'string',
      unique: true,
      primaryKey: true,
      required: true
    },
    target: {
      type: 'string',
      required: true
    },
    teleid: 'integer',
    telealerts: 'boolean',
    emailalerts: 'boolean',
    captcha: 'boolean',
    password: 'string',
    secretkey: 'string',
    email: {
      type: 'string',
      email: true
    }
  }
};
