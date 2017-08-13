import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Field, reduxForm, propTypes, formValueSelector, getFormSyncErrors, getFormMeta} from "redux-form";
import {required, numericality} from 'redux-form-validators'
import {FormValidation} from '../../utils/form_validation';
import {fetchObjects, fetchResources, setSelectedObject} from "../../actions/actions_objectdb";
import {Button, Form, Loader, Divider, Message, Select, Input} from "semantic-ui-react";
import SRFF from '../../components/Form/SemanticReduxFormField';
import {getObjectsFromDeviceModel} from '../../selectors/selector_devicemodels';
import {makeDebugger} from '../../utils/debug';
import {addAction} from "../../actions/actions_actions";

const debug = makeDebugger('actionform');

class ActionForm extends Component {
    constructor(props) {
        super(props)
    }


    componentWillMount() {
        debug('componentWillMount()');
        this.props.fetchObjects();
        this.props.fetchResources();
        // this.props.onRef(this);
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
        // this.props.onRef(undefined);
    }

    handleSearchObject() {

    }

    handleChangeObject() {

    }

    render() {
        const {initialValues, handleSubmit, reset, pristine, error  } = this.props;
        const {objects, selected_object, selected_instance, selected_command, formErrors, formMeta} = this.props;
        debug('render()', initialValues, formErrors, formMeta);

        const commands = [
            {key: 0, text: 'read', value: 'read'},
            {key: 1, text: 'write', value: 'write'},
            {key: 2, text: 'execute', value: 'execute'},
            {key: 3, text: 'observe', value: 'observe'},
            {key: 4, text: 'writeAttr', value: 'writeAttr'}
        ];

        // Since in the redux-form validate function we don't know if the field has been 'touched'
        // and we want to print am errors summary at the bottom of the form, we check here if
        // the field has been touched and an error is present thanks to getFormMeta() and
        // getFormSyncErrors() respectively.
        let errors_list = [];
        _.each(formMeta, (v, k) => {
            if(v.touched && formErrors[k]){
                errors_list.push(formErrors[k]);
            }
        });

        return (
          <div>
              {initialValues ? (
                <div>
                    <Loader size='large' inline='centered' active>Loading</Loader>
                </div>
              ) : (

                <Form error={!!_.size(errors_list)} ref='addActionForm' onSubmit={handleSubmit}>
                    <Form.Group>

                        <Field component={SRFF} as={Form.Select} name='device_model'
                               placeholder='Choose the device model' required={true} width={6}
                               label="Device model"
                               options={
                                   _.map(this.props.device_models, dm => {
                                       return {key: dm.id, text: dm.name, value: dm.id}
                                   })
                               }
                               format={value => value && value.hasOwnProperty('id') ? value.id : value}
                        />


                        <Field component={SRFF} as={Form.Select} name='command'
                               placeholder='Select the command' required={true} width={5}
                               label="Command"
                               options={commands}

                        />
                        <Field component={SRFF} as={Form.Select} name='execution'
                               placeholder='Execution' required={true} width={5} label="Execute at"
                               options={[{key: 'registration', text: 'Registration', value: 'registration'}]}

                        />
                    </Form.Group>


                    <Form.Group>
                        <Field component={SRFF} as={Form.Dropdown} name='oid'
                               placeholder='Select an object' selection
                               required={true} label="Object" width={6}
                               search={this.handleSearchObject}
                               onChange={this.handleChangeObject}
                               selectOnBlur={false}
                               options={
                                   _.map(objects, obj => {
                                       return {
                                           key: obj.id,
                                           text: obj.shortname + ' ('+obj.id+')',
                                           value: obj.id
                                       }
                                   })
                               }
                        />

                        <Field component={SRFF} as={Form.Select} name='iid'
                               required={true} placeholder='Inst.' label="Instance"
                               width={3}
                               options={
                                   selected_object && _.map(_.range(
                                     _.find(objects, {id: selected_object}).instancesNb), i => {
                                       return {key: i, text: i.toString(), value: i}
                                   })
                               }
                        />


                        <Field component={SRFF} as={Form.Dropdown} name='rid'
                               placeholder='Select a resource' selection
                               required={true} label="Resource" width={7}
                               search={this.handleSearchObject}
                               onChange={this.handleChangeObject}
                               selectOnBlur={false}
                               options={
                                   (selected_object && selected_instance!==undefined) &&
                                   _.map(_.find(objects, {id: selected_object}).resources, res => {
                                       return {
                                           key: res.id,
                                           text: res.shortname + ' ('+res.id+')',
                                           value: res.id
                                       }
                                   })
                               }
                        />

                    </Form.Group>

                    {(selected_command==='write' || selected_command==='writeAttr') &&
                        <Form.Group>
                            <Field component={SRFF} as={Form.Input} name='payload'
                                   placeholder='Enter the payload'
                                   label="Payload" width={16}/>
                        </Form.Group>
                    }

                    <Message error header='Oops...' list={errors_list}/>

                </Form>
              )}
          </div>
        );
    }
}

ActionForm.propTypes = {
    ...propTypes,
};
ActionForm.defaultProps = {
    initialValues: null
};

const onSubmit = (values, dispatch) => {
    debug('onSubmit', values);
    dispatch(addAction(values));
};

const validations = {
    device_model: [required({msg: 'Please select a device model.'})],
    command: [required({msg: 'Please select a command.'})],
    execution: [required({msg: 'Please select an Execution.'})],
    oid: [required({msg: 'Please select an Object.'})],
    iid: [required({msg: 'Please select an Instance.'})],
    rid: [required({msg: 'Please select a Resource.'})],
};

const selector = formValueSelector('ActionForm');
const mapStateToProps = (state, props) => {

    // This 'selector' method is provided by redux-form and allow to get
    // the current value of a particular field. We use these values to dynamically
    // update the different dropdown menus.
    const selected_command = selector(state, 'command');
    const selected_devicemodel = selector(state, 'device_model');
    const selected_object = selector(state, 'oid') || null;
    const selected_instance = selector(state, 'iid');

    return {
        device_models: state.devicemodels.list,
        selected_object,
        selected_instance,
        selected_command,
        objects: getObjectsFromDeviceModel(
          state, selected_devicemodel, selected_command,
          selected_object, selected_instance
        ),
        formErrors: getFormSyncErrors('ActionForm')(state),
        formMeta: getFormMeta('ActionForm')(state),

    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setSelectedObject, fetchObjects, fetchResources}, dispatch);
};

ActionForm = reduxForm({
    validate: FormValidation(validations),
    form: "ActionForm",
    onSubmit
})(ActionForm);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ActionForm);