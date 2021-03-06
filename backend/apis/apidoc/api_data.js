define({ "api": [
  {
    "group": "Template",
    "name": "Add_custom_Template",
    "type": "POST",
    "url": "/api/v1/add-custom-template",
    "title": "Add Master Template",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>Request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.body",
            "description": "<p>Request body</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "req.body.copyMaster",
            "description": "<p>Flag for copy from master templates</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.body.PWUserId",
            "description": "<p>Id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "req.body.defaultTemplateId",
            "description": "<p>Id of the selected master template</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.body.templateConfig",
            "description": "<p>config of the custom template</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Main response data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": true,\n  \"messege\":\"Your template has been successfully saved\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>false</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "messege",
            "description": "<p>Error Message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "rest-doc/template-api.js",
    "groupTitle": "Template"
  },
  {
    "group": "Template",
    "name": "Change_custom_Template_Config",
    "type": "POST",
    "url": "/api/v1/change-custom-template",
    "title": "Change Template Config",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>Request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.body",
            "description": "<p>Request body</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "req.body.copyMaster",
            "description": "<p>Flag for copy from master templates</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.body.PWUserId",
            "description": "<p>Id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "req.body.defaultTemplateId",
            "description": "<p>Id of the selected master template</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.body.templateConfig",
            "description": "<p>config of the custom template</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Main response data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": true,\n  \"messege\":\"Your template has been successfully saved\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>false</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "messege",
            "description": "<p>Error Message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "rest-doc/template-api.js",
    "groupTitle": "Template"
  },
  {
    "group": "Template",
    "name": "Get_Master_Template",
    "type": "GET",
    "url": "/api/v1/get-master-template",
    "title": "Get Master Template",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>Request object</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Main response data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": true,\n  \"data\": {\n    \"masterTemplates\": [{\n        \"TemplateId\": 1,\n        \"TemplateName\": \"Sample 1\",\n        \"TemplateImage\": null,\n        \"TemplateConfig\": {\n            \"background\": {\n                \"color\": \"#ffffff \",\n                \"colorIdx\": 8,\n                \"texture\": \"\",\n                \"textureIdx\": 5\n            },\n            \"elements\": {\n                \"center\": [],\n                \"top\": [{\n                    \"name\": \"Dashboard \",\n                    \"icon\": \". / resources / dashboard - menu.png \"\n                }, {\n                    \"name\": \"Project \",\n                    \"icon\": \". / resources / projects - menu.png \"\n                }, {\n                    \"name\": \"Contact\",\n                    \"icon\": \". / resources / scontacts - menu.png \"\n                }],\n                \"bottom\": [],\n                \"right\": [],\n                \"left\": [{\n                    \"name\": \"Messages\",\n                    \"icon\": \". / resources / message - menu.png\"\n                }, {\n                    \"name \": \"Notification \",\n                    \"icon \": \". / resources / notification - menu.png \"\n                }]\n            }\n        }\n    }, {\n        \"TemplateId\": 2,\n        \"TemplateName\": \"Sample 2\",\n        \"TemplateImage\": null,\n        \"TemplateConfig\": {\n            \"background\": {\n                \"color\": \"#ffffff \",\n                \"colorIdx\": 8,\n                \"texture\": \"\",\n                \"textureIdx\": 5\n            },\n            \"elements\": {\n                \"center\": [],\n                \"top\": [{\n                    \"name\": \"Dashboard \",\n                    \"icon\": \". / resources / dashboard - menu.png \"\n                }, {\n                    \"name\": \"Project \",\n                    \"icon\": \". / resources / projects - menu.png \"\n                }, {\n                    \"name\": \"Contact\",\n                    \"icon\": \". / resources / scontacts - menu.png \"\n                }],\n                \"bottom\": [],\n                \"right\": [],\n                \"left\": [{\n                    \"name\": \"Messages\",\n                    \"icon\": \". / resources / message - menu.png\"\n                }, {\n                    \"name \": \"Notification \",\n                    \"icon \": \". / resources / notification - menu.png \"\n                }]\n            }\n        }\n    }, {\n        \"TemplateId\": 3,\n        \"TemplateName\": \"Sample 3\",\n        \"TemplateImage\": null,\n        \"TemplateConfig\": {\n            \"background\": {\n                \"color\": \"#ffffff \",\n                \"colorIdx\": 8,\n                \"texture\": \"\",\n                \"textureIdx\": 5\n            },\n            \"elements\": {\n                \"center\": [],\n                \"top\": [{\n                    \"name\": \"Dashboard \",\n                    \"icon\": \". / resources / dashboard - menu.png \"\n                }, {\n                    \"name\": \"Project \",\n                    \"icon\": \". / resources / projects - menu.png \"\n                }, {\n                    \"name\": \"Contact\",\n                    \"icon\": \". / resources / scontacts - menu.png \"\n                }],\n                \"bottom\": [],\n                \"right\": [],\n                \"left\": [{\n                    \"name\": \"Messages\",\n                    \"icon\": \". / resources / message - menu.png\"\n                }, {\n                    \"name \": \"Notification \",\n                    \"icon \": \". / resources / notification - menu.png \"\n                }]\n            }\n        }\n    }\n    ]\n\n}\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": true,\n  \"message\": \"No Master Template Found\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>false</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "messege",
            "description": "<p>Error Message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "rest-doc/template-api.js",
    "groupTitle": "Template"
  },
  {
    "group": "User",
    "name": "Check_first_time_login",
    "type": "GET",
    "url": "api/v1/check-login/:PWUserId",
    "title": "Check first time login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req",
            "description": "<p>Request object</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "req.params",
            "description": "<p>Request Parameters</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "req.params.PWUserId",
            "description": "<p>Id of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>true</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Main response data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": true,\n  \"data\": {\n    \"templateConfig\": {\n      \"color\": \"#12345\"\n    }\n  }\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": true,\n  \"message\": \"New User found\",\n  \"data\": {\n    \"firstTimeLogin\": true\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>false</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Boolean",
            "optional": false,
            "field": "messege",
            "description": "<p>Error Message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": false,\n  \"errors\": [],\n  \"errfor\": {\n    \"PWUserId\": \"PWUserId is required\"\n  },\n  \"messege\": \"PWUserId is required\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "rest-doc/template-api.js",
    "groupTitle": "User"
  }
] });
