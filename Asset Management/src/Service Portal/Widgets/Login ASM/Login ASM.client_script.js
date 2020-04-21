function loginCtrl($scope, $http, $window, $location, glideUserSession, glideSystemProperties, spUtil) {

	var c = this;
	c.remember_me = c.data.forgetMeDefault;
 c.data.url="";
	if (!c.data.is_logged_in && c.data.multisso_enabled && c.data.default_idp) {
		c.server.get({
			action: "set_sso_destination",
			pageURI: c.data.pageURI
		}).then(function() {
			$window.location = "/login_with_sso.do?glide_sso_id=" + c.data.default_idp;
		});
	}

	c.login = function(username, password) {
		c.server.get({
					action: "checkrole",
					unm: username,
					pwd: password
				}).then(function(r)
				{
				console.log("111111111111111111111111111111111111111111111111");
					console.log("!1111111  "+r.data.redUrl);
					c.data.redUrl=r.data.redUrl;
				});
		var url = spUtil.getURL({sysparm_type: 'view_form.login'});
		c.data.unm=username;
		// If the page isn't public, then the ID in the
		// URL won't match the rendered page ID
		var pageId = $location.search().id || $scope.page.id;
		var isLoginPage = $scope.portal.login_page_dv == pageId;
		console.log("hiii "+c.data.unm);
		return $http({
			method: 'post',
			url: url,
			data: $.param({
				'sysparm_type': 'login',
				'ni.nolog.user_password': true,
				'remember_me': !!c.remember_me ? true : false,
				'user_name': username,
				'user_password': password,
				'get_redirect_url': true,
				'sysparm_goto_url': isLoginPage ? null : $location.url(),
				'mfa_redirect_url': c.data.pageURI
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).then(function(response) {
			console.log("hereeeee");
			//c.getrole();
			/*c.server.get({
					action: "checkrole",
					unm: c.data.unm
				}).then(function(r)
				{
				console.log("111111111111111111111111111111111111111111111111");
					console.log("!1111111  "+r.data);
					c.data.url=r.data.url;
				});
			if (!response.data) {
				c.message = $scope.data.errorMsg;
				return;
			}*/

			if (response.data.status == 'success') {
				console.log("done");
				if (c.data.multiFactorAuthEnabled) {
					console.log("IFFFF");
					c.server.get({
						action: "multi_factor_auth_setup",
						directTo: response.data.redirect_url
					}).then(handleLoginSuccess.bind(response));
				} else {
					console.log("ELSEEE");
					handleLoginSuccess.call(response);
				}
			} else if (response.data.status == 'mfa_code_required') {
					$window.location = '/validate_multifactor_auth_code.do';
			} else {
				// wrong username or password
				c.message = response.data.message;
				c.password = "";
				c.username = "";
				angular.element("#username").focus();
			}

		}, function errorCallback(response) {
			c.message = $scope.data.errorMsg;
		});
	};
  /*c.getrole= function()
	{
		c.server.get({
					action: "checkrole",
					unm: c.data.unm
				}).then(function(r)
				{
				console.log("111111111111111111111111111111111111111111111111");
					console.log("!1111111  "+r.data.redUrl);
					c.data.url=r.data.redUrl;
				});
			
	}*/
	c.externalLogin = function() {
		c.server.get({
			action: "set_sso_destination",
			pageURI: c.data.pageURI
		}).then(function() {
			console.log("ssoooooooo");
			glideSystemProperties.set("glide.authenticate.multisso.enabled", true);

			glideUserSession.getSsoRedirectUrlForUsername(c.username)
				.then(function(url) {
					$window.location = url;
				}, function(err) {
					spUtil.addErrorMessage($scope.data.errorMsg2);
				});
		});
	}

	function handleLoginSuccess() {
	
		console.log("finally");
		c.success = this.data.message;
		/*	c.server.get({
					action: "checkrole",
					unm: c.data.unm,
					dmeo:"aaaaaaaaaaaaaaaaa"
		
				}).then(function(r)
				{
				console.log("111111111111111111111111111111111111111111111111");		
				console.log("page"+c.data.redUrl);
				
				});
		*/
		$window.location = c.data.redUrl;
	}

	c.setExternalLogin = function(newVal) {
		c.externalLoginMode = newVal;
	}
}