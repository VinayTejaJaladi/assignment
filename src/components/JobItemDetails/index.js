import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    similarJobs: [],
    jobDetails: {},
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      const updatedSimilarJobs = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const updatedSKills = jobDetails.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const updatedLifeAtCompany = {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      }
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: updatedSKills,
        lifeAtCompany: updatedLifeAtCompany,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }

      this.setState({
        similarJobs: updatedSimilarJobs,
        jobDetails: updatedJobDetails,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getJobItemDetails()
  }

  renderFailureView = () => (
    <div className="job-details-failure-view">
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
        onClick={this.onClickRetry}
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

  renderSuccessView = () => {
    const {similarJobs, jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails
    return (
      <>
        <Header />
        <div className="success-view-container">
          <div className="current-job-container">
            <div className="logo-title-rating">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-rating">
                <h1 className="title">{title}</h1>
                <div className="rating-container">
                  <AiFillStar color="#fbbf24" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-type-package">
              <div className="location-type">
                <div className="location-container">
                  <MdLocationOn color="white" />
                  <p className="location">{location}</p>
                </div>
                <div className="type-container">
                  <BsBriefcaseFill color="white" />
                  <p className="current-job-employment-type">
                    {employmentType}
                  </p>
                </div>
              </div>
              <p className="package">{packagePerAnnum}</p>
            </div>
            <div className="description-container">
              <div className="description-visit-container">
                <h1 className="job-description-heading">Description</h1>
                <a className="visit-link" href={companyWebsiteUrl}>
                  Visit <BiLinkExternal className="external-link-icon" />
                </a>
              </div>
              <p className="job-description-para">{jobDescription}</p>
            </div>
            <div className="skills-container">
              <h1 className="skill-heading">Skills</h1>
              <ul className="skills-list">
                {skills.map(each => (
                  <li className="skill-item" key={each.name}>
                    <img
                      src={each.imageUrl}
                      alt={each.name}
                      className="skill-logo-img"
                    />
                    <h1 className="skill-name">{each.name}</h1>
                  </li>
                ))}
              </ul>
            </div>
            <div className="life-at-company-container">
              <div className="lac-left-container">
                <h1 className="lac-heading">Life At Company</h1>
                <p className="lac-description">{lifeAtCompany.description}</p>
              </div>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="lac-img"
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {similarJobs.map(each => (
              <li className="similar-jobs-item" key={each.id}>
                <div className="similar-logo-title-rating">
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                    className="similar-company-logo"
                  />
                  <div className="similar-title-location">
                    <h1 className="similar-job-title">{each.title}</h1>
                    <div className="similar-rating-container">
                      <AiFillStar color="#fbbf24" />
                      <p className="similar-rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="similar-description-container">
                  <h1 className="similar-description-heading">Description</h1>
                  <p className="similar-description">{each.jobDescription}</p>
                </div>
                <div className="similar-type-location">
                  <div className="similar-job-location-container">
                    <MdLocationOn color="white" />
                    <p className="similar-job-location">{each.location}</p>
                  </div>
                  <div className="similar-type-container">
                    <BsBriefcaseFill color="white" />
                    <p className="similar-type">{each.employmentType}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default JobItemDetails
