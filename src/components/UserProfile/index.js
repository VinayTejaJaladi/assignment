import Loader from 'react-loader-spinner'
import './index.css'

const UserProfile = props => {
  const {userDetails, userApiStatus, onClickRetry} = props

  const onRetry = () => {
    onClickRetry()
  }

  const renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  const renderFailureView = () => (
    <button type="button" className="retry-button" onClick={onRetry}>
      Retry
    </button>
  )

  const renderSuccessView = () => {
    const {name, profileImageUrl, shortBio} = userDetails
    return (
      <div className="user-profile">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  const renderUserProfile = () => {
    if (userApiStatus === 'SUCCESS') {
      return renderSuccessView()
    }
    if (userApiStatus === 'FAILURE') {
      return renderFailureView()
    }
    if (userApiStatus === 'IN_PROGRESS') {
      return renderLoadingView()
    }
    return null
  }

  return renderUserProfile()
}

export default UserProfile
