(function() {
	if (!input) // asynch load list
		return;

	data.role="";
	if(gs.hasRole('x_445396_asset_man.employee'))
	{
		data.role="employee";
		data.filter = 'company=2ccbea97db03001091f67a61399619c0';
	}
	else if(gs.hasRole('x_445396_asset_man.IT'))
	{
		data.role="IT";
		data.filter = 'company=2ccbea97db03001091f67a61399619c0';//data.filter || $sp.getValue('filter');
	}
	else
	{
		gs.info('hiiiiiiiiii');
		data.role="PMO";	
		data.filter = 'company=2ccbea97db03001091f67a61399619c0';//^assigned_toDYNAMIC90d1921e5f510100a9ad2572f2b477fe^request_state=requested';//data.filter || $sp.getValue('filter');
	}

	//gs.info(role);
	data.assetstate=0;
	if(input.action=="assignAsset")
	{
	
		var requests=new GlideRecord('sc_request');
		  requests.get(input.recordId);
			requests.request_state="closed_complete";
		  requests.update();
			 
			gs.info("oookkkk");
			gs.info(input.AssetId);
		
			var assets = new GlideRecord('alm_asset');
			assets.get(input.AssetId);
			assets.assigned_to=requests.requested_for;
			assets.install_status=1;
			assets.update();
		 
		
	}
	if(input.action=="rejectRequest")
	{
	
		var requests=new GlideRecord('sc_request');
		  requests.get(input.recordId);
			requests.request_state="closed_reject";
		  requests.update();
		 
		
	}
	if(input.action=="approveRequest")
	{

		var requestRecord=new GlideRecord('sc_request');


		requestRecord.get(input.recordId);

		if(requestRecord)
		{
			requestRecord.request_state="in_process";
			requestRecord.update();
		}

	}
	if(input.action=="rejectRequest")
	{

		var requestRecords=new GlideRecord('sc_request');

		//incidentRecord.query();
		requestRecords.get(input.recordId);
		if(requestRecords)
		{
			requestRecords.request_state="closed_rejected";
			requestRecords.update();
		}

	}

	data.msg = {};
	data.msg.sortingByAsc = gs.getMessage("Sorting by ascending");
	data.msg.sortingByDesc = gs.getMessage("Sorting by descending");

	/*
	 * data.table = the table
	 * data.p = the current page starting at 1
	 * data.o = the order by column
	 * data.d = the order by direction
	 * data.keywords = the keyword search term
	 * data.list = the table data as an array
	 * data.invalid_table = true if table is invalid or if data was not succesfully fetched
	 * data.table_label = the table's display name. e.g. Incident
	 * data.table_plural = the table's plural display name. e.g. Incidents
	 * data.fields = a comma delimited list of field names to show in the data table
	 * data.column_labels = a map of field name -> display name
	 * data.window_size = the number of rows to show
	 * data.filter = the encoded query
	 */
	// copy to data[name] from input[name] || option[name]
	optCopy(['table', 'p', 'o', 'd', 'filter', 'filterACLs', 'fields', 'keywords', 'view']);
	optCopy(['relationship_id', 'apply_to', 'apply_to_sys_id', 'window_size']);
	if (!data.table) {
		data.invalid_table = true;
		data.table_label = "";
		return;
	}

	if (!data.fields) {
		if (data.view)
			data.fields = $sp.getListColumns(data.table, data.view);
		else
			data.fields = $sp.getListColumns(data.table);
	}

	data.title = input.headerTitle || "Requests";
	data.view = data.view || 'mobile';
	data.table = data.table || $sp.getValue('table');
	
	if(gs.hasRole('x_445396_asset_man.employee'))
	{
		data.role="employee";
		data.filter = 'company=2ccbea97db03001091f67a61399619c0^requested_forDYNAMIC90d1921e5f510100a9ad2572f2b477fe';
	}
	else if(gs.hasRole('x_445396_asset_man.IT'))
	{
		data.role="IT";
		data.filter = 'company=2ccbea97db03001091f67a61399619c0';//data.filter || $sp.getValue('filter');
	}
	else
	{
		data.role="PMO";	
		data.filter = 'company=2ccbea97db03001091f67a61399619c0';//^assigned_toDYNAMIC90d1921e5f510100a9ad2572f2b477fe^request_state=requested';//data.filter || $sp.getValue('filter');
	}
	data.keywords = data.keywords || $sp.getValue('keywords');
	data.p = data.p || $sp.getValue('p') || 1;
	data.p = parseInt(data.p);
	data.o = data.o || $sp.getValue('o') || $sp.getValue('order_by');
	data.d = data.d || $sp.getValue('d') || $sp.getValue('order_direction');
	data.page_index = data.p - 1;
	data.show_new = data.show_new || options.show_new;
	var windowSize = data.window_size || $sp.getValue('maximum_entries') || 20;
	windowSize = parseInt(windowSize);
	if (isNaN(windowSize) || windowSize < 1)
		windowSize = 20;
	data.window_size = windowSize;

	var gr;
	if (gs.getProperty("glide.security.ui.filter") == "true"){// || GlideTableDescriptor.get(data.table).getED().hasAttribute("glide.security.ui.filter")) {
		gr = new FilteredGlideRecord(data.table);
		gr.applyRowSecurity();
	} else
		gr = new GlideRecordSecure(data.table);
	if (!gr.isValid()) {
		data.invalid_table = true;
		data.table_label = data.table;
		return;
	}
	gr=new GlideRecord('sc_request');
	//gr.query();
	data.canCreate = gr.canCreate();
	data.newButtonUnsupported = data.table == "sys_attachment";
	data.table_label = gr.getLabel();
	//data.table_plural = gr.getPlural();
	data.hasTextIndex = $sp.hasTextIndex(data.table);
	
	
	if (data.filter) {
	
		if (data.filterACLs)
			gr = $sp.addQueryString(gr, data.filter);
		else
			gr.addEncodedQuery(data.filter);
	}
	
	if (data.keywords) {
		gr.addQuery('123TEXTQUERY321', data.keywords);
		data.keywords = null;
	}

	//data.filter = gr.getEncodedQuery();

	if (data.relationship_id) {
		var rel = GlideRelationship.get(data.relationship_id);
		var target = new GlideRecord(data.table);
		var applyTo = new GlideRecord(data.apply_to);
		applyTo.get("sys_id", data.apply_to_sys_id);
		rel.queryWith(applyTo, target); // put the relationship query into target
		data.exportQuery = target.getEncodedQuery();
		gr.addEncodedQuery(data.exportQuery); // get the query the relationship made for us
	}
	if (data.exportQuery)
		data.exportQuery += '^' + data.filter;
	else
		data.exportQuery = data.filter;

	if (data.o){
		if (data.d == "asc")
			gr.orderBy(data.o);
		else
			gr.orderByDesc(data.o);
	}

	data.window_start = data.page_index * data.window_size;
	data.window_end = (data.page_index + 1) * data.window_size;
	gr.chooseWindow(data.window_start, data.window_end);
	gr._query();

	data.row_count = gr.getRowCount();
	data.num_pages = Math.ceil(data.row_count / data.window_size);
	data.column_labels = {};
	data.fields_array = data.fields.split(',');

	gs.info(data.fields_array);
	// use GlideRecord to get field labels vs. GlideRecordSecure
	var grForLabels = new GlideRecord(data.table);
	for (var i in data.fields_array) {
		var field = data.fields_array[i];
		var ge = grForLabels.getElement(field);
		if (ge == null)
			continue;

		data.column_labels[field] = ge.getLabel();
	}
	gs.info("oooooooooooooooooooo");
	data.list = [];

	while (gr._next()) {
		//var gr2= new GlideRecord('sc_req_item');
		data.asset={};
		if(gr.cmdb_ci)
		{
			var gr3= new GlideRecord('alm_asset');
			var ci= new GlideRecord('cmdb_ci');
			ci.get(gr.cmdb_ci);

			gr3.addQuery('ci',ci.getUniqueValue());
			gr3.query();
		/*	var gr3=new GlideRecord('alm_asset');
			//gr3.addEncodedQuery('request_line=',gr2.getUniqueValue());
			gr3.addEncodedQuery('ci=',gr.cmdb_ci);
			//gr3.addQuery('ci',gr.cmdb_ci);
			//gr3.addQuery('company','Crest Data Systems');
			gr3.query();*/
			if(gr3.next() )
			{

				$sp.getRecordDisplayValues(data.asset,gr3,'asset_tag,ci,display_name,sys_id');
				gs.info(data.asset.display_name);

			}
		}
		/*gr2.addQuery('request',gr.getUniqueValue());
		gr2.query();
		if(gr2.next())
		{
			gs.info(gr2.number);
			gs.info(gr.number);
			var gr3=new GlideRecord('alm_asset');
			//gr3.addEncodedQuery('request_line=',gr2.getUniqueValue());
			gr3.addQuery('request_line',gr2.getUniqueValue());
			//		gr3.addQuery('company','Crest Data Systems');
			gr3.query();
			if(gr3.next())
			{

				$sp.getRecordDisplayValues(data.asset,gr3,'asset_tag,ci,display_name,sys_id');
				gs.info(data.asset.display_name);

			}
		}*/
		var record = {};
		$sp.getRecordElements(record, gr, data.fields);
		/*if (gr instanceof FilteredGlideRecord) {
			// FilteredGlideRecord doesn't do field-level
			// security, so take care of that here
			for (var f in data.fields_array) {
				var fld = data.fields_array[f];
				if (!gr.isValidField(fld))
					continue;

				if (!gr[fld].canRead()) {
					record[fld].value = null;
					record[fld].display_value = null;
				}
			}
		}*/
		record.asset=getAsset(data.asset);
		record.sys_id = gr.getValue('sys_id');
		record.targetTable = gr.getRecordClassName();
		data.list.push(record);
	}

	function getAsset(asset)
	{
		var f={};
		f.display_value=asset.display_name;
		f.value=asset.sys_id;
		f.state=asset.install_status;
		return f;
	}
	data.enable_filter = (input.enable_filter == true || input.enable_filter == "true" ||
												options.enable_filter == true || options.enable_filter == "true");
	var breadcrumbWidgetParams = {
		table: data.table,
		query: data.filter,
		enable_filter: data.enable_filter
	};
	data.filterBreadcrumbs = $sp.getWidget('widget-filter-breadcrumbs', breadcrumbWidgetParams);

	// copy to data from input or options
	function optCopy(names) {
		names.forEach(function(name) {
			data[name] = input[name] || options[name];
		})
	}

})();