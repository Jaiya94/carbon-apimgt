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

import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Alert from 'AppComponents/Shared/Alert';
import Progress from 'AppComponents/Shared/Progress';
import API from 'AppData/api';
import { isRestricted } from 'AppData/AuthManager';

const styles = theme => ({
    subscriptionPoliciesPaper: {
        marginTop: theme.spacing.unit * 2,
        padding: theme.spacing(2),
    },
    grid: {
        margin: theme.spacing.unit * 1.25,
    },
    gridLabel: {
        marginTop: theme.spacing.unit * 1.5,
    },
    mainTitle: {
        paddingLeft: 0,
    },
});

/**
 * Manage subscription policies of the API
 * */
class SubscriptionPoliciesManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subscriptionPolicies: {},
            updateInProgress: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        API.policies('subscription')
            .then((res) => {
                this.setState({ subscriptionPolicies: res.body.list });
            })
            .catch((error) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            });
    }

    /**
     * Handle onChange of selected subsription policies
     *
     * @param event onChange event
     */
    handleChange(event) {
        this.setState({ updateInProgress: true });
        const { name, checked } = event.target;
        const { intl, api, updateAPI } = this.props;
        let updatedSelectedPolicies = [...api.policies];

        if (checked) {
            updatedSelectedPolicies.push(name);
        } else {
            updatedSelectedPolicies = updatedSelectedPolicies.filter(policy => policy !== name);
        }

        if (updateAPI) {
            updateAPI({ policies: updatedSelectedPolicies })
                .then(() => {
                    Alert.info(intl.formatMessage({
                        id: 'Apis.Details.Subscriptions.SubscriptionPoliciesManage.policy.update.success',
                        defaultMessage: 'API subscription policies updated successfully',
                    }));
                })
                .catch((error) => {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                    Alert.error(intl.formatMessage({
                        id: 'Apis.Details.Subscriptions.SubscriptionPoliciesManage.policy.update.error',
                        defaultMessage: 'Error occurred while updating subscription policies',
                    }));
                })
                .finally(() => {
                    this.setState({ updateInProgress: false });
                });
        }
    }

    render() {
        const { classes, api } = this.props;
        const { subscriptionPolicies, updateInProgress } = this.state;

        return (
            <React.Fragment>
                <Typography variant='h4'>
                    <FormattedMessage
                        id='Apis.Details.Subscriptions.SubscriptionPoliciesManage.business.plans'
                        defaultMessage='Business Plans'
                    />
                </Typography>
                <Typography variant='caption' gutterBottom>
                    <FormattedMessage
                        id='Apis.Details.Subscriptions.SubscriptionPoliciesManage.sub.heading'
                        defaultMessage='Attach business plans to API'
                    />
                </Typography>
                { updateInProgress && <Progress /> }
                <Paper className={classes.subscriptionPoliciesPaper}>
                    <FormControl className={classes.formControl}>
                        <FormGroup>
                            { subscriptionPolicies && Object.entries(subscriptionPolicies).map(value => (
                                <FormControlLabel
                                    key={value[1].name}
                                    control={<Checkbox
                                        disabled={isRestricted(['apim:api_publish', 'apim:api_create'], api)}
                                        color='primary'
                                        checked={api.policies.includes(value[1].name)}
                                        onChange={e => this.handleChange(e)}
                                        name={value[1].name}
                                    />}
                                    label={value[1].name + ' : ' + value[1].description}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Paper>
            </React.Fragment>
        );
    }
}

SubscriptionPoliciesManage.propTypes = {
    classes: PropTypes.shape({}).isRequired,
    intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
    api: PropTypes.shape({ policies: PropTypes.array }).isRequired,
    updateAPI: PropTypes.func.isRequired,
};

export default injectIntl(withStyles(styles)(SubscriptionPoliciesManage));
