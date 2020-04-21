function($scope,$window) {
  /* widget controller */
  var c = this;
	c.data.user={};
c.data.user.user_name="";
c.data.user.id=" ";	
	c.data.userId=" ";
	c.request =function()
	{
	 
		c.server.get({
			action: 'requestAsset',
			userId : c.data.userId,
			assetId:c.data.asset.sys_id,
			description : c.data.description,
			dueDate : c.data.duedate
		}).then(function(r) {
			alert( "Request Sent Successfully" );
      $window.location="https://dev65519.service-now.com/asm?id=homepage_employee";
		});
		
	}

	$scope.userObj = {

       displayValue: c.data.user.user_name,

       value: c.data.user.id,

       name: 'userObj'

};
/*$rootScope.$on('assetSelected', function(event,data) {
	//	c.data.notes.splice(c.notePos, 1);
	console.log("here "+data);
	c.server.get({
		action:'setAsset',
		AssetId:data
	}).then(function(r)
				 {
		c.data.asset=r.data.asset;
		c.data.vm=r.data.vm;
	});
	
	
	});*/
	// Re
$scope.$on("field.change", function(evt, parms) {

       if (parms.field.name == 'userObj')

               c.data.userId = parms.newValue;
	

       console.log("here " + c.data.userId);

      /* c.server.update().then(function(response) {         

               spUtil.update($scope);

       })
*/
});
}
