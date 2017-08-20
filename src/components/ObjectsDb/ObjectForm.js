import _ from 'lodash';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Field, reduxForm, propTypes, getFormSyncErrors, getFormMeta} from "redux-form";
import {required, numericality} from 'redux-form-validators'
import {FormValidation} from '../../utils/form_validation';
import {
    addObject, SELECT_OBJECT, setSelectedObject,
    updateObject
} from "../../actions/actions_objectdb";
import {Button, Form, Loader, Divider, Message, Select, Input} from "semantic-ui-react";
import {getOwners, getSelectedObject} from "../../selectors/selectors_objects";
import SRFF from '../../components/Form/SemanticReduxFormField';

import {makeDebugger} from '../../utils/debug';

const debug = makeDebugger('objectform');

class ObjectForm extends Component {
    constructor(props) {
        super(props);


    }

    componentDidMount() {
        debug('componentDidMount()');
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
    }


    onSubmit(values) {
        debug('onSubmit', values);
        const {initialValues, dispatch} = this.props;

        if(initialValues){
            dispatch(updateObject(values.id, values)).then(()=>{
                dispatch({
                    type: SELECT_OBJECT,
                    payload: null
                });
            });
        } else {
            dispatch(addObject(values));
        }
    };

    render() {
        const {initialValues, handleSubmit, reset, pristine, error} = this.props;
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
                <Form error={!!_.size(errors_list)} >
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
                               placeholder='Choose the owner of this object' required={true} width={16} label="Owner"
                               options={
                                   _.map(this.props.owners, owner => {
                                       return {key: owner.id, text: owner.name, value: owner.id}
                                   })
                               }
                               // normalize= {value => value.id}
                               // format={value => value && value.id ? value.id : value}
                               // format={value => value && value.hasOwnProperty('id') ? value.id : value}
                        />
                    </Form.Group>
                    <Message error header='Oops...' list={errors_list}/>
                    {/*<Button disabled={pristine || !!error} positive icon='save'*/}
                            {/*labelPosition='left' content='Save'/>*/}
                    {/*<Button icon='cancel' content='Close'*/}
                            {/*floated='right' onClick={() => {*/}
                        {/*this.props.setSelectedObject(null)*/}
                    {/*}}/>*/}
                </Form>

          </div>
        );
    }
}

ObjectForm.propTypes = {
    ...propTypes,
};
ObjectForm.defaultProps = {
    initialValues: null
};

const validations = {
    id: [required({msg: 'The field ID is required.'}),
        numericality({
            '<=': 32768,
            msg: 'Object ID cannot be greater than 32768 (OMA LwM2M v1.0).'
        })],
    shortname: [required({msg: 'Please provide a nice shortname for the object'})],
    owner: [required({msg: 'Please choose the owner of this object'})]
};

const mapStateToProps = (state) => {
    const obj = getSelectedObject(state);
    let initvals = null;
    if(obj){
        initvals = {...obj, owner: obj.owner.id}
    }
    return {
        formErrors: getFormSyncErrors('ObjectForm')(state),
        formMeta: getFormMeta('ObjectForm')(state),
        initialValues: initvals,
        owners: getOwners(state)
    };
};


function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({setSelectedObject}, dispatch)};
}

ObjectForm = reduxForm({
    validate: FormValidation(validations),
    form: "ObjectForm",
})(ObjectForm);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ObjectForm);