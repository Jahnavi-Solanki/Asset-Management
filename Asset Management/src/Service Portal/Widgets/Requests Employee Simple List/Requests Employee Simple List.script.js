(function () {
	data.filterMsg = gs.getMessage("Filter...");
	if(gs.nil(options.hide_footer))
		options.hide_footer = false;
	options.hide_footer = (options.hide_footer == "true" || options.hide_footer == true);
	options.table = $sp.getParameter('t') || options.table;
	if (!options.table)
		return;

	var gr = new GlideRecord('sc_request'); // does ACL checking for us

	if(!gr.isValid()) {
		data.isValid = false;
		return;
	} else
		data.isValid = true;
	// grTemp is used to check isValidField since using GlideRecordSecure fails for date/time fields
	var grTemp = new GlideRecord(options.table);
	gr.addEncodedQuery(options.filter);
	options.title = options.title ;//|| gr.getPlural();
	options.display_field = $sp.getParameter('f') || options.display_field;
	if (!options.display_field || !grTemp.isValidField(options.display_field))
		options.display_field = gr.getDisplayName();

	if (input && input.filterText) {
		gr.addEncodedQuery(options.display_field + "LIKE" + input.filterText)
	}

	options.title = options.title ;//|| gr.getPlural();
	options.secondary_fields = options.secondary_fields || "";
	options.secondary_fields = options.secondary_fields.split(",");
	if (!options.order_by || !grTemp.isValidField(options.order_by))
		options.order_by = options.display_field;

	// Set ID of sp_page from option schema
	if (options.list_page) {
		var sp_page = new GlideRecord('sp_page');
		if (sp_page.get(options.list_page))
			options.list_page_dv = sp_page.getDisplayValue('id');
	}

	// redo query with limit
	if (options.order_direction == "asc")
		gr.orderBy(options.order_by);
	else
		gr.orderByDesc(options.order_by);

	data.maxCount = 500;
	gr.setLimit(data.maxCount);
	gr.query();

	data.count = gr.getRowCount();
	data.actions = getActions();
	data.list = [];
	var recordIdx = 0;
	while (gr.next()) {


		//gs.info("here"+gr.number+" "+gr.getValue('cmdb_ci'));
		data.asset={};
		/*var gr2= new GlideRecord('sc_req_item');

		gr2.addQuery('request',gr.getUniqueValue());
		gr2.query();
		if(gr2.next())
		{
			gs.info(gr2.number);
			gs.info(gr.number);
		gs.info("configuration item");*/
		//gs.info(gr.cmdb_ci);
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
		if (options.maximum_entries && recordIdx == options.maximum_entries)
			break;

		var record = {};
		if (data.actions.length > 0) {
			var fields = gr.getFields();
			for (var i = 0; i < fields.size(); i++) {
				var glideElement = fields.get(i);
				var name = glideElement.getName();
				if (name.indexOf("sys_") == -1)
					record[name] = gr.getValue(name);
			}
		}

		record.sys_id = gr.getValue('sys_id');
		record.className = gr.getRecordClassName();
		if (options.image_field) {
			record.image_field = gr.getDisplayValue(options.image_field);
			if (!record.image_field)
				record.image_field = "noimage.pngx";
		}

		if (options.display_field)
			record.display_field = getField(gr, options.display_field);

		record.secondary_fields = [];
		options.secondary_fields.forEach(function(f) {
			record.secondary_fields.push(getField(gr, f));
		});
		if(data.asset)
		{
			record.secondary_fields.push(getAsset(data.asset));
		}
		if (options.sp_page) {
			var view = "sp";
			if (options.view) {
				var viewGR = new GlideRecord("sys_ui_view");
				viewGR.get(options.view);
				view = viewGR.getValue("name");
			}
			record.url = {id: options.sp_page, table: record.className, sys_id: record.sys_id, view: view};
		} else if (options.url != '')
			record.url = options.url;
		else
			record.url = null;

		data.list.push(record);
		recordIdx++;
	}
	function getAsset(asset)
	{
		var f={};
		f.display_value=asset.display_name;
		f.value=asset.sys_id;
		return f;
	}
	function getField(gr, name) {
		var f = {};
		f.display_value = gr.getDisplayValue(name);
		f.value = gr.getValue(name);
		var ge = gr.getElement(name);
		if (ge == null)
			return f;

		f.type = ge.getED().getInternalType();
		/*	if (f.type == "glide_date_time")
			f.isFuture = gs.dateDiff(gr.getValue(name), gs.nowNoTZ(), true) < 0;
		else if (f.type == "glide_date")
			f.isFuture = gs.dateDiff(gr.getValue(name), gs.now(), true) < 0;
	*/
		f.label = ge.getLabel();
		return f;
	}

	function getActions() {
		var rl = new GlideRecord("sp_vlist_action");
		rl.addQuery("sp_rectangle_vlist",$sp.getValue("sys_id"));
		rl.query();
		var actions = [];
		while(rl.next()) {
			var action = {};
			$sp.getRecordValues(action, rl, "name,glyph,hint,url,color");
			actions.push(action);
		}
		return actions;
	}
})()