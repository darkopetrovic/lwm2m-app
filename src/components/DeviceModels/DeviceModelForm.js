import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Field, reduxForm, propTypes, formValueSelector, getFormSyncErrors, getFormMeta} from "redux-form";
import {required, numericality} from 'redux-form-validators'
import {FormValidation} from '../../utils/form_validation';
import {Button, Form, Loader, Divider, Message, Select, Input} from "semantic-ui-react";
import SRFF from '../../components/Form/SemanticReduxFormField';
import {makeDebugger} from '../../utils/debug';
import {getSelectedDeviceModel} from "../../selectors/selector_devicemodels";
import {updateDeviceModel} from "../../actions/actions_devicemodels";

const debug = makeDebugger('DeviceModelForm');

class DeviceModelForm extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        debug('componentWillMount()');
        // fetching ...
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
    }


    render() {
        const {initialValues, handleSubmit} = this.props;
        const {formErrors, formMeta} = this.props;
        debug('render()', initialValues, formErrors, formMeta);

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
              {!initialValues ? (
                <div>
                    <Loader size='large' inline='centered' active>Loading</Loader>
                </div>
              ) : (

                <Form error={!!_.size(errors_list)} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Field component={SRFF} as={Form.Input} name='name'
                               placeholder='Name' required={true} width={8} label="Name"
                        />

                        <Field component={SRFF} as={Form.Input} name='endpoint_prefix'
                               placeholder='Endpoint prefix' required={true} width={8} label="Endpoint prefix"
                        />
                    </Form.Group>
                    <Message error header='Oops...' list={errors_list}/>
                </Form>
              )}
          </div>
        );
    }
}

DeviceModelForm.propTypes = {
    ...propTypes,
};
DeviceModelForm.defaultProps = {
    initialValues: null
};

const onSubmit = (values, dispatch) => {
    // update only the name and endpoint prefix for the moment
    let data = _.omit(values, 'objects');
    debug('onSubmit', data);
    dispatch(updateDeviceModel(data.id, data));
};

const validations = {
    name: [required({msg: 'Please enter a name for the device model.'})],
    endpoint_prefix: [required({msg: 'Please enter an Endpoint prefix for this device model.'})]
};

const selector = formValueSelector('DeviceModelForm');
const mapStateToProps = (state, props) => {
    const sample = selector(state, 'sample');
    return {
        formErrors: getFormSyncErrors('DeviceModelForm')(state),
        formMeta: getFormMeta('DeviceModelForm')(state),
        initialValues: getSelectedDeviceModel(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({updateDeviceModel}, dispatch);
};

DeviceModelForm = reduxForm({
    validate: FormValidation(validations),
    form: "DeviceModelForm",
    onSubmit
})(DeviceModelForm);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(DeviceModelForm);