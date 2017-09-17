'use strict'

import { MainModule } from './main-module'
import * as angular from 'angular'

angular.module('users-groups-app', [
  'ngAnimate',
  'ngMessages',
  'ui.router',
  'ngMaterial',
  MainModule.name,
])
  .config((
    $locationProvider: angular.ILocationProvider,
    $compileProvider: angular.ICompileProvider,
    $urlRouterProvider: angular.ui.IUrlRouterProvider,
    $stateProvider: angular.ui.IStateProvider,
    $mdThemingProvider: angular.material.IThemingProvider,
    $mdIconProvider: angular.material.IIconProvider,
    $httpProvider: angular.IHttpProvider) => {

    // TODO: turn this on for production
    // $compileProvider.debugInfoEnabled(false);
    $stateProvider
    .state('appoverview', {
      url: '/appoverview',
      template: '<app-start-page class="ui-viewport"></app-start-page>',
    })
     .state('useroverview', {
        url: '/userOverview',
        template: '<overview-user-page class="ui-viewport"></overview-user-page>',
      })
      .state('overview', {
        url: '/overview',
        template: '<overview-page class="ui-viewport"></overview-page>',
      })

    $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/appoverview')

    $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple', {
      'default': '800', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '400', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '900', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A700', // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('green', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': '800', // use shade A100 for the <code>md-hue-3</code> class
    })

    $mdIconProvider.defaultIconSet('', 16)
  })
