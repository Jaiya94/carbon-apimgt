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

import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ApplicationCreateForm from 'AppComponents/Shared/AppsAndKeys/ApplicationCreateForm';
import API from 'AppData/api';
import Alert from 'AppComponents/Shared/Alert';
import { injectIntl } from 'react-intl';
import ButtonPanel from './ButtonPanel';


const createAppStep = (props) => {
    const APPLICATION_STATES = {
        CREATED: 'CREATED',
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED',
    };
    const [throttlingPolicyList, setThrottlingPolicyList] = useState([]);
    const [applicationRequest, setApplicationRequest] = useState({
        name: '',
        throttlingPolicy: '',
        description: '',
        tokenType: 'JWT',
    });
    const [isNameValid, setIsNameValid] = useState(true);

    const [notFound, setNotFound] = useState(false);
    const {
        currentStep, setCreatedApp, incrementStep, intl, setStepStatus, stepStatuses, classes,
    } = props;

    const validateName = (value) => {
        if (!value || value.trim() === '') {
            setIsNameValid({ isNameValid: false });
            return Promise.reject(new Error(intl.formatMessage({
                defaultMessage: 'Application name is required',
                id: 'Apis.Details.Credentials.Wizard.CreateAppStep.application.name.is.required',
            })));
        }
        setIsNameValid({ isNameValid: true });
        return Promise.resolve(true);
    };

    const createApplication = () => {
        const api = new API();
        validateName(applicationRequest.name)
            .then(() => api.createApplication(applicationRequest))
            .then((response) => {
                const data = response.body;
                if (data.status === APPLICATION_STATES.APPROVED) {
                    const appCreated = { value: data.applicationId, label: data.name };
                    console.log('Application created successfully.');
                    setCreatedApp(appCreated);
                    incrementStep();
                    setStepStatus(stepStatuses.PROCEED);
                } else {
                    setStepStatus(stepStatuses.BLOCKED);
                }
            })
            .catch((error) => {
                const { response } = error;
                if (response && response.body) {
                    const message = response.body.description || intl.formatMessage({
                        defaultMessage: 'Error while creating the application',
                        id: 'Apis.Details.Credentials.Wizard.CreateAppStep.error.while.creating.the.application',
                    });
                    Alert.error(message);
                } else {
                    Alert.error(error.message);
                }
                console.error('Error while creating the application');
            });
    };

    useEffect(() => {
        const api = new API();
        const promiseTiers = api.getAllTiers('application');
        promiseTiers
            .then((response) => {
                const newThrottlingPolicyList = response.body.list.map(item => item.name);
                const newRequest = { ...applicationRequest };
                if (newThrottlingPolicyList.length > 0) {
                    [newRequest.throttlingPolicy] = newThrottlingPolicyList;
                }
                setThrottlingPolicyList(newThrottlingPolicyList);
                setApplicationRequest(newRequest);
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(error);
                }
                const { status } = error;
                if (status === 404) {
                    setNotFound(true);
                }
            });
    }, []);

    return (
        <React.Fragment>
            <Box px={2} display='flex' justifyContent='flex-start'>
                <Grid item xs={10} md={6}>
                    <ApplicationCreateForm
                        throttlingPolicyList={throttlingPolicyList}
                        applicationRequest={applicationRequest}
                        updateApplicationRequest={setApplicationRequest}
                        validateName={validateName}
                        isNameValid={isNameValid}
                    />
                </Grid>
            </Box>
            <ButtonPanel
                classes={classes}
                currentStep={currentStep}
                handleCurrentStep={createApplication}
            />
        </React.Fragment>
    );
};

export default injectIntl(createAppStep);
