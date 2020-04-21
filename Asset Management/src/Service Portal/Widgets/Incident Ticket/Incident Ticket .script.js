(function(){
	data.pickupMsg = gs.getMessage(options.pickup_msg);
	var user=gs.getUser();
	data.role=gs.hasRole('x_445396_asset_man.IT');
	//data.role=user.hasRole('x_445396_asset_man.IT');
	//g_user= new GlideUser();
	gs.info("user "+user.getID()+" "+data.role);
	var gr = $sp.getRecord();
	if (gr == null)
		return;
	
	data.canRead = gr.canRead();
	if (!data.canRead) 
		return;

	var agent = "";
	var a = $sp.getField(gr, 'assigned_to');
	if (a != null)
		agent = a.display_value;

	var fields = $sp.getFields(gr, 'number,incident_state,priority,caller_id,assigned_to,short_description,description');
  var asset= new GlideRecord('alm_asset');
		var ci= new GlideRecord('cmdb_ci');
		ci.get(gr.cmdb_ci);
		
		asset.addQuery('ci',ci.getUniqueValue());
		asset.query();
		data.asset={};
		if(asset.next())
			{
				
			$sp.getRecordDisplayValues(data.asset,asset,'asset_tag,ci,display_name,sys_id,install_status');
		
			}
	
	
	data.showassigned_to=false;
	data.currentstate= gr.incident_state;
	if(data.currentstate==1)
		{
			data.showassigned_to=true;
		}
	data.showstate=true;
	gs.info(data.currentstate);
  if(data.currentstate==1)
		{
	data.states=[{'name':'In Progress','value':'2'},
							{'name':'Closed','value':'7'},
							{'name':'Canceled','value':'8'}];
		}
	else if(data.currentstate==2)
		{
			data.states=[{'name':'On Hold','value':'3'},
									 {'name':'Resolved','value':'6'},
							{'name':'Closed','value':'7'},
							{'name':'Canceled','value':'8'}];
			
		}
	else if(data.currentstate==3)
		{
			data.states=[{'name':'In Progress','value':'2'},
							{'name':'Closed','value':'7'},
							{'name':'Canceled','value':'8'}];
			
		}
	else if(data.currentstate==6)
		{
			data.states=[
							{'name':'Closed','value':'7'}
							];
			
		}
	else if(data.currentstate==7||data.currentstate==8)
		{
			data.showstate=false;
		}
	data.tableLabel = gr.getLabel();
	data.fields = fields;
	gs.info(gr.assigned_to);
	if(gr.assigned_to)
		{
			data.already_assigned=true;
		}
	else
		{
			data.already_assigned=false;
		}
	data.table = gr.getTableName();
	data.sys_id = gr.getUniqueValue();
	
	if(input&&input.action == 'assigned')
				{	
					gs.info(input.user_id);
					var userRecord = new GlideRecord('sys_user');
					userRecord.query();
					
					userRecord.get(input.userId);
					
					gr.assigned_to= userRecord.getUniqueValue();
					gr.update();
				}
	if(input&&input.action == 'statechange')
				{	
					gs.info('hiii'+input.state);
					
					gr.incident_state= input.state;
					gr.update();
				}
	
	
	
	
	
	
	
})()

