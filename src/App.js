import React, { Component } from 'react';
import template from './App.rt';

export class App extends Component {
  render() {
      console.log("Rendering");
      return template()
  }
}
