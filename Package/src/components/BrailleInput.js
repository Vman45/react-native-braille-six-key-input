import React, { Component } from 'react'
import { Dimensions, Text, View } from 'react-native'
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'

import { COLORS } from '../config'
import _parseInt from 'lodash/parseInt'

const { /* width, */ height } = Dimensions.get('screen')

let counter = 0
let finalArray = []

class BrailleInput extends Component {
  state = {
    buttonIsTouched: false,
  }

  _onEndAllTouches = () => {
    this.props.onChange(finalArray)
    counter = 0
    finalArray = []
  }

  render() {
    const inputButtonStyle = [
      normalStyles.inputButton,
      responsiveStyles.inputButton,
    ]

    const inputButtonPressedStyle = [
      normalStyles.inputButtonPressed,
      responsiveStyles.inputButtonPressed,
    ]

    const inputButtonTextStyle = [
      normalStyles.inputButtonText,
      responsiveStyles.inputButtonText,
    ]

    return (
      <View
        style={
          this.state.buttonIsTouched
            ? [inputButtonStyle, inputButtonPressedStyle]
            : inputButtonStyle
        }
        onTouchStart={() => {
          this.setState({ buttonIsTouched: true })
          counter++
          finalArray.push(_parseInt(this.props.label))
        }}
        onTouchEnd={() => {
          this.setState({ buttonIsTouched: false })
          counter--
          if (counter === 0) {
            this._onEndAllTouches()
          }
        }}
      >
        <Text style={inputButtonTextStyle}>{this.props.label}</Text>
      </View>
    )
  }
}

export default BrailleInput

const normalStyles = ResponsiveStylesheet.create({
  inputButton: {
    alignItems: 'center',
    borderColor: COLORS.grey,
    borderRadius: height * 0.14 / 2,
    borderWidth: 3,
    height: height * 0.14,
    width: height * 0.14,
    justifyContent: 'center',
    marginTop: height * 0.00625,
    marginBottom: height * 0.00625,
    marginLeft: 10,
    marginRight: 10,
  },
  inputButtonPressed: {
    backgroundColor: COLORS.blue,
  },
  inputButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: height * 0.07,
  },
})

const responsiveStyles = ResponsiveStylesheet.createOriented({
  landscape: {
    inputButton: {
      borderRadius: height * 0.2 / 2,
      height: height * 0.2,
      width: height * 0.2,
    },
    inputButtonPressed: {},
    inputButtonText: { fontSize: height * 0.12 },
  },
  portrait: {
    inputButton: {},
    inputButtonPressed: {},
    inputButtonText: {},
  },
})
