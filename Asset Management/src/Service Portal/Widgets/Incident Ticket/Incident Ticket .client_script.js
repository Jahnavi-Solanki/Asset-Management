function ($scope, spUtil) {
		
	spUtil.recordWatch($scope, $scope.data.table, "sys_id=" + $scope.data.sys_id); 

 var c = this;
	c.data.user={};
c.data.user.user_name="";
c.data.user.id=" ";	
	c.data.userId=" ";
	c.data.state=1;
	
	c.statechanged=function()
	{
		console.log('helloo');
		c.server.get({
			action: 'statechange',
			state: c.data.state
		}).then(function(r) {
			
		});
		
	}

	$scope.userObj = {

       displayValue: c.data.user.user_name,

       value: c.data.user.id,

       name: 'userObj'

};

$scope.$on("field.change", function(evt, parms) {

       if (parms.field.name == 'userObj')

               c.data.userId = parms.newValue;
	

       console.log("here " + c.data.userId);
				c.server.get({
					action: 'assigned',
					userId : c.data.userId
				}).then(function(r) {

				});

      /* c.server.update().then(function(response) {         

               spUtil.update($scope);

       })
*/
});



}