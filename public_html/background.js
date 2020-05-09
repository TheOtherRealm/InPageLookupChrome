/*
 Created		: Dec 2, 2017, 5:42:20 PM
 Author		: Aaron E-J <the at otherrealm.org>
 Copyright(C): 2020 Aaron E-J
 This program is free software: you can redistribute it and/or modify
 it under the terms of the latest version of the GNU Affero General Public License as published by
 the Free Software Foundation, using at least version 3.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 GNU Affero General Public License for more details: 
 <http://www.gnu.org/licenses/>.
 */
/* global browser */
/** 
 * Create event listeners to log things happening
 */
function onCreated() {
	if (browser.runtime.lastError) {
		console.log(`Error: ${browser.runtime.lastError}`);
	} else {
		console.log("Lookup div created successfully");
	}
}
function onRemoved() {
	console.log("Lookup prototype div removed successfully");
}
function onError(error) {
	console.log(`Error: ${error}`);
}
/**
 * Create the menu items
 */
browser.menus.create({
	id: "getSelectedPedia",
	title: "Search Wikipedia",
	contexts: ["all"]
}, onCreated);
browser.menus.create({
	id: "getSelectedTionary",
	title: "Search Wiktionary",
	contexts: ["all"]
}, onCreated);
/**
 * Give actions to menu items so that they create the iframes and pass relevent data to the page
 */
var openWiki = function (frameId, wiki) {
	browser.tabs.query({ active: true, lastFocusedWindow: true, currentWindow: true }, function (tabs) {
		browser.tabs.sendMessage(tabs[0].id, { wiki: wiki, frameId: frameId, tabId: tabs[0].id }, { frameId: frameId });
	});
};
/** 
 * The click event listener, where we perform the appropriate action given the ID of the menu item that was clicked.
 */
browser.menus.onClicked.addListener((info, tab) => {
	wikipedia(info);
});
var wikipedia = function (info) {
	switch (info.menuItemId) {
		case "getSelectedPedia":
			openWiki(info.frameId, 'getSelectedPedia');
			break;
		case "getSelectedTionary":
			openWiki(info.frameId, 'getSelectedTionary');
			break;
	}
};