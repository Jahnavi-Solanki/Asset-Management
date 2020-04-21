(function(){

if(gs.hasRole('x_445396_asset_man.employee'))
	{
		data.role="employee";
	}
	else if(gs.hasRole('x_445396_asset_man.IT'))
	{
		data.role="IT";
	}
	else
	{
		data.role="PMO";	
	}
	var id= $sp.getParameter('sys_id');
	var gr = new GlideRecord('alm_asset');
	gr.get(id);
	
	if (gr == null)
		{
		
		return;
		}
		
	var fields = $sp.getFields(gr, 'asset_tag,display_name,install_status,model_category,ci,assigned_to');
   
	data.fields=fields;
	data.table = gr.getTableName();
	data.sys_id = gr.getUniqueValue();
	data.tableLabel = gr.getLabel();
	gs.info(data.table,data.sys_id,data.tableLabel);
	
	
	
	
})()

