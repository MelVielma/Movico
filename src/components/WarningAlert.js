import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

class WarningAlert extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isActive: true,
    }
  }

  hideAlert() {
    this.setState({
      isActive: false,
    });
  }

  render() {
    if (this.state.isActive) {
      return (
        <Alert variant="warning" onClose={() => this.hideAlert()} dismissible>
          <Alert.Heading>{this.props.title}</Alert.Heading>
          <p>{this.props.text}</p>
        </Alert>
      );
    }
    return <div/>
  }
}

export default WarningAlert;