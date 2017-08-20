import React, { PropTypes } from 'react'
import {Checkbox, Form, Input} from 'semantic-ui-react'

export default function SemanticReduxFormField ({ input, meta: { touched, error, warning }, as: As = Input, ...props }) {
    function handleChange (e, { value }) {
        return input.onChange(value)
    }

    function handleCheckboxChange (e, { checked }) {
        return input.onChange(checked)
    }

    if(As === Form.Checkbox){
        const {value, ...clean_input} = input;
        return (
          <Form.Field control={As} {...clean_input} {...props}
                      onChange={handleCheckboxChange} checked={!!value}
          />
        )
    } else {
        const {value, ...clean_input} = input;
        const {format} = props;

        let clean_value = value;

        if(format){
            clean_value = format(value);
        }

        return (
          <Form.Field control={As} {...input} {...props}
                      onChange={handleChange} error={!!(touched && error)}
          />
        )
    }

}

SemanticReduxFormField.propTypes = {
    as: PropTypes.any,
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any
};