import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobResults from '../JobResults'
import UserProfile from '../UserProfile'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsPage extends Component {
  state = {
    jobsList: [],
    userProfile: [],
    salaryOption: '',
    employmentType: [],
    searchInput: '',
    jobsApiStatus: apiConstants.initial,
    userApiStatus: apiConstants.initial,
  }

  componentDidMount = () => {
    this.getJobsList()
    this.getUserProfile()
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiConstants.inProgress})
    const {employmentType, salaryOption, searchInput} = this.state
    // const employmentTypeOptions = employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryOption}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobsList: updatedData,
        jobsApiStatus: apiConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiConstants.failure})
    }
  }

  getUserProfile = async () => {
    this.setState({userApiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      // eslint-disable-next-line no-debugger
      debugger
      const profileDetails = fetchedData.profile_details
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        userApiStatus: apiConstants.success,
        userProfile: updatedData,
      })
    } else {
      this.setState({userApiStatus: apiConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  onChangeEmploymentType = event => {
    const {employmentType} = this.state
    const checkDuplicates = employmentType.filter(
      each => each === event.target.id,
    )
    if (checkDuplicates.length === 0) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.id],
        }),
        this.getJobsList,
      )
    } else {
      const removeDuplicates = employmentType.filter(
        each => each !== event.target.id,
      )
      this.setState({employmentType: removeDuplicates}, this.getJobsList)
    }
  }

  onChangeSalaryOptions = event => {
    this.setState({salaryOption: event.target.id}, this.getJobsList)
  }

  onClickRetryProfile = () => {
    this.getUserProfile()
  }

  onClickRetryJobs = () => {
    this.getJobsList()
  }

  renderEmploymentTypeOptions = () => (
    <>
      <h1 className="types-of-employment">Type of Employment</h1>
      <ul className="employment-type-list">
        {employmentTypesList.map(each => (
          <li
            className="employment-type-options-item"
            key={each.employmentTypeId}
          >
            <input
              type="checkbox"
              value={each.employmentTypeId}
              id={each.employmentTypeId}
              onChange={this.onChangeEmploymentType}
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </>
  )

  renderSalaryRangeOptions = () => (
    <>
      <h1 className="salary-range">Salary Range</h1>
      <ul className="salary-options-list">
        {salaryRangesList.map(each => (
          <li className="salary-range-option-item" key={each.salaryRangeId}>
            <input
              type="radio"
              name="option"
              id={each.salaryRangeId}
              onChange={this.onChangeSalaryOptions}
            />
            <label htmlFor={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </>
  )

  renderProfileOptions = () => {
    const {userApiStatus, userProfile} = this.state
    return (
      <>
        <div className="user-profile-container">
          <UserProfile
            onClickRetry={this.onClickRetryProfile}
            userDetails={userProfile}
            userApiStatus={userApiStatus}
          />
        </div>
        <div className="employment-type-container">
          {this.renderEmploymentTypeOptions()}
        </div>
        <div className="salary-range-container">
          {this.renderSalaryRangeOptions()}
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="oops">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobsView = () => {
    const {jobsList} = this.state
    const noJobs = jobsList.length === 0
    return noJobs ? (
      <div className="no-results-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-results-img"
        />
        <h1 className="no-jobs-found">No Jobs Found</h1>
        <p className="could-not-find">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    ) : (
      <ul className="jobs-list-container">
        {jobsList.map(each => (
          <JobResults details={each} key={each.id} />
        ))}
      </ul>
    )
  }

  getJobsStatus = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiConstants.success:
        return this.getJobsView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="profile-options-container">
            {this.renderProfileOptions()}
          </div>
          <div className="job-results-container">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                className="search-input-field"
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default JobsPage
