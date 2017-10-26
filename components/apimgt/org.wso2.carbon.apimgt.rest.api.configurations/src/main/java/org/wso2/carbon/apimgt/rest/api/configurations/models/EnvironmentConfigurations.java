/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.wso2.carbon.apimgt.rest.api.configurations.models;


import org.wso2.carbon.kernel.annotations.Configuration;
import org.wso2.carbon.kernel.annotations.Element;

import java.util.ArrayList;
import java.util.List;

/**
 * Class to hold Environment configuration parameters
 */
@Configuration(namespace = "wso2.carbon.apmigt.environments", description = "Environment Configaration Paramters")
public class EnvironmentConfigurations {

    @Element(description = "Default Environment Name")
    private String environmentName = "Production";

    @Element(description = "List of Environments")
    private List<Environment> environments = new ArrayList<Environment>();

    public String getEnvironmentName() {
        return environmentName;
    }

    public List<Environment> getEnvironments() {
        return environments;
    }
}