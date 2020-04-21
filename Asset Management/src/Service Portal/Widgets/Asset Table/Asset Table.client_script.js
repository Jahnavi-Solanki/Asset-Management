function ($scope, $location, $window, spUtil, amb, $http, spAriaUtil, $timeout, spNavStateManager) {
	var c = this;
	

	$scope.exportTypes = [{label:'PDF', value: 'PDF'}, {label:'Excel', value:'EXCEL'}, {label:'CSV', value:'CSV'}];
	var keys = ['table', 'filter', 'p', 'o', 'd'];

	var eventNames = {
		click: 'data_table.click',
		setFilter: 'data_table.setFilter',
		setKeywords: 'data_table.setKeywords'
	};

	$scope.go = function(table, item) {
	$window.location="https://dev65519.service-now.com/asm?id=asset_ticket_page&sys_id="+item.sys_id;
	
	};

	

	function recoverStateFromUrl() {
		$scope.data.fields = [];
		var s = $location.search();
		for (var x in keys) {
			if (s[keys[x]]) {
				$scope.data[keys[x]] = s[keys[x]];
			}
		}
		$scope.server.update().then(function(data) {
			if (s.sys_id) {
				for (var x in data.list) {
					if (data.list[x].sys_id == s.sys_id) {
						$scope.go(s.table, data.list[x]);
					}
				}
			}
		});
	}

	if ($scope.options.fromUrl) {
		var origSearch = $location.search();
		$scope.$on('$locationChangeSuccess', function(e) {
			var s = $location.search();
			if (origSearch.id !== s.id)
				return;

			if ($scope.ignoreLocationChange){
				$scope.ignoreLocationChange = false;
				return;
			}

			// Helps to recover state when using the browser's back button
			recoverStateFromUrl();
		});
	}


	$scope.getNumber = function(num) {
		return new Array(num);
	}

	$scope.mathMin = function(v1,v2) {
		return Math.min(v1,v2);
	}

	

	function setPermalink(table, filter, orderBy, orderDirection, page){
		$scope.ignoreLocationChange = true;
		var search = $location.search();
		angular.extend(search, {
			spa: 1,
			table: table,
			filter: filter,
			p: page,
			o: orderBy,
			d: orderDirection
		});
		$location.search(search);
	}

	var watcher;
	function initRecordWatcher(table, filter){
		if (watcher)
			watcher.unsubscribe();

		if (table && filter) {
			var watcherChannel = amb.getChannelRW(table, filter);
			amb.connect();
			watcher = watcherChannel.subscribe(function(message) {
				if (!message.data)
					return;
				switch(message.data.action) {
					case "change":
						updateRowFromRW(message);
						break;
					case "exit":
						// A record was removed
					case "enter":
						// A record was added
					default:
						spUtil.update($scope);
						break;
				}
			});
		}
	}

	function updateRowFromRW(message) {
		if (message.data && message.data.sys_id && $scope.data.list) {
			var row, field;
			for(var i=0;i<$scope.data.list.length; i++) {
				row = $scope.data.list[i];
				if (row.sys_id == message.data.sys_id) {
					var fields = Object.getOwnPropertyNames(message.data.record);
					for(var f in fields) {
						field = fields[f];
						if(typeof row[field] !== 'undefined') {
						    row[field].display_value = message.data.record[field].display_value;
						}
					}
				}
			}
		}
	}

	$scope.$on('$destroy', function() {
		if (watcher)
			watcher.unsubscribe();
	});

	$scope.setPageNum = function(num) {
		$scope.data.p = num;
		getData(true);
		$timeout(function() {
			$scope.focusOnTableHeader();
		});
	}

	$scope.setOrderBy = function(field) {
		var d = "asc";
		if ($scope.data.o == field) {
			if ($scope.data.d == "asc")
				d = "desc";
			else
				d = "asc";
		}

		if (d === "asc") {
			spAriaUtil.sendLiveMessage($scope.data.msg.sortingByAsc);
		} else if (d === "desc") {
			spAriaUtil.sendLiveMessage($scope.data.msg.sortingByDesc);
		}

		$scope.data.o = field;
		$scope.data.d = d;
	
	}


	


	// Makes Widget Async
	$scope.data = $scope.options;
	$scope.loadingData = true;
	$scope.server.update().then(function() {
		if ($scope.data.newButtonUnsupported)
			console.log("Service Portal: New button not supported for sys_attachment list");
		$scope.loadingData = false;
		initRecordWatcher($scope.data.table, $scope.data.filter);
	});

}