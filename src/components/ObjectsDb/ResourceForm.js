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
import {
    addResource, fetchObjects, SELECT_RESOURCE,
    updateResource
} from "../../actions/actions_objectdb";
import {getSelectedResource} from "../../selectors/selectors_resources";

const debug = makeDebugger('ResourceForm');

class ResourceForm extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        debug('componentWillMount()');
        this.props.fetchObjects();
    }

    componentWillUnmount() {
        debug('componentWillUnmount()');
    }

    onSubmit(values) {
        debug('onSubmit', values);
        const {initialValues, dispatch} = this.props;

        if(initialValues){
            dispatch(updateResource(values.id, values)).then(()=>{
                dispatch({
                    type: SELECT_RESOURCE,
                    payload: null
                });
            });
        } else {
            dispatch(addResource(values));
        }
    };

    render() {
        const {initialValues, handleSubmit} = this.props;
        const {formErrors, formMeta, objects} = this.props;
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



        let list_specifics_objects = _.map(objects, obj => {
            return {
                key: obj.id,
                text: obj.shortname + ' ('+obj.id+')',
                value: obj.id
            }
        });

        list_specifics_objects.unshift({key: -1, text: 'None', value: null});

        return (
          <div>

                <Form error={!!_.size(errors_list)}>
                    <Form.Group>
                        <Field component={SRFF} as={Form.Input} name='id'
                               placeholder='0 to 32768' required={true} width={4} label="Resource ID"
                        />
                        <Field component={SRFF} as={Form.Input} name='name'
                               placeholder='e.g: Name of the Resource' width={6} label="Name"
                        />
                        <Field component={SRFF} as={Form.Input} name='shortname'
                               placeholder='e.g: nameOfResource' required={true} width={6} label="Shortname"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Field component={SRFF} as={Form.Select} name='access'
                               placeholder='Read, Write, ...' required={true} width={4} label="Access"
                               options={[
                                     {key: 0, text: 'Read', value: 'R'},
                                     {key: 2, text: 'Write', value: 'W'},
                                     {key: 3, text: 'Read/Write', value: 'RW'},
                                     {key: 4, text: 'Execute', value: 'E'},
                                 ]}

                        />

                        <Field component={SRFF} as={Form.Select} name='type' label="Type"
                               placeholder='Integer, String, ...' required={true} width={4}
                               options={[
                                   {key: 0, text: 'Integer', value: 'Integer'},
                                   {key: 1, text: 'Float', value: 'Float'},
                                   {key: 2, text: 'String', value: 'String'},
                                   {key: 3, text: 'Time', value: 'Time'},
                                   {key: 4, text: 'Boolean', value: 'Boolean'},
                                   {key: 5, text: 'Execute', value: 'Execute'},
                                   {key: 6, text: 'Opaque', value: 'Opaque'},
                                   {key: 7, text: 'Objlnk', value: 'Objlnk'},
                               ]}
                        />

                        <Field component={SRFF} as={Form.Input} name='range'
                               placeholder='e.g: -20:120' width={5} label="Range"
                        />
                        <Field component={SRFF} as={Form.Input} name='unit'
                               placeholder='e.g: Cel' width={3} label="Unit"
                        />


                    </Form.Group>

                    <Form.Group>
                        <Field component={SRFF} as={Form.Checkbox} name='mandatory'
                               style={{paddingTop: '5px'}}
                               toggle width={3} label="Mandatory"

                        />
                        <Field component={SRFF} as={Form.Checkbox} name='multiple'
                               style={{paddingTop: '5px'}}
                               toggle width={3} label="Multiple instances"

                        />

                        <Field component={SRFF} as={Form.Dropdown} name='specific_object'
                               label="Specific object"
                               placeholder='Select to which object this resource belong to'
                               width={10} search selection
                               onChange={this.handleChangeObject}
                               searchInput={{ type: 'text' }}
                               selectOnBlur={false}
                               options={list_specifics_objects}
                               format={value => value && value.id ? value.id : value}

                        />
                    </Form.Group>

                    <Form.Group>
                        <Field component={SRFF} as={Form.Input} name='description'
                               placeholder='Description' width={16} label="Description"
                        />
                    </Form.Group>
                    <Message error header='Oops...' list={errors_list}/>
                </Form>

          </div>
        );
    }
}

ResourceForm.propTypes = {
    ...propTypes,
};
ResourceForm.defaultProps = {
    initialValues: null
};

const validations = {
    id: [required({msg: 'Resource ID is requiered'}),
        numericality({
            '<=': 32768,
            msg: 'ResourceID cannot be greater than 32768 (OMA LwM2M v1.0).'
        })],
    shortname: [required({msg: 'Please provide a shortname'})],
    access: [required({msg: 'Please select an access type.'})],
    type: [required({msg: 'Please choose a type for the resource'})],
};

const selector = formValueSelector('ResourceForm');
const mapStateToProps = (state, props) => {
    const mandatory = selector(state, 'mandatory');

    const res = getSelectedResource(state);
    let initvals = null;
    if(res){
        initvals = {...res, specific_object: res.specific_object && res.specific_object.id}
    }

    return {
        formErrors: getFormSyncErrors('ResourceForm')(state),
        formMeta: getFormMeta('ResourceForm')(state),
        objects: state.objects.list,
        initialValues: initvals,
        mandatory
    };
};


function mapDispatchToProps(dispatch) {
    return {dispatch, ...bindActionCreators({fetchObjects, updateResource, addResource}, dispatch)};
}

ResourceForm = reduxForm({
    validate: FormValidation(validations),
    form: "ResourceForm",
})(ResourceForm);

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ResourceForm);