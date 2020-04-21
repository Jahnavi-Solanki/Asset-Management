//console.log("hii"+data.today);
function($scope,$window) {
  /* widget controller */
  var c = this;
	//c.data.today="done";

	
	c.data.asset={};
  c.data.asset.display_name="";
  c.data.asset.id="";	
	
	c.report =function()
	{
		
		c.server.get({
			action: 'reportPro',
			assetId : c.data.selectedasset,
			urgency : c.data.urgency,
			description : c.data.description,
			dueDate : c.data.duedate,
			category:c.data.category
		}).then(function(r) {
		alert( "Issue Reported Successfully" );
      
			$window.location="https://dev65519.service-now.com/asm?id=homepage_employee";
		});
		
	}

	$scope.assetObj = {

       displayValue: c.data.asset.display_name,

       value: c.data.asset.id,

       name: 'assetObj'

};

$scope.$on("field.change", function(evt, parms) {

       if (parms.field.name == 'assetObj')

               c.data.assetId = parms.newValue;

       //console.log("done");

      /* c.server.update().then(function(response) {         

               spUtil.update($scope);

       })
*/
});
}
