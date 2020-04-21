function($rootScope,$scope,$window) {
  /* widget controller */
  var c = this;
	$rootScope.$on('explore',function(event,data)
						{
					c.server.get({
						action:'getAssets',
						category:data
					}).then(function(r){
						c.data.items=r.data.items;
						
						
					});	
	});
	
	c.select =function(assetId)
	{
			$window.location.href="/asm?id=make_request&table=sc_request&sys_id="+assetId;

	}
	
	c.assetdetails = function(item)
	{
		$window.location="https://dev65519.service-now.com/asm?id=asset_ticket_page&sys_id="+item.sys_id;
	}
}