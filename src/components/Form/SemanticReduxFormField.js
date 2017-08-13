import React, { PropTypes } from 'react'
import { Form, Input } from 'semantic-ui-react'

export default function SemanticReduxFormField ({ input, meta: { touched, error, warning }, as: As = Input, ...props }) {
    function handleChange (e, { value }) {
        return input.onChange(value)
    }
    return (
      <Form.Field control={As} {...input} {...props} onChange={handleChange} error={!!(touched && error)} />
    )
}

SemanticReduxFormField.propTypes = {
    as: PropTypes.any,
    input: PropTypes.any,
    label: PropTypes.any,
    meta: PropTypes.any
};