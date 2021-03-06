import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { deleteResult, getData } from '../../actions/help'
import DisplayResultContainer from './DisplayResultContainer'

/**
 * @package     Gravity PDF
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       5.2
 */

/**
 * Handles the grunt work for our Help Page Search Input (API calls, display, state ect)
 *
 * @since 5.2
 */
export class HelpContainer extends Component {

  /**
   *
   * @since 5.2
   */
  static propTypes = {
    getData: PropTypes.func,
    deleteResult: PropTypes.func,
    loading: PropTypes.bool,
    helpResult: PropTypes.array,
    error: PropTypes.string
  }

  /**
   * Initialize component state
   *
   * @type {{searchInput: string, loading: boolean}}
   *
   * @since 5.2
   */
  constructor (props) {
    super(props)
    this.state = {
      searchInput: ''
    }

    this.searchInputLength = debounce(this.searchInputLength, 400)
  }

  /**
   * Handle onChange Event for the Search Input
   *
   * @param event
   *
   * @since 5.2
   */
  onHandleChange = event => {
    // Set loading to true
    this.setState({ searchInput: event.target.value })
    // Set searchInput state value
    this.searchInputLength(event.target.value)
  }

  /**
   * Check for Search Input length and pass to Redux Action
   *
   * @since 5.2
   */
  searchInputLength = data => {
    if (data.length > 3) {
      /* Request API call */
      this.props.getData(data)
    } else {
      /* Call deleteResult into Redux Action */
      this.props.deleteResult()
    }
  }

  /**
   * Renders Search Input and DisplayResultContainer Component UI
   *
   * @since 5.2
   */
  render () {
    const { searchInput } = this.state
    const { loading, helpResult, error } = this.props

    return (
      <>
        <input
          type="text"
          placeholder={'  ' + GFPDF.searchPlaceholder}
          id="search-help-input"
          name="searchInput"
          value={searchInput}
          onChange={this.onHandleChange}
        />
        <DisplayResultContainer
          searchInput={this.state.searchInput}
          loading={loading}
          helpResult={helpResult}
          error={error}
        />
      </>
    )
  }
}

/**
 * Map Redux state to props
 *
 * @param state
 * @returns {{loading: Boolean, helpResult: (object), error: String}}
 *
 * @since 5.2
 */
const mapStateToProps = state => ({
  loading: state.help.loading,
  helpResult: state.help.results,
  error: state.help.error
})

/**
 * Dispatch Redux actions as props
 *
 * @returns {{ getData, deleteResult }}
 *
 * @since 5.2
 */
export default connect(mapStateToProps, { getData, deleteResult })(HelpContainer)
