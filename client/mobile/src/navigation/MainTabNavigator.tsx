import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

interface ITabIconProps {
  name: string;
  focused: boolean;
}

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: (props: ITabIconProps) => (
    <TabBarIcon
      focused={props.focused}
      name={'home'}
    />
  )
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: (props: ITabIconProps) => (
      <TabBarIcon
          focused={props.focused}
      name={'link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: (props: ITabIconProps) => (
      <TabBarIcon
          focused={props.focused}
      name={'wrench'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
}, {
  tabBarOptions: { style: { backgroundColor: '#000' }}
});
