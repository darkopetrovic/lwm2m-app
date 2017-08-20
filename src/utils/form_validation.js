import _ from 'lodash';


export const FormValidation = validations => (values, props) => {

    const errors = {};
    for (let field in validations) {
        let value = values[field];
        errors[field] = validations[field].map(validateField => {
            return validateField(value, values)
        }).find(x => x)
    }

    let errors_list = [];
    _.each(errors, error => {
        if(error){
            errors_list.push(error);
        }
    });

    if(_.size(errors_list)){
        errors._error = errors_list;
    }

    return errors
};