function($scope,$rootScope) {
  
  var c = this;
	
	c.explore=function(category)
	{
		console.log(category);
		$rootScope.$emit("explore",category);
	}
}