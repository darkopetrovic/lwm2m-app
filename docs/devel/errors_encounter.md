# Errors encountered with solution

## Cannot update during an existing state transition

It is likely that a function is called accidentally.

```
Warning: setState(...): Cannot update during an existing state transition (such as within `render` or another component's constructor). Render methods should be a pure function of props and state; constructor side-effects are an anti-pattern, but can be moved to `componentWillMount`.

```

Exemple of issue:

```js
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(setSelectedObject, dispatch);
};
```

Must be:

```js
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({setSelectedObject}, dispatch);
};
```