'use strict';

module.exports = function LightsService() {

	function _switchOnHeadLights() {
        //console.log('Head lights on');
	} 
	function _switchOffHeadLights() {
        //console.log('Head lights off');
	}
	return {
		switchOnHeadLights : _switchOnHeadLights,
		switchOffHeadLights : _switchOffHeadLights
	};
};
