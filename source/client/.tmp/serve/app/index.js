/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/app";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var main_module_1 = __webpack_require__(1);
	var angular = __webpack_require__(2);
	angular.module('users-groups-app', [
	    'ngAnimate',
	    'ngMessages',
	    'ui.router',
	    'ngMaterial',
	    main_module_1.MainModule.name,
	])
	    .config(function ($locationProvider, $compileProvider, $urlRouterProvider, $stateProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {
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
	    });
	    $locationProvider.html5Mode(true);
	    $urlRouterProvider.otherwise('/appoverview');
	    $mdThemingProvider.theme('default')
	        .primaryPalette('deep-purple', {
	        'default': '800',
	        'hue-1': '400',
	        'hue-2': '900',
	        'hue-3': 'A700',
	    })
	        .accentPalette('green', {
	        'default': '400',
	        'hue-1': '100',
	        'hue-2': '600',
	        'hue-3': '800',
	    });
	    $mdIconProvider.defaultIconSet('', 16);
	});


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var angular = __webpack_require__(2);
	var rest_api_1 = __webpack_require__(3);
	var overview_page_1 = __webpack_require__(5);
	var overview_user_page_1 = __webpack_require__(9);
	var generic_list_1 = __webpack_require__(18);
	var generic_table_1 = __webpack_require__(20);
	var toolbar_1 = __webpack_require__(22);
	var dialog_service_1 = __webpack_require__(24);
	var menu_1 = __webpack_require__(25);
	var app_start_1 = __webpack_require__(27);
	exports.MainModule = angular.module('users-groups-app-core', [
	    'ngMaterial',
	    'ngMessages',
	    'md.data.table',
	    'ngSanitize',
	    'ngMaterialDatePicker',
	])
	    .service('api', rest_api_1.RestApi)
	    .component('overviewPage', overview_page_1.OverviewPage)
	    .component('overviewUserPage', overview_user_page_1.OverviewUserPage)
	    .component('appStartPage', app_start_1.AppStartPage)
	    .component('genericList', generic_list_1.GenericList)
	    .component('genericTable', generic_table_1.GenericTable)
	    .component('toolBar', toolbar_1.ToolBar)
	    .component('customMenu', menu_1.Menu)
	    .service('dialogService', dialog_service_1.DialogService);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = angular;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var viewmodel_generator_1 = __webpack_require__(4);
	var RestApi = (function () {
	    /* @ngInject */
	    function RestApi($http, $q, $log) {
	        this.$http = $http;
	        this.$q = $q;
	        this.$log = $log;
	        this.allGroupTypes = this.getGroupTypes();
	        this.allUsers = this.getUsers();
	        this.allGroups = this.getGroups();
	    }
	    RestApi.prototype.getGroupTypes = function () {
	        this.$log.info("start getting all available group types");
	        return this.$http.get('/api/groupTypes').then(function (grpTypes) {
	            return viewmodel_generator_1.viewModelGenerator.getAllVmGroupTypes(grpTypes.data);
	        });
	    };
	    RestApi.prototype.getUsers = function () {
	        this.$log.info("start getting all available persons");
	        return this.$http.get('/api/users').then(function (users) {
	            return viewmodel_generator_1.viewModelGenerator.getAllVmUsers(users.data);
	        });
	    };
	    RestApi.prototype.getGroups = function () {
	        var _this = this;
	        return this.allGroupTypes.then(function (types) {
	            return _this.allUsers.then(function (users) {
	                return _this.$http.get('/api/groups').then(function (grpsInfo) {
	                    return viewmodel_generator_1.viewModelGenerator.getAllVmGroups(grpsInfo.data, types, users);
	                });
	            });
	        });
	    };
	    RestApi.prototype.saveGroup = function (newGroup) {
	        var _this = this;
	        this.$log.info("Adding new group with name " + newGroup.name);
	        return this.$http.post('/api/newGroup', { data: newGroup }).then(function (grpsInfo) {
	            return _this.allGroupTypes.then(function (types) {
	                return _this.allUsers.then(function (users) {
	                    return viewmodel_generator_1.viewModelGenerator.getAllVmGroups([grpsInfo.data], types, users);
	                });
	            });
	        });
	    };
	    RestApi.prototype.saveUser = function (newUser) {
	        this.$log.info("Adding new user with name " + newUser.name);
	        return this.$http.post('/api/newUser', { data: newUser }).then(function (users) {
	            return viewmodel_generator_1.viewModelGenerator.getAllVmUsers([users.data]);
	        });
	    };
	    return RestApi;
	}());
	exports.RestApi = RestApi;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var _noInformationFound = 'No information found';
	var ViewModelGenerator = (function () {
	    function ViewModelGenerator() {
	    }
	    ViewModelGenerator.prototype.getAllVmGroupTypes = function (dataInfo) {
	        var groupTypes = dataInfo.map(function (type) {
	            var groupType = {
	                icon: type.icon,
	                name: type.name,
	                id: type.groupId,
	            };
	            return groupType;
	        });
	        return groupTypes;
	    };
	    ViewModelGenerator.prototype.getAllVmUsers = function (dataInfo) {
	        var users = dataInfo.map(function (x) {
	            var user = {
	                name: x.name,
	                id: x.id,
	                email: x.email,
	                address: {
	                    street: x.address.street || _noInformationFound,
	                    state: x.address.state || _noInformationFound,
	                    country: x.address.country || _noInformationFound,
	                },
	                shortName: x.shortName || _noInformationFound,
	                description: x.description,
	                memberOf: x.memberOf,
	            };
	            return user;
	        });
	        return users;
	    };
	    ViewModelGenerator.prototype.getAllVmGroups = function (dataInfo, grpTypes, users) {
	        var groups = dataInfo.map(function (grp) {
	            var members = grp.members.map(function (x) {
	                var filteredUsers = users.filter(function (element) {
	                    return element.memberOf.some(function (subElement) {
	                        return subElement.groupId === grp.id && subElement.membershipId === x.membershipId;
	                    });
	                })[0];
	                return (__assign({}, x, filteredUsers));
	            });
	            var group = {
	                id: grp.id,
	                name: grp.name,
	                date: new Date(grp.date).toLocaleString(),
	                address: grp.address,
	                homepage: grp.homepage,
	                groupType: grpTypes.filter(function (x) { return x.id === grp.groupType; })[0],
	                members: members,
	                description: grp.description,
	                shortName: grp.shortName,
	            };
	            return group;
	        });
	        return groups;
	    };
	    return ViewModelGenerator;
	}());
	exports.ViewModelGenerator = ViewModelGenerator;
	exports.viewModelGenerator = new ViewModelGenerator();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var add_group_1 = __webpack_require__(6);
	var OverviewCtrl = (function () {
	    /* @ngInject */
	    function OverviewCtrl($timeout, $mdMedia, $mdSidenav, $q, $log, $state, api, dialogService) {
	        var _this = this;
	        this.$timeout = $timeout;
	        this.$mdMedia = $mdMedia;
	        this.$mdSidenav = $mdSidenav;
	        this.$q = $q;
	        this.$log = $log;
	        this.$state = $state;
	        this.api = api;
	        this.dialogService = dialogService;
	        this.api.allGroups.then(function (grps) {
	            _this.groups = grps;
	            _this.showGroupDetails(_this.groups[0]);
	        });
	        this.api.allGroupTypes.then(function (grpTypes) {
	            _this.allGroupTypes = grpTypes;
	        });
	    }
	    OverviewCtrl.prototype.toggleSidenav = function (menuId) {
	        this.$mdSidenav(menuId).toggle();
	    };
	    OverviewCtrl.prototype.showGroupDetails = function (group) {
	        this.selectedGroup = group;
	    };
	    OverviewCtrl.prototype.addGroup = function (ev) {
	        var _this = this;
	        this.dialogService.show({
	            controller: add_group_1.AddGroupCtrl,
	            template: __webpack_require__(7),
	            targetEvent: ev,
	            locals: {
	                allGroupTypes: this.allGroupTypes,
	            },
	        }).then(function (grpInfo) {
	            _this.api.saveGroup(grpInfo).then(function (result) {
	                _this.groups.push(result[0]);
	                _this.selectedGroup = result[0];
	                _this.dialogService.notify("Group with name " + _this.selectedGroup.name + " is created.");
	            });
	        });
	    };
	    return OverviewCtrl;
	}());
	exports.OverviewPage = {
	    controllerAs: 'vm',
	    template: __webpack_require__(8),
	    controller: OverviewCtrl,
	};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AddGroupCtrl = (function () {
	    /* @ngInject */
	    function AddGroupCtrl($mdDialog, allGroupTypes) {
	        this.$mdDialog = $mdDialog;
	        this.allGroupTypes = allGroupTypes;
	        this.groupTypes = allGroupTypes;
	    }
	    AddGroupCtrl.prototype.cancel = function () {
	        this.$mdDialog.cancel();
	    };
	    AddGroupCtrl.prototype.save = function () {
	        this.group.members = [];
	        this.$mdDialog.hide(this.group);
	    };
	    return AddGroupCtrl;
	}());
	exports.AddGroupCtrl = AddGroupCtrl;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = "<md-dialog aria-label=\"Add Group\"  flex-sm=\"80\" flex-gt-sm=\"50\">\r\n    <form name=\"form\" novalidate layout=\"column\" flex>\r\n      <md-toolbar>\r\n        <div class=\"md-toolbar-tools\">\r\n          <h2>Add Group</h2>\r\n          <span flex></span>\r\n          <md-button class=\"md-icon-button\" ng-click=\"vm.cancel()\">\r\n            <md-icon aria-label=\"Close dialog\">close</md-icon>\r\n          </md-button>\r\n        </div>\r\n      </md-toolbar>\r\n      <md-dialog-content  class=\"condensed-dialog\" flex layout=\"column\" layout-align=\"start stretch\">\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Group Type</label>\r\n            <md-select ng-model=\"vm.group.groupType\">\r\n              <md-option ng-repeat=\"grpType in vm.groupTypes\" ng-value=\"grpType.id\">\r\n                {{grpType.name}}\r\n              </md-option>\r\n            </md-select>\r\n          </md-input-container>\r\n        </div>\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Group Name</label>\r\n            <input type=\"text\"\r\n              name=\"label\" required\r\n              ng-model=\"vm.group.name\" >\r\n            <div ng-messages=\"form.label.$error\">\r\n              <div ng-message=\"required\">Group name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Short Name</label>\r\n            <input type=\"text\" name=\"shortName\" required ng-model=\"vm.group.shortName\">\r\n            <div ng-messages=\"form.shortName.$error\">\r\n              <div ng-message=\"required\">Short name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n        </div>\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Located in (Country)</label>\r\n            <input name=\"address\" ng-model=\"vm.group.address\" required>\r\n            <div ng-messages=\"form.address.$error\">\r\n              <div ng-message=\"required\">Address is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Homepage</label>\r\n            <input name=\"homepage\" ng-model=\"vm.group.homepage\" required>\r\n            <div ng-messages=\"form.homepage.$error\">\r\n              <div ng-message=\"required\">Homepage name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n        </div>\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-input-has-placeholder\">\r\n            <label>Start Date/Time</label>\r\n            <input mdc-datetime-picker=\"\" date=\"true\" time=\"true\" type=\"text\" required\r\n            placeholder=\"Date\" max-date=\"dateTimeEnd\" ng-model=\"vm.group.date\" class=\" md-input\"\r\n            id=\"input_0\">\r\n          </md-input-container>\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Description</label>\r\n            <input name=\"description\" ng-model=\"vm.group.description\" required>\r\n            <div ng-messages=\"form.description.$error\">\r\n              <div ng-message=\"required\">Description name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n        </div>\r\n      </md-dialog-content>\r\n\r\n      <md-dialog-actions layout=\"row\" layout-align=\"end center\">\r\n        <md-button class=\"md-primary\" ng-click=\"vm.save()\" ng-disabled=\"form.$invalid\" md-autofocus>Save</md-button>\r\n      </md-dialog-actions>\r\n    </form>\r\n  </md-dialog>\r\n"

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = "<main flex layout=\"row\" layout-align=\"space-between stretch\">\r\n    <md-sidenav md-disable-backdrop md-component-id=\"event-nav\"  layout=\"column\" md-is-locked-open=\"vm.$mdMedia('gt-sm')\" md-is-open=\"true\"\r\n      ng-class=\"{'md-whiteframe-z2': vm.$mdMedia('gt-sm')}\" class=\"md-sidenav-left md-sidenav-list\">\r\n      <md-toolbar class=\"md-whiteframe-z2\">\r\n        <div class=\"md-toolbar-tools\">\r\n          <tool-bar></tool-bar>\r\n          <h3>Groups #{{vm.groups.length}}</h3>\r\n        </div>\r\n      </md-toolbar>\r\n\r\n      <generic-list items=\"vm.groups\"\r\n        selected-item=\"vm.selectedGroup\"\r\n        item-selected=\"vm.showGroupDetails(item)\" list-type=\"'groups'\"></generic-list>\r\n\r\n        <md-button class=\"md-accent md-fab md-fab-bottom-right\" ng-click=\"vm.addGroup($event)\">\r\n          <md-icon>group_add</md-icon>\r\n        </md-button>\r\n    </md-sidenav>\r\n\r\n\r\n    <section flex layout=\"column\">\r\n      <md-content flex layout=\"column\" class=\"background\">\r\n        <md-toolbar class=\"x-large md-primary md-hue-1\" ng-show=\"vm.selectedGroup\" layout=\"row\" layout-align=\"center start\">\r\n          <div flex flex-gt-sm=\"95\">\r\n            <div class=\"md-toolbar-tools\">\r\n              <h1 class=\"md-title\">{{vm.selectedGroup.name}} <br >\r\n              <em >{{vm.selectedGroup.groupType.name}}</em> </h1>\r\n              <span flex></span>\r\n              <md-button class=\"md-icon-button\" ui-sref=\"appoverview\">\r\n                  <md-icon>home</md-icon>\r\n              </md-button>\r\n              <custom-menu item=\"vm.selectedGroup\" category=\"'group'\"\r\n              on-delete=\"vm.deleteGroup($event)\" on-edit=\"vm.editGroup($event)\"></custom-menu>\r\n            </div>\r\n\r\n            <md-list class=\"md-subhead\">\r\n              <md-list-item>\r\n                <md-icon>date_range</md-icon>\r\n                <p>{{ vm.selectedGroup.date  }}</p>\r\n              </md-list-item>\r\n              <md-list-item>\r\n                <md-icon>place</md-icon>\r\n                <p>{{ vm.selectedGroup.address }}</p>\r\n              </md-list-item>\r\n              <md-list-item>\r\n                <md-icon>home</md-icon>\r\n                <p><a ng-href=\"www.google.com\">{{vm.selectedGroup.homepage}}</a></p>\r\n              </md-list-item>\r\n            </md-list>\r\n\r\n          </div>\r\n        </md-toolbar>\r\n\r\n        <div flex layout-gt-sm=\"row\" layout-align=\"center start\" class=\"toolbar-overlay-content\">\r\n          <div flex-gt-sm=\"95\" ng-show=\"vm.selectedGroup\">\r\n\r\n            <md-card>\r\n              <md-card-title layout=\"row\">\r\n                <md-card-title-text flex>\r\n                  <span class=\"md-headline\">Members</span>\r\n                </md-card-title-text>\r\n             </md-card-title>\r\n\r\n              <md-card-content>\r\n               <generic-table items=\"vm.selectedGroup.members\" area=\"'groups'\"></generic-table>\r\n              </md-card-content>\r\n\r\n            </md-card>\r\n          </div>\r\n        </div>\r\n      </md-content>\r\n\r\n    </section>\r\n  </main>\r\n"

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var angular = __webpack_require__(2);
	var add_user_1 = __webpack_require__(10);
	var OverviewUserCtrl = (function () {
	    /* @ngInject */
	    function OverviewUserCtrl($timeout, $mdMedia, $mdSidenav, $q, $log, $state, api, dialogService) {
	        var _this = this;
	        this.$timeout = $timeout;
	        this.$mdMedia = $mdMedia;
	        this.$mdSidenav = $mdSidenav;
	        this.$q = $q;
	        this.$log = $log;
	        this.$state = $state;
	        this.api = api;
	        this.dialogService = dialogService;
	        this.$log.info('initializing user control');
	        this.api.allUsers.then(function (usrs) {
	            _this.users = usrs;
	            _this.showUserDetails(_this.users[0]);
	        });
	        this.api.allGroups.then(function (grps) {
	            _this.allGroups = grps;
	        });
	    }
	    OverviewUserCtrl.prototype.showUserDetails = function (user) {
	        var _this = this;
	        this.selectedUser = user;
	        this.api.allGroups.then(function (grps) {
	            _this.userAssociations = user.memberOf.map(function (x) {
	                return grps.filter(function (y) { return y.id === x.groupId; })[0];
	            });
	        });
	    };
	    OverviewUserCtrl.prototype.addUser = function (ev) {
	        var _this = this;
	        this.dialogService.show({
	            controller: add_user_1.AddUserCtrl,
	            template: __webpack_require__(16),
	            targetEvent: ev,
	            locals: {
	                allAvailGroups: angular.copy(this.allGroups),
	            },
	        }).then(function (userInfo) {
	            _this.api.saveUser(userInfo).then(function (result) {
	                var persistedUser = result[0];
	                _this.users.push(persistedUser);
	                _this.showUserDetails(persistedUser);
	                _this.dialogService.notify("User with name " + _this.selectedUser.name + " is created.");
	                userInfo.memberOf.map(function (mem) {
	                    var membershipDetails = __assign({}, userInfo, { membershipId: mem.membershipId, joiningDate: new Date().toLocaleString(), duration: { value: 1, unit: 'year' }, designation: 'Member', isMembershipCancelled: false });
	                    var specificGrp = _this.allGroups.filter(function (x) { return x.id === mem.groupId; })[0];
	                    specificGrp.members.push(membershipDetails);
	                });
	            });
	        });
	    };
	    return OverviewUserCtrl;
	}());
	exports.OverviewUserPage = {
	    controllerAs: 'vm',
	    template: __webpack_require__(17),
	    controller: OverviewUserCtrl,
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	var angular = __webpack_require__(2);
	var uniqueId = __webpack_require__(11);
	var AddUserCtrl = (function () {
	    /* @ngInject */
	    function AddUserCtrl($mdDialog, $timeout, $q, allAvailGroups) {
	        this.$mdDialog = $mdDialog;
	        this.$timeout = $timeout;
	        this.$q = $q;
	        this.allAvailGroups = allAvailGroups;
	        this.simulateQuery = false;
	        this.selectedGroups = [];
	        this.allGroups = allAvailGroups.map(function (x) {
	            var grp = __assign({}, x, { searchText: x.name.toLowerCase() });
	            return grp;
	        });
	    }
	    AddUserCtrl.prototype.querySearch = function (criteria) {
	        return criteria ? this.allGroups.filter(this.createFilterFor(criteria)) : [];
	    };
	    AddUserCtrl.prototype.createFilterFor = function (query) {
	        var lowercaseQuery = angular.lowercase(query);
	        return function filterFn(item) {
	            return (item.searchText.indexOf(lowercaseQuery) === 0);
	        };
	    };
	    AddUserCtrl.prototype.cancel = function () {
	        this.$mdDialog.cancel();
	    };
	    AddUserCtrl.prototype.save = function () {
	        this.user.memberOf = this.selectedGroups.map(function (x) {
	            return {
	                groupId: x.id,
	                membershipId: uniqueId(),
	            };
	        });
	        this.$mdDialog.hide(this.user);
	    };
	    return AddUserCtrl;
	}());
	exports.AddUserCtrl = AddUserCtrl;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var v1 = __webpack_require__(12);
	var v4 = __webpack_require__(15);
	
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	
	module.exports = uuid;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(13);
	var bytesToUuid = __webpack_require__(14);
	
	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html
	
	// random #'s we need to init node and clockseq
	var _seedBytes = rng();
	
	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];
	
	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
	
	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;
	
	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];
	
	  options = options || {};
	
	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;
	
	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();
	
	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;
	
	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
	
	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }
	
	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }
	
	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }
	
	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;
	
	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;
	
	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;
	
	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;
	
	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;
	
	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;
	
	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;
	
	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }
	
	  return buf ? buf : bytesToUuid(b);
	}
	
	module.exports = v1;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection
	var rng;
	
	var crypto = global.crypto || global.msCrypto; // for IE 11
	if (crypto && crypto.getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(rnds8);
	    return rnds8;
	  };
	}
	
	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }
	
	    return rnds;
	  };
	}
	
	module.exports = rng;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}
	
	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  return bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}
	
	module.exports = bytesToUuid;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(13);
	var bytesToUuid = __webpack_require__(14);
	
	function v4(options, buf, offset) {
	  var i = buf && offset || 0;
	
	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};
	
	  var rnds = options.random || (options.rng || rng)();
	
	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;
	
	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ++ii) {
	      buf[i + ii] = rnds[ii];
	    }
	  }
	
	  return buf || bytesToUuid(rnds);
	}
	
	module.exports = v4;


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = "<md-dialog aria-label=\"Add User\"  flex-sm=\"80\" flex-gt-sm=\"50\">\r\n    <form name=\"form\" novalidate layout=\"column\" flex>\r\n      <md-toolbar>\r\n        <div class=\"md-toolbar-tools\">\r\n          <h2>Add User</h2>\r\n          <span flex></span>\r\n          <md-button class=\"md-icon-button\" ng-click=\"vm.cancel()\">\r\n            <md-icon aria-label=\"Close dialog\">close</md-icon>\r\n          </md-button>\r\n        </div>\r\n      </md-toolbar>\r\n      <md-dialog-content  class=\"condensed-dialog\" flex layout=\"column\" layout-align=\"start stretch\">\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>User Name</label>\r\n            <input type=\"text\"\r\n              name=\"label\" required\r\n              ng-model=\"vm.user.name\" >\r\n            <div ng-messages=\"form.label.$error\">\r\n              <div ng-message=\"required\">User name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Short Name</label>\r\n            <input type=\"text\" name=\"shortName\" required ng-model=\"vm.user.shortName\">\r\n            <div ng-messages=\"form.shortName.$error\">\r\n              <div ng-message=\"required\">Short name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n        </div>\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Located in (street)</label>\r\n            <input name=\"street\" ng-model=\"vm.user.address.street\" required>\r\n            <div ng-messages=\"form.street.$error\">\r\n              <div ng-message=\"required\">Street name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Located in (state)</label>\r\n            <input name=\"state\" ng-model=\"vm.user.address.state\" required>\r\n            <div ng-messages=\"form.state.$error\">\r\n              <div ng-message=\"required\">State name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n        </div>\r\n\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Email</label>\r\n            <input name=\"email\" ng-model=\"vm.user.email\" required ng-pattern=\"/^.+@.+\\..+$/\">\r\n            <div ng-messages=\"form.email.$error\">\r\n                <div ng-message-exp=\"['required', 'pattern']\">\r\n                    Email is required and with valid format.\r\n                </div>\r\n            </div>\r\n          </md-input-container>\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <label>Description</label>\r\n            <input name=\"description\" ng-model=\"vm.user.description\" required>\r\n            <div ng-messages=\"form.description.$error\">\r\n              <div ng-message=\"required\">Description name is required!</div>\r\n            </div>\r\n          </md-input-container>\r\n        </div>\r\n\r\n        <div layout-gt-xs=\"row\">\r\n          <md-input-container class=\"md-block\" flex-gt-xs>\r\n            <md-contact-chips required\r\n              ng-model=\"vm.selectedGroups\"\r\n              md-contacts=\"vm.querySearch($query)\"\r\n              md-contact-name=\"name\"\r\n              md-contact-image=\"image\"\r\n              md-require-match=\"true\"\r\n              md-highlight-flags=\"i\"\r\n              filter-selected=\"true\"\r\n              placeholder=\"Add more groups....\">\r\n            </md-contact-chips>\r\n            <div class=\"hint\">Select atleast one group</div>\r\n        </md-input-container>\r\n        </div>\r\n      </md-dialog-content>\r\n\r\n      <md-dialog-actions layout=\"row\" layout-align=\"end center\">\r\n        <md-button class=\"md-primary\" ng-click=\"vm.save()\" ng-disabled=\"form.$invalid\" md-autofocus>Save</md-button>\r\n      </md-dialog-actions>\r\n    </form>\r\n  </md-dialog>\r\n"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = "<main flex layout=\"row\" layout-align=\"space-between stretch\">\r\n    <md-sidenav md-disable-backdrop md-component-id=\"event-nav\"  layout=\"column\" md-is-locked-open=\"vm.$mdMedia('gt-sm')\" md-is-open=\"true\"\r\n      ng-class=\"{'md-whiteframe-z2': vm.$mdMedia('gt-sm')}\" class=\"md-sidenav-left md-sidenav-list\">\r\n      <md-toolbar class=\"md-whiteframe-z2\">\r\n        <div class=\"md-toolbar-tools\">\r\n          <tool-bar></tool-bar>\r\n          <h3>Users #{{vm.users.length}}</h3>\r\n        </div>\r\n      </md-toolbar>\r\n\r\n      <generic-list items=\"vm.users\"\r\n        selected-item=\"vm.selectedUser\"\r\n        item-selected=\"vm.showUserDetails(item)\" list-type=\"'users'\"></generic-list>\r\n\r\n      <md-button class=\"md-accent md-fab md-fab-bottom-right\" ng-click=\"vm.addUser($event)\">\r\n        <md-icon>person_add</md-icon>\r\n      </md-button>\r\n    </md-sidenav>\r\n\r\n    <section flex layout=\"column\">\r\n      <md-content flex layout=\"column\" class=\"background\">\r\n        <md-toolbar class=\"x-large md-primary md-hue-1\" ng-show=\"vm.selectedUser\" layout=\"row\" layout-align=\"center start\">\r\n          <div flex flex-gt-sm=\"95\">\r\n            <div class=\"md-toolbar-tools\">\r\n              <h1 class=\"md-title\">{{vm.selectedUser.name}}  <br >\r\n              <em >{{vm.selectedUser.description}}</em> </h1>\r\n              <span flex></span>\r\n\r\n              <md-button class=\"md-icon-button\" ui-sref=\"appoverview\">\r\n                <md-icon>home</md-icon>\r\n              </md-button>\r\n              <custom-menu item=\"vm.selectedUser\" category=\"'user'\"\r\n                on-delete=\"vm.deleteUser($event)\" on-edit=\"vm.editUser($event)\"></custom-menu>\r\n            </div>\r\n\r\n            <md-list class=\"md-subhead\">\r\n              <md-list-item>\r\n                  <md-icon>place</md-icon>\r\n                  <p>{{vm.selectedUser.address.street}}, {{vm.selectedUser.address.state}}</p>\r\n              </md-list-item>\r\n              <md-list-item>\r\n                  <md-icon>mail</md-icon>\r\n                  <p>{{vm.selectedUser.email}}</p>\r\n               </md-list-item>\r\n            </md-list>\r\n\r\n          </div>\r\n        </md-toolbar>\r\n\r\n        <div flex layout-gt-sm=\"row\" layout-align=\"center start\" class=\"toolbar-overlay-content\">\r\n          <div flex-gt-sm=\"95\" ng-show=\"vm.selectedUser\">\r\n\r\n            <md-card>\r\n              <md-card-title layout=\"row\">\r\n                <md-card-title-text flex>\r\n                  <span class=\"md-headline\">Groups</span>\r\n                </md-card-title-text>\r\n             </md-card-title>\r\n\r\n              <md-card-content>\r\n               <generic-table items=\"vm.userAssociations\"  area=\"'user'\"></generic-table>\r\n              </md-card-content>\r\n\r\n            </md-card>\r\n          </div>\r\n        </div>\r\n      </md-content>\r\n\r\n    </section>\r\n  </main>\r\n"

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var GenericListCtrl = (function () {
	    /* @ngInject */
	    function GenericListCtrl($log) {
	        this.$log = $log;
	        $log.info('starting up the generic list controller');
	    }
	    return GenericListCtrl;
	}());
	exports.GenericList = {
	    controllerAs: 'vm',
	    template: __webpack_require__(19),
	    controller: GenericListCtrl,
	    bindings: {
	        items: '=',
	        selectedItem: '=',
	        listType: '=',
	        itemSelected: '&',
	    },
	};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = "<md-input-container class=\"search-control md-block\" flex-gt-sm ng-if=\"vm.items.length > 0\">\r\n  <md-icon>search</md-icon>\r\n  <input ng-model=\"vm.search\" placeholder=\"Search\" />\r\n  <h6 class=\"hint\" ng-if=\"vm.search.length >= 1\" ng-show=\"(vm.items | filter:vm.search).length > 0  \">\r\n    Found {{(vm.items | filter:vm.search).length}} item(s) from {{vm.items.length}}</h6>\r\n</md-input-container>\r\n\r\n<md-list class=\"ItemList\">\r\n  <md-list-item class=\"md-3-line\"\r\n                ng-repeat=\"item in vm.items | orderBy: 'name': false | filter:vm.search track by item.id\"\r\n                scroll-if=\"item.id === vm.selectedItem.id\"\r\n                ng-class=\"{'selected': item.id === vm.selectedItem.id}\"\r\n                ng-click=\"vm.itemSelected({item: item})\"\r\n                id=\"{{item.id}}\">\r\n    <md-icon class=\"md-avatar\">{{ vm.listType =='groups' ? item.groupType.icon : 'person' }}</md-icon>\r\n    <div class=\"md-list-item-text\" layout=\"column\">\r\n      <h3>{{ item.name }}</h3>\r\n      <h4><md-icon>{{vm.listType =='groups' ? 'group_work' : 'short_text' }}</md-icon>\r\n          {{vm.listType =='groups' ? item.groupType.name: item.shortName }}</h4>\r\n      <p><md-icon>{{vm.listType == 'groups' ? 'people' : 'group_work' }}</md-icon>\r\n          {{vm.listType =='groups' ? item.members.length : item.memberOf.length }}</p>\r\n    </div>\r\n    <md-divider></md-divider>\r\n  </md-list-item>\r\n\r\n  <md-list-item ng-show=\"(vm.items | filter:vm.search).length == 0\">\r\n    <p><md-icon class=\"search-message\">error_outline</md-icon> No items found. </p>\r\n  </md-list-item>\r\n\r\n</md-list>\r\n"

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var GenericTableCtrl = (function () {
	    /* @ngInject */
	    function GenericTableCtrl($log) {
	        this.$log = $log;
	        $log.info('starting up the generic table controller');
	    }
	    return GenericTableCtrl;
	}());
	exports.GenericTable = {
	    controllerAs: 'vm',
	    template: __webpack_require__(21),
	    controller: GenericTableCtrl,
	    bindings: {
	        items: '=',
	        area: '<',
	    },
	};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = "<md-table-container ng-if=\"vm.area ==='groups'\">\r\n  <table md-table class=\"md-primary\"  md-row-select=\"vm.rowSelection\" multiple ng-model=\"vm.selected\">\r\n    <thead md-head md-order=\"vm.order\">\r\n      <tr md-row>\r\n        <th md-column></th>\r\n        <th md-column md-order-by=\"membershipId\">Membership Id</th>\r\n        <th md-column >Member Name</th>\r\n        <th md-column >Designation </th>\r\n        <th md-column >Joining Date</th>\r\n        <th md-column>Duration</th>\r\n        <th md-column>Contact Info</th>\r\n        <th md-column>Membership</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody md-body>\r\n      <tr md-row md-select=\"item\" md-select-id=\"_id\" md-auto-select ng-repeat=\"item in vm.items | orderBy: vm.order track by $index\">\r\n        <td md-cell><md-icon class=\"md-avatar\">person</md-icon></td>\r\n        <td md-cell>{{item.membershipId}}</td>\r\n        <td md-cell>{{item.name}}</td>\r\n        <td md-cell>{{item.designation}}</td>\r\n        <td md-cell>{{item.joiningDate}}</td>\r\n        <td md-cell>{{item.duration.value}} {{item.duration.unit}}</td>\r\n        <td md-cell>{{item.email}}</td>\r\n        <td md-cell>\r\n          <md-icon>{{item.isMembershipCancelled ? 'mood_bad' : 'mood'}}</md-icon>\r\n        </td>\r\n      </tr>\r\n    </tbody>\r\n    <tfoot md-foot>\r\n      <tr md-row>\r\n        <td md-cell colspan=\"2\"><label>Associatons: </label>{{ vm.items.length }} of {{vm.items.length}}</td>\r\n        <td md-cell colspan=\"6\"></td>\r\n      </tr>\r\n    </tfoot>\r\n  </table>\r\n</md-table-container>\r\n\r\n<md-table-container ng-if=\"vm.area === 'user'\">\r\n  <table md-table class=\"md-primary\"  md-row-select=\"vm.rowSelection\" multiple ng-model=\"vm.selected\">\r\n    <thead md-head md-order=\"vm.order\">\r\n      <tr md-row>\r\n        <th md-column></th>\r\n        <th md-column >Group Name</th>\r\n        <th md-column >Group Type</th>\r\n        <th md-column >Address </th>\r\n        <th md-column >Home page</th>\r\n        <th md-column>Start Date</th>\r\n        <th md-column>Description</th>\r\n      </tr>\r\n    </thead>\r\n    <tbody md-body>\r\n      <tr md-row md-select=\"item\" md-select-id=\"_id\" md-auto-select ng-repeat=\"item in vm.items | orderBy: vm.order track by $index\">\r\n        <td md-cell><md-icon class=\"md-avatar\">{{item.groupType.icon}}</md-icon></td>\r\n        <td md-cell>{{item.name}}</td>\r\n        <td md-cell>{{item.groupType.name}}</td>\r\n        <td md-cell>{{item.address}}</td>\r\n        <td md-cell>{{item.homepage}}</td>\r\n        <td md-cell>{{item.date}}</td>\r\n        <td md-cell>{{item.description}}</td>\r\n      </tr>\r\n    </tbody>\r\n    <tfoot md-foot>\r\n      <tr md-row>\r\n        <td md-cell colspan=\"2\"><label>Associatons: </label>{{ vm.items.length }} of {{vm.items.length}}</td>\r\n        <td md-cell colspan=\"5\"></td>\r\n      </tr>\r\n    </tfoot>\r\n  </table>\r\n</md-table-container>\r\n\r\n"

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var ToolbarCtrl = (function () {
	    /* @ngInject */
	    function ToolbarCtrl($mdDialog, $mdSidenav) {
	        this.$mdDialog = $mdDialog;
	        this.$mdSidenav = $mdSidenav;
	    }
	    ToolbarCtrl.prototype.toggleSidenav = function () {
	        this.$mdSidenav('sidenav').toggle();
	    };
	    ToolbarCtrl.prototype.closeSidenav = function () {
	        this.$mdSidenav('sidenav').close();
	    };
	    return ToolbarCtrl;
	}());
	exports.ToolBar = {
	    controllerAs: 'vm',
	    template: __webpack_require__(23),
	    controller: ToolbarCtrl,
	};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	module.exports = "<section layout=\"row\" layout-sm=\"column\" layout-align=\"center center\" layout-wrap>\r\n  <md-button class=\"md-icon-button\" aria-label=\"people\" ui-sref=\"overview\">\r\n    <md-tooltip>groups</md-tooltip>\r\n    <md-icon>people</md-icon>\r\n  </md-button>\r\n  <md-button class=\"md-icon-button\" aria-label=\"person\" ui-sref=\"useroverview\">\r\n    <md-tooltip>users</md-tooltip>\r\n    <md-icon>person</md-icon>\r\n  </md-button>\r\n</section>"

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var angular = __webpack_require__(2);
	var DialogService = (function () {
	    /* @ngInject */
	    function DialogService($mdToast, $mdDialog, $mdMedia, $log) {
	        this.$mdToast = $mdToast;
	        this.$mdDialog = $mdDialog;
	        this.$mdMedia = $mdMedia;
	        this.$log = $log;
	    }
	    DialogService.prototype.show = function (opts) {
	        var useFullScreen = this.$mdMedia('xs');
	        return this.$mdDialog.show({
	            controllerAs: 'vm',
	            controller: opts.controller,
	            template: opts.template,
	            parent: angular.element(document.body),
	            targetEvent: opts.targetEvent,
	            clickOutsideToClose: false,
	            fullscreen: useFullScreen,
	            locals: opts.locals,
	        });
	    };
	    DialogService.prototype.notify = function (msg) {
	        this.$log.info(msg);
	        var toast = this.$mdToast.simple()
	            .textContent(msg)
	            .action('OK')
	            .highlightAction(false)
	            .hideDelay(6000)
	            .position('top right');
	        return this.$mdToast.show(toast);
	    };
	    DialogService.prototype.alert = function (msg, title, event) {
	        var confirm = this.$mdDialog.alert()
	            .title(title)
	            .textContent(msg)
	            .targetEvent(event)
	            .ok('OK');
	        return this.$mdDialog.show(confirm);
	    };
	    DialogService.prototype.confirm = function (msg, event) {
	        var confirm = this.$mdDialog.confirm()
	            .title('Confirmation Dialog')
	            .textContent(msg)
	            .targetEvent(event)
	            .ok('Delete')
	            .cancel('Cancel');
	        return this.$mdDialog.show(confirm);
	    };
	    return DialogService;
	}());
	exports.DialogService = DialogService;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var MenuCtrl = (function () {
	    /* @ngInject */
	    function MenuCtrl($mdDialog) {
	        this.$mdDialog = $mdDialog;
	    }
	    MenuCtrl.prototype.openMenu = function ($mdOpenMenu, ev) {
	        $mdOpenMenu(ev);
	    };
	    MenuCtrl.prototype.isMenuItemVisible = function () {
	        return this.category !== undefined;
	    };
	    return MenuCtrl;
	}());
	exports.Menu = {
	    controllerAs: 'vm',
	    controller: MenuCtrl,
	    template: __webpack_require__(26),
	    bindings: {
	        category: '<',
	        item: '=',
	        onDelete: '&',
	        onEdit: '&',
	        onClone: '&',
	        onAdd: '&',
	    },
	};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	module.exports = "<md-menu>\r\n    <md-button aria-label=\"open menu\" class=\"md-icon-button\" ng-click=\"vm.openMenu($mdMenu.open, $event)\">\r\n      <md-icon md-menu-origin>more_vert</md-icon>\r\n    </md-button>\r\n    <md-menu-content width=\"2\">\r\n      <md-menu-item>\r\n        <md-button ng-click=\"vm.onEdit({item: vm.item})\" ng-disabled=\"true\">\r\n          <md-icon md-menu-align-target>edit</md-icon>\r\n          Edit\r\n        </md-button>\r\n      </md-menu-item>\r\n      <md-menu-item>\r\n        <md-button ng-click=\"vm.onDelete({item: vm.item})\" ng-disabled=\"true\">\r\n          <md-icon md-menu-align-target>delete</md-icon>\r\n          Delete\r\n        </md-button>\r\n      </md-menu-item>\r\n      <md-divider></md-divider>\r\n      <md-menu-item ng-if=\"vm.isMenuItemVisible()\">\r\n        <md-button ng-click=\"vm.onClone({item: vm.item})\" ng-disabled=\"true\">\r\n          <md-icon md-menu-align-target>content_copy</md-icon>\r\n           Clone {{vm.category}}\r\n        </md-button>\r\n      </md-menu-item>\r\n      <md-divider></md-divider>\r\n      <md-menu-item ng-if=\"vm.isMenuItemVisible()\">\r\n          <md-button ng-click=\"vm.onAdd($event)\" ng-disabled=\"true\">\r\n            <md-icon md-menu-align-target>{{vm.category == 'group' ? 'person' : 'people'}}</md-icon>\r\n             {{vm.category == 'group' ? 'Add members' : 'Add to groups'}}\r\n          </md-button>\r\n        </md-menu-item>\r\n    </md-menu-content>\r\n  </md-menu>\r\n"

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	var AppStartCtrl = (function () {
	    /* @ngInject */
	    function AppStartCtrl($mdMedia) {
	        this.$mdMedia = $mdMedia;
	    }
	    return AppStartCtrl;
	}());
	exports.AppStartPage = {
	    controllerAs: 'vm',
	    template: __webpack_require__(28),
	    controller: AppStartCtrl,
	};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	module.exports = "<main flex layout=\"row\" layout-align=\"space-between stretch\">\r\n  <section flex layout=\"column\">\r\n    <md-toolbar class=\"md-whiteframe-z1\">\r\n      <div layout=\"row\" layout-align=\"space-between center\" class=\"md-toolbar-tools\">\r\n        <md-button hide-gt-sm class=\"md-icon-button\" aria-label=\"Settings\" ng-click=\"vm.toggleSidenav('profiles-nav')\">\r\n          <md-icon>arrow_back</md-icon>\r\n        </md-button>\r\n        <h3>User Group Association Suite</h3>\r\n      </div>\r\n    </md-toolbar>\r\n    <md-content flex layout=\"column\" class=\"background\">\r\n      <div flex layout-gt-sm=\"row\" layout-align=\"center start\">\r\n        <div flex-gt-sm=\"95\" flex-gt-lg=\"80\">\r\n\r\n          <div class=\"card-like\">\r\n            <main class=\"historicaltrend\" layout=\"row\">\r\n              <md-list layout-margin>\r\n\r\n                <md-list-item class=\"md-3-line\">\r\n                  <img ng-src=\"http://www.iconarchive.com/download/i103427/paomedia/small-n-flat/handshake.ico\" class=\"md-avatar\" alt=\"{{item.who}}\" />\r\n                  <div class=\"md-list-item-text\" layout=\"column\">\r\n                    <h3>Welcome to Shake Hands</h3>\r\n                  </div>\r\n                </md-list-item>\r\n                <md-list-item class=\"md-3-line md-long-text\">\r\n                  <md-icon class=\"md-avatar\">info</md-icon>\r\n                  <div class=\"md-list-item-text warning-message\">\r\n                    <h3>Introduction</h3>\r\n                    <p>\r\n                     This app serves as a platform where new users and groups can be created. Users can join any group of their\r\n                     choice and enjoy the privilledges of specific group.\r\n                     <br>\r\n                     The list of groups is alphabetically sorted, shows the most meta information about the group like type and member count.\r\n                     The is list is enriched with search facility.\r\n                     <br>\r\n                     The group details page shows basic information about the group like name, type of group, location and link to\r\n                     home page. It also shows basic information about the users along with their membership statuses.\r\n                     <br>\r\n                     The selection of groups while creation user is enriched with auto-completion facility.\r\n                     The list of users is alphabetically sorted, shows the most meta information about the user like nick name and group count.\r\n                     The is list is powered with search facility.\r\n                     <br>\r\n                     The user details page shows the basic information about the user and his/her association with specific group.\r\n                     <br>\r\n                     The user is notified creation of new group and user via toast in a top right corner. Users and groups got selected after creation.\r\n                     Tooltips are placed in all sections in order help user for app usage.\r\n                    </p>\r\n                  </div>\r\n                </md-list-item>\r\n                <md-divider></md-divider>\r\n                <md-list-item class=\"md-3-line md-long-text\">\r\n                  <md-icon class=\"md-avatar\">info</md-icon>\r\n                  <div class=\"md-list-item-text warning-message\">\r\n                    <h3>How to use the app</h3>\r\n                    <p>\r\n                     The app is self driven and gives notification to user at various instances. The icon selection also helps the user to\r\n                     navigate through the app. From introduction page user can press \"Start App\" and navigate to the group page. The group\r\n                     page contains a \"fab button\" for opening creation dialog box. User can select group type and fill the manadatory field\r\n                     to create new group. User will get notification in top right corner on successful creation of group and newly created\r\n                     group will get selected.\r\n                    <br>\r\n                    The user can navigate to the users page by selecting \"Person\" icon on top of the list. On the \"User page\" a user\r\n                    can create the new user, while creating one needs to select the groups to join and once the user is created successfully\r\n                    system will show the notification.\r\n                    <br>\r\n                    Both user page and group page will show groups and members on selecting respective entity.\r\n                    </p>\r\n                    <md-input-container flex-gt-md=\"30\">\r\n                  </div>\r\n                </md-list-item>\r\n                <md-divider></md-divider>\r\n                <md-list-item class=\"md-3-line md-long-text\">\r\n                  <md-icon class=\"md-avatar\">info</md-icon>\r\n                  <div class=\"md-list-item-text warning-message\">\r\n                    <h3>Technical Stack</h3>\r\n                    <p>\r\n                      Typescript, AngularJS, Node.js, Visualization Library: Angular Material, Database: Mongodb, Browser: Chrome\r\n                    </p>\r\n                  </div>\r\n                </md-list-item>\r\n                <md-divider></md-divider>\r\n                <md-list-item class=\"md-3-line md-long-text\">\r\n                  <md-icon class=\"md-avatar\">info</md-icon>\r\n                  <div class=\"md-list-item-text warning-message\">\r\n                    <h3>Restrictions and assumptions:</h3>\r\n                    <p>\r\n                      For the demo purposes some assumptions are being made:\r\n                        <br>App is restricted to add new groups and new users (user joining groups on creation time).\r\n                        <br>There are pre-defined group types are present in the system.\r\n                        <br>The menu items are disablesd for demo purpose, they represent the future aspect of application.\r\n                        <br>A user can only be created after selecting one of the existing groups.\r\n                    </p>\r\n                    <br />\r\n                    <p>Future Aspects:\r\n                          <br> Sending mails for notification\r\n                          <br>Displaying discussion section in groups page\r\n                          <br>Ability to change membership status\r\n                    </p>\r\n                  </div>\r\n                </md-list-item>\r\n\r\n                <md-divider></md-divider>\r\n                <md-subheader class=\"md-no-sticky\">Start Application.</md-subheader>\r\n                <md-list-item ui-sref=\"overview\">\r\n                  <md-icon>view_quilt</md-icon>\r\n                  <p>Start app</p>\r\n                </md-list-item>\r\n\r\n              </md-list>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </md-content>\r\n  </section>\r\n  </main>"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWZlMzc0OTdkMzUzYmI3ODVhNTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL21haW4tbW9kdWxlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFuZ3VsYXJcIiIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL3Jlc3QtY29tbXVuaWNhdGlvbi9yZXN0LWFwaS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL3Jlc3QtY29tbXVuaWNhdGlvbi92aWV3bW9kZWwtZ2VuZXJhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9hcHAvb3ZlcnZpZXcvb3ZlcnZpZXctcGFnZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL292ZXJ2aWV3L2FkZC1ncm91cC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL292ZXJ2aWV3L2FkZC1ncm91cC5odG1sIiwid2VicGFjazovLy8uL3NyYy9hcHAvb3ZlcnZpZXcvb3ZlcnZpZXctcGFnZS5odG1sIiwid2VicGFjazovLy8uL3NyYy9hcHAvb3ZlcnZpZXctdXNlci9vdmVydmlldy11c2VyLXBhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9vdmVydmlldy11c2VyL2FkZC11c2VyLnRzIiwid2VicGFjazovLy8uL34vdXVpZC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3V1aWQvdjEuanMiLCJ3ZWJwYWNrOi8vLy4vfi91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3V1aWQvbGliL2J5dGVzVG9VdWlkLmpzIiwid2VicGFjazovLy8uL34vdXVpZC92NC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL292ZXJ2aWV3LXVzZXIvYWRkLXVzZXIuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL292ZXJ2aWV3LXVzZXIvb3ZlcnZpZXctdXNlci1wYWdlLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9pbmZyYS1tb2R1bGVzL2dlbmVyaWMtbGlzdC9nZW5lcmljLWxpc3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9pbmZyYS1tb2R1bGVzL2dlbmVyaWMtbGlzdC9nZW5lcmljLWxpc3QuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2luZnJhLW1vZHVsZXMvZ2VuZXJpYy10YWJsZS9nZW5lcmljLXRhYmxlLnRzIiwid2VicGFjazovLy8uL3NyYy9hcHAvaW5mcmEtbW9kdWxlcy9nZW5lcmljLXRhYmxlL2dlbmVyaWMtdGFibGUuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2luZnJhLW1vZHVsZXMvbmF2YmFyL3Rvb2xiYXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9pbmZyYS1tb2R1bGVzL25hdmJhci90b29sYmFyLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9pbmZyYS1tb2R1bGVzL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlLnRzIiwid2VicGFjazovLy8uL3NyYy9hcHAvaW5mcmEtbW9kdWxlcy9tZW51L21lbnUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC9pbmZyYS1tb2R1bGVzL21lbnUvbWVudS5odG1sIiwid2VicGFjazovLy8uL3NyYy9hcHAvYXBwLXN0YXJ0L2FwcC1zdGFydC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwL2FwcC1zdGFydC9hcHAtc3RhcnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQSxhQUFZOztBQUVaLDRDQUEwQztBQUMxQyxzQ0FBa0M7QUFFbEMsUUFBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRTtLQUNqQyxXQUFXO0tB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LEVBQWtCLENBQUM7S0FDckMsVUFBVSxFQUFFLFlBQVk7RUFDekI7Ozs7Ozs7QUNmRCw2akNBQTRqQyxVQUFVLG8xTCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9hcHBcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1ZmUzNzQ5N2QzNTNiYjc4NWE1MiIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHsgTWFpbk1vZHVsZSB9IGZyb20gJy4vbWFpbi1tb2R1bGUnXHJcbmltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnYW5ndWxhcidcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd1c2Vycy1ncm91cHMtYXBwJywgW1xyXG4gICduZ0FuaW1hdGUnLFxyXG4gICduZ01lc3NhZ2VzJyxcclxuICAndWkucm91dGVyJyxcclxuICAnbmdNYXRlcmlhbCcsXHJcbiAgTWFpbk1vZHVsZS5uYW1lLFxyXG5dKVxyXG4gIC5jb25maWcoKFxyXG4gICAgJGxvY2F0aW9uUHJvdmlkZXI6IGFuZ3VsYXIuSUxvY2F0aW9uUHJvdmlkZXIsXHJcbiAgICAkY29tcGlsZVByb3ZpZGVyOiBhbmd1bGFyLklDb21waWxlUHJvdmlkZXIsXHJcbiAgICAkdXJsUm91dGVyUHJvdmlkZXI6IGFuZ3VsYXIudWkuSVVybFJvdXRlclByb3ZpZGVyLFxyXG4gICAgJHN0YXRlUHJvdmlkZXI6IGFuZ3VsYXIudWkuSVN0YXRlUHJvdmlkZXIsXHJcbiAgICAkbWRUaGVtaW5nUHJvdmlkZXI6IGFuZ3VsYXIubWF0ZXJpYWwuSVRoZW1pbmdQcm92aWRlcixcclxuICAgICRtZEljb25Qcm92aWRlcjogYW5ndWxhci5tYXRlcmlhbC5JSWNvblByb3ZpZGVyLFxyXG4gICAgJGh0dHBQcm92aWRlcjogYW5ndWxhci5JSHR0cFByb3ZpZGVyKSA9PiB7XHJcblxyXG4gICAgLy8gVE9ETzogdHVybiB0aGlzIG9uIGZvciBwcm9kdWN0aW9uXHJcbiAgICAvLyAkY29tcGlsZVByb3ZpZGVyLmRlYnVnSW5mb0VuYWJsZWQoZmFsc2UpO1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgIC5zdGF0ZSgnYXBwb3ZlcnZpZXcnLCB7XHJcbiAgICAgIHVybDogJy9hcHBvdmVydmlldycsXHJcbiAgICAgIHRlbXBsYXRlOiAnPGFwcC1zdGFydC1wYWdlIGNsYXNzPVwidWktdmlld3BvcnRcIj48L2FwcC1zdGFydC1wYWdlPicsXHJcbiAgICB9KVxyXG4gICAgIC5zdGF0ZSgndXNlcm92ZXJ2aWV3Jywge1xyXG4gICAgICAgIHVybDogJy91c2VyT3ZlcnZpZXcnLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPG92ZXJ2aWV3LXVzZXItcGFnZSBjbGFzcz1cInVpLXZpZXdwb3J0XCI+PC9vdmVydmlldy11c2VyLXBhZ2U+JyxcclxuICAgICAgfSlcclxuICAgICAgLnN0YXRlKCdvdmVydmlldycsIHtcclxuICAgICAgICB1cmw6ICcvb3ZlcnZpZXcnLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPG92ZXJ2aWV3LXBhZ2UgY2xhc3M9XCJ1aS12aWV3cG9ydFwiPjwvb3ZlcnZpZXctcGFnZT4nLFxyXG4gICAgICB9KVxyXG5cclxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKVxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcG92ZXJ2aWV3JylcclxuXHJcbiAgICAkbWRUaGVtaW5nUHJvdmlkZXIudGhlbWUoJ2RlZmF1bHQnKVxyXG4gICAgLnByaW1hcnlQYWxldHRlKCdkZWVwLXB1cnBsZScsIHtcclxuICAgICAgJ2RlZmF1bHQnOiAnODAwJywgLy8gYnkgZGVmYXVsdCB1c2Ugc2hhZGUgNDAwIGZyb20gdGhlIHBpbmsgcGFsZXR0ZSBmb3IgcHJpbWFyeSBpbnRlbnRpb25zXHJcbiAgICAgICdodWUtMSc6ICc0MDAnLCAvLyB1c2Ugc2hhZGUgMTAwIGZvciB0aGUgPGNvZGU+bWQtaHVlLTE8L2NvZGU+IGNsYXNzXHJcbiAgICAgICdodWUtMic6ICc5MDAnLCAvLyB1c2Ugc2hhZGUgNjAwIGZvciB0aGUgPGNvZGU+bWQtaHVlLTI8L2NvZGU+IGNsYXNzXHJcbiAgICAgICdodWUtMyc6ICdBNzAwJywgLy8gdXNlIHNoYWRlIEExMDAgZm9yIHRoZSA8Y29kZT5tZC1odWUtMzwvY29kZT4gY2xhc3NcclxuICAgIH0pXHJcbiAgICAuYWNjZW50UGFsZXR0ZSgnZ3JlZW4nLCB7XHJcbiAgICAgICdkZWZhdWx0JzogJzQwMCcsIC8vIGJ5IGRlZmF1bHQgdXNlIHNoYWRlIDQwMCBmcm9tIHRoZSBwaW5rIHBhbGV0dGUgZm9yIHByaW1hcnkgaW50ZW50aW9uc1xyXG4gICAgICAnaHVlLTEnOiAnMTAwJywgLy8gdXNlIHNoYWRlIDEwMCBmb3IgdGhlIDxjb2RlPm1kLWh1ZS0xPC9jb2RlPiBjbGFzc1xyXG4gICAgICAnaHVlLTInOiAnNjAwJywgLy8gdXNlIHNoYWRlIDYwMCBmb3IgdGhlIDxjb2RlPm1kLWh1ZS0yPC9jb2RlPiBjbGFzc1xyXG4gICAgICAnaHVlLTMnOiAnODAwJywgLy8gdXNlIHNoYWRlIEExMDAgZm9yIHRoZSA8Y29kZT5tZC1odWUtMzwvY29kZT4gY2xhc3NcclxuICAgIH0pXHJcblxyXG4gICAgJG1kSWNvblByb3ZpZGVyLmRlZmF1bHRJY29uU2V0KCcnLCAxNilcclxuICB9KVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvYXBwL2luZGV4LnRzIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInXHJcbmltcG9ydCB7IFJlc3RBcGkgfSBmcm9tICcuL3Jlc3QtY29tbXVuaWNhdGlvbi9yZXN0LWFwaSdcclxuaW1wb3J0IHsgT3ZlcnZpZXdQYWdlIH0gZnJvbSAnLi9vdmVydmlldy9vdmVydmlldy1wYWdlJ1xyXG5pbXBvcnQgeyBPdmVydmlld1VzZXJQYWdlIH0gZnJvbSAnLi9vdmVydmlldy11c2VyL292ZXJ2aWV3LXVzZXItcGFnZSdcclxuaW1wb3J0IHsgR2VuZXJpY0xpc3QgfSBmcm9tICcuL2luZnJhLW1vZHVsZXMvZ2VuZXJpYy1saXN0L2dlbmVyaWMtbGlzdCdcclxuaW1wb3J0IHsgR2VuZXJpY1RhYmxlIH0gZnJvbSAnLi9pbmZyYS1tb2R1bGVzL2dlbmVyaWMtdGFibGUvZ2VuZXJpYy10YWJsZSdcclxuaW1wb3J0IHsgVG9vbEJhciB9IGZyb20gJy4vaW5mcmEtbW9kdWxlcy9uYXZiYXIvdG9vbGJhcidcclxuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4vaW5mcmEtbW9kdWxlcy9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSdcclxuaW1wb3J0IHsgTWVudSB9IGZyb20gJy4vaW5mcmEtbW9kdWxlcy9tZW51L21lbnUnXHJcbmltcG9ydCB7IEFwcFN0YXJ0UGFnZSB9IGZyb20gJy4vYXBwLXN0YXJ0L2FwcC1zdGFydCdcclxuXHJcbmV4cG9ydCBjb25zdCBNYWluTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3VzZXJzLWdyb3Vwcy1hcHAtY29yZScsXHJcbiAgW1xyXG4gICAgJ25nTWF0ZXJpYWwnLFxyXG4gICAgJ25nTWVzc2FnZXMnLFxyXG4gICAgJ21kLmRhdGEudGFibGUnLFxyXG4gICAgJ25nU2FuaXRpemUnLFxyXG4gICAgJ25nTWF0ZXJpYWxEYXRlUGlja2VyJyxcclxuICBdKVxyXG4gIC5zZXJ2aWNlKCdhcGknLCBSZXN0QXBpKVxyXG4gIC5jb21wb25lbnQoJ292ZXJ2aWV3UGFnZScsIE92ZXJ2aWV3UGFnZSlcclxuICAuY29tcG9uZW50KCdvdmVydmlld1VzZXJQYWdlJywgT3ZlcnZpZXdVc2VyUGFnZSlcclxuICAuY29tcG9uZW50KCdhcHBTdGFydFBhZ2UnLCBBcHBTdGFydFBhZ2UpXHJcbiAgLmNvbXBvbmVudCgnZ2VuZXJpY0xpc3QnLCBHZW5lcmljTGlzdClcclxuICAuY29tcG9uZW50KCdnZW5lcmljVGFibGUnLCBHZW5lcmljVGFibGUpXHJcbiAgLmNvbXBvbmVudCgndG9vbEJhcicsIFRvb2xCYXIpXHJcbiAgLmNvbXBvbmVudCgnY3VzdG9tTWVudScsIE1lbnUpXHJcbiAgLnNlcnZpY2UoJ2RpYWxvZ1NlcnZpY2UnLCBEaWFsb2dTZXJ2aWNlKVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvYXBwL21haW4tbW9kdWxlLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYW5ndWxhclwiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0IHsgdmlld01vZGVsR2VuZXJhdG9yIGFzIGdlbiB9IGZyb20gJy4vdmlld21vZGVsLWdlbmVyYXRvcidcclxuaW1wb3J0IHsgSUdyb3VwVHlwZSwgSUdyb3VwLCBJU2F2ZUdyb3VwIH0gZnJvbSAnLi4vX3R5cGVzL0lHcm91cHMnXHJcbmltcG9ydCB7IElVc2VyIH0gZnJvbSAnLi4vX3R5cGVzL0lVc2VyJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlc3RBcGkge1xyXG5cclxuICAgIHB1YmxpYyBhbGxHcm91cFR5cGVzOiBuZy5JUHJvbWlzZTxJR3JvdXBUeXBlW10+XHJcbiAgICBwdWJsaWMgYWxsVXNlcnM6IG5nLklQcm9taXNlPElVc2VyW10+XHJcbiAgICBwdWJsaWMgYWxsR3JvdXBzOiBuZy5JUHJvbWlzZTxJR3JvdXBbXT5cclxuXHJcbiAgICAvKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJGh0dHA6IGFuZ3VsYXIuSUh0dHBTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSAkcTogYW5ndWxhci5JUVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlICRsb2cpIHtcclxuICAgICAgICB0aGlzLmFsbEdyb3VwVHlwZXMgPSB0aGlzLmdldEdyb3VwVHlwZXMoKVxyXG4gICAgICAgIHRoaXMuYWxsVXNlcnMgPSB0aGlzLmdldFVzZXJzKClcclxuICAgICAgICB0aGlzLmFsbEdyb3VwcyA9IHRoaXMuZ2V0R3JvdXBzKClcclxuICAgIH1cclxuXHJcbiAgICBnZXRHcm91cFR5cGVzKCkge1xyXG4gICAgICAgIHRoaXMuJGxvZy5pbmZvKGBzdGFydCBnZXR0aW5nIGFsbCBhdmFpbGFibGUgZ3JvdXAgdHlwZXNgKVxyXG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldCgnL2FwaS9ncm91cFR5cGVzJykudGhlbihncnBUeXBlcyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZW4uZ2V0QWxsVm1Hcm91cFR5cGVzKGdycFR5cGVzLmRhdGEpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBnZXRVc2VycygpIHtcclxuICAgICAgICB0aGlzLiRsb2cuaW5mbyhgc3RhcnQgZ2V0dGluZyBhbGwgYXZhaWxhYmxlIHBlcnNvbnNgKVxyXG4gICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldCgnL2FwaS91c2VycycpLnRoZW4odXNlcnMgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2VuLmdldEFsbFZtVXNlcnModXNlcnMuZGF0YSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGdldEdyb3VwcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hbGxHcm91cFR5cGVzLnRoZW4odHlwZXMgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hbGxVc2Vycy50aGVuKHVzZXJzID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRodHRwLmdldCgnL2FwaS9ncm91cHMnKS50aGVuKGdycHNJbmZvID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2VuLmdldEFsbFZtR3JvdXBzKGdycHNJbmZvLmRhdGEsIHR5cGVzLCB1c2VycylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzYXZlR3JvdXAobmV3R3JvdXA6IElTYXZlR3JvdXApIHtcclxuICAgICAgICB0aGlzLiRsb2cuaW5mbyhgQWRkaW5nIG5ldyBncm91cCB3aXRoIG5hbWUgJHtuZXdHcm91cC5uYW1lfWApXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAucG9zdCgnL2FwaS9uZXdHcm91cCcsIHtkYXRhOiBuZXdHcm91cH0pLnRoZW4oZ3Jwc0luZm8gPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hbGxHcm91cFR5cGVzLnRoZW4odHlwZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWxsVXNlcnMudGhlbih1c2VycyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdlbi5nZXRBbGxWbUdyb3VwcyhbZ3Jwc0luZm8uZGF0YV0sIHR5cGVzLCB1c2VycylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzYXZlVXNlcihuZXdVc2VyOiBJVXNlcikge1xyXG4gICAgICAgIHRoaXMuJGxvZy5pbmZvKGBBZGRpbmcgbmV3IHVzZXIgd2l0aCBuYW1lICR7bmV3VXNlci5uYW1lfWApXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGh0dHAucG9zdCgnL2FwaS9uZXdVc2VyJywge2RhdGE6IG5ld1VzZXJ9KS50aGVuKHVzZXJzID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdlbi5nZXRBbGxWbVVzZXJzKFt1c2Vycy5kYXRhXSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hcHAvcmVzdC1jb21tdW5pY2F0aW9uL3Jlc3QtYXBpLnRzIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQgeyBJR3JvdXAsIElHcm91cFR5cGUsIElNZW1iZXIgfSBmcm9tICcuLi9fdHlwZXMvSUdyb3VwcydcclxuaW1wb3J0IHsgSVVzZXIsIElBZGRyZXNzIH0gZnJvbSAnLi4vX3R5cGVzL0lVc2VyJ1xyXG5jb25zdCBfbm9JbmZvcm1hdGlvbkZvdW5kID0gJ05vIGluZm9ybWF0aW9uIGZvdW5kJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXdNb2RlbEdlbmVyYXRvciB7XHJcblxyXG4gIGdldEFsbFZtR3JvdXBUeXBlcyhkYXRhSW5mbzogYW55KSB7XHJcbiAgICBjb25zdCBncm91cFR5cGVzID0gZGF0YUluZm8ubWFwKHR5cGUgPT4ge1xyXG4gICAgICBjb25zdCBncm91cFR5cGU6IElHcm91cFR5cGUgPSB7XHJcbiAgICAgICAgaWNvbjogdHlwZS5pY29uLFxyXG4gICAgICAgIG5hbWU6IHR5cGUubmFtZSxcclxuICAgICAgICBpZDogdHlwZS5ncm91cElkLFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBncm91cFR5cGVcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZ3JvdXBUeXBlc1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsVm1Vc2VycyhkYXRhSW5mbzogYW55KSB7XHJcbiAgICBjb25zdCB1c2VycyA9IGRhdGFJbmZvLm1hcCh4ID0+IHtcclxuICAgICAgY29uc3QgdXNlcjogSVVzZXIgPSB7XHJcbiAgICAgICAgbmFtZTogeC5uYW1lLFxyXG4gICAgICAgIGlkOiB4LmlkLFxyXG4gICAgICAgIGVtYWlsOiB4LmVtYWlsLFxyXG4gICAgICAgIGFkZHJlc3M6IHtcclxuICAgICAgICAgIHN0cmVldDogeC5hZGRyZXNzLnN0cmVldCB8fCBfbm9JbmZvcm1hdGlvbkZvdW5kLFxyXG4gICAgICAgICAgc3RhdGU6IHguYWRkcmVzcy5zdGF0ZSB8fCBfbm9JbmZvcm1hdGlvbkZvdW5kLFxyXG4gICAgICAgICAgY291bnRyeTogeC5hZGRyZXNzLmNvdW50cnkgfHwgX25vSW5mb3JtYXRpb25Gb3VuZCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNob3J0TmFtZTogeC5zaG9ydE5hbWUgfHwgX25vSW5mb3JtYXRpb25Gb3VuZCxcclxuICAgICAgICBkZXNjcmlwdGlvbjogeC5kZXNjcmlwdGlvbixcclxuICAgICAgICBtZW1iZXJPZjogeC5tZW1iZXJPZixcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdXNlclxyXG4gICAgfSlcclxuICAgIHJldHVybiB1c2Vyc1xyXG4gIH1cclxuXHJcbiAgZ2V0QWxsVm1Hcm91cHMoZGF0YUluZm86IGFueSwgZ3JwVHlwZXM6IElHcm91cFR5cGVbXSwgdXNlcnM6IElVc2VyW10pIHtcclxuICAgIGNvbnN0IGdyb3VwcyA9IGRhdGFJbmZvLm1hcChncnAgPT4ge1xyXG4gICAgICBjb25zdCBtZW1iZXJzID0gZ3JwLm1lbWJlcnMubWFwKHggPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkVXNlcnMgPSB1c2Vycy5maWx0ZXIoZWxlbWVudCA9PlxyXG4gICAgICAgICAgICAgIGVsZW1lbnQubWVtYmVyT2Yuc29tZShzdWJFbGVtZW50ID0+XHJcbiAgICAgICAgICAgICAgc3ViRWxlbWVudC5ncm91cElkID09PSBncnAuaWQgJiYgc3ViRWxlbWVudC5tZW1iZXJzaGlwSWQgPT09IHgubWVtYmVyc2hpcElkKSlbMF1cclxuICAgICAgICByZXR1cm4gKHtcclxuICAgICAgICAgIC4uLngsXHJcbiAgICAgICAgICAuLi5maWx0ZXJlZFVzZXJzLFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICAgIGNvbnN0IGdyb3VwOiBJR3JvdXAgPSB7XHJcbiAgICAgICAgaWQ6IGdycC5pZCxcclxuICAgICAgICBuYW1lOiBncnAubmFtZSxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZShncnAuZGF0ZSkudG9Mb2NhbGVTdHJpbmcoKSxcclxuICAgICAgICBhZGRyZXNzOiBncnAuYWRkcmVzcyxcclxuICAgICAgICBob21lcGFnZTogZ3JwLmhvbWVwYWdlLFxyXG4gICAgICAgIGdyb3VwVHlwZTogZ3JwVHlwZXMuZmlsdGVyKCB4ID0+IHguaWQgPT09IGdycC5ncm91cFR5cGUpWzBdLFxyXG4gICAgICAgIG1lbWJlcnMsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IGdycC5kZXNjcmlwdGlvbixcclxuICAgICAgICBzaG9ydE5hbWU6IGdycC5zaG9ydE5hbWUsXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGdyb3VwXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGdyb3Vwc1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHZpZXdNb2RlbEdlbmVyYXRvciA9IG5ldyBWaWV3TW9kZWxHZW5lcmF0b3IoKVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvYXBwL3Jlc3QtY29tbXVuaWNhdGlvbi92aWV3bW9kZWwtZ2VuZXJhdG9yLnRzIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5pbXBvcnQgeyBSZXN0QXBpIH0gZnJvbSAnLi4vcmVzdC1jb21tdW5pY2F0aW9uL3Jlc3QtYXBpJ1xyXG5pbXBvcnQgeyBJR3JvdXAsIElHcm91cFR5cGUsIElTYXZlR3JvdXAgfSBmcm9tICcuLi9fdHlwZXMvSUdyb3VwcydcclxuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uL2luZnJhLW1vZHVsZXMvc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnXHJcbmltcG9ydCB7IEFkZEdyb3VwQ3RybCB9IGZyb20gJy4vYWRkLWdyb3VwJ1xyXG5cclxuY2xhc3MgT3ZlcnZpZXdDdHJsIHtcclxuXHJcbiAgICBwdWJsaWMgZ3JvdXBzOiBJR3JvdXBbXVxyXG4gICAgcHVibGljIHNlbGVjdGVkR3JvdXA6IElHcm91cFxyXG4gICAgcHVibGljIGFsbEdyb3VwVHlwZXM6IElHcm91cFR5cGVbXVxyXG5cclxuICAgIC8qIEBuZ0luamVjdCAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogYW5ndWxhci5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSAkbWRNZWRpYTogYW5ndWxhci5tYXRlcmlhbC5JTWVkaWEsXHJcbiAgICAgICAgcHJpdmF0ZSAkbWRTaWRlbmF2OiBhbmd1bGFyLm1hdGVyaWFsLklTaWRlbmF2U2VydmljZSxcclxuICAgICAgICBwcml2YXRlICRxOiBhbmd1bGFyLklRU2VydmljZSxcclxuICAgICAgICBwcml2YXRlICRsb2c6IGFuZ3VsYXIuSUxvZ1NlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSAkc3RhdGUsXHJcbiAgICAgICAgcHJpdmF0ZSBhcGk6IFJlc3RBcGksXHJcbiAgICAgICAgcHJpdmF0ZSBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlLFxyXG4gICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5hcGkuYWxsR3JvdXBzLnRoZW4oZ3JwcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBzID0gZ3Jwc1xyXG4gICAgICAgICAgICB0aGlzLnNob3dHcm91cERldGFpbHModGhpcy5ncm91cHNbMF0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5hcGkuYWxsR3JvdXBUeXBlcy50aGVuKGdycFR5cGVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hbGxHcm91cFR5cGVzID0gZ3JwVHlwZXNcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVNpZGVuYXYobWVudUlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLiRtZFNpZGVuYXYobWVudUlkKS50b2dnbGUoKVxyXG4gICAgfVxyXG5cclxuICAgIHNob3dHcm91cERldGFpbHMoZ3JvdXApIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkR3JvdXAgPSBncm91cFxyXG4gICAgfVxyXG5cclxuICAgIGFkZEdyb3VwKGV2KSB7XHJcbiAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLnNob3coe1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBBZGRHcm91cEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2FkZC1ncm91cC5odG1sJyksXHJcbiAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldixcclxuICAgICAgICAgICAgbG9jYWxzOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxHcm91cFR5cGVzOiB0aGlzLmFsbEdyb3VwVHlwZXMsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KS50aGVuKCBncnBJbmZvID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcGkuc2F2ZUdyb3VwKGdycEluZm8pLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBzLnB1c2gocmVzdWx0WzBdKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEdyb3VwID0gcmVzdWx0WzBdXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLm5vdGlmeShgR3JvdXAgd2l0aCBuYW1lICR7dGhpcy5zZWxlY3RlZEdyb3VwLm5hbWV9IGlzIGNyZWF0ZWQuYClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgT3ZlcnZpZXdQYWdlID0ge1xyXG4gICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vb3ZlcnZpZXctcGFnZS5odG1sJyksXHJcbiAgICBjb250cm9sbGVyOiBPdmVydmlld0N0cmwsXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2FwcC9vdmVydmlldy9vdmVydmlldy1wYWdlLnRzIiwiaW1wb3J0IHsgSUdyb3VwVHlwZSwgSVNhdmVHcm91cCB9IGZyb20gJy4uL190eXBlcy9JR3JvdXBzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEFkZEdyb3VwQ3RybCB7XHJcbiAgcHVibGljIGdyb3VwVHlwZXM6IElHcm91cFR5cGVbXVxyXG4gIHB1YmxpYyBncm91cDogSVNhdmVHcm91cFxyXG5cclxuICAvKiBAbmdJbmplY3QgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgJG1kRGlhbG9nOiBhbmd1bGFyLm1hdGVyaWFsLklEaWFsb2dTZXJ2aWNlLFxyXG4gICAgcHVibGljIGFsbEdyb3VwVHlwZXM6IElHcm91cFR5cGVbXSkge1xyXG5cclxuICAgICAgdGhpcy5ncm91cFR5cGVzID0gYWxsR3JvdXBUeXBlc1xyXG5cclxuICB9XHJcblxyXG4gIGNhbmNlbCgpIHtcclxuICAgIHRoaXMuJG1kRGlhbG9nLmNhbmNlbCgpXHJcbiAgfVxyXG5cclxuICBzYXZlKCkge1xyXG4gICAgdGhpcy5ncm91cC5tZW1iZXJzID0gW11cclxuICAgIHRoaXMuJG1kRGlhbG9nLmhpZGUodGhpcy5ncm91cClcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2FwcC9vdmVydmlldy9hZGQtZ3JvdXAudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPG1kLWRpYWxvZyBhcmlhLWxhYmVsPVxcXCJBZGQgR3JvdXBcXFwiICBmbGV4LXNtPVxcXCI4MFxcXCIgZmxleC1ndC1zbT1cXFwiNTBcXFwiPlxcclxcbiAgICA8Zm9ybSBuYW1lPVxcXCJmb3JtXFxcIiBub3ZhbGlkYXRlIGxheW91dD1cXFwiY29sdW1uXFxcIiBmbGV4PlxcclxcbiAgICAgIDxtZC10b29sYmFyPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtdG9vbGJhci10b29sc1xcXCI+XFxyXFxuICAgICAgICAgIDxoMj5BZGQgR3JvdXA8L2gyPlxcclxcbiAgICAgICAgICA8c3BhbiBmbGV4Pjwvc3Bhbj5cXHJcXG4gICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtaWNvbi1idXR0b25cXFwiIG5nLWNsaWNrPVxcXCJ2bS5jYW5jZWwoKVxcXCI+XFxyXFxuICAgICAgICAgICAgPG1kLWljb24gYXJpYS1sYWJlbD1cXFwiQ2xvc2UgZGlhbG9nXFxcIj5jbG9zZTwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8L21kLXRvb2xiYXI+XFxyXFxuICAgICAgPG1kLWRpYWxvZy1jb250ZW50ICBjbGFzcz1cXFwiY29uZGVuc2VkLWRpYWxvZ1xcXCIgZmxleCBsYXlvdXQ9XFxcImNvbHVtblxcXCIgbGF5b3V0LWFsaWduPVxcXCJzdGFydCBzdHJldGNoXFxcIj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgbGF5b3V0LWd0LXhzPVxcXCJyb3dcXFwiPlxcclxcbiAgICAgICAgICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVxcXCJtZC1ibG9ja1xcXCIgZmxleC1ndC14cz5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+R3JvdXAgVHlwZTwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cXFwidm0uZ3JvdXAuZ3JvdXBUeXBlXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxtZC1vcHRpb24gbmctcmVwZWF0PVxcXCJncnBUeXBlIGluIHZtLmdyb3VwVHlwZXNcXFwiIG5nLXZhbHVlPVxcXCJncnBUeXBlLmlkXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAge3tncnBUeXBlLm5hbWV9fVxcclxcbiAgICAgICAgICAgICAgPC9tZC1vcHRpb24+XFxyXFxuICAgICAgICAgICAgPC9tZC1zZWxlY3Q+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGxheW91dC1ndC14cz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtYmxvY2tcXFwiIGZsZXgtZ3QteHM+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkdyb3VwIE5hbWU8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIlxcclxcbiAgICAgICAgICAgICAgbmFtZT1cXFwibGFiZWxcXFwiIHJlcXVpcmVkXFxyXFxuICAgICAgICAgICAgICBuZy1tb2RlbD1cXFwidm0uZ3JvdXAubmFtZVxcXCIgPlxcclxcbiAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZXM9XFxcImZvcm0ubGFiZWwuJGVycm9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cXFwicmVxdWlyZWRcXFwiPkdyb3VwIG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVxcXCJtZC1ibG9ja1xcXCIgZmxleC1ndC14cz5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+U2hvcnQgTmFtZTwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcInNob3J0TmFtZVxcXCIgcmVxdWlyZWQgbmctbW9kZWw9XFxcInZtLmdyb3VwLnNob3J0TmFtZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBuZy1tZXNzYWdlcz1cXFwiZm9ybS5zaG9ydE5hbWUuJGVycm9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cXFwicmVxdWlyZWRcXFwiPlNob3J0IG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGxheW91dC1ndC14cz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtYmxvY2tcXFwiIGZsZXgtZ3QteHM+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkxvY2F0ZWQgaW4gKENvdW50cnkpPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cXFwiYWRkcmVzc1xcXCIgbmctbW9kZWw9XFxcInZtLmdyb3VwLmFkZHJlc3NcXFwiIHJlcXVpcmVkPlxcclxcbiAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZXM9XFxcImZvcm0uYWRkcmVzcy4kZXJyb3JcXFwiPlxcclxcbiAgICAgICAgICAgICAgPGRpdiBuZy1tZXNzYWdlPVxcXCJyZXF1aXJlZFxcXCI+QWRkcmVzcyBpcyByZXF1aXJlZCE8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxyXFxuICAgICAgICAgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XFxcIm1kLWJsb2NrXFxcIiBmbGV4LWd0LXhzPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5Ib21lcGFnZTwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XFxcImhvbWVwYWdlXFxcIiBuZy1tb2RlbD1cXFwidm0uZ3JvdXAuaG9tZXBhZ2VcXFwiIHJlcXVpcmVkPlxcclxcbiAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZXM9XFxcImZvcm0uaG9tZXBhZ2UuJGVycm9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cXFwicmVxdWlyZWRcXFwiPkhvbWVwYWdlIG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGxheW91dC1ndC14cz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtaW5wdXQtaGFzLXBsYWNlaG9sZGVyXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+U3RhcnQgRGF0ZS9UaW1lPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgbWRjLWRhdGV0aW1lLXBpY2tlcj1cXFwiXFxcIiBkYXRlPVxcXCJ0cnVlXFxcIiB0aW1lPVxcXCJ0cnVlXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiByZXF1aXJlZFxcclxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCJEYXRlXFxcIiBtYXgtZGF0ZT1cXFwiZGF0ZVRpbWVFbmRcXFwiIG5nLW1vZGVsPVxcXCJ2bS5ncm91cC5kYXRlXFxcIiBjbGFzcz1cXFwiIG1kLWlucHV0XFxcIlxcclxcbiAgICAgICAgICAgIGlkPVxcXCJpbnB1dF8wXFxcIj5cXHJcXG4gICAgICAgICAgPC9tZC1pbnB1dC1jb250YWluZXI+XFxyXFxuICAgICAgICAgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XFxcIm1kLWJsb2NrXFxcIiBmbGV4LWd0LXhzPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5EZXNjcmlwdGlvbjwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XFxcImRlc2NyaXB0aW9uXFxcIiBuZy1tb2RlbD1cXFwidm0uZ3JvdXAuZGVzY3JpcHRpb25cXFwiIHJlcXVpcmVkPlxcclxcbiAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZXM9XFxcImZvcm0uZGVzY3JpcHRpb24uJGVycm9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cXFwicmVxdWlyZWRcXFwiPkRlc2NyaXB0aW9uIG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgPC9tZC1kaWFsb2ctY29udGVudD5cXHJcXG5cXHJcXG4gICAgICA8bWQtZGlhbG9nLWFjdGlvbnMgbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC1hbGlnbj1cXFwiZW5kIGNlbnRlclxcXCI+XFxyXFxuICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwidm0uc2F2ZSgpXFxcIiBuZy1kaXNhYmxlZD1cXFwiZm9ybS4kaW52YWxpZFxcXCIgbWQtYXV0b2ZvY3VzPlNhdmU8L21kLWJ1dHRvbj5cXHJcXG4gICAgICA8L21kLWRpYWxvZy1hY3Rpb25zPlxcclxcbiAgICA8L2Zvcm0+XFxyXFxuICA8L21kLWRpYWxvZz5cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9vdmVydmlldy9hZGQtZ3JvdXAuaHRtbFxuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPG1haW4gZmxleCBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzcGFjZS1iZXR3ZWVuIHN0cmV0Y2hcXFwiPlxcclxcbiAgICA8bWQtc2lkZW5hdiBtZC1kaXNhYmxlLWJhY2tkcm9wIG1kLWNvbXBvbmVudC1pZD1cXFwiZXZlbnQtbmF2XFxcIiAgbGF5b3V0PVxcXCJjb2x1bW5cXFwiIG1kLWlzLWxvY2tlZC1vcGVuPVxcXCJ2bS4kbWRNZWRpYSgnZ3Qtc20nKVxcXCIgbWQtaXMtb3Blbj1cXFwidHJ1ZVxcXCJcXHJcXG4gICAgICBuZy1jbGFzcz1cXFwieydtZC13aGl0ZWZyYW1lLXoyJzogdm0uJG1kTWVkaWEoJ2d0LXNtJyl9XFxcIiBjbGFzcz1cXFwibWQtc2lkZW5hdi1sZWZ0IG1kLXNpZGVuYXYtbGlzdFxcXCI+XFxyXFxuICAgICAgPG1kLXRvb2xiYXIgY2xhc3M9XFxcIm1kLXdoaXRlZnJhbWUtejJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtdG9vbGJhci10b29sc1xcXCI+XFxyXFxuICAgICAgICAgIDx0b29sLWJhcj48L3Rvb2wtYmFyPlxcclxcbiAgICAgICAgICA8aDM+R3JvdXBzICN7e3ZtLmdyb3Vwcy5sZW5ndGh9fTwvaDM+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8L21kLXRvb2xiYXI+XFxyXFxuXFxyXFxuICAgICAgPGdlbmVyaWMtbGlzdCBpdGVtcz1cXFwidm0uZ3JvdXBzXFxcIlxcclxcbiAgICAgICAgc2VsZWN0ZWQtaXRlbT1cXFwidm0uc2VsZWN0ZWRHcm91cFxcXCJcXHJcXG4gICAgICAgIGl0ZW0tc2VsZWN0ZWQ9XFxcInZtLnNob3dHcm91cERldGFpbHMoaXRlbSlcXFwiIGxpc3QtdHlwZT1cXFwiJ2dyb3VwcydcXFwiPjwvZ2VuZXJpYy1saXN0PlxcclxcblxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtYWNjZW50IG1kLWZhYiBtZC1mYWItYm90dG9tLXJpZ2h0XFxcIiBuZy1jbGljaz1cXFwidm0uYWRkR3JvdXAoJGV2ZW50KVxcXCI+XFxyXFxuICAgICAgICAgIDxtZC1pY29uPmdyb3VwX2FkZDwvbWQtaWNvbj5cXHJcXG4gICAgICAgIDwvbWQtYnV0dG9uPlxcclxcbiAgICA8L21kLXNpZGVuYXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgIDxzZWN0aW9uIGZsZXggbGF5b3V0PVxcXCJjb2x1bW5cXFwiPlxcclxcbiAgICAgIDxtZC1jb250ZW50IGZsZXggbGF5b3V0PVxcXCJjb2x1bW5cXFwiIGNsYXNzPVxcXCJiYWNrZ3JvdW5kXFxcIj5cXHJcXG4gICAgICAgIDxtZC10b29sYmFyIGNsYXNzPVxcXCJ4LWxhcmdlIG1kLXByaW1hcnkgbWQtaHVlLTFcXFwiIG5nLXNob3c9XFxcInZtLnNlbGVjdGVkR3JvdXBcXFwiIGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcImNlbnRlciBzdGFydFxcXCI+XFxyXFxuICAgICAgICAgIDxkaXYgZmxleCBmbGV4LWd0LXNtPVxcXCI5NVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtdG9vbGJhci10b29sc1xcXCI+XFxyXFxuICAgICAgICAgICAgICA8aDEgY2xhc3M9XFxcIm1kLXRpdGxlXFxcIj57e3ZtLnNlbGVjdGVkR3JvdXAubmFtZX19IDxiciA+XFxyXFxuICAgICAgICAgICAgICA8ZW0gPnt7dm0uc2VsZWN0ZWRHcm91cC5ncm91cFR5cGUubmFtZX19PC9lbT4gPC9oMT5cXHJcXG4gICAgICAgICAgICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtaWNvbi1idXR0b25cXFwiIHVpLXNyZWY9XFxcImFwcG92ZXJ2aWV3XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbj5ob21lPC9tZC1pY29uPlxcclxcbiAgICAgICAgICAgICAgPC9tZC1idXR0b24+XFxyXFxuICAgICAgICAgICAgICA8Y3VzdG9tLW1lbnUgaXRlbT1cXFwidm0uc2VsZWN0ZWRHcm91cFxcXCIgY2F0ZWdvcnk9XFxcIidncm91cCdcXFwiXFxyXFxuICAgICAgICAgICAgICBvbi1kZWxldGU9XFxcInZtLmRlbGV0ZUdyb3VwKCRldmVudClcXFwiIG9uLWVkaXQ9XFxcInZtLmVkaXRHcm91cCgkZXZlbnQpXFxcIj48L2N1c3RvbS1tZW51PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgICAgIDxtZC1saXN0IGNsYXNzPVxcXCJtZC1zdWJoZWFkXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxtZC1saXN0LWl0ZW0+XFxyXFxuICAgICAgICAgICAgICAgIDxtZC1pY29uPmRhdGVfcmFuZ2U8L21kLWljb24+XFxyXFxuICAgICAgICAgICAgICAgIDxwPnt7IHZtLnNlbGVjdGVkR3JvdXAuZGF0ZSAgfX08L3A+XFxyXFxuICAgICAgICAgICAgICA8L21kLWxpc3QtaXRlbT5cXHJcXG4gICAgICAgICAgICAgIDxtZC1saXN0LWl0ZW0+XFxyXFxuICAgICAgICAgICAgICAgIDxtZC1pY29uPnBsYWNlPC9tZC1pY29uPlxcclxcbiAgICAgICAgICAgICAgICA8cD57eyB2bS5zZWxlY3RlZEdyb3VwLmFkZHJlc3MgfX08L3A+XFxyXFxuICAgICAgICAgICAgICA8L21kLWxpc3QtaXRlbT5cXHJcXG4gICAgICAgICAgICAgIDxtZC1saXN0LWl0ZW0+XFxyXFxuICAgICAgICAgICAgICAgIDxtZC1pY29uPmhvbWU8L21kLWljb24+XFxyXFxuICAgICAgICAgICAgICAgIDxwPjxhIG5nLWhyZWY9XFxcInd3dy5nb29nbGUuY29tXFxcIj57e3ZtLnNlbGVjdGVkR3JvdXAuaG9tZXBhZ2V9fTwvYT48L3A+XFxyXFxuICAgICAgICAgICAgICA8L21kLWxpc3QtaXRlbT5cXHJcXG4gICAgICAgICAgICA8L21kLWxpc3Q+XFxyXFxuXFxyXFxuICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9tZC10b29sYmFyPlxcclxcblxcclxcbiAgICAgICAgPGRpdiBmbGV4IGxheW91dC1ndC1zbT1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcImNlbnRlciBzdGFydFxcXCIgY2xhc3M9XFxcInRvb2xiYXItb3ZlcmxheS1jb250ZW50XFxcIj5cXHJcXG4gICAgICAgICAgPGRpdiBmbGV4LWd0LXNtPVxcXCI5NVxcXCIgbmctc2hvdz1cXFwidm0uc2VsZWN0ZWRHcm91cFxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPG1kLWNhcmQ+XFxyXFxuICAgICAgICAgICAgICA8bWQtY2FyZC10aXRsZSBsYXlvdXQ9XFxcInJvd1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxtZC1jYXJkLXRpdGxlLXRleHQgZmxleD5cXHJcXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibWQtaGVhZGxpbmVcXFwiPk1lbWJlcnM8L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgIDwvbWQtY2FyZC10aXRsZS10ZXh0PlxcclxcbiAgICAgICAgICAgICA8L21kLWNhcmQtdGl0bGU+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICA8bWQtY2FyZC1jb250ZW50PlxcclxcbiAgICAgICAgICAgICAgIDxnZW5lcmljLXRhYmxlIGl0ZW1zPVxcXCJ2bS5zZWxlY3RlZEdyb3VwLm1lbWJlcnNcXFwiIGFyZWE9XFxcIidncm91cHMnXFxcIj48L2dlbmVyaWMtdGFibGU+XFxyXFxuICAgICAgICAgICAgICA8L21kLWNhcmQtY29udGVudD5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8L21kLWNhcmQ+XFxyXFxuICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgPC9tZC1jb250ZW50PlxcclxcblxcclxcbiAgICA8L3NlY3Rpb24+XFxyXFxuICA8L21haW4+XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvb3ZlcnZpZXcvb3ZlcnZpZXctcGFnZS5odG1sXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xyXG5cclxuaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICdhbmd1bGFyJ1xyXG5pbXBvcnQgeyBSZXN0QXBpIH0gZnJvbSAnLi4vcmVzdC1jb21tdW5pY2F0aW9uL3Jlc3QtYXBpJ1xyXG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4uL190eXBlcy9JVXNlcidcclxuaW1wb3J0IHsgSUdyb3VwIH0gZnJvbSAnLi4vX3R5cGVzL0lHcm91cHMnXHJcbmltcG9ydCB7IEFkZFVzZXJDdHJsIH0gZnJvbSAnLi9hZGQtdXNlcidcclxuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uL2luZnJhLW1vZHVsZXMvc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnXHJcblxyXG5jbGFzcyBPdmVydmlld1VzZXJDdHJsIHtcclxuXHJcbiAgICBwdWJsaWMgdXNlcnM6IElVc2VyW11cclxuICAgIHB1YmxpYyBzZWxlY3RlZFVzZXI6IElVc2VyXHJcbiAgICBwdWJsaWMgdXNlckFzc29jaWF0aW9uczogSUdyb3VwW11cclxuICAgIHB1YmxpYyBhbGxHcm91cHM6IElHcm91cFtdXHJcblxyXG4gICAgLyogQG5nSW5qZWN0ICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBhbmd1bGFyLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICBwcml2YXRlICRtZE1lZGlhOiBhbmd1bGFyLm1hdGVyaWFsLklNZWRpYSxcclxuICAgICAgICBwcml2YXRlICRtZFNpZGVuYXY6IGFuZ3VsYXIubWF0ZXJpYWwuSVNpZGVuYXZTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlLFxyXG4gICAgICAgIHByaXZhdGUgJGxvZzogYW5ndWxhci5JTG9nU2VydmljZSxcclxuICAgICAgICBwcml2YXRlICRzdGF0ZSxcclxuICAgICAgICBwcml2YXRlIGFwaTogUmVzdEFwaSxcclxuICAgICAgICBwcml2YXRlIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2UsXHJcbiAgICAgICApIHtcclxuICAgICAgICB0aGlzLiRsb2cuaW5mbygnaW5pdGlhbGl6aW5nIHVzZXIgY29udHJvbCcpXHJcblxyXG4gICAgICAgIHRoaXMuYXBpLmFsbFVzZXJzLnRoZW4odXNycyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlcnMgPSB1c3JzXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1VzZXJEZXRhaWxzKHRoaXMudXNlcnNbMF0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5hcGkuYWxsR3JvdXBzLnRoZW4oZ3JwcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxsR3JvdXBzID0gZ3Jwc1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1VzZXJEZXRhaWxzKHVzZXI6IElVc2VyKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFVzZXIgPSB1c2VyXHJcbiAgICAgICAgdGhpcy5hcGkuYWxsR3JvdXBzLnRoZW4oZ3JwcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXNlckFzc29jaWF0aW9ucyA9IHVzZXIubWVtYmVyT2YubWFwKHggPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdycHMuZmlsdGVyKHkgPT4geS5pZCA9PT0geC5ncm91cElkKVswXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYWRkVXNlcihldikge1xyXG4gICAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5zaG93KHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogQWRkVXNlckN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL2FkZC11c2VyLmh0bWwnKSxcclxuICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgICAgICBsb2NhbHM6IHtcclxuICAgICAgICAgICAgICAgIGFsbEF2YWlsR3JvdXBzOiBhbmd1bGFyLmNvcHkodGhpcy5hbGxHcm91cHMpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pLnRoZW4oIHVzZXJJbmZvID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcGkuc2F2ZVVzZXIodXNlckluZm8pLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBlcnNpc3RlZFVzZXIgPSByZXN1bHRbMF1cclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcnMucHVzaChwZXJzaXN0ZWRVc2VyKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VXNlckRldGFpbHMocGVyc2lzdGVkVXNlcilcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ1NlcnZpY2Uubm90aWZ5KGBVc2VyIHdpdGggbmFtZSAke3RoaXMuc2VsZWN0ZWRVc2VyLm5hbWV9IGlzIGNyZWF0ZWQuYClcclxuXHJcbiAgICAgICAgICAgICAgICB1c2VySW5mby5tZW1iZXJPZi5tYXAobWVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZW1iZXJzaGlwRGV0YWlscyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgIC4uLnVzZXJJbmZvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbWVtYmVyc2hpcElkOiBtZW0ubWVtYmVyc2hpcElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgam9pbmluZ0RhdGU6IG5ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiB7dmFsdWU6IDEsIHVuaXQ6ICd5ZWFyJ30sXHJcbiAgICAgICAgICAgICAgICAgICAgICBkZXNpZ25hdGlvbjogJ01lbWJlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICBpc01lbWJlcnNoaXBDYW5jZWxsZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGVjaWZpY0dycCA9IHRoaXMuYWxsR3JvdXBzLmZpbHRlcih4ID0+IHguaWQgPT09IG1lbS5ncm91cElkKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWNpZmljR3JwLm1lbWJlcnMucHVzaChtZW1iZXJzaGlwRGV0YWlscylcclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgT3ZlcnZpZXdVc2VyUGFnZSA9IHtcclxuICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgIHRlbXBsYXRlOiByZXF1aXJlKCcuL292ZXJ2aWV3LXVzZXItcGFnZS5odG1sJyksXHJcbiAgICBjb250cm9sbGVyOiBPdmVydmlld1VzZXJDdHJsLFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hcHAvb3ZlcnZpZXctdXNlci9vdmVydmlldy11c2VyLXBhZ2UudHMiLCJpbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInXHJcbmltcG9ydCB7IElHcm91cCB9IGZyb20gJy4uL190eXBlcy9JR3JvdXBzJ1xyXG5pbXBvcnQgeyBJVXNlciB9IGZyb20gJy4uL190eXBlcy9JVXNlcidcclxuaW1wb3J0ICogYXMgdW5pcXVlSWQgZnJvbSAndXVpZCdcclxuXHJcbmV4cG9ydCBjbGFzcyBBZGRVc2VyQ3RybCB7XHJcbiAgcHVibGljIGFsbEdyb3VwczogYW55W11cclxuICBwdWJsaWMgc2VsZWN0ZWRHcm91cHM6IElHcm91cFtdXHJcbiAgcHVibGljIHVzZXI6IElVc2VyXHJcbiAgcHJpdmF0ZSBzaW11bGF0ZVF1ZXJ5OiBib29sZWFuXHJcblxyXG4gIC8qIEBuZ0luamVjdCAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSAkbWREaWFsb2c6IGFuZ3VsYXIubWF0ZXJpYWwuSURpYWxvZ1NlcnZpY2UsXHJcbiAgICBwcml2YXRlICR0aW1lb3V0OiBhbmd1bGFyLklUaW1lb3V0U2VydmljZSxcclxuICAgIHByaXZhdGUgJHE6IGFuZ3VsYXIuSVFTZXJ2aWNlLFxyXG4gICAgcHVibGljIGFsbEF2YWlsR3JvdXBzOiBJR3JvdXBbXSkge1xyXG4gICAgICB0aGlzLnNpbXVsYXRlUXVlcnkgPSBmYWxzZVxyXG4gICAgICB0aGlzLnNlbGVjdGVkR3JvdXBzID0gW11cclxuICAgICAgdGhpcy5hbGxHcm91cHMgPSBhbGxBdmFpbEdyb3Vwcy5tYXAoeCA9PiB7XHJcbiAgICAgICAgY29uc3QgZ3JwID0ge1xyXG4gICAgICAgICAgLi4ueCxcclxuICAgICAgICAgIHNlYXJjaFRleHQ6IHgubmFtZS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ3JwXHJcbiAgICAgIH0pXHJcbiAgfVxyXG5cclxuICBxdWVyeVNlYXJjaChjcml0ZXJpYSkge1xyXG4gICAgcmV0dXJuIGNyaXRlcmlhID8gdGhpcy5hbGxHcm91cHMuZmlsdGVyKHRoaXMuY3JlYXRlRmlsdGVyRm9yKGNyaXRlcmlhKSkgOiBbXVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBsb3dlcmNhc2VRdWVyeSA9IGFuZ3VsYXIubG93ZXJjYXNlKHF1ZXJ5KVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpbHRlckZuKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIChpdGVtLnNlYXJjaFRleHQuaW5kZXhPZihsb3dlcmNhc2VRdWVyeSkgPT09IDApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjYW5jZWwoKSB7XHJcbiAgICB0aGlzLiRtZERpYWxvZy5jYW5jZWwoKVxyXG4gIH1cclxuXHJcbiAgc2F2ZSgpIHtcclxuICAgIHRoaXMudXNlci5tZW1iZXJPZiA9IHRoaXMuc2VsZWN0ZWRHcm91cHMubWFwKHggPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGdyb3VwSWQ6IHguaWQsXHJcbiAgICAgICAgbWVtYmVyc2hpcElkOiB1bmlxdWVJZCgpLFxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgdGhpcy4kbWREaWFsb2cuaGlkZSh0aGlzLnVzZXIpXHJcbiAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hcHAvb3ZlcnZpZXctdXNlci9hZGQtdXNlci50cyIsInZhciB2MSA9IHJlcXVpcmUoJy4vdjEnKTtcbnZhciB2NCA9IHJlcXVpcmUoJy4vdjQnKTtcblxudmFyIHV1aWQgPSB2NDtcbnV1aWQudjEgPSB2MTtcbnV1aWQudjQgPSB2NDtcblxubW9kdWxlLmV4cG9ydHMgPSB1dWlkO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3V1aWQvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbi8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuLy8gcmFuZG9tICMncyB3ZSBuZWVkIHRvIGluaXQgbm9kZSBhbmQgY2xvY2tzZXFcbnZhciBfc2VlZEJ5dGVzID0gcm5nKCk7XG5cbi8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxudmFyIF9ub2RlSWQgPSBbXG4gIF9zZWVkQnl0ZXNbMF0gfCAweDAxLFxuICBfc2VlZEJ5dGVzWzFdLCBfc2VlZEJ5dGVzWzJdLCBfc2VlZEJ5dGVzWzNdLCBfc2VlZEJ5dGVzWzRdLCBfc2VlZEJ5dGVzWzVdXG5dO1xuXG4vLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxudmFyIF9jbG9ja3NlcSA9IChfc2VlZEJ5dGVzWzZdIDw8IDggfCBfc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcblxuLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG52YXIgX2xhc3RNU2VjcyA9IDAsIF9sYXN0TlNlY3MgPSAwO1xuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgdmFyIGIgPSBidWYgfHwgW107XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIGNsb2Nrc2VxID0gb3B0aW9ucy5jbG9ja3NlcSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTtcblxuICAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cbiAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gIC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcbiAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxO1xuXG4gIC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcbiAgdmFyIGR0ID0gKG1zZWNzIC0gX2xhc3RNU2VjcykgKyAobnNlY3MgLSBfbGFzdE5TZWNzKS8xMDAwMDtcblxuICAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG4gIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gIH1cblxuICAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG4gIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbnNlY3MgPSAwO1xuICB9XG5cbiAgLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3V1aWQudjEoKTogQ2FuXFwndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWMnKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTtcblxuICAvLyBQZXIgNC4xLjQgLSBDb252ZXJ0IGZyb20gdW5peCBlcG9jaCB0byBHcmVnb3JpYW4gZXBvY2hcbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7XG5cbiAgLy8gYHRpbWVfbG93YFxuICB2YXIgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmO1xuXG4gIC8vIGB0aW1lX21pZGBcbiAgdmFyIHRtaCA9IChtc2VjcyAvIDB4MTAwMDAwMDAwICogMTAwMDApICYgMHhmZmZmZmZmO1xuICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bWggJiAweGZmO1xuXG4gIC8vIGB0aW1lX2hpZ2hfYW5kX3ZlcnNpb25gXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7XG5cbiAgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDtcblxuICAvLyBgY2xvY2tfc2VxX2xvd2BcbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmO1xuXG4gIC8vIGBub2RlYFxuICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgPyBidWYgOiBieXRlc1RvVXVpZChiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2MTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi91dWlkL3YxLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxudmFyIHJuZztcblxudmFyIGNyeXB0byA9IGdsb2JhbC5jcnlwdG8gfHwgZ2xvYmFsLm1zQ3J5cHRvOyAvLyBmb3IgSUUgMTFcbmlmIChjcnlwdG8gJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAvLyBXSEFUV0cgY3J5cHRvIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgdmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4gIHJuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbiAgICByZXR1cm4gcm5kczg7XG4gIH07XG59XG5cbmlmICghcm5nKSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyIHJuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICBybmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5kcztcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdXVpZC9saWIvcm5nLWJyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xudmFyIGJ5dGVUb0hleCA9IFtdO1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xufVxuXG5mdW5jdGlvbiBieXRlc1RvVXVpZChidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IG9mZnNldCB8fCAwO1xuICB2YXIgYnRoID0gYnl0ZVRvSGV4O1xuICByZXR1cm4gYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ5dGVzVG9VdWlkO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3V1aWQvbGliL2J5dGVzVG9VdWlkLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBBcnJheSgxNikgOiBudWxsO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyArK2lpKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgYnl0ZXNUb1V1aWQocm5kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdXVpZC92NC5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxtZC1kaWFsb2cgYXJpYS1sYWJlbD1cXFwiQWRkIFVzZXJcXFwiICBmbGV4LXNtPVxcXCI4MFxcXCIgZmxleC1ndC1zbT1cXFwiNTBcXFwiPlxcclxcbiAgICA8Zm9ybSBuYW1lPVxcXCJmb3JtXFxcIiBub3ZhbGlkYXRlIGxheW91dD1cXFwiY29sdW1uXFxcIiBmbGV4PlxcclxcbiAgICAgIDxtZC10b29sYmFyPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtdG9vbGJhci10b29sc1xcXCI+XFxyXFxuICAgICAgICAgIDxoMj5BZGQgVXNlcjwvaDI+XFxyXFxuICAgICAgICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcclxcbiAgICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1pY29uLWJ1dHRvblxcXCIgbmctY2xpY2s9XFxcInZtLmNhbmNlbCgpXFxcIj5cXHJcXG4gICAgICAgICAgICA8bWQtaWNvbiBhcmlhLWxhYmVsPVxcXCJDbG9zZSBkaWFsb2dcXFwiPmNsb3NlPC9tZC1pY29uPlxcclxcbiAgICAgICAgICA8L21kLWJ1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgIDwvbWQtdG9vbGJhcj5cXHJcXG4gICAgICA8bWQtZGlhbG9nLWNvbnRlbnQgIGNsYXNzPVxcXCJjb25kZW5zZWQtZGlhbG9nXFxcIiBmbGV4IGxheW91dD1cXFwiY29sdW1uXFxcIiBsYXlvdXQtYWxpZ249XFxcInN0YXJ0IHN0cmV0Y2hcXFwiPlxcclxcblxcclxcbiAgICAgICAgPGRpdiBsYXlvdXQtZ3QteHM9XFxcInJvd1xcXCI+XFxyXFxuICAgICAgICAgIDxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XFxcIm1kLWJsb2NrXFxcIiBmbGV4LWd0LXhzPlxcclxcbiAgICAgICAgICAgIDxsYWJlbD5Vc2VyIE5hbWU8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIlxcclxcbiAgICAgICAgICAgICAgbmFtZT1cXFwibGFiZWxcXFwiIHJlcXVpcmVkXFxyXFxuICAgICAgICAgICAgICBuZy1tb2RlbD1cXFwidm0udXNlci5uYW1lXFxcIiA+XFxyXFxuICAgICAgICAgICAgPGRpdiBuZy1tZXNzYWdlcz1cXFwiZm9ybS5sYWJlbC4kZXJyb3JcXFwiPlxcclxcbiAgICAgICAgICAgICAgPGRpdiBuZy1tZXNzYWdlPVxcXCJyZXF1aXJlZFxcXCI+VXNlciBuYW1lIGlzIHJlcXVpcmVkITwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICA8L21kLWlucHV0LWNvbnRhaW5lcj5cXHJcXG4gICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtYmxvY2tcXFwiIGZsZXgtZ3QteHM+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPlNob3J0IE5hbWU8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJzaG9ydE5hbWVcXFwiIHJlcXVpcmVkIG5nLW1vZGVsPVxcXCJ2bS51c2VyLnNob3J0TmFtZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBuZy1tZXNzYWdlcz1cXFwiZm9ybS5zaG9ydE5hbWUuJGVycm9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cXFwicmVxdWlyZWRcXFwiPlNob3J0IG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGxheW91dC1ndC14cz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtYmxvY2tcXFwiIGZsZXgtZ3QteHM+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkxvY2F0ZWQgaW4gKHN0cmVldCk8L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVxcXCJzdHJlZXRcXFwiIG5nLW1vZGVsPVxcXCJ2bS51c2VyLmFkZHJlc3Muc3RyZWV0XFxcIiByZXF1aXJlZD5cXHJcXG4gICAgICAgICAgICA8ZGl2IG5nLW1lc3NhZ2VzPVxcXCJmb3JtLnN0cmVldC4kZXJyb3JcXFwiPlxcclxcbiAgICAgICAgICAgICAgPGRpdiBuZy1tZXNzYWdlPVxcXCJyZXF1aXJlZFxcXCI+U3RyZWV0IG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVxcXCJtZC1ibG9ja1xcXCIgZmxleC1ndC14cz5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+TG9jYXRlZCBpbiAoc3RhdGUpPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cXFwic3RhdGVcXFwiIG5nLW1vZGVsPVxcXCJ2bS51c2VyLmFkZHJlc3Muc3RhdGVcXFwiIHJlcXVpcmVkPlxcclxcbiAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZXM9XFxcImZvcm0uc3RhdGUuJGVycm9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cXFwicmVxdWlyZWRcXFwiPlN0YXRlIG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGxheW91dC1ndC14cz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtYmxvY2tcXFwiIGZsZXgtZ3QteHM+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPkVtYWlsPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cXFwiZW1haWxcXFwiIG5nLW1vZGVsPVxcXCJ2bS51c2VyLmVtYWlsXFxcIiByZXF1aXJlZCBuZy1wYXR0ZXJuPVxcXCIvXi4rQC4rXFxcXC4uKyQvXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IG5nLW1lc3NhZ2VzPVxcXCJmb3JtLmVtYWlsLiRlcnJvclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZS1leHA9XFxcIlsncmVxdWlyZWQnLCAncGF0dGVybiddXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIEVtYWlsIGlzIHJlcXVpcmVkIGFuZCB3aXRoIHZhbGlkIGZvcm1hdC5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgICA8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVxcXCJtZC1ibG9ja1xcXCIgZmxleC1ndC14cz5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+RGVzY3JpcHRpb248L2xhYmVsPlxcclxcbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVxcXCJkZXNjcmlwdGlvblxcXCIgbmctbW9kZWw9XFxcInZtLnVzZXIuZGVzY3JpcHRpb25cXFwiIHJlcXVpcmVkPlxcclxcbiAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZXM9XFxcImZvcm0uZGVzY3JpcHRpb24uJGVycm9yXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxkaXYgbmctbWVzc2FnZT1cXFwicmVxdWlyZWRcXFwiPkRlc2NyaXB0aW9uIG5hbWUgaXMgcmVxdWlyZWQhPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGxheW91dC1ndC14cz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgICAgPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cXFwibWQtYmxvY2tcXFwiIGZsZXgtZ3QteHM+XFxyXFxuICAgICAgICAgICAgPG1kLWNvbnRhY3QtY2hpcHMgcmVxdWlyZWRcXHJcXG4gICAgICAgICAgICAgIG5nLW1vZGVsPVxcXCJ2bS5zZWxlY3RlZEdyb3Vwc1xcXCJcXHJcXG4gICAgICAgICAgICAgIG1kLWNvbnRhY3RzPVxcXCJ2bS5xdWVyeVNlYXJjaCgkcXVlcnkpXFxcIlxcclxcbiAgICAgICAgICAgICAgbWQtY29udGFjdC1uYW1lPVxcXCJuYW1lXFxcIlxcclxcbiAgICAgICAgICAgICAgbWQtY29udGFjdC1pbWFnZT1cXFwiaW1hZ2VcXFwiXFxyXFxuICAgICAgICAgICAgICBtZC1yZXF1aXJlLW1hdGNoPVxcXCJ0cnVlXFxcIlxcclxcbiAgICAgICAgICAgICAgbWQtaGlnaGxpZ2h0LWZsYWdzPVxcXCJpXFxcIlxcclxcbiAgICAgICAgICAgICAgZmlsdGVyLXNlbGVjdGVkPVxcXCJ0cnVlXFxcIlxcclxcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIkFkZCBtb3JlIGdyb3Vwcy4uLi5cXFwiPlxcclxcbiAgICAgICAgICAgIDwvbWQtY29udGFjdC1jaGlwcz5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJoaW50XFxcIj5TZWxlY3QgYXRsZWFzdCBvbmUgZ3JvdXA8L2Rpdj5cXHJcXG4gICAgICAgIDwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgPC9tZC1kaWFsb2ctY29udGVudD5cXHJcXG5cXHJcXG4gICAgICA8bWQtZGlhbG9nLWFjdGlvbnMgbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC1hbGlnbj1cXFwiZW5kIGNlbnRlclxcXCI+XFxyXFxuICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwidm0uc2F2ZSgpXFxcIiBuZy1kaXNhYmxlZD1cXFwiZm9ybS4kaW52YWxpZFxcXCIgbWQtYXV0b2ZvY3VzPlNhdmU8L21kLWJ1dHRvbj5cXHJcXG4gICAgICA8L21kLWRpYWxvZy1hY3Rpb25zPlxcclxcbiAgICA8L2Zvcm0+XFxyXFxuICA8L21kLWRpYWxvZz5cXHJcXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC9vdmVydmlldy11c2VyL2FkZC11c2VyLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8bWFpbiBmbGV4IGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcInNwYWNlLWJldHdlZW4gc3RyZXRjaFxcXCI+XFxyXFxuICAgIDxtZC1zaWRlbmF2IG1kLWRpc2FibGUtYmFja2Ryb3AgbWQtY29tcG9uZW50LWlkPVxcXCJldmVudC1uYXZcXFwiICBsYXlvdXQ9XFxcImNvbHVtblxcXCIgbWQtaXMtbG9ja2VkLW9wZW49XFxcInZtLiRtZE1lZGlhKCdndC1zbScpXFxcIiBtZC1pcy1vcGVuPVxcXCJ0cnVlXFxcIlxcclxcbiAgICAgIG5nLWNsYXNzPVxcXCJ7J21kLXdoaXRlZnJhbWUtejInOiB2bS4kbWRNZWRpYSgnZ3Qtc20nKX1cXFwiIGNsYXNzPVxcXCJtZC1zaWRlbmF2LWxlZnQgbWQtc2lkZW5hdi1saXN0XFxcIj5cXHJcXG4gICAgICA8bWQtdG9vbGJhciBjbGFzcz1cXFwibWQtd2hpdGVmcmFtZS16MlxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZC10b29sYmFyLXRvb2xzXFxcIj5cXHJcXG4gICAgICAgICAgPHRvb2wtYmFyPjwvdG9vbC1iYXI+XFxyXFxuICAgICAgICAgIDxoMz5Vc2VycyAje3t2bS51c2Vycy5sZW5ndGh9fTwvaDM+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8L21kLXRvb2xiYXI+XFxyXFxuXFxyXFxuICAgICAgPGdlbmVyaWMtbGlzdCBpdGVtcz1cXFwidm0udXNlcnNcXFwiXFxyXFxuICAgICAgICBzZWxlY3RlZC1pdGVtPVxcXCJ2bS5zZWxlY3RlZFVzZXJcXFwiXFxyXFxuICAgICAgICBpdGVtLXNlbGVjdGVkPVxcXCJ2bS5zaG93VXNlckRldGFpbHMoaXRlbSlcXFwiIGxpc3QtdHlwZT1cXFwiJ3VzZXJzJ1xcXCI+PC9nZW5lcmljLWxpc3Q+XFxyXFxuXFxyXFxuICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtYWNjZW50IG1kLWZhYiBtZC1mYWItYm90dG9tLXJpZ2h0XFxcIiBuZy1jbGljaz1cXFwidm0uYWRkVXNlcigkZXZlbnQpXFxcIj5cXHJcXG4gICAgICAgIDxtZC1pY29uPnBlcnNvbl9hZGQ8L21kLWljb24+XFxyXFxuICAgICAgPC9tZC1idXR0b24+XFxyXFxuICAgIDwvbWQtc2lkZW5hdj5cXHJcXG5cXHJcXG4gICAgPHNlY3Rpb24gZmxleCBsYXlvdXQ9XFxcImNvbHVtblxcXCI+XFxyXFxuICAgICAgPG1kLWNvbnRlbnQgZmxleCBsYXlvdXQ9XFxcImNvbHVtblxcXCIgY2xhc3M9XFxcImJhY2tncm91bmRcXFwiPlxcclxcbiAgICAgICAgPG1kLXRvb2xiYXIgY2xhc3M9XFxcIngtbGFyZ2UgbWQtcHJpbWFyeSBtZC1odWUtMVxcXCIgbmctc2hvdz1cXFwidm0uc2VsZWN0ZWRVc2VyXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJjZW50ZXIgc3RhcnRcXFwiPlxcclxcbiAgICAgICAgICA8ZGl2IGZsZXggZmxleC1ndC1zbT1cXFwiOTVcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1kLXRvb2xiYXItdG9vbHNcXFwiPlxcclxcbiAgICAgICAgICAgICAgPGgxIGNsYXNzPVxcXCJtZC10aXRsZVxcXCI+e3t2bS5zZWxlY3RlZFVzZXIubmFtZX19ICA8YnIgPlxcclxcbiAgICAgICAgICAgICAgPGVtID57e3ZtLnNlbGVjdGVkVXNlci5kZXNjcmlwdGlvbn19PC9lbT4gPC9oMT5cXHJcXG4gICAgICAgICAgICAgIDxzcGFuIGZsZXg+PC9zcGFuPlxcclxcblxcclxcbiAgICAgICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtaWNvbi1idXR0b25cXFwiIHVpLXNyZWY9XFxcImFwcG92ZXJ2aWV3XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPG1kLWljb24+aG9tZTwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgICAgIDwvbWQtYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgPGN1c3RvbS1tZW51IGl0ZW09XFxcInZtLnNlbGVjdGVkVXNlclxcXCIgY2F0ZWdvcnk9XFxcIid1c2VyJ1xcXCJcXHJcXG4gICAgICAgICAgICAgICAgb24tZGVsZXRlPVxcXCJ2bS5kZWxldGVVc2VyKCRldmVudClcXFwiIG9uLWVkaXQ9XFxcInZtLmVkaXRVc2VyKCRldmVudClcXFwiPjwvY3VzdG9tLW1lbnU+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICAgICAgPG1kLWxpc3QgY2xhc3M9XFxcIm1kLXN1YmhlYWRcXFwiPlxcclxcbiAgICAgICAgICAgICAgPG1kLWxpc3QtaXRlbT5cXHJcXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbj5wbGFjZTwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgICAgICAgICA8cD57e3ZtLnNlbGVjdGVkVXNlci5hZGRyZXNzLnN0cmVldH19LCB7e3ZtLnNlbGVjdGVkVXNlci5hZGRyZXNzLnN0YXRlfX08L3A+XFxyXFxuICAgICAgICAgICAgICA8L21kLWxpc3QtaXRlbT5cXHJcXG4gICAgICAgICAgICAgIDxtZC1saXN0LWl0ZW0+XFxyXFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24+bWFpbDwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgICAgICAgICA8cD57e3ZtLnNlbGVjdGVkVXNlci5lbWFpbH19PC9wPlxcclxcbiAgICAgICAgICAgICAgIDwvbWQtbGlzdC1pdGVtPlxcclxcbiAgICAgICAgICAgIDwvbWQtbGlzdD5cXHJcXG5cXHJcXG4gICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L21kLXRvb2xiYXI+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGZsZXggbGF5b3V0LWd0LXNtPVxcXCJyb3dcXFwiIGxheW91dC1hbGlnbj1cXFwiY2VudGVyIHN0YXJ0XFxcIiBjbGFzcz1cXFwidG9vbGJhci1vdmVybGF5LWNvbnRlbnRcXFwiPlxcclxcbiAgICAgICAgICA8ZGl2IGZsZXgtZ3Qtc209XFxcIjk1XFxcIiBuZy1zaG93PVxcXCJ2bS5zZWxlY3RlZFVzZXJcXFwiPlxcclxcblxcclxcbiAgICAgICAgICAgIDxtZC1jYXJkPlxcclxcbiAgICAgICAgICAgICAgPG1kLWNhcmQtdGl0bGUgbGF5b3V0PVxcXCJyb3dcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bWQtY2FyZC10aXRsZS10ZXh0IGZsZXg+XFxyXFxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1kLWhlYWRsaW5lXFxcIj5Hcm91cHM8L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgIDwvbWQtY2FyZC10aXRsZS10ZXh0PlxcclxcbiAgICAgICAgICAgICA8L21kLWNhcmQtdGl0bGU+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICA8bWQtY2FyZC1jb250ZW50PlxcclxcbiAgICAgICAgICAgICAgIDxnZW5lcmljLXRhYmxlIGl0ZW1zPVxcXCJ2bS51c2VyQXNzb2NpYXRpb25zXFxcIiAgYXJlYT1cXFwiJ3VzZXInXFxcIj48L2dlbmVyaWMtdGFibGU+XFxyXFxuICAgICAgICAgICAgICA8L21kLWNhcmQtY29udGVudD5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8L21kLWNhcmQ+XFxyXFxuICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgPC9tZC1jb250ZW50PlxcclxcblxcclxcbiAgICA8L3NlY3Rpb24+XFxyXFxuICA8L21haW4+XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvb3ZlcnZpZXctdXNlci9vdmVydmlldy11c2VyLXBhZ2UuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jbGFzcyBHZW5lcmljTGlzdEN0cmwge1xyXG5cclxuIC8qIEBuZ0luamVjdCAqL1xyXG4gY29uc3RydWN0b3IocHJpdmF0ZSAkbG9nOiBhbmd1bGFyLklMb2dTZXJ2aWNlKSB7XHJcbiAgICRsb2cuaW5mbygnc3RhcnRpbmcgdXAgdGhlIGdlbmVyaWMgbGlzdCBjb250cm9sbGVyJylcclxuIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEdlbmVyaWNMaXN0OiBuZy5JQ29tcG9uZW50T3B0aW9ucyA9IHtcclxuICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vZ2VuZXJpYy1saXN0Lmh0bWwnKSxcclxuICBjb250cm9sbGVyOiBHZW5lcmljTGlzdEN0cmwsXHJcbiAgYmluZGluZ3M6IHtcclxuICAgIGl0ZW1zOiAnPScsXHJcbiAgICBzZWxlY3RlZEl0ZW06ICc9JyxcclxuICAgIGxpc3RUeXBlOiAnPScsXHJcbiAgICBpdGVtU2VsZWN0ZWQ6ICcmJyxcclxuICB9LFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hcHAvaW5mcmEtbW9kdWxlcy9nZW5lcmljLWxpc3QvZ2VuZXJpYy1saXN0LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XFxcInNlYXJjaC1jb250cm9sIG1kLWJsb2NrXFxcIiBmbGV4LWd0LXNtIG5nLWlmPVxcXCJ2bS5pdGVtcy5sZW5ndGggPiAwXFxcIj5cXHJcXG4gIDxtZC1pY29uPnNlYXJjaDwvbWQtaWNvbj5cXHJcXG4gIDxpbnB1dCBuZy1tb2RlbD1cXFwidm0uc2VhcmNoXFxcIiBwbGFjZWhvbGRlcj1cXFwiU2VhcmNoXFxcIiAvPlxcclxcbiAgPGg2IGNsYXNzPVxcXCJoaW50XFxcIiBuZy1pZj1cXFwidm0uc2VhcmNoLmxlbmd0aCA+PSAxXFxcIiBuZy1zaG93PVxcXCIodm0uaXRlbXMgfCBmaWx0ZXI6dm0uc2VhcmNoKS5sZW5ndGggPiAwICBcXFwiPlxcclxcbiAgICBGb3VuZCB7eyh2bS5pdGVtcyB8IGZpbHRlcjp2bS5zZWFyY2gpLmxlbmd0aH19IGl0ZW0ocykgZnJvbSB7e3ZtLml0ZW1zLmxlbmd0aH19PC9oNj5cXHJcXG48L21kLWlucHV0LWNvbnRhaW5lcj5cXHJcXG5cXHJcXG48bWQtbGlzdCBjbGFzcz1cXFwiSXRlbUxpc3RcXFwiPlxcclxcbiAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cXFwibWQtMy1saW5lXFxcIlxcclxcbiAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gdm0uaXRlbXMgfCBvcmRlckJ5OiAnbmFtZSc6IGZhbHNlIHwgZmlsdGVyOnZtLnNlYXJjaCB0cmFjayBieSBpdGVtLmlkXFxcIlxcclxcbiAgICAgICAgICAgICAgICBzY3JvbGwtaWY9XFxcIml0ZW0uaWQgPT09IHZtLnNlbGVjdGVkSXRlbS5pZFxcXCJcXHJcXG4gICAgICAgICAgICAgICAgbmctY2xhc3M9XFxcInsnc2VsZWN0ZWQnOiBpdGVtLmlkID09PSB2bS5zZWxlY3RlZEl0ZW0uaWR9XFxcIlxcclxcbiAgICAgICAgICAgICAgICBuZy1jbGljaz1cXFwidm0uaXRlbVNlbGVjdGVkKHtpdGVtOiBpdGVtfSlcXFwiXFxyXFxuICAgICAgICAgICAgICAgIGlkPVxcXCJ7e2l0ZW0uaWR9fVxcXCI+XFxyXFxuICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtZC1hdmF0YXJcXFwiPnt7IHZtLmxpc3RUeXBlID09J2dyb3VwcycgPyBpdGVtLmdyb3VwVHlwZS5pY29uIDogJ3BlcnNvbicgfX08L21kLWljb24+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcIm1kLWxpc3QtaXRlbS10ZXh0XFxcIiBsYXlvdXQ9XFxcImNvbHVtblxcXCI+XFxyXFxuICAgICAgPGgzPnt7IGl0ZW0ubmFtZSB9fTwvaDM+XFxyXFxuICAgICAgPGg0PjxtZC1pY29uPnt7dm0ubGlzdFR5cGUgPT0nZ3JvdXBzJyA/ICdncm91cF93b3JrJyA6ICdzaG9ydF90ZXh0JyB9fTwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAge3t2bS5saXN0VHlwZSA9PSdncm91cHMnID8gaXRlbS5ncm91cFR5cGUubmFtZTogaXRlbS5zaG9ydE5hbWUgfX08L2g0PlxcclxcbiAgICAgIDxwPjxtZC1pY29uPnt7dm0ubGlzdFR5cGUgPT0gJ2dyb3VwcycgPyAncGVvcGxlJyA6ICdncm91cF93b3JrJyB9fTwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAge3t2bS5saXN0VHlwZSA9PSdncm91cHMnID8gaXRlbS5tZW1iZXJzLmxlbmd0aCA6IGl0ZW0ubWVtYmVyT2YubGVuZ3RoIH19PC9wPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcclxcbiAgPC9tZC1saXN0LWl0ZW0+XFxyXFxuXFxyXFxuICA8bWQtbGlzdC1pdGVtIG5nLXNob3c9XFxcIih2bS5pdGVtcyB8IGZpbHRlcjp2bS5zZWFyY2gpLmxlbmd0aCA9PSAwXFxcIj5cXHJcXG4gICAgPHA+PG1kLWljb24gY2xhc3M9XFxcInNlYXJjaC1tZXNzYWdlXFxcIj5lcnJvcl9vdXRsaW5lPC9tZC1pY29uPiBObyBpdGVtcyBmb3VuZC4gPC9wPlxcclxcbiAgPC9tZC1saXN0LWl0ZW0+XFxyXFxuXFxyXFxuPC9tZC1saXN0PlxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2luZnJhLW1vZHVsZXMvZ2VuZXJpYy1saXN0L2dlbmVyaWMtbGlzdC5odG1sXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCdcclxuXHJcbmNsYXNzIEdlbmVyaWNUYWJsZUN0cmwge1xyXG5cclxuIC8qIEBuZ0luamVjdCAqL1xyXG4gY29uc3RydWN0b3IocHJpdmF0ZSAkbG9nOiBhbmd1bGFyLklMb2dTZXJ2aWNlKSB7XHJcbiAgICRsb2cuaW5mbygnc3RhcnRpbmcgdXAgdGhlIGdlbmVyaWMgdGFibGUgY29udHJvbGxlcicpXHJcbiB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBHZW5lcmljVGFibGU6IG5nLklDb21wb25lbnRPcHRpb25zID0ge1xyXG4gIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi9nZW5lcmljLXRhYmxlLmh0bWwnKSxcclxuICBjb250cm9sbGVyOiBHZW5lcmljVGFibGVDdHJsLFxyXG4gIGJpbmRpbmdzOiB7XHJcbiAgICBpdGVtczogJz0nLFxyXG4gICAgYXJlYTogJzwnLFxyXG4gIH0sXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2FwcC9pbmZyYS1tb2R1bGVzL2dlbmVyaWMtdGFibGUvZ2VuZXJpYy10YWJsZS50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8bWQtdGFibGUtY29udGFpbmVyIG5nLWlmPVxcXCJ2bS5hcmVhID09PSdncm91cHMnXFxcIj5cXHJcXG4gIDx0YWJsZSBtZC10YWJsZSBjbGFzcz1cXFwibWQtcHJpbWFyeVxcXCIgIG1kLXJvdy1zZWxlY3Q9XFxcInZtLnJvd1NlbGVjdGlvblxcXCIgbXVsdGlwbGUgbmctbW9kZWw9XFxcInZtLnNlbGVjdGVkXFxcIj5cXHJcXG4gICAgPHRoZWFkIG1kLWhlYWQgbWQtb3JkZXI9XFxcInZtLm9yZGVyXFxcIj5cXHJcXG4gICAgICA8dHIgbWQtcm93PlxcclxcbiAgICAgICAgPHRoIG1kLWNvbHVtbj48L3RoPlxcclxcbiAgICAgICAgPHRoIG1kLWNvbHVtbiBtZC1vcmRlci1ieT1cXFwibWVtYmVyc2hpcElkXFxcIj5NZW1iZXJzaGlwIElkPC90aD5cXHJcXG4gICAgICAgIDx0aCBtZC1jb2x1bW4gPk1lbWJlciBOYW1lPC90aD5cXHJcXG4gICAgICAgIDx0aCBtZC1jb2x1bW4gPkRlc2lnbmF0aW9uIDwvdGg+XFxyXFxuICAgICAgICA8dGggbWQtY29sdW1uID5Kb2luaW5nIERhdGU8L3RoPlxcclxcbiAgICAgICAgPHRoIG1kLWNvbHVtbj5EdXJhdGlvbjwvdGg+XFxyXFxuICAgICAgICA8dGggbWQtY29sdW1uPkNvbnRhY3QgSW5mbzwvdGg+XFxyXFxuICAgICAgICA8dGggbWQtY29sdW1uPk1lbWJlcnNoaXA8L3RoPlxcclxcbiAgICAgIDwvdHI+XFxyXFxuICAgIDwvdGhlYWQ+XFxyXFxuICAgIDx0Ym9keSBtZC1ib2R5PlxcclxcbiAgICAgIDx0ciBtZC1yb3cgbWQtc2VsZWN0PVxcXCJpdGVtXFxcIiBtZC1zZWxlY3QtaWQ9XFxcIl9pZFxcXCIgbWQtYXV0by1zZWxlY3QgbmctcmVwZWF0PVxcXCJpdGVtIGluIHZtLml0ZW1zIHwgb3JkZXJCeTogdm0ub3JkZXIgdHJhY2sgYnkgJGluZGV4XFxcIj5cXHJcXG4gICAgICAgIDx0ZCBtZC1jZWxsPjxtZC1pY29uIGNsYXNzPVxcXCJtZC1hdmF0YXJcXFwiPnBlcnNvbjwvbWQtaWNvbj48L3RkPlxcclxcbiAgICAgICAgPHRkIG1kLWNlbGw+e3tpdGVtLm1lbWJlcnNoaXBJZH19PC90ZD5cXHJcXG4gICAgICAgIDx0ZCBtZC1jZWxsPnt7aXRlbS5uYW1lfX08L3RkPlxcclxcbiAgICAgICAgPHRkIG1kLWNlbGw+e3tpdGVtLmRlc2lnbmF0aW9ufX08L3RkPlxcclxcbiAgICAgICAgPHRkIG1kLWNlbGw+e3tpdGVtLmpvaW5pbmdEYXRlfX08L3RkPlxcclxcbiAgICAgICAgPHRkIG1kLWNlbGw+e3tpdGVtLmR1cmF0aW9uLnZhbHVlfX0ge3tpdGVtLmR1cmF0aW9uLnVuaXR9fTwvdGQ+XFxyXFxuICAgICAgICA8dGQgbWQtY2VsbD57e2l0ZW0uZW1haWx9fTwvdGQ+XFxyXFxuICAgICAgICA8dGQgbWQtY2VsbD5cXHJcXG4gICAgICAgICAgPG1kLWljb24+e3tpdGVtLmlzTWVtYmVyc2hpcENhbmNlbGxlZCA/ICdtb29kX2JhZCcgOiAnbW9vZCd9fTwvbWQtaWNvbj5cXHJcXG4gICAgICAgIDwvdGQ+XFxyXFxuICAgICAgPC90cj5cXHJcXG4gICAgPC90Ym9keT5cXHJcXG4gICAgPHRmb290IG1kLWZvb3Q+XFxyXFxuICAgICAgPHRyIG1kLXJvdz5cXHJcXG4gICAgICAgIDx0ZCBtZC1jZWxsIGNvbHNwYW49XFxcIjJcXFwiPjxsYWJlbD5Bc3NvY2lhdG9uczogPC9sYWJlbD57eyB2bS5pdGVtcy5sZW5ndGggfX0gb2Yge3t2bS5pdGVtcy5sZW5ndGh9fTwvdGQ+XFxyXFxuICAgICAgICA8dGQgbWQtY2VsbCBjb2xzcGFuPVxcXCI2XFxcIj48L3RkPlxcclxcbiAgICAgIDwvdHI+XFxyXFxuICAgIDwvdGZvb3Q+XFxyXFxuICA8L3RhYmxlPlxcclxcbjwvbWQtdGFibGUtY29udGFpbmVyPlxcclxcblxcclxcbjxtZC10YWJsZS1jb250YWluZXIgbmctaWY9XFxcInZtLmFyZWEgPT09ICd1c2VyJ1xcXCI+XFxyXFxuICA8dGFibGUgbWQtdGFibGUgY2xhc3M9XFxcIm1kLXByaW1hcnlcXFwiICBtZC1yb3ctc2VsZWN0PVxcXCJ2bS5yb3dTZWxlY3Rpb25cXFwiIG11bHRpcGxlIG5nLW1vZGVsPVxcXCJ2bS5zZWxlY3RlZFxcXCI+XFxyXFxuICAgIDx0aGVhZCBtZC1oZWFkIG1kLW9yZGVyPVxcXCJ2bS5vcmRlclxcXCI+XFxyXFxuICAgICAgPHRyIG1kLXJvdz5cXHJcXG4gICAgICAgIDx0aCBtZC1jb2x1bW4+PC90aD5cXHJcXG4gICAgICAgIDx0aCBtZC1jb2x1bW4gPkdyb3VwIE5hbWU8L3RoPlxcclxcbiAgICAgICAgPHRoIG1kLWNvbHVtbiA+R3JvdXAgVHlwZTwvdGg+XFxyXFxuICAgICAgICA8dGggbWQtY29sdW1uID5BZGRyZXNzIDwvdGg+XFxyXFxuICAgICAgICA8dGggbWQtY29sdW1uID5Ib21lIHBhZ2U8L3RoPlxcclxcbiAgICAgICAgPHRoIG1kLWNvbHVtbj5TdGFydCBEYXRlPC90aD5cXHJcXG4gICAgICAgIDx0aCBtZC1jb2x1bW4+RGVzY3JpcHRpb248L3RoPlxcclxcbiAgICAgIDwvdHI+XFxyXFxuICAgIDwvdGhlYWQ+XFxyXFxuICAgIDx0Ym9keSBtZC1ib2R5PlxcclxcbiAgICAgIDx0ciBtZC1yb3cgbWQtc2VsZWN0PVxcXCJpdGVtXFxcIiBtZC1zZWxlY3QtaWQ9XFxcIl9pZFxcXCIgbWQtYXV0by1zZWxlY3QgbmctcmVwZWF0PVxcXCJpdGVtIGluIHZtLml0ZW1zIHwgb3JkZXJCeTogdm0ub3JkZXIgdHJhY2sgYnkgJGluZGV4XFxcIj5cXHJcXG4gICAgICAgIDx0ZCBtZC1jZWxsPjxtZC1pY29uIGNsYXNzPVxcXCJtZC1hdmF0YXJcXFwiPnt7aXRlbS5ncm91cFR5cGUuaWNvbn19PC9tZC1pY29uPjwvdGQ+XFxyXFxuICAgICAgICA8dGQgbWQtY2VsbD57e2l0ZW0ubmFtZX19PC90ZD5cXHJcXG4gICAgICAgIDx0ZCBtZC1jZWxsPnt7aXRlbS5ncm91cFR5cGUubmFtZX19PC90ZD5cXHJcXG4gICAgICAgIDx0ZCBtZC1jZWxsPnt7aXRlbS5hZGRyZXNzfX08L3RkPlxcclxcbiAgICAgICAgPHRkIG1kLWNlbGw+e3tpdGVtLmhvbWVwYWdlfX08L3RkPlxcclxcbiAgICAgICAgPHRkIG1kLWNlbGw+e3tpdGVtLmRhdGV9fTwvdGQ+XFxyXFxuICAgICAgICA8dGQgbWQtY2VsbD57e2l0ZW0uZGVzY3JpcHRpb259fTwvdGQ+XFxyXFxuICAgICAgPC90cj5cXHJcXG4gICAgPC90Ym9keT5cXHJcXG4gICAgPHRmb290IG1kLWZvb3Q+XFxyXFxuICAgICAgPHRyIG1kLXJvdz5cXHJcXG4gICAgICAgIDx0ZCBtZC1jZWxsIGNvbHNwYW49XFxcIjJcXFwiPjxsYWJlbD5Bc3NvY2lhdG9uczogPC9sYWJlbD57eyB2bS5pdGVtcy5sZW5ndGggfX0gb2Yge3t2bS5pdGVtcy5sZW5ndGh9fTwvdGQ+XFxyXFxuICAgICAgICA8dGQgbWQtY2VsbCBjb2xzcGFuPVxcXCI1XFxcIj48L3RkPlxcclxcbiAgICAgIDwvdHI+XFxyXFxuICAgIDwvdGZvb3Q+XFxyXFxuICA8L3RhYmxlPlxcclxcbjwvbWQtdGFibGUtY29udGFpbmVyPlxcclxcblxcclxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2luZnJhLW1vZHVsZXMvZ2VuZXJpYy10YWJsZS9nZW5lcmljLXRhYmxlLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0J1xyXG5cclxuY2xhc3MgVG9vbGJhckN0cmwge1xyXG5cclxuIC8qIEBuZ0luamVjdCAqL1xyXG4gY29uc3RydWN0b3IoXHJcbiAgcHJpdmF0ZSAkbWREaWFsb2c6IGFuZ3VsYXIubWF0ZXJpYWwuSURpYWxvZ1NlcnZpY2UsXHJcbiAgcHJpdmF0ZSAkbWRTaWRlbmF2OiBhbmd1bGFyLm1hdGVyaWFsLklTaWRlbmF2U2VydmljZSkge1xyXG4gfVxyXG5cclxuIHRvZ2dsZVNpZGVuYXYoKSB7XHJcbiAgICB0aGlzLiRtZFNpZGVuYXYoJ3NpZGVuYXYnKS50b2dnbGUoKVxyXG4gIH1cclxuXHJcbiBjbG9zZVNpZGVuYXYoKSB7XHJcbiAgICB0aGlzLiRtZFNpZGVuYXYoJ3NpZGVuYXYnKS5jbG9zZSgpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgVG9vbEJhcjogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuL3Rvb2xiYXIuaHRtbCcpLFxyXG4gIGNvbnRyb2xsZXI6IFRvb2xiYXJDdHJsLFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hcHAvaW5mcmEtbW9kdWxlcy9uYXZiYXIvdG9vbGJhci50cyIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2VjdGlvbiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LXNtPVxcXCJjb2x1bW5cXFwiIGxheW91dC1hbGlnbj1cXFwiY2VudGVyIGNlbnRlclxcXCIgbGF5b3V0LXdyYXA+XFxyXFxuICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1pY29uLWJ1dHRvblxcXCIgYXJpYS1sYWJlbD1cXFwicGVvcGxlXFxcIiB1aS1zcmVmPVxcXCJvdmVydmlld1xcXCI+XFxyXFxuICAgIDxtZC10b29sdGlwPmdyb3VwczwvbWQtdG9vbHRpcD5cXHJcXG4gICAgPG1kLWljb24+cGVvcGxlPC9tZC1pY29uPlxcclxcbiAgPC9tZC1idXR0b24+XFxyXFxuICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1pY29uLWJ1dHRvblxcXCIgYXJpYS1sYWJlbD1cXFwicGVyc29uXFxcIiB1aS1zcmVmPVxcXCJ1c2Vyb3ZlcnZpZXdcXFwiPlxcclxcbiAgICA8bWQtdG9vbHRpcD51c2VyczwvbWQtdG9vbHRpcD5cXHJcXG4gICAgPG1kLWljb24+cGVyc29uPC9tZC1pY29uPlxcclxcbiAgPC9tZC1idXR0b24+XFxyXFxuPC9zZWN0aW9uPlwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwL2luZnJhLW1vZHVsZXMvbmF2YmFyL3Rvb2xiYXIuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICdhbmd1bGFyJ1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRGlhbG9nT3B0aW9ucyB7XHJcbiAgY29udHJvbGxlcjogYW55LFxyXG4gIHRlbXBsYXRlOiBzdHJpbmcsXHJcbiAgdGFyZ2V0RXZlbnQ/OiBhbnksXHJcbiAgbG9jYWxzPzogYW55XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBEaWFsb2dTZXJ2aWNlIHtcclxuICAvKiBAbmdJbmplY3QgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgJG1kVG9hc3Q6IGFuZ3VsYXIubWF0ZXJpYWwuSVRvYXN0U2VydmljZSxcclxuICAgIHByaXZhdGUgJG1kRGlhbG9nOiBhbmd1bGFyLm1hdGVyaWFsLklEaWFsb2dTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSAkbWRNZWRpYTogYW5ndWxhci5tYXRlcmlhbC5JTWVkaWEsXHJcbiAgICBwcml2YXRlICRsb2c6IGFuZ3VsYXIuSUxvZ1NlcnZpY2UpIHsgfVxyXG5cclxuICBzaG93KG9wdHM6IElEaWFsb2dPcHRpb25zKSB7XHJcbiAgICBjb25zdCB1c2VGdWxsU2NyZWVuID0gdGhpcy4kbWRNZWRpYSgneHMnKVxyXG4gICAgcmV0dXJuIHRoaXMuJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgIGNvbnRyb2xsZXI6IG9wdHMuY29udHJvbGxlcixcclxuICAgICAgdGVtcGxhdGU6IG9wdHMudGVtcGxhdGUsXHJcbiAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICB0YXJnZXRFdmVudDogb3B0cy50YXJnZXRFdmVudCxcclxuICAgICAgY2xpY2tPdXRzaWRlVG9DbG9zZTogZmFsc2UsXHJcbiAgICAgIGZ1bGxzY3JlZW46IHVzZUZ1bGxTY3JlZW4sXHJcbiAgICAgIGxvY2Fsczogb3B0cy5sb2NhbHMsXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgbm90aWZ5KG1zZzogc3RyaW5nKSB7XHJcbiAgICB0aGlzLiRsb2cuaW5mbyhtc2cpXHJcbiAgICBjb25zdCB0b2FzdCA9IHRoaXMuJG1kVG9hc3Quc2ltcGxlKClcclxuICAgICAgICAgIC50ZXh0Q29udGVudChtc2cpXHJcbiAgICAgICAgICAuYWN0aW9uKCdPSycpXHJcbiAgICAgICAgICAuaGlnaGxpZ2h0QWN0aW9uKGZhbHNlKVxyXG4gICAgICAgICAgLmhpZGVEZWxheSg2MDAwKVxyXG4gICAgICAgICAgLnBvc2l0aW9uKCd0b3AgcmlnaHQnKVxyXG4gICAgcmV0dXJuIHRoaXMuJG1kVG9hc3Quc2hvdyh0b2FzdClcclxuICB9XHJcblxyXG4gIGFsZXJ0KG1zZzogc3RyaW5nLCB0aXRsZTogc3RyaW5nLCBldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgY29uc3QgY29uZmlybSA9IHRoaXMuJG1kRGlhbG9nLmFsZXJ0KClcclxuICAgIC50aXRsZSh0aXRsZSlcclxuICAgIC50ZXh0Q29udGVudChtc2cpXHJcbiAgICAudGFyZ2V0RXZlbnQoZXZlbnQpXHJcbiAgICAub2soJ09LJylcclxuICAgIHJldHVybiB0aGlzLiRtZERpYWxvZy5zaG93KGNvbmZpcm0pXHJcbiAgfVxyXG5cclxuICBjb25maXJtKG1zZzogc3RyaW5nLCBldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgY29uc3QgY29uZmlybSA9IHRoaXMuJG1kRGlhbG9nLmNvbmZpcm0oKVxyXG4gICAgLnRpdGxlKCdDb25maXJtYXRpb24gRGlhbG9nJylcclxuICAgIC50ZXh0Q29udGVudChtc2cpXHJcbiAgICAudGFyZ2V0RXZlbnQoZXZlbnQpXHJcbiAgICAub2soJ0RlbGV0ZScpXHJcbiAgICAuY2FuY2VsKCdDYW5jZWwnKVxyXG4gICAgcmV0dXJuIHRoaXMuJG1kRGlhbG9nLnNob3coY29uZmlybSlcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2FwcC9pbmZyYS1tb2R1bGVzL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlLnRzIiwiY2xhc3MgTWVudUN0cmwge1xyXG4gIHB1YmxpYyBpdGVtOiBhbnlcclxuICBwdWJsaWMgY2F0ZWdvcnk6IHN0cmluZ1xyXG5cclxuICAvKiBAbmdJbmplY3QgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgJG1kRGlhbG9nOiBhbmd1bGFyLm1hdGVyaWFsLklEaWFsb2dTZXJ2aWNlKSB7fVxyXG5cclxuICBvcGVuTWVudSgkbWRPcGVuTWVudSwgZXYpIHtcclxuICAgICRtZE9wZW5NZW51KGV2KVxyXG4gIH1cclxuXHJcbiAgaXNNZW51SXRlbVZpc2libGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXRlZ29yeSAhPT0gdW5kZWZpbmVkXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgTWVudTogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gIGNvbnRyb2xsZXI6IE1lbnVDdHJsLFxyXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuL21lbnUuaHRtbCcpLFxyXG4gIGJpbmRpbmdzOiB7XHJcbiAgICBjYXRlZ29yeTogJzwnLFxyXG4gICAgaXRlbTogJz0nLFxyXG4gICAgb25EZWxldGU6ICcmJyxcclxuICAgIG9uRWRpdDogJyYnLFxyXG4gICAgb25DbG9uZTogJyYnLFxyXG4gICAgb25BZGQ6ICcmJyxcclxuICB9LFxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hcHAvaW5mcmEtbW9kdWxlcy9tZW51L21lbnUudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPG1kLW1lbnU+XFxyXFxuICAgIDxtZC1idXR0b24gYXJpYS1sYWJlbD1cXFwib3BlbiBtZW51XFxcIiBjbGFzcz1cXFwibWQtaWNvbi1idXR0b25cXFwiIG5nLWNsaWNrPVxcXCJ2bS5vcGVuTWVudSgkbWRNZW51Lm9wZW4sICRldmVudClcXFwiPlxcclxcbiAgICAgIDxtZC1pY29uIG1kLW1lbnUtb3JpZ2luPm1vcmVfdmVydDwvbWQtaWNvbj5cXHJcXG4gICAgPC9tZC1idXR0b24+XFxyXFxuICAgIDxtZC1tZW51LWNvbnRlbnQgd2lkdGg9XFxcIjJcXFwiPlxcclxcbiAgICAgIDxtZC1tZW51LWl0ZW0+XFxyXFxuICAgICAgICA8bWQtYnV0dG9uIG5nLWNsaWNrPVxcXCJ2bS5vbkVkaXQoe2l0ZW06IHZtLml0ZW19KVxcXCIgbmctZGlzYWJsZWQ9XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICA8bWQtaWNvbiBtZC1tZW51LWFsaWduLXRhcmdldD5lZGl0PC9tZC1pY29uPlxcclxcbiAgICAgICAgICBFZGl0XFxyXFxuICAgICAgICA8L21kLWJ1dHRvbj5cXHJcXG4gICAgICA8L21kLW1lbnUtaXRlbT5cXHJcXG4gICAgICA8bWQtbWVudS1pdGVtPlxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBuZy1jbGljaz1cXFwidm0ub25EZWxldGUoe2l0ZW06IHZtLml0ZW19KVxcXCIgbmctZGlzYWJsZWQ9XFxcInRydWVcXFwiPlxcclxcbiAgICAgICAgICA8bWQtaWNvbiBtZC1tZW51LWFsaWduLXRhcmdldD5kZWxldGU8L21kLWljb24+XFxyXFxuICAgICAgICAgIERlbGV0ZVxcclxcbiAgICAgICAgPC9tZC1idXR0b24+XFxyXFxuICAgICAgPC9tZC1tZW51LWl0ZW0+XFxyXFxuICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcclxcbiAgICAgIDxtZC1tZW51LWl0ZW0gbmctaWY9XFxcInZtLmlzTWVudUl0ZW1WaXNpYmxlKClcXFwiPlxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBuZy1jbGljaz1cXFwidm0ub25DbG9uZSh7aXRlbTogdm0uaXRlbX0pXFxcIiBuZy1kaXNhYmxlZD1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgIDxtZC1pY29uIG1kLW1lbnUtYWxpZ24tdGFyZ2V0PmNvbnRlbnRfY29weTwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgIENsb25lIHt7dm0uY2F0ZWdvcnl9fVxcclxcbiAgICAgICAgPC9tZC1idXR0b24+XFxyXFxuICAgICAgPC9tZC1tZW51LWl0ZW0+XFxyXFxuICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcclxcbiAgICAgIDxtZC1tZW51LWl0ZW0gbmctaWY9XFxcInZtLmlzTWVudUl0ZW1WaXNpYmxlKClcXFwiPlxcclxcbiAgICAgICAgICA8bWQtYnV0dG9uIG5nLWNsaWNrPVxcXCJ2bS5vbkFkZCgkZXZlbnQpXFxcIiBuZy1kaXNhYmxlZD1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgPG1kLWljb24gbWQtbWVudS1hbGlnbi10YXJnZXQ+e3t2bS5jYXRlZ29yeSA9PSAnZ3JvdXAnID8gJ3BlcnNvbicgOiAncGVvcGxlJ319PC9tZC1pY29uPlxcclxcbiAgICAgICAgICAgICB7e3ZtLmNhdGVnb3J5ID09ICdncm91cCcgPyAnQWRkIG1lbWJlcnMnIDogJ0FkZCB0byBncm91cHMnfX1cXHJcXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxyXFxuICAgICAgICA8L21kLW1lbnUtaXRlbT5cXHJcXG4gICAgPC9tZC1tZW51LWNvbnRlbnQ+XFxyXFxuICA8L21kLW1lbnU+XFxyXFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvaW5mcmEtbW9kdWxlcy9tZW51L21lbnUuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jbGFzcyBBcHBTdGFydEN0cmwge1xyXG5cclxuICAvKiBAbmdJbmplY3QgKi9cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgJG1kTWVkaWE6IGFuZ3VsYXIubWF0ZXJpYWwuSU1lZGlhKSB7XHJcblxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEFwcFN0YXJ0UGFnZSA9IHtcclxuICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgdGVtcGxhdGU6IHJlcXVpcmUoJy4vYXBwLXN0YXJ0Lmh0bWwnKSxcclxuICBjb250cm9sbGVyOiBBcHBTdGFydEN0cmwsXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2FwcC9hcHAtc3RhcnQvYXBwLXN0YXJ0LnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxtYWluIGZsZXggbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC1hbGlnbj1cXFwic3BhY2UtYmV0d2VlbiBzdHJldGNoXFxcIj5cXHJcXG4gIDxzZWN0aW9uIGZsZXggbGF5b3V0PVxcXCJjb2x1bW5cXFwiPlxcclxcbiAgICA8bWQtdG9vbGJhciBjbGFzcz1cXFwibWQtd2hpdGVmcmFtZS16MVxcXCI+XFxyXFxuICAgICAgPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzcGFjZS1iZXR3ZWVuIGNlbnRlclxcXCIgY2xhc3M9XFxcIm1kLXRvb2xiYXItdG9vbHNcXFwiPlxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBoaWRlLWd0LXNtIGNsYXNzPVxcXCJtZC1pY29uLWJ1dHRvblxcXCIgYXJpYS1sYWJlbD1cXFwiU2V0dGluZ3NcXFwiIG5nLWNsaWNrPVxcXCJ2bS50b2dnbGVTaWRlbmF2KCdwcm9maWxlcy1uYXYnKVxcXCI+XFxyXFxuICAgICAgICAgIDxtZC1pY29uPmFycm93X2JhY2s8L21kLWljb24+XFxyXFxuICAgICAgICA8L21kLWJ1dHRvbj5cXHJcXG4gICAgICAgIDxoMz5Vc2VyIEdyb3VwIEFzc29jaWF0aW9uIFN1aXRlPC9oMz5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG4gICAgPC9tZC10b29sYmFyPlxcclxcbiAgICA8bWQtY29udGVudCBmbGV4IGxheW91dD1cXFwiY29sdW1uXFxcIiBjbGFzcz1cXFwiYmFja2dyb3VuZFxcXCI+XFxyXFxuICAgICAgPGRpdiBmbGV4IGxheW91dC1ndC1zbT1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcImNlbnRlciBzdGFydFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGZsZXgtZ3Qtc209XFxcIjk1XFxcIiBmbGV4LWd0LWxnPVxcXCI4MFxcXCI+XFxyXFxuXFxyXFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNhcmQtbGlrZVxcXCI+XFxyXFxuICAgICAgICAgICAgPG1haW4gY2xhc3M9XFxcImhpc3RvcmljYWx0cmVuZFxcXCIgbGF5b3V0PVxcXCJyb3dcXFwiPlxcclxcbiAgICAgICAgICAgICAgPG1kLWxpc3QgbGF5b3V0LW1hcmdpbj5cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cXFwibWQtMy1saW5lXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8aW1nIG5nLXNyYz1cXFwiaHR0cDovL3d3dy5pY29uYXJjaGl2ZS5jb20vZG93bmxvYWQvaTEwMzQyNy9wYW9tZWRpYS9zbWFsbC1uLWZsYXQvaGFuZHNoYWtlLmljb1xcXCIgY2xhc3M9XFxcIm1kLWF2YXRhclxcXCIgYWx0PVxcXCJ7e2l0ZW0ud2hvfX1cXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtbGlzdC1pdGVtLXRleHRcXFwiIGxheW91dD1cXFwiY29sdW1uXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxoMz5XZWxjb21lIHRvIFNoYWtlIEhhbmRzPC9oMz5cXHJcXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxyXFxuICAgICAgICAgICAgICAgIDxtZC1saXN0LWl0ZW0gY2xhc3M9XFxcIm1kLTMtbGluZSBtZC1sb25nLXRleHRcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgIDxtZC1pY29uIGNsYXNzPVxcXCJtZC1hdmF0YXJcXFwiPmluZm88L21kLWljb24+XFxyXFxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibWQtbGlzdC1pdGVtLXRleHQgd2FybmluZy1tZXNzYWdlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxoMz5JbnRyb2R1Y3Rpb248L2gzPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHA+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgVGhpcyBhcHAgc2VydmVzIGFzIGEgcGxhdGZvcm0gd2hlcmUgbmV3IHVzZXJzIGFuZCBncm91cHMgY2FuIGJlIGNyZWF0ZWQuIFVzZXJzIGNhbiBqb2luIGFueSBncm91cCBvZiB0aGVpclxcclxcbiAgICAgICAgICAgICAgICAgICAgIGNob2ljZSBhbmQgZW5qb3kgdGhlIHByaXZpbGxlZGdlcyBvZiBzcGVjaWZpYyBncm91cC5cXHJcXG4gICAgICAgICAgICAgICAgICAgICA8YnI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgVGhlIGxpc3Qgb2YgZ3JvdXBzIGlzIGFscGhhYmV0aWNhbGx5IHNvcnRlZCwgc2hvd3MgdGhlIG1vc3QgbWV0YSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZ3JvdXAgbGlrZSB0eXBlIGFuZCBtZW1iZXIgY291bnQuXFxyXFxuICAgICAgICAgICAgICAgICAgICAgVGhlIGlzIGxpc3QgaXMgZW5yaWNoZWQgd2l0aCBzZWFyY2ggZmFjaWxpdHkuXFxyXFxuICAgICAgICAgICAgICAgICAgICAgPGJyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgIFRoZSBncm91cCBkZXRhaWxzIHBhZ2Ugc2hvd3MgYmFzaWMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGdyb3VwIGxpa2UgbmFtZSwgdHlwZSBvZiBncm91cCwgbG9jYXRpb24gYW5kIGxpbmsgdG9cXHJcXG4gICAgICAgICAgICAgICAgICAgICBob21lIHBhZ2UuIEl0IGFsc28gc2hvd3MgYmFzaWMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXJzIGFsb25nIHdpdGggdGhlaXIgbWVtYmVyc2hpcCBzdGF0dXNlcy5cXHJcXG4gICAgICAgICAgICAgICAgICAgICA8YnI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgVGhlIHNlbGVjdGlvbiBvZiBncm91cHMgd2hpbGUgY3JlYXRpb24gdXNlciBpcyBlbnJpY2hlZCB3aXRoIGF1dG8tY29tcGxldGlvbiBmYWNpbGl0eS5cXHJcXG4gICAgICAgICAgICAgICAgICAgICBUaGUgbGlzdCBvZiB1c2VycyBpcyBhbHBoYWJldGljYWxseSBzb3J0ZWQsIHNob3dzIHRoZSBtb3N0IG1ldGEgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXIgbGlrZSBuaWNrIG5hbWUgYW5kIGdyb3VwIGNvdW50LlxcclxcbiAgICAgICAgICAgICAgICAgICAgIFRoZSBpcyBsaXN0IGlzIHBvd2VyZWQgd2l0aCBzZWFyY2ggZmFjaWxpdHkuXFxyXFxuICAgICAgICAgICAgICAgICAgICAgPGJyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgIFRoZSB1c2VyIGRldGFpbHMgcGFnZSBzaG93cyB0aGUgYmFzaWMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHVzZXIgYW5kIGhpcy9oZXIgYXNzb2NpYXRpb24gd2l0aCBzcGVjaWZpYyBncm91cC5cXHJcXG4gICAgICAgICAgICAgICAgICAgICA8YnI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgVGhlIHVzZXIgaXMgbm90aWZpZWQgY3JlYXRpb24gb2YgbmV3IGdyb3VwIGFuZCB1c2VyIHZpYSB0b2FzdCBpbiBhIHRvcCByaWdodCBjb3JuZXIuIFVzZXJzIGFuZCBncm91cHMgZ290IHNlbGVjdGVkIGFmdGVyIGNyZWF0aW9uLlxcclxcbiAgICAgICAgICAgICAgICAgICAgIFRvb2x0aXBzIGFyZSBwbGFjZWQgaW4gYWxsIHNlY3Rpb25zIGluIG9yZGVyIGhlbHAgdXNlciBmb3IgYXBwIHVzYWdlLlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxcclxcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L21kLWxpc3QtaXRlbT5cXHJcXG4gICAgICAgICAgICAgICAgPG1kLWRpdmlkZXI+PC9tZC1kaXZpZGVyPlxcclxcbiAgICAgICAgICAgICAgICA8bWQtbGlzdC1pdGVtIGNsYXNzPVxcXCJtZC0zLWxpbmUgbWQtbG9uZy10ZXh0XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8bWQtaWNvbiBjbGFzcz1cXFwibWQtYXZhdGFyXFxcIj5pbmZvPC9tZC1pY29uPlxcclxcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1kLWxpc3QtaXRlbS10ZXh0IHdhcm5pbmctbWVzc2FnZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aDM+SG93IHRvIHVzZSB0aGUgYXBwPC9oMz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwPlxcclxcbiAgICAgICAgICAgICAgICAgICAgIFRoZSBhcHAgaXMgc2VsZiBkcml2ZW4gYW5kIGdpdmVzIG5vdGlmaWNhdGlvbiB0byB1c2VyIGF0IHZhcmlvdXMgaW5zdGFuY2VzLiBUaGUgaWNvbiBzZWxlY3Rpb24gYWxzbyBoZWxwcyB0aGUgdXNlciB0b1xcclxcbiAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRlIHRocm91Z2ggdGhlIGFwcC4gRnJvbSBpbnRyb2R1Y3Rpb24gcGFnZSB1c2VyIGNhbiBwcmVzcyBcXFwiU3RhcnQgQXBwXFxcIiBhbmQgbmF2aWdhdGUgdG8gdGhlIGdyb3VwIHBhZ2UuIFRoZSBncm91cFxcclxcbiAgICAgICAgICAgICAgICAgICAgIHBhZ2UgY29udGFpbnMgYSBcXFwiZmFiIGJ1dHRvblxcXCIgZm9yIG9wZW5pbmcgY3JlYXRpb24gZGlhbG9nIGJveC4gVXNlciBjYW4gc2VsZWN0IGdyb3VwIHR5cGUgYW5kIGZpbGwgdGhlIG1hbmFkYXRvcnkgZmllbGRcXHJcXG4gICAgICAgICAgICAgICAgICAgICB0byBjcmVhdGUgbmV3IGdyb3VwLiBVc2VyIHdpbGwgZ2V0IG5vdGlmaWNhdGlvbiBpbiB0b3AgcmlnaHQgY29ybmVyIG9uIHN1Y2Nlc3NmdWwgY3JlYXRpb24gb2YgZ3JvdXAgYW5kIG5ld2x5IGNyZWF0ZWRcXHJcXG4gICAgICAgICAgICAgICAgICAgICBncm91cCB3aWxsIGdldCBzZWxlY3RlZC5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxicj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIFRoZSB1c2VyIGNhbiBuYXZpZ2F0ZSB0byB0aGUgdXNlcnMgcGFnZSBieSBzZWxlY3RpbmcgXFxcIlBlcnNvblxcXCIgaWNvbiBvbiB0b3Agb2YgdGhlIGxpc3QuIE9uIHRoZSBcXFwiVXNlciBwYWdlXFxcIiBhIHVzZXJcXHJcXG4gICAgICAgICAgICAgICAgICAgIGNhbiBjcmVhdGUgdGhlIG5ldyB1c2VyLCB3aGlsZSBjcmVhdGluZyBvbmUgbmVlZHMgdG8gc2VsZWN0IHRoZSBncm91cHMgdG8gam9pbiBhbmQgb25jZSB0aGUgdXNlciBpcyBjcmVhdGVkIHN1Y2Nlc3NmdWxseVxcclxcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtIHdpbGwgc2hvdyB0aGUgbm90aWZpY2F0aW9uLlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGJyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgQm90aCB1c2VyIHBhZ2UgYW5kIGdyb3VwIHBhZ2Ugd2lsbCBzaG93IGdyb3VwcyBhbmQgbWVtYmVycyBvbiBzZWxlY3RpbmcgcmVzcGVjdGl2ZSBlbnRpdHkuXFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3A+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bWQtaW5wdXQtY29udGFpbmVyIGZsZXgtZ3QtbWQ9XFxcIjMwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxyXFxuICAgICAgICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXHJcXG4gICAgICAgICAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cXFwibWQtMy1saW5lIG1kLWxvbmctdGV4dFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24gY2xhc3M9XFxcIm1kLWF2YXRhclxcXCI+aW5mbzwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZC1saXN0LWl0ZW0tdGV4dCB3YXJuaW5nLW1lc3NhZ2VcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGgzPlRlY2huaWNhbCBTdGFjazwvaDM+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8cD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgVHlwZXNjcmlwdCwgQW5ndWxhckpTLCBOb2RlLmpzLCBWaXN1YWxpemF0aW9uIExpYnJhcnk6IEFuZ3VsYXIgTWF0ZXJpYWwsIERhdGFiYXNlOiBNb25nb2RiLCBCcm93c2VyOiBDaHJvbWVcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cXHJcXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxyXFxuICAgICAgICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXHJcXG4gICAgICAgICAgICAgICAgPG1kLWxpc3QtaXRlbSBjbGFzcz1cXFwibWQtMy1saW5lIG1kLWxvbmctdGV4dFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24gY2xhc3M9XFxcIm1kLWF2YXRhclxcXCI+aW5mbzwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZC1saXN0LWl0ZW0tdGV4dCB3YXJuaW5nLW1lc3NhZ2VcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGgzPlJlc3RyaWN0aW9ucyBhbmQgYXNzdW1wdGlvbnM6PC9oMz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxwPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICBGb3IgdGhlIGRlbW8gcHVycG9zZXMgc29tZSBhc3N1bXB0aW9ucyBhcmUgYmVpbmcgbWFkZTpcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnI+QXBwIGlzIHJlc3RyaWN0ZWQgdG8gYWRkIG5ldyBncm91cHMgYW5kIG5ldyB1c2VycyAodXNlciBqb2luaW5nIGdyb3VwcyBvbiBjcmVhdGlvbiB0aW1lKS5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnI+VGhlcmUgYXJlIHByZS1kZWZpbmVkIGdyb3VwIHR5cGVzIGFyZSBwcmVzZW50IGluIHRoZSBzeXN0ZW0uXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyPlRoZSBtZW51IGl0ZW1zIGFyZSBkaXNhYmxlc2QgZm9yIGRlbW8gcHVycG9zZSwgdGhleSByZXByZXNlbnQgdGhlIGZ1dHVyZSBhc3BlY3Qgb2YgYXBwbGljYXRpb24uXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJyPkEgdXNlciBjYW4gb25seSBiZSBjcmVhdGVkIGFmdGVyIHNlbGVjdGluZyBvbmUgb2YgdGhlIGV4aXN0aW5nIGdyb3Vwcy5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHA+RnV0dXJlIEFzcGVjdHM6XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnI+IFNlbmRpbmcgbWFpbHMgZm9yIG5vdGlmaWNhdGlvblxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyPkRpc3BsYXlpbmcgZGlzY3Vzc2lvbiBzZWN0aW9uIGluIGdyb3VwcyBwYWdlXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YnI+QWJpbGl0eSB0byBjaGFuZ2UgbWVtYmVyc2hpcCBzdGF0dXNcXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cXHJcXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9tZC1saXN0LWl0ZW0+XFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgIDxtZC1kaXZpZGVyPjwvbWQtZGl2aWRlcj5cXHJcXG4gICAgICAgICAgICAgICAgPG1kLXN1YmhlYWRlciBjbGFzcz1cXFwibWQtbm8tc3RpY2t5XFxcIj5TdGFydCBBcHBsaWNhdGlvbi48L21kLXN1YmhlYWRlcj5cXHJcXG4gICAgICAgICAgICAgICAgPG1kLWxpc3QtaXRlbSB1aS1zcmVmPVxcXCJvdmVydmlld1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgPG1kLWljb24+dmlld19xdWlsdDwvbWQtaWNvbj5cXHJcXG4gICAgICAgICAgICAgICAgICA8cD5TdGFydCBhcHA8L3A+XFxyXFxuICAgICAgICAgICAgICAgIDwvbWQtbGlzdC1pdGVtPlxcclxcblxcclxcbiAgICAgICAgICAgICAgPC9tZC1saXN0PlxcclxcbiAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgIDwvZGl2PlxcclxcbiAgICA8L21kLWNvbnRlbnQ+XFxyXFxuICA8L3NlY3Rpb24+XFxyXFxuICA8L21haW4+XCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAvYXBwLXN0YXJ0L2FwcC1zdGFydC5odG1sXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9