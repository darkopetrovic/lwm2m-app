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
import {getSelectedOwner} from "../../selectors/selectors_owners";
import {addOwner, SELECT_OWNER, updateOwner} from "../../actions/actions_owners";

const debug = makeDebugger('actionform');

class OwnerForm extends Component {
    constructor(props) {
        super(props)
    }


    componentWillMount() {
        debug('componentWillMount()');
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
    }

    onSubmit(values) {
        debug('onSubmit', values);
        const {initialValues, dispatch} = this.props;

        if(initialValues){
            dispatch(updateOwner(values.id, values)).then(()=>{
                dispatch({
                    type: SELECT_OWNER,
                    payload: null
                });
            });
        } else {
            dispatch(addOwner(values));
        }
    };

    render() {
        const {initialValues, handleSubmit, reset, pristine, error  } = this.props;
        const {formErrors, formMeta} = this.props;
        debug('render()', initialValues, formErrors, formMeta);

        this.props.submitRef(handleSubmit(this.onSubmit.bind(this)));

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
            <Form error={!!_.size(errors_list)}>
                <Form.Group>
                    <Field component={SRFF} as={Form.Input} name='name'
                           placeholder='Name' required={true} width={16} label="Name"
                    />
                </Form.Group>

                <Message error header='Oops...' list={errors_list}/>
            </Form>
          </div>
        );
    }
}

OwnerForm.propTypes = {
    ...propTypes,
};
OwnerForm.defaultProps = {
    initialValues: null
};

const validations = {
    name: [required({msg: 'Name is required.'})]
};

const selector = formValueSelector('OwnerForm');
const mapStateToProps = (state, props) => {

    return {
        formErrors: getFormSyncErrors('OwnerForm')(state),
        formMeta: getFormMeta('OwnerForm')(state),
        objects: state.owners.list,
        initialValues: getSelectedOwner(state),
    };
};

function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({}, dispatch)};
}


// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({setSelectedObject, fetchObjects, fetchResources}, dispatch);
// };

OwnerForm = reduxForm({
    validate: FormValidation(validations),
    form: "OwnerForm",
})(OwnerForm);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(OwnerForm);