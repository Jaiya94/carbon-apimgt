/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Joi from '@hapi/joi';
import API from 'AppData/api';

/**
 * Get the base error message for error types.
 * This error overrides the default error messages of joi and adds simple error messages.
 *
 * @param {string} errorType The joi error type
 * @return {string} simplified error message.
 * */
function getMessage(errorType) {
    switch (errorType) {
        case 'any.empty':
            return 'should not be empty';
        case 'string.regex.base':
            return 'should not contain spaces or special characters';
        default:
            return 'should not be empty';
    }
}

/*
* eslint validation rule for no-unused-vars has been disabled in this component.
* According to the Joi extension, it is required to provide required four input
* arguments to custom Joi schema validate function.
* Ref: https://hapi.dev/family/joi/?v=15.1.1#extendextension
*/
const roleSchema = Joi.extend(joi => ({
    base: joi.string(),
    name: 'systemRole',
    rules: [
        {
            name: 'role',
            validate(params, value, state, options) { // eslint-disable-line no-unused-vars
                const api = new API();
                return api.validateSystemRole(value);
            },
        },
    ],
}));

const userRoleSchema = Joi.extend(joi => ({
    base: joi.string(),
    name: 'userRole',
    rules: [
        {
            name: 'role',
            validate(params, value, state, options) { // eslint-disable-line no-unused-vars
                const api = new API();
                return api.validateUSerRole(value);
            },
        },
    ],
}));

const apiSchema = Joi.extend(joi => ({
    base: joi.string(),
    name: 'api',
    rules: [
        {
            name: 'isAPIParameterExist',
            validate(params, value, state, options) { // eslint-disable-line no-unused-vars
                const api = new API();
                return api.validateAPIParameter(value);
            },
        },
    ],
}));

const documentSchema = Joi.extend(joi => ({
    base: joi.object(),
    name: 'document',
    rules: [
        {
            name: 'isDocumentPresent',
            validate(params, value, state, options) { // eslint-disable-line no-unused-vars
                const api = new API();
                return api.validateDocumentExists(value.id, value.name);
            },
        },
    ],
}));

const definition = {
    apiName: Joi.string().regex(/^[^~!@#;:%^*()+={}|\\<>"',&/$]+$/).required().error((errors) => {
        const tmpErrors = [...errors];
        errors.forEach((err, index) => {
            const tmpError = { ...err };
            tmpError.message = 'API Name ' + getMessage(err.type);
            tmpErrors[index] = tmpError;
        });
        return tmpErrors;
    }),
    apiVersion: Joi.string().regex(/^[^~!@#;:%^*()+={}|\\<>"',&/$]+$/).required().error((errors) => {
        const tmpErrors = [...errors];
        errors.forEach((err, index) => {
            const tmpError = { ...err };
            tmpError.message = 'API Version ' + getMessage(err.type);
            tmpErrors[index] = tmpError;
        });
        return tmpErrors;
    }),
    apiContext: Joi.string().regex(/(?!.*\/t\/.*|.*\/t$)^[/a-zA-Z0-9/]{1,50}$/).required().error((errors) => {
        const tmpErrors = [...errors];
        errors.forEach((err, index) => {
            const tmpError = { ...err };
            tmpError.message = 'API Context ' + getMessage(err.type);
            tmpErrors[index] = tmpError;
        });
        return tmpErrors;
    }),
    role: roleSchema.systemRole().role(),
    url: Joi.string().uri(),
    userRole: userRoleSchema.userRole().role(),
    apiParameter: apiSchema.api().isAPIParameterExist(),
    apiDocument: documentSchema.document().isDocumentPresent(),
    operationVerbs: Joi.array().items(Joi.string()).min(1).unique(),
    operationTarget: Joi.string().required(),
    name: Joi.string().min(1).max(255),
    email: Joi.string().email({ tlds: true }).required(),
};

export default definition;
