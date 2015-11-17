import DS from 'ember-data';
import Ember from 'ember';

const alias = Ember.computed.alias;
const service = Ember.inject.service;
const githubUrl = 'https://api.github.com';

export default DS.RESTAdapter.extend({
  session: service(),
  host: githubUrl,
  authorizationCode: alias('session.data.authenticated.authorizationCode'),
  githubAccessToken: alias('session.githubAccessToken'), // backwards compatibility
  token: Ember.computed('githubAccessToken', 'authorizationCode', function(){
    // backwards compatibility
    if(this.get('githubAccessToken')){
     return this.get('githubAccessToken');
    }

    if(this.get('authorizationCode')){
      return this.get('authorizationCode');
    }
    return true;
  }),

  headers: Ember.computed('token', function() {
    return { Authorization: `token ${this.get('token')}` };
  }),
  pathForType: function(type) {
    return Ember.String.camelize(Ember.String.pluralize(type.replace('github','')));
  }
});
