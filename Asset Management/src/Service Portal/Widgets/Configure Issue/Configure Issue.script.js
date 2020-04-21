(function() {
  /* populate the 'data' object */
  /* e.g., data.table = $sp.getValue('table'); */
	data.assets=[];
	var assetRecords = new GlideRecord('alm_asset');
	assetRecords.addEncodedQuery("assigned_toDYNAMIC90d1921e5f510100a9ad2572f2b477fe^company=2ccbea97db03001091f67a61399619c0");
	assetRecords.query();
	while (assetRecords.next()) {
		var assetObj = {};
			
		$sp.getRecordDisplayValues(assetObj, assetRecords, 'sys_id,category,company,display_name,number,serial_number');
		console.log(assetObj.number);
		data.assets.push(assetObj);
	}
	

	var now= new GlideDate();
	data.today=now.getDisplayValue();
	if(input)
		{
			
			if(input.action == 'reportPro')
				{	
					var newIncident = new GlideRecord('incident');
					newIncident.newRecord();
					var id = newIncident.insert();
					newIncident.get(id);
					
					var assetRecord = new GlideRecord('alm_asset');
					assetRecord.query();
					assetRecord.get(input.assetId);
					
					var configurationItems=new GlideRecord('cmdb_ci');
					configurationItems.addQuery('asset',assetRecord.getUniqueValue());
					configurationItems.query();
					if(configurationItems.next())
					{
							newIncident.cmdb_ci=configurationItems.getUniqueValue();
					}
					//assetRecord.addQuery('sys_id',input.assetId);
					var company= new GlideRecord('core_company');
					company.addQuery('name','Crest Data Systems');
					company.query();
					company.next();
					//assetRecord.addQuery('sys_id',input.assetId);
					
					//gs.info(assetRecord.getElement());
					//newPro.category=assetRecord.category;
					newIncident.company=company.getUniqueValue();

					//gs.info(assetRecord.getElement());
					//newPro.category=assetRecord.category;
					newIncident.category=input.category;
					newIncident.short_description=input.description;
					newIncident.urgency=input.urgency;
					newIncident.description="not working : "+assetRecord.display_name;
					newIncident.state=1;
					newIncident.incident_state=1;
					newIncident.due_date=input.dueDate;
					newIncident.caller_id=gs.getUser().getID();
					newIncident.update();
					data.message="Your Issue is reported successfully!!";
				}
		}
})();
