import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Field, reduxForm, propTypes} from "redux-form";
import {required, numericality} from 'redux-form-validators'
import {FormValidation} from '../../utils/form_validation';
import {setSelectedObject} from "../../actions/actions_objectdb";
import {Button, Form, Loader, Divider, Message, Select, Input} from "semantic-ui-react";
import {getOwners, getSelectedObject} from "../../selectors/selectors_objects";
import SRFF from '../../components/Form/SemanticReduxFormField';

import {makeDebugger} from '../../utils/debug';

const debug = makeDebugger('objectedit');

//
const FIELDS = {
    id: {
        label: 'ID',
        required: true,
        error_message: 'The field ID is required.',
    },
    name: {
        label: 'Name',
        required: false,
        placeholder: 'Enter a name'
    },
    shortname: {
        label: 'Shortname',
        required: true,
        placeholder: 'Shortname',
        error_message: 'Please provide a nice shortname for the object.'
    },
    description: {
        label: 'Description',
        required: false,
        placeholder: 'Enter a short decription for the object'
    },
    owner: {
        label: 'Owner',
        required: false,
        placeholder: 'Select the owner of this object'
    },
};


class ObjectEdit extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        debug('componentDidMount()');
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
    }

    onSubmit(values) {
        debug('onSubmit', values);
    }

    render() {
        const {initialValues, handleSubmit, reset, pristine, error} = this.props;
        debug('render()', initialValues, error);

        return (
          <div className="container-object-edit">
              {!initialValues ? (
                <div>
                    <Loader size='large' inline='centered' active>Loading</Loader>
                </div>
              ) : (


                <Form error={!!error} onSubmit={() => handleSubmit(this.onSubmit.bind(this))}>
                    <Divider/>
                    <Form.Group>
                        <Field component={SRFF} as={Form.Input} name='id' placeholder='ID'
                               required={true} label="ID" width={3}/>

                        <Field component={SRFF} as={Form.Input} name='name'
                               placeholder='Enter a name' label="Name" width={7}/>

                        <Field component={SRFF} as={Form.Input} name='shortname'
                               placeholder='Enter a shortname'
                               required={true} label="Shortname" width={6}/>

                    </Form.Group>
                    <Form.Group>
                        <Field component={SRFF} as={Form.Input} name='description'
                               placeholder='Enter a short description for the object'
                               label="Description" width={16}/>
                    </Form.Group>
                    <Form.Group>
                        <Field component={SRFF} as={Form.Select} name='owner'
                               placeholder='owner' required={true} width={16} label="owner"
                               options={
                                   _.map(this.props.owners, owner => {
                                       return {key: owner.id, text: owner.name, value: owner.id}
                                   })
                               }
                               format={value => value && value.hasOwnProperty('id') ? value.id : value}
                        />
                    </Form.Group>
                    <Message error header='Oops...' list={error}/>
                    <Divider/>
                    <Button basic disabled={pristine || !!error} positive icon='save'
                            content='Save'/>
                    <Button basic icon='cancel' content='Close'
                            floated='right' onClick={() => {
                        this.props.setSelectedObject(null)
                    }}/>
                </Form>
              )}
          </div>
        );
    }
}

ObjectEdit.propTypes = {
    ...propTypes,
};
ObjectEdit.defaultProps = {
    initialValues: null
};


const validations = {
    id: [required({msg: 'The field ID is required.'}),
        numericality({
            '<=': 32768,
            msg: 'Object ID cannot be greater than 32768 (OMA LwM2M v1.0).'
        })],
    shortname: [required({msg: 'Please provide a nice shortname for the object'})]
};

const mapStateToProps = (state) => {
    return {
        initialValues: getSelectedObject(state),
        owners: getOwners(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setSelectedObject}, dispatch);
};

ObjectEdit = reduxForm({
    validate: FormValidation(validations),
    form: "EditObjectForm",
    fields: _.keys(FIELDS)
})(ObjectEdit);

export default connect(mapStateToProps, mapDispatchToProps)(ObjectEdit);