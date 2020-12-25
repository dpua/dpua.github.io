/* global punycode, vAPI, uDom */

/******************************************************************************/

(function () {

    'use strict';

    /******************************************************************************/

    var popupData;
    var userData = {};
    var uiComp = {};
    var reIP = /^\d+(?:\.\d+){1,3}$/;
    var reSrcHostnameFromRule = /^d[abn]:([^ ]+) ([^ ]+) ([^ ]+)/;
    var scopeToSrcHostnameMap = {
        '/': '*',
        '.': ''
    };

    var hostnameToSortableTokenMap = {};
    var allDomains = {};
    var allDomainCount = 0;
    var allHostnameRows = [];
    var touchedDomainCount = 0;
    var cachedPopupHash = '';
    var reNetworkRelatedURL = /^(?:ftps?|https?|wss?):\/\//;
    var codeLength = 12;
    var renderAfterInput = false;
    var animateDuration = 200;

    /******************************************************************************/

    // https://github.com/uBlockAdmin/httpswitchboard/issues/345

    var messager = vAPI.messaging.channel('popup.js');

    /******************************************************************************/

    var cachePopupData = function (data) {
        popupData = {};
        scopeToSrcHostnameMap['.'] = '';
        hostnameToSortableTokenMap = {};

        if (typeof data !== 'object') {
            return popupData;
        }
        popupData = data;
        scopeToSrcHostnameMap['.'] = popupData.pageHostname || '';
        var hostnameDict = popupData.hostnameDict;
        if (typeof hostnameDict !== 'object') {
            return popupData;
        }
        var domain, prefix;
        for (var hostname in hostnameDict) {
            if (hostnameDict.hasOwnProperty(hostname) === false) {
                continue;
            }
            domain = hostnameDict[hostname].domain;
            if (domain === popupData.pageDomain) {
                domain = '\u0020';
            }
            prefix = hostname.slice(0, 0 - domain.length);
            hostnameToSortableTokenMap[hostname] = domain + prefix.split('.').reverse().join('.');
        }
        return popupData;
    };


    /******************************************************************************/

    var hashFromPopupData = function (reset) {
        // It makes no sense to offer to refresh the behind-the-scene scope
        if (popupData.pageHostname === 'behind-the-scene') {
            uDom('body').toggleClass('dirty', false);
            return;
        }

        var hasher = [];
        var rules = popupData.firewallRules;
        var rule;
        for (var key in rules) {
            if (rules.hasOwnProperty(key) === false) {
                continue;
            }
            rule = rules[key];
            if (rule !== '') {
                hasher.push(rule);
            }
        }
        hasher.push(uDom('header').hasClass('enable_ext'));

        var hash = hasher.sort().join('');
        if (reset) {
            cachedPopupHash = hash;
        }
        uDom('body').toggleClass('dirty', hash !== cachedPopupHash);
    };

    /******************************************************************************/

    var formatNumber = function (count) {
        return typeof count === 'number' ? count.toLocaleString() : '';
    };

    /******************************************************************************/

    var rulekeyCompare = function (a, b) {
        var ha = a.slice(2, a.indexOf(' ', 2));
        if (!reIP.test(ha)) {
            ha = hostnameToSortableTokenMap[ha] || '';
        }
        var hb = b.slice(2, b.indexOf(' ', 2));
        if (!reIP.test(hb)) {
            hb = hostnameToSortableTokenMap[hb] || '';
        }
        return ha.localeCompare(hb);
    };


    /******************************************************************************/

    var renderPrivacyExposure = function () {
        allDomains = {};
        allDomainCount = touchedDomainCount = 0;
        allHostnameRows = [];

        // Sort hostnames. First-party hostnames must always appear at the top
        // of the list.
        var desHostnameDone = {};
        var keys = Object.keys(popupData.firewallRules)
            .sort(rulekeyCompare);
        var key, des, hnDetails;
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            des = key.slice(2, key.indexOf(' ', 2));
            // Specific-type rules -- these are built-in
            if (des === '*' || desHostnameDone.hasOwnProperty(des)) {
                continue;
            }
            hnDetails = popupData.hostnameDict[des] || {};
            if (allDomains.hasOwnProperty(hnDetails.domain) === false) {
                allDomains[hnDetails.domain] = false;
                allDomainCount += 1;
            }
            if (hnDetails.allowCount !== 0) {
                if (allDomains[hnDetails.domain] === false) {
                    allDomains[hnDetails.domain] = true;
                    touchedDomainCount += 1;
                }
            }
            allHostnameRows.push(des);
            desHostnameDone[des] = true;
        }

        // Domain of the page must always be included (if there is one)
        if (
            allDomains.hasOwnProperty(popupData.pageDomain) === false &&
            reNetworkRelatedURL.test(popupData.rawURL)
        ) {
            allHostnameRows.push(popupData.pageDomain);
            allDomains[popupData.pageDomain] = false;
            allDomainCount += 1;
        }

        var summary = touchedDomainCount;
        //  touchedDomainCount allDomainCount
        uDom('#domain-count').text(summary);
    };

    // Assume everything has to be done incrementally.

    var renderPopup = function () {
        if (popupData.tabTitle) {
            document.title = popupData.appName + ' - ' + popupData.tabTitle;
        }

        var enableExt = popupData.enabled;
        // !(
        //     (popupData.pageURL === '') ||
        //     (!popupData.netFilteringSwitch) 
        //     (popupData.pageHostname === 'behind-the-scene' && !popupData.advancedUserEnabled)
        //     );
        uiComp.arrowBuy.src = 'img/popup/arrow-buy' + (enableExt ? '-dark' : '') + '.svg';

        uDom('header').toggleClass('enable_ext', enableExt);
        document.getElementById('switch').checked = enableExt;

        var text;
        var blocked = popupData.pageBlockedRequestCount;
        text = formatNumber(blocked);
        uDom('#page-blocked').text(text);

        blocked = popupData.globalBlockedRequestCount;
        text = formatNumber(blocked);
        uDom('#total-blocked').text(text);

        // This will collate all domains, touched or not
        renderPrivacyExposure();
    };

    var setVisible = function (element, visible, animate) {
        if (renderAfterInput && animate) {
            var c = '';
            if (visible) {
                c = 'fade-in';
            } else {
                c = 'fade-out';
            }
            element.classList.toggle(c, true);
            setTimeout(function () {
                element.classList.toggle('block-hide', !visible);
                element.classList.toggle(c, false);
            }, animateDuration);

        } else {
            element.classList.toggle('block-hide', !visible);
        }
    }

    var changeIconSource = function (src) {
        if (renderAfterInput) {
            if (uiComp.periodIcon.src !== src) {
                uiComp.periodIcon.classList.add('fade-out');
                setTimeout(function () {
                    uiComp.periodIcon.src = src;
                    uiComp.periodIcon.classList.add('fade-in');
                    uiComp.periodIcon.classList.remove('fade-out');
                }, animateDuration);
            }
        } else {
            uiComp.periodIcon.src = src;
        }
    }

    var changeLicText = function (period) {
        if (renderAfterInput) {
            if (uiComp.periodType.innerText !== period) {
                uiComp.periodType.classList.add('fade-out');
                setTimeout(function () {
                    uiComp.periodType.innerText = period;
                    uiComp.periodType.classList.add('fade-in');
                    uiComp.periodType.classList.remove('fade-out');
                }, animateDuration);
            }
        } else {
            uiComp.periodType.innerText = period;
        }
    }

    var getDateString = function (date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }

    var renderPopupAwax = function () {
        if (uiComp.isKeyInit) {
            uiComp.key.value = userData.vk;
        }
        if (userData.badKey) {
            if (userData.errorMsg) {
                uiComp.errorMsg.textContent = userData.errorMsg;
            }
            setVisible(uiComp.errorMsg, true);
            setVisible(uiComp.send, false);
            setVisible(uiComp.progress, false);
            uiComp.key.disabled = false;
        }

        renderAwaxLic();

        var date = new Date(userData.sd + 3 * 1000 * 60 * 60 * 24);
        uDom('#trial-period-date').text(getDateString(date));
        if (userData.vd) {
            date = new Date(userData.vd);
            uiComp.validPeriodDate.innerText = getDateString(date);
            setVisible(uiComp.validPeriod, true);
            setVisible(uiComp.trialPeriod, false);
        } else
            if (userData.lic === '99999month') {
                setVisible(uiComp.buyButton, false)
                setVisible(uiComp.trialPeriod, false);
                setVisible(uiComp.validPeriodTo, false);
                uiComp.validPeriodDate.innerText = chrome.i18n.getMessage('UNLIM');
                setVisible(uiComp.validPeriod, true);
            } else {
                setVisible(uiComp.validPeriod, false);
            }
    }

    var renderAwaxLic = function (enabled) {
        console.log(userData);
        if (!userData) return;

        let txt = '';
        let ico = '';
        let period = '';
        let hint = '';

        switch (userData.lic) {
            case '1month':
                txt = '1';
                period = chrome.i18n.getMessage('M');
                hint = chrome.i18n.getMessage('ActivateM');
                break;

            case '3month':
                txt = '3';
                period = chrome.i18n.getMessage('MS');
                hint = chrome.i18n.getMessage('Activate3MS');
                break;

            case '6month':
                txt = '6';
                period = chrome.i18n.getMessage('MS');
                hint = chrome.i18n.getMessage('Activate6MS');
                break;

            case '12month':
                txt = '1';
                period = chrome.i18n.getMessage('Y');
                hint = chrome.i18n.getMessage('ActivateY');
                break;

            case '24month':
                txt = '2';
                period = chrome.i18n.getMessage('YS');
                hint = chrome.i18n.getMessage('Activate2YS');
                break;

            case '99999month':
                period = chrome.i18n.getMessage('UNLIM');
                hint = chrome.i18n.getMessage('ActivateUNLIM');
                ico = 'diamond';
                break;

            default:
                period = 'TRIAL';
                ico = 'clock';
        }

        uiComp.okMsg.innerText = hint;
        var enable = typeof enabled !== 'undefined' ? enabled : userData.enabled
        if (ico) {
            setVisible(uiComp.periodDig, false, true);
            setVisible(uiComp.periodIcon, true);
            changeIconSource('img/popup/' + ico + (enable ? '-enable' : '') + '.svg');

        } else {
            setVisible(uiComp.periodIcon, false, true);
            setVisible(uiComp.periodDig, true, true);
            uiComp.periodDig.innerText = txt;
        }
        changeLicText(period);
    }

    /******************************************************************************/

    var toggleNetFilteringSwitch = function (ev) {
        uDom('header').toggleClass('enable_ext', uiComp.switch.checked);

        uiComp.arrowBuy.src = 'img/popup/arrow-buy' + (uiComp.switch.checked ? '-dark' : '') + '.svg';
        renderAwaxLic(uiComp.switch.checked);

        if (!popupData || !popupData.pageURL) {
            return;
        }
        // if ( popupData.pageHostname === 'behind-the-scene' && !popupData.advancedUserEnabled ) {
        //     return;
        // }

        messager.send({
            what: 'toggleNetFiltering',
            url: popupData.pageURL,
            scope: ev.ctrlKey || ev.metaKey ? 'page' : '',
            state: uiComp.switch.checked,
            tabId: popupData.tabId
        });

        hashFromPopupData();
    };

    /******************************************************************************/

    var gotoURL = function (ev) {
        if (this.hasAttribute('href') === false) {
            return;
        }

        ev.preventDefault();

        messager.send({
            what: 'gotoURL',
            details: {
                url: this.getAttribute('href'),
                select: true,
                index: -1
            }
        });

        vAPI.closePopup();
    };

    /******************************************************************************/
    // Poll for changes.
    //
    // I couldn't find a better way to be notified of changes which can affect
    // popup content, as the messaging API doesn't support firing events accurately
    // from the main extension process to a specific auxiliary extension process:
    //
    // - broadcasting() is not an option given there could be a lot of tabs opened,
    //   and maybe even many frames within these tabs, i.e. unacceptable overhead
    //   regardless of whether the popup is opened or not.
    //
    // - Modifying the messaging API is not an option, as this would require
    //   revisiting all platform-specific code to support targeted broadcasting,
    //   which who knows could be not so trivial for some platforms.
    //
    // A well done polling is a better anyways IMO, I prefer that data is pulled
    // on demand rather than forcing the main process to assume a client may need
    // it and thus having to push it all the time unconditionally.

    var pollForContentChange = (function () {
        var pollTimer = null;

        var pollCallback = function () {
            pollTimer = null;
            messager.send(
                {
                    what: 'hasPopupContentChanged',
                    tabId: popupData.tabId,
                    contentLastModified: popupData.contentLastModified
                },
                queryCallback
            );
        };

        var queryCallback = function (response) {
            if (response) {
                getPopupData(popupData.tabId);
                return;
            }
            poll();
        };

        var poll = function () {
            if (pollTimer !== null) {
                return;
            }
            pollTimer = setTimeout(pollCallback, 1500);
        };

        return poll;
    })();

    /******************************************************************************/

    var getPopupData = function (tabId) {
        var onDataReceived = function (response) {
            cachePopupData(response);
            renderPopup();
            hashFromPopupData(true);
            pollForContentChange();

            // Enable animation for switch 
            setTimeout(function () {
                var switchHolder = document.getElementById('switch-holder');
                switchHolder.classList.add('animate');
            }, 100);
        };
        messager.send({ what: 'getPopupData', tabId: tabId }, onDataReceived);
    };

    // TODO:
    // var redirectToReviewPage = function() {
    //     if(vAPI.browserInfo.flavor == 'Chrome')
    //         window.open('https://chrome.google.com/webstore/detail/awax-ad-blocker/'+ location.host +'/reviews', '_blank');
    //     else if(vAPI.browserInfo.flavor == 'Firefox') 
    //         window.open('https://addons.mozilla.org/en-US/firefox/addon/awax/', '_blank');
    // }

    var getAWAXSettings = function () {
        var onDataReceived = function (response) {
            userData = response;
            renderPopupAwax();
        };
        messager.send({ what: 'getAWAXSettings' }, onDataReceived);
    }

    var setExtKey = function () {
        var onDataReceived = function (response) {
            renderAfterInput = true;
            if (response.ck) {
                userData = response;
                userData.vk = userData.vk.substring(0, 4) + ' ' + userData.vk.substring(4, 8) + ' ' + userData.vk.substring(8);
                delete userData.ck;
                uiComp.keyHolder.classList.add('ok-input');
                setVisible(uiComp.okMsg, true);
                setVisible(uiComp.errorMsg, false);
                setVisible(uiComp.progress, false);
                setVisible(uiComp.trialPeriod, false);
                setVisible(uiComp.validPeriod, true);
                uiComp.switch.checked = true;
            } else {
                uiComp.keyHolder.classList.add('error-input');
                userData.badKey = true;
                userData.errorMsg = response.msg;
            }
            renderPopupAwax();
            renderAfterInput = false;
        };
        var keyWOSpace = uiComp.key.value.replace(/[^0-9.]/g, '');
        userData.vk = uiComp.key.value;

        setVisible(uiComp.send, false);
        setVisible(uiComp.progress, true);
        uiComp.key.disabled = true;

        setTimeout(function () {
            messager.send({ what: 'setExtKey', key: keyWOSpace }, onDataReceived);
        }, 300);
    }

    /******************************************************************************/
    var clickBuy = function (ev) {
        ev.preventDefault();

        messager.send({
            what: 'gotoURL',
            details: {
                url: 'https://awaxtech.com/#shop', // TODO: url?
                select: true,
                index: -1
            }
        });

        vAPI.closePopup();
    };

    /******************************************************************************/

    var expandedElements = [
        { arrow: '#activation-arrow', block: '#activation-block-input-key' },
        { arrow: '#info-arrow', block: '#info-block-content' }
    ];

    var toggleVisible = function (arrow, block, open) {
        uDom(block).toggleClass('block-hide', !open);
        uDom(arrow).toggleClass('arrow-down', !open);
    }

    var clickToggleVisible = function (active) {
        var toVisible = uDom(active).hasClass('arrow-down');
        expandedElements.forEach(function (item) {
            toggleVisible(item.arrow, item.block, item.arrow === active ? toVisible : false);
        });

        uDom('body').toggleClass('expand600', toVisible);
        return toVisible;
    }

    var clickActivation = function (ev) {
        var isOpen = clickToggleVisible(expandedElements[0].arrow);
        if (!isOpen) {
            setVisible(uiComp.okMsg, false);
            setVisible(uiComp.errorMsg, false);
            uiComp.keyHolder.classList.remove('ok-input');
        };

        ev.stopPropagation();
        ev.preventDefault();
        if (isOpen && !uiComp.isKeyInit) {
            uiComp.isKeyInit = true;
            uiComp.key = initInputKey(uiComp.keyHolder);
        }
    }

    var clickAbout = function (ev) {
        clickToggleVisible(expandedElements[1].arrow);
        ev.stopPropagation();
        ev.preventDefault();
    }

    /******************************************************************************/
    // Input field
    var initInputKey = function (holder) {

        // make 
        var digitsBg = document.createElement('div');
        digitsBg.classList.add('digits-bs-holder');
        holder.appendChild(digitsBg);
        for (var i = 0; i < codeLength; i++) {
            var digitBg = document.createElement('div');
            digitBg.id = 'd' + i;
            digitBg.classList.add('digit-bg', 'digit-bg-dot');
            digitBg.innerText = '8';
            digitsBg.appendChild(digitBg);
            if ([3, 7].includes(i)) {
                var digitsSpace = document.createElement('div');
                digitsSpace.classList.add('digit-bg-space');
                digitsSpace.innerHTML = '&nbsp;';
                digitsBg.appendChild(digitsSpace);
            }

        }
        var inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        var input = document.createElement('input');
        input.id = 'activation-input';
        input.classList.add('transparent-input');
        input.maxLength = codeLength + 2; // 2 space
        inputWrapper.appendChild(input);
        var r = digitsBg.getBoundingClientRect();
        inputWrapper.style.left = digitsBg.offsetLeft + 'px';
        // inputWrapper.style.top = r.top + 'px';
        inputWrapper.style.width = (r.width + 3) + 'px';
        holder.appendChild(inputWrapper);

        // display value and dots
        var display = function (value) {
            var gudKey = value.replace(/[^0-9.]/g, '');
            // hide dot
            for (var i = 0; i < codeLength; i++) {
                var digitBg = document.getElementById('d' + i);
                digitBg.classList.toggle('digit-bg-dot', i > (gudKey.length - 1));
            }
            // show "send" button
            setVisible(uiComp.send, gudKey.length === codeLength);

            // add space
            [4, 9].forEach(function (numPos) {
                if (gudKey.length > numPos) gudKey = gudKey.slice(0, numPos) + ' ' + gudKey.slice(numPos);
            })
            // modify input value
            if (gudKey !== value) {
                var selPos = input.selectionStart;
                var needPos = selPos < value.length;
                input.value = gudKey;
                if (needPos) {
                    input.setSelectionRange(selPos, selPos);
                }
            }
        }

        // Init value
        if (userData.vk) {
            display(userData.vk);
            setVisible(uiComp.send, false);
        }

        input.oninput = function (ev) {
            uiComp.keyHolder.classList.remove('error-input', 'ok-input');
            setVisible(uiComp.errorMsg, false);
            setVisible(uiComp.okMsg, false);
            display(ev.target.value);
        }

        input.onchange = function (ev) {
            if (input.value.length === (codeLength + 2)) {
                setExtKey();
            }
        }

        return input;
    }

    /******************************************************************************/

    // Make menu only when popup html is fully loaded

    uDom.onLoad(function () {
        var tabId = null; //If there's no tab ID specified in the query string, it will default to current tab.

        // Extract the tab id of the page this popup is for
        var matches = window.location && window.location.search.match(/[\?&]tabId=([^&]+)/);
        if (matches && matches.length === 2) {
            tabId = matches[1];
        }

        getPopupData(tabId);
        getAWAXSettings();

        uDom('#site-link').on('click', gotoURL);

        uDom('#activation-block__header').on('click', clickActivation);
        uDom('#info-block__header').on('click', clickAbout);

        uiComp.buyButton = document.getElementById('buy-button');
        uiComp.buyButton.onclick = clickBuy;

        uiComp.switch = document.getElementById('switch');
        uiComp.switch.onchange = toggleNetFilteringSwitch;

        uiComp.keyHolder = document.getElementById('input-key');
        uiComp.send = document.getElementById('activation-send');
        uiComp.send.onclick = setExtKey;

        uiComp.progress = document.getElementById('progress-input');
        uiComp.errorMsg = document.getElementById('error-msg');
        uiComp.okMsg = document.getElementById('ok-msg');

        uiComp.trialPeriod = document.getElementById('trial-period');
        uiComp.periodDig = document.getElementById('period-dig');
        uiComp.periodIcon = document.getElementById('period-icon');
        uiComp.periodType = document.getElementById('period-type');
        uiComp.arrowBuy = document.getElementById('arrow-buy');
        uiComp.validPeriod = document.getElementById('valid-period');
        uiComp.validPeriodTo = document.getElementById('valid-period-to');
        uiComp.validPeriodDate = document.getElementById('valid-period-date');
    });

    /******************************************************************************/

})();
