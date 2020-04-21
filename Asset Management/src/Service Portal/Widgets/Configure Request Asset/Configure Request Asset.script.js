(function() {
	/* populate the 'data' object */
	/* e.g., data.table = $sp.getValue('table'); */
	/*data.assets=[];
	var assetRecords = new GlideRecord('x_445397_assetmana_asset');
	assetRecords.addEncodedQuery("assigned_toDYNAMIC90d1921e5f510100a9ad2572f2b477fe");
	assetRecords.query();
	while (assetRecords.next()) {
		var assetObj = {};

		$sp.getRecordDisplayValues(assetObj, assetRecords, 'category,company,display_name,number,serial_number');
		console.log(assetObj.number);
		data.assets.push(assetObj);
	}
	*/

	var assetid= $sp.getParameter('sys_id');
	
	data.asset={};
	var now= new GlideDate();
	data.today=now.getDisplayValue();
	if(assetid) 
  {
			var assets=new GlideRecord('alm_asset');
			assets.get(assetid);
		  
			$sp.getRecordDisplayValues(data.asset,assets,'asset_tag,ci,display_name,sys_id,model_category');

			gs.info(assets.model_category);

			var modelCategory=new GlideRecord('cmdb_model_category');
			modelCategory.get(assets.model_category);
			if(modelCategory.name=="Charger")
			{
				data.vm=true;
			}
			else
			{
				data.vm=false;
			}
		}
		if(input.action == 'requestAsset')
		{	



			var newRequest = new GlideRecord('sc_request');
			newRequest.newRecord();
			var id = newRequest.insert();
			newRequest.get(id);

			/*var newRequestItem=new GlideRecord('sc_req_item');
					newRequestItem.newRecord();
					var idItem = newRequestItem.insert();

					newRequestItem.request=id;
					newRequestItem.update();
					*/
			if(input.userId!=" ")
			{
				var userRecord = new GlideRecord('sys_user');
				userRecord.query();
				gs.info(input.userId);
				userRecord.get(input.userId);
				newRequest.assigned_to= userRecord.getUniqueValue();
				newRequest.request_state="requested";	
				gs.info("hiiii "+userRecord.getUniqueValue());
			}
			else
			{
				newRequest.request_state="in_process";
			}

			var company= new GlideRecord('core_company');
			company.addQuery('name','Crest Data Systems');
			company.query();
			company.next();
			//assetRecord.addQuery('sys_id',input.assetId);


			var asset=new GlideRecord('alm_asset');
			asset.get(input.assetId);
			asset.install_status=2;
		  asset.update();
			//gs.info(input.assetId);
			//asset.request_line=idItem;
			//asset.update();

			//gs.info(assetRecord.getElement());
			//newPro.category=assetRecord.category;
			newRequest.company=company.getUniqueValue();
			newRequest.description=input.description;
			newRequest.cmdb_ci=asset.ci;

			newRequest.state=1;
			newRequest.due_date=input.dueDate;
			newRequest.update();



			//$sp.getRecordDisplayValues(data.asset,assets,'asset_tag,ci,display_name,sys_id');

		}
	
})();
