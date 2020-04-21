(function() {

	if(input && input.action == "checkrole")
	{
		
		var users=new GlideRecord('sys_user');
		users.addEncodedQuery('roles=x_445396_asset_man.employee^user_name='+input.unm);
		users.query();
		if(users.next())
		{
			data.redUrl="https://dev65519.service-now.com/asm?id=homepage_employee";
			return;
		}

		users=new GlideRecord('sys_user');
		users.addEncodedQuery('roles=x_445396_asset_man.IT^user_name='+input.unm);
		users.query();
		if(users.next())
		{
			data.redUrl="https://dev65519.service-now.com/asm?id=homepage_it";
		return;
		}
		users=new GlideRecord('sys_user');
		users.addEncodedQuery('user_name='+input.unm+'^roles=x_445396_asset_man.PMO');
		users.query();
		if(users.next())
		{
			data.redUrl="https://dev65519.service-now.com/asm?id=homepage_pmo";
			return;
		}
		//data.redUrl="555555555555555555555555555555";
		data.redUrl="https://dev65519.service-now.com/asm?id=404";	

	


	return;	
}
 options.show_panel = options.show_panel == "true" || options.show_panel == true;

if (input && input.action === "multi_factor_auth_setup") {

	if (gs.getSession().getProperty("setup_multifactor_authn")) {
		gs.getSession().putProperty("nav_to", input.directTo);
		gs.getSession().putProperty("starting_page", input.directTo);
		gs.getSession().putProperty("is_direct_redirect", "true");
	}
	return;
}



// We don't want to set a starting page until we've begun the login process.
if (input && input.action === "set_sso_destination") {
	var gs_nav_to = gs.getSession().getProperty("nav_to");
	gs.getSession().putProperty("nav_to", null);
	if (!gs.getSession().getProperty("starting_page"))
		gs.getSession().putProperty("starting_page", gs_nav_to);

	return;
}
//STRY50033370: Forgot Password link in the login widget
data.pswdResetUrl=gs.getProperty('glide.security.password_reset.uri');
data.forgotPwdLinkProp=gs.getProperty('glide.security.forgot_password.display.link');

data.errorMsg = gs.getMessage("There was an error processing your request");
data.errorMsg2 = gs.getMessage("An error has occurred - please contact your system administrator");
data.passwordMsg = gs.getMessage("Password");
data.usernameMsg = gs.getMessage("User name");
data.forgetMe = GlideProperties.getBoolean("glide.ui.forgetme");
data.forgetMeDefault = GlideProperties.getBoolean('glide.ui.remember.me.default', true);
data.is_logged_in = gs.getSession().isLoggedIn();
var bypass_sso = options.bypass_sso == "true";
data.multisso_enabled = !bypass_sso && GlideProperties.getBoolean("glide.authenticate.multisso.enabled");			
data.default_idp = GlideProperties.get("glide.authenticate.sso.redirect.idp");
data.pageURI = new GlideSPUtil().getPageUri();
data.multiFactorAuthEnabled = GlideProperties.getBoolean('glide.authenticate.multifactor', false);
})();