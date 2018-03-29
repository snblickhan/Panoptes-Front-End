import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function shouldInputBeChecked(annotationValue, index, type) {
  if (type === 'radio') {
    return index === annotationValue;
  }

  if (type === 'checkbox') {
    return (annotationValue && annotationValue.length > 0) ? annotationValue.includes(index) : false;
  }

  return false;
}

export const StyledTaskInput = styled.input.attrs({
  autoFocus: props => props.index === props.annotation.value,
  checked: props => shouldInputBeChecked(props.annotation.value, props.index, props.type),
  name: props => props.name,
  type: props => props.type,
  value: props => props.index
})`
  opacity: 0.01;
  position: absolute;
`;

// Radio or Checkbox
// Using, visibility: hidden or display: none breaks accessibility. This keeps the buttons keyboard accessibile,
// but hides the actual radio or checkbox
export default function TaskInput(props) {
  return (
    <StyledTaskInput
      annotation={props.annotation}
      index={props.index}
      name={props.name}
      onChange={props.onChange}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      type={props.type}
    />
  );
}

TaskInput.defaultProps = {
  name: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

TaskInput.propTypes ={
  annotation: PropTypes.shape({
    _key: PropTypes.number,
    task: PropTypes.string,
    // PropTypes.object for the default value of null
    value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number, PropTypes.object])
  }).isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.string.isRequired
};

