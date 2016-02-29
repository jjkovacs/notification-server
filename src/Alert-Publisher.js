function AlertPublisher(ws, subscriberCache) {
	var self = this,
		_ws, 
		_subscriberCache,
		_onClose;
	
	// public methods
	
	self.onClose = onClose;
	
	// "constructor" of sorts
	
	(function init() {
		_ws = ws;
		_subscriberCache = subscriberCache;
		
		_ws.on('message', handleMessage);
		_ws.on('close', closeUpShop);
	})();
	
	// private implementation
	
	function onClose(callback) {
		if(typeof callback !== 'function') {
			return;
		}
		
		_onClose = callback;
	}
	
	function handleMessage(m) {
		var message = JSON.parse(m);
		
		switch(message.command) {
			case 'publish':
				publish(message.vins, message.data);
				break;
			default:
				break;
		}
	}
	
	function closeUpShop() {
		if(_onClose) {
			_onClose();
		}
	}
	
	function publish(vins, data) {
		for(var key in _subscriberCache) {
			var subscriber = _subscriberCache[key];
			
			if(vins.indexOf(subscriber.getVin()) !== -1) {
				subscriber.send(JSON.stringify({data: data}));
			}
		}
	}
}

module.exports = AlertPublisher;