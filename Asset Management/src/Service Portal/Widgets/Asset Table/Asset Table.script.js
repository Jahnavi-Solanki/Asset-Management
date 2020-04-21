(function() {
	if (!input) // asynch load list
		return;

	data.msg = {};
	data.msg.sortingByAsc = gs.getMessage("Sorting by ascending");
	data.msg.sortingByDesc = gs.getMessage("Sorting by descending");

	
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

	
	data.role="";
	if(gs.hasRole('x_445396_asset_man.employee'))
	{
		data.role="employee";
		data.filter = 'assigned_toDYNAMIC90d1921e5f510100a9ad2572f2b477fe^company=2ccbea97db03001091f67a61399619c0';
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
	data.title = input.headerTitle;
	data.view = data.view || 'mobile';
	data.table = data.table || $sp.getValue('table');
	//data.filter = data.filter || $sp.getValue('filter');
	data.keywords = data.keywords || $sp.getValue('keywords');
	data.p = data.p || $sp.getValue('p') || 1;
	data.p = parseInt(data.p);
	data.o = data.o || $sp.getValue('o') || $sp.getValue('order_by');
	data.d = data.d || $sp.getValue('d') || $sp.getValue('order_direction');
	
	data.page_index = data.p - 1;
	//data.show_new = data.show_new || options.show_new;
	var windowSize = data.window_size || $sp.getValue('maximum_entries') || 20;
	windowSize = parseInt(windowSize);
	if (isNaN(windowSize) || windowSize < 1)
		windowSize = 20;
	data.window_size = windowSize;

	var gr;
	if (gs.getProperty("glide.security.ui.filter") == "true"){ //|| GlideTableDescriptor.get(data.table).getED().hasAttribute("glide.security.ui.filter")) {
		gr = new FilteredGlideRecord(data.table);
		gr.applyRowSecurity();
	} else
		gr = new GlideRecordSecure(data.table);
	if (!gr.isValid()) {
		data.invalid_table = true;
		data.table_label = data.table;
		return;
	}

 	data.table_label = gr.getLabel();
	
	data.table_plural="Asset";
	data.hasTextIndex = $sp.hasTextIndex(data.table);
	if (data.filter) {
		if (data.filterACLs)
			gr = $sp.addQueryString(gr, data.filter);
		else
			gr.addEncodedQuery(data.filter);
	}
	
	data.filter = gr.getEncodedQuery();

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

	// use GlideRecord to get field labels vs. GlideRecordSecure
	var grForLabels = new GlideRecord(data.table);
	for (var i in data.fields_array) {
		var field = data.fields_array[i];
		var ge = grForLabels.getElement(field);
		if (ge == null)
			continue;

		data.column_labels[field] = ge.getLabel();
	}

	data.list = [];
	while (gr._next()) {
		var record = {};
		$sp.getRecordElements(record, gr, data.fields);
	
		record.sys_id = gr.getValue('sys_id');
		record.targetTable = gr.getRecordClassName();
		data.list.push(record);
	}


	function optCopy(names) {
		names.forEach(function(name) {
			data[name] = input[name] || options[name];
		})
	}

})();