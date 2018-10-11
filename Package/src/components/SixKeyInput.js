import React, { Component } from 'react'
import { Dimensions, Text, View } from 'react-native'
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import PropTypes from 'prop-types'

import BrailleInput from './BrailleInput'
import SpaceButton from './SpaceButton'
import Done from './Done'

import { COLORS, ifIphoneX, ifIPhone5s } from '../config'
import { unicodeBrailleCharacters } from '../brailleObj'

const { width } = Dimensions.get('screen')

export default class SixKeyInput extends Component {
  state = {
    testArray: [],
    dotCharArray: [],
  }

  layout = {}

  _onLayout = ({ nativeEvent: { layout } }) => {
    console.log('layout:', layout)
    if (typeof this.layout.x === 'undefined') {
      this.layout = layout
      console.log('this.layout:', this.layout)
    }
  }

  onKeyboardMounted = el => {
    this.keyboard = el
    setTimeout(() => {
      el.measure((x, y, w, h, pX, pY) => {
        console.log(`x: ${x}\ny: ${y}\nw: ${w}\npX: ${pX}\npY: ${pY}`)
        this.layout.x = pX
        this.layout.y = pY
      })
    })
  }

  _sortArray = (a, b) => {
    return a - b
  }

  _noArrayDuplicates = theArray =>
    theArray.filter((elem, pos, arr) => arr.indexOf(elem) === pos)

  _onChangeButtonsReleased = finalArray => {
    this.setState(
      {
        dotCharArray: this._noArrayDuplicates(finalArray.sort(this._sortArray)),
      },
      () => {
        // let arrResult = this.state.dotCharArray
        let brailleKey = this.state.dotCharArray.join('')
        let brailleChar = unicodeBrailleCharacters[brailleKey].char
        // console.log(newBrailleChar)
        // let brailleChar = _findKey(brailleCharacters, (value, key) => {
        //   return _isEqual(arrResult, value)
        // })
        if (brailleChar === undefined || brailleChar === null) {
          brailleChar = ''
        }
        this.props.onChange(brailleChar)
      }
    )
  }

  render() {
    const grandparentContainerStyle = [
      normalStyles.grandparentContainer,
      responsiveStyles.grandparentContainer,
    ]
    const parentContainerStyle = [
      normalStyles.parentContainer,
      responsiveStyles.parentContainer,
    ]
    const spaceButtonStyle = [
      normalStyles.spaceButton,
      responsiveStyles.spaceButton,
    ]
    const colContainerLeftStyle = [
      normalStyles.colContainerLeft,
      responsiveStyles.colContainerLeft,
    ]
    const colContainerRightStyle = [
      normalStyles.colContainerRight,
      responsiveStyles.colContainerRight,
    ]

    return (
      <View style={grandparentContainerStyle}>
        <View style={parentContainerStyle}>
          {/* Done has an "onDone" prop that will be handled in the app where you in import this package. */}
          <Done
            onDone={this.props.onDone}
            onClear={this.props.onClear}
            onDelete={this.props.onDelete}
          />
          <View style={rowContainerStyle}>
            <View style={colContainerLeftStyle}>
              {choices.slice(0, 3).map((choice, i) => (
                <BrailleInput
                  label={choice}
                  onChange={this._onChangeButtonsReleased}
                  key={i}
                  onTouchStart={
                    this.props.onTouchStartFunctions
                      ? this.props.onTouchStartFunctions[choice - 1]
                      : null
                  }
                  onTouchEnd={
                    this.props.onTouchEndFunctions
                      ? this.props.onTouchEndFunctions[choice - 1]
                      : null
                  }
                />
              ))}
            </View>
            <View>
              <SpaceButton
                style={spaceButtonStyle}
                onChange={this.props.onChange}
              />
            </View>
            <View style={colContainerRightStyle}>
              {choices.slice(3, 6).map((choice, i) => (
                <BrailleInput
                  label={choice}
                  onChange={this._onChangeButtonsReleased}
                  key={i}
                  onTouchStart={
                    this.props.onTouchStartFunctions
                      ? this.props.onTouchStartFunctions[choice - 1]
                      : null
                  }
                  onTouchEnd={
                    this.props.onTouchEndFunctions
                      ? this.props.onTouchEndFunctions[choice - 1]
                      : null
                  }
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const normalStyles = ResponsiveStylesheet.create({
  grandparentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  parentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 2,
    borderTopColor: COLORS.black,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    padding: ifIPhone5s(8, 10),
  },
  rowContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spaceButton: {},
  colContainerLeft: {
    marginLeft: ifIphoneX(30, 10),
    marginBottom: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  colContainerRight: {
    marginRight: ifIphoneX(30, 10),
    marginBottom: 5,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
})

const responsiveStyles = ResponsiveStylesheet.createOriented({
  landscape: {
    grandparentContainer: {
      height: '78%',
    },
    parentContainer: {
      padding: 20,
    },
    rowContainer: {},
    spaceButton: {},
    colContainerLeft: {
      marginRight: width * 0.17,
    },
    colContainerRight: {
      marginLeft: width * 0.17,
    },
  },
  portrait: {
    grandparentContainer: {},
    parentContainer: {},
    rowContainer: {},
    spaceButton: {},
    colContainerLeft: {},
    colContainerRight: {},
  },
})

SixKeyInput.propTypes = {
  onDone: PropTypes.func,
  onDelete: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onTouchStartFunctions: PropTypes.arrayOf(PropTypes.func),
  onTouchEndFunctions: PropTypes.arrayOf(PropTypes.func),
}
