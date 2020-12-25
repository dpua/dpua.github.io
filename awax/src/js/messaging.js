/*******************************************************************************

    µBlock - a browser extension to block requests.
    Copyright (C) 2014 Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/uBlockAdmin/uBlock
*/

/* global µBlock, vAPI */

/******************************************************************************/
/******************************************************************************/

// Default handler

(function() {

'use strict';

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    var µb = µBlock;

    // Async
    switch ( request.what ) {
        case 'getAssetContent':
            // https://github.com/uBlockAdmin/uBlock/issues/417
            µb.assets.get(request.url, callback);
            return;

        case 'reloadAllFilters':
            µb.reloadAllFilters(callback);
            return;

        default:
            break;
    }

    var tabId = sender && sender.tab ? sender.tab.id : 0;

    // Sync
    var response;

    switch ( request.what ) {
        case 'contextMenuEvent':
            µb.contextMenuClientX = request.clientX;
            µb.contextMenuClientY = request.clientY;
            break;

        case 'cosmeticFiltersInjected':
            // Is this a request to cache selectors?
            µb.cosmeticFilteringEngine.addToSelectorCache(request);
            /* falls through */
        case 'cosmeticFiltersActivated':
            // Net-based cosmetic filters are of no interest for logging purpose.
            if ( µb.logger.isObserved(tabId) && request.type !== 'net' ) {
                µb.logCosmeticFilters(tabId);
            }
            break;

        case 'forceUpdateAssets':
            µb.assetUpdater.force();
            break;

        case 'getAppData':
            response = {name: vAPI.app.name, version: vAPI.app.version};
            break;

        case 'getUserSettings':
            response = µb.userSettings;
            break;

        case 'gotoURL':
            vAPI.tabs.open(request.details);
            break;

        case 'reloadTab':
            if ( vAPI.isBehindTheSceneTabId(request.tabId) === false ) {
                vAPI.tabs.reload(request.tabId);
                if ( request.select && vAPI.tabs.select ) {
                    vAPI.tabs.select(request.tabId);
                }
            }
            break;

        case 'selectFilterLists':
            µb.selectFilterLists(request.switches);
            break;

        case 'toggleHostnameSwitch':
            µb.toggleHostnameSwitch(request);
            break;

        case 'userSettings':
            response = µb.changeUserSettings(request.name, request.value);
            break;

        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.setup(onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// popup.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var getHostnameDict = function(hostnameToCountMap) {
    var r = {}, de;
    var domainFromHostname = µb.URI.domainFromHostname;
    var domain, counts, blockCount, allowCount;
    for ( var hostname in hostnameToCountMap ) {
        if ( hostnameToCountMap.hasOwnProperty(hostname) === false ) {
            continue;
        }
        if ( r.hasOwnProperty(hostname) ) {
            continue;
        }
        domain = domainFromHostname(hostname) || hostname;
        counts = hostnameToCountMap[domain] || 0;
        blockCount = counts & 0xFFFF;
        allowCount = counts >>> 16 & 0xFFFF;
        if ( r.hasOwnProperty(domain) === false ) {
            de = r[domain] = {
                domain: domain,
                blockCount: blockCount,
                allowCount: allowCount,
                totalBlockCount: 0,
                totalAllowCount: 0
            };
        } else {
            de = r[domain];
        }
        counts = hostnameToCountMap[hostname] || 0;
        blockCount = counts & 0xFFFF;
        allowCount = counts >>> 16 & 0xFFFF;
        de.totalBlockCount += blockCount;
        de.totalAllowCount += allowCount;
        if ( hostname === domain ) {
            continue;
        }
        r[hostname] = {
            domain: domain,
            blockCount: blockCount,
            allowCount: allowCount
        };
    }
    return r;
};

/******************************************************************************/

var getFirewallRules = function(srcHostname, desHostnames) {
    var r = {};
    var dFiltering = µb.sessionFirewall;
    r['/ * *'] = dFiltering.evaluateCellZY('*', '*', '*').toFilterString();
    r['/ * image'] = dFiltering.evaluateCellZY('*', '*', 'image').toFilterString();
    r['/ * 3p'] = dFiltering.evaluateCellZY('*', '*', '3p').toFilterString();
    r['/ * inline-script'] = dFiltering.evaluateCellZY('*', '*', 'inline-script').toFilterString();
    r['/ * 1p-script'] = dFiltering.evaluateCellZY('*', '*', '1p-script').toFilterString();
    r['/ * 3p-script'] = dFiltering.evaluateCellZY('*', '*', '3p-script').toFilterString();
    r['/ * 3p-frame'] = dFiltering.evaluateCellZY('*', '*', '3p-frame').toFilterString();
    if ( typeof srcHostname !== 'string' ) {
        return r;
    }

    r['. * *'] = dFiltering.evaluateCellZY(srcHostname, '*', '*').toFilterString();
    r['. * image'] = dFiltering.evaluateCellZY(srcHostname, '*', 'image').toFilterString();
    r['. * 3p'] = dFiltering.evaluateCellZY(srcHostname, '*', '3p').toFilterString();
    r['. * inline-script'] = dFiltering.evaluateCellZY(srcHostname, '*', 'inline-script').toFilterString();
    r['. * 1p-script'] = dFiltering.evaluateCellZY(srcHostname, '*', '1p-script').toFilterString();
    r['. * 3p-script'] = dFiltering.evaluateCellZY(srcHostname, '*', '3p-script').toFilterString();
    r['. * 3p-frame'] = dFiltering.evaluateCellZY(srcHostname, '*', '3p-frame').toFilterString();

    for ( var desHostname in desHostnames ) {
        if ( desHostnames.hasOwnProperty(desHostname) ) {
            r['/ ' + desHostname + ' *'] = dFiltering.evaluateCellZY('*', desHostname, '*').toFilterString();
            r['. ' + desHostname + ' *'] = dFiltering.evaluateCellZY(srcHostname, desHostname, '*').toFilterString();
        }
    }
    return r;
};

/******************************************************************************/

var getStats = function(tabId, tabTitle) {
    var tabContext = µb.tabContextManager.lookup(tabId);
    var r = {
        enabled: µb.awax.settings.enabled,
        advancedUserEnabled: µb.userSettings.advancedUserEnabled,
        appName: vAPI.app.name,
        appVersion: vAPI.app.version,
        cosmeticFilteringSwitch: false,
        dfEnabled: µb.userSettings.dynamicFilteringEnabled,
        firewallPaneMinimized: µb.userSettings.firewallPaneMinimized,
        globalAllowedRequestCount: µb.localSettings.allowedRequestCount,
        globalBlockedRequestCount: µb.localSettings.blockedRequestCount,
        netFilteringSwitch: false,
        rawURL: tabContext.rawURL,
        pageURL: tabContext.normalURL,
        pageHostname: tabContext.rootHostname,
        pageDomain: tabContext.rootDomain,
        pageAllowedRequestCount: 0,
        pageBlockedRequestCount: 0,
        tabId: tabId,
        tabTitle: tabTitle
    };

    var pageStore = µb.pageStoreFromTabId(tabId);
    if ( pageStore ) {
        r.pageBlockedRequestCount = pageStore.perLoadBlockedRequestCount;
        r.pageAllowedRequestCount = pageStore.perLoadAllowedRequestCount;
        r.netFilteringSwitch = pageStore.getNetFilteringSwitch();
        r.hostnameDict = getHostnameDict(pageStore.hostnameToCountMap);
        r.contentLastModified = pageStore.contentLastModified;
        r.firewallRules = getFirewallRules(tabContext.rootHostname, r.hostnameDict);
        r.canElementPicker = tabContext.rootHostname.indexOf('.') !== -1;
        r.canRequestLog = canRequestLog;
    } else {
        r.hostnameDict = {};
        r.firewallRules = getFirewallRules();
    }
    r.matrixIsDirty = !µb.sessionFirewall.hasSameRules(
        µb.permanentFirewall,
        tabContext.rootHostname,
        r.hostnameDict
    );
    return r;
};

// Not the most elegant approach, but it does keep everything simple:
// This will be set by getTargetTabId() and used by getStats().
var canRequestLog = true;

/******************************************************************************/

var getTargetTabId = function(tab) {
    canRequestLog = true;

    if ( !tab ) {
        return '';
    }

    if ( tab.url.lastIndexOf(vAPI.getURL('devtools.html'), 0) !== 0 ) {
        return tab.id;
    }

    // If the URL is that of the network request logger, fill the popup with
    // the data from the tab being observed by the logger.
    // This allows a user to actually modify filtering profile for
    // behind-the-scene requests.

    canRequestLog = false;

    // Extract the target tab id from the URL
    var matches = tab.url.match(/[\?&]tabId=([^&]+)/);
    if ( matches && matches.length === 2 ) {
        return matches[1];
    }

    return tab.id;
};

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    var µb = µBlock;

    // Async
    switch ( request.what ) {
        case 'getPopupData':
            if ( request.tabId === vAPI.noTabId ) {
                callback(getStats(vAPI.noTabId, ''));
                return;
            }
            vAPI.tabs.get(request.tabId, function(tab) {
                // https://github.com/uBlockAdmin/uBlock/issues/1012
                callback(getStats(getTargetTabId(tab), tab ? tab.title : ''));
            });
            return;

        case 'setExtKey':
            if (request.key) {
                µb.awax.checkKey(request.key, callback);
            }    
            return;    

        default:
            break;
    }

    // Sync
    var pageStore;
    var response;

    switch ( request.what ) {
        case 'hasPopupContentChanged':
            pageStore = µb.pageStoreFromTabId(request.tabId);
            var lastModified = pageStore ? pageStore.contentLastModified : 0;
            response = lastModified !== request.contentLastModified;
            break;

        case 'saveFirewallRules':
            µb.permanentFirewall.copyRules(
                µb.sessionFirewall,
                request.srcHostname,
                request.desHostnames
            );
            µb.savePermanentFirewallRules();
            break;

        case 'flushFirewallRules':
            µb.sessionFirewall.copyRules(
                µb.permanentFirewall,
                request.srcHostname,
                request.desHostnames
            );
            break;

        case 'toggleFirewallRule':
            µb.toggleFirewallRule(request);
            response = getStats(request.tabId);
            break;

        case 'toggleNetFiltering':
            µb.awax.enable(request.state);
            pageStore = µb.pageStoreFromTabId(request.tabId);
            if ( pageStore ) {
                pageStore.toggleNetFilteringSwitch(request.url, request.scope, request.state);
                µb.updateBadgeAsync(request.tabId);
            }
            break;

        case 'getUserSettings':
            response = µb.userSettings;
            break;

        case 'getAWAXSettings':
            µb.awax.checkDate();
            response = µb.awax.settings;
            break;    

        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('popup.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// contentscript-start.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        default:
            break;
    }

    // Sync
    var response;

    var pageStore, tabId, frameId;
 
    if ( sender && sender.tab ) {
        tabId = sender.tab.id;
        frameId = sender.frameId;
        pageStore = µb.pageStoreFromTabId(sender.tab.id);
    }

    switch ( request.what ) {
        case 'retrieveDomainCosmeticSelectors':
            request.tabId = tabId;
            request.frameId = frameId;
            if ( pageStore && pageStore.getSpecificCosmeticFilteringSwitch() && !pageStore.applyDocumentFiltering ) {
                var options = {
                    skipCosmeticFiltering: pageStore.skipCosmeticFiltering                    
                };
                response = µb.cosmeticFilteringEngine.retrieveDomainSelectors(request,options);
            }
            break;

        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('contentscript-start.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// contentscript-end.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var tagNameToRequestTypeMap = {
     'embed': 'object',
    'iframe': 'sub_frame',
       'img': 'image',
    'object': 'object'
};

/******************************************************************************/

// Evaluate many requests

var filterRequests = function(pageStore, details) {
    var requests = details.requests;
    if ( !pageStore || !pageStore.getNetFilteringSwitch() ) {
        return requests;
    }
    if ( µb.userSettings.collapseBlocked === false ) {
        return requests;
    }

    //console.debug('messaging.js/contentscript-end.js: processing %d requests', requests.length);

    var µburi = µb.URI;
    var isBlockResult = µb.isBlockResult;

    // Create evaluation context
    var context = pageStore.createContextFromFrameHostname(details.pageHostname);
    var request;
    var i = requests.length;
    while ( i-- ) {
        request = requests[i];
        context.requestURL = vAPI.punycodeURL(request.url);
        context.requestHostname = µburi.hostnameFromURI(request.url);
        context.requestDomain = µburi.domainFromHostname(context.requestHostname);
        context.requestType = tagNameToRequestTypeMap[request.tagName];
        if ( isBlockResult(pageStore.filterRequest(context)) ) {
            request.collapse = true;
        }
    }
    return requests;
};

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        default:
            break;
    }

    // Sync
    var response;

    var pageStore, tabId, frameId;
    if ( sender && sender.tab ) {
        tabId = sender.tab.id;
        frameId = sender.frameId;
        pageStore = µb.pageStoreFromTabId(sender.tab.id);
    }

    switch ( request.what ) {
        case 'retrieveGenericCosmeticSelectors':
            request.tabId = tabId;
            request.frameId = frameId;
            response = {
                shutdown: !pageStore || !pageStore.getNetFilteringSwitch(),
                result: null
            };
            if ( !response.shutdown && pageStore.getGenericCosmeticFilteringSwitch() && !pageStore.applyDocumentFiltering) {
                response.result = µb.cosmeticFilteringEngine.retrieveGenericSelectors(request);
            }
            break;

        // Evaluate many requests
        case 'filterRequests':
            response = {
                shutdown: !pageStore || !pageStore.getNetFilteringSwitch(),
                result: null
            };
            if(!response.shutdown && !pageStore.applyDocumentFiltering) {
                response.result = filterRequests(pageStore, request);
            }
            break;
        case 'injectCSS':
            request.tabId = tabId;
            request.frameId = frameId;
            const details = {
                code: '',
                cssOrigin: 'user',
                frameId: request.frameId,
                runAt: 'document_start'
            };
            response = {
                shutdown: !pageStore || !pageStore.getNetFilteringSwitch(),
                result: null
            };
            if(!response.shutdown && !pageStore.applyDocumentFiltering) {
                if ( request.selectors != "" ) {
                    details.code = request.selectors;
                    vAPI.insertCSS(request.tabId, details);
                }
            }
            break;
        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('contentscript-end.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// cosmetic-*.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var logCosmeticFilters = function(tabId, details) {
    if ( µb.logger.isObserved(tabId) === false ) {
        return;
    }

    var context = {
        requestURL: details.pageURL,
        requestHostname: µb.URI.hostnameFromURI(details.pageURL),
        requestType: 'dom'
    };

    var selectors = details.matchedSelectors;

    selectors.sort();

    for ( var i = 0; i < selectors.length; i++ ) {
        µb.logger.writeOne(tabId, context, 'cb:##' + selectors[i]);
    }
    var userStyles = details.matchedUserStyle;
    for ( var i = 0; i < userStyles.length; i++ ) {
        µb.logger.writeOne(tabId, context, 'cb:#@#' + userStyles[i]);
    }

};

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        default:
            break;
    }

    // Sync
    var response;

    var tabId = sender && sender.tab ? sender.tab.id : 0;

    switch ( request.what ) {
    case 'logCosmeticFilteringData':
        logCosmeticFilters(tabId, request);
        break;

    default:
        return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('cosmetic-*.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// dyna-rules.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var getFirewallRules = function() {
    return {
        permanentRules: µb.permanentFirewall.toString(),
        sessionRules: µb.sessionFirewall.toString()
    };
};

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        default:
            break;
    }

    // Sync
    var response;

    switch ( request.what ) {
        case 'getFirewallRules':
            response = getFirewallRules();
            break;

        case 'setSessionFirewallRules':
            // https://github.com/uBlockAdmin/uBlock/issues/772
            µb.cosmeticFilteringEngine.removeFromSelectorCache('*');

            µb.sessionFirewall.fromString(request.rules);
            response = getFirewallRules();
            break;

        case 'setPermanentFirewallRules':
            µb.permanentFirewall.fromString(request.rules);
            µb.savePermanentFirewallRules();
            response = getFirewallRules();
            break;

        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('dyna-rules.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// devtools.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var getPageDetails = function(callback) {
    var out = {};
    var tabIds = Object.keys(µb.pageStores);

    // Special case: behind-the-scene virtual tab (does not really exist)
    var pos = tabIds.indexOf(vAPI.noTabId);
    if ( pos !== -1 ) {
        tabIds.splice(pos, 1);
        out[vAPI.noTabId] = vAPI.i18n('logBehindTheScene');
    }

    // This can happen
    if ( tabIds.length === 0 ) {
        callback(out);
        return;
    }

    var countdown = tabIds.length;
    var doCountdown = function() {
        countdown -= 1;
        if ( countdown === 0 ) {
            callback(out);
        }
    };

    // Let's not populate the page selector with reference to self
    var devtoolsURL = vAPI.getURL('devtools.html');

    var onTabDetails = function(tab) {
        if ( tab && tab.url.lastIndexOf(devtoolsURL, 0) !== 0 ) {
            out[tab.id] = tab.title;
        }
        doCountdown();
    };

    var i = countdown;
    while ( i-- ) {
        vAPI.tabs.get(tabIds[i], onTabDetails);
    }
};

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        case 'getPageDetails':
            getPageDetails(callback);
            return;

        default:
            break;
    }

    // Sync
    var response;

    switch ( request.what ) {
        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('devtools.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// devtool-log.js

(function() {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        default:
            break;
    }

    // Sync
    var response;

    switch ( request.what ) {
        case 'readLogBuffer':
            response = µb.logger.readAll(request.tabId);
            break;

        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('devtool-log.js', onMessage);

/******************************************************************************/

})();

// https://www.youtube.com/watch?v=3_WcygKJP1k

/******************************************************************************/
/******************************************************************************/

// subscriber.js

(function() {

'use strict';

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        default:
            break;
    }

    // Sync
    var response;

    switch ( request.what ) {
        case 'subscriberData':
            response = {
                confirmStr: vAPI.i18n('subscriberConfirm'),
                externalLists: µBlock.userSettings.externalLists
            };
            break;

        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('subscriber.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
/******************************************************************************/

// document-blocked.js

(function() {

'use strict';

/******************************************************************************/

var onMessage = function(request, sender, callback) {
    // Async
    switch ( request.what ) {
        default:
            break;
    }

    // Sync
    var response;

    switch ( request.what ) {
        case 'temporarilyWhitelistDocument':
            µBlock.webRequest.temporarilyWhitelistDocument(request.url);
            break;

        default:
            return vAPI.messaging.UNHANDLED;
    }

    callback(response);
};

vAPI.messaging.listen('document-blocked.js', onMessage);

/******************************************************************************/

})();

/******************************************************************************/
