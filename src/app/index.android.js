/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';
// import Home from "./components/pages/home";
// import Sub from "./components/pages/subPage";
// let {NavigationBar}=Navigator;
import Bootstrap from "./bootstrap";


// const routes=[{
//   title:"Home",
//   index:0
// },{
//   title:"sub",
//   index:1
// }];

class app extends Component {
  render() {
    return (
        <Bootstrap/>
  );
  }
}


AppRegistry.registerComponent('app', () => app);
