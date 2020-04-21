(function(){
	data.pickupMsg = gs.getMessage(options.pickup_msg);
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
	var gr = new GlideRecord('sc_request');
	gr.get(id);
	gs.info(id);
	if (gr == null)
		{
		gs.info("noooo");
		return;
		}
	
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
	
	data.request={};
	var fields = $sp.getFields(gr, 'number,request_state,due_date,description');
 $sp.getRecordDisplayValues(data.request, gr,'number,request_state,due_date,description');

	gs.info(data.request.request_state);
	data.fields=fields;
	data.table = gr.getTableName();
	data.sys_id = gr.getUniqueValue();
	data.tableLabel = gr.getLabel();
	gs.info(data.table,data.sys_id,data.tableLabel);
	
	if(input&&input.action=="approveRequest")
	{
				gr.request_state="in_process";
				gr.update();
		
	
	}
	if(input&&input.action=="rejectRequest")
	{
			 gr.request_state="closed_rejected";
			 gr.update();
		
	}
	if(input&&input.action=="assignAsset")
	{
	
		gr.request_state="closed_complete";
		gr.update();
		
			
			gr3.assigned_to=gs.getUser().getID();
		  gr3.install_status=1;
			gr3.update();
		 
		
	}
	
	
	
	
	
	
	
	
	
	
	/*data.currentstate= gr.incident_state;
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
	
	
	
	
	*/
	
	
})()

