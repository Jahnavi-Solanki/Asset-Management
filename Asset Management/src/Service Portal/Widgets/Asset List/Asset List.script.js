(function(){
	/*  "use strict"; - linter issues */
	// populate the 'data' object
	
	$sp.getValues(data);
	if (data.field_list) {
		data.fields_array = data.field_list.split(',');
	} else {
		data.field_list = $sp.getListColumns(data.table);
	}


	data.page_index = (data.p - 1);
	data.window_size = $sp.getValue('maximum_entries') || 10;
	data.window_start  = (data.page_index * data.window_size);
	data.window_end = (((data.page_index + 1) * data.window_size));
	

	var gr = new GlideRecordSecure(data.table);
	if (!gr.isValid()) {
		data.invalid_table = true;
		data.table_label = data.table;
		return;
	}
	data.table_label = gr.getLabel();
	options.table = data.table;
	options.fields = data.field_list;
	options.window_size=data.window_size;
	options.headerTitle =options.title;
	data.dataTableWidget = $sp.getWidget('asset_table', options);
})();