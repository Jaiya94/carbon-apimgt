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
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { FormattedMessage, injectIntl, } from 'react-intl';
import Alert from '../../../Shared/Alert';
import API from '../../../../data/api';

const styles = theme => ({
    commentIcon: {
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    content: {
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    contentWrapper: {
        maxWidth: theme.custom.contentAreaWidth,
        paddingLeft: theme.spacing.unit * 2,
        paddingTop: theme.spacing.unig,
        marginTop: theme.spacing.unit * 2,
    },
    textField: {
        marginTop: 0,
        marginRight: 5,
        width: '100%',
    },
    commentAddWrapper: {
        display: 'flex',
        alignItems: 'top',
    }
});

/**
 * Display a component to add a new comment
 * @class CommmentAdd
 * @extends {React.Component}
 */
class CommentAdd extends React.Component {
    /**
     * Creates an instance of CommentAdd
     * @param {*} props properies passed by the parent element
     * @memberof CommentAdd
     */
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            currentLength: 0,
        };
        this.inputChange = this.inputChange.bind(this);
        this.handleClickAddComment = this.handleClickAddComment.bind(this);
        this.handleClickCancel = this.handleClickCancel.bind(this);
        //this.handleCategoryChange = this.handleCategoryChange.bind(this);
        //this.filterCommentToAddReply = this.filterCommentToAddReply.bind(this);
    }

    /**
     * Handles the comment text when input changes
     * @param {Object} {target} target element
     * @memberof CommentAdd
     */
    inputChange({ target }) {
        this.setState({ content: target.value, currentLength: target.value.length });
    }

    /**
     * Hides the component to add a new comment when cancelled
     * @memberof CommentAdd
     */
    handleClickCancel() {
        this.setState({content:""})
        // const { toggleShowReply } = this.props;
        // toggleShowReply();
    }

    // /**
    //  * Filters the comment to add the reply
    //  * @memberof CommentAdd
    //  */
    // filterCommentToAddReply(commentToFilter) {
    //     const { parentCommentId } = this.props;
    //     return commentToFilter.commentId === parentCommentId;
    // }

    /**
     * Handles adding a new comment
     * @memberof CommentAdd
     */
    handleClickAddComment() {
        const {
            apiId, allComments, commentsUpdate, intl,
        } = this.props;
        const { content } = this.state;
        const Api = new API();
        const comment = {
            content: content.trim(),
        };

        // to check whether a string does not contain only white spaces
        if (comment.content.replace(/\s/g, '').length) {
            Api.addComment(apiId, comment)
                .then((newComment) => {
                    this.setState({ content: ''});
                    const addedComment = newComment.body;
                    // if (parentCommentId === null) {
                    //     allComments.push(addedComment);
                    // } else {
                    //     const index = allComments.findIndex(this.filterCommentToAddReply);
                    //     allComments[index].replies.push(addedComment);
                    //     toggleShowReply();
                    // }
                    allComments.push(addedComment)
                    commentsUpdate(allComments);
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response && error.response.body && error.response.body.message) {
                        Alert.error(error.response.body.message);
                    } else {
                        Alert.error(
                            intl.formatMessage({
                                defaultMessage: 'Something went wrong while adding the comment',
                                id: 'Apis.Details.Comments.CommentAdd.something.went.wrong',
                            }),
                        );
                    }
                });
        } else {
            Alert.error(
                intl.formatMessage({
                    defaultMessage: 'You cannot enter a blank comment',
                    id: 'Apis.Details.Comments.CommentAdd.error.blank.comment',
                }),
            );
        }
        this.setState({ currentLength: 0 });
    }

    /**
     * Render method of the component
     * @returns {React.Component} Comment html component
     * @memberof CommentAdd
     */
    render() {
        const {
            classes, cancelButton, theme, intl,
        } = this.props;
        const { content, currentLength } = this.state;
        return (
            <Grid container spacing={3} className={classes.contentWrapper}>
                <Grid item xs zeroMinWidth>
                    <div className={classes.commentAddWrapper}>
                        <TextField
                            id='standard-multiline-flexible'
                            autoFocus
                            multiline
                            className={classes.textField}
                            margin='normal'
                            placeholder={intl.formatMessage({
                                defaultMessage: 'Write a comment',
                                id: 'Apis.Details.Comments.CommentAdd.write.comment.help',
                            })}
                            inputProps={{ maxLength: theme.custom.maxCommentLength }}
                            value={content}
                            onChange={this.inputChange}
                            variant="outlined"
                        />
                        <Typography className={classes.content} align='left'>
                            {currentLength + '/' + theme.custom.maxCommentLength}
                        </Typography>
                    </div>
                    <Grid container spacing={1}>
                        <Grid item>
                            <Button variant='contained' color='primary' disabled={currentLength === 0} onClick={() => this.handleClickAddComment()}>
                                <FormattedMessage
                                    id='Apis.Details.Comments.CommentAdd.btn.add.comment'
                                    defaultMessage='Add Comment'
                                />
                            </Button>
                        </Grid>
                        {cancelButton && (
                            <Grid item>
                                <Button onClick={() => this.handleClickCancel()} className={classes.button}>
                                    <FormattedMessage
                                        id='Apis.Details.Comments.CommentAdd.btn.cancel'
                                        defaultMessage='Cancel'
                                    />
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

CommentAdd.defaultProps = {
    parentCommentId: null,
    toggleShowReply: null,
    commentsUpdate: null,
};

CommentAdd.propTypes = {
    classes: PropTypes.instanceOf(Object).isRequired,
    cancelButton: PropTypes.bool.isRequired,
    apiId: PropTypes.string.isRequired,
    parentCommentId: PropTypes.string,
    toggleShowReply: PropTypes.func,
    commentsUpdate: PropTypes.func,
    allComments: PropTypes.instanceOf(Array).isRequired,
    intl: PropTypes.shape({
        formatMessage: PropTypes.func,
    }).isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(CommentAdd));
