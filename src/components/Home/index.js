import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home-bg-container">
    <Header />
    <div className="home-bottom-container">
      <h1 className="home-heading">
        Find The Job That
        <br /> Fits Your Life
      </h1>
      <p className="home-description">
        Millions of people are searching for jobs, salary
        <br /> information, company reviews. Find the job that fits your <br />
        abilities and potential.
      </p>
      <Link to="/jobs">
        <button className="find-jobs-button" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
