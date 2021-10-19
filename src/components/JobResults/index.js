import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {Link} from 'react-router-dom'

import './index.css'

const JobResults = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = details

  return (
    <Link to={`/jobs/${id}`} className="job-details-link">
      <li className="job-result-item">
        <div className="item-container-1">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating">
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <AiFillStar color="#fbbf24" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="item-container-2">
          <div className="location-type">
            <div className="location-container">
              <MdLocationOn />
              <p className="location">{location}</p>
            </div>
            <div className="type-container">
              <BsBriefcaseFill />
              <p className="list-item-employment-type">{employmentType}</p>
            </div>
          </div>
          <p className="package-per-annum">{packagePerAnnum}</p>
        </div>
        <div className="item-container-3">
          <h1 className="description-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobResults
