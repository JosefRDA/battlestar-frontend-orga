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
      url: "https://battlestar.local",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development Server",
    },
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
    {
      url: "https://api.battlestar.local",
      description: "Production Server",
    },
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
                  items: { $ref: "#/components/schemas/User" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreateUserInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/User",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "User found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/User",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateUserInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "User updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/User",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateUserInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "User updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/User",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
                  items: { $ref: "#/components/schemas/Person" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreatePersonInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Person created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Person",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Person found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Person",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdatePersonInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Person updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Person",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePersonInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Person updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Person",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Person with latest health",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PersonWithHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Person with latest health",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PersonWithHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== LEGACY REPARATIONS ==========
    "/legacy-reparations": {
      get: {
        summary: "List all legacy reparations",
        operationId: "listLegacyReparations",
        tags: ["LegacyReparations"],
        responses: {
          "200": {
            description: "List of legacy reparations",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/LegacyReparation" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a legacy reparation",
        operationId: "createLegacyReparation",
        tags: ["LegacyReparations"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateLegacyReparationInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Legacy reparation created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyReparation",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/legacy-reparations/{id}": {
      get: {
        summary: "Get legacy reparation by ID",
        operationId: "getLegacyReparation",
        tags: ["LegacyReparations"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Reparation ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Legacy reparation found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyReparation",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update legacy reparation",
        operationId: "updateLegacyReparation",
        tags: ["LegacyReparations"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Reparation ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateLegacyReparationInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Legacy reparation updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyReparation",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update legacy reparation",
        operationId: "replaceLegacyReparation",
        tags: ["LegacyReparations"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Reparation ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateLegacyReparationInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Legacy reparation updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyReparation",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete legacy reparation",
        operationId: "deleteLegacyReparation",
        tags: ["LegacyReparations"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Reparation ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/legacy-reparations/system/{systemId}": {
      get: {
        summary: "Get active legacy reparation for system",
        operationId: "getActiveLegacyReparationForSystem",
        tags: ["LegacyReparations"],
        parameters: [
          {
            name: "systemId",
            in: "path",
            description: "System ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Active legacy reparation",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyReparation",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/legacy-reparations/{id}/fix": {
      post: {
        summary: "Fix legacy reparation",
        operationId: "fixLegacyReparation",
        tags: ["LegacyReparations"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Reparation ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Legacy reparation fixed",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyReparation",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
                  items: { $ref: "#/components/schemas/System" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreateSystemInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "System created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/System",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
                  items: { $ref: "#/components/schemas/SystemWithHealths" },
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "System found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/System",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateSystemInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "System updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/System",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateSystemInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "System updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/System",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== LEGACY PARTS ==========
    "/legacy-parts": {
      get: {
        summary: "List all legacy parts",
        operationId: "listLegacyParts",
        tags: ["LegacyParts"],
        responses: {
          "200": {
            description: "List of legacy parts",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/LegacyPart" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a legacy part",
        operationId: "createLegacyPart",
        tags: ["LegacyParts"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateLegacyPartInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Legacy part created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyPart",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/legacy-parts/{id}": {
      get: {
        summary: "Get legacy part by ID",
        operationId: "getLegacyPart",
        tags: ["LegacyParts"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Part ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Legacy part found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyPart",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update legacy part",
        operationId: "updateLegacyPart",
        tags: ["LegacyParts"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Part ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateLegacyPartInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Legacy part updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyPart",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update legacy part",
        operationId: "replaceLegacyPart",
        tags: ["LegacyParts"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Part ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateLegacyPartInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Legacy part updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyPart",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete legacy part",
        operationId: "deleteLegacyPart",
        tags: ["LegacyParts"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Part ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== LEGACY INCIDENTS ==========
    "/legacy-incidents": {
      get: {
        summary: "List all legacy incidents",
        operationId: "listLegacyIncidents",
        tags: ["LegacyIncidents"],
        responses: {
          "200": {
            description: "List of legacy incidents",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/LegacyIncident" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a legacy incident",
        operationId: "createLegacyIncident",
        tags: ["LegacyIncidents"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateLegacyIncidentInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Legacy incident created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyIncident",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/legacy-incidents/{id}": {
      get: {
        summary: "Get legacy incident by ID",
        operationId: "getLegacyIncident",
        tags: ["LegacyIncidents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Incident ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Legacy incident found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyIncident",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update legacy incident",
        operationId: "updateLegacyIncident",
        tags: ["LegacyIncidents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Incident ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateLegacyIncidentInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Legacy incident updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyIncident",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update legacy incident",
        operationId: "replaceLegacyIncident",
        tags: ["LegacyIncidents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Incident ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateLegacyIncidentInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Legacy incident updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/LegacyIncident",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete legacy incident",
        operationId: "deleteLegacyIncident",
        tags: ["LegacyIncidents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Legacy Incident ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
                  items: { $ref: "#/components/schemas/PeopleHealth" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreatePeopleHealthInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "People health created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealth",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "People health found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdatePeopleHealthInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "People health updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePeopleHealthInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "People health updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
                  items: { $ref: "#/components/schemas/PeopleHealthSymptom" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreatePeopleHealthSymptomInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Symptom created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealthSymptom",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Symptom found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealthSymptom",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdatePeopleHealthSymptomInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Symptom updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealthSymptom",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePeopleHealthSymptomInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Symptom updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PeopleHealthSymptom",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
                  items: { $ref: "#/components/schemas/SystemHealth" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreateSystemHealthInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "System health created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SystemHealth",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "System health found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SystemHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateSystemHealthInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "System health updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SystemHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateSystemHealthInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "System health updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SystemHealth",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
                  items: { $ref: "#/components/schemas/Hacking" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreateHackingInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Hacking created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Hacking",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Hacking found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Hacking",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateHackingInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Hacking updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Hacking",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateHackingInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Hacking updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Hacking",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Hacking started",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Hacking",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Hacking stopped",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Hacking",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== ADMIN ==========
    "/admin/legacy-parts/seed": {
      post: {
        summary: "Seed legacy parts",
        operationId: "seedLegacyParts",
        tags: ["Admin"],
        responses: {
          "201": {
            description: "Legacy parts seeded",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/LegacyPart" },
                    },
                    message: { type: "string" },
                  },
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/admin/legacy-incidents/seed": {
      post: {
        summary: "Seed legacy incidents",
        operationId: "seedLegacyIncidents",
        tags: ["Admin"],
        responses: {
          "201": {
            description: "Legacy incidents seeded",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/LegacyIncident" },
                    },
                    message: { type: "string" },
                  },
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    message: { type: "string" },
                  },
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/admin/legacy-reparations/seed": {
      post: {
        summary: "Seed legacy reparations",
        operationId: "seedLegacyReparations",
        tags: ["Admin"],
        responses: {
          "201": {
            description: "Legacy reparations seeded",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/LegacyReparation" },
                    },
                    message: { type: "string" },
                  },
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/System" },
                    },
                    message: { type: "string" },
                  },
                }),
              },
            },
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
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SystemHealth" },
                    },
                    message: { type: "string" },
                  },
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Person" },
                    },
                    message: { type: "string" },
                  },
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== PART TYPES ==========
    "/part-types": {
      get: {
        summary: "List all part types",
        operationId: "listPartTypes",
        tags: ["PartTypes"],
        responses: {
          "200": {
            description: "List of part types",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/PartType" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a part type",
        operationId: "createPartType",
        tags: ["PartTypes"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePartTypeInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Part type created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartType",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/part-types/{id}": {
      get: {
        summary: "Get part type by ID",
        operationId: "getPartType",
        tags: ["PartTypes"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Type ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Part type found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartType",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update part type",
        operationId: "updatePartType",
        tags: ["PartTypes"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Type ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdatePartTypeInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part type updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartType",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update part type",
        operationId: "replacePartType",
        tags: ["PartTypes"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Type ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePartTypeInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part type updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartType",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete part type",
        operationId: "deletePartType",
        tags: ["PartTypes"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Type ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== PART PLACES ==========
    "/part-places": {
      get: {
        summary: "List all part places",
        operationId: "listPartPlaces",
        tags: ["PartPlaces"],
        responses: {
          "200": {
            description: "List of part places",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/PartPlace" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a part place",
        operationId: "createPartPlace",
        tags: ["PartPlaces"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePartPlaceInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Part place created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartPlace",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/part-places/{id}": {
      get: {
        summary: "Get part place by ID",
        operationId: "getPartPlace",
        tags: ["PartPlaces"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Place ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Part place found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartPlace",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update part place",
        operationId: "updatePartPlace",
        tags: ["PartPlaces"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Place ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdatePartPlaceInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part place updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartPlace",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update part place",
        operationId: "replacePartPlace",
        tags: ["PartPlaces"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Place ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePartPlaceInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part place updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartPlace",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete part place",
        operationId: "deletePartPlace",
        tags: ["PartPlaces"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Place ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
                  items: { $ref: "#/components/schemas/Part" },
                }),
              },
            },
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
                $ref: "#/components/schemas/CreatePartInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Part created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Part",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Part found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Part",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdatePartInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Part",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePartInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Part",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
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
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== PART EVENTS ==========
    "/part-events": {
      get: {
        summary: "List all part events",
        operationId: "listPartEvents",
        tags: ["PartEvents"],
        responses: {
          "200": {
            description: "List of part events",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/PartEvent" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a part event",
        operationId: "createPartEvent",
        tags: ["PartEvents"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePartEventInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Part event created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartEvent",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/part-events/{id}": {
      get: {
        summary: "Get part event by ID",
        operationId: "getPartEvent",
        tags: ["PartEvents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Event ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Part event found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartEvent",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update part event",
        operationId: "updatePartEvent",
        tags: ["PartEvents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Event ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdatePartEventInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part event updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartEvent",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update part event",
        operationId: "replacePartEvent",
        tags: ["PartEvents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Event ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreatePartEventInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Part event updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/PartEvent",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete part event",
        operationId: "deletePartEvent",
        tags: ["PartEvents"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Part Event ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== TERMINALS ==========
    "/terminals": {
      get: {
        summary: "List all terminals",
        operationId: "listTerminals",
        tags: ["Terminals"],
        responses: {
          "200": {
            description: "List of terminals",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/Terminal" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a terminal",
        operationId: "createTerminal",
        tags: ["Terminals"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateTerminalInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Terminal created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Terminal",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/terminals/{id}": {
      get: {
        summary: "Get terminal by ID",
        operationId: "getTerminal",
        tags: ["Terminals"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Terminal ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Terminal found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Terminal",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update terminal",
        operationId: "updateTerminal",
        tags: ["Terminals"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Terminal ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateTerminalInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Terminal updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Terminal",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update terminal",
        operationId: "replaceTerminal",
        tags: ["Terminals"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Terminal ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateTerminalInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Terminal updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Terminal",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete terminal",
        operationId: "deleteTerminal",
        tags: ["Terminals"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Terminal ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "No content" },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },

    // ========== SPACE SHIPS ==========
    "/space-ships": {
      get: {
        summary: "List all space ships",
        operationId: "listSpaceShips",
        tags: ["SpaceShips"],
        responses: {
          "200": {
            description: "List of space ships",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  type: "array",
                  items: { $ref: "#/components/schemas/SpaceShip" },
                }),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a space ship",
        operationId: "createSpaceShip",
        tags: ["SpaceShips"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateSpaceShipInput",
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Space ship created",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SpaceShip",
                }),
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
    },
    "/space-ships/{id}": {
      get: {
        summary: "Get space ship by ID",
        operationId: "getSpaceShip",
        tags: ["SpaceShips"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Space Ship ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Space ship found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SpaceShip",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      patch: {
        summary: "Partially update space ship",
        operationId: "updateSpaceShip",
        tags: ["SpaceShips"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Space Ship ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/UpdateSpaceShipInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Space ship updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SpaceShip",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      put: {
        summary: "Fully update space ship",
        operationId: "replaceSpaceShip",
        tags: ["SpaceShips"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Space Ship ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: wrapSchemaWithResponse({
                $ref: "#/components/schemas/CreateSpaceShipInput",
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Space ship updated",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/SpaceShip",
                }),
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete space ship",
        operationId: "deleteSpaceShip",
        tags: ["SpaceShips"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Space Ship ID",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": {
            description: "No content",
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: wrapSchemaWithResponse({
                  $ref: "#/components/schemas/Error",
                }),
              },
            },
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
          role: {
            type: "array",
            items: { type: "string", enum: ["Admin", "User", "Hacker"] },
          },
          picture: { type: "string" },
          isHacker: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          people: { $ref: "#/components/schemas/Person" },
        },
      },
      CreateUserInput: {
        type: "object",
        required: ["rifd", "name"],
        properties: {
          rifd: { type: "string" },
          name: { type: "string" },
          role: {
            type: "array",
            items: { type: "string", enum: ["Admin", "User", "Hacker"] },
          },
          picture: { type: "string" },
          isHacker: { type: "boolean" },
        },
      },
      UpdateUserInput: {
        type: "object",
        properties: {
          rifd: { type: "string" },
          name: { type: "string" },
          role: {
            type: "array",
            items: { type: "string", enum: ["Admin", "User", "Hacker"] },
          },
          picture: { type: "string" },
          isHacker: { type: "boolean" },
        },
      },

      Person: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          sexe: { type: "string", enum: ["MASCULIN", "FEMININ"] },
          adulte: { type: "boolean" },
          mort: { type: "boolean" },
          dateNaissance: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          dateMort: { type: "string", format: "date-time", nullable: true },
          userId: { type: "string", nullable: true },
          user: { $ref: "#/components/schemas/User" },
          peopleHealths: {
            type: "array",
            items: { $ref: "#/components/schemas/PeopleHealth" },
          },
        },
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
          userId: { type: "string" },
        },
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
          userId: { type: "string" },
        },
      },
      PersonWithHealth: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          sexe: { type: "string", enum: ["MASCULIN", "FEMININ"] },
          adulte: { type: "boolean" },
          mort: { type: "boolean" },
          dateNaissance: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
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
              symptoms: {
                type: "array",
                items: { $ref: "#/components/schemas/PeopleHealthSymptom" },
              },
            },
          },
        },
      },

      Reparation: {
        type: "object",
        properties: {
          id: { type: "string" },
          systemId: { type: "integer" },
          fixed: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          system: { $ref: "#/components/schemas/System" },
          partsNeededToFix: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyPart" },
          },
        },
      },
      CreateReparationInput: {
        type: "object",
        required: ["systemId"],
        properties: {
          systemId: { type: "integer" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
      },
      UpdateReparationInput: {
        type: "object",
        properties: {
          systemId: { type: "integer" },
          fixed: { type: "boolean" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
      },

      System: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          order: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          healths: {
            type: "array",
            items: { $ref: "#/components/schemas/SystemHealth" },
          },
          reparations: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyReparation" },
          },
        },
      },
      CreateSystemInput: {
        type: "object",
        required: ["name", "order"],
        properties: {
          name: { type: "string" },
          order: { type: "integer" },
        },
      },
      UpdateSystemInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          order: { type: "integer" },
        },
      },
      SystemWithHealths: {
        allOf: [
          { $ref: "#/components/schemas/System" },
          {
            type: "object",
            properties: {
              healths: {
                type: "array",
                items: { $ref: "#/components/schemas/SystemHealth" },
              },
            },
          },
        ],
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
          canBeUsedInIncidents: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyIncident" },
          },
          canBeUsedReparation: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyReparation" },
          },
        },
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
          canBeUsedInReparationIds: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      UpdatePartInput: {
        type: "object",
        properties: {
          rifd: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          canBeUsedInIncidentsIds: { type: "array", items: { type: "string" } },
          canBeUsedInReparationIds: {
            type: "array",
            items: { type: "string" },
          },
        },
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
          partsNeededToFix: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyPart" },
          },
        },
      },
      CreateIncidentInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
      },
      UpdateIncidentInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
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
          people: { $ref: "#/components/schemas/Person" },
          peopleHealthSymptoms: {
            type: "array",
            items: { $ref: "#/components/schemas/PeopleHealthSymptom" },
          },
        },
      },
      CreatePeopleHealthInput: {
        type: "object",
        required: [
          "temperatureCorporelle",
          "poulsMax",
          "poulsMin",
          "tensionArterielleMax",
          "tensionArterielleMin",
          "peopleId",
        ],
        properties: {
          temperatureCorporelle: { type: "number" },
          poulsMax: { type: "number" },
          poulsMin: { type: "number" },
          tensionArterielleMax: { type: "number" },
          tensionArterielleMin: { type: "number" },
          peopleId: { type: "string" },
          healthDate: { type: "string", format: "date-time" },
          peopleHealthSymptomIds: { type: "array", items: { type: "string" } },
        },
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
          peopleHealthSymptomIds: { type: "array", items: { type: "string" } },
        },
      },

      PeopleHealthSymptom: {
        type: "object",
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          order: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreatePeopleHealthSymptomInput: {
        type: "object",
        required: ["text", "order"],
        properties: {
          text: { type: "string" },
          order: { type: "integer" },
        },
      },
      UpdatePeopleHealthSymptomInput: {
        type: "object",
        properties: {
          text: { type: "string" },
          order: { type: "integer" },
        },
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
          system: { $ref: "#/components/schemas/System" },
        },
      },
      CreateSystemHealthInput: {
        type: "object",
        required: ["heath", "systemId"],
        properties: {
          heath: { type: "number" },
          systemId: { type: "string" },
        },
      },
      UpdateSystemHealthInput: {
        type: "object",
        properties: {
          heath: { type: "number" },
          systemId: { type: "string" },
        },
      },

      Hacking: {
        type: "object",
        properties: {
          id: { type: "string" },
          testOrga: { type: "boolean" },
          stopedAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateHackingInput: {
        type: "object",
        properties: {
          testOrga: { type: "boolean" },
        },
      },
      UpdateHackingInput: {
        type: "object",
        properties: {
          testOrga: { type: "boolean" },
          stopedAt: { type: "string", format: "date-time" },
        },
      },

      // Legacy schemas (renamed models for API versioning)
      LegacyPart: {
        type: "object",
        properties: {
          id: { type: "string" },
          rifd: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          canBeUsedInIncidents: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyIncident" },
          },
          canBeUsedReparation: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyReparation" },
          },
        },
      },
      CreateLegacyPartInput: {
        type: "object",
        required: ["rifd", "name", "description"],
        properties: {
          rifd: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          canBeUsedInIncidentsIds: { type: "array", items: { type: "string" } },
          canBeUsedInReparationIds: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      UpdateLegacyPartInput: {
        type: "object",
        properties: {
          rifd: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          canBeUsedInIncidentsIds: { type: "array", items: { type: "string" } },
          canBeUsedInReparationIds: {
            type: "array",
            items: { type: "string" },
          },
        },
      },

      LegacyIncident: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          partsNeededToFix: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyPart" },
          },
        },
      },
      CreateLegacyIncidentInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
      },
      UpdateLegacyIncidentInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          picture: { type: "string" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
      },

      LegacyReparation: {
        type: "object",
        properties: {
          id: { type: "string" },
          systemId: { type: "integer" },
          fixed: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          system: { $ref: "#/components/schemas/System" },
          partsNeededToFix: {
            type: "array",
            items: { $ref: "#/components/schemas/LegacyPart" },
          },
        },
      },
      CreateLegacyReparationInput: {
        type: "object",
        required: ["systemId"],
        properties: {
          systemId: { type: "integer" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
      },
      UpdateLegacyReparationInput: {
        type: "object",
        properties: {
          systemId: { type: "integer" },
          fixed: { type: "boolean" },
          partsNeededToFixIds: { type: "array", items: { type: "string" } },
        },
      },

      Error: {
        type: "object",
        properties: errorSchemas,
      },

      // ========== NEW MODELS ==========

      PartType: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          systemId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          system: { $ref: "#/components/schemas/System" },
          parts: {
            type: "array",
            items: { $ref: "#/components/schemas/Part" },
          },
        },
      },
      CreatePartTypeInput: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          systemId: { type: "string" },
        },
      },
      UpdatePartTypeInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          systemId: { type: "string" },
        },
      },

      Part: {
        type: "object",
        properties: {
          id: { type: "string" },
          rifd: { type: "string" },
          partQuality: { type: "integer" },
          partTypeId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          partType: { $ref: "#/components/schemas/PartType" },
          partEvents: {
            type: "array",
            items: { $ref: "#/components/schemas/PartEvent" },
          },
        },
      },
      CreatePartInput: {
        type: "object",
        required: ["rifd", "partQuality"],
        properties: {
          rifd: { type: "string" },
          partQuality: { type: "integer" },
          partTypeId: { type: "string" },
        },
      },
      UpdatePartInput: {
        type: "object",
        properties: {
          rifd: { type: "string" },
          partQuality: { type: "integer" },
          partTypeId: { type: "string" },
        },
      },

      PartEvent: {
        type: "object",
        properties: {
          id: { type: "string" },
          partEventType: {
            type: "string",
            enum: [
              "creation",
              "destruction",
              "changement_place",
              "scan",
              "evenement_systeme",
              "changement_sante",
            ],
          },
          partHealth: { type: "integer" },
          partId: { type: "string", nullable: true },
          userId: { type: "string", nullable: true },
          partPlaceId: { type: "string", nullable: true },
          terminalId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          part: { $ref: "#/components/schemas/Part" },
          author: { $ref: "#/components/schemas/User" },
          place: { $ref: "#/components/schemas/PartPlace" },
          terminal: { $ref: "#/components/schemas/Terminal" },
        },
      },
      CreatePartEventInput: {
        type: "object",
        required: ["partEventType", "partHealth"],
        properties: {
          partEventType: {
            type: "string",
            enum: [
              "creation",
              "destruction",
              "changement_place",
              "scan",
              "evenement_systeme",
              "changement_sante",
            ],
          },
          partHealth: { type: "integer" },
          partId: { type: "string" },
          userId: { type: "string" },
          partPlaceId: { type: "string" },
          terminalId: { type: "string" },
        },
      },
      UpdatePartEventInput: {
        type: "object",
        properties: {
          partEventType: {
            type: "string",
            enum: [
              "creation",
              "destruction",
              "changement_place",
              "scan",
              "evenement_systeme",
              "changement_sante",
            ],
          },
          partHealth: { type: "integer" },
          partId: { type: "string" },
          userId: { type: "string" },
          partPlaceId: { type: "string" },
          terminalId: { type: "string" },
        },
      },

      Terminal: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          userAgent: { type: "string" },
          spaceShipId: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          spaceShip: { $ref: "#/components/schemas/SpaceShip" },
          partEvents: {
            type: "array",
            items: { $ref: "#/components/schemas/PartEvent" },
          },
        },
      },
      CreateTerminalInput: {
        type: "object",
        required: ["name", "userAgent"],
        properties: {
          name: { type: "string" },
          userAgent: { type: "string" },
          spaceShipId: { type: "string" },
        },
      },
      UpdateTerminalInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          userAgent: { type: "string" },
          spaceShipId: { type: "string" },
        },
      },

      SpaceShip: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          terminals: {
            type: "array",
            items: { $ref: "#/components/schemas/Terminal" },
          },
        },
      },
      CreateSpaceShipInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
      UpdateSpaceShipInput: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },

      // PartPlace schema (existing model, needed for PartEvent references)
      PartPlace: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          type: { type: "string", enum: ["Monte", "Reserve", "Autre"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          partEvents: {
            type: "array",
            items: { $ref: "#/components/schemas/PartEvent" },
          },
        },
      },
      CreatePartPlaceInput: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["Monte", "Reserve", "Autre"] },
        },
      },
      UpdatePartPlaceInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["Monte", "Reserve", "Autre"] },
        },
      },
    },
  },
};
