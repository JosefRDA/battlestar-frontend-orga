import { errorSchemas, wrapSchemaWithResponse } from "./swaggerCompiler";
import { SwaggerTypes } from "@/types/swagger";
import pkg from "@root/package.json";
const version = pkg.version;

export const SwaggerJson: SwaggerTypes = {
    openapi: "3.0.1",
    info: {
        title: "Battlestar API",
        description: "Battlestar Galactica - System Management API",
        version,
        contact: {
            name: "Support",
            email: "support@battlestar.local",
            url: "https://battlestar.local"
        },
        license: {
            name: "MIT",
            url: "https://opensource.org/licenses/MIT"
        }
    },
    servers: [
        {
            "url": "http://localhost:4000",
            "description": "Development Server"
        },
        {
            "url": "http://localhost:3000",
            "description": "Development Server"
        },
        {
            "url": "https://api.battlestar.local",
            "description": "Production Server"
        }
    ],
    paths: {
        // ========== USERS ==========
        "/users": {
            get: {
                summary: "List all users",
                operationId: "listUsers",
                tags: ["Users"],
                responses: {
                    "200": {
                        description: "List of users",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/User" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a user",
                operationId: "createUser",
                tags: ["Users"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateUserInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "User created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/User"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/users/search": {
            get: {
                summary: "Search users by name",
                operationId: "searchUsers",
                tags: ["Users"],
                parameters: [
                    {
                        name: "name",
                        in: "query",
                        description: "Search by name",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "List of users",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/User" }
                                })
                            }
                        }
                    },
                },
            },
        },
        "/users/{id}": {
            get: {
                summary: "Get user by ID",
                operationId: "getUser",
                tags: ["Users"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "User ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "User found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/User"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update user",
                operationId: "updateUser",
                tags: ["Users"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "User ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdateUserInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "User updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/User"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update user",
                operationId: "replaceUser",
                tags: ["Users"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "User ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateUserInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "User updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/User"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete user",
                operationId: "deleteUser",
                tags: ["Users"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "User ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },

        // ========== PEOPLE ==========
        "/people": {
            get: {
                summary: "List all people",
                operationId: "listPeople",
                tags: ["People"],
                responses: {
                    "200": {
                        description: "List of people",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/Person" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a person",
                operationId: "createPerson",
                tags: ["People"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePersonInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Person created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Person"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/people/{id}": {
            get: {
                summary: "Get person by ID",
                operationId: "getPerson",
                tags: ["People"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Person ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Person found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Person"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update person",
                operationId: "updatePerson",
                tags: ["People"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Person ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdatePersonInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Person updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Person"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update person",
                operationId: "replacePerson",
                tags: ["People"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Person ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePersonInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Person updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Person"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete person",
                operationId: "deletePerson",
                tags: ["People"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Person ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/people/rifd/{rifd}/health/latest": {
            get: {
                summary: "Get person by RIFD with latest health",
                operationId: "getPersonByRifdWithHealth",
                tags: ["People"],
                parameters: [
                    {
                        name: "rifd",
                        in: "path",
                        description: "RIFD identifier",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Person with latest health",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PersonWithHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
        "/people/{id}/health/latest": {
            get: {
                summary: "Get person by ID with latest health",
                operationId: "getPersonWithHealth",
                tags: ["People"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Person ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Person with latest health",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PersonWithHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },

        // ========== REPARATIONS ==========
        "/reparations": {
            get: {
                summary: "List all reparations",
                operationId: "listReparations",
                tags: ["Reparations"],
                responses: {
                    "200": {
                        description: "List of reparations",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/Reparation" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a reparation",
                operationId: "createReparation",
                tags: ["Reparations"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateReparationInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Reparation created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Reparation"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/reparations/{id}": {
            get: {
                summary: "Get reparation by ID",
                operationId: "getReparation",
                tags: ["Reparations"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Reparation ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Reparation found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Reparation"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update reparation",
                operationId: "updateReparation",
                tags: ["Reparations"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Reparation ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdateReparationInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Reparation updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Reparation"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update reparation",
                operationId: "replaceReparation",
                tags: ["Reparations"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Reparation ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateReparationInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Reparation updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Reparation"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete reparation",
                operationId: "deleteReparation",
                tags: ["Reparations"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Reparation ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/reparations/system/{systemId}": {
            get: {
                summary: "Get active reparation for system",
                operationId: "getActiveReparationForSystem",
                tags: ["Reparations"],
                parameters: [
                    {
                        name: "systemId",
                        in: "path",
                        description: "System ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Active reparation",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Reparation"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
        "/reparations/{id}/fix": {
            post: {
                summary: "Fix reparation",
                operationId: "fixReparation",
                tags: ["Reparations"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Reparation ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Reparation fixed",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Reparation"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },

        // ========== SYSTEMS ==========
        "/systems": {
            get: {
                summary: "List all systems",
                operationId: "listSystems",
                tags: ["Systems"],
                responses: {
                    "200": {
                        description: "List of systems",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/System" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a system",
                operationId: "createSystem",
                tags: ["Systems"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateSystemInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "System created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/System"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/systems/with-healths": {
            get: {
                summary: "List systems with healths",
                operationId: "listSystemsWithHealths",
                tags: ["Systems"],
                responses: {
                    "200": {
                        description: "Systems with healths",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/SystemWithHealths" }
                                })
                            }
                        }
                    },
                },
            },
        },
        "/systems/{id}": {
            get: {
                summary: "Get system by ID",
                operationId: "getSystem",
                tags: ["Systems"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "System found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/System"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update system",
                operationId: "updateSystem",
                tags: ["Systems"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdateSystemInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "System updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/System"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update system",
                operationId: "replaceSystem",
                tags: ["Systems"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateSystemInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "System updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/System"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete system",
                operationId: "deleteSystem",
                tags: ["Systems"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },

        // ========== PARTS ==========
        "/parts": {
            get: {
                summary: "List all parts",
                operationId: "listParts",
                tags: ["Parts"],
                responses: {
                    "200": {
                        description: "List of parts",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/Part" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a part",
                operationId: "createPart",
                tags: ["Parts"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePartInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Part created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Part"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/parts/{id}": {
            get: {
                summary: "Get part by ID",
                operationId: "getPart",
                tags: ["Parts"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Part ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Part found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Part"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update part",
                operationId: "updatePart",
                tags: ["Parts"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Part ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdatePartInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Part updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Part"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update part",
                operationId: "replacePart",
                tags: ["Parts"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Part ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePartInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Part updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Part"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete part",
                operationId: "deletePart",
                tags: ["Parts"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Part ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },

        // ========== INCIDENTS ==========
        "/incidents": {
            get: {
                summary: "List all incidents",
                operationId: "listIncidents",
                tags: ["Incidents"],
                responses: {
                    "200": {
                        description: "List of incidents",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/Incident" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create an incident",
                operationId: "createIncident",
                tags: ["Incidents"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateIncidentInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Incident created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Incident"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/incidents/{id}": {
            get: {
                summary: "Get incident by ID",
                operationId: "getIncident",
                tags: ["Incidents"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Incident ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Incident found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Incident"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update incident",
                operationId: "updateIncident",
                tags: ["Incidents"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Incident ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdateIncidentInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Incident updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Incident"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update incident",
                operationId: "replaceIncident",
                tags: ["Incidents"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Incident ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateIncidentInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Incident updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Incident"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete incident",
                operationId: "deleteIncident",
                tags: ["Incidents"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Incident ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },

        // ========== PEOPLE HEALTHS ==========
        "/people-healths": {
            get: {
                summary: "List all people health records",
                operationId: "listPeopleHealths",
                tags: ["PeopleHealths"],
                responses: {
                    "200": {
                        description: "List of people health records",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/PeopleHealth" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a people health record",
                operationId: "createPeopleHealth",
                tags: ["PeopleHealths"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePeopleHealthInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "People health created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealth"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/people-healths/{id}": {
            get: {
                summary: "Get people health by ID",
                operationId: "getPeopleHealth",
                tags: ["PeopleHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "People health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "People health found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update people health",
                operationId: "updatePeopleHealth",
                tags: ["PeopleHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "People health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdatePeopleHealthInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "People health updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update people health",
                operationId: "replacePeopleHealth",
                tags: ["PeopleHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "People health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePeopleHealthInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "People health updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete people health",
                operationId: "deletePeopleHealth",
                tags: ["PeopleHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "People health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },

        // ========== PEOPLE HEALTH SYMPTOMS ==========
        "/people-health-symptoms": {
            get: {
                summary: "List all people health symptoms",
                operationId: "listPeopleHealthSymptoms",
                tags: ["PeopleHealthSymptoms"],
                responses: {
                    "200": {
                        description: "List of symptoms",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/PeopleHealthSymptom" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a people health symptom",
                operationId: "createPeopleHealthSymptom",
                tags: ["PeopleHealthSymptoms"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePeopleHealthSymptomInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Symptom created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealthSymptom"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/people-health-symptoms/{id}": {
            get: {
                summary: "Get people health symptom by ID",
                operationId: "getPeopleHealthSymptom",
                tags: ["PeopleHealthSymptoms"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Symptom ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Symptom found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealthSymptom"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update symptom",
                operationId: "updatePeopleHealthSymptom",
                tags: ["PeopleHealthSymptoms"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Symptom ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdatePeopleHealthSymptomInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Symptom updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealthSymptom"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update symptom",
                operationId: "replacePeopleHealthSymptom",
                tags: ["PeopleHealthSymptoms"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Symptom ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreatePeopleHealthSymptomInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Symptom updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/PeopleHealthSymptom"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete symptom",
                operationId: "deletePeopleHealthSymptom",
                tags: ["PeopleHealthSymptoms"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Symptom ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },

        // ========== SYSTEM HEALTHS ==========
        "/system-healths": {
            get: {
                summary: "List all system health records",
                operationId: "listSystemHealths",
                tags: ["SystemHealths"],
                responses: {
                    "200": {
                        description: "List of system health records",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/SystemHealth" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a system health record",
                operationId: "createSystemHealth",
                tags: ["SystemHealths"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateSystemHealthInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "System health created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/SystemHealth"
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/system-healths/{id}": {
            get: {
                summary: "Get system health by ID",
                operationId: "getSystemHealth",
                tags: ["SystemHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "System health found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/SystemHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update system health",
                operationId: "updateSystemHealth",
                tags: ["SystemHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdateSystemHealthInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "System health updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/SystemHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update system health",
                operationId: "replaceSystemHealth",
                tags: ["SystemHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateSystemHealthInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "System health updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/SystemHealth"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete system health",
                operationId: "deleteSystemHealth",
                tags: ["SystemHealths"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "System health ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },

        // ========== HACKINGS ==========
        "/hackings": {
            get: {
                summary: "List all hackings",
                operationId: "listHackings",
                tags: ["Hackings"],
                responses: {
                    "200": {
                        description: "List of hackings",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "array",
                                    items: { "$ref": "#/components/schemas/Hacking" }
                                })
                            }
                        }
                    },
                },
            },
            post: {
                summary: "Create a hacking",
                operationId: "createHacking",
                tags: ["Hackings"],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateHackingInput"
                            })
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Hacking created",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Hacking"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/hackings/{id}": {
            get: {
                summary: "Get hacking by ID",
                operationId: "getHacking",
                tags: ["Hackings"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Hacking ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Hacking found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Hacking"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
            patch: {
                summary: "Partially update hacking",
                operationId: "updateHacking",
                tags: ["Hackings"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Hacking ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: false,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/UpdateHackingInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Hacking updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Hacking"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            put: {
                summary: "Fully update hacking",
                operationId: "replaceHacking",
                tags: ["Hackings"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Hacking ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: wrapSchemaWithResponse({
                                "$ref": "#/components/schemas/CreateHackingInput"
                            })
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Hacking updated",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Hacking"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
            delete: {
                summary: "Delete hacking",
                operationId: "deleteHacking",
                tags: ["Hackings"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Hacking ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/hackings/{id}/start": {
            post: {
                summary: "Start hacking",
                operationId: "startHacking",
                tags: ["Hackings"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Hacking ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Hacking started",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Hacking"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
        "/hackings/{id}/stop": {
            post: {
                summary: "Stop hacking",
                operationId: "stopHacking",
                tags: ["Hackings"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "Hacking ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "200": {
                        description: "Hacking stopped",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Hacking"
                                })
                            }
                        }
                    },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },

        // ========== ADMIN ==========
        "/admin/parts/seed": {
            post: {
                summary: "Seed parts",
                operationId: "seedParts",
                tags: ["Admin"],
                responses: {
                    "201": {
                        description: "Parts seeded",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "object",
                                    properties: {
                                        data: { type: "array", items: { "$ref": "#/components/schemas/Part" } },
                                        message: { type: "string" }
                                    }
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
        "/admin/incidents/seed": {
            post: {
                summary: "Seed incidents",
                operationId: "seedIncidents",
                tags: ["Admin"],
                responses: {
                    "201": {
                        description: "Incidents seeded",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "object",
                                    properties: {
                                        data: { type: "array", items: { "$ref": "#/components/schemas/Incident" } },
                                        message: { type: "string" }
                                    }
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
        "/admin/users/seed": {
            post: {
                summary: "Seed users",
                operationId: "seedUsers",
                tags: ["Admin"],
                responses: {
                    "201": {
                        description: "Users seeded",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "object",
                                    properties: {
                                        data: { type: "array", items: { "$ref": "#/components/schemas/User" } },
                                        message: { type: "string" }
                                    }
                                })
                            }
                        }
                    },
                },
            },
        },
        "/admin/users/{id}": {
            delete: {
                summary: "Delete user (admin)",
                operationId: "adminDeleteUser",
                tags: ["Admin"],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "User ID",
                        required: true,
                        schema: { type: "string" }
                    }
                ],
                responses: {
                    "204": { description: "No content" },
                    "404": {
                        description: "Not found",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                }
            },
        },
        "/admin/reparations/seed": {
            post: {
                summary: "Seed reparations",
                operationId: "seedReparations",
                tags: ["Admin"],
                responses: {
                    "201": {
                        description: "Reparations seeded",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "object",
                                    properties: {
                                        data: { type: "array", items: { "$ref": "#/components/schemas/Reparation" } },
                                        message: { type: "string" }
                                    }
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
        "/admin/systems/init": {
            post: {
                summary: "Initialize systems",
                operationId: "initSystems",
                tags: ["Admin"],
                responses: {
                    "201": {
                        description: "Systems initialized",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "object",
                                    properties: {
                                        data: { type: "array", items: { "$ref": "#/components/schemas/System" } },
                                        message: { type: "string" }
                                    }
                                })
                            }
                        }
                    },
                },
            },
        },
        "/admin/system-healths/init": {
            post: {
                summary: "Initialize system healths",
                operationId: "initSystemHealths",
                tags: ["Admin"],
                responses: {
                    "201": {
                        description: "System healths initialized",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "object",
                                    properties: {
                                        data: { type: "array", items: { "$ref": "#/components/schemas/SystemHealth" } },
                                        message: { type: "string" }
                                    }
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
        "/admin/people/seed": {
            post: {
                summary: "Seed people",
                operationId: "seedPeople",
                tags: ["Admin"],
                responses: {
                    "201": {
                        description: "People seeded",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    type: "object",
                                    properties: {
                                        data: { type: "array", items: { "$ref": "#/components/schemas/Person" } },
                                        message: { type: "string" }
                                    }
                                })
                            }
                        }
                    },
                    "400": {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: wrapSchemaWithResponse({
                                    "$ref": "#/components/schemas/Error"
                                })
                            }
                        }
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            // Base schemas
            User: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    rifd: { type: "string" },
                    name: { type: "string" },
                    username: { type: "string" },
                    role: { type: "array", items: { type: "string", enum: ["Admin", "User", "Hacker"] } },
                    picture: { type: "string" },
                    isHacker: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    people: { "$ref": "#/components/schemas/Person" }
                }
            },
            CreateUserInput: {
                type: "object",
                required: ["rifd", "name"],
                properties: {
                    rifd: { type: "string" },
                    name: { type: "string" },
                    role: { type: "array", items: { type: "string", enum: ["Admin", "User", "Hacker"] } },
                    picture: { type: "string" },
                    isHacker: { type: "boolean" }
                }
            },
            UpdateUserInput: {
                type: "object",
                properties: {
                    rifd: { type: "string" },
                    name: { type: "string" },
                    role: { type: "array", items: { type: "string", enum: ["Admin", "User", "Hacker"] } },
                    picture: { type: "string" },
                    isHacker: { type: "boolean" }
                }
            },

            Person: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    sexe: { type: "string", enum: ["MASCULIN", "FEMININ"] },
                    adulte: { type: "boolean" },
                    mort: { type: "boolean" },
                    dateNaissance: { type: "string", format: "date-time", nullable: true },
                    dateMort: { type: "string", format: "date-time", nullable: true },
                    userId: { type: "string", nullable: true },
                    user: { "$ref": "#/components/schemas/User" },
                    peopleHealths: { type: "array", items: { "$ref": "#/components/schemas/PeopleHealth" } }
                }
            },
            CreatePersonInput: {
                type: "object",
                required: ["name", "sexe", "adulte"],
                properties: {
                    name: { type: "string" },
                    sexe: { type: "string", enum: ["MASCULIN", "FEMININ"] },
                    adulte: { type: "boolean" },
                    mort: { type: "boolean" },
                    dateNaissance: { type: "string", format: "date-time" },
                    dateMort: { type: "string", format: "date-time" },
                    userId: { type: "string" }
                }
            },
            UpdatePersonInput: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    sexe: { type: "string", enum: ["MASCULIN", "FEMININ"] },
                    adulte: { type: "boolean" },
                    mort: { type: "boolean" },
                    dateNaissance: { type: "string", format: "date-time" },
                    dateMort: { type: "string", format: "date-time" },
                    userId: { type: "string" }
                }
            },
            PersonWithHealth: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    sexe: { type: "string", enum: ["MASCULIN", "FEMININ"] },
                    adulte: { type: "boolean" },
                    mort: { type: "boolean" },
                    dateNaissance: { type: "string", format: "date-time", nullable: true },
                    dateMort: { type: "string", format: "date-time", nullable: true },
                    health: {
                        type: "object",
                        nullable: true,
                        properties: {
                            id: { type: "string" },
                            temperatureCorporelle: { type: "number" },
                            poulsMax: { type: "number" },
                            poulsMin: { type: "number" },
                            tensionArterielleMax: { type: "number" },
                            tensionArterielleMin: { type: "number" },
                            healthDate: { type: "string", format: "date-time" },
                            symptoms: { type: "array", items: { "$ref": "#/components/schemas/PeopleHealthSymptom" } }
                        }
                    }
                }
            },

            Reparation: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    systemId: { type: "integer" },
                    fixed: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    system: { "$ref": "#/components/schemas/System" },
                    partsNeededToFix: { type: "array", items: { "$ref": "#/components/schemas/Part" } }
                }
            },
            CreateReparationInput: {
                type: "object",
                required: ["systemId"],
                properties: {
                    systemId: { type: "integer" },
                    partsNeededToFixIds: { type: "array", items: { type: "string" } }
                }
            },
            UpdateReparationInput: {
                type: "object",
                properties: {
                    systemId: { type: "integer" },
                    fixed: { type: "boolean" },
                    partsNeededToFixIds: { type: "array", items: { type: "string" } }
                }
            },

            System: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    order: { type: "integer" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    healths: { type: "array", items: { "$ref": "#/components/schemas/SystemHealth" } },
                    reparations: { type: "array", items: { "$ref": "#/components/schemas/Reparation" } }
                }
            },
            CreateSystemInput: {
                type: "object",
                required: ["name", "order"],
                properties: {
                    name: { type: "string" },
                    order: { type: "integer" }
                }
            },
            UpdateSystemInput: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    order: { type: "integer" }
                }
            },
            SystemWithHealths: {
                allOf: [
                    { "$ref": "#/components/schemas/System" },
                    {
                        type: "object",
                        properties: {
                            healths: { type: "array", items: { "$ref": "#/components/schemas/SystemHealth" } }
                        }
                    }
                ]
            },

            Part: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    rifd: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    picture: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    canBeUsedInIncidents: { type: "array", items: { "$ref": "#/components/schemas/Incident" } },
                    canBeUsedReparation: { type: "array", items: { "$ref": "#/components/schemas/Reparation" } }
                }
            },
            CreatePartInput: {
                type: "object",
                required: ["rifd", "name", "description"],
                properties: {
                    rifd: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    picture: { type: "string" },
                    canBeUsedInIncidentsIds: { type: "array", items: { type: "string" } },
                    canBeUsedInReparationIds: { type: "array", items: { type: "string" } }
                }
            },
            UpdatePartInput: {
                type: "object",
                properties: {
                    rifd: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    picture: { type: "string" },
                    canBeUsedInIncidentsIds: { type: "array", items: { type: "string" } },
                    canBeUsedInReparationIds: { type: "array", items: { type: "string" } }
                }
            },

            Incident: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    picture: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    partsNeededToFix: { type: "array", items: { "$ref": "#/components/schemas/Part" } }
                }
            },
            CreateIncidentInput: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    picture: { type: "string" },
                    partsNeededToFixIds: { type: "array", items: { type: "string" } }
                }
            },
            UpdateIncidentInput: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    picture: { type: "string" },
                    partsNeededToFixIds: { type: "array", items: { type: "string" } }
                }
            },

            PeopleHealth: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    temperatureCorporelle: { type: "number" },
                    poulsMax: { type: "number" },
                    poulsMin: { type: "number" },
                    tensionArterielleMax: { type: "number" },
                    tensionArterielleMin: { type: "number" },
                    healthDate: { type: "string", format: "date-time" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    peopleId: { type: "string" },
                    people: { "$ref": "#/components/schemas/Person" },
                    peopleHealthSymptoms: { type: "array", items: { "$ref": "#/components/schemas/PeopleHealthSymptom" } }
                }
            },
            CreatePeopleHealthInput: {
                type: "object",
                required: ["temperatureCorporelle", "poulsMax", "poulsMin", "tensionArterielleMax", "tensionArterielleMin", "peopleId"],
                properties: {
                    temperatureCorporelle: { type: "number" },
                    poulsMax: { type: "number" },
                    poulsMin: { type: "number" },
                    tensionArterielleMax: { type: "number" },
                    tensionArterielleMin: { type: "number" },
                    peopleId: { type: "string" },
                    healthDate: { type: "string", format: "date-time" },
                    peopleHealthSymptomIds: { type: "array", items: { type: "string" } }
                }
            },
            UpdatePeopleHealthInput: {
                type: "object",
                properties: {
                    temperatureCorporelle: { type: "number" },
                    poulsMax: { type: "number" },
                    poulsMin: { type: "number" },
                    tensionArterielleMax: { type: "number" },
                    tensionArterielleMin: { type: "number" },
                    peopleId: { type: "string" },
                    healthDate: { type: "string", format: "date-time" },
                    peopleHealthSymptomIds: { type: "array", items: { type: "string" } }
                }
            },

            PeopleHealthSymptom: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    text: { type: "string" },
                    order: { type: "integer" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            CreatePeopleHealthSymptomInput: {
                type: "object",
                required: ["text", "order"],
                properties: {
                    text: { type: "string" },
                    order: { type: "integer" }
                }
            },
            UpdatePeopleHealthSymptomInput: {
                type: "object",
                properties: {
                    text: { type: "string" },
                    order: { type: "integer" }
                }
            },

            SystemHealth: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    heath: { type: "number" },
                    healthDate: { type: "string", format: "date-time" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    systemId: { type: "string" },
                    system: { "$ref": "#/components/schemas/System" }
                }
            },
            CreateSystemHealthInput: {
                type: "object",
                required: ["heath", "systemId"],
                properties: {
                    heath: { type: "number" },
                    systemId: { type: "string" }
                }
            },
            UpdateSystemHealthInput: {
                type: "object",
                properties: {
                    heath: { type: "number" },
                    systemId: { type: "string" }
                }
            },

            Hacking: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    testOrga: { type: "boolean" },
                    stopedAt: { type: "string", format: "date-time", nullable: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            CreateHackingInput: {
                type: "object",
                properties: {
                    testOrga: { type: "boolean" }
                }
            },
            UpdateHackingInput: {
                type: "object",
                properties: {
                    testOrga: { type: "boolean" },
                    stopedAt: { type: "string", format: "date-time" }
                }
            },

            Error: {
                type: "object",
                properties: errorSchemas
            }
        },
    }
};