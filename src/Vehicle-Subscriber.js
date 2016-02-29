function VehicleSubscriber(ws, vin) {
	var self = this,
		_ws, 
		_vin,
		_onClose;
	
	// public methods
	
	self.getVin = getVin;
	self.send = send;
	self.onClose = onClose;
	
	// "constructor" of sorts
	
	(function init() {
		_ws = ws;
		_vin = vin;
		
		_ws.on('message', handleMessage);
		_ws.on('close', closeUpShop);
	})();
	
	// private implementation
	
	function getVin() {
		return _vin;
	}
	
	function send(data) {
		_ws.send(data);
	}
	
	function onClose(callback) {
		if(typeof callback !== 'function') {
			return;
		}
		
		_onClose = callback;
	}
	
	function handleMessage(message) {
		console.log(self.getVin(), message);
	}
	
	function closeUpShop() {
		if(_onClose) {
			_onClose();
		}
	}
}

module.exports = VehicleSubscriber;