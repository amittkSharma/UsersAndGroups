'use strict'

import * as angular from 'angular'
import { RestApi } from './rest-communication/rest-api'
import { OverviewPage } from './overview/overview-page'
import { OverviewUserPage } from './overview-user/overview-user-page'
import { GenericList } from './infra-modules/generic-list/generic-list'
import { GenericTable } from './infra-modules/generic-table/generic-table'
import { ToolBar } from './infra-modules/navbar/toolbar'
import { DialogService } from './infra-modules/services/dialog.service'
import { Menu } from './infra-modules/menu/menu'
import { AppStartPage } from './app-start/app-start'

export const MainModule = angular.module('users-groups-app-core',
  [
    'ngMaterial',
    'ngMessages',
    'md.data.table',
    'ngSanitize',
    'ngMaterialDatePicker',
  ])
  .service('api', RestApi)
  .component('overviewPage', OverviewPage)
  .component('overviewUserPage', OverviewUserPage)
  .component('appStartPage', AppStartPage)
  .component('genericList', GenericList)
  .component('genericTable', GenericTable)
  .component('toolBar', ToolBar)
  .component('customMenu', Menu)
  .service('dialogService', DialogService)
