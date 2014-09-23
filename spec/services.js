/* globals beforeEach, describe, inject, it */
'use strict';
describe('services', function() {
  beforeEach(module('authentication.service', 'navigation.service', 'local.storage'));

  describe('$navigation', function() {
    it('should have an expected default configuration',
      inject(function ($navigation) {
        var configuration = $navigation.getConfiguration();
        configuration.inAudienceValidationFunction.should.be.a.function; // jshint ignore:line
      })
    );

    it('should have a list of functions',
      inject(function ($navigation) {
        var functions = ['inAudience', 'getConfiguration'];
        for (var i in functions) {
          $navigation[functions[i]].should.be.a.function; // jshint ignore:line
        }
      })
    );

    describe('inAudience', function() {
      describe('with no authenticated user', function() {
        it('should be true if anonymous',
          inject(function ($navigation) {
            $navigation.inAudience('anonymous').should.be.true; // jshint ignore:line
          })
        );

        it('should be false if all',
          inject(function ($navigation) {
            $navigation.inAudience('all').should.be.false; // jshint ignore:line
          })
        );
      });

      describe('with an authenticated user', function() {
        beforeEach(
          inject(function ($store){
            $store.set('user.profile', { roles: ['a'] });
          })
        );

        it('should be false if anonymous',
          inject(function ($authentication, $navigation) {
            $authentication.isAuthenticated().should.be.true; // jshint ignore:line
            $navigation.inAudience('anonymous').should.be.false; // jshint ignore:line
          })
        );

        it('should be true if all',
          inject(function ($authentication, $navigation) {
            $authentication.isAuthenticated().should.be.true; // jshint ignore:line
            $navigation.inAudience('all').should.be.true; // jshint ignore:line
          })
        );

        it('should be false if user is not in audience',
          inject(function ($authentication, $navigation) {
            $authentication.isAuthenticated().should.be.true; // jshint ignore:line
            $navigation.inAudience('b').should.be.false; // jshint ignore:line
          })
        );

        it('should be true if user is in audience',
          inject(function ($authentication, $navigation) {
            $authentication.isAuthenticated().should.be.true; // jshint ignore:line
            $navigation.inAudience('a').should.be.true; // jshint ignore:line
          })
        );

        it('should be true if user is in any specified audience group',
          inject(function ($authentication, $navigation) {
            $navigation.inAudience('a', 'b').should.be.true; // jshint ignore:line
          })
        );
      });
    });

    describe('isActiveLocation', function() {
      it('should be false if non-string is passed in',
        inject(function ($location, $navigation) {
          $location.path('/home');
          $location.path().should.match('/home');
          $navigation.isActiveLocation().should.be.false; // jshint ignore:line
          $navigation.isActiveLocation(undefined).should.be.false; // jshint ignore:line
          $navigation.isActiveLocation(null).should.be.false; // jshint ignore:line
          $navigation.isActiveLocation({}).should.be.false; // jshint ignore:line
          $navigation.isActiveLocation([]).should.be.false; // jshint ignore:line
          $navigation.isActiveLocation(1).should.be.false; // jshint ignore:line
        })
      );

      it('should be false if empty or whitespace string is passed in',
        inject(function ($location, $navigation) {
          $location.path('/home');
          $location.path().should.match('/home');
          $navigation.isActiveLocation('').should.be.false; // jshint ignore:line
          $navigation.isActiveLocation(' ').should.be.false; // jshint ignore:line
        })
      );

      it('should be false if the location is not active',
        inject(function ($location, $navigation) {
          $location.path('/home');
          $location.path().should.match('/home');
          $navigation.isActiveLocation('/').should.be.false; // jshint ignore:line
          $navigation.isActiveLocation('/homer').should.be.false; // jshint ignore:line
          $navigation.isActiveLocation('/hom').should.be.false; // jshint ignore:line
          $navigation.isActiveLocation('homer').should.be.false; // jshint ignore:line
          $navigation.isActiveLocation('hom').should.be.false; // jshint ignore:line
        })
      );

      it('should be true if the location is active',
        inject(function ($location, $navigation) {
          $location.path('/home');
          $location.path().should.match('/home');
          $navigation.isActiveLocation('/home').should.be.true; // jshint ignore:line
          $navigation.isActiveLocation('home').should.be.true; // jshint ignore:line
        })
      );
    });
  });
});