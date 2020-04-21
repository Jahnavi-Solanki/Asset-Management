(function() {
	/* populate the 'data' object */
	/* e.g., data.table = $sp.getValue('table'); */
	if(input && input.action=='getAssets')
	{

		var category=new GlideRecord('cmdb_model_category');
		category.addQuery('name',input.category);
		category.query();
		category.next();
		
		var company=new GlideRecord('core_company');
		company.addQuery('name','Crest Data Systems');
		company.query();
		company.next();
		
		var asset=new GlideRecord('alm_asset');
		asset.addQuery('model_category',category.getUniqueValue());
		asset.addQuery('install_status','6');
		asset.addQuery('company',company.getUniqueValue());
		asset.query();
		data.items=[];
		while(asset.next())
			{
				var record={};
				gs.info("asset "+asset.sys_id);
				$sp.getRecordDisplayValues(record,asset,'asset_tag,ci,display_name,sys_id');
				data.items.push(record);
			}
	}
	
})();