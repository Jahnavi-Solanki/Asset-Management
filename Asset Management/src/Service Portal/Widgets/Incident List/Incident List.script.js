(function(){
	/*  "use strict"; - linter issues */
	// populate the 'data' object
	var sp_page = $sp.getValue('sp_page');
	var pageGR = new GlideRecord('sp_page');
	pageGR.get(sp_page);
	data.page_id = pageGR.getValue("id");
	$sp.getValues(data);
	if (data.field_list) {
		data.fields_array = data.field_list.split(',');
	} else {
		data.field_list = $sp.getListColumns(data.table);
	}

	if (input) {
		data.p = input.p;
		data.o = input.o;
		data.d = input.d;
		data.q = input.q;
	}
	data.p = data.p || 1;
	data.o = data.o || $sp.getValue('order_by');
	data.d = data.d || $sp.getValue('order_direction');

	data.page_index = (data.p - 1);
	data.window_size = $sp.getValue('maximum_entries') || 10;
	data.window_start  = (data.page_index * data.window_size);
	data.window_end = (((data.page_index + 1) * data.window_size));
	data.filter = $sp.getValue("filter");

	var gr = new GlideRecordSecure(data.table);
	if (!gr.isValid()) {
		data.invalid_table = true;
		data.table_label = data.table;
		return;
	}
	data.table_label = gr.getLabel();

	options.table = data.table;
	options.fields = data.field_list;
	options.o=data.o;
	options.d= data.d;
	options.filter=data.filter;
	options.window_size=data.window_size;
	options.view = 'sp';
	options.headerTitle =options.title;
	options.show_breadcrumbs=true;
	
	data.dataTableWidget = $sp.getWidget('incident_table', options);
})();