/**
* @apiGroup User
* @apiName Check first time login
* @api {GET} api/v1/check-login/:PWUserId Check first time login
*
* @apiParam  {Object}   req                               Request object
* @apiParam  {Object}   req.params                        Request Parameters 
* @apiParam  {String}   req.params.PWUserId               Id of the user
*
* 
* @apiSuccess {Boolean} success         true
* @apiSuccess {Object}  data            Main response data.
*
* @apiError   {Boolean} success          false
* @apiError   {Boolean} messege          Error Message
*
* @apiSuccessExample Success-Response:
{
  "success": true,
  "data": {
    "templateConfig": {
      "color": "#12345"
    }
  }
}
* @apiSuccessExample Success-Response:
{
  "success": true,
  "message": "New User found",
  "data": {
    "firstTimeLogin": true
  }
}
* @apiErrorExample Success-Response:
{
  "success": false,
  "errors": [],
  "errfor": {
    "PWUserId": "PWUserId is required"
  },
  "messege": "PWUserId is required"
}
*/

/**
* @apiGroup Template
* @apiName Get Master Template
* @api {GET} /api/v1/get-master-template Get Master Template
*
* @apiParam  {Object}   req                               Request object
* 
* @apiSuccess {Boolean} success         true
* @apiSuccess {Object}  data            Main response data.
*
* @apiError   {Boolean} success          false
* @apiError   {Boolean} messege          Error Message
*
* @apiSuccessExample Success-Response:
{
  "success": true,
  "data": {
    "masterTemplates": [{
        "TemplateId": 1,
        "TemplateName": "Sample 1",
        "TemplateImage": null,
        "TemplateConfig": {
            "background": {
                "color": "#ffffff ",
                "colorIdx": 8,
                "texture": "",
                "textureIdx": 5
            },
            "elements": {
                "center": [],
                "top": [{
                    "name": "Dashboard ",
                    "icon": ". / resources / dashboard - menu.png "
                }, {
                    "name": "Project ",
                    "icon": ". / resources / projects - menu.png "
                }, {
                    "name": "Contact",
                    "icon": ". / resources / scontacts - menu.png "
                }],
                "bottom": [],
                "right": [],
                "left": [{
                    "name": "Messages",
                    "icon": ". / resources / message - menu.png"
                }, {
                    "name ": "Notification ",
                    "icon ": ". / resources / notification - menu.png "
                }]
            }
        }
    }, {
        "TemplateId": 2,
        "TemplateName": "Sample 2",
        "TemplateImage": null,
        "TemplateConfig": {
            "background": {
                "color": "#ffffff ",
                "colorIdx": 8,
                "texture": "",
                "textureIdx": 5
            },
            "elements": {
                "center": [],
                "top": [{
                    "name": "Dashboard ",
                    "icon": ". / resources / dashboard - menu.png "
                }, {
                    "name": "Project ",
                    "icon": ". / resources / projects - menu.png "
                }, {
                    "name": "Contact",
                    "icon": ". / resources / scontacts - menu.png "
                }],
                "bottom": [],
                "right": [],
                "left": [{
                    "name": "Messages",
                    "icon": ". / resources / message - menu.png"
                }, {
                    "name ": "Notification ",
                    "icon ": ". / resources / notification - menu.png "
                }]
            }
        }
    }, {
        "TemplateId": 3,
        "TemplateName": "Sample 3",
        "TemplateImage": null,
        "TemplateConfig": {
            "background": {
                "color": "#ffffff ",
                "colorIdx": 8,
                "texture": "",
                "textureIdx": 5
            },
            "elements": {
                "center": [],
                "top": [{
                    "name": "Dashboard ",
                    "icon": ". / resources / dashboard - menu.png "
                }, {
                    "name": "Project ",
                    "icon": ". / resources / projects - menu.png "
                }, {
                    "name": "Contact",
                    "icon": ". / resources / scontacts - menu.png "
                }],
                "bottom": [],
                "right": [],
                "left": [{
                    "name": "Messages",
                    "icon": ". / resources / message - menu.png"
                }, {
                    "name ": "Notification ",
                    "icon ": ". / resources / notification - menu.png "
                }]
            }
        }
    }
    ]

}
}
* @apiSuccessExample Success-Response:
{
  "success": true,
  "message": "No Master Template Found"
}
*/


/**
* @apiGroup Template
* @apiName Add custom Template
* @api {POST} /api/v1/add-custom-template Add Master Template
*
* @apiParam  {Object}   req                               Request object
* @apiParam  {Object}   req.body                          Request body
* @apiParam  {Boolean}  req.body.copyMaster               Flag for copy from master templates
* @apiParam  {String}   req.body.PWUserId                 Id of the user
* @apiParam  {Number}   req.body.defaultTemplateId        Id of the selected master template 
* @apiParam  {Object}   req.body.templateConfig           config of the custom template
* 
* @apiSuccess {Boolean} success         true
* @apiSuccess {Object}  data            Main response data.
*
* @apiError   {Boolean} success          false
* @apiError   {Boolean} messege          Error Message
*
* @apiSuccessExample Success-Response:
{
  "success": true,
  "messege":"Your template has been successfully saved"
}
*/


/**
* @apiGroup Template
* @apiName Change custom Template Config
* @api {POST} /api/v1/change-custom-template Change Template Config
*
* @apiParam  {Object}   req                               Request object
* @apiParam  {Object}   req.body                          Request body
* @apiParam  {Boolean}  req.body.copyMaster               Flag for copy from master templates
* @apiParam  {String}   req.body.PWUserId                 Id of the user
* @apiParam  {Number}   req.body.defaultTemplateId        Id of the selected master template 
* @apiParam  {Object}   req.body.templateConfig           config of the custom template
* 
* @apiSuccess {Boolean} success         true
* @apiSuccess {Object}  data            Main response data.
*
* @apiError   {Boolean} success          false
* @apiError   {Boolean} messege          Error Message
*
* @apiSuccessExample Success-Response:
{
  "success": true,
  "messege":"Your template has been successfully saved"
}
*/
