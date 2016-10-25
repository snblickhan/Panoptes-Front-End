import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactSwipe from 'react-swipe'
import animatedScrollTo from 'animated-scrollto'
import keydown from 'react-keydown'

class StepThrough extends Component {
  constructor(props) {
    super(props);
    this.goPrevious = this.goPrevious.bind(this);
    this.goNext = this.goNext.bind(this);
    this.goTo = this.goTo.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.state = {
      render: false,
      step: props.defaultStep,
    };
  }

  componentDidMount() {
    this.refs.swiper.swipe.setup();
  }

  componentWillReceiveProps({ keydown }) {
    if (keydown.event) {
      switch (keydown.event.which) {
        case 37:
          this.goPrevious();
          break;
        case 39:
          this.goNext();
          break;
      }
    }
  }

  goPrevious() {
    this.refs.swiper.swipe.prev();
    this.handleScroll();
  }

  goNext() {
    this.refs.swiper.swipe.next();
    this.handleScroll();
  }

  goTo(index) {
    this.refs.swiper.swipe.slide(index);
    this.handleScroll();
  }

  handleStep(total, index) {
    this.setState({
      step: (index % total + total) % total,
    });
  }

  handleScroll() {
    const reactSwipeNode = ReactDOM.findDOMNode(this.refs.swiper);
    setTimeout(animatedScrollTo(reactSwipeNode, reactSwipeNode.offsetTop, 0), 500);
  }

  renderControls(childrenCount) {
    if (childrenCount === 1) {
      return null;
    } else {
      const allSteps = Array.from(Array(childrenCount).keys());
      return (
        <div className="step-through-controls" style={{position: 'relative'}}>
          <button 
            type="button" 
            className="step-through-direction step-through-previous" 
            aria-label="Previous step" 
            title="Previous" 
            disabled={this.state.step === 0} 
            onClick={this.goPrevious}
          >
            ◀
          </button>
          
          <span className="step-through-pips">
            {allSteps.map(thisStep =>
              <label key={thisStep} className="step-through-pip" title="Step #{i + 1}">
                <input 
                  type="radio" 
                  className="step-through-pip-input" 
                  aria-label={`Step ${thisStep + 1} of ${childrenCount}`}
                  checked={thisStep === this.state.step} 
                  autoFocus={thisStep === this.state.step} 
                  onChange={this.goTo.bind(this, thisStep)}
                />
                <span className="step-through-pip-number">{thisStep + 1}</span>
              </label>
            )}
          </span>

          <button 
            type="button" 
            className="step-through-direction step-through-next" 
            aria-label="Next step" title="Next" 
            disabled={this.state.step === childrenCount - 1} 
            onClick={this.goNext}
          >
            ▶
          </button>

        </div>
      );
    }
  }

  render() {
    const childrenCount = React.Children.count(this.props.children);
    return (
      <div className="step-through" {...this.props}>
        <ReactSwipe 
          ref="swiper" 
          className="step-through-content" 
          startSlide={this.state.step} 
          continuous={false} 
          callback={this.handleStep.bind(this, childrenCount)}
        >
          {this.props.children}
        </ReactSwipe>
        {this.renderControls(childrenCount)}
      </div>
    );
  }
}

StepThrough.propTypes = {
  defaultStep: React.PropTypes.number,
}

StepThrough.defaultProps = {
  defaultStep: 0,
}

export default keydown(StepThrough);
