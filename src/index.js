import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

class App extends Component {
  state = {
    count: 0
  };

  static getDerivedStateFromProps(props, state) {
    // window.localStorage.setItem("test", "test1234");
    // console.log(window.localStorage.getItem("test"))

    if (state.count < 0) {
      return { count: 0 };
    }
    return null;
  }

  initCountPromise = async () => Promise.resolve({ count: 0 });

  async componentDidMount() {
    const result = await this.initCountPromise();
    this.setState({
      ...result
    });
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return "snapshot";
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.count === 5) {
      const result = await this.initCountPromise();
      this.setState({
        ...result
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() {
    console.log("componentWillUnmount()");
  }

  addCount = () => {
    this.setState({
      count: this.state.count + 1
    })
  };

  decreaseCount = () => {
    this.setState({
      count: this.state.count - 1
    });
  };

  render() {
    console.log(this.state.count)
    if (this.state.count < 0) {
      throw new Error('Error!')
    }
    return (
      <div className="App">
        <h1>Life cycle test</h1>
        <Count count={this.state.count} />
        <button onClick={this.addCount}>Add</button>
        <button onClick={this.decreaseCount}>Decrease</button>
      </div>
    );
  }
}

class Count extends Component {
  state = {
    count: 0
  };

  static getDerivedStateFromProps(props, state) {
    if (props.count !== state.count) {
      return { count: props.count };
    }

    return null;
  }

  render() {
    return <p>{this.state.count}</p>;
  }
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // logErrorToMyService(error, info);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
