/*
 Created		: Dec 2, 2017, 5:42:20 PM
 Author		: Aaron E-J <the at otherrealm.org>
 Copyright(C): 2020 Other Realm LLC
 This program is free software: you can redistribute it and/or modify
 it under the terms of the latest version of the GNU Affero General Public License as published by
 the Free Software Foundation, using at least version 3.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 GNU Affero General Public License for more details: 
 <http://www.gnu.org/licenses/>.
 */
/* global chrome, top, self */
(function () {
	console.log(window);
	var selObj = '';
	selObj = window.getSelection();
	var nOfLookups = 0;
	var ks = [];
	const arrayCompare = f => ([x, ...xs]) => ([y, ...ys]) => x === undefined && y === undefined ? true : Boolean(f(x)(y)) && arrayCompare(f)(xs)(ys);
	const aMatch = typed => stored => typed == stored;
	const arrayAMatch = arrayCompare(aMatch);
	var rightKeys = [];
	var options = chrome.storage.sync.get('options', function (opt) {
		if (Object.keys(opt).length === 0 && opt.constructor === Object) {
			resetShortcut();
		}
		opt.options.forEach((obj) => {
			rightKeys[obj.name] = obj.shortcut.split('+');
			rightKeys[obj.name].forEach((srtcut) => {
				if (srtcut == "Ctrl") {
					rightKeys[obj.name][srtcut] = "Control";
				}
			});
		});
	});
	function error(e) {
		console.log(e, "error");
	}
	$(document).keydown(function (e) {
		console.log(window.getSelection());
		// console.log(e.code,e);
		if (!ks.includes(e.code)) {
			ks.push(e.code);
		}
		if (arrayAMatch(rightKeys['getSelectedPedia'])(ks)) {
			getSelectedPedia();
		}
		else if (arrayAMatch(rightKeys['getSelectedTionary'])(ks)) {
			getSelectedTionary();
		}
		else if (arrayAMatch(rightKeys['removeSelected'])(ks)) {
			closeWiki();
		}
	})
	$(document).keyup(function (e) {
		ks.pop();
	});
	var getSelectedPedia = function (c) {
		selObj = c ? c : window.getSelection();
		console.log(selObj);
		nOfLookups++;
		$('.wikiWrapper').append('<div class="wikiAddonDivRap" id="' + nOfLookups + '" style="position: fixed;  top:' + (nOfLookups * 10) + 'px;left:' + (nOfLookups * 10) + 'px"">' +
			'<div class="btnForTheAddon btn-large IconBtnForTheAddon" type="button" style="padding: 5px;font-family: Arial, Helvetica, sans-serif; font-size: 30px;" id="moveIconBtn"> + </div>' +
			'<a href="#" id="closeWikiBtn"><div type="button" class="btnForTheAddon removeIconBtn btn-large IconBtnForTheAddon" style="padding: 5px; font-size: 25px;font-family: Arial, Helvetica, sans-serif;" id="removeIconBtn"> x </div></a>' +
			'<iframe id="wikiFrameContent" allow-top-navigation style="" src="https://en.wikipedia.org/wiki/Special:Search/' + selObj + '"></iframe>' +
			'</div>');
		$(function () {
			$(".wikiAddonDivRap").draggable();
			$(".wikiAddonDivRap").resizable();
			$('.removeIconBtn').click(function () {
				closeWiki();
			});
		});
	};
	var getSelectedTionary = function (c) {
		selObj = c ? c : window.getSelection();
		nOfLookups++;
		$('.wikiWrapper').append('<div class="wikiAddonDivRap" id="' + nOfLookups + '" style="position: fixed;  top:' + nOfLookups * 10 + 'px;left:' + nOfLookups * 10 + 'px"">' +
			'<div class="btnForTheAddon btn-large IconBtnForTheAddon" type="button" style="padding: 5px;font-family: Arial, Helvetica, sans-serif; font-size: 30px;" id="moveIconBtn"> + </div>' +
			'<a href="#" id="closeWikiBtn"><div type="button" class="btnForTheAddon removeIconBtn btn-large IconBtnForTheAddon" style="padding: 5px; font-size: 25px;font-family: Arial, Helvetica, sans-serif;" id="removeIconBtn"> x </div></a>' +
			'<iframe id="wikiFrameContent" allow-top-navigation style="" src="https://en.wiktionary.org/wiki/Special:Search/' + selObj + '"></iframe>' +
			'</div>');
		$(function () {
			$(".wikiAddonDivRap").draggable();
			$(".wikiAddonDivRap").resizable();
			$('.removeIconBtn').click(function () {
				closeWiki();
			});
		});
	};
	$('body').prepend('<div id="wikiWrap" class="wikiWrapper"></div>');
	function getPdfSelectedText() {
		console.log('getPdfSelectedText');
		return new Promise(resolve => {
			window.addEventListener('message', function onMessage(e) {
				if (e.origin === 'chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai' &&
					e.data && e.data.type === 'getSelectedTextReply') {
					console.log($('embed'));
					console.log(e.data.selectedText);
					window.removeEventListener('message', onMessage);
					resolve(e.data.selectedText);
				}
			});
			// console.log($('embed')[0].type);
			if ($('embed')[0] !== undefined) {
				if ($('embed')[0].type == 'application/pdf') {
					const script = document.createElement('script');
					document.documentElement.appendChild(script).text =
						"document.querySelector('embed').postMessage({type: 'getSelectedText'}, '*')";
					console.log(script);
					script.remove();
				}
			} else {
				resolve(window.getSelection());
			}
		});
	}
	// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	// 	console.log(msg, sender, sendResponse);
	// 	if (msg === 'getPdfSelection') {
	// 		getPdfSelectedText().then((selected) => { getSelectedPedia(selected) });
	// 		return true;
	// 	}
	// });
	//handle menu button pressing
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (document.activeElement) {
				if (request.wiki === "getSelectedPedia") {
					console.log(request, sender.origin, sendResponse.origin)
					getPdfSelectedText().then((selected) => { getSelectedPedia(selected) });
				}
				if (request.wiki === "getSelectedTionary") {
					getSelectedTionary();
				}
				if (request.wiki === "closeWiki") {
					closeWiki();
				}
			}
		});
	//remove the iframe when the key combinations are pressed or the 'X' button is pressed
	window.addEventListener("message", closeWiki, false);
	addEventListener('message', function (e) {
		if (e.data === 'closeWiki') {
			closeWiki();
		}
	});
	var closeWiki = function (c) {
		if ($('.wikiWrapper>*').length <= 0) {
			parent.postMessage('closeWiki', '*');
		} else {
			$('.wikiWrapper #' + nOfLookups + ' *').parent().remove();
			nOfLookups--;
		}
	};
})(jQuery);